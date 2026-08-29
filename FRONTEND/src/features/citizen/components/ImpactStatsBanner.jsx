import React from 'react';

export const ImpactStatsBanner = ({ stats = {} }) => {
  const challengesCount = stats.challengesSubmitted !== undefined ? stats.challengesSubmitted : 0;
  const universitiesCount = stats.universitiesEngaged !== undefined ? stats.universitiesEngaged : 0;
  const industryCount = stats.industryPartners !== undefined ? stats.industryPartners : 0;

  return (
    <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-2xl p-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Intro */}
        <div className="max-w-xs">
          <h4 className="text-sm font-extrabold text-emerald-950 tracking-tight">
            Together for Impact
          </h4>
          <p className="text-[11px] text-emerald-800/80 font-medium mt-0.5 leading-snug">
            Collaborating Citizens, Universities and Industry for a Better Jharkhand
          </p>
        </div>

        {/* Right 3 Stat Columns */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 border-t sm:border-t-0 sm:border-l border-emerald-200/60 pt-2 sm:pt-0 sm:pl-4">
          <div className="text-left sm:text-center">
            <span className="block text-sm sm:text-base font-black text-emerald-900 leading-tight">
              {challengesCount}
            </span>
            <span className="block text-[10px] font-semibold text-emerald-700 leading-tight mt-0.5">
              Challenges Submitted
            </span>
          </div>

          <div className="text-left sm:text-center">
            <span className="block text-sm sm:text-base font-black text-emerald-900 leading-tight">
              {universitiesCount}
            </span>
            <span className="block text-[10px] font-semibold text-emerald-700 leading-tight mt-0.5">
              Universities Engaged
            </span>
          </div>

          <div className="text-left sm:text-center">
            <span className="block text-sm sm:text-base font-black text-emerald-900 leading-tight">
              {industryCount}
            </span>
            <span className="block text-[10px] font-semibold text-emerald-700 leading-tight mt-0.5">
              Industry Partners
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactStatsBanner;
