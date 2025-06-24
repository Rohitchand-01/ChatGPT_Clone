import { streamText } from 'ai'
import { google } from '@ai-sdk/google'
import { connectToDB } from '../../lib/db'
import Chat from '../../models/chat'

const geminiModel = google('models/gemini-1.5-flash')

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json()

    if (!process.env.GOOGLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    await connectToDB()

    if (chatId) {
      await Chat.findByIdAndUpdate(chatId, {
        $set: { updatedAt: new Date() },
        $push: { messages: { $each: messages.slice(-2) } },
      })
    } else {
      await Chat.create({ messages })
    }

    const systemPrompt = {
      role: 'system',
      content: 'You are a helpful AI assistant.',
    }

    const cleanedMessages = messages.filter((msg, i, arr) => {
      if (msg.role !== 'user') return true
      if (i === 0) return true
      return arr[i - 1].role !== 'user'
    })

    const fullMessages = [systemPrompt, ...cleanedMessages]

    console.log('Sending messages to Gemini (direct API call):', JSON.stringify(fullMessages, null, 2))

    const apiKey = process.env.GOOGLE_API_KEY
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
    
    let directChatHistory = fullMessages.map(msg => ({
      role: msg.role === 'system' ? 'model' : msg.role,
      parts: [{ text: msg.content }]
    }))
    
    const latestUserMessage = messages[messages.length - 1]
    if (latestUserMessage && latestUserMessage.role === 'user' && !directChatHistory.some(m => m.parts[0].text === latestUserMessage.content)) {
        directChatHistory.push({ role: 'user', parts: [{ text: latestUserMessage.content }] })
    }

    const payload = {
      contents: directChatHistory,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    }

    try {
      const directResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const directResult = await directResponse.json()
      console.log('Direct Gemini API Raw Response:', JSON.stringify(directResult, null, 2))

      if (directResult.candidates && directResult.candidates.length > 0 &&
          directResult.candidates[0].content && directResult.candidates[0].content.parts &&
          directResult.candidates[0].content.parts.length > 0) {
        const directText = directResult.candidates[0].content.parts[0].text
        console.log('Direct Gemini API Generated Text:', directText)
        return new Response(directText, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
      } else {
        console.warn('Direct Gemini API returned no valid content.', directResult)
        return new Response(JSON.stringify({ error: 'Direct API call empty response. Check server logs for details.' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
      }
    } catch (directCallError: any) {
      console.error('Error during direct Gemini API call:', directCallError?.message || directCallError)
      return new Response(JSON.stringify({ error: 'Direct API call failed. Check server logs for network issues.' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }

  } catch (error: any) {
    console.error('Error in /api/chat:', error?.message || error)
    return new Response(JSON.stringify({ error: 'Failed to process chat request.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
