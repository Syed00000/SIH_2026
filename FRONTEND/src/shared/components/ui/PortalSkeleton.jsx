import React from 'react';
import { Skeleton } from './skeleton.jsx';

export const PortalSkeleton = () => {
  return (
    <div className="w-full max-w-[1600px] space-y-6 animate-in fade-in duration-500">
      {/* Banner Skeleton */}
      <Skeleton className="w-full h-48 sm:h-56 md:h-64 rounded-2xl" />

      {/* Grid Categories Skeleton */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats/Activities Skeleton */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-full h-20 rounded-xl" />
          ))}
        </div>
      </div>

      {/* List/Cards Skeleton */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="w-full h-32 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortalSkeleton;
