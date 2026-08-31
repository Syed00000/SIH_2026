import React from 'react';

export const ProjectProgressDonut = ({
  total,
  breakdown,
  size = 100,
  strokeWidth = 10
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative w-[96px] h-[96px] shrink-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {total > 0 &&
            breakdown.map((seg, idx) => {
              if (seg.percentage === 0) return null;
              const strokeDasharray = `${(seg.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercent / 100) * circumference);
              cumulativePercent += seg.percentage;

              return (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 ease-out"
                />
              );
            })}
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-lg font-mono font-black text-slate-900 leading-none">{total}</span>
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-tighter mt-0.5">Projects</span>
        </div>
      </div>

      <div className="space-y-1.5 flex-1 min-w-0">
        {breakdown.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 truncate">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 truncate font-semibold text-[11px]">{item.status}</span>
            </div>
            <div className="flex items-center space-x-1.5 font-mono text-[11px] shrink-0">
              <span className="font-extrabold text-slate-800">{item.count}</span>
              <span className="text-slate-400 font-medium">({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectProgressDonut;
