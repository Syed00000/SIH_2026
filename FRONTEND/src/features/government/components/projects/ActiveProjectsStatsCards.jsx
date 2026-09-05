import React from 'react';
import { Layers, Building2, Cpu, ShieldCheck } from 'lucide-react';

export const ActiveProjectsStatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: TOTAL ACTIVE PROJECTS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-[135px]">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Total Active Projects
            </span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">
              {stats.totalActive}
            </span>
            <span className="text-[11px] text-slate-600 font-bold flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#007A61] mr-1.5"></span>
              In Execution
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
          Statewide research &amp; civic pilots
        </div>
      </div>

      {/* Card 2: PARTICIPATING UNIVERSITIES */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-[135px]">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Participating Universities
            </span>
            <Building2 className="w-4 h-4 text-[#007A61]" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#007A61] tracking-tight font-mono">
              {stats.participatingHeisCount}
            </span>
            <span className="text-[11px] text-[#007A61] font-bold">
              HEI Research Hubs
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
          Nodal institutions leading execution
        </div>
      </div>

      {/* Card 3: PROTOTYPES IN LAB / TRL */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-[135px]">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Prototypes in Testing
            </span>
            <Cpu className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-indigo-700 tracking-tight font-mono">
              {stats.inTestingCount}
            </span>
            <span className="text-[11px] text-indigo-700 font-bold">
              TRL-4 to TRL-7
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
          Under hardware bench &amp; field testing
        </div>
      </div>

      {/* Card 4: DEPLOYED / ROLLOUT READY */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-[135px]">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Deployment Ready
            </span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-800 tracking-tight font-mono">
              {stats.deployedOrReadyCount}
            </span>
            <span className="text-[11px] text-amber-700 font-bold">
              Citizen Registry
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
          Validated for public state rollout
        </div>
      </div>
    </div>
  );
};

export default ActiveProjectsStatsCards;
