// app/api/chat/route.ts
import { streamText } from 'ai'
import { google } from '@ai-sdk/google'
import { connectToDB } from './../../lib/db'
import Chat from '../../models/chat'

export const runtime = 'edge' // Important for Vercel deployment, but can cause issues locally if not configured properly

const geminiModel = google('models/gemini-pro')

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json()

    // 1. Environment Variable Check
    if (!process.env.GOOGLE_API_KEY) {
      console.error('❌ GOOGLE_API_KEY is not set in environment variables.')
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 2. Input Validation (already robust)
    if (!messages || !Array.isArray(messages)) {
      console.error('❌ Invalid messages format:', messages)
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 3. Database Connection
    await connectToDB()

    // 4. Mongoose Operations (Save/Update Chat)
    if (chatId) {
      await Chat.findByIdAndUpdate(chatId, {
        $set: { updatedAt: new Date() },
        $push: { messages: { $each: messages.slice(-2) } },
      })
    } else {
      await Chat.create({ messages })
    }

    // 5. Gemini AI Stream
    const result = await streamText({
      model: geminiModel,
      messages,
    })

    return result.toTextStreamResponse()
  } catch (error: any) {
    console.error('❌ Error in /api/chat:', error?.message || error) // This is where the actual server error is logged
    return new Response(JSON.stringify({ error: 'Failed to process chat request.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}