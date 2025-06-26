import { connectToDB } from '@/lib/db'
import Chat from '@/models/chat'
import { getAuth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

type Message = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// GET: Fetch chats only if user is logged in
export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req)

    if (!userId) {
      console.log('[GET] No userId found — returning empty list')
      return NextResponse.json([], { status: 200 })
    }

    await connectToDB()
    console.log('[GET] DB connected')

    const chats = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .select('_id title createdAt')

    console.log('[GET] Fetched chats count:', chats.length)

    return NextResponse.json(chats)
  } catch (err) {
    console.error('[GET /api/chats] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 })
  }
}

// POST: Accepts messages from anyone (logged in or not)
export async function POST(req: NextRequest) {
  try {
    console.log('[POST] Incoming request')

    const body = await req.json()
    console.log('[POST] Body:', body)

    const { messages, chatId }: { messages: Message[]; chatId?: string } = body

    if (!process.env.GOOGLE_API_KEY) {
      console.error('[POST] Missing GOOGLE_API_KEY')
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!messages || !Array.isArray(messages)) {
      console.error('[POST] Invalid messages format:', messages)
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { userId } = getAuth(req)
    console.log('[POST] userId:', userId)

    await connectToDB()
    console.log('[POST] DB connected')

    if (userId && chatId) {
      console.log('[POST] Updating existing chat:', chatId)
      await Chat.findByIdAndUpdate(chatId, {
        $set: { updatedAt: new Date() },
        $push: { messages: { $each: messages.slice(-2) } }
      })
    } else if (userId) {
      const title = messages[0]?.content?.slice(0, 30) || 'New Chat'
      console.log('[POST] Creating new chat with title:', title)
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

    console.log('[POST] Sending payload to Gemini')

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    )

    console.log('[POST] Gemini response status:', response.status)

    if (!response.ok) {
      const errText = await response.text()
      console.error('[POST] Gemini API failed:', errText)
      return new Response(JSON.stringify({ error: 'Gemini API failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const data = await response.json()
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text
    console.log('[POST] Gemini response text:', generatedText)

    return new Response(generatedText || 'No response from Gemini.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })
  } catch (err) {
    console.error('[POST /api/chats] Error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
