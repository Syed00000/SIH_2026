import React from 'react';

export const NodalChallengeStatusCard = ({
  statusData,
  onViewAll
}) => {
  const defaultData = [
    { label: 'New / Submitted', count: 74, percentage: '14%', color: '#2563eb' }, // Blue
    { label: 'AI Triage Pending', count: 98, percentage: '19%', color: '#10b981' }, // Green
    { label: 'Under Review', count: 126, percentage: '25%', color: '#f59e0b' }, // Yellow/Orange
    { label: 'Approved', count: 164, percentage: '32%', color: '#8b5cf6' }, // Purple
    { label: 'Rejected', count: 50, percentage: '10%', color: '#ef4444' } // Red
  ];

  const data = statusData || defaultData;
  const total = data.reduce((acc, item) => acc + (item.count || 0), 0) || 512;

  // SVG Donut calculation
  const size = 150;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-md p-4 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-sm">Challenge Status</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Main Content: Donut + Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto py-2">
        {/* Interactive SVG Donut */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            {data.map((item, index) => {
              const numericPercent = (item.count || 0) / total;
              const strokeDasharray = `${circumference * numericPercent} ${circumference * (1 - numericPercent)}`;
              const strokeDashoffset = -circumference * accumulatedPercent;
              accumulatedPercent += numericPercent;

              return (
                <circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                />
              );
            })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xl font-extrabold text-slate-900 leading-tight">
              {total}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
              Total
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 space-y-2 w-full sm:w-auto">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 font-medium">{item.label}</span>
              </div>
              <span className="font-bold text-slate-900 ml-2">
                {item.count} <span className="text-slate-400 font-normal text-[11px]">({item.percentage || `${Math.round(((item.count || 0) / total) * 100)}%`})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NodalChallengeStatusCard;
