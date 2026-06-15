"use client";
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Truck, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart, directCheckoutItem, clearDirectCheckoutItem } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const checkoutItems = directCheckoutItem ? [directCheckoutItem] : cartItems;
  const subtotal = directCheckoutItem ? directCheckoutItem.price * directCheckoutItem.quantity : getCartTotal();
  const shipping = subtotal > 15000 ? 0 : 500;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (checkoutItems.length === 0) {
      setError(directCheckoutItem ? "Item is unavailable" : "Your cart is empty");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: formData,
          cartItems: checkoutItems,
          itemsPrice: subtotal,
          shippingPrice: shipping,
          totalPrice: total,
          paymentMethod: 'Cash on Delivery'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to place order');

      setSuccess(true);
      if (directCheckoutItem) {
        clearDirectCheckoutItem();
      } else {
        clearCart();
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 mb-8">Thank you for your purchase. We've received your order and will process it immediately.</p>
          <p className="text-sm text-gray-400 mb-8">An order confirmation has been sent to {formData.email}.</p>
          <Link href="/shop" className="inline-block w-full py-4 bg-black text-white font-bold tracking-widest uppercase rounded-xl hover:bg-gray-800 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        <button onClick={() => router.back()} className="inline-flex items-center text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-black mb-8 transition-colors">
          <ArrowLeft size={14} className="mr-2" /> Back
        </button>

        {checkoutItems.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Your Cart is Empty</h2>
            <Link href="/shop" className="text-blue-500 hover:text-blue-600 underline">Continue Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-20">
            
            {/* Left Column: Checkout Form */}
            <div className="lg:col-span-7">
              <h1 className="text-3xl font-black uppercase tracking-tight mb-10 text-gray-900">Checkout</h1>
              
              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
                
                {/* Shipping Details */}
                <section>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6 flex items-center">
                    <Truck size={18} className="mr-2" /> Shipping Information
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                      <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black outline-none" placeholder="John Doe" />
                    </div>
                    
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black outline-none" placeholder="john@example.com" />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone</label>
                      <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black outline-none" placeholder="0300 1234567" />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Street Address</label>
                      <input required type="text" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black outline-none" placeholder="House 123, Street 4" />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">City</label>
                      <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black outline-none" placeholder="Lahore" />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Postal Code</label>
                      <input required type="text" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black outline-none" placeholder="54000" />
                    </div>
                  </div>
                </section>

                {/* Payment Details */}
                <section>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6 flex items-center">
                    <ShieldCheck size={18} className="mr-2" /> Payment Method
                  </h2>
                  <div className="p-5 border-2 border-black rounded-xl bg-gray-50 flex justify-between items-center cursor-pointer">
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full border-[5px] border-black bg-white mr-4"></div>
                      <span className="font-bold">Cash on Delivery (COD)</span>
                    </div>
                  </div>
                </section>

              </form>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-gray-50 p-8 rounded-3xl sticky top-8">
                <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 mb-8">Order Summary</h2>
                
                <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                  {checkoutItems.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-4">
                      <div className="w-16 h-20 bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 relative">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 truncate">{item.title}</h3>
                        <p className="text-xs text-gray-500 uppercase mt-1">Size: {item.size}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900 whitespace-nowrap ml-4">Rs {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-t border-gray-200 pt-6 mb-6 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">Rs {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    {shipping === 0 ? (
                      <span className="font-bold text-green-600 uppercase tracking-widest text-[10px] mt-0.5">Free</span>
                    ) : (
                      <span className="font-medium text-gray-900">Rs {shipping.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 pt-6 mb-8">
                  <span className="text-base font-bold uppercase tracking-widest text-gray-900">Total</span>
                  <span className="text-2xl font-black text-gray-900">Rs {total.toLocaleString()}</span>
                </div>

                <button 
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className="w-full py-5 bg-black text-white font-bold tracking-widest uppercase rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex justify-center items-center"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : 'Place Order'}
                </button>
              </div>
            </div>

          </div>
        )}

      </main>
      
      <Footer />
    </div>
  );
}
