import { connectToDB } from '@/lib/db'
import Chat from '@/models/chat'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages, chatId } = await req.json()

    if (!process.env.GOOGLE_API_KEY) {
      console.error('❌ GOOGLE_API_KEY not set in .env')
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!messages || !Array.isArray(messages)) {
      console.error('❌ Invalid messages payload:', messages)
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    try {
      await connectToDB()

      if (chatId) {
        await Chat.findByIdAndUpdate(chatId, {
          $set: { updatedAt: new Date() },
          $push: { messages: { $each: messages.slice(-2) } },
        })
      } else {
        await Chat.create({ messages })
      }
    } catch (dbError: any) {
      console.error('❌ MongoDB error:', dbError?.message || dbError)
    }

    const systemPrompt = {
      role: 'system',
      content: 'You are a helpful AI assistant.',
    }

    const fullMessages = [systemPrompt, ...messages.filter((msg, i, arr) => {
      if (msg.role !== 'user') return true
      if (i === 0) return true
      return arr[i - 1].role !== 'user'
    })]

    const payload = {
      contents: fullMessages.map(msg => ({
        role: msg.role === 'system' ? 'model' : msg.role,
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      console.error('❌ Gemini API Error:', errText)
      return new Response(JSON.stringify({ error: 'Gemini API failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json()
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!generatedText) {
      console.warn('⚠️ Gemini response empty:', JSON.stringify(data, null, 2))
    }

    return new Response(generatedText || 'No response from Gemini.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (error: any) {
    console.error('❌ Fatal API Error:', error?.message || error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
