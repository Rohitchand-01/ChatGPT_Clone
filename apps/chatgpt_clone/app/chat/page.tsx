'use client'

import { useState, useEffect, useRef } from 'react'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!input.trim()) return

    console.log(' Sending user message:', input)

    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: newMessages }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok || !res.body) {
      console.error(' Error: Response failed or empty')
      setIsLoading(false)
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let assistantText = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      assistantText += chunk

      console.log('Assistant chunk:', chunk)

      setMessages((prev) => {
        const last = prev[prev.length - 1]
        if (last?.role === 'assistant') {
          return [...prev.slice(0, -1), { role: 'assistant', content: last.content + chunk }]
        } else {
          return [...prev, { role: 'assistant', content: chunk }]
        }
      })
    }

    console.log(' Final assistant message:', assistantText)
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
          onChange={(e) => setInput(e.target.value)}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
