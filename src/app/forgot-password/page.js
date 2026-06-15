"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: ''
  });

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, type: 'forgot_password' })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      toast.success('Password reset successful! Please login with your new password.');
      router.push('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-gray-900">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link href="/login" className="font-bold text-black hover:text-gray-800 hover:underline">
            Back to login
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-black/5 sm:rounded-2xl sm:px-10 border border-gray-100">
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg flex items-center">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form className="space-y-6" onSubmit={handleSendOTP}>
              <p className="text-sm text-gray-500 text-center mb-6">
                Enter your email address and we'll send you a 6-digit verification code to reset your password.
              </p>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black sm:text-sm transition-all outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-all uppercase tracking-widest"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : 'Send Reset Code'}
              </button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <ShieldCheck size={24} className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Check your email</h3>
                <p className="text-sm text-gray-500 mt-1">We've sent a 6-digit code to <span className="font-bold">{formData.email}</span></p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2 text-center">Enter 6-Digit Code</label>
                <input
                  required
                  type="text"
                  maxLength={6}
                  value={formData.otp}
                  onChange={e => setFormData({...formData, otp: e.target.value})}
                  className="block w-full text-center text-2xl tracking-[0.5em] font-black py-4 border border-gray-300 rounded-xl focus:ring-black focus:border-black transition-all outline-none"
                  placeholder="000000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    required
                    type="password"
                    minLength={6}
                    value={formData.newPassword}
                    onChange={e => setFormData({...formData, newPassword: e.target.value})}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black sm:text-sm transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || formData.otp.length !== 6 || formData.newPassword.length < 6}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-all uppercase tracking-widest"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <>Reset Password <ArrowRight size={16} className="ml-2" /></>}
              </button>
              
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-xs font-bold text-gray-500 hover:text-black uppercase tracking-widest"
              >
                Resend Code
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
