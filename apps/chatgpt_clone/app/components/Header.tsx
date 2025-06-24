'use client'

import { Share1Icon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import { RiShare2Line } from 'react-icons/ri'
import { IoIosInformationCircleOutline } from 'react-icons/io'

export default function Header () {
  return (
    <header className='w-full  px-8 py-4 border-b border-[#2a2b32] bg-[#262626] flex items-center justify-between font-[Segoe UI]'>
      {/* Left: Logo */}
      <div className='text-white font-semibold text-lg flex items-center gap-2'>
        ChatGPT
        <svg
          width='16'
          height='16'
          viewBox='0 0 16 16'
          fill='currentColor'
          xmlns='http://www.w3.org/2000/svg'
          className='icon-sm text-token-text-tertiary'
        >
          <path d='M12.1338 5.94433C12.3919 5.77382 12.7434 5.80202 12.9707 6.02929C13.1979 6.25656 13.2261 6.60807 13.0556 6.8662L12.9707 6.9707L8.47067 11.4707C8.21097 11.7304 7.78896 11.7304 7.52926 11.4707L3.02926 6.9707L2.9443 6.8662C2.77379 6.60807 2.80199 6.25656 3.02926 6.02929C3.25653 5.80202 3.60804 5.77382 3.86617 5.94433L3.97067 6.02929L7.99996 10.0586L12.0293 6.02929L12.1338 5.94433Z'></path>
        </svg>
      </div>

      {/* Center: Memory Toggle */}
      <div className='text-sm text-gray-300 flex items-center gap-2'>
        Saved memory full
        <IoIosInformationCircleOutline />
      </div>

      {/* Right: Icons */}
      <div className='  flex items-center gap-3'>
        <div className='flex items-center gap-2 cursor-pointer'>
          <RiShare2Line className='h-5 w-5' />
          <div>Share</div>
        </div>

        <DotsHorizontalIcon className='h-5 w-5 mr-2 ml-2' />

        <div
          title='User'
          className='bg-gray-600 text-white text-sm font-medium px-3 py-1 rounded-full'
        >
          RC
        </div>
      </div>
    </header>
  )
}
