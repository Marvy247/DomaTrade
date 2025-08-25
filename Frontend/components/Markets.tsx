'use client';

import { useEffect, useState } from 'react';
import { marketsData, Market, generateOrderbook } from '@/lib/mockData';
import { ChartBarIcon } from '@heroicons/react/24/outline';

export default function Markets() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  useEffect(() => {
    const generatedMarkets = marketsData.map(market => ({
      ...market,
      orderbook: generateOrderbook(),
    }));
    setMarkets(generatedMarkets);
    setSelectedMarket(generatedMarkets[0]);
  }, []);

  if (!selectedMarket) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm mx-auto max-w-6xl">
      <div className="p-4 sm:p-6 border-b border-gray-700 flex justify-between items-center">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-100 flex items-center gap-2">
            <ChartBarIcon className="h-4 w-4 text-indigo-400" />
            Order Book
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Live order book for {selectedMarket.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="market-select" className="text-sm font-medium text-gray-300">Market:</label>
          <select
            id="market-select"
            className="bg-gray-900 border border-gray-700 text-gray-100 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            onChange={(e) => setSelectedMarket(markets.find(m => m.name === e.target.value)!)}
            value={selectedMarket.name}
          >
            {markets.map(market => (
              <option key={market.name} value={market.name}>{market.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-md font-semibold text-red-400 mb-4 text-center">Asks</h4>
          <div className="overflow-y-auto h-96 pr-2">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-red-400">
                  <th className="pb-3 px-2 sm:px-4 font-medium">Price (USD)</th>
                  <th className="pb-3 px-2 sm:px-4 font-medium text-right">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {selectedMarket.orderbook.asks.map((ask, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50 transition-all duration-200 relative">
                    <td className="py-2 px-2 sm:px-4 text-gray-100 relative">
                      <div className="absolute top-0 left-0 h-full bg-red-500/10" style={{ width: `${(ask.quantity / 1100) * 100}%` }}></div>
                      <span className="relative z-10">{ask.price.toLocaleString()}</span>
                    </td>
                    <td className="py-2 px-2 sm:px-4 text-gray-100 text-right">{ask.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold text-green-400 mb-4 text-center">Bids</h4>
          <div className="overflow-y-auto h-96 pr-2">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-green-400">
                  <th className="pb-3 px-2 sm:px-4 font-medium">Price (USD)</th>
                  <th className="pb-3 px-2 sm:px-4 font-medium text-right">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {selectedMarket.orderbook.bids.map((bid, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50 transition-all duration-200 relative">
                    <td className="py-2 px-2 sm:px-4 text-gray-100 relative">
                      <div className="absolute top-0 left-0 h-full bg-green-500/10" style={{ width: `${(bid.quantity / 1100) * 100}%` }}></div>
                      <span className="relative z-10">{bid.price.toLocaleString()}</span>
                    </td>
                    <td className="py-2 px-2 sm:px-4 text-gray-100 text-right">{bid.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
