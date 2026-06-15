"use client";
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Truck, CreditCard, User, Package, Calendar } from 'lucide-react';

export default function OrderDetails({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        router.push('/admin/orders');
      }
    } catch (error) {
      console.error('Failed to fetch order', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (field, value) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrder(updatedOrder);
      }
    } catch (error) {
      console.error('Failed to update order', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-gray-300" size={32} />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link href="/admin/orders" className="inline-flex items-center text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-black transition-colors mb-4">
        <ArrowLeft size={14} className="mr-2" /> Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">Order #{order._id.substring(18).toUpperCase()}</h1>
          <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
            <span className="flex items-center"><Calendar size={14} className="mr-1" /> {new Date(order.createdAt).toLocaleString()}</span>
            <span>|</span>
            <span className="font-mono text-xs">{order._id}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <select 
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 outline-none focus:border-black"
            value={order.isPaid ? 'paid' : 'unpaid'}
            onChange={(e) => handleUpdateStatus('isPaid', e.target.value === 'paid')}
            disabled={updating}
          >
            <option value="unpaid">Payment: Pending</option>
            <option value="paid">Payment: Paid</option>
          </select>

          <select 
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 outline-none focus:border-black"
            value={order.isDelivered ? 'delivered' : 'processing'}
            onChange={(e) => handleUpdateStatus('isDelivered', e.target.value === 'delivered')}
            disabled={updating}
          >
            <option value="processing">Status: Processing</option>
            <option value="delivered">Status: Delivered</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Customer & Shipping */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center">
              <User size={14} className="mr-2" /> Customer Details
            </h2>
            <div className="space-y-2 text-sm text-gray-800">
              <p className="font-bold">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.email}</p>
              <p>{order.shippingAddress?.phone}</p>
              {order.user && (
                <p className="text-xs text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded mt-2">Registered Account</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center">
              <Truck size={14} className="mr-2" /> Shipping Address
            </h2>
            <div className="space-y-1 text-sm text-gray-800">
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center">
              <CreditCard size={14} className="mr-2" /> Payment Info
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-bold text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status</span>
                {order.isPaid ? (
                  <span className="text-green-600 font-bold">Paid on {new Date(order.paidAt).toLocaleDateString()}</span>
                ) : (
                  <span className="text-yellow-600 font-bold">Pending</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Status</span>
                {order.isDelivered ? (
                  <span className="text-blue-600 font-bold">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</span>
                ) : (
                  <span className="text-gray-900 font-bold">Processing</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center">
              <Package size={14} className="mr-2" /> Order Items ({order.orderItems?.length})
            </h2>
            
            <div className="space-y-6 mb-6">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4">
                  <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                    <p className="text-xs text-gray-500 uppercase mt-1">Size: {item.size}</p>
                    <p className="text-xs text-gray-500 uppercase mt-1">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">Rs {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Items Subtotal</span>
                <span className="text-gray-900">Rs {order.itemsPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-gray-900">{order.shippingPrice === 0 ? 'Free' : `Rs ${order.shippingPrice?.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-2">
                <span className="text-base font-bold uppercase tracking-widest text-gray-900">Total</span>
                <span className="text-2xl font-black text-gray-900">Rs {order.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
