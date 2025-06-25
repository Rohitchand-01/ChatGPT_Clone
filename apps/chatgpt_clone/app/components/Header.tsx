'use client'

import { useState } from 'react'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { RiArrowDownSLine, RiShare2Line } from 'react-icons/ri'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { FiMenu } from 'react-icons/fi'
import Sidebar from './Sidebar'

export default function Header () {
  const [showSidebar, setShowSidebar] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const toggleSidebar = () => setShowSidebar(prev => !prev)
  const toggleDropdown = () => setShowDropdown(prev => !prev)

  return (
    <>
      <header className='w-full px-4 sm:px-6 lg:px-8 py-3 border-b border-[#2a2b32] bg-[#262626] flex items-center justify-between relative'>
        <div className='flex items-center gap-3'>
          <div className='hidden sm:flex items-center text-white font-semibold text-lg'>
            ChatGPT
          </div>
          <button className='sm:hidden text-white' onClick={toggleSidebar}>
            <FiMenu className='text-xl' />
          </button>
        </div>

        <div className='absolute left-1/2 transform -translate-x-1/2'>
          <div className='hidden sm:flex'>
            <button className='flex items-center gap-1.5 rounded-full bg-[#F1F1FB] py-1.5 px-4 text-sm font-medium text-[#5D5BD0] hover:bg-[#E4E4F6] dark:bg-[#373669] dark:text-[#DCDBF6] dark:hover:bg-[#414071]'>
              <svg
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='currentColor'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M17.665 10C17.665 10.6877 17.1785 11.2454 16.5488 11.3945L16.4219 11.4189C14.7098 11.6665 13.6129 12.1305 12.877 12.8623C12.1414 13.5938 11.6742 14.6843 11.4238 16.3887C11.3197 17.0973 10.7182 17.665 9.96484 17.665C9.27085 17.665 8.68836 17.1772 8.53613 16.5215C8.12392 14.7459 7.6623 13.619 6.95703 12.8652C6.31314 12.1772 5.39414 11.7268 3.88672 11.4688L3.57715 11.4199C2.88869 11.319 2.33496 10.734 2.33496 10C2.33496 9.26603 2.88869 8.681 3.57715 8.58008L3.88672 8.53125C5.39414 8.27321 6.31314 7.82277 6.95703 7.13477C7.6623 6.38104 8.12392 5.25413 8.53613 3.47852L8.56934 3.35742C8.76133 2.76356 9.31424 2.33496 9.96484 2.33496C10.7182 2.33497 11.3197 2.9027 11.4238 3.61133L11.5283 4.22266C11.7954 5.58295 12.2334 6.49773 12.877 7.1377C13.6129 7.86952 14.7098 8.33351 16.4219 8.58105C17.1119 8.68101 17.665 9.26667 17.665 10Z' />
              </svg>
              Get Plus
            </button>
          </div>
          <div className='sm:hidden flex items-center gap-1 text-white font-semibold text-lg'>
            <span>ChatGPT</span>
            <RiArrowDownSLine className='text-xl' />
          </div>
        </div>

        <div className='flex items-center gap-2 sm:gap-3 ml-auto'>
          <SignedIn>
            <div className='hidden sm:flex items-center gap-2 cursor-pointer text-white text-sm'>
              <RiShare2Line className='h-5 w-5' />
              <div>Share</div>
              <DotsHorizontalIcon className='h-5 w-5 ml-1' />
            </div>
          </SignedIn>

          <SignedOut>
            <div className='relative sm:hidden'>
              <button
                onClick={toggleDropdown}
                className='text-white text-sm border px-3 py-1 rounded-full hover:bg-[#333]'
              >
                Login
              </button>
              {showDropdown && (
                <div className='absolute right-0 mt-2 w-32 bg-[#1f1f1f] border border-[#333] rounded-md shadow-md z-50'>
                  <SignInButton mode='modal'>
                    <div className='px-4 py-2 text-white hover:bg-[#333] cursor-pointer text-sm'>
                      Login
                    </div>
                  </SignInButton>
                  <SignUpButton mode='modal'>
                    <div className='px-4 py-2 text-white hover:bg-[#333] cursor-pointer text-sm'>
                      Sign Up
                    </div>
                  </SignUpButton>
                </div>
              )}
            </div>

            <div className='hidden sm:flex gap-2'>
              <SignInButton mode='modal'>
                <button className='text-black text-sm px-3 py-1 bg-white rounded-full hover:bg-gray-200'>
                  Login
                </button>
              </SignInButton>

              <SignUpButton mode='modal'>
                <button className='border px-3 py-1 text-sm rounded-full text-white hover:bg-[#333]'>
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl='/' />
          </SignedIn>
        </div>
      </header>

      {showSidebar && (
        <div className='sm:hidden fixed inset-0 z-50 flex'>
          <div
            className='fixed inset-0 backdrop-blur-sm bg-black/10'
            onClick={() => setShowSidebar(false)}
          />
          <div
            className='relative z-10  max-w-xs h-full bg-[#1f1f1f]'
            onClick={e => e.stopPropagation()}
          >
            <Sidebar onClose={() => setShowSidebar(false)} />
          </div>
        </div>
      )}
    </>
  )
}
