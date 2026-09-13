import React from 'react';

export const HeiHubHeader = ({ totalHeis = 0 }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-3 border-b border-slate-200">
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-base md:text-lg font-black text-slate-900 tracking-tight">
            Higher Education Institutions (HEI) Hub
          </h1>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#007A61]/10 text-[#007A61] border border-[#007A61]/20">
            NEP 2020 Framework
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Academic problem allocation, institutional leaderboard, and milestone verification queue across Jharkhand
        </p>
      </div>
      <div className="mt-2 md:mt-0 flex items-center space-x-2 text-xs font-semibold text-slate-500">
        <span>Accredited HEIs: <strong className="text-slate-900">{totalHeis}</strong></span>
      </div>
    </div>
  );
};

export default HeiHubHeader;
