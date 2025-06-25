'use client';

import Sidebar from './Sidebar';
import Header from './Header';
import { useState } from 'react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar - collapsible */}
      <div
        className="bg-[#202123] hidden md:flex flex-col transition-all duration-300 ease-in-out"
        style={{ width: collapsed ? '70px' : '260px' }}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Right side layout */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
