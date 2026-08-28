import React from 'react';
import { IndianRupee, ShieldCheck, Clock, Layers } from 'lucide-react';
import { INNOVATION_LIFECYCLE_STEPS } from '../../data/projectConstants.js';

export const ProjectsOverviewLifecycle = ({ liveFinancials, onNavigateTab }) => {
  return (
    <div className="space-y-6">
      {/* 8-Step Innovation Lifecycle */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900 tracking-wider uppercase">
                8-STAGE INNOVATION LIFECYCLE PROGRESSION
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Standard operating pipeline from ground triage to statewide scaling
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {INNOVATION_LIFECYCLE_STEPS.map((step) => (
            <div
              key={step.step}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between hover:bg-slate-100 transition-colors"
            >
              <div>
                <span className="text-[10px] font-black text-slate-500 font-mono">STEP 0{step.step}</span>
                <h4 className="text-[11px] font-bold text-slate-900 mt-1 leading-snug">{step.label}</h4>
              </div>
              <p className="text-[9.5px] text-slate-500 mt-2 line-clamp-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Overview */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <IndianRupee className="w-4 h-4 text-emerald-400" />
            <span>State Innovation Grant Pool</span>
          </div>
          <div className="text-2xl font-black">{liveFinancials.totalPoolCr} Total Pool</div>
          <div className="text-xs text-slate-400">
            {liveFinancials.disbursedCr} Disbursed ({liveFinancials.disbursedPercentage}%) • {liveFinancials.pendingCr} Pending
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 font-bold block">Sanctioned Projects</span>
            <span className="text-sm font-black text-white">{liveFinancials.sanctionedProjectsCount}</span>
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab('projects_active')}
            className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Manage Grants
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsOverviewLifecycle;
