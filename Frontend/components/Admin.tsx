"use client";

import { useWriteContract } from "wagmi";
import { oracleAdapterABI } from "@/lib/abi/oracle-adapter";
import { domainFuturesABI } from "@/lib/abi/domain-futures";
import { FormEvent, useState } from "react";
import { stringToBytes32 } from "@/lib/utils";
import toast from 'react-hot-toast';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

const ORACLE_ADAPTER_ADDRESS = "0x2a3C594853706B43893F3f977815B03F622af78b";
const DOMAIN_FUTURES_ADDRESS = "0x2cb425975626593A35D570C6E0bCEe53fca1eaFE";
const DOMAIN_ID: `0x${string}` = stringToBytes32("hackathon.doma") as `0x${string}`;

export default function Admin() {
  const { writeContractAsync } = useWriteContract();
  const [price, setPrice] = useState("");
  const [userToLiquidate, setUserToLiquidate] = useState<`0x${string}`>("0x");

  const handleSetPrice = async (e: FormEvent) => {
    e.preventDefault();
    
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid positive price");
      return;
    }
    
    const scaledPrice = Math.round(priceNum * 1e6);
    
    try {
      await writeContractAsync({
        abi: oracleAdapterABI,
        address: ORACLE_ADAPTER_ADDRESS,
        functionName: "setPrice",
        args: [DOMAIN_ID, BigInt(scaledPrice)],
      });
      toast.success("Price updated successfully!");
    } catch (error) {
      console.error("Error setting price:", error);
      toast.error("Failed to set price. Check console for details.");
    }
  };

  const handleLiquidate = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!userToLiquidate || !userToLiquidate.startsWith("0x") || userToLiquidate.length !== 42) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }
    
    try {
      await writeContractAsync({
        abi: domainFuturesABI,
        address: DOMAIN_FUTURES_ADDRESS,
        functionName: "liquidate",
        args: [userToLiquidate as `0x${string}`],
      });
      toast.success("User liquidated successfully!");
    } catch (error) {
      console.error("Error liquidating user:", error);
      toast.error("Failed to liquidate user. Check console for details.");
    }
  };

  return (
    <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
          <ShieldCheckIcon className="h-5 w-5 text-indigo-400" />
          Admin Panel
        </h3>
        <p className="text-sm text-gray-400 mt-1">Manage system settings (authorized users only)</p>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSetPrice} className="flex flex-col gap-y-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-200">Set Oracle Price</label>
            <input
              id="price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors duration-200"
              placeholder="Enter price (e.g., 100.50)"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-gray-100 font-semibold py-2 px-4 rounded-lg shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-colors duration-200"
          >
            Set Price
          </button>
        </form>
        <form onSubmit={handleLiquidate} className="flex flex-col gap-y-4">
          <div>
            <label htmlFor="liquidate" className="block text-sm font-medium text-gray-200">Liquidate User</label>
            <input
              id="liquidate"
              type="text"
              value={userToLiquidate}
              onChange={(e) => setUserToLiquidate(e.target.value as `0x${string}`)}
              className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors duration-200"
              placeholder="User Address (0x...)"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-gray-100 font-semibold py-2 px-4 rounded-lg shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 transition-colors duration-200"
          >
            Liquidate
          </button>
        </form>
      </div>
    </div>
  );
}