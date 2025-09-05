import Positions from '@/components/Positions';
import PendingOrders from '@/components/PendingOrders';

export default function PositionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-100">My Positions</h1>
      <Positions />
      <PendingOrders />
    </div>
  );
}
