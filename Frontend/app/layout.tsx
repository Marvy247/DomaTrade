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
    <html lang="en" className="h-full bg-gray-900">
      <body className={`${inter.className} h-full antialiased bg-gray-900 text-gray-100`}>
        <Providers>
          <div className="flex h-full">
            <div className="hidden lg:flex lg:w-72 lg:flex-col lg:inset-y-0 lg:z-50 bg-gray-800/20 shadow-lg border-r border-gray-700">
              <Sidebar />
            </div>
            <div className="flex-1 flex flex-col lg:pl-72">
              <Header />
              <main className="flex-1 py-8 bg-gray-900">
                <div className="px-4 sm:px-6 lg:px-8">{children}</div>
              </main>
            </div>
          </div>
          <Toaster position="top-right" toastOptions={{
            style: {
              background: '#1F2937',
              color: '#F3F4F6',
              border: '1px solid rgba(79, 70, 229, 0.2)',
            },
            success: {
              iconTheme: {
                primary: '#5EEAD4',
                secondary: '#1F2937',
              },
            },
            error: {
              iconTheme: {
                primary: '#FBBF24',
                secondary: '#1F2937',
              },
            },
          }} />
        </Providers>
      </body>
    </html>
  );
}