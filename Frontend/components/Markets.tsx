'use client';

import { useEffect, useState, useMemo } from 'react';
import { marketsData, Market, generateOrderbook } from '@/lib/mockData';
import { useStore } from '@/lib/store';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useContractWrite } from 'wagmi';
import { parseEther } from 'viem';
import DomainFuturesABI from '@/lib/abi/DomainFutures.json';

// Define types for mock data
interface Order {
  price: number;
  quantity: number;
}

interface Orderbook {
  bids: Order[];
  asks: Order[];
}

interface Market {
  name: string;
}

interface Position {
  domain: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
}

interface Activity {
  domain: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
}

interface ExtendedMarket extends Market {
  domain: string;
  tld: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  orderbook: Orderbook;
}

const SkeletonLoader = () => (
  <div className="space-y-6 animate-pulse">
    <div className="bg-gray-800/20 border border-gray-700 rounded-xl p-6">
      <div className="h-8 bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-700 rounded w-1/4 mt-2"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-700/50 rounded-lg p-3 h-16"></div>
        <div className="bg-gray-700/50 rounded-lg p-3 h-16"></div>
        <div className="bg-gray-700/50 rounded-lg p-3 h-16"></div>
        <div className="bg-gray-700/50 rounded-lg p-3 h-16"></div>
      </div>
    </div>
    <div className="bg-gray-800/20 border border-gray-700 rounded-xl p-4">
      <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-gray-700/50 rounded-lg h-20"></div>
        <div className="bg-gray-700/50 rounded-lg h-20"></div>
        <div className="bg-gray-700/50 rounded-lg h-20"></div>
        <div className="bg-gray-700/50 rounded-lg h-20"></div>
        <div className="bg-gray-700/50 rounded-lg h-20"></div>
      </div>
    </div>
  </div>
);

export default function Markets() {
  const [markets, setMarkets] = useState<ExtendedMarket[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<ExtendedMarket | null>(null);
  const [timeframe, setTimeframe] = useState<'1H' | '24H' | '7D'>('24H');
  const [isLoading, setIsLoading] = useState(true);
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const { addPosition, addActivity } = useStore();
  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  const { write: buy, isLoading: isBuyLoading } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: DomainFuturesABI,
    functionName: 'openPosition',
    onSuccess: () => {
      if (!selectedMarket) return;
      toast.success(`Successfully bought ${buyAmount} ${selectedMarket.domain}`);
      addPosition({
        domain: selectedMarket.domain,
        price: selectedMarket.price,
        size: parseFloat(buyAmount),
        side: 'buy',
      });
      addActivity({
        domain: selectedMarket.domain,
        price: selectedMarket.price,
        size: parseFloat(buyAmount),
        side: 'buy',
      });
      setBuyAmount('');
    },
    onError: (error) => {
      toast.error(`Error buying domain: ${error.message}`);
    },
  });

  const { write: sell, isLoading: isSellLoading } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: DomainFuturesABI,
    functionName: 'openPosition',
    onSuccess: () => {
      if (!selectedMarket) return;
      toast.success(`Successfully sold ${sellAmount} ${selectedMarket.domain}`);
      addPosition({
        domain: selectedMarket.domain,
        price: selectedMarket.price,
        size: parseFloat(sellAmount),
        side: 'sell',
      });
      addActivity({
        domain: selectedMarket.domain,
        price: selectedMarket.price,
        size: parseFloat(sellAmount),
        side: 'sell',
      });
      setSellAmount('');
    },
    onError: (error) => {
      toast.error(`Error selling domain: ${error.message}`);
    },
  });

  // Domain extensions mapping
  const domainExtensions = {
    'crypto.eth': { tld: '.eth', category: 'Crypto' },
    'defi.eth': { tld: '.eth', category: 'DeFi' },
    'nft.eth': { tld: '.eth', category: 'NFT' },
    'game.eth': { tld: '.eth', category: 'Gaming' },
    'metaverse.eth': { tld: '.eth', category: 'Metaverse' },
  };

  useEffect(() => {
    const loadMarkets = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const extendedMarkets: ExtendedMarket[] = marketsData.map((market) => {
        const sentimentValue: 'bullish' | 'bearish' | 'neutral' = Math.random() > 0.5 ? 'bullish' : Math.random() > 0.3 ? 'bearish' : 'neutral';
        return {
          ...market,
          domain: market.name,
          tld: domainExtensions[market.name as keyof typeof domainExtensions]?.tld || '.eth',
          price: 100 + Math.random() * 900,
          change24h: (Math.random() - 0.5) * 20,
          volume24h: Math.random() * 1000000,
          marketCap: Math.random() * 50000000,
          sentiment: sentimentValue,
          orderbook: generateOrderbook(),
        };
      });
      setMarkets(extendedMarkets);
      setSelectedMarket(extendedMarkets[0] || null);
      setIsLoading(false);
    };
    loadMarkets();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets(prevMarkets =>
        prevMarkets.map(market => ({
          ...market,
          price: market.price * (1 + (Math.random() - 0.5) * 0.01),
          change24h: market.change24h + (Math.random() - 0.5) * 0.1,
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleBuy = () => {
    if (!buy || !selectedMarket || !buyAmount || parseFloat(buyAmount) <= 0) {
      toast.error('Please select a market and enter a valid amount.');
      return;
    }
    buy({ args: [selectedMarket?.domain || '', parseEther(buyAmount || '0'), true] });
  };

  const handleSell = () => {
    if (!sell || !selectedMarket || !sellAmount || parseFloat(sellAmount) <= 0) {
      toast.error('Please select a market and enter a valid amount.');
      return;
    }
    sell({ args: [selectedMarket?.domain || '', parseEther(sellAmount || '0'), false] });
  };

  const bestBid = useMemo(() => {
    if (!selectedMarket) return 0;
    return Math.max(...selectedMarket.orderbook.bids.map(b => b.price));
  }, [selectedMarket]);

  const bestAsk = useMemo(() => {
    if (!selectedMarket) return 0;
    return Math.min(...selectedMarket.orderbook.asks.map(a => a.price));
  }, [selectedMarket]);

  const spread = useMemo(() => {
    if (!bestBid || !bestAsk) return 0;
    return bestAsk - bestBid;
  }, [bestBid, bestAsk]);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (!selectedMarket) {
    return <div className="text-center text-gray-400">No markets available</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Market Overview Header */}
      <div className="bg-gradient-to-r from-indigo-900/20 to-teal-900/20 border border-gray-700 rounded-xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-100 flex items-center gap-2">
              {selectedMarket.domain}
              <span className="text-xs sm:text-sm font-normal bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">
                {selectedMarket.tld}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {domainExtensions[selectedMarket.domain as keyof typeof domainExtensions]?.category || 'General'} Domain
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-lg sm:text-xl font-bold text-gray-100">${selectedMarket.price.toLocaleString()}</p>
              <p className={`text-xs sm:text-sm flex items-center gap-1 ${selectedMarket.change24h >= 0 ? 'text-teal-400' : 'text-amber-400'}`}>
                {selectedMarket.change24h >= 0 ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                {Math.abs(selectedMarket.change24h).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400">24h Volume</p>
            <p className="text-sm sm:text-lg font-semibold text-gray-100">${(selectedMarket.volume24h / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400">Market Cap</p>
            <p className="text-sm sm:text-lg font-semibold text-gray-100">${(selectedMarket.marketCap / 1000000).toFixed(1)}M</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400">Best Bid</p>
            <p className="text-sm sm:text-lg font-semibold text-teal-400">${bestBid.toLocaleString()}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400">Best Ask</p>
            <p className="text-sm sm:text-lg font-semibold text-amber-400">${bestAsk.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Market Selector */}
      <div className="bg-gray-800/20 border border-gray-700 rounded-xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-100 flex items-center gap-2">
            <ChartBarIcon className="h-4 w-4 text-indigo-400" />
            Domain Markets
          </h3>
          <div className="flex gap-2">
            {['1H', '24H', '7D'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf as '1H' | '24H' | '7D')}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg transition-colors duration-200 ${
                  timeframe === tf ? 'bg-indigo-600 text-gray-100' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {markets.map(market => (
            <button
              key={market.domain}
              onClick={() => setSelectedMarket(market)}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                selectedMarket && selectedMarket.domain === market.domain
                  ? 'border-indigo-400 bg-indigo-900/20'
                  : 'border-gray-700 bg-gray-800/50 hover:border-indigo-500 hover:bg-indigo-900/10'
              }`}
            >
              <div className="text-xs sm:text-sm font-semibold text-gray-100">{market.domain}</div>
              <div className="text-xs text-gray-400">${market.price.toLocaleString()}</div>
              <div className={`text-xs ${market.change24h >= 0 ? 'text-teal-400' : 'text-amber-400'}`}>
                {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Order Book */}
      <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm">
        <div className="p-4 sm:p-6 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChartBarIcon className="h-4 w-4 text-indigo-400" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-100">Live Order Book</h3>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <span className="text-gray-400">Spread: ${spread.toFixed(2)}</span>
            <div
              className={`flex items-center gap-1 ${
                selectedMarket.sentiment === 'bullish'
                  ? 'text-teal-400'
                  : selectedMarket.sentiment === 'bearish'
                    ? 'text-amber-400'
                    : 'text-gray-400'
              }`}
            >
              {selectedMarket.sentiment === 'bullish' && <ArrowTrendingUpIcon className="h-4 w-4" />}
              {selectedMarket.sentiment === 'bearish' && <ArrowTrendingDownIcon className="h-4 w-4" />}
              {selectedMarket.sentiment.charAt(0).toUpperCase() + selectedMarket.sentiment.slice(1)}
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Asks */}
          <div>
            <h4 className="text-sm sm:text-md font-semibold text-amber-400 mb-3 flex items-center gap-2">
              <FireIcon className="h-4 w-4" />
              Sell Orders (Asks)
            </h4>
            <div className="space-y-1">
              {selectedMarket.orderbook.asks.slice(0, 10).map((ask, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-amber-500/5 rounded-lg hover:bg-amber-500/10 transition-colors duration-200"
                >
                  <span className="text-amber-400 font-medium">${ask.price.toLocaleString()}</span>
                  <span className="text-gray-300">{ask.quantity}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Bids */}
          <div>
            <h4 className="text-sm sm:text-md font-semibold text-teal-400 mb-3 flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              Buy Orders (Bids)
            </h4>
            <div className="space-y-1">
              {selectedMarket.orderbook.bids.slice(0, 10).map((bid, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-teal-500/5 rounded-lg hover:bg-teal-500/10 transition-colors duration-200"
                >
                  <span className="text-teal-400 font-medium">${bid.price.toLocaleString()}</span>
                  <span className="text-gray-300">{bid.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/20 border border-gray-700 rounded-xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <ChartBarIcon className="h-4 w-4 text-indigo-400" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <input
              type="number"
              value={buyAmount}
              onChange={e => setBuyAmount(e.target.value)}
              placeholder="Amount to buy (ETH)"
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:ring-indigo-400 focus:border-indigo-400 transition-colors duration-200"
            />
            <button
              onClick={handleBuy}
              disabled={isBuyLoading || !buy}
              className="w-full bg-teal-600 hover:bg-teal-700 text-gray-100 font-semibold py-2 sm:py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBuyLoading ? 'Buying...' : `Buy ${selectedMarket.domain}`}
            </button>
          </div>
          <div className="space-y-2">
            <input
              type="number"
              value={sellAmount}
              onChange={e => setSellAmount(e.target.value)}
              placeholder="Amount to sell (ETH)"
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:ring-indigo-400 focus:border-indigo-400 transition-colors duration-200"
            />
            <button
              onClick={handleSell}
              disabled={isSellLoading || !sell}
              className="w-full bg-amber-600 hover:bg-amber-700 text-gray-100 font-semibold py-2 sm:py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSellLoading ? 'Selling...' : `Sell ${selectedMarket.domain}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
