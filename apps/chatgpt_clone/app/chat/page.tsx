'use client'

import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'
import LayoutWrapper from '../components/LayoutWrapper'

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasStartedChat, setHasStartedChat] = useState(false)
  const [animatingToBottom, setAnimatingToBottom] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (animatingToBottom) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [animatingToBottom])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    if (!hasStartedChat) {
      setAnimatingToBottom(true)
      setTimeout(() => {
        setHasStartedChat(true)
        setAnimatingToBottom(false)
      }, 300) // faster motion match
    }

    const newUserMessage = { role: 'user', content: input }
    const updatedMessages = [...messages, newUserMessage]

    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chats', {
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

  const shouldCenterInput = !hasStartedChat

  return (
    <LayoutWrapper>
      <div className='flex flex-col h-full bg-[#262626] text-white relative overflow-x-hidden'>
        <div className='flex-grow min-h-0'>
          <div
            ref={scrollContainerRef}
            className='h-full overflow-y-auto px-4 md:px-6 py-6 space-y-4 pb-32'
          >
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}

            {isLoading && (
              <div className="flex items-start gap-3 max-w-2xl mx-auto">
                <div className="w-3 h-3 mt-2 rounded-full bg-white animate-pulse" />
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        <AnimatePresence>
          {shouldCenterInput && (
            <motion.div
              key="centerInput"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
              className='absolute inset-0 flex items-center justify-center z-10 bg-[#262626] overflow-hidden'
            >
              <div className='max-w-3xl w-full px-4 max-w-full'>
                <ChatInput
                  className='w-full px-4 py-2 bg-[#333333] rounded-lg'
                  input={input}
                  onChange={e => setInput(e.target.value)}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!shouldCenterInput && !animatingToBottom && (
          <motion.div
            key="bottomInput"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 60, damping: 18 }}
            className='sticky bottom-0 bg-[#262626] px-4 pb-4 z-10'
          >
            <div className='max-w-3xl mx-auto flex items-center justify-center'>
              <ChatInput
                className='w-full px-4 py-2 bg-[#333333] rounded-lg'
                input={input}
                onChange={e => setInput(e.target.value)}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
          </motion.div>
        )}
      </div>
    </LayoutWrapper>
  )
}
