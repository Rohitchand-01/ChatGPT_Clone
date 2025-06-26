import { connectToDB } from '@/lib/db'
import Chat from '@/models/chat'
import { getAuth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

type Message = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// GET: Fetch chats for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req)

    if (!userId) {
      return NextResponse.json([], { status: 200 })
    }

    await connectToDB()

    const chats = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .select('_id title createdAt')

    return NextResponse.json(chats)
  } catch (err) {
    console.error('[GET /api/chats] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 })
  }
}

// POST: Create a new chat or update existing one
export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req)
    const body = await req.json()
    const { messages, chatId }: { messages: Message[]; chatId?: string } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    await connectToDB()

    let chat

    if (userId && chatId) {
      chat = await Chat.findByIdAndUpdate(
        chatId,
        {
          $set: { updatedAt: new Date() },
          $push: { messages: { $each: messages.slice(-2) } }
        },
        { new: true }
      )
    } else if (userId) {
      const title = messages[0]?.content?.slice(0, 30) || 'New Chat'
      chat = await Chat.create({ messages, title, userId })
    }

    const systemPrompt: Message = {
      role: 'system',
      content: 'You are a helpful AI assistant.'
    }

    const fullMessages: Message[] = [
      systemPrompt,
      ...messages.filter((msg, i, arr) => {
        if (msg.role !== 'user') return true
        if (i === 0) return true
        return arr[i - 1].role !== 'user'
      })
    ]

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
      const errText = await response.text()
      return NextResponse.json({ error: 'Gemini API failed', details: errText }, { status: 500 })
    }

    const data = await response.json()
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (userId && chat?._id && generatedText) {
      await Chat.findByIdAndUpdate(chat._id, {
        $push: { messages: { role: 'assistant', content: generatedText } }
      })
    }

    return NextResponse.json({
      chatId: chat?._id?.toString(),
      response: generatedText || 'No response from Gemini.'
    })
  } catch (err) {
    console.error('[POST /api/chats] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
