'use client';

import { useStore } from "@/lib/store";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useStore();

  return (
    <div className="flex h-full min-h-screen">
      {/* Sidebar: Fixed on left for large screens, hidden on mobile */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 bg-gray-800/50 backdrop-blur-md border-r border-gray-700/50 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <Sidebar />
      </div>
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        {/* Header: Sticky and full-width */}
        <Header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50" />
        {/* Main Content: Full-width */}
        <main className="flex-1 py-6 bg-transparent">
          <div className="px-4 sm:px-6 lg:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
