// app/api/history/route.ts
import { connectToDB } from './../../lib/db';
import Chat from './../../models/chat';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectToDB();

  try {
    const chats = await Chat.find({}, '_id createdAt updatedAt').sort({ updatedAt: -1 });
    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
