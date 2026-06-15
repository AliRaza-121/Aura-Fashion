"use client";
import { useState, useRef } from 'react';
import { UploadCloud, Loader2, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function ImageUpload({ onUpload, value, circle = false, label = "Upload Image", compact = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = async (file) => {
    if (!file) return;
    setIsUploading(true);
    
    try {
      // 1. Get Signature
      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = { timestamp };
      
      const sigRes = await fetch('/api/sign-cloudinary-params', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paramsToSign })
      });
      
      if (!sigRes.ok) throw new Error("Failed to sign request");
      const { signature } = await sigRes.json();
      
      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (!uploadRes.ok) throw new Error("Upload failed");
      const data = await uploadRes.json();
      
      if (data.secure_url) {
        onUpload(data.secure_url);
      }
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  if (circle) {
    return (
      <div className="flex flex-col items-center">
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative w-24 h-24 rounded-full overflow-hidden flex items-center justify-center cursor-pointer transition-all border-2
            ${isDragging ? 'border-black bg-gray-100 scale-105' : 'border-dashed border-gray-300 hover:border-gray-400 bg-gray-50'}
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <UploadCloud className="text-gray-400" size={24} />
          )}
          
          {isUploading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center backdrop-blur-sm z-10">
              <Loader2 className="animate-spin text-black" size={24} />
            </div>
          )}
        </div>
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleChange} 
        />
        <button 
          type="button" 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className="mt-3 text-[10px] font-bold text-gray-500 hover:text-black uppercase tracking-widest"
        >
          {label}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full h-full relative border-2 border-dashed rounded-xl ${compact ? 'p-4 min-h-[120px]' : 'p-8 min-h-[150px]'} flex flex-col items-center justify-center cursor-pointer transition-all
          ${isDragging ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400 bg-white'}
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleChange} 
        />

        {isUploading ? (
           <div className="flex flex-col items-center justify-center text-gray-500">
             <Loader2 className="animate-spin mb-2" size={compact ? 20 : 28} />
             <span className="text-[10px] font-bold uppercase tracking-widest">Uploading...</span>
           </div>
        ) : value ? (
          <div className="relative w-full h-full group flex items-center justify-center">
            <img src={value} alt="Preview" className="w-full h-full object-cover rounded shadow-sm border border-gray-200" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition-opacity">
              <span className={`text-white font-bold tracking-widest uppercase flex items-center ${compact ? 'text-[9px]' : 'text-xs'}`}>
                <UploadCloud size={compact ? 12 : 16} className={compact ? "mr-1" : "mr-2"} /> {compact ? 'Change' : 'Change Image'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500 w-full">
            <div className={`${compact ? 'w-8 h-8 mb-2' : 'w-12 h-12 mb-3'} bg-gray-50 rounded-full flex items-center justify-center shrink-0`}>
              <ImageIcon size={compact ? 16 : 24} className="text-gray-400" />
            </div>
            <span className={`${compact ? 'text-xs' : 'text-sm'} font-bold text-gray-900 mb-1 text-center leading-tight`}>{label}</span>
            {!compact && (
              <span className="text-xs text-gray-400 text-center px-2">Drag and drop an image here, or click to browse</span>
            )}
          </div>
        )}
      </div>
      
      {value && !isUploading && (
        <button 
          type="button" 
          onClick={(e) => { e.stopPropagation(); onUpload(""); }}
          className="mt-3 flex items-center text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest"
        >
          <X size={12} className="mr-1" /> Remove Image
        </button>
      )}
    </div>
  );
}
