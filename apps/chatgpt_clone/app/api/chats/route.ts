import { connectToDB } from '@/lib/db'
import Chat from '@/models/chat'
import { getAuth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

type Message = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req)

  if (!userId) {
    return NextResponse.json([], { status: 200 }) // Return empty if no user
  }

  try {
    await connectToDB()
    const chats = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .select('_id title createdAt')
    return NextResponse.json(chats)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages, chatId }: { messages: Message[]; chatId?: string } = await req.json()

    if (!process.env.GOOGLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { userId } = getAuth(req)

    await connectToDB()

    if (userId && chatId) {
      await Chat.findByIdAndUpdate(chatId, {
        $set: { updatedAt: new Date() },
        $push: { messages: { $each: messages.slice(-2) } }
      })
    } else if (userId) {
      const title = messages[0]?.content?.slice(0, 30) || 'New Chat'
      await Chat.create({ messages, title, userId })
    }

    const systemPrompt: Message = {
      role: 'system',
      content: 'You are a helpful AI assistant.'
    }

    const fullMessages: Message[] = [systemPrompt, ...messages.filter((msg, i, arr) => {
      if (msg.role !== 'user') return true
      if (i === 0) return true
      return arr[i - 1].role !== 'user'
    })]

    const payload = {
      contents: fullMessages.map((msg) => ({
        role: msg.role === 'system' ? 'model' : msg.role,
        parts: [{ text: msg.content }]
      })),
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7
      }
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    )

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Gemini API failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const data = await response.json()
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text

    return new Response(generatedText || 'No response from Gemini.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
