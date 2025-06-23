// app/api/chat/route.ts
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { connectToDB } from '@/lib/db';
import Chat from '@/models/Chat';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { messages, chatId } = await req.json();

  await connectToDB();

  if (chatId && messages) {
    await Chat.findByIdAndUpdate(chatId, {
      $set: { updatedAt: new Date() },
      $push: { messages: { $each: messages.slice(-2) } },
    });
  } else {
    await Chat.create({ messages });
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    stream: true,
    messages,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
