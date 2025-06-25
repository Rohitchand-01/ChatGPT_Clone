'use client'

import { useState, useEffect, useRef } from 'react'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: newMessages }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) {
      console.error('Error: Response failed')
      setIsLoading(false)
      return
    }

    const assistantText = await res.text()

    setMessages((prev) => [...prev, { role: 'assistant', content: assistantText }])
    setIsLoading(false)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-full bg-[#262626] text-white">
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4">
        {messages.map((m, i) => (
          <ChatMessage key={i} message={m} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 0 && (
        <div className="text-center mb-10 text-lg">Let's get started</div>
      )}

      <div className="flex items-center justify-center px-4 pb-6">
        <ChatInput
          className="w-full max-w-xl"
          input={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
