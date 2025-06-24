// app/layout.tsx
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './styles/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ChatGPT Clone',
  description: 'Built with Vercel AI SDK',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-white text-black dark:bg-[#343541] dark:text-white`}>
        <div className="flex h-screen w-screen overflow-hidden">
          {/* Sidebar - fixed width */}
          <div className="w-[260px] bg-[#202123] hidden md:flex flex-col">
            <Sidebar />
          </div>

          {/* Right Side: Header + Chat */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
