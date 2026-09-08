import React, { useState, useRef, useEffect } from 'react';
import {
  Menu, X, Plus, Minus, Crosshair, Layers, Check,
  MapPin, Eye, Flame, Map, ArrowLeft
} from 'lucide-react';

export const MapControls = ({
  onZoomIn,
  onZoomOut,
  onRecenter,
  tileMode = 'light',
  onToggleTileMode,
  layers = {},
  onToggleLayer,
  isDistrictSelected = false,
  onBackToState
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const layerItems = [
    { key: 'districtBoundary', label: 'District Boundaries', icon: MapPin },
    { key: 'districtLabels', label: 'District Name Badges', icon: Eye },
    { key: 'problemMarkers', label: 'Problem Markers', icon: Map },
    { key: 'problemHeatMap', label: 'Problem Heatmap', icon: Flame }
  ];

  return (
    <div ref={dropdownRef} className="relative z-[500]">
      {/* Sleek Hamburger / Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 bg-white/95 hover:bg-white text-slate-800 rounded-xl border border-slate-200/90 shadow-md backdrop-blur-md text-xs font-bold transition-all cursor-pointer hover:border-[#007A61]"
        title="Map Navigation & Layer Controls"
      >
        {isOpen ? <X className="w-4 h-4 text-slate-600" /> : <Menu className="w-4 h-4 text-[#007A61]" />}
        <span>Map Tools & Layers</span>
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-11 left-0 w-60 bg-white/98 backdrop-blur-lg rounded-2xl border border-slate-200 shadow-xl p-3 text-xs space-y-3 animate-in fade-in-50 zoom-in-95 duration-100">
          {/* Navigation Zoom & Recenter */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Zoom & View
            </span>
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/70">
              <button
                type="button"
                onClick={onZoomIn}
                className="flex-1 py-1 flex items-center justify-center gap-1 font-bold text-slate-700 hover:bg-white hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                title="Zoom In"
              >
                <Plus className="w-3.5 h-3.5" /> <span>In</span>
              </button>
              <div className="w-px h-4 bg-slate-200" />
              <button
                type="button"
                onClick={onZoomOut}
                className="flex-1 py-1 flex items-center justify-center gap-1 font-bold text-slate-700 hover:bg-white hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <Minus className="w-3.5 h-3.5" /> <span>Out</span>
              </button>
              <div className="w-px h-4 bg-slate-200" />
              <button
                type="button"
                onClick={() => {
                  onRecenter?.();
                  setIsOpen(false);
                }}
                className="flex-1 py-1 flex items-center justify-center gap-1 font-bold text-slate-700 hover:bg-white hover:text-[#007A61] rounded-lg transition-colors cursor-pointer"
                title="Recenter Map to Jharkhand"
              >
                <Crosshair className="w-3.5 h-3.5" /> <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Basemap Switcher */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Base Map Style
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => tileMode !== 'light' && onToggleTileMode?.()}
                className={`py-1.5 px-2 rounded-lg font-bold text-[11px] border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  tileMode === 'light'
                    ? 'bg-[#007A61] text-white border-[#007A61] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3 h-3" /> Streets
              </button>
              <button
                type="button"
                onClick={() => tileMode !== 'satellite' && onToggleTileMode?.()}
                className={`py-1.5 px-2 rounded-lg font-bold text-[11px] border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  tileMode === 'satellite'
                    ? 'bg-[#007A61] text-white border-[#007A61] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3 h-3" /> Satellite
              </button>
            </div>
          </div>

          {/* Layer Visibility Toggles */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Map Overlays & Layers
            </span>
            <div className="space-y-1">
              {layerItems.map((item) => {
                const isActive = layers[item.key] !== false;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onToggleLayer?.(item.key)}
                    className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-[11px] font-semibold">
                      <IconComponent className="w-3.5 h-3.5 text-slate-500" />
                      {item.label}
                    </span>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        isActive
                          ? 'bg-[#007A61] border-[#007A61] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isActive && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Return to State View Button if District is selected */}
          {isDistrictSelected && (
            <div className="pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  onBackToState?.();
                  setIsOpen(false);
                }}
                className="w-full py-1.5 px-3 bg-[#007A61] hover:bg-[#00624e] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to State View</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapControls;
