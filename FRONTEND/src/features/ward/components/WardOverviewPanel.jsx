import React from 'react';
import { Landmark, AlertCircle, CheckCircle2, Clock, Building2, ArrowRight } from 'lucide-react';

export const WardOverviewPanel = ({
  ward,
  challenges = [],
  onNavigateTab,
  onSelectChallenge
}) => {
  const totalAssigned = challenges.length;
  const inProgress = challenges.filter((c) => c.status === 'In Progress' || c.status === 'Assigned').length;
  const resolved = challenges.filter((c) => c.status === 'Resolved').length;
  const underReview = challenges.filter((c) => c.status === 'Under Review' || c.status === 'Submitted').length;

  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-150">
      <div className="bg-gradient-to-r from-[#005B48] to-[#007A61] rounded-2xl p-5 text-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">
              MUNICIPAL WARD COMMAND
            </span>
            <h2 className="text-xl font-black">{ward?.name || 'Ward Administration'}</h2>
            <p className="text-xs text-emerald-100 max-w-xl">
              Local municipal jurisdiction for citizen grievance triage, grassroots civic remediation, and field updates in {ward?.district || 'Ranchi'}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateTab('problems')}
              className="px-4 py-2 bg-white text-[#007A61] rounded-xl text-xs font-bold hover:bg-emerald-50 transition-all cursor-pointer shadow-xs"
            >
              View Assigned Problems ({totalAssigned})
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Assigned Issues</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalAssigned}</p>
          <span className="text-[10px] text-slate-500 font-semibold">Total assigned to ward</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">In Progress</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-700 mt-1">{inProgress}</p>
          <span className="text-[10px] text-slate-500 font-semibold">Under field remediation</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-1">{resolved}</p>
          <span className="text-[10px] text-slate-500 font-semibold">Closed & verified</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Pending Review</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-700 mt-1">{underReview}</p>
          <span className="text-[10px] text-slate-500 font-semibold">Awaiting assessment</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Recently Assigned Civic Issues ({challenges.slice(0, 5).length})
          </h3>
          <button
            type="button"
            onClick={() => onNavigateTab('problems')}
            className="text-xs font-bold text-[#007A61] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {challenges.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            No civic issues assigned yet to this Ward. Once the Nodal Authority assigns a problem, it will immediately appear here.
          </div>
        ) : (
          <div className="space-y-2">
            {challenges.slice(0, 5).map((chl) => {
              const id = chl.challengeId || chl.id || chl._id;
              return (
                <div
                  key={id}
                  onClick={() => onSelectChallenge(chl)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-[#007A61]/40 bg-slate-50/50 hover:bg-white flex items-center justify-between gap-3 cursor-pointer transition-all"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500">[{chl.challengeId}]</span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">{chl.title}</h4>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-50 text-blue-700">
                        {chl.domain}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {chl.location?.address || chl.location?.district || 'Local Ward Area'}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                    {chl.status || 'Assigned'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WardOverviewPanel;
