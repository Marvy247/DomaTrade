'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { domainFuturesABI } from '../lib/abi/domain-futures';
import toast from 'react-hot-toast';
import { ChartBarIcon, XCircleIcon } from '@heroicons/react/24/solid';
import TradingChart from './TradingChart';
import { marketsData, Market, generateOrderbook } from '../lib/mockData';
import { useStore } from '../lib/store';

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
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop-loss' | 'take-profit'>('market');
  const [limitPrice, setLimitPrice] = useState("");
  const [stopLossPrice, setStopLossPrice] = useState("");
  const [takeProfitPrice, setTakeProfitPrice] = useState("");
  const [riskPercentage, setRiskPercentage] = useState("1");
  const [stopLossDistance, setStopLossDistance] = useState("");
  const [calculatedPositionSize, setCalculatedPositionSize] = useState("");
  const [riskProfile, setRiskProfile] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [accountBalance, setAccountBalance] = useState("10000");
  const [rewardRiskRatio, setRewardRiskRatio] = useState("2");
  const [maxDrawdown, setMaxDrawdown] = useState("5");
  const [kellyMultiplier, setKellyMultiplier] = useState("0.5");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addOrder, addPendingOrder, addPosition, addActivity } = useStore();

  useEffect(() => {
    const generatedMarkets = marketsData.map(market => ({
      ...market,
      orderbook: generateOrderbook(),
    }));
    setMarkets(generatedMarkets);
    setSelectedMarket(generatedMarkets[0]);
  }, []);

  // Risk profile presets
  const riskProfiles = {
    conservative: { riskPercent: 0.5, maxDrawdown: 2 },
    moderate: { riskPercent: 1, maxDrawdown: 5 },
    aggressive: { riskPercent: 2, maxDrawdown: 10 }
  };

  // Position size calculator
  const calculatePositionSize = () => {
    const collateralValue = parseFloat(collateral) || 0;
    const riskPercent = parseFloat(riskPercentage) || 0;
    const stopLossDist = parseFloat(stopLossDistance) || 0;

    if (collateralValue > 0 && riskPercent > 0 && stopLossDist > 0) {
      const riskAmount = collateralValue * (riskPercent / 100);
      const positionSize = riskAmount / stopLossDist;
      setCalculatedPositionSize(positionSize.toFixed(2));
    }
  };

  // Advanced calculators
  const calculateKellyCriterion = () => {
    const winRate = 0.6; // Assume 60% win rate for demo
    const avgWin = parseFloat(rewardRiskRatio) || 2;
    const avgLoss = 1;
    const kelly = (winRate / avgLoss) - ((1 - winRate) / avgWin);
    return Math.max(0, kelly * parseFloat(kellyMultiplier));
  };

  const calculateMaxDrawdownPosition = () => {
    const balance = parseFloat(accountBalance) || 10000;
    const maxDD = parseFloat(maxDrawdown) || 5;
    const riskAmount = balance * (maxDD / 100);
    const stopLossDist = parseFloat(stopLossDistance) || 1;
    return riskAmount / stopLossDist;
  };

  const applyRiskProfile = (profile: 'conservative' | 'moderate' | 'aggressive') => {
    setRiskProfile(profile);
    setRiskPercentage(riskProfiles[profile].riskPercent.toString());
    setMaxDrawdown(riskProfiles[profile].maxDrawdown.toString());
  };

  useEffect(() => {
    calculatePositionSize();
  }, [collateral, riskPercentage, stopLossDistance]);

  const handleOpenPosition = (e: FormEvent) => {
    e.preventDefault();
    const orderData = {
      orderType,
      collateral,
      leverage,
      isLong,
      limitPrice,
      stopLossPrice,
      takeProfitPrice,
      selectedMarket: selectedMarket?.name || '',
    };
    setPendingOrderData(orderData);
    setShowConfirmDialog(true);
  };

  const confirmOpenPosition = async () => {
    if (!pendingOrderData) return;
    const { orderType, collateral, leverage, isLong, limitPrice, stopLossPrice, takeProfitPrice, selectedMarket } = pendingOrderData;
    setIsSubmitting(true);
    try {
      if (orderType === 'market') {
        await writeContractAsync({
          abi: domainFuturesABI,
          address: DOMAIN_FUTURES_ADDRESS,
          functionName: "openPosition",
          args: [BigInt(collateral) * BigInt(1e6), BigInt(leverage), isLong],
        });
        addPosition({
          domain: selectedMarket,
          price: 100 + Math.random() * 50, // Generate a mock price
          size: parseFloat(collateral),
          side: isLong ? 'buy' : 'sell',
        });
        addActivity({
          domain: selectedMarket,
          price: 100 + Math.random() * 50, // Generate a mock price
          size: parseFloat(collateral),
          side: isLong ? 'buy' : 'sell',
          orderType: 'market',
        });
        toast.success("Position opened successfully!");
        setIsSubmitting(false);
        setShowConfirmDialog(false);
        setPendingOrderData(null);
        // Reset input fields after successful submission
        setCollateral("");
        setLimitPrice("");
        setStopLossPrice("");
        setTakeProfitPrice("");
        setRiskPercentage("1");
        setStopLossDistance("");
        setAccountBalance("10000");
        setRewardRiskRatio("2");
        setMaxDrawdown("5");
        setKellyMultiplier("0.5");
        setCalculatedPositionSize("");
      } else {
        // Handle limit, stop-loss, take-profit orders
        const orderPrice = orderType === 'limit' ? parseFloat(limitPrice) :
                          orderType === 'stop-loss' ? parseFloat(stopLossPrice) :
                          parseFloat(takeProfitPrice);

        if (orderType === 'limit') {
          addPendingOrder({
            domain: selectedMarket,
            type: 'limit',
            price: orderPrice,
            size: parseFloat(collateral),
            side: isLong ? 'buy' : 'sell',
          });
        } else {
          addOrder({
            domain: selectedMarket,
            type: orderType,
            price: orderPrice,
            size: parseFloat(collateral),
            side: isLong ? 'buy' : 'sell',
          });
        }
        toast.success(`${orderType.replace('-', ' ')} order created successfully!`);
        setIsSubmitting(false);
        setShowConfirmDialog(false);
        setPendingOrderData(null);
        // Reset input fields after successful submission
        setCollateral("");
        setLimitPrice("");
        setStopLossPrice("");
        setTakeProfitPrice("");
        setRiskPercentage("1");
        setStopLossDistance("");
        setAccountBalance("10000");
        setRewardRiskRatio("2");
        setMaxDrawdown("5");
        setKellyMultiplier("0.5");
        setCalculatedPositionSize("");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Check console for details.");
      setIsSubmitting(false);
      setShowConfirmDialog(false);
      setPendingOrderData(null);
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
                  className="bg-gray-900 border border-gray-700 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  onChange={(e) => setSelectedMarket(markets.find(m => m.name === e.target.value)!)}
                  value={selectedMarket.name}
                >
                  {markets.map(market => (
                    <option key={market.name} value={market.name}>{market.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="order-type" className="block text-sm font-medium text-gray-200">Order Type</label>
                <select
                  id="order-type"
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value as typeof orderType)}
                  className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200"
                >
                  <option value="market">Market Order</option>
                  <option value="limit">Limit Order</option>
                  <option value="stop-loss">Stop-Loss Order</option>
                  <option value="take-profit">Take-Profit Order</option>
                </select>
              </div>
              {orderType === 'limit' && (
                <div>
                  <label htmlFor="limit-price" className="block text-sm font-medium text-gray-200">Limit Price</label>
                  <input
                    id="limit-price"
                    type="text"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200"
                    placeholder="Enter limit price"
                  />
                </div>
              )}
              {orderType === 'stop-loss' && (
                <div>
                  <label htmlFor="stop-loss-price" className="block text-sm font-medium text-gray-200">Stop-Loss Price</label>
                  <input
                    id="stop-loss-price"
                    type="text"
                    value={stopLossPrice}
                    onChange={(e) => setStopLossPrice(e.target.value)}
                    className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200"
                    placeholder="Enter stop-loss price"
                  />
                </div>
              )}
              {orderType === 'take-profit' && (
                <div>
                  <label htmlFor="take-profit-price" className="block text-sm font-medium text-gray-200">Take-Profit Price</label>
                  <input
                    id="take-profit-price"
                    type="text"
                    value={takeProfitPrice}
                    onChange={(e) => setTakeProfitPrice(e.target.value)}
                    className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200"
                    placeholder="Enter take-profit price"
                  />
                </div>
              )}
              <div>
                <label htmlFor="collateral" className="block text-sm font-medium text-gray-200">Collateral (USDC)</label>
                <input
                  id="collateral"
                  type="text"
                  value={collateral}
                  onChange={(e) => setCollateral(e.target.value)}
                  className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200"
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
              <div className="border-t border-gray-600 pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-200 mb-3">Position Sizing Tools</h4>

                {/* Risk Profile Presets */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-300 mb-2">Risk Profile</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => applyRiskProfile('conservative')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        riskProfile === 'conservative'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Conservative
                    </button>
                    <button
                      type="button"
                      onClick={() => applyRiskProfile('moderate')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        riskProfile === 'moderate'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Moderate
                    </button>
                    <button
                      type="button"
                      onClick={() => applyRiskProfile('aggressive')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        riskProfile === 'aggressive'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Aggressive
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="risk-percentage" className="block text-xs font-medium text-gray-300">Risk %</label>
                    <input
                      id="risk-percentage"
                      type="text"
                      value={riskPercentage}
                      onChange={(e) => setRiskPercentage(e.target.value)}
                      className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-lg py-1.5 px-2 text-gray-100 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200"
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label htmlFor="stop-loss-distance" className="block text-xs font-medium text-gray-300">Stop Loss Distance</label>
                    <input
                      id="stop-loss-distance"
                      type="text"
                      value={stopLossDistance}
                      onChange={(e) => setStopLossDistance(e.target.value)}
                      className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-lg py-1.5 px-2 text-gray-100 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200"
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label htmlFor="account-balance" className="block text-xs font-medium text-gray-300">Account Balance</label>
                    <input
                      id="account-balance"
                      type="text"
                      value={accountBalance}
                      onChange={(e) => setAccountBalance(e.target.value)}
                      className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-lg py-1.5 px-2 text-gray-100 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200"
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <label htmlFor="max-drawdown" className="block text-xs font-medium text-gray-300">Max Drawdown %</label>
                    <input
                      id="max-drawdown"
                      type="text"
                      value={maxDrawdown}
                      onChange={(e) => setMaxDrawdown(e.target.value)}
                      className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-lg py-1.5 px-2 text-gray-100 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200"
                      placeholder="5"
                    />
                  </div>
                </div>

                {/* Calculator Results */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {calculatedPositionSize && (
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <p className="text-xs text-gray-300">Risk-Based Position Size:</p>
                      <p className="text-sm font-semibold text-blue-300">{calculatedPositionSize} USDC</p>
                    </div>
                  )}
                  {stopLossDistance && (
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <p className="text-xs text-gray-300">Max DD Position Size:</p>
                      <p className="text-sm font-semibold text-purple-300">{calculateMaxDrawdownPosition().toFixed(2)} USDC</p>
                    </div>
                  )}
                  <div className="p-2 bg-green-600/20 rounded-lg">
                    <p className="text-xs text-gray-300">Kelly Criterion:</p>
                    <p className="text-sm font-semibold text-green-300">{calculateKellyCriterion().toFixed(2)} USDC</p>
                  </div>
                  <div className="p-2 bg-orange-600/20 rounded-lg">
                    <p className="text-xs text-gray-300">Reward/Risk Ratio:</p>
                    <p className="text-sm font-semibold text-orange-300">{rewardRiskRatio}:1</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleOpenPosition}
                className="w-full bg-blue-600 hover:bg-blue-700 text-gray-100 font-semibold py-2 px-4 rounded-lg shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors duration-200"
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
              <ChartBarIcon className="h-5 w-5 text-blue-400" />
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

      {/* Confirmation Dialog */}
      {showConfirmDialog && pendingOrderData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-100">Confirm Trade</h2>
            <div className="mb-4 text-gray-300">
              <p><strong>Market:</strong> {pendingOrderData.selectedMarket}</p>
              <p><strong>Order Type:</strong> {pendingOrderData.orderType}</p>
              <p><strong>Side:</strong> {pendingOrderData.isLong ? 'Long' : 'Short'}</p>
              <p><strong>Collateral:</strong> {pendingOrderData.collateral} USDC</p>
              <p><strong>Leverage:</strong> {pendingOrderData.leverage}x</p>
              {pendingOrderData.orderType === 'limit' && <p><strong>Limit Price:</strong> {pendingOrderData.limitPrice}</p>}
              {pendingOrderData.orderType === 'stop-loss' && <p><strong>Stop-Loss Price:</strong> {pendingOrderData.stopLossPrice}</p>}
              {pendingOrderData.orderType === 'take-profit' && <p><strong>Take-Profit Price:</strong> {pendingOrderData.takeProfitPrice}</p>}
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmOpenPosition}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
