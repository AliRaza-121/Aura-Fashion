"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, Tags, Users, LayoutDashboard, Type } from 'lucide-react';

export default function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const commands = [
    { id: 1, name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { id: 2, name: 'Manage Orders', icon: Package, href: '/admin/orders' },
    { id: 3, name: 'Manage Products', icon: Tags, href: '/admin/products' },
    { id: 4, name: 'Manage Customers', icon: Users, href: '/admin/users' },
    { id: 5, name: 'Manage Site Content', icon: Type, href: '/admin/content' },
  ];

  const filteredCommands = commands.filter((command) =>
    command.name.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm px-4">
      {/* Overlay click to close */}
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
      
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden ring-1 ring-black/5">
        <div className="flex items-center px-4 py-4 border-b border-gray-100">
          <Search size={20} className="text-gray-400 mr-3" />
          <input
            autoFocus
            className="flex-1 bg-transparent outline-none text-lg text-gray-900 placeholder-gray-400"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
            ESC
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">No results found.</div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-gray-400">Navigation</div>
              {filteredCommands.map((command) => {
                const Icon = command.icon;
                return (
                  <button
                    key={command.id}
                    onClick={() => {
                      router.push(command.href);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="w-full flex items-center px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-black rounded-lg transition-colors group text-left"
                  >
                    <Icon size={18} className="text-gray-400 group-hover:text-black mr-3 transition-colors" />
                    <span className="font-medium">{command.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
