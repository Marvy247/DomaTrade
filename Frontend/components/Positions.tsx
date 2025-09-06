'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { ArrowUpIcon, ArrowDownIcon, XMarkIcon, ChartBarIcon, ClockIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function Positions() {
  const { positions, removePosition, updatePositionStopLoss, updatePositionTakeProfit } = useStore();
  const [editingPosition, setEditingPosition] = useState<string | null>(null);
  const [stopLossValue, setStopLossValue] = useState('');
  const [takeProfitValue, setTakeProfitValue] = useState('');

  const getPnlColor = (pnl: number) => {
    return pnl >= 0 ? 'text-teal-400' : 'text-red-400';
  };

  const getSideBg = (side: string) => {
    return side === 'buy'
      ? 'bg-teal-600/20 text-teal-300'
      : 'bg-red-600/20 text-red-300';
  };

  const handleEditSLTP = (position: { id: string; stopLoss?: number; takeProfit?: number }) => {
    setEditingPosition(position.id);
    setStopLossValue(position.stopLoss?.toString() || '');
    setTakeProfitValue(position.takeProfit?.toString() || '');
  };

  const handleSaveSLTP = () => {
    if (editingPosition) {
      if (stopLossValue) {
        updatePositionStopLoss(editingPosition, parseFloat(stopLossValue));
      }
      if (takeProfitValue) {
        updatePositionTakeProfit(editingPosition, parseFloat(takeProfitValue));
      }
      setEditingPosition(null);
      setStopLossValue('');
      setTakeProfitValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingPosition(null);
    setStopLossValue('');
    setTakeProfitValue('');
  };

  return (
    <div>
      <div className="overflow-x-auto">
        {positions.length > 0 ? (
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-800/80 z-10">
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
                  Stop Loss
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Take Profit
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
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <span>{position.stopLoss !== undefined ? `$${position.stopLoss.toLocaleString()}` : '-'}</span>
                      <button
                        onClick={() => handleEditSLTP(position)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Edit Stop Loss"
                      >
                        <PencilIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <span>{position.takeProfit !== undefined ? `$${position.takeProfit.toLocaleString()}` : '-'}</span>
                      <button
                        onClick={() => handleEditSLTP(position)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Edit Take Profit"
                      >
                        <PencilIcon className="h-3 w-3" />
                      </button>
                    </div>
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
            <span className="text-teal-400 font-medium ml-2">
              {positions.reduce((acc, pos) => acc + pos.pnl, 0).toFixed(2)} USD
            </span>
          </div>
        </div>
      </div>

      {editingPosition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Edit Stop Loss / Take Profit</h3>
            <label className="block mb-2 text-sm text-gray-300">Stop Loss</label>
            <input
              type="number"
              value={stopLossValue}
              onChange={(e) => setStopLossValue(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-gray-800 text-gray-100 border border-gray-700"
              placeholder="Enter stop loss price"
            />
            <label className="block mb-2 text-sm text-gray-300">Take Profit</label>
            <input
              type="number"
              value={takeProfitValue}
              onChange={(e) => setTakeProfitValue(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-gray-800 text-gray-100 border border-gray-700"
              placeholder="Enter take profit price"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSLTP}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-gray-100"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
