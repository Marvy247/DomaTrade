'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { XMarkIcon, PencilIcon, CheckIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function PendingOrders() {
  const { pendingOrders, removePendingOrder, addPendingOrder } = useStore();
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<string>('');
  const [editedSize, setEditedSize] = useState<string>('');

  const startEditing = (order: { id: string; domain: string; type: string; price: number; size: number; side: string }) => {
    setEditingOrderId(order.id);
    setEditedPrice(order.price.toString());
    setEditedSize(order.size.toString());
  };

  const cancelEditing = () => {
    setEditingOrderId(null);
    setEditedPrice('');
    setEditedSize('');
  };

  const saveEditing = () => {
    if (editingOrderId) {
      removePendingOrder(editingOrderId);
      addPendingOrder({
        domain: pendingOrders.find(o => o.id === editingOrderId)?.domain || '',
        type: pendingOrders.find(o => o.id === editingOrderId)?.type || 'limit',
        price: parseFloat(editedPrice),
        size: parseFloat(editedSize),
        side: pendingOrders.find(o => o.id === editingOrderId)?.side || 'buy',
      });
      cancelEditing();
    }
  };

  return (
    <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm mx-auto max-w-7xl p-6">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Pending Orders</h3>
      {pendingOrders.length > 0 ? (
        <table className="w-full text-left text-sm text-gray-300">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-2">Domain</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Side</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Size</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-700/50 transition-all duration-200">
                <td className="px-4 py-2">{order.domain}</td>
                <td className="px-4 py-2 capitalize">{order.type.replace('-', ' ')}</td>
                <td className="px-4 py-2">{order.side.toUpperCase()}</td>
                <td className="px-4 py-2">
                  {editingOrderId === order.id ? (
                    <input
                      type="number"
                      value={editedPrice}
                      onChange={(e) => setEditedPrice(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-gray-100"
                    />
                  ) : (
                    `$${order.price.toLocaleString()}`
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingOrderId === order.id ? (
                    <input
                      type="number"
                      value={editedSize}
                      onChange={(e) => setEditedSize(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-gray-100"
                    />
                  ) : (
                    order.size
                  )}
                </td>
                <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 flex gap-2">
                  {editingOrderId === order.id ? (
                    <>
                      <button
                        onClick={saveEditing}
                        className="text-green-400 hover:text-green-300 transition-colors"
                        aria-label="Save order"
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        aria-label="Cancel editing"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(order)}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        aria-label="Edit order"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => removePendingOrder(order.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        aria-label="Cancel order"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400 text-center">No pending orders.</p>
      )}
    </div>
  );
}
