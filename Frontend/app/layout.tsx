import type { Metadata } from "next";
import "@rainbow-me/rainbowkit/styles.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Providers } from "@/lib/providers";
import { Toaster } from 'react-hot-toast';
import ClientLayout from "@/components/ClientLayout";
import './globals.css';

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
      <body className="h-full antialiased text-gray-100 bg-gradient-to-br from-gray-950 to-gray-900 font-sans">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
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
