import React, { useState } from 'react';
import { Activity, Calendar, Info } from 'lucide-react';

export const ProblemsTrendChart = ({ trendData, onIntervalChange, currentInterval = 'Monthly', onViewReport }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const points = trendData?.points || [
    { month: 'Jan', count: 0 },
    { month: 'Feb', count: 0 },
    { month: 'Mar', count: 0 },
    { month: 'Apr', count: 0 },
    { month: 'May', count: 0 },
    { month: 'Jun', count: 0 }
  ];

  const hasData = points.some((p) => p.count > 0);
  const maxVal = Math.max(...points.map((p) => p.count * 1.15), 10);
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

  const areaPath =
    coords.length > 0
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
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="flex-1 flex flex-col justify-center my-2">
        <div className="relative w-full h-[150px]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area */}
            {areaPath && <path d={areaPath} fill="url(#trendGradient)" />}

            {/* Line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data Points */}
            {coords.map((c, i) => (
              <circle
                key={i}
                cx={c.x}
                cy={c.y}
                r={hoveredPoint?.month === c.month ? 4.5 : 3}
                className="fill-white stroke-emerald-600 stroke-[2] cursor-pointer transition-all"
                onMouseEnter={() => setHoveredPoint(c)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
          </svg>

          {/* Hover Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute pointer-events-none bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg -top-2 left-1/2 -translate-x-1/2 z-10 font-medium"
            >
              {hoveredPoint.month}: {hoveredPoint.count} Problems
            </div>
          )}
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between px-2 pt-1 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
          {points.map((p, idx) => (
            <span key={idx}>{p.month}</span>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <span className="text-slate-400 font-medium flex items-center">
          <Calendar className="w-3 h-3 mr-1 text-slate-400" />
          Live Timeline Aggregation
        </span>
        <button
          onClick={onViewReport}
          className="text-emerald-700 font-bold hover:underline cursor-pointer"
        >
          View Triage Stream →
        </button>
      </div>
    </div>
  );
};

export default ProblemsTrendChart;
