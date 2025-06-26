// app/api/chats/[chatId]/route.ts
import { connectToDB } from '@/lib/db'
import Chat from '@/models/chat'
import { NextResponse } from 'next/server'

export async function GET(
  _: Request,
  { params }: { params: { chatId: string } }
) {
  await connectToDB()
  const chat = await Chat.findById(params.chatId)
  if (!chat) {
    return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
  }
  return NextResponse.json({ messages: chat.messages }, { status: 200 })
}
