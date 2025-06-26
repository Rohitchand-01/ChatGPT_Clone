'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type ChatItem = {
  _id: string
  title: string
  createdAt: string
}

export default function Sidebar({
  collapsed,
  setCollapsed
}: {
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [chats, setChats] = useState<ChatItem[]>([])

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch('/api/chats')
        if (!res.ok) {
          console.error('Failed to fetch chats')
          return
        }
        const data = await res.json()
        const formattedChats = Array.isArray(data)
          ? data
          : Array.isArray(data.chats)
            ? data.chats
            : []
        setChats(
          formattedChats.map((chat: ChatItem) => ({
            ...chat,
            title: chat.title || 'Untitled Chat'
          }))
        )
      } catch (error) {
        console.error('Error fetching chats:', error)
      }
    }

    fetchChats()
  }, [])

  return (
    <aside
      className='text-white h-screen flex flex-col bg-[#1a1a1a] font-segoe transition-all duration-300 ease-in-out'
      style={{ width: collapsed ? '70px' : '260px' }}
    >
      <div
        className={`flex items-center px-3 py-3 ${
          collapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        <button onClick={() => setCollapsed(!collapsed)} title='Toggle sidebar'>
          {collapsed ? <HamburgerIcon /> : <SidebarIcon />}
        </button>
      </div>

      <SidebarButton icon={<NewChatIcon />} label='New Chat' href='/chat' isCollapsed={collapsed} />
      <SidebarButton icon={<SearchChatIcon />} label='Search Chat' onClick={()=>{alert('this feature will coming soon')}} isCollapsed={collapsed} />
      <SidebarButton icon={<LibraryIcon />} label='Library' onClick={()=>{alert('this feature will coming soon')}} isCollapsed={collapsed} />
      <SidebarButton icon={<SoraIcon />} label='Sora' onClick={()=>{alert('this feature will coming soon')}} isCollapsed={collapsed} />
      <SidebarButton icon={<GPTsIcon />} label='GPTs' onClick={()=>{alert('this feature will coming soon')}} isCollapsed={collapsed} />

      <div className='flex-1 mt-2 px-2 overflow-y-auto custom-scrollbar'>
        {!collapsed && <h2 className='text-md text-gray-300 px-2 mb-1 mt-5'>Chats</h2>}
        {chats.length > 0 ? (
          chats.map((chat) => (
            <Link
              key={chat._id}
              href={`/chat/${chat._id}`}
              className='block px-2 py-2 rounded-md text-sm truncate hover:bg-[#262626]'
            >
              {!collapsed && ('Chat'+ chat._id)}
            </Link>
          ))
        ) : (
          !collapsed && (
            <p className='text-gray-300 text-sm text-center mt-4'>
              No chats yet.
            </p>
          )
        )}
      </div>
    </aside>
  )
}

function SidebarButton({
  icon,
  label,
  href,
  onClick,
  isCollapsed
}: {
  icon: React.ReactNode
  label: string
  href?: string
  onClick?: () => void
  isCollapsed: boolean
}) {
  const className =
    'flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#262626] transition text-white w-full'
  if (href) {
    return (
      <Link href={href} className={className}>
        {icon}
        {!isCollapsed && label}
      </Link>
    )
  }
  return (
    <button onClick={onClick} className={className}>
      {icon}
      {!isCollapsed && label}
    </button>
  )
}

const SidebarIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-gray-400 hover:text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
    <line x1='9' y1='3' x2='9' y2='21' />
  </svg>
)

const HamburgerIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-gray-400 hover:text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <line x1='3' y1='12' x2='21' y2='12' />
    <line x1='3' y1='6' x2='21' y2='6' />
    <line x1='3' y1='18' x2='21' y2='18' />
  </svg>
)

const NewChatIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <line x1='12' y1='5' x2='12' y2='19' />
    <line x1='5' y1='12' x2='19' y2='12' />
  </svg>
)

const SearchChatIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <circle cx='11' cy='11' r='8' />
    <line x1='21' y1='21' x2='16.65' y2='16.65' />
  </svg>
)

const LibraryIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 18 18' stroke='currentColor'>
    <path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20' />
    <path d='M4 4.5A2.5 2.5 0 0 1 6.5 7H20' />
    <path d='M4 12a2.5 2.5 0 0 1 2.5-2.5H20' />
  </svg>
)

const SoraIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <circle cx='12' cy='12' r='10' />
    <polygon points='10 8 16 12 10 16 10 8' />
  </svg>
)

const GPTsIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <rect x='3' y='3' width='7' height='7' />
    <rect x='14' y='3' width='7' height='7' />
    <rect x='14' y='14' width='7' height='7' />
    <rect x='3' y='14' width='7' height='7' />
  </svg>
)
