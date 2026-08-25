import React, { useState } from 'react';
import { TrendingUp, X } from 'lucide-react';

export const ProblemsTrendChart = ({ trendData, onIntervalChange, currentInterval = 'Monthly' }) => {
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
  const height = 130;

  // Compute SVG coordinates
  const coords = points.map((p, index) => {
    const x = 36 + (index * (width - 64)) / (points.length - 1 || 1);
    const y = height - 26 - ((p.count - minVal) / (maxVal - minVal)) * (height - 44);
    return { x, y, ...p };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between h-full min-h-[300px] relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Problems Trend
          </h3>
          {/* Interval Toggle Pills */}
          <div className="flex bg-slate-100 rounded-md p-0.5 text-[10px] font-bold">
            {['Monthly', 'Weekly', 'Daily'].map((mode) => (
              <button
                key={mode}
                onClick={() => onIntervalChange && onIntervalChange(mode)}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  currentInterval === mode
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          View Report
        </button>
      </div>

      {/* Line Chart Area */}
      <div className="relative py-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32 overflow-visible">
          {/* Grid lines */}
          <line x1="28" y1="20" x2={width - 10} y2="20" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="28" y1="50" x2={width - 10} y2="50" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="28" y1="80" x2={width - 10} y2="80" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="28" y1="105" x2={width - 10} y2="105" stroke="#f1f5f9" strokeWidth="1" />

          {/* Stroke Line */}
          <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Interactive Data Points */}
          {coords.map((c, i) => {
            const isHovered = hoveredPoint?.month === c.month;
            return (
              <g
                key={i}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredPoint(c)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isHovered ? 5 : 3.5}
                  fill={isHovered ? "#1d4ed8" : "#2563eb"}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-all duration-150"
                />
                {/* Value badge */}
                <text
                  x={c.x}
                  y={c.y - 7}
                  fontSize="8.5"
                  fill="#1e293b"
                  fontWeight="bold"
                  textAnchor="middle"
                  className={isHovered ? "fill-blue-700 font-extrabold" : ""}
                >
                  {c.count.toLocaleString()}
                </text>
                {/* X-axis Label */}
                <text x={c.x} y={height - 2} fontSize="8" fill="#64748b" textAnchor="middle" fontWeight="500">
                  {c.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Summary Stats */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold block">
            {trendData?.currentLabel || "This Month"}
          </span>
          <span className="text-xs font-bold text-slate-900">{trendData?.thisMonth || "12,450"}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-semibold block">
            {trendData?.prevLabel || "Last Month"}
          </span>
          <span className="text-xs font-bold text-slate-700">{trendData?.lastMonth || "9,200"}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-semibold block">Growth</span>
          <span className="text-xs font-bold text-emerald-600">{trendData?.growth || "35.33% ↑"}</span>
        </div>
      </div>

      {/* Modal on View Report */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h4 className="text-sm font-bold text-slate-900 flex items-center">
                <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                <span>Trend Performance Audit Report</span>
              </h4>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2">
              <p>
                <strong>Current Velocity:</strong> Problem submission rate increased by <strong>{trendData?.growth}</strong> over the monitored period.
              </p>
              <p>
                <strong>Peak Inflow:</strong> May 2026 recorded the highest volume with 12,450 societal issues tracked across all 24 districts.
              </p>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold"
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
