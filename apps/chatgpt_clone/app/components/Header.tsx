'use client'

import { useEffect, useRef, useState } from 'react'
import { BsStars } from 'react-icons/bs'
import { TbTopologyStar2 } from 'react-icons/tb'
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
  const [showUpgrade, setShowUpgrade] = useState(false)

  const upgradeRef = useRef<HTMLDivElement | null>(null)
  const arrowRef = useRef<HTMLDivElement | null>(null)

  const toggleSidebar = () => setShowSidebar(prev => !prev)
  const toggleDropdown = () => setShowDropdown(prev => !prev)
  const toggleUpgrade = () => setShowUpgrade(prev => !prev)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        upgradeRef.current &&
        !upgradeRef.current.contains(event.target as Node) &&
        !arrowRef.current?.contains(event.target as Node)
      ) {
        setShowUpgrade(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <header className='w-full px-4 sm:px-6 lg:px-8 py-3 border-b border-[#2a2b32] bg-[#262626] flex items-center justify-between relative'>
        {/* Left button on mobile to toggle sidebar */}
        <div className='sm:hidden mr-2'>
          <button onClick={toggleSidebar} className='text-white'>
            <FiMenu className='text-2xl' />
          </button>
        </div>

        {/* ChatGPT + Arrow — center on mobile, left on desktop */}
        <div className='flex items-center sm:justify-start justify-center flex-1 sm:flex-none relative'>
          <div
            ref={arrowRef}
            onClick={toggleUpgrade}
            className='flex items-center text-white font-semibold text-lg cursor-pointer'
          >
            <span>ChatGPT</span>
            <RiArrowDownSLine className='ml-1 text-xl' />
          </div>

          {showUpgrade && (
            <div
              ref={upgradeRef}
              className='absolute top-full mt-2 sm:left-0 left-1/2 -translate-x-1/2 sm:translate-x-0 w-[320px] bg-[#2d2d2d] shadow-xl rounded-2xl border border-[#444] p-4 z-50'
            >
              <div className='space-y-2'>
                <div className='flex items-start gap-3 p-3 hover:bg-[#3a3a3a] rounded-xl cursor-pointer transition-colors'>
                  <div className='mt-1 text-yellow-400'>
                    <BsStars size={18} />
                  </div>
                  <div className='text-white text-sm'>
                    <div className='font-semibold'>ChatGPT Plus</div>
                    <p className='text-gray-300 text-xs'>
                      Our smartest model & more
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-3 hover:bg-[#3a3a3a] rounded-xl cursor-pointer transition-colors'>
                  <div className='mt-1 text-blue-400'>
                    <TbTopologyStar2 size={18} />
                  </div>
                  <div className='text-white text-sm'>
                    <div className='font-semibold'>ChatGPT</div>
                    <p className='text-gray-300 text-xs'>
                      Great for everyday tasks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Centered Get Plus button only on desktop */}
        <div className='hidden sm:block absolute left-1/2 transform -translate-x-1/2'>
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

        {/* Right Side: Auth & Share */}
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

      {/* Sidebar for Mobile */}
      {showSidebar && (
        <div className='sm:hidden fixed inset-0 z-50 flex'>
          <div
            className='fixed inset-0 backdrop-blur-sm bg-black/10'
            onClick={() => setShowSidebar(false)}
          />
          <div
            className='relative z-10 max-w-xs h-full bg-[#1f1f1f]'
            onClick={e => e.stopPropagation()}
          >
            <Sidebar onClose={() => setShowSidebar(false)} />
          </div>
        </div>
      )}
    </>
  )
}
