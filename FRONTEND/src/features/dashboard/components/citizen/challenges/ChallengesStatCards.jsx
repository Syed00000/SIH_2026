import React from 'react';
import { FileText, Hourglass, Activity, CheckCircle2 } from 'lucide-react';

export const ChallengesStatCards = ({
  totalCount = '05',
  underReviewCount = '02',
  inProgressCount = '01',
  resolvedCount = '02'
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Total Challenges */}
      <div className="bg-white border border-slate-200 p-3.5 rounded-md shadow-2xs hover:border-slate-300 transition-all flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
            Total Challenges
          </span>
          <span className="text-xl font-extrabold text-slate-900 mt-0.5 block leading-tight">
            {totalCount}
          </span>
          <span className="text-[10px] font-medium text-slate-400 block">All Challenges</span>
        </div>
      </div>

      {/* Under Review */}
      <div className="bg-white border border-slate-200 p-3.5 rounded-md shadow-2xs hover:border-slate-300 transition-all flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-md bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
          <Hourglass className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
            Under Review
          </span>
          <span className="text-xl font-extrabold text-slate-900 mt-0.5 block leading-tight">
            {underReviewCount}
          </span>
          <span className="text-[10px] font-medium text-slate-400 block">Challenges</span>
        </div>
      </div>

      {/* In Progress */}
      <div className="bg-white border border-slate-200 p-3.5 rounded-md shadow-2xs hover:border-slate-300 transition-all flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-md bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0">
          <Activity className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
            In Progress
          </span>
          <span className="text-xl font-extrabold text-slate-900 mt-0.5 block leading-tight">
            {inProgressCount}
          </span>
          <span className="text-[10px] font-medium text-slate-400 block">Challenges</span>
        </div>
      </div>

      {/* Resolved */}
      <div className="bg-white border border-slate-200 p-3.5 rounded-md shadow-2xs hover:border-slate-300 transition-all flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
            Resolved
          </span>
          <span className="text-xl font-extrabold text-slate-900 mt-0.5 block leading-tight">
            {resolvedCount}
          </span>
          <span className="text-[10px] font-medium text-slate-400 block">Challenges</span>
        </div>
      </div>
    </div>
  );
};

export default ChallengesStatCards;
