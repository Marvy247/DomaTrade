'use client';

import { useStore } from '@/lib/store';
import { ArrowUpIcon, ArrowDownIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

export default function ActivityFeed() {
  const { activities } = useStore();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return 'bg-green-600';
      case 'sell':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'buy':
        return 'text-green-400';
      case 'sell':
        return 'text-red-400';
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
              <div className={`w-8 h-8 rounded-full ${getActivityIcon(activity.side)} flex items-center justify-center flex-shrink-0`}>
                <UserIcon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-medium ${getActivityColor(activity.side)}`}>
                    {activity.domain}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                  <span>{activity.size} ETH</span>
                  {activity.price > 0 && <span>@ ${activity.price.toLocaleString()}</span>}
                  {activity.side && (
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                      activity.side === 'buy' 
                        ? 'bg-teal-600/20 text-teal-300' 
                        : 'bg-amber-600/20 text-amber-300'
                    }`}>
                      {activity.side === 'buy' ? (
                        <ArrowUpIcon className="h-2.5 w-2.5 mr-0.5" />
                      ) : (
                        <ArrowDownIcon className="h-2.5 w-2.5 mr-0.5" />
                      )}
                      {activity.side.toUpperCase()}
                    </span>
                  )}
                  <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
