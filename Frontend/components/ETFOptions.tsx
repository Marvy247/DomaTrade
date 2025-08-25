'use client';

import { useState } from 'react';
import { ChartPieIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { ETFWhitelistedOption, mockETFWhitelistedOptions } from '@/lib/competitionData';

export default function ETFOptions() {
  const [etfOptions] = useState<ETFWhitelistedOption[]>(mockETFWhitelistedOptions);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(etfOptions.map(option => option.category)))];

  const filteredOptions = selectedCategory === 'all' 
    ? etfOptions 
    : etfOptions.filter(option => option.category === selectedCategory);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'text-green-400 bg-green-400/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'High': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm">
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-100 flex items-center gap-2">
          <ChartPieIcon className="h-5 w-5 text-indigo-400" />
          ETF Whitelisted Options
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">High-yield domain ETF pools with competitive returns</p>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOptions.map((option) => (
            <div key={option.id} className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-gray-100 font-medium">{option.domainName}</h4>
                  <p className="text-xs text-gray-400">{option.category}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(option.riskLevel)}`}>
                  {option.riskLevel}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">APY</span>
                  <span className="text-sm font-medium text-teal-400">{option.yieldPercentage}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Total Value Locked</span>
                  <span className="text-sm font-medium text-gray-100">{formatCurrency(option.totalValueLocked)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Participants</span>
                  <span className="text-sm font-medium text-gray-100">{option.participants}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Min Investment</span>
                  <span className="text-sm font-medium text-gray-100">{formatCurrency(option.minInvestment)}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <ShieldCheckIcon className="h-4 w-4 text-green-400" />
                    <span className="text-xs text-gray-400">Whitelisted</span>
                  </div>
                  <button className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-full hover:bg-indigo-700 transition-colors">
                    Invest
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
