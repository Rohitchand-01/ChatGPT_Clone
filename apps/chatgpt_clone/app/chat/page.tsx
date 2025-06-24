'use client';

import { useChat } from 'ai/react';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';

export default function ChatPage() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    api: '/api/chat',
  });

  return (
    <div className="flex flex-col h-full bg-[#262626]">
      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4">
        {messages.map((m, i) => (
          <ChatMessage key={i} message={m} />
        ))}
      </div>

      {/* Input */}
      <ChatInput
        input={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
