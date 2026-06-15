"use client";
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function RevenueChart({ data }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 w-full mt-6 flex items-center justify-center text-gray-400 text-sm">Loading chart data...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="h-64 w-full mt-6 flex items-center justify-center text-gray-400 text-sm">Loading chart data...</div>;
  }

  return (
    <div className="h-64 w-full mt-6">
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#000000" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#6B7280' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#6B7280' }}
            tickFormatter={(value) => `Rs ${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
            width={60}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#000', fontWeight: 'bold' }}
            formatter={(value) => [`Rs ${value.toLocaleString()}`, 'Revenue']}
            labelStyle={{ color: '#6B7280', fontSize: '13px', marginBottom: '4px' }}
            cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#000000" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff', fill: '#000' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
