'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  ChartBarIcon,
  ClockIcon,
  UserIcon,
  CogIcon,
  HomeIcon,
  ArrowTrendingUpIcon,
  WalletIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  TrophyIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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

  const getActiveRoute = () => {
    if (pathname === '/') return 'dashboard';
    if (pathname === '/markets') return 'markets';
    if (pathname === '/positions') return 'positions';
    if (pathname === '/etf-options') return 'etf-options';
    if (pathname === '/competition') return 'competition';
    if (pathname === '/activity') return 'activity';
    if (pathname === '/vault') return 'portfolio';
    if (pathname === '/trade') return 'orders';
    if (pathname === '/admin') return 'governance';
    return 'dashboard';
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div
      className={`bg-gray-800/50 border-r border-gray-700/50 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      } h-full`}
    >
      <div className="p-4">
        <div className="flex items-center justify-end mb-6">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md hover:bg-gray-700/50 transition-colors duration-200"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                isCollapsed ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = getActiveRoute() === item.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.href);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {!isCollapsed && (
          <div className="mt-8 p-4 bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <UserIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">Account</span>
            </div>
            <div className="text-xs text-gray-400 mb-3">0x1234...5678</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Balance:</span>
                <span className="text-gray-200">12.5 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Margin:</span>
                <span className="text-gray-200">8.2 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">P&L:</span>
                <span className="text-teal-400">+$2,340.50</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}