'use client';

import { useState } from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface DomainMarket {
  id: string;
  domainName: string;
  currentPrice: number;
  change24h: number;
  volume24h: number;
  openInterest: number;
  fundingRate: number;
  category: string;
}

export default function Markets() {
  const [markets] = useState<DomainMarket[]>([
    {
      id: '1',
      domainName: 'crypto.eth',
      currentPrice: 12500.50,
      change24h: 15.3,
      volume24h: 850000,
      openInterest: 2500000,
      fundingRate: 0.008,
      category: 'DeFi',
    },
    {
      id: '2',
      domainName: 'defi.eth',
      currentPrice: 8500.00,
      change24h: -5.2,
      volume24h: 1200000,
      openInterest: 3200000,
      fundingRate: -0.012,
      category: 'DeFi',
    },
    {
      id: '3',
      domainName: 'nft.eth',
      currentPrice: 4200.75,
      change24h: 22.8,
      volume24h: 650000,
      openInterest: 1800000,
      fundingRate: 0.025,
      category: 'NFT',
    },
    {
      id: '4',
      domainName: 'game.eth',
      currentPrice: 3100.25,
      change24h: 8.5,
      volume24h: 450000,
      openInterest: 1200000,
      fundingRate: 0.005,
      category: 'Gaming',
    },
    {
      id: '5',
      domainName: 'metaverse.eth',
      currentPrice: 6800.00,
      change24h: -12.3,
      volume24h: 980000,
      openInterest: 2100000,
      fundingRate: -0.018,
      category: 'Metaverse',
    },
  ]);

  return (
    <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm mx-auto max-w-6xl">
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-100 flex items-center gap-2">
          <ChartBarIcon className="h-4 w-4 text-indigo-400" />
          Domain Futures Markets
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Trade domain name futures with leverage</p>
      </div>
      <div className="p-4 sm:p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-indigo-400">
                <th className="pb-3 px-2 sm:px-4 font-medium">Domain</th>
                <th className="pb-3 px-2 sm:px-4 font-medium">Category</th>
                <th className="pb-3 px-2 sm:px-4 font-medium">Price (USD)</th>
                <th className="pb-3 px-2 sm:px-4 font-medium">24h Change</th>
                <th className="pb-3 px-2 sm:px-4 font-medium hidden sm:table-cell">24h Volume</th>
                <th className="pb-3 px-2 sm:px-4 font-medium hidden sm:table-cell">Open Interest</th>
                <th className="pb-3 px-2 sm:px-4 font-medium hidden md:table-cell">Funding Rate</th>
                <th className="pb-3 px-2 sm:px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((market, index) => (
                <tr
                  key={market.id}
                  className={`border-b border-gray-700 hover:bg-gray-700/50 transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-gray-800/10' : ''
                  }`}
                >
                  <td className="py-3 px-2 sm:px-4">
                    <div>
                      <div className="text-gray-100 font-medium">{market.domainName}</div>
                      <div className="text-xs text-gray-400">.eth domain</div>
                    </div>
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-600/20 text-indigo-300">
                      {market.category}
                    </span>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-100">${market.currentPrice.toLocaleString()}</td>
                  <td className={`py-3 px-2 sm:px-4 ${market.change24h >= 0 ? 'text-teal-400' : 'text-amber-400'}`}>
                    {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-100 hidden sm:table-cell">${market.volume24h.toLocaleString()}</td>
                  <td className="py-3 px-2 sm:px-4 text-gray-100 hidden sm:table-cell">${market.openInterest.toLocaleString()}</td>
                  <td className={`py-3 px-2 sm:px-4 hidden md:table-cell ${market.fundingRate >= 0 ? 'text-teal-400' : 'text-amber-400'}`}>
                    {market.fundingRate >= 0 ? '+' : ''}{market.fundingRate.toFixed(3)}%
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-gray-100 px-3 py-1 rounded text-xs sm:text-sm flex items-center gap-1 transition-colors duration-200">
                      <ChartBarIcon className="h-4 w-4" />
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
