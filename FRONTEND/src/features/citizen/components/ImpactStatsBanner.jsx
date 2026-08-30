import React from 'react';

export const ImpactStatsBanner = ({ stats = {} }) => {
  const challengesCount = stats.challengesSubmitted !== undefined ? stats.challengesSubmitted : 2;
  const universitiesCount = stats.universitiesEngaged !== undefined ? stats.universitiesEngaged : 86;
  const industryCount = stats.industryPartners !== undefined ? stats.industryPartners : 124;

  return (
    <div className="bg-gradient-to-r from-emerald-50/60 via-white to-emerald-50/30 border border-emerald-200/80 rounded-xl p-3.5 sm:p-4 shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Intro */}
        <div className="text-left space-y-0.5">
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
            Together for Impact
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-snug">
            Collaborating Citizens, Universities & Industry for a Better Jharkhand
          </p>
        </div>

        {/* Right 3 Stat Columns */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-2.5 md:pt-0 md:pl-4">
          <div className="text-center">
            <span className="block text-sm sm:text-base font-black text-slate-900 leading-tight">
              {challengesCount}
            </span>
            <span className="block text-[10px] sm:text-xs font-semibold text-slate-600 leading-tight mt-0.5">
              Challenges
            </span>
          </div>

          <div className="text-center">
            <span className="block text-sm sm:text-base font-black text-slate-900 leading-tight">
              {universitiesCount}
            </span>
            <span className="block text-[10px] sm:text-xs font-semibold text-slate-600 leading-tight mt-0.5">
              Universities
            </span>
          </div>

          <div className="text-center">
            <span className="block text-sm sm:text-base font-black text-slate-900 leading-tight">
              {industryCount}
            </span>
            <span className="block text-[10px] sm:text-xs font-semibold text-slate-600 leading-tight mt-0.5">
              Industry
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactStatsBanner;
