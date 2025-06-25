import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/db'
import Chat from '@/models/chat'
import { auth } from '@clerk/nextjs/server'

type Message = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const { messages, chatId }: { messages: Message[]; chatId?: string } = await req.json()
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    await connectToDB()
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Build Gemini API request payload
    const systemPrompt: Message = {
      role: 'system',
      content: 'You are a helpful AI assistant.'
    }

    // Filter messages so user messages are collapsed to single if consecutive
    const filteredMessages: Message[] = [systemPrompt]
    messages.forEach((msg, i) => {
      if (msg.role !== 'user') {
        filteredMessages.push(msg)
      } else {
        // Push user message only if previous is not user to avoid duplicates
        if (i === 0 || messages[i - 1].role !== 'user') filteredMessages.push(msg)
      }
    })

    // Prepare payload for Gemini API
    const payload = {
      contents: filteredMessages.map(msg => ({
        role: msg.role === 'system' ? 'model' : msg.role,
        parts: [{ text: msg.content }]
      })),
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7
      }
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', errorText)
      return NextResponse.json({ error: 'Gemini API failed' }, { status: 500 })
    }

    const data = await response.json()
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.'

    return NextResponse.json({ reply: replyText })
  } catch (error) {
    console.error('Internal server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
