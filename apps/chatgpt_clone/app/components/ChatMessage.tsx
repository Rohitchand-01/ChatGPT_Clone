'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatMessage({ message }: any) {
  const isUser = message.role === 'user';

  return (
    <div className="w-full px-4 py-2">
      <div className={`max-w-3xl mx-auto flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`
            text-sm px-4 py-2 rounded-2xl break-words
            ${isUser ? 'bg-[#333333] text-white ml-auto' : 'bg-transparent text-white mr-auto'}
          `}
          style={{ maxWidth: '80%', whiteSpace: 'pre-wrap' }}
        >
          <div className="prose prose-sm dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
