"use client";

import { useAccount, useBalance, useWriteContract, useReadContract } from "wagmi";
import { collateralVaultABI } from "../lib/abi/collateral-vault";
import { mockUSDCABI } from "../lib/abi/mock-usdc";
import { FormEvent, useState } from "react";
import toast from 'react-hot-toast';
import { ArrowDownIcon, ArrowUpIcon, BanknotesIcon, ShieldCheckIcon, ChartBarIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';

const MOCK_USDC_ADDRESS = "0x7880dd858Bedfb3Acc34006d7Ab96b3c152DF9DF";
const COLLATERAL_VAULT_ADDRESS = "0x1E967705de6B18F8FC0b15697C86Fbe6010bE581";

export function CollateralVault() {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: MOCK_USDC_ADDRESS,
  });
  const { writeContractAsync } = useWriteContract();

  // Mock vault statistics for better UI
  const vaultStats = {
    totalDeposited: "12500.00",
    availableToWithdraw: "8500.00",
    interestEarned: "245.67",
    utilizationRate: "68%"
  };

  const [amount, setAmount] = useState("");
  const [action, setAction] = useState("deposit");

  const handleAction = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (action === "deposit") {
        await writeContractAsync({
          abi: mockUSDCABI,
          address: MOCK_USDC_ADDRESS,
          functionName: "approve",
          args: [COLLATERAL_VAULT_ADDRESS, BigInt(amount) * BigInt(1e6)],
        });
        await writeContractAsync({
          abi: collateralVaultABI,
          address: COLLATERAL_VAULT_ADDRESS,
          functionName: "deposit",
          args: [BigInt(amount) * BigInt(1e6)],
        });
        toast.success("Deposit successful!");
      } else {
        await writeContractAsync({
          abi: collateralVaultABI,
          address: COLLATERAL_VAULT_ADDRESS,
          functionName: "withdraw",
          args: [BigInt(amount) * BigInt(1e6)],
        });
        toast.success("Withdrawal successful!");
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      toast.error(`Failed to ${action}. Check console for details.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Vault Header */}
      <div className="bg-gradient-to-r from-slate-900/80 to-gray-900/80 border border-gray-700 rounded-xl shadow-2xl backdrop-blur-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/20 rounded-xl">
                <BanknotesIcon className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-100">Secure Collateral Vault</h1>
                <p className="text-gray-400 text-sm">Your digital asset fortress</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400 uppercase tracking-wide">Vault Status</div>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4 text-green-400" />
                <span className="text-green-400 font-semibold">Protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vault Statistics */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-2">
                <CurrencyDollarIcon className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-gray-400 uppercase">Total Deposited</span>
              </div>
              <div className="text-xl font-bold text-gray-100">${vaultStats.totalDeposited}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpIcon className="h-4 w-4 text-green-400" />
                <span className="text-xs text-gray-400 uppercase">Available</span>
              </div>
              <div className="text-xl font-bold text-gray-100">${vaultStats.availableToWithdraw}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-2">
                <ChartBarIcon className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-gray-400 uppercase">Interest Earned</span>
              </div>
              <div className="text-xl font-bold text-green-400">+${vaultStats.interestEarned}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-2">
                <ClockIcon className="h-4 w-4 text-orange-400" />
                <span className="text-xs text-gray-400 uppercase">Utilization</span>
              </div>
              <div className="text-xl font-bold text-gray-100">{vaultStats.utilizationRate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Panel */}
      <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gray-900/50 rounded-lg p-1 flex">
              <button
                onClick={() => setAction('deposit')}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  action === 'deposit'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-gray-700/50'
                }`}
              >
                <ArrowDownIcon className="h-4 w-4" />
                Deposit
              </button>
              <button
                onClick={() => setAction('withdraw')}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  action === 'withdraw'
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-gray-700/50'
                }`}
              >
                <ArrowUpIcon className="h-4 w-4" />
                Withdraw
              </button>
            </div>
          </div>

          <form onSubmit={handleAction} className="max-w-md mx-auto space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-200 mb-2">
                Amount (USDC)
              </label>
              <div className="relative">
                <input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-3 px-4 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 text-lg"
                  placeholder="0.00"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                  USDC
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Available: {balance?.formatted || '0.00'} USDC
              </p>
            </div>

            <button
              type="submit"
              className={`w-full text-white font-semibold py-3 px-6 rounded-lg shadow-lg focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 ${
                action === 'deposit'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-400'
                  : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 focus:ring-amber-400'
              }`}
            >
              {action === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
            </button>
          </form>

          {/* Recent Activity */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-blue-400" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
                    <ArrowDownIcon className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-100">Deposit</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-green-400">+1,000 USDC</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                    <ChartBarIcon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-100">Interest Earned</p>
                    <p className="text-xs text-gray-400">1 day ago</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-blue-400">+12.45 USDC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}