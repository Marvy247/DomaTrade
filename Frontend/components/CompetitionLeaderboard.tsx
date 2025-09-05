'use client';

import { useEffect, useState } from 'react';
import { leaderboardData as mockLeaderboardData, LeaderboardUser } from '@/lib/mockData';
import { TrophyIcon } from '@heroicons/react/24/solid';

export default function CompetitionLeaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    setLeaderboardData(mockLeaderboardData);
  }, []);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-amber-600';
      default: return 'text-gray-400';
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-400/10';
      case 2: return 'bg-gray-300/10';
      case 3: return 'bg-amber-600/10';
      default: return 'bg-gray-700/20';
    }
  };

  return (
    <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm mx-auto max-full w-full">
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-100 flex items-center gap-2">
          <TrophyIcon className="h-5 w-5 text-amber-400" />
          Trading Competition Leaderboard
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Top traders by PnL</p>
      </div>
      <div className="p-4 sm:p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-indigo-400">
                <th className="pb-3 px-2 sm:px-4 font-medium text-center">Rank</th>
                <th className="pb-3 px-2 sm:px-4 font-medium">User</th>
                <th className="pb-3 px-2 sm:px-4 font-medium text-right">PnL (USD)</th>
                <th className="pb-3 px-2 sm:px-4 font-medium text-right hidden sm:table-cell">Volume (USD)</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.sort((a, b) => b.pnl - a.pnl).map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-b border-gray-700 hover:bg-gray-700/50 transition-all duration-200 ${
                    index === 0 ? 'bg-amber-500/10' : ''
                  }`}
                >
                  <td className="py-3 px-2 sm:px-4 text-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getRankBg(index + 1)}`}>
                      <span className={`font-bold ${getRankColor(index + 1)}`}>
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="text-gray-100 font-medium">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className={`py-3 px-2 sm:px-4 text-right font-medium ${user.pnl >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
                    {user.pnl.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-right text-gray-300 hidden sm:table-cell">
                    {user.volume.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
