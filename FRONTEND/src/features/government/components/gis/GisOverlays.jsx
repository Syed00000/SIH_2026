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
  BarChart2,
  Shield
} from 'lucide-react';
import {
  PROBLEM_CATEGORIES,
  getSeverityByScore
} from '../../data/gisConstants.js';

/* ─────────────────────────────────────────────────
   Shared pill toggle button (header for each card)
───────────────────────────────────────────────── */
const PillHeader = ({ icon, label, isOpen, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md rounded-xl px-3 py-2 text-xs font-bold text-slate-800 hover:bg-white transition-all cursor-pointer select-none whitespace-nowrap"
  >
    <span className="text-slate-500">{icon}</span>
    <span>{label}</span>
    {isOpen
      ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
      : <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />}
  </button>
);

/* ─────────────────────────────────────────────────
   LEFT – Map Layers Card
───────────────────────────────────────────────── */
export const MapLayersCard = ({ layers, onToggleLayer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-start select-none">
      <PillHeader
        icon={<Layers className="w-3.5 h-3.5" />}
        label="Layers"
        isOpen={open}
        onToggle={() => setOpen(v => !v)}
      />
      {open && (
        <div className="mt-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md rounded-xl p-3 w-48 space-y-2 text-xs">
          {[
            { key: 'districtBoundary', label: 'District Boundary' },
            { key: 'problemHeatMap',   label: 'Problem Heat Map' },
            { key: 'problemHotspots',  label: 'Problem Hotspots' },
            { key: 'districtLabels',   label: 'District Labels' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
              <input
                type="checkbox"
                checked={layers[key]}
                onChange={() => onToggleLayer(key)}
                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              <span className="font-semibold text-[11px] text-slate-700">{label}</span>
              {key === 'problemHotspots' && (
                <MapPin className="w-3 h-3 text-red-500 fill-red-400 ml-auto" />
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────
   LEFT – Heatmap Card (Intensity + Problem Categories)
───────────────────────────────────────────────── */
export const HeatmapIntensityCard = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-start select-none">
      <PillHeader
        icon={<BarChart2 className="w-3.5 h-3.5" />}
        label="Heatmap"
        isOpen={open}
        onToggle={() => setOpen(v => !v)}
      />
      {open && (
        <div className="mt-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md rounded-xl p-3 w-48 text-xs">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Intensity</p>
          <div className="h-2 rounded-full w-full bg-gradient-to-r from-[#22c55e] via-[#eab308] via-50% via-[#f97316] to-[#dc2626] shadow-inner" />
          <div className="flex justify-between text-[9.5px] font-bold text-slate-400 mt-1">
            <span>Low</span>
            <span>Very High</span>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────
   Kept for import compatibility – Problem Categories
   (used internally in GisMapCanvas but not shown as
    a separate overlay card in the image)
───────────────────────────────────────────────── */
export const ProblemCategoriesCard = ({ selectedCategories = [], onToggleCategory }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'infrastructure': return <Hammer className="w-3 h-3 text-orange-500" />;
      case 'healthcare':     return <HeartPulse className="w-3 h-3 text-cyan-500" />;
      case 'education':      return <GraduationCap className="w-3 h-3 text-purple-500" />;
      case 'unemployment':   return <Briefcase className="w-3 h-3 text-teal-500" />;
      case 'poverty':        return <Coins className="w-3 h-3 text-amber-500" />;
      case 'connectivity':   return <Radio className="w-3 h-3 text-amber-700" />;
      case 'water':          return <Droplets className="w-3 h-3 text-blue-500" />;
      default:               return <Layers className="w-3 h-3 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-md p-3 w-48 text-slate-800 select-none">
      <div className="font-bold text-[11px] text-slate-700 pb-1.5 border-b border-slate-100 mb-1.5">
        Problem Categories
      </div>
      <div className="space-y-1 max-h-52 overflow-y-auto pr-0.5">
        {PROBLEM_CATEGORIES.map((cat) => {
          const isChecked = selectedCategories.includes(cat.id);
          return (
            <div key={cat.id} className="flex items-center justify-between py-0.5 rounded px-1 hover:bg-slate-50 transition-colors">
              <label className="flex items-center gap-1.5 cursor-pointer flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleCategory(cat.id)}
                  className="w-3 h-3 rounded text-blue-600 border-slate-300 cursor-pointer shrink-0"
                />
                <span className="shrink-0">{getCategoryIcon(cat.id)}</span>
                <span className={`text-[10.5px] truncate ${isChecked ? 'font-bold text-slate-800' : 'font-medium text-slate-500'}`}>
                  {cat.name}
                </span>
              </label>
              <div className="relative shrink-0 ml-1">
                <button
                  type="button"
                  onMouseEnter={() => setActiveTooltip(cat.id)}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className="text-slate-300 hover:text-slate-500 p-0.5 cursor-pointer"
                >
                  <Info className="w-2.5 h-2.5" />
                </button>
                {activeTooltip === cat.id && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-slate-900 text-white text-[10px] font-medium p-2 rounded-lg shadow-xl z-[600] w-40 pointer-events-none">
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

/* ─────────────────────────────────────────────────
   RIGHT – Overview Card (collapsible pill)
───────────────────────────────────────────────── */
export const DistrictOverviewPanel = ({ districtData, onOpenDetailedReport }) => {
  const [open, setOpen] = useState(true);
  if (!districtData) return null;

  return (
    <div className="flex flex-col items-end select-none">
      <PillHeader
        icon={<BarChart2 className="w-3.5 h-3.5" />}
        label="Overview"
        isOpen={open}
        onToggle={() => setOpen(v => !v)}
      />
      {open && (
        <div className="mt-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md rounded-xl p-4 w-56 text-slate-800">
          {/* Header */}
          <div className="pb-2.5 border-b border-slate-100 mb-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-0.5">
              District Overview
            </span>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-black text-slate-900 tracking-tight truncate">
                {districtData.name}
              </h3>
              <span className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full border ${
                districtData.overallScore >= 81
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : districtData.overallScore >= 61
                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                  : districtData.overallScore >= 41
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {districtData.riskLevel}
              </span>
            </div>
          </div>

          {/* Score */}
          <div className="mb-3">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Overall Problem Score</span>
            <div className="flex items-baseline gap-1 mb-1.5">
              <span className="text-2xl font-black text-slate-900">{districtData.overallScore}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  districtData.overallScore >= 81 ? 'bg-red-500'
                  : districtData.overallScore >= 61 ? 'bg-orange-500'
                  : districtData.overallScore >= 41 ? 'bg-amber-500'
                  : 'bg-emerald-500'
                }`}
                style={{ width: `${districtData.overallScore}%` }}
              />
            </div>
          </div>

          {/* Top Problem Areas */}
          {districtData.topProblemAreas?.length > 0 && (
            <div className="border-t border-slate-100 pt-2.5 mb-3">
              <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Top Problem Areas</span>
              <div className="space-y-1">
                {districtData.topProblemAreas.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] font-semibold">
                    <div className="flex items-center gap-1.5 truncate">
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
          )}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────
   RIGHT – Legend Card (collapsible pill)
───────────────────────────────────────────────── */
export const LegendCard = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-col items-end select-none">
      <PillHeader
        icon={<Shield className="w-3.5 h-3.5" />}
        label="Legend"
        isOpen={open}
        onToggle={() => setOpen(v => !v)}
      />
      {open && (
        <div className="mt-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md rounded-xl p-3 w-44 text-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Severity Level</div>
          <div className="space-y-1.5">
            {[
              { color: '#ef4444', label: 'Very High', range: '81–100' },
              { color: '#f97316', label: 'High',      range: '61–80'  },
              { color: '#eab308', label: 'Moderate',  range: '41–60'  },
              { color: '#86efac', label: 'Low',       range: '21–40'  },
              { color: '#22c55e', label: 'Very Low',  range: '0–20'   },
            ].map(({ color, label, range }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                <span className="text-[11px] text-slate-700 font-semibold">
                  {label} <span className="text-slate-400 font-medium">({range})</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────
   BOTTOM RIGHT – View Detailed Report Button
───────────────────────────────────────────────── */
export const ViewReportButton = ({ onOpenDetailedReport }) => (
  <button
    type="button"
    onClick={onOpenDetailedReport}
    className="flex items-center gap-2 bg-white/95 backdrop-blur-md border border-blue-200 shadow-md rounded-xl px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-all cursor-pointer group select-none whitespace-nowrap"
  >
    <span>View Detailed Report</span>
    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
  </button>
);

/* ─────────────────────────────────────────────────
   BOTTOM RIGHT – Map Scale Bar
───────────────────────────────────────────────── */
export const MapScaleBar = () => (
  <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center text-slate-700 select-none">
    <div className="flex items-center justify-between w-28 border-b-2 border-slate-700 pb-0.5">
      <span className="text-[9px] -ml-0.5">0</span>
      <span className="text-[9px]">25</span>
      <span className="text-[9px]">50</span>
      <span className="text-[9px] -mr-0.5">100 km</span>
    </div>
    <span className="text-[9px] font-bold text-slate-500 mt-0.5">50 km</span>
  </div>
);
