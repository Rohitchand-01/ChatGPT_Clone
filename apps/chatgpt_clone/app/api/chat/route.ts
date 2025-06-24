// app/api/chat/route.ts
import { streamText } from 'ai'; // Updated import
import { openai } from '@ai-sdk/openai'; // Import the OpenAI provider
import OpenAI from 'openai'; // Keep this if you need the OpenAI client for other uses, but 'openai' from @ai-sdk/openai is generally preferred for model calls
import { connectToDB } from './../../lib/db';
import Chat from '../../models/chat';

export const runtime = 'edge';

// Initialize the AI SDK's OpenAI provider
// The API key is automatically picked up from process.env.OPENAI_API_KEY
const openaiModel = openai('gpt-4-turbo');

// If you still need the direct OpenAI client for non-streaming calls or other API interactions, keep this:
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  // Extract messages and chatId from the request body
  const { messages, chatId } = await req.json();

  // Connect to the MongoDB database
  await connectToDB();

  try {
    // Handle chat saving/updating in the database
    if (chatId && messages) {
      // If chatId exists, update the existing chat with new messages and update timestamp
      await Chat.findByIdAndUpdate(chatId, {
        $set: { updatedAt: new Date() },
        // Push only the last two messages (user input and AI response will be added by the client after stream completes)
        // Note: You might want to adjust this logic depending on how you structure your message saving.
        // Usually, the streaming response is appended on the client side, and then the full exchange is saved.
        // For simple chat, often just the user message is saved here, and the AI's full response after it completes.
        // If you save the streaming parts, you'd need more complex logic.
        // For now, let's assume `messages` here only contains the *current* turn's messages (e.g., just the user's latest prompt).
        // If `messages` already includes the AI's partial responses, then `slice(-2)` might be what you intend.
        // Consider saving only the user's message here and the AI's full response after the stream finishes on the client.
        $push: { messages: { $each: messages.slice(-2) } },
      });
    } else {
      // If no chatId, create a new chat
      // Again, consider if 'messages' here should only be the initial user message.
      await Chat.create({ messages });
    }

    // Use the new `streamText` function from the AI SDK
    const result = await streamText({
      model: openaiModel, // Use the AI SDK's OpenAI model instance
      messages: messages, // Pass the messages to the model
    });

    // Return the streaming text response using the new method
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error in chat API route:', error);
    // Return an appropriate error response
    return new Response(JSON.stringify({ error: 'Failed to process chat request.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
