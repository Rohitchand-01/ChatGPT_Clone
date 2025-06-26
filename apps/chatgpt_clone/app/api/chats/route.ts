import { connectToDB } from '@/lib/db'
import Chat from '@/models/chat'
import { getAuth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

type Message = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req)
    if (!userId) return NextResponse.json([], { status: 200 })

    await connectToDB()
    const chats = await Chat.find({ userId }).sort({ createdAt: -1 }).select('_id title createdAt')
    return NextResponse.json(chats)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req)
    const body = await req.json()
    const { message, chatId }: { message: Message; chatId?: string } = body

    if (!message || typeof message !== 'object') {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 })
    }

    await connectToDB()
    let chat

    // Step 1: Create or Update chat
    if (chatId) {
      chat = await Chat.findByIdAndUpdate(
        chatId,
        {
          $push: { messages: message },
          $set: { updatedAt: new Date() }
        },
        { new: true }
      )
    } else {
      const title = message.content.slice(0, 30) || 'New Chat'
      chat = await Chat.create({
        userId: userId || undefined, // allow guest chat
        title,
        messages: [message]
      })
    }

    // Step 2: AI reply
    const payload = {
      contents: [{
        role: 'user',
        parts: [{ text: message.content }]
      }],
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7
      }
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    )

    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ error: 'Gemini API failed', detail: errText }, { status: 500 })
    }

    const data = await res.json()
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '...'

    // Step 3: Save assistant reply
    if (chat?._id) {
      await Chat.findByIdAndUpdate(chat._id, {
        $push: { messages: { role: 'assistant', content: reply } }
      })
    }

    // Step 4: Return updated messages
    const updated = await Chat.findById(chat._id)

    return NextResponse.json({
      chatId: chat._id,
      messages: updated?.messages || []
    })
  } catch (err) {
    console.error('[POST /api/chats] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
