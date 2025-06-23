'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { FiSidebar } from 'react-icons/fi'
import { IoMdPhotos } from 'react-icons/io'
import { FaRegCirclePlay } from 'react-icons/fa6'
import { HiOutlineSquares2X2 } from 'react-icons/hi2'

import {
  PlusIcon,
  MagnifyingGlassIcon,
  Cross1Icon
} from '@radix-ui/react-icons'
import { FiBookOpen } from 'react-icons/fi'
import { FaRobot, FaPlay } from 'react-icons/fa' // For GPTs and Sora icons

type ChatItem = {
  _id: string
  createdAt: string
}

export default function Sidebar () {
  const [chats, setChats] = useState<ChatItem[]>([])
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch('/api/history')
        const data = await res.json()
        setChats(data)
      } catch (err) {
        console.error('Fetch error:', err)
      }
    }
    fetchChats()
  }, [pathname])

  return (
    <aside
      className='w-[260px] text-white h-screen flex flex-col bg-[#1a1a1a] font-segoe'
    >
      {/* Top Header */}
      <div className='flex justify-between items-center px-3 py-3 '>
        <Image
          src={'/logo.png'}
          
          alt='Logo'
          width={32}
          height={32}
          className='h-7 w-7'
        />
        <FiSidebar className='h-4 w-8' />
      </div>

      {/* Sidebar Options */}
      <div className='px-2 space-y-1 text-sm'>
        <SidebarButton
          icon={
            <Image
              src='/chat.png'
              alt='Chat Icon'
              width={16}
              height={16}
              className='h-6 w-6'
            />
          }
          label='New chat'
          onClick={() => router.push('/chat')}
        />
        <SidebarButton
          icon={<MagnifyingGlassIcon className='h-4 w-4' />}
          label='Search chats'
          href='#'
        />
        <SidebarButton
          icon={<IoMdPhotos className='h-4 w-4' />}
          label='Library'
          href='#'
        />
        <div className='mt-5'>
          <SidebarButton
            icon={<FaRegCirclePlay className='h-4 w-4' />}
            label='Sora'
            href='#'
          />
          <SidebarButton
            icon={<HiOutlineSquares2X2 className='h-4 w-4' />}
            label='GPTs'
            href='#'
          />
        </div>
      </div>

      {/* Chat History */}
      <div className='flex-1 mt-2 px-2 overflow-y-auto custom-scrollbar'>
        <h2 className='text-md text-gray-300 px-2 mb-1 mt-5'>Chats</h2>
        {chats.length > 0 ? (
          chats.map(chat => (
            <Link
              key={chat._id}
              href={`/chat?id=${chat._id}`}
              className={`block px-2 py-2 rounded-md text-sm truncate ${
                pathname.includes(chat._id)
                  ? 'bg-[#343541] hover:bg-[#262626]'
                  : 'hover:bg-[#262626]'
              }`}
            >
              Chat{' '}
              {new Date(chat.createdAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </Link>
          ))
        ) : (
          <p className='text-gray-300 text-sm text-center mt-4'>
            No chats yet.
          </p>
        )}
      </div>

      {/* Optional Footer */}
      <div className='p-3 border-t border-[#2a2b32]'>
        <p className='text-xs text-gray-400'>Upgrade plan</p>
      </div>
    </aside>
  )
}

function SidebarButton ({
  icon,
  label,
  href,
  onClick
}: {
  icon: React.ReactNode
  label: string
  href?: string
  onClick?: () => void
}) {
  const buttonClass =
    'flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#262626] transition text-white w-full'

  if (href)
    return (
      <Link href={href} className={buttonClass}>
        {icon}
        {label}
      </Link>
    )

  return (
    <button onClick={onClick} className={buttonClass}>
      {icon}
      {label}
    </button>
  )
}
