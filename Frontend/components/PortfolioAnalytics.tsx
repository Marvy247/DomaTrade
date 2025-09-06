'use client';

import { useStore } from '../lib/store';
import { ChartBarIcon, ArrowTrendingUpIcon, ChartPieIcon, BoltIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function PortfolioAnalytics() {
  const { positions, activities, markets } = useStore();
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');

  // Calculate portfolio metrics
  const totalValue = positions.reduce((sum, pos) => sum + pos.price * pos.size, 0);
  const totalPnl = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalPositions = positions.length;

  // Calculate risk metrics
  const winningPositions = positions.filter(pos => pos.pnl > 0).length;
  const losingPositions = positions.filter(pos => pos.pnl < 0).length;
  const winRate = totalPositions > 0 ? (winningPositions / totalPositions) * 100 : 0;

  // Calculate asset allocation
  const assetAllocation = positions.reduce((acc, pos) => {
    const existing = acc.find(item => item.domain === pos.domain);
    if (existing) {
      existing.value += pos.price * pos.size;
      existing.percentage = (existing.value / totalValue) * 100;
    } else {
      acc.push({
        domain: pos.domain,
        value: pos.price * pos.size,
        percentage: totalValue > 0 ? ((pos.price * pos.size) / totalValue) * 100 : 0
      });
    }
    return acc;
  }, [] as Array<{domain: string, value: number, percentage: number}>);

  // Generate mock P&L data for the chart
  const generatePnlData = () => {
    const data = [];
    const days = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 365;
    let cumulativePnl = 0;

    for (let i = days; i >= 0; i--) {
      cumulativePnl += (Math.random() - 0.5) * 100;
      data.push({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
        pnl: cumulativePnl
      });
    }
    return data;
  };

  const pnlData = generatePnlData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm p-6">
        <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
          <ChartBarIcon className="h-6 w-6 text-blue-400" />
          Portfolio Analytics
        </h2>
        <p className="text-gray-400 mt-1">Comprehensive analysis of your trading performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6 text-green-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-400">Total Value</p>
              <p className="text-xl font-bold text-gray-100 truncate" title={`$${totalValue.toLocaleString()}`}>
                ${totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm p-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${totalPnl >= 0 ? 'bg-green-600/20' : 'bg-red-600/20'}`}>
              <BoltIcon className={`h-6 w-6 ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total P&L</p>
              <p className={`text-xl font-bold ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Open Positions</p>
              <p className="text-xl font-bold text-gray-100">{totalPositions}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <ChartPieIcon className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Win Rate</p>
              <p className="text-xl font-bold text-gray-100">{winRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* P&L Chart */}
        <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-100">P&L Over Time</h3>
            <div className="flex gap-2">
              {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded text-sm ${
                    timeframe === tf ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            {pnlData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pnlData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ backgroundColor: '#222', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="pnl" stroke="#4f46e5" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center">
                <ChartBarIcon className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400">P&L Chart Visualization</p>
                <p className="text-sm text-gray-500">Chart implementation would go here</p>
              </div>
            )}
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Asset Allocation</h3>
          {assetAllocation.length > 0 ? (
            <div className="space-y-4">
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetAllocation}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ domain, percentage }) => `${domain.split('.')[0]}: ${percentage.toFixed(1)}%`}
                    >
                      {assetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#222', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {assetAllocation.map((asset, index) => (
                  <div key={asset.domain} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                      />
                      <span className="text-gray-100">{asset.domain}</span>
                    </div>
                    <div className="text-right min-w-0">
                      <p className="text-gray-100 font-medium truncate" title={`$${asset.value.toLocaleString()}`}>
                        ${asset.value.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-400">{asset.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <ChartPieIcon className="h-12 w-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">No positions to display</p>
            </div>
          )}
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Risk Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{winningPositions}</p>
            <p className="text-sm text-gray-400">Winning Trades</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">{losingPositions}</p>
            <p className="text-sm text-gray-400">Losing Trades</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{winRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-400">Win Rate</p>
          </div>
        </div>
      </div>

      {/* Trade Analysis */}
      <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Trade Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-2 text-gray-400">Domain</th>
                <th className="px-4 py-2 text-gray-400">Side</th>
                <th className="px-4 py-2 text-gray-400">Size</th>
                <th className="px-4 py-2 text-gray-400">Entry Price</th>
                <th className="px-4 py-2 text-gray-400">P&L</th>
                <th className="px-4 py-2 text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.slice(0, 10).map((activity) => {
                // Calculate mock P&L for demonstration
                const currentPrice = markets.find(m => m.domain === activity.domain)?.price || activity.price;
                const pnl = activity.side === 'buy'
                  ? (currentPrice - activity.price) * activity.size
                  : (activity.price - currentPrice) * activity.size;

                return (
                  <tr key={activity.id} className="border-b border-gray-700/50">
                    <td className="px-4 py-2 text-gray-100">{activity.domain}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        activity.side === 'buy' ? 'bg-green-600/20 text-green-300' : 'bg-red-600/20 text-red-300'
                      }`}>
                        {activity.side.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-100">{activity.size}</td>
                    <td className="px-4 py-2 text-gray-100">${activity.price.toLocaleString()}</td>
                    <td className={`px-4 py-2 ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-gray-400">{new Date(activity.timestamp).toLocaleDateString('en-US')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
