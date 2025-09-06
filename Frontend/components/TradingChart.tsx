'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, LineStyle } from 'lightweight-charts';
import { generateChartData, ChartData, generateRealtimeData } from '@/lib/mockData';

interface TradingChartProps {
  selectedMarket?: string;
  timeframe?: string;
}

export default function TradingChart({ selectedMarket = 'crypto.eth', timeframe = '1D' }: TradingChartProps) {
  const [currentTimeframe, setCurrentTimeframe] = useState(timeframe);
  const [currentMarket, setCurrentMarket] = useState(selectedMarket);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentMarket(selectedMarket);
  }, [selectedMarket]);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const rsiSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const macdSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const smaSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      const isMobile = window.innerWidth < 768;
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: isMobile ? 300 : 400,
      });

      chartRef.current.applyOptions({
        layout: {
          background: { color: '#131722' },
          textColor: '#d1d5db',
        },
        grid: {
          vertLines: {
            color: '#334155',
          },
          horzLines: {
            color: '#334155',
          },
        },
        timeScale: {
          borderColor: '#485c7b',
          rightOffset: 12,
          fixRightEdge: true,
          timeVisible: true,
          secondsVisible: false,
        },
        rightPriceScale: {
          borderColor: '#485c7b',
        },
        crosshair: {
          mode: 1, // CrosshairMode.Normal
        },
      });

      candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderDownColor: '#ef4444',
        borderUpColor: '#22c55e',
        wickDownColor: '#ef4444',
        wickUpColor: '#22c55e',
      });

      // Add RSI indicator
      rsiSeriesRef.current = chartRef.current.addLineSeries({
        color: '#f59e0b',
        lineWidth: 2,
        title: 'RSI',
      });

      // Add MACD indicator
      macdSeriesRef.current = chartRef.current.addLineSeries({
        color: '#8b5cf6',
        lineWidth: 2,
        title: 'MACD',
      });

      // Add SMA indicator
      smaSeriesRef.current = chartRef.current.addLineSeries({
        color: '#06b6d4',
        lineWidth: 2,
        title: 'SMA',
      });

      candlestickSeriesRef.current.setData(generateChartData(currentMarket));
      // Set mock data for indicators (in a real app, calculate from price data)
      rsiSeriesRef.current.setData(generateChartData(currentMarket).map(d => ({ time: d.time, value: 50 + Math.random() * 50 })));
      macdSeriesRef.current.setData(generateChartData(currentMarket).map(d => ({ time: d.time, value: (Math.random() - 0.5) * 10 })));
      smaSeriesRef.current.setData(generateChartData(currentMarket).map(d => ({ time: d.time, value: 100 + Math.random() * 50 })));
    }

      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          const isMobile = window.innerWidth < 768;
          chartRef.current.resize(chartContainerRef.current.clientWidth, isMobile ? 300 : 400);
        }
      };

      window.addEventListener('resize', handleResize);

      // Simulate real-time data update every 2 seconds
      const interval = setInterval(() => {
        if (candlestickSeriesRef.current && chartRef.current) {
          const newData = generateRealtimeData();
          candlestickSeriesRef.current.update(newData);
          // Update indicators with mock data
          rsiSeriesRef.current?.update({ time: newData.time, value: 50 + Math.random() * 50 });
          macdSeriesRef.current?.update({ time: newData.time, value: (Math.random() - 0.5) * 10 });
          smaSeriesRef.current?.update({ time: newData.time, value: 100 + Math.random() * 50 });

          // Scroll to the latest data point
          chartRef.current.timeScale().scrollToPosition(0, true);
        }
      }, 2000);

      return () => {
        window.removeEventListener('resize', handleResize);
        clearInterval(interval);
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }
      };
    }, [currentTimeframe, currentMarket]);

  return (
    <>
      {/* Current Market Display */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
              {currentMarket.charAt(0).toUpperCase() + currentMarket.slice(1).replace('.eth', '')}
              <span className="text-sm font-normal text-blue-400 ml-2">.eth</span>
            </h2>
            <div className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
              Domain Futures
            </div>
          </div>
          <select
            value={currentMarket}
            onChange={(e) => setCurrentMarket(e.target.value)}
            className="bg-gray-700 text-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200"
          >
            {[
              'crypto.eth', 'defi.eth', 'nft.eth', 'game.eth', 'metaverse.eth',
              'ai.eth', 'web3.eth', 'dao.eth', 'yield.eth', 'social.eth',
              'music.eth', 'art.eth', 'sports.eth', 'finance.eth', 'tech.eth'
            ].map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeframe Buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        {['1m', '5m', '1H', '1D', '1W'].map((tf) => (
          <button
            key={tf}
            onClick={() => setCurrentTimeframe(tf)}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${
              currentTimeframe === tf ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      <div ref={chartContainerRef} className="w-full h-[300px] sm:h-[400px] lg:h-[500px]" />
    </>
  );
}
