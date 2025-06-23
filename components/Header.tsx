'use client'

import { Share1Icon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import { RiShare2Line } from 'react-icons/ri'
import { IoIosInformationCircleOutline } from "react-icons/io";


export default function Header () {
  return (
    <header className='w-full  px-8 py-4 border-b border-[#2a2b32] bg-[#262626] flex items-center justify-between font-[Segoe UI]'>
      {/* Left: Logo */}
      <div className='text-white font-semibold text-lg'>ChatGPT</div>

      {/* Center: Memory Toggle */}
      <div className='text-sm text-gray-300 flex items-center gap-2'>
        Saved memory full
        <IoIosInformationCircleOutline/>
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
