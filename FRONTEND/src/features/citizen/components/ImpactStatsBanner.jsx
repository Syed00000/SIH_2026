import React from 'react';

export const ImpactStatsBanner = ({ stats = {} }) => {
  const challengesCount = stats.challengesSubmitted !== undefined ? stats.challengesSubmitted : 0;
  const universitiesCount = stats.universitiesEngaged !== undefined ? stats.universitiesEngaged : 0;
  const industryCount = stats.industryPartners !== undefined ? stats.industryPartners : 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Intro */}
        <div className="max-w-xs text-left">
          <h4 className="text-sm font-bold text-slate-900 tracking-tight">
            Together for Impact
          </h4>
          <p className="text-xs text-slate-500 font-medium mt-0.5 leading-snug">
            Collaborating Citizens, Universities and Industry for a Better Jharkhand
          </p>
        </div>

        {/* Right 3 Stat Columns */}
        <div className="grid grid-cols-3 gap-2 sm:gap-6 border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-6">
          <div className="text-left sm:text-center">
            <span className="block text-base font-extrabold text-slate-900 leading-tight">
              {challengesCount}
            </span>
            <span className="block text-xs font-semibold text-slate-500 leading-tight mt-0.5">
              Challenges Submitted
            </span>
          </div>

          <div className="text-left sm:text-center">
            <span className="block text-base font-extrabold text-slate-900 leading-tight">
              {universitiesCount}
            </span>
            <span className="block text-xs font-semibold text-slate-500 leading-tight mt-0.5">
              Universities Engaged
            </span>
          </div>

          <div className="text-left sm:text-center">
            <span className="block text-base font-extrabold text-slate-900 leading-tight">
              {industryCount}
            </span>
            <span className="block text-xs font-semibold text-slate-500 leading-tight mt-0.5">
              Industry Partners
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactStatsBanner;
