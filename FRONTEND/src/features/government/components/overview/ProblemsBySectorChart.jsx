import React, { useState } from 'react';
import { ChevronDown, PieChart, Layers, Info } from 'lucide-react';

export const ProblemsBySectorChart = ({
  sectors = [],
  selectedTimeframe = 'This Month',
  onChangeTimeframe,
  onSelectSector
}) => {
  const [hoveredSector, setHoveredSector] = useState(null);

  const totalCount = sectors.reduce((acc, curr) => acc + (curr.count || 0), 0);

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
      {sectors.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-slate-400 text-xs">
          <Info className="w-5 h-5 mb-1.5 text-slate-300" />
          <span>No sector problem distribution recorded yet.</span>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4 py-1 flex-1">
          {/* Donut SVG */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 filter drop-shadow-xs">
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth={strokeWidth}
              />
              {sectors.map((sector, index) => {
                const pct = sector.percentage || (totalCount > 0 ? ((sector.count || 0) / totalCount) * 100 : 0);
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
                    stroke={sector.color || '#3b82f6'}
                    strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredSector(sector)}
                    onMouseLeave={() => setHoveredSector(null)}
                    onClick={() => onSelectSector && onSelectSector(sector.name)}
                  />
                );
              })}
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-black text-slate-900 leading-none">
                {hoveredSector ? hoveredSector.count : totalCount}
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                {hoveredSector ? 'Issues' : 'Total'}
              </span>
            </div>
          </div>

          {/* Sector Breakdown List */}
          <div className="flex-1 w-full space-y-1.5 overflow-y-auto max-h-[160px] pr-1">
            {sectors.map((sector, index) => (
              <div
                key={index}
                onClick={() => onSelectSector && onSelectSector(sector.name)}
                onMouseEnter={() => setHoveredSector(sector)}
                onMouseLeave={() => setHoveredSector(null)}
                className={`p-1.5 rounded-lg border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                  hoveredSector?.name === sector.name
                    ? 'bg-slate-100 border-slate-300'
                    : 'border-transparent hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: sector.color || '#3b82f6' }}
                  />
                  <span className="font-semibold text-slate-700 truncate text-[11px]">
                    {sector.name}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-slate-900 text-[11px] mr-1.5">
                    {sector.count}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    ({sector.percentage || (totalCount > 0 ? Math.round(((sector.count || 0) / totalCount) * 100) : 0)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span className="flex items-center">
          <Layers className="w-3 h-3 mr-1 text-slate-400" />
          {sectors.length} Active Sectors
        </span>
        <span className="text-slate-600 font-bold">100% Normalized</span>
      </div>
    </div>
  );
};

export default ProblemsBySectorChart;
