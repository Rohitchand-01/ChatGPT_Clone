import { notFound } from 'next/navigation'
import { connectToDB } from '@/lib/db'
import Chat from '@/models/chat'
import { format } from 'date-fns'
import LayoutWrapper from '../../components/LayoutWrapper'
import ChatMessage from '../../components/ChatMessage'

interface Props {
  params: { chatId: string }
}

export default async function ChatPage({ params }: Props) {
  const { chatId } = params

  await connectToDB()

  const chat = await Chat.findById(chatId).lean()

  if (!chat) return notFound()

  return (
    <LayoutWrapper>
      <div className="flex flex-col h-full bg-[#262626] text-white">
        <div className="flex-grow min-h-0 overflow-y-auto px-4 md:px-6 py-6 space-y-4 pb-32">
         

          {chat.messages.map((msg: any, index: number) => (
            <ChatMessage key={index} message={msg} />
          ))}
        </div>
      </div>
    </LayoutWrapper>
  )
}
