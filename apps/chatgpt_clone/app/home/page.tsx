'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ChatInput from '../components/ChatInput'
import { useChatStore } from '../lib/chatstore'

export default function HomePage() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const { addMessage } = useChatStore()

  const prompts = [
    "What's on the agenda today?",
    'Ready when you are.',
    "What's on your mind today?",
    'How can I help?',
    'Hey, Ready to dive in?',
  ]
  const [randomPrompt, setRandomPrompt] = useState('')

  useEffect(() => {
    const index = Math.floor(Math.random() * prompts.length)
    setRandomPrompt(prompts[index])
  }, [])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (!input.trim()) return

    addMessage({ role: 'user', content: input.trim() }) // store first message
    router.push('/chat')
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#262626] text-white">
      <div className="text-center mb-10 text-[30px]">{randomPrompt}</div>
      <ChatInput
        className="w-full max-w-xl"
        input={input}
        onChange={(e) => setInput(e.target.value)}
        onSubmit={handleSubmit}
        isLoading={false}
      />
    </div>
  )
}
