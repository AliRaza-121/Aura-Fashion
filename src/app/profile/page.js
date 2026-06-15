"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Package, LogOut } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchMyOrders();
    }
  }, [status, router]);

  const fetchMyOrders = async () => {
    try {
      const res = await fetch('/api/orders/mine');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-gray-300" size={48} />
      </div>
    );
  }

  if (!session) return null; // Will redirect

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />
      <Header />
      <NavBar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900 mb-2">My Account</h1>
            <p className="text-sm text-gray-500">Welcome back, {session.user.name}</p>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
          >
            <LogOut size={14} className="mr-2" /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
              <div className="relative mx-auto mb-8 flex justify-center">
                <ImageUpload 
                  value={session.user.profilePicture}
                  circle={true}
                  label="Update"
                  onUpload={async (url) => {
                    const newUrl = url || "";
                    await fetch('/api/user/profile', {
                      method: 'PUT',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify({ profilePicture: newUrl })
                    });
                    await update({ profilePicture: newUrl });
                  }}
                />
              </div>

              <div className="text-center mb-6">
                <h2 className="font-bold text-gray-900">{session.user.name}</h2>
                <p className="text-sm text-gray-500">{session.user.email}</p>
              </div>
              
              {session.user.isAdmin && (
                <Link href="/admin" className="block w-full py-3 bg-black text-white text-center text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-gray-800 transition-colors mb-4">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 flex items-center">
              <Package size={18} className="mr-2" /> Order History
            </h2>

            {loadingOrders ? (
              <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm flex justify-center">
                <Loader2 className="animate-spin text-gray-300" size={32} />
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm text-center">
                <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                <Link href="/shop" className="inline-block bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest rounded hover:bg-gray-800 transition-colors">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-50 pb-4 mb-4 gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Placed</p>
                        <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total</p>
                        <p className="text-sm font-bold">Rs {order.totalPrice.toLocaleString()}</p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order #</p>
                        <p className="text-sm font-mono text-gray-600">{order._id.substring(18).toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center space-x-2">
                        {order.isDelivered ? (
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Processing</span>
                        )}
                        {order.isPaid && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Paid</span>
                        )}
                      </div>
                    </div>

                    <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
                      {order.orderItems.map((item, idx) => (
                        <Link key={idx} href={`/shop/${item.product}`} className="flex-shrink-0 w-20 group relative">
                          <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform" />
                          </div>
                          <div className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                            {item.quantity}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
