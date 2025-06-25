'use client'

import { Share1Icon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import { RiShare2Line } from 'react-icons/ri'
import { ImDiamonds } from 'react-icons/im'

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

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
      <button className='flex items-center gap-1.5 rounded-full bg-[#F1F1FB] py-1.5 ps-3 pe-3.5 text-sm font-medium text-[#5D5BD0] hover:bg-[#E4E4F6] dark:bg-[#373669] dark:text-[#DCDBF6] dark:hover:bg-[#414071]'>
        <svg
          width='20'
          height='20'
          viewBox='0 0 20 20'
          fill='currentColor'
          xmlns='http://www.w3.org/2000/svg'
          className='icon-sm'
        >
          <path d='M17.665 10C17.665 10.6877 17.1785 11.2454 16.5488 11.3945L16.4219 11.4189C14.7098 11.6665 13.6129 12.1305 12.877 12.8623C12.1414 13.5938 11.6742 14.6843 11.4238 16.3887C11.3197 17.0973 10.7182 17.665 9.96484 17.665C9.27085 17.665 8.68836 17.1772 8.53613 16.5215C8.12392 14.7459 7.6623 13.619 6.95703 12.8652C6.31314 12.1772 5.39414 11.7268 3.88672 11.4688L3.57715 11.4199C2.88869 11.319 2.33496 10.734 2.33496 10C2.33496 9.26603 2.88869 8.681 3.57715 8.58008L3.88672 8.53125C5.39414 8.27321 6.31314 7.82277 6.95703 7.13477C7.6623 6.38104 8.12392 5.25413 8.53613 3.47852L8.56934 3.35742C8.76133 2.76356 9.31424 2.33496 9.96484 2.33496C10.7182 2.33497 11.3197 2.9027 11.4238 3.61133L11.5283 4.22266C11.7954 5.58295 12.2334 6.49773 12.877 7.1377C13.6129 7.86952 14.7098 8.33351 16.4219 8.58105C17.1119 8.68101 17.665 9.26667 17.665 10Z'></path>
        </svg>
        Get Plus
      </button>

      {/* Right: Icons */}
      <div className='flex items-center gap-3'>
        <SignedIn>
          <div className='flex items-center gap-2 cursor-pointer'>
            <RiShare2Line className='h-5 w-5' />
            <div>Share</div>
            <DotsHorizontalIcon className='h-5 w-5 mr-2 ml-2' />
          </div>
        </SignedIn>

        <SignedOut>
          <SignInButton mode='modal'>
            <button className='text-black text-sm px-3 py-1 bg-white rounded-full hover:bg-gray-200'>
              Login
            </button>
          </SignInButton>

          <SignUpButton mode='modal'>
            <button className='border px-2 text-sm py-1 rounded-full text-white hover:bg-[#333]'>
              Sign Up for free
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  )
}
