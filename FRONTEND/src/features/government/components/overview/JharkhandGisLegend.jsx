import React from 'react';
import { Info } from 'lucide-react';

export const JharkhandGisLegend = ({ cursorCoords }) => {
  return (
    <>
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 shadow-xs text-[10px] space-y-1">
        <span className="font-bold text-slate-700 block text-[9.5px] uppercase tracking-wider mb-1">
          Problem Density
        </span>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#dc2626]" />
          <span className="text-slate-600 font-medium">Active Hotspot (4+ Issues)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#ea580c]" />
          <span className="text-slate-600 font-medium">Elevated (2-3 Issues)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#f59e0b]" />
          <span className="text-slate-600 font-medium">Moderate (1 Issue)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#10b981]" />
          <span className="text-slate-600 font-medium">Resolved Cases</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#cbd5e1]" />
          <span className="text-slate-600 font-medium">Zero / Clean (0)</span>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-[400] bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[9.5px] font-mono flex items-center space-x-2 border border-slate-700/60 shadow-xs">
        <span>{cursorCoords?.lat || '23.6500'}° N, {cursorCoords?.lng || '85.5500'}° E</span>
        <span className="text-slate-500">|</span>
        <span className="text-slate-400">EPSG:4326</span>
      </div>
    </>
  );
};

export const JharkhandGisFooter = ({ selectedDistrict }) => {
  return (
    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-2.5">
      <div className="flex items-center space-x-1.5">
        <Info className="w-3.5 h-3.5 text-slate-400" />
        <span>Jharkhand State Remote Sensing Data Centre (JSAC) • 24 Districts</span>
      </div>
      <div className="text-[10px] font-semibold text-slate-500">
        Filtered District: <strong className="text-slate-800">{selectedDistrict}</strong>
      </div>
    </div>
  );
};
