import Markets from "@/components/Markets";
import Positions from "@/components/Positions";
import PortfolioAnalytics from "@/components/PortfolioAnalytics";
import ActivityFeed from "@/components/ActivityFeed";
import CompetitionLeaderboard from "@/components/CompetitionLeaderboard";

export default function Home() {
  return (
    <div className="grid grid-cols-1 gap-6 p-4 sm:p-5 lg:p-6 lg:pl-4 bg-transparent min-h-screen">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-900/20 to-teal-900/20 border border-gray-700 rounded-xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">
              Welcome to DomaTrade
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Your gateway to domain futures trading. Trade, analyze, and compete in the decentralized domain market.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-400">Market Status</div>
              <div className="text-lg font-semibold text-teal-400">🟢 Live</div>
            </div>
          </div>
        </div>
      </div>
      {/* Trading Interface: Full width */}
      <div className="w-full">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 transition-all duration-300 hover:shadow-xl">
          <Markets />
        </div>
      </div>

      {/* Portfolio Overview: Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Positions */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 transition-all duration-300 hover:shadow-xl">
          <Positions />
        </div>

        {/* Portfolio Analytics */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 transition-all duration-300 hover:shadow-xl">
          <PortfolioAnalytics />
        </div>
      </div>

      {/* Activity Feed: Full width */}
      <div className="w-full">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 transition-all duration-300 hover:shadow-xl">
          <ActivityFeed />
        </div>
      </div>

      {/* Competition Leaderboard: Full width */}
      <div className="w-full">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 transition-all duration-300 hover:shadow-xl">
          <CompetitionLeaderboard />
        </div>
      </div>
    </div>
  );
}
