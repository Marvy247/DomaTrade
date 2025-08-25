import Admin from "@/components/Admin";
import { CollateralVault } from "@/components/CollateralVault";
import DomainFutures from "@/components/DomainFutures";
import ActivityFeed from "@/components/ActivityFeed";

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen">
      <div className="lg:col-span-2">
        <DomainFutures />
      </div>
      <div className="lg:col-span-1">
        <CollateralVault />
      </div>
      <div className="lg:col-span-3">
        <ActivityFeed />
      </div>
      <div className="lg:col-span-3">
        <Admin />
      </div>
    </div>
  );
}