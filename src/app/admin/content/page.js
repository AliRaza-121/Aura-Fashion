"use client";
import { useState, useEffect } from 'react';
import { UploadCloud, Eye, EyeOff, Search, ChevronDown, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/ImageUpload';

const VisibilityToggle = ({ label, isVisible, onToggle }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 transition-all hover:border-gray-300">
    <div className="flex items-center gap-3">
      {isVisible ? <Eye size={18} className="text-green-500" /> : <EyeOff size={18} className="text-gray-400" />}
      <span className={`text-sm font-bold ${isVisible ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={isVisible} onChange={onToggle} />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
    </label>
  </div>
);

const ProductSelector = ({ label, value, onChange, products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const selectedProduct = products.find(p => p._id === value);
  const filteredProducts = products.filter(p => (p.title || p.name).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</label>
      
      {/* Selected State / Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm flex justify-between items-center cursor-pointer hover:border-gray-400"
      >
        <span className={selectedProduct ? "text-black font-medium" : "text-gray-400"}>
          {selectedProduct ? (selectedProduct.title || selectedProduct.name) : "Select a Product"}
        </span>
        <ChevronDown size={16} className="text-gray-400" />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <input 
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full text-sm outline-none"
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-2 space-y-1">
            <div 
              onClick={() => { onChange(''); setIsOpen(false); setSearch(''); }}
              className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${!value ? 'bg-gray-100 font-bold text-black' : 'hover:bg-gray-50 text-gray-600'}`}
            >
              None / Clear Selection
            </div>
            {filteredProducts.map(p => (
              <div 
                key={p._id}
                onClick={() => { onChange(p._id); setIsOpen(false); setSearch(''); }}
                className={`px-3 py-2 flex items-center gap-3 rounded-lg text-sm cursor-pointer transition-colors ${value === p._id ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-800'}`}
              >
                <div className="w-8 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
                  {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-grow truncate">
                  <div className="font-medium truncate">{p.title || p.name}</div>
                  <div className={value === p._id ? 'text-gray-300 text-xs' : 'text-gray-500 text-xs'}>Rs {p.price?.toLocaleString()}</div>
                </div>
                {value === p._id && <Check size={16} />}
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500">No products found.</div>
            )}
          </div>
        </div>
      )}
      
      {/* Invisible backdrop to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
      )}
    </div>
  );
};

export default function AdminContent() {
  const [content, setContent] = useState(null);
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch('/api/admin/content');
        let data = await res.json();
        
        // Ensure visibility object exists if fetching old data
        if (!data.visibility) {
          data.visibility = {
            hero: true, newArrivals: true, bestSellers: true, 
            lookbook: true, parallaxCampaign: true, featuredLook: true
          };
        }
        setContent(data);

        // Fetch products for dropdowns
        const prodRes = await fetch('/api/admin/products');
        const prodData = await prodRes.json();
        setDbProducts(prodData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      if (res.ok) {
        toast.success('Content saved successfully! The storefront has been updated.');
      } else {
        toast.error('Error saving content.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = (section) => {
    setContent(prev => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [section]: !prev.visibility[section]
      }
    }));
  };

  if (loading) return <div className="p-8 text-gray-500">Loading CMS...</div>;

  return (
    <div className="space-y-6 pb-32">
      <div className="sticky top-0 z-30 bg-gray-50/80 backdrop-blur-md pb-4 pt-2 -mx-2 px-2 flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200/50 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Storefront Content</h1>
          <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mt-1">Live Website Configuration</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.15em] disabled:opacity-50 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
        >
          {saving ? 'Publishing...' : 'Publish Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* GLOBAL VISIBILITY TOGGLES */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-6 flex items-center tracking-tight"><span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-3"></span> Homepage Visibility</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <VisibilityToggle label="Hero Section" isVisible={content.visibility.hero} onToggle={() => toggleVisibility('hero')} />
            <VisibilityToggle label="New Arrivals" isVisible={content.visibility.newArrivals} onToggle={() => toggleVisibility('newArrivals')} />
            <VisibilityToggle label="Best Sellers" isVisible={content.visibility.bestSellers} onToggle={() => toggleVisibility('bestSellers')} />
            <VisibilityToggle label="Lookbook" isVisible={content.visibility.lookbook} onToggle={() => toggleVisibility('lookbook')} />
            <VisibilityToggle label="Parallax Campaign" isVisible={content.visibility.parallaxCampaign} onToggle={() => toggleVisibility('parallaxCampaign')} />
            <VisibilityToggle label="Featured Look" isVisible={content.visibility.featuredLook} onToggle={() => toggleVisibility('featuredLook')} />
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 opacity-100 transition-opacity" style={{ opacity: content.visibility.hero ? 1 : 0.5 }}>
          <h2 className="text-lg font-bold mb-6 flex items-center tracking-tight"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-3"></span> Hero Section</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Heading</label>
                <input type="text" value={content.hero?.heading || ''} onChange={(e) => setContent({...content, hero: {...content.hero, heading: e.target.value}})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none shadow-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subheading</label>
                <input type="text" value={content.hero?.subheading || ''} onChange={(e) => setContent({...content, hero: {...content.hero, subheading: e.target.value}})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none shadow-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Button Text</label>
                  <input type="text" value={content.hero?.buttonText || ''} onChange={(e) => setContent({...content, hero: {...content.hero, buttonText: e.target.value}})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Button Link</label>
                  <input type="text" value={content.hero?.buttonLink || ''} onChange={(e) => setContent({...content, hero: {...content.hero, buttonLink: e.target.value}})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none shadow-sm" />
                </div>
              </div>
            </div>
            
            <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Background Image</label>
              <ImageUpload 
                value={content.hero?.image} 
                onUpload={(url) => setContent({...content, hero: {...content.hero, image: url}})} 
                label="Upload Hero Image"
              />
            </div>
          </div>
        </div>

        {/* PARALLAX CAMPAIGN */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200" style={{ opacity: content.visibility.parallaxCampaign ? 1 : 0.5 }}>
          <h2 className="text-lg font-bold mb-6 flex items-center tracking-tight"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 mr-3"></span> Parallax Campaign</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Heading</label>
                <input type="text" value={content.parallaxCampaign?.heading || ''} onChange={(e) => setContent({...content, parallaxCampaign: {...content.parallaxCampaign, heading: e.target.value}})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none shadow-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subheading</label>
                <textarea value={content.parallaxCampaign?.subheading || ''} onChange={(e) => setContent({...content, parallaxCampaign: {...content.parallaxCampaign, subheading: e.target.value}})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm h-24 resize-none outline-none shadow-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Button Text</label>
                  <input type="text" value={content.parallaxCampaign?.buttonText || ''} onChange={(e) => setContent({...content, parallaxCampaign: {...content.parallaxCampaign, buttonText: e.target.value}})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Button Link</label>
                  <input type="text" value={content.parallaxCampaign?.buttonLink || ''} onChange={(e) => setContent({...content, parallaxCampaign: {...content.parallaxCampaign, buttonLink: e.target.value}})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none shadow-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-200">
                <ProductSelector 
                  label="Select Campaign Product" 
                  value={content.parallaxCampaign?.productId} 
                  products={dbProducts}
                  onChange={(val) => setContent({...content, parallaxCampaign: {...content.parallaxCampaign, productId: val}})} 
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Background Parallax Image</label>
                <ImageUpload 
                  value={content.parallaxCampaign?.image} 
                  onUpload={(url) => setContent({...content, parallaxCampaign: {...content.parallaxCampaign, image: url}})} 
                  label="Upload Background"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FEATURED LOOK */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200" style={{ opacity: content.visibility.featuredLook ? 1 : 0.5 }}>
          <h2 className="text-lg font-bold mb-6 flex items-center tracking-tight"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-3"></span> Featured Look</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Heading</label>
                <textarea value={content.featuredLook?.heading || ''} onChange={(e) => setContent({...content, featuredLook: {...content.featuredLook, heading: e.target.value}})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none shadow-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                <textarea value={content.featuredLook?.description || ''} onChange={(e) => setContent({...content, featuredLook: {...content.featuredLook, description: e.target.value}})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm h-24 resize-none outline-none shadow-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Bundle Price</label>
                  <input type="number" value={content.featuredLook?.bundlePrice || ''} onChange={(e) => setContent({...content, featuredLook: {...content.featuredLook, bundlePrice: Number(e.target.value)}})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Button Text</label>
                  <input type="text" value={content.featuredLook?.buttonText || ''} onChange={(e) => setContent({...content, featuredLook: {...content.featuredLook, buttonText: e.target.value}})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none shadow-sm" />
                </div>
              </div>
              <div className="border-t border-gray-200 pt-6">
                 <label className="block text-xs font-bold text-gray-800 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Bundle Items</label>
                 <div className="space-y-6">
                   {[1, 2, 3].map(num => (
                     <div key={num} className="grid grid-cols-1 gap-4 items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                       <div className="w-full">
                          <ProductSelector 
                            label={`Item ${num} Product`} 
                            value={content.featuredLook?.[`item${num}ProductId`]} 
                            products={dbProducts}
                            onChange={(val) => setContent({...content, featuredLook: {...content.featuredLook, [`item${num}ProductId`]: val}})} 
                          />
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
            
            <div className="space-y-6 h-fit">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Main Image</label>
                 <ImageUpload 
                   value={content.featuredLook?.image} 
                   onUpload={(url) => setContent({...content, featuredLook: {...content.featuredLook, image: url}})} 
                   label="Upload Main Image"
                 />
              </div>
            </div>
          </div>
        </div>

        {/* LOOKBOOK */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200" style={{ opacity: content.visibility.lookbook ? 1 : 0.5 }}>
          <h2 className="text-lg font-bold mb-6 flex items-center tracking-tight"><span className="w-2.5 h-2.5 rounded-full bg-pink-500 mr-3"></span> Lookbook</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-100 h-fit">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Heading</label>
                <input type="text" value={content.lookbook?.heading || ''} onChange={(e) => setContent({...content, lookbook: {...content.lookbook, heading: e.target.value}})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none shadow-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subheading</label>
                <input type="text" value={content.lookbook?.subheading || ''} onChange={(e) => setContent({...content, lookbook: {...content.lookbook, subheading: e.target.value}})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none shadow-sm" />
              </div>
              <div className="border-t border-gray-200 pt-6">
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Shop Section</label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Shop Heading</label>
                    <input type="text" value={content.lookbook?.shopHeading || ''} onChange={(e) => setContent({...content, lookbook: {...content.lookbook, shopHeading: e.target.value}})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Shop Description</label>
                    <textarea value={content.lookbook?.shopDescription || ''} onChange={(e) => setContent({...content, lookbook: {...content.lookbook, shopDescription: e.target.value}})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm h-24 resize-none outline-none shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Button Text</label>
                    <input type="text" value={content.lookbook?.buttonText || ''} onChange={(e) => setContent({...content, lookbook: {...content.lookbook, buttonText: e.target.value}})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none shadow-sm" />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Shoppable Items</label>
                <div className="space-y-6">
                  {[1, 2, 3].map(num => (
                    <div key={num} className="grid grid-cols-1 gap-4 items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="w-full">
                        <ProductSelector 
                          label={`Item ${num} Product`} 
                          value={content.lookbook?.[`item${num}ProductId`]} 
                          products={dbProducts}
                          onChange={(val) => setContent({...content, lookbook: {...content.lookbook, [`item${num}ProductId`]: val}})} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
            
            <div className="space-y-6 h-fit">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Main Look Image</label>
                <ImageUpload 
                  value={content.lookbook?.images?.[0]} 
                  onUpload={(url) => { 
                    const newImages = [...(content.lookbook?.images || [])];
                    newImages[0] = url || "";
                    setContent({...content, lookbook: {...content.lookbook, images: newImages}}); 
                  }} 
                  label="Upload Main Image"
                />
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
