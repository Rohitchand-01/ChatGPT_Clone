// lib/chatStore.ts
import { create } from 'zustand'

type Message = {
  id?: string
  role: 'user' | 'assistant' | 'system'
  content: string
}

type ChatStore = {
  messages: Message[]
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}))
