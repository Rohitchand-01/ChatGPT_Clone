'use client';

import { useRef, useEffect } from 'react';
import { GoPlus } from 'react-icons/go';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import { FiMic } from 'react-icons/fi';
import { RiVoiceprintFill } from 'react-icons/ri';
import { FaArrowUp } from 'react-icons/fa';

export default function ChatInput({
  input,
  onChange,
  onSubmit,
  isLoading,
}: any) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="absolute bottom-0 left-65 w-319 border-gray-200 bg-[#262626]">
      <form
        onSubmit={onSubmit}
        className="mx-auto max-w-3xl w-full px-4 py-4 flex items-end gap-3"
      >
        <div className="relative flex-1 bg-[#333333] px-6 pt-4 pb-3 rounded-3xl">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            className="w-full resize-none overflow-hidden text-sm focus:outline-none focus:ring-0 bg-transparent text-white"
            style={{ maxHeight: '250px' }}
          />

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-white">
              <GoPlus className="h-5 w-5 mt-1" />
              <div className="text-sm flex items-center gap-1 hover:bg-[#595959] p-1 rounded-2xl px-2 mt-2">
                <HiOutlineAdjustmentsHorizontal className='h-5 w-5 ' />
                Tools
              </div>
            </div>

            <div className="flex items-center ">
              <div className=' rounded-full p-3 cursor-pointer hover:bg-[#595959] transition-colors'>
                <FiMic className="text-white cursor-pointer h-5 w-5 " />
              </div>

              {input.trim() === '' ? (
                <div className="bg-[#595959] rounded-full p-3 ml-2 cursor-pointer hover:bg-[#737373] transition-colors">
                  <RiVoiceprintFill className="text-white w-5 h-5" />
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-white text-black rounded-full p-2 ml-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaArrowUp />
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

      <div className="text-center text-xs pb-2 text-white select-none">
        ChatGPT can make mistakes. Check important info. See{' '}
        <span className="underline">Cookie Preferences.</span>
      </div>
    </div>
  );
}
