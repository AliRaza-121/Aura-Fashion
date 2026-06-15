"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { DollarSign, ShoppingBag, Users, Package, ArrowUpRight, TrendingUp, Clock, Calendar, AlertTriangle } from 'lucide-react';
import RevenueChart from '@/components/admin/RevenueChart';

const fetcher = (url) => fetch(url).then((res) => res.json());

const getLocalDateStr = (offsetDays = 0) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  if (offsetDays) d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState({
    start: getLocalDateStr(-6),
    end: getLocalDateStr()
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('adminDashboardDateRange');
    if (saved) {
      try {
        setDateRange(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleDateChange = (field, value) => {
    const newRange = { ...dateRange, [field]: value };
    setDateRange(newRange);
    localStorage.setItem('adminDashboardDateRange', JSON.stringify(newRange));
  };

  const { data: stats, error, isLoading } = useSWR(`/api/admin/dashboard?startDate=${dateRange.start}&endDate=${dateRange.end}`, fetcher, {
    refreshInterval: 5000,
  });

  const loading = isLoading;

  const defaultStats = { 
    totalProducts: 0, 
    totalOrders: 0, 
    totalCustomers: 0, 
    totalRevenue: 0, 
    recentOrders: [], 
    bestSellers: [], 
    revenueGrowth: 0,
    orderGrowth: 0,
    newCustomersThisWeek: 0,
    chartData: []
  };

  const safeStats = stats?.error ? defaultStats : (stats || defaultStats);
  const { bestSellers = [], outOfStockProducts = [], totalProducts = 0, totalOrders = 0, totalCustomers = 0, totalRevenue = 0, recentOrders = [], revenueGrowth = 0, orderGrowth = 0, newCustomersThisWeek = 0, chartData = [] } = safeStats;

  return (
    <div className="space-y-8 pb-12">
      {outOfStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start sm:items-center space-x-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="p-2 bg-red-100 rounded-full text-red-600 shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-red-900 tracking-wide">ACTION REQUIRED: OUT OF STOCK</h3>
            <p className="text-xs text-red-700 mt-0.5">
              You have <span className="font-bold">{outOfStockProducts.length}</span> product{outOfStockProducts.length === 1 ? '' : 's'} completely out of stock. Customers cannot purchase them.
            </p>
          </div>
          <Link href="/admin/products" className="shrink-0 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest py-2 px-4 rounded-md transition-colors shadow-sm">
            Restock Now
          </Link>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Dashboard Overview</h1>
        <p className="text-sm text-gray-500">Welcome back. Here is what's happening with your store today.</p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all col-span-1 md:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Revenue</p>
                <div className="flex items-center space-x-1">
                  <input 
                    type="date" 
                    value={dateRange.start}
                    max={dateRange.end}
                    onChange={(e) => handleDateChange('start', e.target.value)}
                    className="text-[10px] font-bold uppercase tracking-wider bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 py-1 px-2 rounded-md outline-none focus:ring-1 focus:ring-black transition-colors cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-400 font-bold">TO</span>
                  <input 
                    type="date" 
                    value={dateRange.end}
                    min={dateRange.start}
                    max={(() => {
                      const d = new Date();
                      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                      return d.toISOString().split('T')[0];
                    })()}
                    onChange={(e) => handleDateChange('end', e.target.value)}
                    className="text-[10px] font-bold uppercase tracking-wider bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 py-1 px-2 rounded-md outline-none focus:ring-1 focus:ring-black transition-colors cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex items-baseline space-x-3">
                <h3 className="text-3xl font-black tracking-tight">{loading ? '-' : `Rs ${stats?.periodRevenue?.toLocaleString() || 0}`}</h3>
                <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-md ${Number(revenueGrowth) >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                  <TrendingUp size={12} className={`mr-1 ${Number(revenueGrowth) < 0 ? 'rotate-180' : ''}`} /> 
                  {Number(revenueGrowth) >= 0 ? '+' : ''}{revenueGrowth}%
                </div>
              </div>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign size={20} />
            </div>
          </div>
          <RevenueChart data={chartData} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Orders</p>
                <h3 className="text-3xl font-black tracking-tight">{loading ? '-' : totalOrders}</h3>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <ShoppingBag size={20} />
              </div>
            </div>
            <div className={`flex items-center text-xs font-bold w-fit px-2 py-1 rounded-md ${Number(orderGrowth) >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
              <TrendingUp size={12} className={`mr-1 ${Number(orderGrowth) < 0 ? 'rotate-180' : ''}`} /> 
              {Number(orderGrowth) >= 0 ? '+' : ''}{orderGrowth}% from last month
            </div>
            <div className="absolute -right-6 -bottom-6 text-gray-50 opacity-50 group-hover:scale-110 transition-transform"><ShoppingBag size={100} /></div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Active Products</p>
                <h3 className="text-3xl font-black tracking-tight">{loading ? '-' : totalProducts}</h3>
              </div>
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <Package size={20} />
              </div>
            </div>
            <div className="flex items-center text-xs font-bold text-gray-500 bg-gray-50 w-fit px-2 py-1 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span> Live in store
            </div>
            <div className="absolute -right-6 -bottom-6 text-gray-50 opacity-50 group-hover:scale-110 transition-transform"><Package size={100} /></div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Customers</p>
                <h3 className="text-3xl font-black tracking-tight">{loading ? '-' : totalCustomers}</h3>
              </div>
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <Users size={20} />
              </div>
            </div>
            <div className="flex items-center text-xs font-bold text-green-600 bg-green-50 w-fit px-2 py-1 rounded-md">
              <TrendingUp size={12} className="mr-1" /> +{newCustomersThisWeek || 0} new this week
            </div>
            <div className="absolute -right-6 -bottom-6 text-gray-50 opacity-50 group-hover:scale-110 transition-transform"><Users size={100} /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RECENT ORDERS TABLE */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center">View All <ArrowUpRight size={14} className="ml-1" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-500 border-b border-gray-100">
                  <th className="px-6 py-4 font-bold">Order ID</th>
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Time</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-400">Loading orders...</td></tr>
                ) : recentOrders.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-400">No recent orders yet.</td></tr>
                ) : (
                  recentOrders.map((order, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                      <td className="px-6 py-4 text-xs text-gray-500 flex items-center"><Clock size={12} className="mr-1" /> {new Date(order.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Rs {order.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOP SELLING PRODUCTS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Top Selling Items</h2>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center">
            {loading ? (
              <div className="text-center text-sm text-gray-400 py-8">Loading best sellers...</div>
            ) : bestSellers.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-8">No best sellers marked yet.</div>
            ) : (
              <div className="space-y-6">
                {bestSellers.map((product, index) => (
                  <div key={product._id} className="flex items-center space-x-4">
                    <div className="relative w-12 h-16 shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={product.images?.[0] || '/placeholder.png'} alt={product.title} className="w-full h-full object-cover" />
                      <div className="absolute top-0 left-0 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-md">
                        #{index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{product.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Rs {product.price?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Link href="/admin/products" className="mt-8 block w-full py-3 border border-gray-200 rounded-xl text-xs font-bold text-center text-gray-600 uppercase tracking-widest hover:bg-gray-50 hover:text-black transition-colors">
              Manage All Products
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
