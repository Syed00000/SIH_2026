import React from 'react';

// Reusable animated skeleton pulse bar
export const SkeletonPulse = ({ className = '' }) => (
  <div className={`bg-slate-200/80 animate-pulse rounded-md ${className}`} />
);

// 1. Skeleton Loading for Nodal Stat Cards (4-Grid)
export const SkeletonStatCards = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 select-none">
    {[1, 2, 3, 4].map((n) => (
      <div key={n} className="bg-white border border-slate-200 rounded-md p-4 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <SkeletonPulse className="w-24 h-3.5" />
          <SkeletonPulse className="w-6 h-6 rounded-md" />
        </div>
        <SkeletonPulse className="w-16 h-7" />
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <SkeletonPulse className="w-20 h-3" />
          <SkeletonPulse className="w-12 h-3" />
        </div>
      </div>
    ))}
  </div>
);

// 2. Skeleton Loading for Nodal Overview Panels (Unassigned Queue & Allocation Cards)
export const SkeletonOverviewPanels = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 select-none">
    {[1, 2].map((n) => (
      <div key={n} className="bg-white border border-slate-200 rounded-md p-4 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <SkeletonPulse className="w-4 h-4 rounded-md" />
            <SkeletonPulse className="w-36 h-4" />
          </div>
          <SkeletonPulse className="w-20 h-3" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-3 border border-slate-100 rounded-md space-y-2">
              <div className="flex justify-between items-center">
                <SkeletonPulse className="w-28 h-3.5" />
                <SkeletonPulse className="w-16 h-3" />
              </div>
              <SkeletonPulse className="w-full h-3" />
              <div className="flex justify-between items-center">
                <SkeletonPulse className="w-24 h-3" />
                <SkeletonPulse className="w-14 h-5 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// 3. Skeleton Loading for Nodal Tables (HEI Directory & Citizen Ground Submissions)
export const SkeletonTable = ({ rows = 5, cols = 6 }) => (
  <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-2xs w-full select-none">
    <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
      <SkeletonPulse className="w-48 h-4" />
      <SkeletonPulse className="w-24 h-6 rounded-md" />
    </div>
    <div className="p-4 space-y-3">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex items-center space-x-4 py-2 border-b border-slate-100">
          <SkeletonPulse className="w-20 h-4" />
          <SkeletonPulse className="flex-1 h-4" />
          <SkeletonPulse className="w-24 h-4" />
          <SkeletonPulse className="w-28 h-4" />
          <SkeletonPulse className="w-20 h-6 rounded-md" />
        </div>
      ))}
    </div>
  </div>
);

// 4. Skeleton Loading for Cards Grid (HEI Cards & Problem Cards)
export const SkeletonGridCards = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 select-none">
    {Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="bg-white border border-slate-200 rounded-md p-4 space-y-3.5 shadow-2xs">
        <div className="flex justify-between items-center">
          <SkeletonPulse className="w-24 h-3.5" />
          <SkeletonPulse className="w-20 h-4 rounded-md" />
        </div>
        <SkeletonPulse className="w-full h-4" />
        <SkeletonPulse className="w-4/5 h-3" />
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <SkeletonPulse className="w-full h-3" />
          <SkeletonPulse className="w-full h-3" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <SkeletonPulse className="w-20 h-3" />
          <SkeletonPulse className="w-24 h-6 rounded-md" />
        </div>
      </div>
    ))}
  </div>
);

// 5. Skeleton Loading for Problem Dossier Detail View / Drawer
export const SkeletonDossierPanel = () => (
  <div className="bg-white border border-slate-200 rounded-md p-6 space-y-6 shadow-xs select-none animate-in fade-in">
    {/* Header Skeleton */}
    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
      <div className="space-y-2">
        <SkeletonPulse className="w-32 h-4" />
        <SkeletonPulse className="w-72 h-6" />
        <SkeletonPulse className="w-96 h-3" />
      </div>
      <SkeletonPulse className="w-32 h-8 rounded-md" />
    </div>

    {/* Tabs Skeleton */}
    <div className="flex space-x-2 border-b border-slate-200 pb-2">
      <SkeletonPulse className="w-36 h-8 rounded-md" />
      <SkeletonPulse className="w-36 h-8 rounded-md" />
      <SkeletonPulse className="w-36 h-8 rounded-md" />
    </div>

    {/* Content Skeleton */}
    <div className="space-y-4">
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-2">
        <SkeletonPulse className="w-48 h-4" />
        <SkeletonPulse className="w-full h-3" />
        <SkeletonPulse className="w-3/4 h-3" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 border border-slate-200 rounded-md space-y-3">
          <SkeletonPulse className="w-36 h-4" />
          <SkeletonPulse className="w-full h-3" />
          <SkeletonPulse className="w-4/5 h-3" />
          <SkeletonPulse className="w-2/3 h-3" />
        </div>
        <div className="p-4 border border-slate-200 rounded-md space-y-3">
          <SkeletonPulse className="w-36 h-4" />
          <SkeletonPulse className="w-full h-3" />
          <SkeletonPulse className="w-4/5 h-3" />
          <SkeletonPulse className="w-2/3 h-3" />
        </div>
      </div>
    </div>
  </div>
);

// 6. Skeleton Loading for Modal Forms (Nodal Assign / Allocation Modal)
export const SkeletonModalForm = () => (
  <div className="p-5 space-y-4 select-none">
    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
      <SkeletonPulse className="w-48 h-5" />
      <SkeletonPulse className="w-6 h-6 rounded-md" />
    </div>
    <div className="space-y-3">
      <SkeletonPulse className="w-full h-3" />
      <SkeletonPulse className="w-full h-10 rounded-md" />
      <SkeletonPulse className="w-32 h-3" />
      <SkeletonPulse className="w-full h-24 rounded-md" />
    </div>
    <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
      <SkeletonPulse className="w-20 h-8 rounded-md" />
      <SkeletonPulse className="w-28 h-8 rounded-md" />
    </div>
  </div>
);

export default SkeletonPulse;
