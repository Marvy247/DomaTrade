'use client';

import { useEffect, useState, useMemo } from 'react';
import { marketsData, Market, generateOrderbook } from '@/lib/mockData';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline';

interface ExtendedMarket extends Market {
  domain: string;
  tld: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export default function Markets() {
  const [markets, setMarkets] = useState<ExtendedMarket[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<ExtendedMarket | null>(null);
  const [timeframe, setTimeframe] = useState<'1H' | '24H' | '7D'>('24H');
  const [isLoading, setIsLoading] = useState(true);

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
      
      // Simulate API delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const extendedMarkets: ExtendedMarket[] = marketsData.map((market, index) => {
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
      setSelectedMarket(extendedMarkets[0]);
      setIsLoading(false);
    };
    
    loadMarkets();
  }, []);

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
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!selectedMarket) {
    return <div className="text-center text-gray-400">No markets available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Market Overview Header */}
      <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-gray-700 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              {selectedMarket.domain}
              <span className="text-sm font-normal bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">
                {selectedMarket.tld}
              </span>
            </h1>
            <p className="text-gray-400 mt-1">
              {domainExtensions[selectedMarket.domain as keyof typeof domainExtensions]?.category} Domain
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-white">${selectedMarket.price.toLocaleString()}</p>
              <p className={`text-sm flex items-center gap-1 ${selectedMarket.change24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {selectedMarket.change24h > 0 ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                {Math.abs(selectedMarket.change24h).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400">24h Volume</p>
            <p className="text-lg font-semibold text-white">${(selectedMarket.volume24h / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400">Market Cap</p>
            <p className="text-lg font-semibold text-white">${(selectedMarket.marketCap / 1000000).toFixed(1)}M</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400">Best Bid</p>
            <p className="text-lg font-semibold text-green-400">${bestBid.toLocaleString()}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400">Best Ask</p>
            <p className="text-lg font-semibold text-red-400">${bestAsk.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Market Selector */}
      <div className="bg-gray-800/20 border border-gray-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Domain Markets</h3>
          <div className="flex gap-2">
            {['1H', '24H', '7D'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf as any)}
                className={`px-3 py-1 text-sm rounded ${timeframe === tf ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
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
              className={`p-3 rounded-lg border transition-all ${selectedMarket.domain === market.domain 
                ? 'border-indigo-500 bg-indigo-900/20' 
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'}`}
            >
              <div className="text-sm font-semibold text-white">{market.domain}</div>
              <div className="text-xs text-gray-400">${market.price.toLocaleString()}</div>
              <div className={`text-xs ${market.change24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {market.change24h > 0 ? '+' : ''}{market.change24h.toFixed(2)}%
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Order Book */}
      <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-gray-100">Live Order Book</h3>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">Spread: ${spread.toFixed(2)}</span>
            <div className={`flex items-center gap-1 ${selectedMarket.sentiment === 'bullish' ? 'text-green-400' : selectedMarket.sentiment === 'bearish' ? 'text-red-400' : 'text-gray-400'}`}>
              {selectedMarket.sentiment === 'bullish' && <ArrowTrendingUpIcon className="h-4 w-4" />}
              {selectedMarket.sentiment === 'bearish' && <ArrowTrendingDownIcon className="h-4 w-4" />}
              {selectedMarket.sentiment}
            </div>
          </div>
        </div>
        
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Asks */}
          <div>
            <h4 className="text-md font-semibold text-red-400 mb-3 flex items-center gap-2">
              <FireIcon className="h-4 w-4" />
              Sell Orders (Asks)
            </h4>
            <div className="space-y-1">
              {selectedMarket.orderbook.asks.slice(0, 10).map((ask, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-red-500/5 rounded hover:bg-red-500/10 transition-colors">
                  <span className="text-red-400 font-medium">${ask.price.toLocaleString()}</span>
                  <span className="text-gray-300">{ask.quantity}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Bids */}
          <div>
            <h4 className="text-md font-semibold text-green-400 mb-3 flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              Buy Orders (Bids)
            </h4>
            <div className="space-y-1">
              {selectedMarket.orderbook.bids.slice(0, 10).map((bid, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-green-500/5 rounded hover:bg-green-500/10 transition-colors">
                  <span className="text-green-400 font-medium">${bid.price.toLocaleString()}</span>
                  <span className="text-gray-300">{bid.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/20 border border-gray-700 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
            Buy {selectedMarket.domain}
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
            Sell {selectedMarket.domain}
          </button>
        </div>
      </div>
    </div>
  );
}
