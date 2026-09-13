import React from 'react';
import { MapPin } from 'lucide-react';

export const JharkhandGisHoverCard = ({ hoveredDistrict }) => {
  if (!hoveredDistrict) return null;

  return (
    <div className="absolute top-3 right-3 z-[400] bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1.5 min-w-[185px] animate-fadeIn">
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-1">
        <span className="font-bold text-sm text-white flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          {hoveredDistrict.name}
        </span>
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
          {hoveredDistrict.totalProblems > 0 ? 'Active Need' : 'Zero / Clean'}
        </span>
      </div>
      <div className="flex justify-between text-[11px] text-slate-300">
        <span>Total Problems:</span>
        <span className="font-bold text-white">
          {(hoveredDistrict.totalProblems || 0).toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between text-[11px] text-slate-300">
        <span>Resolved:</span>
        <span className="font-bold text-emerald-400">
          {(hoveredDistrict.resolvedProblems || 0).toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between text-[11px] text-slate-300">
        <span>Active HEIs:</span>
        <span className="font-bold text-purple-300">
          {hoveredDistrict.activeHeis || 0}
        </span>
      </div>
      <div className="text-[9.5px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between items-center">
        <span>District Node</span>
        <span className="text-blue-400 font-semibold cursor-pointer">Click to filter</span>
      </div>
    </div>
  );
};

export default JharkhandGisHoverCard;
