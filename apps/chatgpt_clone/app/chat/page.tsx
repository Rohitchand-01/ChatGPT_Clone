'use client'

import { useChat } from 'ai/react'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'
import { useEffect, useState } from 'react'
import { useChatStore } from '../lib/chatstore'

export default function ChatPage() {
  const { messages: storedMessages, setMessages, addMessage } = useChatStore()

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: baseSubmit,
    isLoading,
  } = useChat({
    api: '/api/chat',
    initialMessages: storedMessages,
    onFinish: (message) => addMessage(message),
  })

  const [showPrompt, setShowPrompt] = useState(messages.length === 0)

  useEffect(() => {
    setMessages(messages)
  }, [messages, setMessages])

  const handleSubmit = (e: any) => {
    setShowPrompt(false)
    baseSubmit(e)
  }

  return (
    <div className="flex flex-col h-full bg-[#262626] text-white">
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4">
        {messages.map((m, i) => (
          <ChatMessage key={i} message={m} />
        ))}
      </div>

      {showPrompt && messages.length === 0 && (
        <div className="text-center mb-10 text-lg">Let's get started</div>
      )}

      <div className="flex items-center justify-center px-4 pb-6">
        <ChatInput
          className="w-full max-w-xl"
          input={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
