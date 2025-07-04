'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FiCopy, FiCheck } from 'react-icons/fi'
import { PiCopyThin } from 'react-icons/pi'
import { AiOutlineLike } from 'react-icons/ai'
import { AiTwotoneLike } from 'react-icons/ai'
import { BiDislike } from 'react-icons/bi'
import { BiSolidDislike } from 'react-icons/bi'
import { IoVolumeMediumOutline } from 'react-icons/io5'
import { GoPencil } from 'react-icons/go'

type Message = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export default function ChatMessage ({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // revert after 2 seconds
    } catch (err) {
      console.error('❌ Failed to copy:', err)
    }
  }
  const handleLike = () => {
    setLiked(!liked)
  }

  const handleDislike = () => {
    setDisliked(!disliked)
  }

  return (
    <div className='w-full px-4 py-2'>
      <div
        className={`max-w-3xl mx-auto flex ${
          isUser ? 'justify-end' : 'justify-start'
        }`}
      >
        <div
          className={`
            text-sm px-4 py-2 rounded-2xl break-words
            ${
              isUser
                ? 'bg-[#333333] text-white ml-auto'
                : 'bg-transparent text-white mr-auto'
            }
          `}
          style={{ maxWidth: '80%', whiteSpace: 'pre-wrap' }}
        >
          <div className='prose prose-sm dark:prose-invert'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Copy button below assistant message */}
          <div className='flex justify-start'>
            {!isUser && (
              <div className='mt-2 flex justify-start hover:bg-[#333333] p-2 w-fit rounded-lg'>
                <button
                  onClick={handleCopy}
                  className='flex items-center gap-1 text-gray-400 hover:text-white text-xs'
                >
                  {copied ? (
                    <FiCheck className='w-5 h-5 text-white' />
                  ) : (
                    <PiCopyThin className='w-5 h-5' />
                  )}
                </button>
              </div>
            )}
            {!isUser && (
              <div className='mt-2 flex justify-start hover:bg-[#333333] p-2 w-fit rounded-lg'>
                <button
                  onClick={handleLike}
                  className='flex items-center gap-1 text-gray-400 hover:text-white text-xs'
                >
                  {liked ? (
                    <AiTwotoneLike className='w-5 h-5 text-white' />
                  ) : (
                    <AiOutlineLike className='w-5 h-5' />
                  )}
                </button>
              </div>
            )}
            {!isUser && (
              <div className='mt-2 flex justify-start hover:bg-[#333333] p-2 w-fit rounded-lg'>
                <button
                  onClick={handleDislike}
                  className='flex items-center gap-1 text-gray-400 hover:text-white text-xs'
                >
                  {disliked ? (
                    <BiSolidDislike className='w-5 h-5 text-white' />
                  ) : (
                    <BiDislike className='w-5 h-5' />
                  )}
                </button>
              </div>
            )}
            {!isUser && (
              <div className='mt-2 flex justify-start hover:bg-[#333333] p-2 w-fit rounded-lg'>
                <button
                  onClick={() => alert('Voice feature coming soon!')}
                  className='flex items-center gap-1 text-gray-400 hover:text-white text-xs'
                >
                  <IoVolumeMediumOutline className='w-6 h-6' />
                </button>
              </div>
            )}
            {!isUser && (
              <div className='mt-2 flex justify-start hover:bg-[#333333] p-2 w-fit rounded-lg'>
                <button
                  onClick={() => alert('Edit in canvas feature coming soon!')}
                  className='flex items-center gap-1 text-gray-400 hover:text-white text-xs'
                >
                  <GoPencil className='w-4 h-4' />
                </button>
              </div>
            )}
            {!isUser && (
              <div className='mt-2 flex justify-start hover:bg-[#333333] p-2 w-fit rounded-lg'>
                <button
                  onClick={() => alert('Feature coming soon!')}
                  className='flex items-center gap-1 text-gray-400 hover:text-white text-xs'
                >
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    xmlns='http://www.w3.org/2000/svg'
                    aria-label=''
                    className='-ms-0.5 icon'
                  >
                    <path d='M2.66821 12.6663V12.5003C2.66821 12.1331 2.96598 11.8353 3.33325 11.8353C3.70052 11.8353 3.99829 12.1331 3.99829 12.5003V12.6663C3.99829 13.3772 3.9992 13.8707 4.03052 14.2542C4.0612 14.6298 4.11803 14.8413 4.19849 14.9993L4.2688 15.1263C4.44511 15.4137 4.69813 15.6481 5.00024 15.8021L5.13013 15.8577C5.2739 15.9092 5.46341 15.947 5.74536 15.97C6.12888 16.0014 6.62221 16.0013 7.33325 16.0013H12.6663C13.3771 16.0013 13.8707 16.0014 14.2542 15.97C14.6295 15.9394 14.8413 15.8825 14.9993 15.8021L15.1262 15.7308C15.4136 15.5545 15.6481 15.3014 15.802 14.9993L15.8577 14.8695C15.9091 14.7257 15.9469 14.536 15.97 14.2542C16.0013 13.8707 16.0012 13.3772 16.0012 12.6663V12.5003C16.0012 12.1332 16.2991 11.8355 16.6663 11.8353C17.0335 11.8353 17.3313 12.1331 17.3313 12.5003V12.6663C17.3313 13.3553 17.3319 13.9124 17.2952 14.3626C17.2624 14.7636 17.1974 15.1247 17.053 15.4613L16.9866 15.6038C16.7211 16.1248 16.3172 16.5605 15.8215 16.8646L15.6038 16.9866C15.227 17.1786 14.8206 17.2578 14.3625 17.2952C13.9123 17.332 13.3553 17.3314 12.6663 17.3314H7.33325C6.64416 17.3314 6.0872 17.332 5.63696 17.2952C5.23642 17.2625 4.87552 17.1982 4.53931 17.054L4.39673 16.9866C3.87561 16.7211 3.43911 16.3174 3.13501 15.8216L3.01294 15.6038C2.82097 15.2271 2.74177 14.8206 2.70435 14.3626C2.66758 13.9124 2.66821 13.3553 2.66821 12.6663ZM9.33521 12.5003V4.9388L7.13696 7.13704C6.87732 7.39668 6.45625 7.39657 6.19653 7.13704C5.93684 6.87734 5.93684 6.45631 6.19653 6.19661L9.52954 2.86263L9.6311 2.77962C9.73949 2.70742 9.86809 2.66829 10.0002 2.66829C10.1763 2.66838 10.3454 2.73819 10.47 2.86263L13.804 6.19661C14.0633 6.45628 14.0634 6.87744 13.804 7.13704C13.5443 7.39674 13.1222 7.39674 12.8625 7.13704L10.6653 4.93977V12.5003C10.6651 12.8673 10.3673 13.1652 10.0002 13.1654C9.63308 13.1654 9.33538 12.8674 9.33521 12.5003Z'></path>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
