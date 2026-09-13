import React from 'react';
import { Compass, Plus, Minus, Home } from 'lucide-react';

export const JharkhandGisHeader = ({ basemapMode, onUpdateBasemap }) => {
  return (
    <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
      <div className="flex items-center space-x-2">
        <Compass className="w-4 h-4 text-slate-700" />
        <div>
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Jharkhand Geospatial Heatmap
          </h3>
          <p className="text-[10px] text-slate-400 font-medium leading-tight">
            Spatial density distribution across 24 districts (EPSG:4326)
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-1.5">
        <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200/70 text-[10px] font-semibold">
          {['canvas', 'satellite', 'topo'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onUpdateBasemap(mode)}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer capitalize ${
                basemapMode === mode
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {mode === 'topo' ? 'Terrain' : mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const JharkhandGisFloatingControls = ({ onZoomIn, onZoomOut, onResetView }) => {
  return (
    <div className="absolute top-3 left-3 z-[400] flex flex-col space-y-1 bg-white/95 backdrop-blur-xs p-1 rounded-xl border border-slate-200 shadow-xs">
      <button
        type="button"
        onClick={onZoomIn}
        className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-lg text-xs transition-colors cursor-pointer"
        title="Zoom In"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={onZoomOut}
        className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-lg text-xs transition-colors cursor-pointer"
        title="Zoom Out"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <div className="h-px bg-slate-200 my-0.5" />
      <button
        type="button"
        onClick={onResetView}
        className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-lg text-xs transition-colors cursor-pointer"
        title="Reset Home View"
      >
        <Home className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
