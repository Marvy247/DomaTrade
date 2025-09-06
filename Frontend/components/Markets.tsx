'use client';

import { useEffect, useState, useMemo } from 'react';
import { marketsData, Market as MarketType, generateOrderbook } from '../lib/mockData';
import { useStore } from '../lib/store';
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
import { useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import DomainFuturesABI from '@/lib/abi/DomainFutures.json';
import type { Abi } from 'viem';
import TradingChart from './TradingChart';

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
  const [priceChange, setPriceChange] = useState<{ direction: 'up' | 'down' | 'neutral'; amount: number }>({ direction: 'neutral', amount: 0 });
  const [sentimentScore, setSentimentScore] = useState(50); // 0-100 scale
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingTrade, setPendingTrade] = useState<{ type: 'buy' | 'sell'; amount: string } | null>(null);
  const { addPosition, addActivity } = useStore();
  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  const { writeContract: buy, isPending: isBuyLoading } = useWriteContract({
    mutation: {
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
      onError: (error: Error) => {
        toast.error(`Error buying domain: ${error.message}`);
      },
    },
  });

  const { writeContract: sell, isPending: isSellLoading } = useWriteContract({
    mutation: {
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
      onError: (error: Error) => {
        toast.error(`Error selling domain: ${error.message}`);
      },
    },
  });

  // Domain extensions mapping
  const domainExtensions = {
    'crypto.eth': { tld: '.eth', category: 'Crypto' },
    'defi.eth': { tld: '.eth', category: 'DeFi' },
    'nft.eth': { tld: '.eth', category: 'NFT' },
    'game.eth': { tld: '.eth', category: 'Gaming' },
    'metaverse.eth': { tld: '.eth', category: 'Metaverse' },
    'ai.eth': { tld: '.eth', category: 'AI' },
    'web3.eth': { tld: '.eth', category: 'Web3' },
    'dao.eth': { tld: '.eth', category: 'DAO' },
    'yield.eth': { tld: '.eth', category: 'Yield' },
    'social.eth': { tld: '.eth', category: 'Social' },
    'music.eth': { tld: '.eth', category: 'Music' },
    'art.eth': { tld: '.eth', category: 'Art' },
    'sports.eth': { tld: '.eth', category: 'Sports' },
    'finance.eth': { tld: '.eth', category: 'Finance' },
    'tech.eth': { tld: '.eth', category: 'Tech' },
  };

  useEffect(() => {
    const loadMarkets = async () => {
      setIsLoading(true);
      try {
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
      } catch (error) {
        toast.error('Failed to load markets');
      } finally {
        setIsLoading(false);
      }
    };
    loadMarkets();
  }, []);

  // WebSocket simulation for real-time price feeds
  useEffect(() => {
    const mockWebSocket = {
      onmessage: null as ((event: { data: string }) => void) | null,
      send: (data: unknown) => {
        // Simulate WebSocket response
        setTimeout(() => {
          if (mockWebSocket.onmessage) {
            mockWebSocket.onmessage({ data: JSON.stringify({
              type: 'price_update',
              market: selectedMarket?.domain,
              price: selectedMarket?.price || 100,
              change: (Math.random() - 0.5) * 2
            }) });
          }
        }, 100);
      }
    };

    const connectWebSocket = () => {
      // Simulate connection
      console.log('WebSocket connected');
      mockWebSocket.send({ type: 'subscribe', market: selectedMarket?.domain });
    };

    if (selectedMarket) {
      connectWebSocket();
    }

    const interval = setInterval(() => {
      setMarkets(prevMarkets =>
        prevMarkets.map(market => {
          const oldPrice = market.price;
          const newPrice = market.price * (1 + (Math.random() - 0.5) * 0.01);
          const priceDiff = newPrice - oldPrice;

          // Update price change indicator
          if (selectedMarket && selectedMarket.domain === market.domain) {
            setPriceChange({
              direction: priceDiff > 0 ? 'up' : priceDiff < 0 ? 'down' : 'neutral',
              amount: Math.abs(priceDiff)
            });

            // Update sentiment score based on price movement
            setSentimentScore(prev => {
              const change = priceDiff > 0 ? 2 : priceDiff < 0 ? -2 : 0;
              return Math.max(0, Math.min(100, prev + change));
            });
          }

          return {
            ...market,
            price: newPrice,
            change24h: market.change24h + (Math.random() - 0.5) * 0.1,
            // Update order book in real-time with more dynamic changes
            orderbook: {
              bids: market.orderbook.bids.map((bid, index) => {
                // Occasionally make larger changes to simulate market activity
                const volatility = Math.random() < 0.1 ? 0.02 : 0.005; // 10% chance of larger movement
                const priceChange = (Math.random() - 0.5) * volatility;
                const quantityChange = Math.random() < 0.2 ? (Math.random() - 0.5) * 50 : (Math.random() - 0.5) * 10;

                return {
                  ...bid,
                  price: Math.max(0.01, bid.price * (1 + priceChange)), // Ensure price doesn't go negative
                  quantity: Math.max(1, bid.quantity + quantityChange) // Ensure quantity stays positive
                };
              }),
              asks: market.orderbook.asks.map((ask, index) => {
                // Occasionally make larger changes to simulate market activity
                const volatility = Math.random() < 0.1 ? 0.02 : 0.005; // 10% chance of larger movement
                const priceChange = (Math.random() - 0.5) * volatility;
                const quantityChange = Math.random() < 0.2 ? (Math.random() - 0.5) * 50 : (Math.random() - 0.5) * 10;

                return {
                  ...ask,
                  price: Math.max(0.01, ask.price * (1 + priceChange)), // Ensure price doesn't go negative
                  quantity: Math.max(1, ask.quantity + quantityChange) // Ensure quantity stays positive
                };
              })
            }
          };
        })
      );

      // Reset price change indicator after animation
      setTimeout(() => setPriceChange({ direction: 'neutral', amount: 0 }), 1000);
    }, 2000);

    return () => {
      clearInterval(interval);
      console.log('WebSocket disconnected');
    };
  }, [selectedMarket]);

  // Keyboard shortcuts for trading actions
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showConfirmDialog) {
        if (event.key === 'Enter') {
          event.preventDefault();
          if (pendingTrade?.type === 'buy') {
            buy({
              address: contractAddress as `0x${string}`,
              abi: DomainFuturesABI.abi as Abi,
              functionName: 'openPosition',
              args: [parseEther(pendingTrade.amount), 1, true],
            });
          } else if (pendingTrade?.type === 'sell') {
            sell({
              address: contractAddress as `0x${string}`,
              abi: DomainFuturesABI.abi as Abi,
              functionName: 'openPosition',
              args: [parseEther(pendingTrade.amount), 1, false],
            });
          }
          setShowConfirmDialog(false);
          setPendingTrade(null);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          setShowConfirmDialog(false);
        }
        return;
      }

      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'b':
            event.preventDefault();
            const buyInput = document.querySelector('input[placeholder*="buy"]') as HTMLInputElement;
            buyInput?.focus();
            break;
          case 's':
            event.preventDefault();
            const sellInput = document.querySelector('input[placeholder*="sell"]') as HTMLInputElement;
            sellInput?.focus();
            break;
        }
      } else if (event.key === 'Escape') {
        setBuyAmount('');
        setSellAmount('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showConfirmDialog, pendingTrade, buy, sell, contractAddress]);

  const handleBuy = () => {
    if (!selectedMarket) {
      toast.error('Please select a market.');
      return;
    }
    const amount = parseFloat(buyAmount);
    if (!buyAmount || isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount greater than 0.');
      return;
    }
    setPendingTrade({ type: 'buy', amount: buyAmount });
    setShowConfirmDialog(true);
  };

  const handleSell = () => {
    if (!selectedMarket) {
      toast.error('Please select a market.');
      return;
    }
    const amount = parseFloat(sellAmount);
    if (!sellAmount || isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount greater than 0.');
      return;
    }
    setPendingTrade({ type: 'sell', amount: sellAmount });
    setShowConfirmDialog(true);
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
    <div className="space-y-6 max-w-full mx-auto">
      {/* Market Overview Header */}
      <div className="bg-gradient-to-r from-blue-900/20 to-teal-900/20 border border-gray-700 rounded-xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-100 flex items-center gap-2">
              {selectedMarket.domain}
              <span className="text-xs sm:text-sm font-normal bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                {selectedMarket.tld}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {domainExtensions[selectedMarket.domain as keyof typeof domainExtensions]?.category || 'General'} Domain
            </p>
          </div>
          <div className="w-full">
            {/* TradingChart - Full width on all screen sizes */}
            <TradingChart selectedMarket={selectedMarket.domain} timeframe={timeframe} />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 sm:mt-6">
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
            <p className={`text-sm sm:text-lg font-semibold transition-all duration-300 ${
              priceChange.direction === 'up' ? 'text-teal-400 animate-pulse' :
              priceChange.direction === 'down' ? 'text-amber-400 animate-pulse' : 'text-teal-400'
            }`}>
              ${bestBid.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400">Best Ask</p>
            <p className={`text-sm sm:text-lg font-semibold transition-all duration-300 ${
              priceChange.direction === 'up' ? 'text-teal-400 animate-pulse' :
              priceChange.direction === 'down' ? 'text-amber-400 animate-pulse' : 'text-amber-400'
            }`}>
              ${bestAsk.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Market Sentiment Gauge */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Market Sentiment</span>
            <span className={`text-xs font-medium ${
              sentimentScore > 60 ? 'text-teal-400' :
              sentimentScore < 40 ? 'text-amber-400' : 'text-gray-400'
            }`}>
              {sentimentScore > 60 ? 'Bullish' : sentimentScore < 40 ? 'Bearish' : 'Neutral'}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                sentimentScore > 60 ? 'bg-teal-400' :
                sentimentScore < 40 ? 'bg-amber-400' : 'bg-gray-400'
              }`}
              style={{ width: `${sentimentScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Market Selector */}
      <div className="bg-gray-800/20 border border-gray-700 rounded-xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-100 flex items-center gap-2">
            <ChartBarIcon className="h-4 w-4 text-blue-400" />
            Domain Markets
          </h3>
          <div className="flex gap-2">
            {['1H', '24H', '7D'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf as '1H' | '24H' | '7D')}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg transition-colors duration-200 ${
                  timeframe === tf ? 'bg-blue-600 text-gray-100' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
                  ? 'border-blue-400 bg-blue-900/20'
                  : 'border-gray-700 bg-gray-800/50 hover:border-blue-500 hover:bg-blue-900/10'
              }`}
            >
              <div className="text-xs sm:text-sm font-semibold text-gray-100">{market.domain}</div>
              <div className={`text-xs transition-all duration-300 ${
                priceChange.direction === 'up' && selectedMarket?.domain === market.domain ? 'text-teal-400 animate-pulse' :
                priceChange.direction === 'down' && selectedMarket?.domain === market.domain ? 'text-amber-400 animate-pulse' :
                'text-gray-400'
              }`}>
                ${market.price.toLocaleString()}
              </div>
              <div className={`text-xs flex items-center gap-1 ${
                market.change24h >= 0 ? 'text-teal-400' : 'text-amber-400'
              }`}>
                {market.change24h >= 0 ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
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
            <ChartBarIcon className="h-4 w-4 text-blue-400" />
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
                key={`${ask.price}-${index}`}
                className="flex justify-between items-center p-3 sm:p-4 bg-amber-500/5 rounded-lg hover:bg-amber-500/10 transition-all duration-300 animate-in slide-in-from-right-2 min-h-[44px]"
              >
                <span className={`text-amber-400 font-medium transition-all duration-300 ${
                  priceChange.direction === 'up' ? 'animate-pulse' : ''
                }`}>
                  ${ask.price.toLocaleString()}
                </span>
                <span className="text-gray-300 transition-all duration-300">{ask.quantity.toFixed(0)}</span>
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
                key={`${bid.price}-${index}`}
                className="flex justify-between items-center p-3 sm:p-4 bg-teal-500/5 rounded-lg hover:bg-teal-500/10 transition-all duration-300 animate-in slide-in-from-left-2 min-h-[44px]"
              >
                <span className={`text-teal-400 font-medium transition-all duration-300 ${
                  priceChange.direction === 'down' ? 'animate-pulse' : ''
                }`}>
                  ${bid.price.toLocaleString()}
                </span>
                <span className="text-gray-300 transition-all duration-300">{bid.quantity.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/20 border border-gray-700 rounded-xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <ChartBarIcon className="h-4 w-4 text-blue-400" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3">
            <input
              type="number"
              step="0.01"
              min="0"
              value={buyAmount}
              onChange={e => setBuyAmount(e.target.value)}
              placeholder="Amount to buy (ETH)"
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 text-base focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200 min-h-[48px]"
            />
            <button
              onClick={handleBuy}
              disabled={isBuyLoading || !buy || !selectedMarket}
              className="w-full bg-teal-600 hover:bg-teal-700 text-gray-100 font-semibold py-3 sm:py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-101 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] text-base"
            >
              {isBuyLoading ? 'Buying...' : `Buy ${selectedMarket.domain}`}
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="number"
              step="0.01"
              min="0"
              value={sellAmount}
              onChange={e => setSellAmount(e.target.value)}
              placeholder="Amount to sell (ETH)"
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 text-base focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200 min-h-[48px]"
            />
            <button
              onClick={handleSell}
              disabled={isSellLoading || !sell || !selectedMarket}
              className="w-full bg-amber-600 hover:bg-amber-700 text-gray-100 font-semibold py-3 sm:py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-101 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] text-base"
            >
              {isSellLoading ? 'Selling...' : `Sell ${selectedMarket.domain}`}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && pendingTrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-100">Confirm {pendingTrade.type === 'buy' ? 'Buy' : 'Sell'} Trade</h2>
            <p className="mb-6 text-gray-300">
              Are you sure you want to {pendingTrade.type} {pendingTrade.amount} {selectedMarket.domain}?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (pendingTrade.type === 'buy') {
                    buy({
                      address: contractAddress as `0x${string}`,
                      abi: DomainFuturesABI.abi as Abi,
                      functionName: 'openPosition',
                      args: [parseEther(pendingTrade.amount), 1, true],
                    });
                  } else {
                    sell({
                      address: contractAddress as `0x${string}`,
                      abi: DomainFuturesABI.abi as Abi,
                      functionName: 'openPosition',
                      args: [parseEther(pendingTrade.amount), 1, false],
                    });
                  }
                  setShowConfirmDialog(false);
                  setPendingTrade(null);
                }}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white transition-colors duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
