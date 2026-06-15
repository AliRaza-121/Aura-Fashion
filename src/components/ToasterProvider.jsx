"use client";
import { Toaster } from 'react-hot-toast';

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        // Default options for specific types
        className: '',
        duration: 4000,
        style: {
          background: '#000',
          color: '#fff',
          fontSize: '11px',
          fontWeight: 'bold',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          borderRadius: '2px',
          padding: '16px 24px',
          border: '1px solid #333',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        },
        success: {
          duration: 3000,
          style: {
            background: '#fff',
            color: '#000',
            border: '1px solid #e5e7eb',
          },
          iconTheme: {
            primary: '#000',
            secondary: '#fff',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#EF4444',
            color: '#fff',
            border: '1px solid #DC2626',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#EF4444',
          },
        },
      }}
    />
  );
}
