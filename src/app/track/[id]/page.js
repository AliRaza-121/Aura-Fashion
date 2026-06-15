"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Package, Truck, CheckCircle, Clock, AlertCircle, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function TrackOrder() {
  const params = useParams();
  const [orderId, setOrderId] = useState(params.id || '');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(!!params.id);
  const [error, setError] = useState('');

  const fetchOrder = async (id) => {
    setLoading(true);
    setError('');
    setOrderData(null);
    try {
      const res = await fetch(`/api/track/${id}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Order not found');
      }
      
      setOrderData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id);
    }
  }, [params.id]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      fetchOrder(orderId.trim());
    }
  };

  // Status mapping
  const statuses = ['Processing', 'Shipped', 'Delivered'];
  const currentStatusIndex = orderData ? statuses.indexOf(orderData.status) : -1;
  const isCancelled = orderData?.status === 'Cancelled';

  return (
    <div className="min-h-screen bg-white text-black py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto mt-10">
        
        {/* Header & Search */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-4">Track Your Order</h1>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">Enter your Order ID below to see real-time updates on your shipment.</p>
          
          <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
            <input 
              type="text" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g. 64a7...)"
              className="w-full bg-gray-50 border border-gray-200 text-black px-6 py-4 rounded-full outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-black text-white px-6 rounded-full hover:bg-gray-900 transition-colors flex items-center disabled:opacity-50"
            >
              {loading ? <Clock size={18} className="animate-spin" /> : <Search size={18} />}
            </button>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl flex items-center mb-12">
            <AlertCircle className="mr-4 flex-shrink-0" />
            <div>
              <p className="font-bold">We couldn't find that order.</p>
              <p className="text-sm opacity-80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Order Details & Timeline */}
        {orderData && (
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-8 border-b border-gray-200">
              <div>
                <p className="text-gray-500 text-sm mb-1 uppercase tracking-widest font-bold">Order #{orderData._id}</p>
                <p className="text-2xl font-black">
                  {new Date(orderData.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="mt-4 md:mt-0 text-left md:text-right">
                <p className="text-gray-500 text-sm mb-1 uppercase tracking-widest font-bold">Destination</p>
                <p className="text-xl font-bold">{orderData.shippingAddress?.city}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-16 relative">
              {isCancelled ? (
                <div className="flex flex-col items-center justify-center text-red-500 py-8">
                  <AlertCircle size={48} className="mb-4" />
                  <h3 className="text-2xl font-black uppercase tracking-widest">Order Cancelled</h3>
                  <p className="text-gray-600 mt-2">This order has been cancelled and will not be shipped.</p>
                </div>
              ) : (
                <div className="flex items-center justify-between relative">
                  {/* Progress Line */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-black rounded-full z-0 transition-all duration-1000 ease-out"
                    style={{ width: `${currentStatusIndex === -1 ? 0 : (currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                  ></div>

                  {/* Steps */}
                  {[
                    { title: 'Processing', icon: <Package size={20} /> },
                    { title: 'Shipped', icon: <Truck size={20} /> },
                    { title: 'Delivered', icon: <CheckCircle size={20} /> }
                  ].map((step, index) => {
                    const isCompleted = currentStatusIndex >= index;
                    const isCurrent = currentStatusIndex === index;
                    
                    return (
                      <div key={step.title} className="relative z-10 flex flex-col items-center">
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${isCompleted ? 'bg-black text-white border-white' : 'bg-white text-gray-400 border-gray-100'}`}>
                          {step.icon}
                        </div>
                        <p className={`mt-4 font-bold tracking-widest uppercase text-xs md:text-sm text-center ${isCompleted ? 'text-black' : 'text-gray-400'}`}>
                          {step.title}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Items Summary */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black uppercase tracking-widest mb-6">Items in Order</h3>
              <div className="space-y-6">
                {orderData.orderItems?.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl relative overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-sm text-gray-500">Size: {item.size} • Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold">
                      Rs {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center text-lg">
                <span className="font-medium text-gray-500">Total Amount</span>
                <span className="font-black text-2xl">Rs {orderData.totalPrice?.toLocaleString()}</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
