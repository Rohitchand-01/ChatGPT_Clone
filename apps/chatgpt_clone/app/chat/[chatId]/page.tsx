import { notFound } from 'next/navigation'
import { connectToDB } from '@/lib/db'
import Chat from '@/models/chat'
import { format } from 'date-fns'

interface Props {
  params: { chatId: string }
}

export default async function ChatPage({ params }: Props) {
  const { chatId } = params

  await connectToDB()

  const chat = await Chat.findById(chatId).lean()

  if (!chat) return notFound()

  return (
    <div className="text-white p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-2">{chat.title || 'Untitled Chat'}</h1>
      <p className="text-sm text-gray-400">
        Created at: {format(new Date(chat.createdAt), 'dd MMM yyyy hh:mm a')}
      </p>

      <div className="mt-6 space-y-4">
        {chat.messages.map((msg: any, index: number) => (
          <div
            key={index}
            className={`p-4 rounded-md ${
              msg.role === 'user' ? 'bg-gray-800' : 'bg-[#2c2c2c]'
            }`}
          >
            <p className="text-xs text-gray-400 capitalize mb-1">{msg.role}</p>
            <p className="whitespace-pre-line">{msg.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
