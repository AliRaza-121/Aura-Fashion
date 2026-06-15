"use client";
import { useState } from 'react';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <TopBar />
      <Header />
      <NavBar />
      
      {/* Page Header */}
      <div className="bg-gray-50 py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 uppercase">Contact Us</h1>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-sm">
            Have a question about an order, a product, or just want to say hello? 
            We'd love to hear from you. Fill out the form below and our team will get back to you within 24 hours.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Column: Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8 uppercase">Get in Touch</h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                      <MapPin size={20} />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Headquarters</h3>
                    <p className="mt-2 text-gray-500 text-sm leading-relaxed">
                      123 Fashion Avenue<br />
                      Gulberg III, Lahore<br />
                      Pakistan 54000
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                      <Phone size={20} />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Phone Support</h3>
                    <p className="mt-2 text-gray-500 text-sm">
                      +92 300 1234567<br />
                      Toll Free: 0800 12345
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                      <Mail size={20} />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Email Us</h3>
                    <p className="mt-2 text-gray-500 text-sm">
                      support@aurafashion.com<br />
                      info@aurafashion.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                      <Clock size={20} />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Business Hours</h3>
                    <p className="mt-2 text-gray-500 text-sm">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-white p-8 lg:p-10 shadow-2xl shadow-black/5 rounded-3xl border border-gray-100">
            <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-6 uppercase">Send a Message</h3>
            
            {success && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start">
                <CheckCircle2 className="text-green-600 mt-0.5 mr-3 flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-green-900">Message Sent Successfully</h4>
                  <p className="text-xs text-green-700 mt-1">Thank you for reaching out. We will get back to you shortly.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Your Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black sm:text-sm transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black sm:text-sm transition-all outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Subject</label>
                <input
                  required
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black sm:text-sm transition-all outline-none"
                  placeholder="Order Inquiry"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black sm:text-sm transition-all outline-none resize-none"
                  placeholder="How can we help you today?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-all uppercase tracking-widest mt-4"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <>Send Message <Send size={16} className="ml-2" /></>}
              </button>
            </form>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
