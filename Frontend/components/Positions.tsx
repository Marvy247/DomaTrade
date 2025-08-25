'use client';

import { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

interface Position {
  id: string;
  domainName: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  markPrice: number;
  leverage: number;
  margin: number;
  unrealizedPnl: number;
  liquidationPrice: number;
  fundingRate: number;
}

export default function Positions() {
  const [positions] = useState<Position[]>([
    {
      id: '1',
      domainName: 'crypto.eth',
      side: 'long',
      size: 2.5,
      entryPrice: 11000,
      markPrice: 11250,
      leverage: 5,
      margin: 550,
      unrealizedPnl: 625,
      liquidationPrice: 8800,
      fundingRate: 0.01,
    },
    {
      id: '2',
      domainName: 'defi.eth',
      side: 'short',
      size: 1.8,
      entryPrice: 8500,
      markPrice: 8200,
      leverage: 3,
      margin: 567,
      unrealizedPnl: 540,
      liquidationPrice: 11333,
      fundingRate: -0.005,
    },
    {
      id: '3',
      domainName: 'nft.eth',
      side: 'long',
      size: 0.8,
      entryPrice: 4200,
      markPrice: 4150,
      leverage: 4,
      margin: 840,
      unrealizedPnl: -40,
      liquidationPrice: 3150,
      fundingRate: 0.008,
    },
  ]);

  const getPnlColor = (pnl: number) => {
    return pnl >= 0 ? 'text-teal-400' : 'text-red-400';
  };

  const getSideColor = (side: string) => {
    return side === 'long' ? 'text-teal-400' : 'text-red-400';
  };

  const getSideBg = (side: string) => {
    return side === 'long' 
      ? 'bg-teal-600/20 text-teal-300' 
      : 'bg-red-600/20 text-red-300';
  };

  return (
    <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm mx-auto max-w-7xl">
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-100">Domain Futures Positions</h3>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Manage your leveraged positions on domain names</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Domain
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Side
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Size
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Entry Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Mark Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Leverage
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Margin
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Unrealized P&L
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Liquidation Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {positions.map((position) => (
              <tr key={position.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-100">{position.domainName}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSideBg(position.side)}`}>
                    {position.side === 'long' ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                    )}
                    {position.side.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                  {position.size} ETH
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                  ${position.entryPrice.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                  ${position.markPrice.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                  {position.leverage}x
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                  ${position.margin.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={getPnlColor(position.unrealizedPnl)}>
                    {position.unrealizedPnl >= 0 ? '+' : ''}{position.unrealizedPnl.toLocaleString()} USD
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                  ${position.liquidationPrice.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
                      <PlusIcon className="h-4 w-4" />
                    </button>
                    <button className="text-red-400 hover:text-red-300 transition-colors">
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Total Unrealized P&L: 
            <span className="text-teal-400 font-medium ml-2">+$1,125.00 USD</span>
          </div>
          <div className="text-sm text-gray-400">
            Total Margin Used: 
            <span className="text-gray-200 font-medium ml-2">$1,957.00 USD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
