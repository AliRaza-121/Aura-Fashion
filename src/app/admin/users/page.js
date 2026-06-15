"use client";
import { useState, useEffect } from 'react';
import { Plus, Trash2, X, CheckCircle2, XCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import TableSkeleton from '@/components/admin/TableSkeleton';

export default function AdminUsers() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isAdmin: false
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      isAdmin: false
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        handleCloseModal();
        fetchUsers();
      } else {
        toast.error(data.error || "Error creating user");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-xl rounded-xl border border-gray-100 pointer-events-auto flex flex-col p-5 gap-4 ring-1 ring-black/5`}>
        <div className="font-bold text-gray-900 text-base">Confirm Deletion</div>
        <div className="text-sm text-gray-500">Are you sure you want to delete this user? This action cannot be undone.</div>
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
                const data = await res.json();
                if (res.ok) {
                  fetchUsers();
                  toast.success("User deleted successfully");
                } else {
                  toast.error(data.error || "Failed to delete user");
                }
              } catch (err) {
                console.error(err);
                toast.error("Something went wrong");
              }
            }}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity, position: 'top-center' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Users</h1>
        <button 
          onClick={handleOpenModal}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span>Add User</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200 shadow-sm sticky top-0 z-10">
              <tr className="text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-bold">Name</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">Role</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Joined</th>
                <th className="p-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="p-0"><TableSkeleton columns={6} rows={4} /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-sm text-gray-400">No users found.</td></tr>
              ) : (
                users.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-sm text-gray-900">{user.name}</td>
                    <td className="p-4 text-sm text-gray-600">{user.email}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.isAdmin ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      {user.isVerified ? (
                        <span className="flex items-center text-green-600 text-xs font-bold"><CheckCircle2 size={14} className="mr-1" /> Verified</span>
                      ) : (
                        <span className="flex items-center text-red-500 text-xs font-bold"><XCircle size={14} className="mr-1" /> Unverified</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(user._id)} 
                        disabled={session?.user?.id === user._id}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:hover:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                        title={session?.user?.id === user._id ? "Cannot delete yourself" : "Delete User"}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h2 className="text-xl font-bold tracking-tight">Add New User</h2>
              <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6">
              <form id="userForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all shadow-sm" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all shadow-sm" placeholder="jane@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
                  <input required type="password" minLength={6} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all shadow-sm" placeholder="••••••••" />
                </div>
                <div className="pt-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={formData.isAdmin} onChange={e => setFormData({...formData, isAdmin: e.target.checked})} className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black" />
                    <span className="text-sm font-bold text-gray-900">Grant Admin Privileges</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 pl-7">User will have full access to the admin panel.</p>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3 rounded-b-2xl">
              <button type="button" onClick={handleCloseModal} className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
              <button type="submit" form="userForm" disabled={submitting} className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50">
                {submitting ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
