"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8 shadow-sm">
      <button
        type="button"
        className="lg:hidden text-gray-400 hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-md p-2"
      >
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex flex-1 items-center justify-end gap-x-4 lg:gap-x-6">
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
    </div>
  );
}