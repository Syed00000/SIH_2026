import React from 'react';
import { Layers, Building2, Cpu, ShieldCheck } from 'lucide-react';

export const ActiveProjectsStatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* Card 1: TOTAL ACTIVE PROJECTS */}
      <div className="bg-white border border-slate-200 p-4.5 shadow-xs flex flex-col justify-between h-[130px] rounded-xs">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Active Field Projects
            </span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {stats.totalActive}
            </span>
            <span className="text-[11px] text-[#007A61] font-bold flex items-center">
              <span className="w-1.5 h-1.5 rounded-xs bg-[#007A61] mr-1.5"></span>
              In Execution
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100 text-[10.5px] text-slate-400 font-medium">
          Statewide institutional projects
        </div>
      </div>

      {/* Card 2: PARTICIPATING UNIVERSITIES */}
      <div className="bg-white border border-slate-200 p-4.5 shadow-xs flex flex-col justify-between h-[130px] rounded-xs">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Participating Institutions
            </span>
            <Building2 className="w-4 h-4 text-[#007A61]" />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#007A61] tracking-tight font-mono">
              {stats.participatingHeisCount}
            </span>
            <span className="text-[11px] text-[#007A61] font-bold">
              HEI Hubs
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100 text-[10.5px] text-slate-400 font-medium">
          Accredited universities &amp; labs
        </div>
      </div>

      {/* Card 3: PROTOTYPES IN LAB / TRL */}
      <div className="bg-white border border-slate-200 p-4.5 shadow-xs flex flex-col justify-between h-[130px] rounded-xs">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Prototypes in Testing
            </span>
            <Cpu className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-800 tracking-tight font-mono">
              {stats.inTestingCount}
            </span>
            <span className="text-[11px] text-emerald-700 font-bold">
              TRL Benchmarks
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100 text-[10.5px] text-slate-400 font-medium">
          Physical validation in progress
        </div>
      </div>

      {/* Card 4: DEPLOYED / ROLLOUT READY */}
      <div className="bg-white border border-slate-200 p-4.5 shadow-xs flex flex-col justify-between h-[130px] rounded-xs">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Deployment Certified
            </span>
            <ShieldCheck className="w-4 h-4 text-[#007A61]" />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {stats.deployedOrReadyCount}
            </span>
            <span className="text-[11px] text-slate-700 font-bold">
              Citizen Ready
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100 text-[10.5px] text-slate-400 font-medium">
          Verified for public deployment
        </div>
      </div>
    </div>
  );
};

export default ActiveProjectsStatsCards;
