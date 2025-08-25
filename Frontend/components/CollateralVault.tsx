"use client";

import { useAccount, useBalance, useWriteContract } from "wagmi";
import { collateralVaultABI } from "@/lib/abi/collateral-vault";
import { mockUSDCABI } from "@/lib/abi/mock-usdc";
import { FormEvent, useState } from "react";
import toast from 'react-hot-toast';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid';

const MOCK_USDC_ADDRESS = "0x7880dd858Bedfb3Acc34006d7Ab96b3c152DF9DF";
const COLLATERAL_VAULT_ADDRESS = "0x1E967705de6B18F8FC0b15697C86Fbe6010bE581";

export function CollateralVault() {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: MOCK_USDC_ADDRESS,
  });
  const { writeContractAsync } = useWriteContract();

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
    <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
          <ArrowDownIcon className="h-5 w-5 text-indigo-400" />
          Collateral Vault
        </h3>
        <p className="text-sm text-gray-400 mt-1">Balance: {balance?.formatted || '0.0'} USDC</p>
      </div>
      <div className="p-6">
        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setAction('deposit')}
            className={`flex-1 py-2 text-sm font-semibold transition-colors duration-200 ${
              action === 'deposit'
                ? 'border-b-2 border-indigo-400 text-indigo-400'
                : 'text-gray-400 hover:text-gray-100 hover:bg-gray-700/50'
            }`}
          >
            <ArrowDownIcon className="h-5 w-5 inline mr-2" />
            Deposit
          </button>
          <button
            onClick={() => setAction('withdraw')}
            className={`flex-1 py-2 text-sm font-semibold transition-colors duration-200 ${
              action === 'withdraw'
                ? 'border-b-2 border-indigo-400 text-indigo-400'
                : 'text-gray-400 hover:text-gray-100 hover:bg-gray-700/50'
            }`}
          >
            <ArrowUpIcon className="h-5 w-5 inline mr-2" />
            Withdraw
          </button>
        </div>
        <form onSubmit={handleAction} className="flex flex-col gap-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-200">Amount (USDC)</label>
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors duration-200"
              placeholder="0.0"
            />
          </div>
          <button
            type="submit"
            className={`w-full text-gray-100 font-semibold py-2 px-4 rounded-lg shadow-md focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
              action === 'deposit'
                ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400'
                : 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-400'
            }`}
          >
            {action === 'deposit' ? 'Deposit' : 'Withdraw'}
          </button>
        </form>
      </div>
    </div>
  );
}