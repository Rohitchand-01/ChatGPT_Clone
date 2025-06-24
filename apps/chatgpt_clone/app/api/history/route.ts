// app/api/history/route.ts
import { connectToDB } from './../../lib/db'
import Chat from './../../models/chat'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 1. Database Connection
    await connectToDB()

    // 2. Mongoose Query
    const chats = await Chat.find({}, '_id createdAt updatedAt').sort({ updatedAt: -1 })

    // 3. Successful Response
    return NextResponse.json(chats)
  } catch (error: any) {
    // 4. Error Handling
    console.error('❌ Error in /api/history:', error?.message || error)

    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch chat history' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}