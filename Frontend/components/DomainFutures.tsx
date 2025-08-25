"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { domainFuturesABI } from "@/lib/abi/domain-futures";
import { FormEvent, useState } from "react";
import toast from 'react-hot-toast';
import { ChartBarIcon, XCircleIcon } from '@heroicons/react/24/solid';

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
  const [leverage, setLeverage] = useState("");
  const [isLong, setIsLong] = useState(true);

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

  return (
    <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
          <ChartBarIcon className="h-5 w-5 text-indigo-400" />
          Trade Domain Futures
        </h3>
        <p className="text-sm text-gray-400 mt-1">Open a leveraged position on domain assets</p>
      </div>
      <div className="p-6">
        <form onSubmit={handleOpenPosition} className="flex flex-col gap-y-4">
          <div>
            <label htmlFor="collateral" className="block text-sm font-medium text-gray-200">Collateral Amount (USDC)</label>
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
              type="text"
              value={leverage}
              onChange={(e) => setLeverage(e.target.value)}
              className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors duration-200"
              placeholder="5"
            />
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
      {position && position[0] > 0 && (
        <div className="p-6 border-t border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100">Your Active Position</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Size</p>
              <p className="text-gray-100 font-semibold">{String(position[0] / BigInt(1e6))} USDC</p>
            </div>
            <div>
              <p className="text-gray-400">Entry Price</p>
              <p className="text-gray-100 font-semibold">{String(position[1] / BigInt(1e6))} USDC</p>
            </div>
            <div>
              <p className="text-gray-400">Direction</p>
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
      )}
    </div>
  );
}