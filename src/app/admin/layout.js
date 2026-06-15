"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LayoutDashboard, Package, Users, LogOut, Loader2, Menu, X, Store, Tags, Type, Search } from 'lucide-react';
import CommandMenu from '@/components/admin/CommandMenu';
import OrderNotificationListener from '@/components/admin/OrderNotificationListener';

export default function AdminLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && !session?.user?.isAdmin) {
      router.push('/');
    }
  }, [status, session, router]);

  if (status === 'loading' || (status === 'authenticated' && !session?.user?.isAdmin)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: Package },
    { name: 'Products', href: '/admin/products', icon: Tags },
    { name: 'Customers', href: '/admin/users', icon: Users },
    { name: 'Content', href: '/admin/content', icon: Type },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <OrderNotificationListener />
      <CommandMenu />
      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-8 border-b border-gray-100">
          <div className="text-xl font-black tracking-[0.2em] uppercase">Aura Admin</div>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-black text-white shadow-md shadow-black/10' 
                    : 'text-gray-500 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'} transition-colors`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link href="/" className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
            <Store size={18} />
            <span>Back to Store</span>
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-8 justify-between shrink-0">
          <div className="flex items-center">
            <button className="md:hidden mr-4 text-gray-600" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-sm font-bold tracking-widest uppercase text-gray-800 hidden sm:block">
              {navItems.find(i => i.href === pathname)?.name || 'Admin Panel'}
            </h2>
          </div>
          <div className="flex items-center space-x-6">
            <div 
              className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 cursor-text text-sm text-gray-500 w-64 justify-between"
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            >
              <div className="flex items-center">
                <Search size={16} className="mr-2 text-gray-400" />
                <span>Search...</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded shadow-sm">
                ⌘K
              </div>
            </div>
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'AD'}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
