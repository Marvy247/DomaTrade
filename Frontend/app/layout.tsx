import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Providers } from "@/lib/providers";
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DomaTrade",
  description: "Domain Futures Trading Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-gray-950">
      <body className={`${inter.className} h-full antialiased text-gray-100 bg-gradient-to-br from-gray-950 to-gray-900`}>
        <Providers>
          <div className="flex h-full min-h-screen">
            {/* Sidebar: Fixed on left for large screens, hidden on mobile */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 bg-gray-800/50 backdrop-blur-md border-r border-gray-700/50 transition-all duration-300">
              <Sidebar />
            </div>
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-64">
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
          {/* Toaster */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1E293B',
                color: '#F9FAFB',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              },
              success: {
                iconTheme: {
                  primary: '#34D399',
                  secondary: '#1E293B',
                },
              },
              error: {
                iconTheme: {
                  primary: '#F87171',
                  secondary: '#1E293B',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}