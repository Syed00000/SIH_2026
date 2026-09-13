import React from 'react';
import { Droplet, AlertTriangle, Trash2, GraduationCap, Cross, ArrowRight, Check, X, Sparkles, ShieldAlert } from 'lucide-react';

export const PriorityAiTriageFeed = ({ feed = [], onApprove, onReject, onViewAll }) => {
  const getCategoryVisuals = (category) => {
    switch (category) {
      case 'WATER':
        return { icon: Droplet, bg: 'bg-[#007A61]/10 text-[#007A61] border-[#007A61]/20', isLetterA: false };
      case 'ROAD':
        return { icon: AlertTriangle, bg: 'bg-amber-50 text-amber-600 border-amber-100', isLetterA: false };
      case 'GARBAGE':
        return { icon: Trash2, bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', isLetterA: false };
      case 'SCHOOL':
        return { icon: GraduationCap, bg: 'bg-purple-50 text-purple-600 border-purple-100', isLetterA: false };
      case 'HEALTH':
        return { icon: Cross, bg: 'bg-rose-50 text-rose-600 border-rose-100', isLetterA: false };
      default:
        return { icon: Droplet, bg: 'bg-slate-50 text-slate-600 border-slate-100', isLetterA: false };
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 hover:border-slate-300/90 rounded-xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_-6px_rgba(15,23,42,0.07)] flex flex-col justify-between h-full min-h-[410px] transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-slate-700" />
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Priority Problem Inflow
            </h3>
            <p className="text-[10px] text-slate-400 font-medium leading-tight">
              Real-time submission review & departmental routing
            </p>
          </div>
        </div>
      </div>

      {/* Feed Items List */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-0.5 max-h-[290px]">
        {feed.length === 0 ? (
          <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <ShieldAlert className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-600">No Pending Submissions</p>
            <p className="text-[10.5px] text-slate-400 mt-0.5">All incoming citizen problem statements have been triaged or queue is clear.</p>
          </div>
        ) : (
          feed.slice(0, 5).map((item) => {
            const { icon: CategoryIcon } = getCategoryVisuals(item.category);
            const isApproved = item.status === 'APPROVED';
            const isRejected = item.status === 'REJECTED';

          return (
            <div
              key={item.id}
              className={`p-2.5 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 ${
                isApproved
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : isRejected
                  ? 'bg-red-50/30 border-red-200 opacity-60'
                  : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 shadow-2xs'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-center space-x-3 min-w-0">
                <CategoryIcon className="w-4 h-4 text-slate-700 shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {item.title}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 truncate">
                    {item.fullAddress || `${item.district} | ${item.ward || 'Ward'} | ${item.locationDetail || 'Location'}`}
                  </p>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="text-[9.5px] text-slate-400 font-medium">
                      AI Confidence:
                    </span>
                    <span className="text-[9.5px] font-bold text-slate-700">
                      {item.confidence}%
                    </span>
                    <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden inline-block ml-1">
                      <div
                        className="h-full bg-[#007A61] rounded-full"
                        style={{ width: `${item.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="shrink-0 flex items-center space-x-1.5">
                {isApproved ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <Check className="w-3 h-3 mr-1" /> Approved
                  </span>
                ) : isRejected ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-red-100 text-red-800 border border-red-200">
                    <X className="w-3 h-3 mr-1" /> Rejected
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => onApprove && onApprove(item.id)}
                      className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-md transition-colors cursor-pointer shadow-2xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onReject && onReject(item.id)}
                      className="px-2.5 py-1 text-[11px] font-bold text-red-600 bg-white hover:bg-red-50 border border-red-300 rounded-md transition-colors cursor-pointer shadow-2xs"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
            );
          })
        )}
      </div>

      {/* Footer Link */}
      <div className="pt-2.5 mt-1 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          <span>Realtime Ingestion</span>
        </div>
        <button
          onClick={onViewAll}
          className="inline-flex items-center text-[11.5px] font-bold text-[#007A61] hover:text-[#00624e] hover:underline cursor-pointer"
        >
          <span>View All Submissions</span>
          <ArrowRight className="w-3 h-3 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default PriorityAiTriageFeed;
