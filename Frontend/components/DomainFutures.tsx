'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { domainFuturesABI } from '@/lib/abi/domain-futures';
import toast from 'react-hot-toast';
import { ChartBarIcon, XCircleIcon } from '@heroicons/react/24/solid';
import TradingChart from './TradingChart';
import { marketsData, Market, generateOrderbook } from '@/lib/mockData';

const DOMAIN_FUTURES_ADDRESS = "0x2cb425975626593A35D570C6E0bCEe53fca1eaFE";

export default function DomainFutures() {
  const { address } = useAccount();
  const { data: position } = useReadContract({
    abi: domainFuturesABI,
    address: DOMAIN_FUTURES_ADDRESS,
    functionName: "positions",
    args: [address!],
  });
  const { writeContractAsync } = useWriteContract();

  const [collateral, setCollateral] = useState("");
  const [leverage, setLeverage] = useState("10");
  const [isLong, setIsLong] = useState(true);
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

  const handleOpenPosition = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await writeContractAsync({
        abi: domainFuturesABI,
        address: DOMAIN_FUTURES_ADDRESS,
        functionName: "openPosition",
        args: [BigInt(collateral) * BigInt(1e6), BigInt(leverage), isLong],
      });
      toast.success("Position opened successfully!");
    } catch (error) {
      console.error("Error opening position:", error);
      toast.error("Failed to open position. Check console for details.");
    }
  };

  const handleClosePosition = async () => {
    try {
      await writeContractAsync({
        abi: domainFuturesABI,
        address: DOMAIN_FUTURES_ADDRESS,
        functionName: "closePosition",
      });
      toast.success("Position closed successfully!");
    } catch (error) {
      console.error("Error closing position:", error);
      toast.error("Failed to close position. Check console for details.");
    }
  };

  if (!selectedMarket) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-3">
        <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm h-full">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-gray-100">Trade</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleOpenPosition} className="flex flex-col gap-y-4">
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
              <div>
                <label htmlFor="collateral" className="block text-sm font-medium text-gray-200">Collateral (USDC)</label>
                <input
                  id="collateral"
                  type="text"
                  value={collateral}
                  onChange={(e) => setCollateral(e.target.value)}
                  className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors duration-200"
                  placeholder="1000"
                />
              </div>
              <div>
                <label htmlFor="leverage" className="block text-sm font-medium text-gray-200">Leverage</label>
                <input
                  id="leverage"
                  type="range"
                  min="1"
                  max="100"
                  value={leverage}
                  onChange={(e) => setLeverage(e.target.value)}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center text-gray-300 text-sm mt-1">{leverage}x</div>
              </div>
              <div className="flex gap-x-4">
                <button
                  type="button"
                  onClick={() => setIsLong(true)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                    isLong ? 'bg-teal-600 text-gray-100' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  Long
                </button>
                <button
                  type="button"
                  onClick={() => setIsLong(false)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                    !isLong ? 'bg-amber-600 text-gray-100' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  Short
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-gray-100 font-semibold py-2 px-4 rounded-lg shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-colors duration-200"
              >
                Open Position
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="lg:col-span-6">
        <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm h-full">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5 text-indigo-400" />
              {selectedMarket.name} Chart
            </h3>
          </div>
          <div className="p-6 bg-gray-900">
            <TradingChart />
          </div>
        </div>
      </div>
      <div className="lg:col-span-3">
        <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm h-full">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-gray-100">Order Book</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h4 className="text-md font-semibold text-red-400 mb-2 text-center">Asks</h4>
                <div className="overflow-y-auto h-64 pr-2">
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
                <h4 className="text-md font-semibold text-green-400 mb-2 text-center">Bids</h4>
                <div className="overflow-y-auto h-64 pr-2">
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
        </div>
      </div>
      {position && position[0] > 0 && (
        <div className="lg:col-span-12 mt-6">
          <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-gray-100">Your Active Position</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Size</p>
                  <p className="text-gray-100 font-semibold">{String(position[0] / BigInt(1e6))} USDC</p>
                </div>
                <div>
                  <p className="text-gray-400">Entry Price</p>
                  <p className="text-gray-100 font-semibold">{String(position[1] / BigInt(1e6))} USDC</p>
                </div>
                <div>
                  <p className={`font-semibold ${position[2] ? 'text-teal-400' : 'text-amber-400'}`}>{position[2] ? "Long" : "Short"}</p>
                </div>
              </div>
              <button
                onClick={handleClosePosition}
                className="mt-6 w-full bg-red-600 hover:bg-red-700 text-gray-100 font-semibold py-2 px-4 rounded-lg shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <XCircleIcon className="h-5 w-5" />
                Close Position
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
