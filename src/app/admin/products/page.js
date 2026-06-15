"use client";
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import SkeletonLoader from '@/components/SkeletonLoader';

const fetcher = (url) => fetch(url).then((res) => res.json());

const defaultFormData = {
  title: '',
  description: '',
  price: '',
  category: 'Mens',
  subCategory: '',
  images: [],
  colorImages: [],
  sizes: ['S', 'M', 'L'],
  colors: ['Black'],
  isFeatured: false,
  isBestSeller: false,
  stockQuantity: 10,
  liveViewers: 23,
  rating: 5,
  reviewCount: 0,
  features: '',
  shippingDetails: '',
  sku: ''
};

export default function AdminProducts() {
  const { data: products, error, mutate, isLoading } = useSWR('/api/admin/products', fetcher, {
    refreshInterval: 5000,
  });
  const loading = isLoading;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState(defaultFormData);

  const handleToggle = async (id, field, currentValue) => {
    // Optimistic update
    mutate(products.map(p => p._id === id ? { ...p, [field]: !currentValue } : p), false);
    
    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !currentValue })
    });
    
    mutate();
  };

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setFormData(product ? { ...defaultFormData, ...product } : defaultFormData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct._id}` : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        handleCloseModal();
        mutate();
        toast.success("Product saved successfully");
      } else {
        toast.error("Error saving product");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = (id) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-xl rounded-xl border border-gray-100 pointer-events-auto flex flex-col p-5 gap-4 ring-1 ring-black/5`}>
        <div className="font-bold text-gray-900 text-base">Confirm Deletion</div>
        <div className="text-sm text-gray-500">Are you sure you want to delete this product? This action cannot be undone.</div>
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
                await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
                mutate();
                toast.success("Product deleted successfully");
              } catch (e) {
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex items-center w-full sm:w-auto gap-4">
          <div className="relative flex-grow sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 whitespace-nowrap shrink-0 hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full">
              <SkeletonLoader count={8} className="w-full" />
            </div>
          ) : products?.length === 0 ? (
            <div className="col-span-full p-12 text-center text-sm font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">No products found. Create one!</div>
          ) : (
            (products?.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())) || []).map(product => (
              <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-all group">
                {/* Image */}
                <div className="aspect-[4/5] relative overflow-hidden bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.isFeatured && (
                      <span className="bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">Featured</span>
                    )}
                    {product.isBestSeller && (
                      <span className="bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">Best Seller</span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight">{product.title}</h3>
                  <p className="text-sm font-medium text-gray-500 mt-1.5">Rs {product.price.toLocaleString()}</p>
                  
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                      product.category === 'Mens' ? 'bg-blue-50 text-blue-600' :
                      product.category === 'Womens' ? 'bg-pink-50 text-pink-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {product.category}
                    </span>
                    {product.subCategory && (
                      <span className="px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                        {product.subCategory}
                      </span>
                    )}
                  </div>

                  {product.stockQuantity !== undefined && (
                    <div className="mt-3 flex items-center text-[10px] font-bold text-gray-500">
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${product.stockQuantity > 10 ? 'bg-green-500' : product.stockQuantity > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                      {product.stockQuantity} in stock
                    </div>
                  )}

                  <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-3">
                        <label className="flex flex-col items-start gap-1 cursor-pointer group/toggle">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Featured</span>
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={product.isFeatured} 
                              onChange={() => handleToggle(product._id, 'isFeatured', product.isFeatured)} 
                            />
                            <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-black group-hover/toggle:ring-2 ring-black/10 transition-all"></div>
                          </div>
                        </label>
                        <label className="flex flex-col items-start gap-1 cursor-pointer group/toggle">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Best</span>
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={product.isBestSeller} 
                              onChange={() => handleToggle(product._id, 'isBestSeller', product.isBestSeller)} 
                            />
                            <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-black group-hover/toggle:ring-2 ring-black/10 transition-all"></div>
                          </div>
                        </label>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => handleOpenModal(product)} 
                          className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors rounded-lg border border-transparent hover:border-gray-200"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)} 
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg border border-transparent hover:border-red-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      {/* Modal */}
      {/* Slide-out Drawer Overlay */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity"
          onClick={handleCloseModal}
        />
      )}

      {/* Slide-out Drawer Panel */}
      <div 
        className={`fixed inset-y-0 right-0 z-[70] w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isModalOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-6">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest border-b border-gray-200 pb-3">Basic Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Title</label>
                      <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Price (Rs)</label>
                      <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all shadow-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                    <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all h-28 resize-none shadow-sm" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all shadow-sm appearance-none">
                        <option value="Mens">Mens</option>
                        <option value="Womens">Womens</option>
                        <option value="Kids">Kids</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Sub Category</label>
                      <input type="text" value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})} placeholder="e.g. T-Shirts" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">SKU</label>
                      <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all shadow-sm" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Stock Qty</label>
                      <input type="number" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: Number(e.target.value)})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Live Viewers</label>
                      <input type="number" value={formData.liveViewers} onChange={e => setFormData({...formData, liveViewers: Number(e.target.value)})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Rating</label>
                      <input type="number" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Review Count</label>
                      <input type="number" value={formData.reviewCount} onChange={e => setFormData({...formData, reviewCount: Number(e.target.value)})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all shadow-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Features (About this item)</label>
                      <textarea value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all h-20 resize-none shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Shipping Details</label>
                      <textarea value={formData.shippingDetails} onChange={e => setFormData({...formData, shippingDetails: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all h-20 resize-none shadow-sm" />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-6">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest border-b border-gray-200 pb-3">Media & Variants</h3>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Product Images</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {formData.images.map((imgUrl, index) => (
                        <div key={index} className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                          <img src={imgUrl} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = [...formData.images];
                              newImages.splice(index, 1);
                              setFormData({...formData, images: newImages});
                            }}
                            className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-110 shadow-sm"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      
                      <div className="h-full min-h-[150px]">
                        <ImageUpload 
                          value="" 
                          onUpload={(url) => {
                            if (url) {
                              setFormData({...formData, images: [...formData.images, url]});
                            }
                          }} 
                          label="Add Image"
                          compact={true}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Sizes (comma separated)</label>
                      <input type="text" value={formData.sizes?.join(', ')} onChange={e => setFormData({...formData, sizes: e.target.value.split(',').map(s=>s.trim())})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Colors (comma separated)</label>
                      <input type="text" value={formData.colors?.join(', ')} onChange={e => {
                        const newColors = e.target.value.split(',').map(s=>s.trim());
                        // Keep colorImages synced (optional, but good practice to keep old colors around until saved)
                        setFormData({...formData, colors: newColors});
                      }} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all shadow-sm" />
                    </div>
                  </div>

                  {/* Color Specific Images */}
                  {formData.colors?.length > 0 && formData.colors[0] !== "" && (
                    <div className="pt-6 border-t border-gray-200">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Color Variants Images</label>
                      <p className="text-xs text-gray-400 mb-4">Upload specific galleries for each color. When a user selects this color on the product page, they will see these specific images.</p>
                      
                      <div className="space-y-8">
                        {formData.colors.map((color) => {
                          const existingColorObj = formData.colorImages?.find(c => c.color === color) || { color, images: [] };
                          return (
                            <div key={color} className="p-4 bg-white border border-gray-200 rounded-xl">
                              <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                                <div className="w-3 h-3 rounded-full mr-2 border border-gray-300" style={{ backgroundColor: color.toLowerCase() }}></div>
                                {color} Gallery
                              </h4>
                              
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {existingColorObj.images.map((imgUrl, index) => (
                                  <div key={index} className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                    <img src={imgUrl} alt={`${color} ${index + 1}`} className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedColorImages = [...(formData.colorImages || [])];
                                        const colorIdx = updatedColorImages.findIndex(c => c.color === color);
                                        if (colorIdx !== -1) {
                                          updatedColorImages[colorIdx].images.splice(index, 1);
                                          setFormData({...formData, colorImages: updatedColorImages});
                                        }
                                      }}
                                      className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-110 shadow-sm"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ))}
                                
                                <div className="h-full min-h-[150px]">
                                  <ImageUpload 
                                    value="" 
                                    onUpload={(url) => {
                                      if (url) {
                                        const updatedColorImages = [...(formData.colorImages || [])];
                                        const colorIdx = updatedColorImages.findIndex(c => c.color === color);
                                        if (colorIdx !== -1) {
                                          updatedColorImages[colorIdx].images.push(url);
                                        } else {
                                          updatedColorImages.push({ color, images: [url] });
                                        }
                                        setFormData({...formData, colorImages: updatedColorImages});
                                      }
                                    }} 
                                    label={`Add ${color} Image`}
                                    compact={true}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-6">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest border-b border-gray-200 pb-3">Visibility</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.isFeatured ? 'border-black bg-gray-900 text-white' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="hidden" />
                      <div className="flex-1">
                        <span className="block text-sm font-bold tracking-wide uppercase mb-1">New Arrival</span>
                        <span className={`block text-xs ${formData.isFeatured ? 'text-gray-300' : 'text-gray-500'}`}>Feature this on the homepage hero slider</span>
                      </div>
                    </label>
                    <label className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.isBestSeller ? 'border-black bg-gray-900 text-white' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <input type="checkbox" checked={formData.isBestSeller} onChange={e => setFormData({...formData, isBestSeller: e.target.checked})} className="hidden" />
                      <div className="flex-1">
                        <span className="block text-sm font-bold tracking-wide uppercase mb-1">Best Seller</span>
                        <span className={`block text-xs ${formData.isBestSeller ? 'text-gray-300' : 'text-gray-500'}`}>Highlight in the best sellers grid</span>
                      </div>
                    </label>
                  </div>
                </div>

              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-end space-x-3">
              <button onClick={handleCloseModal} className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
              <button type="submit" form="productForm" className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">Save Product</button>
            </div>

          </div>

    </div>
  );
}
