import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const ProblemsBySectorChart = ({ sectors = [], selectedTimeframe = 'This Month', onChangeTimeframe, onSelectSector }) => {
  const [hoveredSector, setHoveredSector] = useState(null);

  const totalCount = sectors.reduce((acc, curr) => acc + curr.count, 0) || 12450;

  // Donut SVG Parameters
  const radius = 38;
  const strokeWidth = 15;
  const center = 50;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between h-full min-h-[300px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Problems by Sector
        </h3>
        <div className="relative">
          <select
            value={selectedTimeframe}
            onChange={(e) => onChangeTimeframe && onChangeTimeframe(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 pr-6 focus:outline-none cursor-pointer appearance-none shadow-2xs hover:bg-slate-100 transition-colors"
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

      {/* Chart & Legend Content */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-1">
        {/* Donut SVG with interactive hover tooltips */}
        <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {sectors.map((sector, index) => {
              const strokeDasharray = `${(sector.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += sector.percentage / 100;
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
                  className="transition-all duration-200 cursor-pointer hover:opacity-90"
                  onMouseEnter={() => setHoveredSector(sector)}
                  onMouseLeave={() => setHoveredSector(null)}
                  onClick={() => onSelectSector && onSelectSector(sector.name)}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-1">
            {hoveredSector ? (
              <>
                <span className="text-[9px] font-bold text-slate-500 uppercase truncate max-w-[70px]">
                  {hoveredSector.name}
                </span>
                <span className="text-xs font-black text-slate-900 leading-none">
                  {hoveredSector.percentage}%
                </span>
              </>
            ) : (
              <>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Total</span>
                <span className="text-xs font-bold text-slate-900">{totalCount.toLocaleString()}</span>
              </>
            )}
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-1 text-xs">
          {sectors.map((item, idx) => {
            const isHovered = hoveredSector?.name === item.name;
            return (
              <div
                key={idx}
                onClick={() => onSelectSector && onSelectSector(item.name)}
                onMouseEnter={() => setHoveredSector(item)}
                onMouseLeave={() => setHoveredSector(null)}
                className={`flex items-center justify-between text-[11px] px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                  isHovered ? 'bg-slate-100 font-bold' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium truncate">{item.name}</span>
                </div>
                <div className="text-right shrink-0 pl-1 font-semibold text-slate-800">
                  <span>{item.count.toLocaleString()}</span>
                  <span className="text-slate-400 text-[10px] ml-1">({item.percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Total */}
      <div className="pt-2 border-t border-slate-100 text-xs font-bold text-slate-900 flex justify-between items-center">
        <span>Total: </span>
        <span className="font-extrabold">{totalCount.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default ProblemsBySectorChart;
