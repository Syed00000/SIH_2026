import React from 'react';
import { Layers, ArrowRight, MapPin, User, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

export const NodalUnassignedQueueCard = ({
  challenges = [],
  onNavigateChallenges,
  onOpenAssign
}) => {
  const unassigned = challenges
    .filter((c) => !c.assignedUniversity?.id && c.status !== 'Resolved' && c.status !== 'Rejected')
    .slice(0, 5);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-amber-700 stroke-[2]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Unassigned Problems Pipeline
            </h3>
          </div>
          <button
            onClick={() => onNavigateChallenges && onNavigateChallenges('Under Review')}
            className="text-[11px] font-bold text-slate-700 hover:text-slate-900 flex items-center space-x-0.5 cursor-pointer"
          >
            <span>View Registry</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {unassigned.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5 opacity-80" />
              <p className="font-semibold text-slate-600">All submissions allocated</p>
              <p className="text-[11px] text-slate-400">Zero unassigned problem statements pending.</p>
            </div>
          ) : (
            unassigned.map((chl) => (
              <div
                key={chl.id || chl._id || chl.challengeId}
                onClick={() => onOpenAssign?.(chl)}
                className="py-3 flex items-start justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10.5px] font-bold text-slate-600">
                      {chl.challengeId || chl.id}
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded-full border border-slate-200">
                      {chl.domain || 'General Need'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-slate-800">
                    {chl.title}
                  </h4>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{chl.location?.district || chl.district || 'Jharkhand'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{chl.submitter?.name || chl.submittedBy || 'Citizen'}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAssign?.(chl);
                  }}
                  className="bg-white hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200/90 text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-2xs transition-all shrink-0 mt-1 cursor-pointer"
                >
                  Allocate
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-amber-700 shrink-0" />
          <span className="font-semibold text-amber-900">
            {challenges.filter((c) => !c.assignedUniversity?.id).length} problems awaiting institution assignment
          </span>
        </div>
        <button
          onClick={() => onNavigateChallenges && onNavigateChallenges('Under Review')}
          className="text-amber-950 font-bold hover:underline shrink-0 text-[11px] cursor-pointer"
        >
          Review All
        </button>
      </div>
    </div>
  );
};

export default NodalUnassignedQueueCard;
