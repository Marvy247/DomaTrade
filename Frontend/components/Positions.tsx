'use client';

import { useStore } from '@/lib/store';
import { ArrowUpIcon, ArrowDownIcon, XMarkIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function Positions() {
  const { positions, removePosition } = useStore();

  const getPnlColor = (pnl: number) => {
    return pnl >= 0 ? 'text-teal-400' : 'text-red-400';
  };

  const getSideBg = (side: string) => {
    return side === 'buy' 
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
        {positions.length > 0 ? (
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
                  Unrealized P&L
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {positions.map((position) => (
                <tr key={position.id} className="hover:bg-gray-800/30 transition-all duration-200 ease-in-out">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-100">{position.domain}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSideBg(position.side)}`}>
                      {position.side === 'buy' ? (
                        <ArrowUpIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3 mr-1" />
                      )}
                      {position.side.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    {position.size}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    ${position.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={getPnlColor(position.pnl)}>
                      {position.pnl >= 0 ? '+' : ''}{position.pnl.toLocaleString()} USD
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button onClick={() => removePosition(position.id)} className="text-red-400 hover:text-red-300 transition-colors">
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-200">No open positions</h3>
            <p className="mt-1 text-sm text-gray-400">Your open positions will appear here.</p>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Total Unrealized P&L: 
            <span className="text-teal-400 font-medium ml-2">+$0.00 USD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
