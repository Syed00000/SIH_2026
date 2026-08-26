import React, { useState } from 'react';
import { TrendingUp, X, Activity, BarChart2, Calendar, Radio } from 'lucide-react';

export const ProblemsTrendChart = ({ trendData, onIntervalChange, currentInterval = 'Monthly', onViewReport }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const points = trendData?.points || [
    { month: "Dec 2025", count: 6240 },
    { month: "Jan 2026", count: 6980 },
    { month: "Feb 2026", count: 7120 },
    { month: "Mar 2026", count: 8050 },
    { month: "Apr 2026", count: 9200 },
    { month: "May 2026", count: 12450 }
  ];

  const maxVal = Math.max(...points.map(p => p.count * 1.15), 1000);
  const minVal = 0;
  const width = 360;
  const height = 135;

  // Compute SVG coordinates
  const coords = points.map((p, index) => {
    const x = 32 + (index * (width - 60)) / (points.length - 1 || 1);
    const y = height - 28 - ((p.count - minVal) / (maxVal - minVal)) * (height - 48);
    return { x, y, ...p };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');

  // Create smooth closed area path for gradient
  const areaPath = coords.length > 0
    ? `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${height - 24} L ${coords[0].x.toFixed(1)} ${height - 24} Z`
    : '';

  return (
    <div className="bg-white border border-slate-200/80 hover:border-slate-300/90 rounded-xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_-6px_rgba(15,23,42,0.07)] flex flex-col justify-between h-full min-h-[340px] transition-all duration-300 relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>GIS Inflow Trend</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-medium block leading-tight">
              Temporal Inflow & Velocity
            </span>
          </div>
        </div>

        {/* Interval Selector */}
        <div className="flex items-center space-x-1.5">
          <div className="flex bg-slate-100/90 rounded-lg p-0.5 text-[10px] font-bold border border-slate-200/60">
            {['Monthly', 'Weekly', 'Daily'].map((mode) => (
              <button
                key={mode}
                onClick={() => onIntervalChange && onIntervalChange(mode)}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  currentInterval === mode
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Trend Graph Area */}
      <div className="relative py-1 flex-1 flex flex-col justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36 overflow-visible select-none">
          <defs>
            <linearGradient id="gisTrendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gisLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="24" y1="20" x2={width - 12} y2="20" stroke="#f1f5f9" strokeDasharray="3 3" strokeWidth="1" />
          <line x1="24" y1="50" x2={width - 12} y2="50" stroke="#f1f5f9" strokeDasharray="3 3" strokeWidth="1" />
          <line x1="24" y1="80" x2={width - 12} y2="80" stroke="#f1f5f9" strokeDasharray="3 3" strokeWidth="1" />
          <line x1="24" y1="110" x2={width - 12} y2="110" stroke="#e2e8f0" strokeWidth="1" />

          {/* Gradient Area Fill */}
          <path d={areaPath} fill="url(#gisTrendGradient)" />

          {/* Glowing Stroke Line */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#gisLineGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="filter drop-shadow-xs"
          />

          {/* Interactive Crosshair when hovered */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1="16"
              x2={hoveredPoint.x}
              y2={height - 24}
              stroke="#94a3b8"
              strokeDasharray="2 2"
              strokeWidth="1"
            />
          )}

          {/* Interactive Data Points */}
          {coords.map((c, i) => {
            const isHovered = hoveredPoint?.month === c.month;
            const isPeak = c.count === Math.max(...points.map(p => p.count));

            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(c)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Outer Pulse for Peak */}
                {isPeak && (
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r="7"
                    fill="#3b82f6"
                    opacity="0.2"
                    className="animate-ping"
                  />
                )}

                {/* Point circle */}
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isHovered ? 5.5 : 4}
                  fill={isHovered ? "#1d4ed8" : "#ffffff"}
                  stroke={isHovered ? "#ffffff" : isPeak ? "#0ea5e9" : "#2563eb"}
                  strokeWidth={isHovered ? 2 : 2.5}
                  className="transition-all duration-150 shadow-xs"
                />

                {/* Value badge */}
                <text
                  x={c.x}
                  y={c.y - 8}
                  fontSize="8.5"
                  fill={isHovered ? "#1d4ed8" : "#334155"}
                  fontWeight={isHovered || isPeak ? "800" : "600"}
                  textAnchor="middle"
                >
                  {c.count >= 1000 ? `${(c.count / 1000).toFixed(1)}k` : c.count}
                </text>

                {/* X-axis Label */}
                <text
                  x={c.x}
                  y={height - 8}
                  fontSize="8"
                  fill={isHovered ? "#0f172a" : "#64748b"}
                  textAnchor="middle"
                  fontWeight={isHovered ? "700" : "500"}
                >
                  {c.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Stats - Clean Human-Centered Layout */}
      <div className="grid grid-cols-3 gap-2 pt-2.5 mt-1 border-t border-slate-100 items-center">
        <div>
          <span className="text-[10px] text-slate-400 font-medium block leading-none mb-1">
            {trendData?.currentLabel || "This Month"}
          </span>
          <span className="text-sm font-extrabold text-slate-900 leading-tight block">
            {trendData?.thisMonth || "12,450"}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-medium block leading-none mb-1">
            {trendData?.prevLabel || "Last Month"}
          </span>
          <span className="text-sm font-semibold text-slate-600 leading-tight block">
            {trendData?.lastMonth || "9,200"}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-medium block leading-none mb-1">
            Growth
          </span>
          <span className="text-xs font-bold text-emerald-600 inline-flex items-center justify-end gap-1 leading-tight">
            <span>{trendData?.growth ? trendData.growth.replace('↑', '').trim() : '+35.3%'}</span>
            <TrendingUp className="w-3 h-3 text-emerald-600 shrink-0" />
          </span>
        </div>
      </div>

      {/* Modal on View Report */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h4 className="text-sm font-bold text-slate-900 flex items-center">
                <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                <span>Trend Performance Audit Report</span>
              </h4>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2">
              <p>
                <strong>Current Velocity:</strong> Problem submission rate increased by <strong className="text-emerald-600">{trendData?.growth || '35.33%'}</strong> over the monitored period.
              </p>
              <p>
                <strong>Peak Inflow:</strong> May 2026 recorded the highest volume with 12,450 societal issues tracked across all 24 districts.
              </p>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemsTrendChart;
