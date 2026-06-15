"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Search, Loader2, PackageX } from 'lucide-react';

import useSWR from 'swr';
import TableSkeleton from '@/components/admin/TableSkeleton';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  
  const { data: orders, error, mutate, isLoading } = useSWR('/api/admin/orders', fetcher, {
    refreshInterval: 5000,
  });

  const loading = isLoading;

  const handleStatusChange = async (orderId, newStatus) => {
    let payload = {};
    if (newStatus === 'Pending') {
      payload = { isPaid: false, isDelivered: false };
    } else if (newStatus === 'Processing') {
      payload = { isPaid: true, isDelivered: false };
    } else if (newStatus === 'Delivered') {
      payload = { isPaid: true, isDelivered: true };
    }

    // Optimistic update
    mutate(orders.map(o => o._id === orderId ? { ...o, ...payload } : o), false);

    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    // Re-validate
    mutate();
  };

  const filteredOrders = orders?.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.shippingAddress?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(filteredOrders.map(o => o._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(orderId => orderId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const handleBulkUpdate = async (newStatus) => {
    if (selectedOrders.length === 0) return;
    setIsBulkLoading(true);

    let payload = {};
    if (newStatus === 'Pending') {
      payload = { isPaid: false, isDelivered: false };
    } else if (newStatus === 'Processing') {
      payload = { isPaid: true, isDelivered: false };
    } else if (newStatus === 'Delivered') {
      payload = { isPaid: true, isDelivered: true };
    }

    try {
      await Promise.all(
        selectedOrders.map(orderId => 
          fetch(`/api/admin/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
        )
      );
      mutate(); // Refresh the list
      setSelectedOrders([]); // Clear selection
    } catch (error) {
      console.error('Failed to bulk update', error);
    } finally {
      setIsBulkLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and update customer orders.</p>
        </div>
      </div>

      {/* Search & Bulk Actions */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={18} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-black focus:border-black text-sm outline-none"
            placeholder="Search by Order ID or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {selectedOrders.length > 0 && (
          <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-right-4">
            <span className="text-xs font-bold text-gray-500">{selectedOrders.length} selected</span>
            <select 
              onChange={(e) => {
                if(e.target.value) {
                  handleBulkUpdate(e.target.value);
                  e.target.value = '';
                }
              }}
              disabled={isBulkLoading}
              className="text-xs font-bold bg-black text-white px-3 py-2 rounded-lg outline-none cursor-pointer hover:bg-gray-800 disabled:opacity-50"
            >
              <option value="">Bulk Action...</option>
              <option value="Pending">Mark as Pending</option>
              <option value="Processing">Mark as Processing</option>
              <option value="Delivered">Mark as Delivered</option>
            </select>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton columns={8} rows={5} />
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <PackageX size={48} className="text-gray-300 mb-4" />
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wider font-bold sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4 w-12">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-black focus:ring-black" 
                      onChange={handleSelectAll}
                      checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                    />
                  </th>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Paid</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className={`hover:bg-gray-50 transition-colors ${selectedOrders.includes(order._id) ? 'bg-blue-50/50' : ''}`}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-black focus:ring-black"
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => handleSelectOrder(order._id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">
                      {order._id.substring(18).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.shippingAddress?.fullName || 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      Rs {order.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {order.isPaid ? (
                        <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Paid</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select 
                          value={order.isDelivered ? 'Delivered' : order.isPaid ? 'Processing' : 'Pending'}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`appearance-none text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 pr-7 rounded-full border cursor-pointer hover:shadow-sm focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all ${
                            order.isDelivered ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' :
                            order.isPaid ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' :
                            'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                          <svg className="fill-current h-3 w-3 opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/orders/${order._id}`} className="text-gray-400 hover:text-black transition-colors inline-block p-1">
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
