'use client'

import { useState, useRef, useLayoutEffect } from 'react'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'
import LayoutWrapper from '../components/LayoutWrapper'

export default function ChatPage () {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    const newUserMessage = { role: 'user', content: input }
    const updatedMessages = [...messages, newUserMessage]

    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      })

      const reply = await res.text()
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      console.error('❌ Chat error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LayoutWrapper>
      <div className='flex flex-col h-full bg-[#262626] text-white'>
        <div className='flex-grow min-h-0'>
          <div
            ref={scrollContainerRef}
            className='h-full overflow-y-auto px-4 md:px-6 py-6 space-y-4 pb-32'
          >
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        {messages.length === 0 && (
          <div className='text-center mb-10 text-lg'>Let's get started</div>
        )}
        <div className='w-full bg-[#262626] z-10 px-4 pb-4'>
          <div className='max-w-3xl mx-auto flex items-center justify-center'>
            <ChatInput
              className='w-full px-4 py-2 bg-[#333333] rounded-lg'
              input={input}
              onChange={e => setInput(e.target.value)}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
