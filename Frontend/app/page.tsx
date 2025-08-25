import Admin from "@/components/Admin";
import { CollateralVault } from "@/components/CollateralVault";
import DomainFutures from "@/components/DomainFutures";
import ActivityFeed from "@/components/ActivityFeed";

export default function Home() {
  return (
    <div className="grid grid-cols-1 gap-6 p-4 sm:p-5 lg:p-6 lg:pl-4 bg-transparent min-h-screen">
      {/* Domain Futures: Full width */}
      <div className="w-full">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 transition-all duration-300 hover:shadow-xl">
          <DomainFutures />
        </div>
      </div>
      
      {/* Collateral Vault: Full width */}
      <div className="w-full">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 transition-all duration-300 hover:shadow-xl">
          <CollateralVault />
        </div>
      </div>
      
      {/* Activity Feed: Full width */}
      <div className="w-full">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 transition-all duration-300 hover:shadow-xl">
          <ActivityFeed />
        </div>
      </div>
      
      {/* Admin Panel: Full width */}
      <div className="w-full">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 transition-all duration-300 hover:shadow-xl">
          <Admin />
        </div>
      </div>
    </div>
  );
}