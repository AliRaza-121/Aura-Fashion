"use client";

export default function SkeletonLoader({ count = 8, className = "" }) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 w-full ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex flex-col animate-pulse">
          <div className="relative aspect-[3/4] bg-gray-200 mb-4 rounded-sm"></div>
          <div className="h-4 bg-gray-200 w-3/4 mb-2 rounded-sm"></div>
          <div className="h-3 bg-gray-200 w-1/4 rounded-sm"></div>
        </div>
      ))}
    </div>
  );
}
