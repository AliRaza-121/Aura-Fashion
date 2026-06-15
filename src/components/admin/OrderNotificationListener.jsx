"use client";
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ShoppingBag, X } from 'lucide-react';

export default function OrderNotificationListener() {
  const lastKnownOrderRef = useRef(null);

  // Function to synthesize a premium, loud "Ding-Ding!" notification sound
  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      
      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        // Bell-like sound uses sine wave
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        // Envelope for a sharp attack and smooth decay
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.8, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      
      const ringOnce = () => {
        playTone(1318.51, ctx.currentTime, 0.5); // E6
        playTone(1567.98, ctx.currentTime + 0.15, 1.0); // G6
      };

      // Play the chime 3 times distinctly, with a 1.2 second delay between each
      ringOnce();
      setTimeout(() => {
        if (ctx.state === 'suspended') ctx.resume();
        ringOnce();
      }, 1200);
      setTimeout(() => {
        if (ctx.state === 'suspended') ctx.resume();
        ringOnce();
      }, 2400);
    } catch (e) {
      console.log('Audio playback failed or is not supported', e);
    }
  };

  useEffect(() => {
    // We only want to run this in the browser
    if (typeof window === 'undefined') return;

    const checkLatestOrder = async () => {
      try {
        const res = await fetch('/api/admin/orders/latest');
        if (!res.ok) return;
        
        const data = await res.json();
        if (!data.timestamp) return;

        const currentTimestamp = new Date(data.timestamp).getTime();

        // On first load, just record the latest order and don't play sound
        if (!lastKnownOrderRef.current) {
          // You could also initialize this from localStorage to persist across reloads
          const stored = localStorage.getItem('admin_last_order_ts');
          if (stored) {
            lastKnownOrderRef.current = parseInt(stored, 10);
          } else {
            lastKnownOrderRef.current = currentTimestamp;
            localStorage.setItem('admin_last_order_ts', currentTimestamp.toString());
          }
        }

        // If we found a strictly newer order
        if (currentTimestamp > lastKnownOrderRef.current) {
          // Update ref and storage
          lastKnownOrderRef.current = currentTimestamp;
          localStorage.setItem('admin_last_order_ts', currentTimestamp.toString());

          // 1. Play the loud sound
          playNotificationSound();

          // 2. Show the visual toast notification
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? 'animate-in slide-in-from-top-5 fade-in duration-300' : 'animate-out slide-out-to-top-5 fade-out duration-300'
              } max-w-sm w-full bg-gray-900 shadow-2xl rounded-2xl pointer-events-auto flex flex-col overflow-hidden border border-gray-800`}
            >
              <div className="flex-1 p-5">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
                      <ShoppingBag size={18} />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-1">
                      New Order Received
                    </h3>
                    <p className="text-sm text-gray-300">
                      <span className="font-bold text-white">{data.customerName}</span> spent <span className="font-bold text-green-400">Rs {data.amount?.toLocaleString()}</span>
                    </p>
                    <Link 
                      href={`/admin/orders/${data.orderId}`}
                      onClick={() => toast.dismiss(t.id)}
                      className="mt-4 inline-block text-[10px] font-bold text-white uppercase tracking-widest hover:text-gray-300 border-b border-white/30 pb-0.5 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="ml-4 flex-shrink-0 text-gray-500 hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          ), { duration: 10000, position: 'top-right' });
        }
      } catch (err) {
        console.error('Error polling for orders:', err);
      }
    };

    // Check immediately, then every 5 seconds
    checkLatestOrder();
    const intervalId = setInterval(checkLatestOrder, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return null; // This component is invisible
}
