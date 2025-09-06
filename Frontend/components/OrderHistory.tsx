'use client';

import { useState } from 'react';
import { useStore } from '../lib/store';
import { ClockIcon, FunnelIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

export default function OrderHistory() {
  const { orders } = useStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'executed' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue: number | string, bValue: number | string;

    switch (sortBy) {
      case 'date':
        aValue = a.createdAt;
        bValue = b.createdAt;
        break;
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'size':
        aValue = a.size;
        bValue = b.size;
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'executed':
        return 'bg-green-600/20 text-green-300';
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-300';
      case 'cancelled':
        return 'bg-red-600/20 text-red-300';
      default:
        return 'bg-gray-600/20 text-gray-300';
    }
  };

  const getOrderTypeColor = (type: string) => {
    switch (type) {
      case 'limit':
        return 'bg-blue-600/20 text-blue-300';
      case 'stop-loss':
        return 'bg-orange-600/20 text-orange-300';
      case 'take-profit':
        return 'bg-purple-600/20 text-purple-300';
      default:
        return 'bg-gray-600/20 text-gray-300';
    }
  };

  return (
    <div className="bg-gray-800/20 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm mx-auto max-w-7xl">
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-100 flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-blue-400" />
            Order History
          </h3>
          <div className="flex items-center gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="bg-gray-800 border border-gray-600 rounded-lg py-1 px-3 text-gray-100 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="executed">Executed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-gray-800 border border-gray-600 rounded-lg py-1 px-3 text-gray-100 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
              <option value="size">Sort by Size</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700"
            >
              {sortOrder === 'asc' ? <ArrowUpIcon className="h-4 w-4 text-gray-300" /> : <ArrowDownIcon className="h-4 w-4 text-gray-300" />}
            </button>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Track all your order history and execution details</p>
      </div>

      <div className="overflow-x-auto">
        {sortedOrders.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Domain
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Side
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Executed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {sortedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-800/30 transition-all duration-200 ease-in-out">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-100">{order.domain}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderTypeColor(order.type)}`}>
                      {order.type.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.side.toUpperCase()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    ${order.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.size}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.executedAt ? new Date(order.executedAt).toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-200">No orders found</h3>
            <p className="mt-1 text-sm text-gray-400">Your order history will appear here.</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Total Orders: {sortedOrders.length}</span>
          <span>Executed: {sortedOrders.filter(o => o.status === 'executed').length}</span>
          <span>Pending: {sortedOrders.filter(o => o.status === 'pending').length}</span>
        </div>
      </div>
    </div>
  );
}
