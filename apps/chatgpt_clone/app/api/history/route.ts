import { connectToDB } from '../../../lib/db'
import Chat from '../../../models/chat'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectToDB()

    const chats = await Chat.find({}, '_id createdAt updatedAt').sort({ updatedAt: -1 })

    return NextResponse.json(chats)
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Error in /api/history:', error.message)
    } else {
      console.error('❌ Error in /api/history:', error)
    }

    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch chat history' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
