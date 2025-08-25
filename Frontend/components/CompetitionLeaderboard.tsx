'use client';

import { useState } from 'react';
import { TrophyIcon, ArrowTrendingUpIcon, UsersIcon, ClockIcon } from '@heroicons/react/24/outline';
import { CompetitionParticipant, mockCompetitionParticipants, competitionStats } from '@/lib/competitionData';

export default function CompetitionLeaderboard() {
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('monthly');
  const [participants] = useState<CompetitionParticipant[]>(mockCompetitionParticipants);

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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm">
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-100 flex items-center gap-2">
              <TrophyIcon className="h-5 w-5 text-yellow-400" />
              Trading Competition
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Compete for the highest P&L in domain futures</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <UsersIcon className="h-4 w-4" />
            <span>{competitionStats.totalParticipants} participants</span>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {(['daily', 'weekly', 'monthly', 'all-time'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeFilter(period)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                timeFilter === period
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-400">
              <TrophyIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Prize Pool</span>
            </div>
            <p className="text-2xl font-bold text-gray-100 mt-1">${competitionStats.totalPrizePool.toLocaleString()}</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <ClockIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Duration</span>
            </div>
            <p className="text-2xl font-bold text-gray-100 mt-1">{competitionStats.competitionDuration}</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-teal-400">
              <ArrowTrendingUpIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Ends</span>
            </div>
            <p className="text-2xl font-bold text-gray-100 mt-1">
              {new Date(competitionStats.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-indigo-400">
                <th className="pb-3 px-2 sm:px-4 font-medium">Rank</th>
                <th className="pb-3 px-2 sm:px-4 font-medium">Trader</th>
                <th className="pb-3 px-2 sm:px-4 font-medium">Total P&L</th>
                <th className="pb-3 px-2 sm:px-4 font-medium hidden sm:table-cell">Win Rate</th>
                <th className="pb-3 px-2 sm:px-4 font-medium hidden sm:table-cell">Volume</th>
                <th className="pb-3 px-2 sm:px-4 font-medium">ETF</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => (
                <tr
                  key={participant.id}
                  className={`border-b border-gray-700 hover:bg-gray-700/50 transition-all duration-200`}
                >
                  <td className="py-3 px-2 sm:px-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getRankBg(participant.rank)}`}>
                      <span className={`font-bold ${getRankColor(participant.rank)}`}>
                        {participant.rank}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <div>
                      <div className="text-gray-100 font-medium">{participant.displayName}</div>
                      <div className="text-xs text-gray-400">{formatAddress(participant.address)}</div>
                    </div>
                  </td>
                  <td className={`py-3 px-2 sm:px-4 font-medium ${participant.totalPnL >= 0 ? 'text-teal-400' : 'text-amber-400'}`}>
                    {participant.totalPnL >= 0 ? '+' : ''}${participant.totalPnL.toLocaleString()}
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-100 hidden sm:table-cell">
                    {participant.winRate}%
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-100 hidden sm:table-cell">
                    ${participant.volumeTraded.toLocaleString()}
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    {participant.isETFParticipant && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-600/20 text-indigo-300">
                        ETF
                      </span>
                    )}
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
