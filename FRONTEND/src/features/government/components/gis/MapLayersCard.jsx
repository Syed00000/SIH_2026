import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Check } from 'lucide-react';

export const MapLayersCard = ({ layers = {}, onToggleLayer }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const layerItems = [
    { key: 'districtBoundary', label: 'District Boundaries' },
    { key: 'problemMarkers', label: 'Problem Markers' },
    { key: 'problemHeatMap', label: 'Problem Heatmap' },
    { key: 'districtLabels', label: 'District Labels' }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-md text-xs w-48 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full px-3 py-2 flex items-center justify-between font-bold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#007A61]" />
          Map Layers
        </span>
        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
      </button>

      {isExpanded && (
        <div className="px-3 pb-2.5 pt-1 space-y-1.5 border-t border-slate-100">
          {layerItems.map((item) => {
            const isActive = !!layers[item.key];
            return (
              <label
                key={item.key}
                onClick={() => onToggleLayer && onToggleLayer(item.key)}
                className="flex items-center justify-between text-slate-700 hover:text-slate-900 cursor-pointer py-0.5 select-none"
              >
                <span className="text-[11px] font-medium">{item.label}</span>
                <div
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-colors ${
                    isActive
                      ? 'bg-[#007A61] border-[#007A61] text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isActive && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MapLayersCard;
