import { CollateralVault } from '../../components/CollateralVault';

export default function VaultPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <CollateralVault />
      </div>
    </div>
  );
}
