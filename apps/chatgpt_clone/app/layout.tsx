// app/layout.tsx
import './styles/globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ChatGPT',
  description: 'Built with Vercel AI SDK',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-white text-black dark:bg-[#343541] dark:text-white`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
