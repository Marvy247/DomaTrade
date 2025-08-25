'use client';

import { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

interface ActivityItem {
  id: string;
  type: 'trade' | 'liquidation' | 'margin' | 'funding';
  user: string;
  domainName: string;
  action: string;
  amount: number;
  price: number;
  timestamp: string;
  side?: 'long' | 'short';
  leverage?: number;
}

export default function ActivityFeed() {
  const [activities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'trade',
      user: '0x1234...5678',
      domainName: 'crypto.eth',
      action: 'opened long position',
      amount: 2.5,
      price: 11000,
      side: 'long',
      leverage: 5,
      timestamp: '2 minutes ago',
    },
    {
      id: '2',
      type: 'liquidation',
      user: '0xabcd...efgh',
      domainName: 'defi.eth',
      action: 'liquidated short position',
      amount: 1.2,
      price: 9200,
      side: 'short',
      timestamp: '5 minutes ago',
    },
    {
      id: '3',
      type: 'trade',
      user: '0x9876...5432',
      domainName: 'nft.eth',
      action: 'closed long position',
      amount: 0.8,
      price: 4200.75,
      side: 'long',
      leverage: 4,
      timestamp: '8 minutes ago',
    },
    {
      id: '4',
      type: 'margin',
      user: '0x1111...2222',
      domainName: 'game.eth',
      action: 'added margin',
      amount: 500,
      price: 0,
      timestamp: '12 minutes ago',
    },
    {
      id: '5',
      type: 'funding',
      user: '0x3333...4444',
      domainName: 'metaverse.eth',
      action: 'funding payment',
      amount: -12.5,
      price: 0,
      timestamp: '15 minutes ago',
    },
    {
      id: '6',
      type: 'trade',
      user: '0x5555...6666',
      domainName: 'defi.eth',
      action: 'opened short position',
      amount: 1.5,
      price: 8500,
      side: 'short',
      leverage: 3,
      timestamp: '18 minutes ago',
    },
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'trade':
        return 'bg-indigo-600';
      case 'liquidation':
        return 'bg-red-600';
      case 'margin':
        return 'bg-teal-600';
      case 'funding':
        return 'bg-amber-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'trade':
        return 'text-indigo-400';
      case 'liquidation':
        return 'text-red-400';
      case 'margin':
        return 'text-teal-400';
      case 'funding':
        return 'text-amber-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm mx-auto max-w-7xl">
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-100 flex items-center gap-2">
          <ClockIcon className="h-4 w-4 text-indigo-400" />
          Domain Futures Activity
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Recent trading activity across domain futures markets</p>
      </div>
      <div className="p-4 sm:p-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-700/30 transition-all duration-200"
            >
              <div className={`w-8 h-8 rounded-full ${getActivityIcon(activity.type)} flex items-center justify-center flex-shrink-0`}>
                <UserIcon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-100 font-medium text-sm">
                    {activity.user.substring(0, 8)}...{activity.user.substring(-4)}
                  </span>
                  <span className="text-gray-400 text-sm">{activity.action}</span>
                  <span className={`text-sm font-medium ${getActivityColor(activity.type)}`}>
                    {activity.domainName}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                  <span>{activity.amount} ETH</span>
                  {activity.price > 0 && <span>@ ${activity.price.toLocaleString()}</span>}
                  {activity.side && (
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                      activity.side === 'long' 
                        ? 'bg-teal-600/20 text-teal-300' 
                        : 'bg-amber-600/20 text-amber-300'
                    }`}>
                      {activity.side === 'long' ? (
                        <ArrowUpIcon className="h-2.5 w-2.5 mr-0.5" />
                      ) : (
                        <ArrowDownIcon className="h-2.5 w-2.5 mr-0.5" />
                      )}
                      {activity.side.toUpperCase()}
                    </span>
                  )}
                  {activity.leverage && <span>{activity.leverage}x</span>}
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
