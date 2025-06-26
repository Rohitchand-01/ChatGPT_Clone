import { connectToDB } from '@/lib/db'
import Chat from '@/models/chat'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { chatId: string } }) {
  try {
    await connectToDB()
    const chat = await Chat.findById(params.chatId)
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 })

    return NextResponse.json({ messages: chat.messages })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load chat' }, { status: 500 })
  }
}
