import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Info,
  ArrowRight,
  Hammer,
  HeartPulse,
  GraduationCap,
  Briefcase,
  Coins,
  Radio,
  Droplets,
  Layers,
  Check,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import {
  PROBLEM_CATEGORIES,
  SEVERITY_LEVELS,
  getSeverityByScore
} from '../../data/jharkhandGisData.js';

// Map Layers Floating Box (Top Left)
export const MapLayersCard = ({
  layers,
  onToggleLayer
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-md p-3 w-56 text-slate-800 transition-all select-none">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between font-bold text-xs text-slate-900 pb-1 cursor-pointer"
      >
        <div className="flex items-center space-x-2">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Map Layers</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="pt-2 space-y-1.5 border-t border-slate-100 mt-1.5 text-xs">
          {/* 1. District Boundary */}
          <label className="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors">
            <input
              type="checkbox"
              checked={layers.districtBoundary}
              onChange={() => onToggleLayer('districtBoundary')}
              className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
            />
            <span className="font-semibold text-[11px] text-slate-700">District Boundary</span>
          </label>

          {/* 2. Problem Heat Map */}
          <label className="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors">
            <input
              type="checkbox"
              checked={layers.problemHeatMap}
              onChange={() => onToggleLayer('problemHeatMap')}
              className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
            />
            <span className="font-semibold text-[11px] text-slate-700">Problem Heat Map</span>
          </label>

          {/* 3. Problem Hotspots */}
          <label className="flex items-center justify-between cursor-pointer hover:text-blue-600 transition-colors">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={layers.problemHotspots}
                onChange={() => onToggleLayer('problemHotspots')}
                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              <span className="font-semibold text-[11px] text-slate-700">Problem Hotspots</span>
            </div>
            <MapPin className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </label>

          {/* 4. District Labels */}
          <label className="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors">
            <input
              type="checkbox"
              checked={layers.districtLabels}
              onChange={() => onToggleLayer('districtLabels')}
              className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
            />
            <span className="font-semibold text-[11px] text-slate-700">District Labels</span>
          </label>
        </div>
      )}
    </div>
  );
};

// Problem Categories Filter Box (Middle Left)
export const ProblemCategoriesCard = ({
  selectedCategories = [],
  onToggleCategory,
  onSelectSingleCategory
}) => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'infrastructure': return <Hammer className="w-3 h-3 text-orange-500" />;
      case 'healthcare': return <HeartPulse className="w-3 h-3 text-cyan-500" />;
      case 'education': return <GraduationCap className="w-3 h-3 text-purple-500" />;
      case 'unemployment': return <Briefcase className="w-3 h-3 text-teal-500" />;
      case 'poverty': return <Coins className="w-3 h-3 text-amber-500" />;
      case 'connectivity': return <Radio className="w-3 h-3 text-amber-700" />;
      case 'water': return <Droplets className="w-3 h-3 text-blue-500" />;
      default: return <Layers className="w-3 h-3 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-md p-3 w-56 text-slate-800 transition-all select-none">
      <div className="font-bold text-xs text-slate-900 pb-1 border-b border-slate-100 flex items-center justify-between">
        <span>Problem Categories</span>
        <span className="text-[10px] font-semibold text-slate-400">8 Types</span>
      </div>

      <div className="pt-1.5 space-y-1 text-xs max-h-56 overflow-y-auto pr-0.5">
        {PROBLEM_CATEGORIES.map((cat) => {
          const isChecked = selectedCategories.includes(cat.id);

          return (
            <div
              key={cat.id}
              className="flex items-center justify-between py-0.5 group rounded px-1 hover:bg-slate-50 transition-colors"
            >
              <label className="flex items-center space-x-2 cursor-pointer flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleCategory(cat.id)}
                  className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer shrink-0"
                />
                <div className="shrink-0">{getCategoryIcon(cat.id)}</div>
                <span
                  className={`text-[11px] truncate ${
                    isChecked ? 'font-bold text-slate-800' : 'font-medium text-slate-600'
                  }`}
                >
                  {cat.name}
                </span>
              </label>

              <div className="relative shrink-0 ml-1">
                <button
                  type="button"
                  onMouseEnter={() => setActiveTooltip(cat.id)}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className="text-slate-300 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <Info className="w-3 h-3" />
                </button>

                {/* Floating Tooltip */}
                {activeTooltip === cat.id && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-slate-900 text-white text-[10px] font-medium p-2 rounded-lg shadow-xl z-50 w-44 pointer-events-none">
                    <p className="font-bold text-amber-300">{cat.name}</p>
                    <p className="text-slate-300 mt-0.5 leading-tight">{cat.desc}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Heatmap Intensity Gradient Card (Bottom Left)
export const HeatmapIntensityCard = () => {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-md p-2.5 w-56 text-slate-800 select-none">
      <span className="block text-[11px] font-bold text-slate-800 mb-1">
        Heatmap Intensity
      </span>
      <div className="h-2 rounded-full w-full bg-gradient-to-r from-[#22c55e] via-[#eab308] via-50% via-[#f97316] to-[#dc2626] shadow-inner" />
      <div className="flex justify-between text-[9.5px] font-bold text-slate-500 mt-1">
        <span>Low</span>
        <span>Very High</span>
      </div>
    </div>
  );
};

// District Overview Panel (Right Side Top)
export const DistrictOverviewPanel = ({
  districtData,
  onOpenDetailedReport
}) => {
  if (!districtData) return null;

  const severity = getSeverityByScore(districtData.overallScore);

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-md p-4 w-64 text-slate-800 transition-all select-none">
      {/* Header with Title & Selected District Name */}
      <div className="space-y-1 pb-2.5 border-b border-slate-100">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
          District Overview
        </span>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            {districtData.name}
          </h3>
          <span
            className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
              districtData.overallScore >= 81
                ? 'bg-red-50 text-red-700 border-red-200'
                : districtData.overallScore >= 61
                ? 'bg-orange-50 text-orange-700 border-orange-200'
                : districtData.overallScore >= 41
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {districtData.riskLevel}
          </span>
        </div>
      </div>

      {/* Overall Problem Score */}
      <div className="py-2.5 space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-500 block">
          Overall Problem Score
        </span>
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-black text-slate-900">
            {districtData.overallScore}
          </span>
          <span className="text-xs font-bold text-slate-400">/ 100</span>
        </div>

        {/* Score Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              districtData.overallScore >= 81
                ? 'bg-red-600'
                : districtData.overallScore >= 61
                ? 'bg-orange-500'
                : districtData.overallScore >= 41
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${districtData.overallScore}%` }}
          />
        </div>
      </div>

      {/* Top Problem Areas List */}
      <div className="py-2 space-y-1.5 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-700 block">
          Top Problem Areas
        </span>
        <div className="space-y-1 text-xs">
          {districtData.topProblemAreas?.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-[11px] font-semibold"
            >
              <div className="flex items-center space-x-1.5 truncate">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color || '#f97316' }}
                />
                <span className="text-slate-600 truncate">{item.category}</span>
              </div>
              <span className="font-bold text-slate-900 ml-2">{item.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* View Detailed Report Action Button */}
      <div className="pt-2.5">
        <button
          onClick={onOpenDetailedReport}
          className="w-full flex items-center justify-center space-x-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-xl py-2 px-3 text-xs font-bold transition-all cursor-pointer group active:scale-98"
        >
          <span>View Detailed Report</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// Severity Legend Card (Right Side Bottom)
export const LegendCard = () => {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-md p-3 w-64 text-slate-800 select-none">
      <div className="font-bold text-xs text-slate-900 pb-1">Legend</div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
        Severity Level
      </div>

      <div className="space-y-1 text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-xs bg-[#dc2626] shrink-0" />
          <span className="text-[11px] text-slate-700 font-semibold">
            Very High <span className="text-slate-400 font-medium">(81 - 100)</span>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-xs bg-[#ea580c] shrink-0" />
          <span className="text-[11px] text-slate-700 font-semibold">
            High <span className="text-slate-400 font-medium">(61 - 80)</span>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-xs bg-[#eab308] shrink-0" />
          <span className="text-[11px] text-slate-700 font-semibold">
            Moderate <span className="text-slate-400 font-medium">(41 - 60)</span>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-xs bg-[#84cc16] shrink-0" />
          <span className="text-[11px] text-slate-700 font-semibold">
            Low <span className="text-slate-400 font-medium">(21 - 40)</span>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-xs bg-[#16a34a] shrink-0" />
          <span className="text-[11px] text-slate-700 font-semibold">
            Very Low <span className="text-slate-400 font-medium">(0 - 20)</span>
          </span>
        </div>
      </div>
    </div>
  );
};

// Map Scale Bar (Bottom of Map)
export const MapScaleBar = () => {
  return (
    <div className="bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs flex items-center space-x-2 text-[10px] font-bold text-slate-700 select-none">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-between w-32 border-b-2 border-slate-700 pb-0.5">
          <span className="text-[9px] -ml-1">0</span>
          <span className="text-[9px]">25</span>
          <span className="text-[9px]">50</span>
          <span className="text-[9px]">75</span>
          <span className="text-[9px] -mr-1">100 km</span>
        </div>
      </div>
    </div>
  );
};
