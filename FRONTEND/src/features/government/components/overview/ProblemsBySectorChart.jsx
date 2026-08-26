import React, { useState } from 'react';
import { ChevronDown, PieChart, Layers, ShieldCheck } from 'lucide-react';

export const ProblemsBySectorChart = ({ sectors = [], selectedTimeframe = 'This Month', onChangeTimeframe, onSelectSector }) => {
  const [hoveredSector, setHoveredSector] = useState(null);

  const totalCount = sectors.reduce((acc, curr) => acc + (curr.count || 0), 0) || 12450;

  // Donut SVG Parameters
  const radius = 38;
  const strokeWidth = 12;
  const center = 50;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white border border-slate-200/80 hover:border-slate-300/90 rounded-xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_-6px_rgba(15,23,42,0.07)] flex flex-col justify-between h-full min-h-[340px] transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <PieChart className="w-4 h-4 text-blue-600" />
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Problems by Sector</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-medium block leading-tight">
              Geospatial Category Distribution
            </span>
          </div>
        </div>

        <div className="relative">
          <select
            value={selectedTimeframe}
            onChange={(e) => onChangeTimeframe && onChangeTimeframe(e.target.value)}
            className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1 pr-6 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none shadow-2xs hover:bg-slate-100 transition-colors"
          >
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
            <option value="This Quarter">This Quarter</option>
            <option value="Year 2026">Year 2026</option>
            <option value="Today">Today (Daily)</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Center Donut & Legend Content */}
      <div className="flex flex-col sm:flex-row items-center gap-4 py-1 flex-1">
        {/* Donut SVG with interactive hover tooltips */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 filter drop-shadow-xs">
            {/* Background base circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />
            {sectors.map((sector, index) => {
              const pct = sector.percentage || 0;
              const strokeDasharray = `${(pct / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += pct / 100;
              const isHovered = hoveredSector?.name === sector.name;

              return (
                <circle
                  key={index}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={sector.color}
                  strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-200 cursor-pointer hover:opacity-90"
                  onMouseEnter={() => setHoveredSector(sector)}
                  onMouseLeave={() => setHoveredSector(null)}
                  onClick={() => onSelectSector && onSelectSector(sector.name)}
                />
              );
            })}
          </svg>

          {/* Center HUD */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-1">
            {hoveredSector ? (
              <>
                <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-wider truncate max-w-[65px]">
                  {hoveredSector.name.split(' ')[0]}
                </span>
                <span className="text-xs font-black text-slate-900 leading-tight">
                  {hoveredSector.percentage}%
                </span>
                <span className="text-[8px] text-slate-400 font-medium">
                  {hoveredSector.count.toLocaleString()}
                </span>
              </>
            ) : (
              <>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                <span className="text-xs font-extrabold text-slate-900 leading-tight">
                  {totalCount >= 1000 ? `${(totalCount / 1000).toFixed(1)}k` : totalCount}
                </span>
                <span className="text-[8px] text-emerald-600 font-semibold">100%</span>
              </>
            )}
          </div>
        </div>

        {/* Breakdown List with dynamic progress bars - No Overflow! */}
        <div className="flex-1 w-full space-y-1.5 min-w-0">
          {sectors.map((item, idx) => {
            const isHovered = hoveredSector?.name === item.name;
            return (
              <div
                key={idx}
                onClick={() => onSelectSector && onSelectSector(item.name)}
                onMouseEnter={() => setHoveredSector(item)}
                onMouseLeave={() => setHoveredSector(null)}
                className={`group px-2 py-1 rounded-lg cursor-pointer transition-all duration-150 ${
                  isHovered ? 'bg-slate-100/90 shadow-2xs' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] gap-2 mb-0.5">
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-700 font-semibold truncate group-hover:text-slate-900">
                      {item.name}
                    </span>
                  </div>
                  <div className="shrink-0 flex items-center space-x-1.5 font-bold text-slate-800 text-[10.5px]">
                    <span>{item.count.toLocaleString()}</span>
                    <span className="text-slate-400 font-medium text-[9.5px]">
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar line */}
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Status */}
      <div className="pt-2.5 mt-1 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1 text-[11px] text-slate-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Verified Categorization</span>
        </div>
        <div className="font-bold text-slate-900 text-[11.5px]">
          Total: <span className="font-extrabold text-blue-600">{totalCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ProblemsBySectorChart;
