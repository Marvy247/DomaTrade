"use client";

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  HomeIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  ChartPieIcon,
  TrophyIcon,
  ClockIcon,
  WalletIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

export default function Header({ className }: { className?: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, href: '/' },
    { id: 'markets', label: 'Markets', icon: ArrowTrendingUpIcon, href: '/markets' },
    { id: 'positions', label: 'Positions', icon: ChartBarIcon, href: '/positions' },
    { id: 'etf-options', label: 'ETF Options', icon: ChartPieIcon, href: '/etf-options' },
    { id: 'competition', label: 'Competition', icon: TrophyIcon, href: '/competition' },
    { id: 'activity', label: 'Activity', icon: ClockIcon, href: '/activity' },
    { id: 'portfolio', label: 'Portfolio', icon: WalletIcon, href: '/vault' },
    { id: 'orders', label: 'Orders', icon: BookOpenIcon, href: '/trade' },
    { id: 'governance', label: 'Governance', icon: ShieldCheckIcon, href: '/admin' },
    { id: 'settings', label: 'Settings', icon: CogIcon, href: '/settings' },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm px-3 sm:px-4 lg:px-6 shadow-sm ${className}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <ArrowTrendingUpIcon className="h-4 w-4 text-gray-100" />
        </div>
        <span className="text-base sm:text-lg font-semibold text-gray-100">DomaTrade</span>
      </div>

      {/* Hamburger Menu Button (Mobile Only) */}
      <button
        type="button"
        className="lg:hidden text-gray-300 hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-lg p-3 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Bars3Icon className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Connect Wallet Button */}
      <div className="flex items-center gap-x-3 sm:gap-x-4 lg:gap-x-6">
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
          }}
          label="Connect Wallet"
        />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800/20 backdrop-blur-sm transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden transition-transform duration-300 ease-in-out border-r border-gray-700`}
      >
        <div className="flex h-16 items-center justify-between px-3 sm:px-4 border-b border-gray-700">
          <span className="text-base sm:text-lg font-semibold text-gray-100">Menu</span>
          <button
            type="button"
            className="text-gray-300 hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-lg p-2"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <XMarkIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <nav className="flex flex-col p-3 sm:p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(item.href);
              }}
              className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-indigo-600/20 hover:text-indigo-400 rounded-lg transition-all duration-200 text-xs sm:text-sm"
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
