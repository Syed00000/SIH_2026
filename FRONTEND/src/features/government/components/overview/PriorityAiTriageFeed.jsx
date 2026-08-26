import React from 'react';
import { Droplet, AlertTriangle, Trash2, GraduationCap, Cross, ArrowRight, Check, X } from 'lucide-react';

export const PriorityAiTriageFeed = ({ feed = [], onApprove, onReject, onViewAll }) => {
  const getCategoryVisuals = (category) => {
    switch (category) {
      case 'WATER':
        return { icon: Droplet, bg: ' text-blue-500 ' };
      case 'ROAD':
        return { icon: AlertTriangle, bg: ' text-amber-500 ', isLetterA: true };
      case 'GARBAGE':
        return { icon: Trash2, bg: ' text-emerald-500 ' };
      case 'SCHOOL':
        return { icon: GraduationCap, bg: ' text-purple-500 ' };
      case 'HEALTH':
        return { icon: Cross, bg: ' text-red-500 ' };
      default:
        return { icon: Droplet, bg: ' text-slate-500 ' };
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between h-full min-h-[390px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Priority Problem Feed
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Real-time problem review & department routing
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Feed Items List */}
      <div className="flex-1 space-y-2.5 overflow-y-auto pr-0.5">
        {feed.slice(0, 5).map((item) => {
          const { icon: CategoryIcon, bg, isLetterA } = getCategoryVisuals(item.category);
          const isApproved = item.status === 'APPROVED';
          const isRejected = item.status === 'REJECTED';

          return (
            <div
              key={item.id}
              className={`p-2.5 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 ${isApproved
                ? 'bg-emerald-50/40 border-emerald-200'
                : isRejected
                  ? 'bg-red-50/30 border-red-200 opacity-60'
                  : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                }`}
            >
              {/* Left Details */}
              <div className="flex items-center space-x-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                  {isLetterA ? (
                    <span className="font-extrabold text-xs">A</span>
                  ) : (
                    <CategoryIcon className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    {item.fullAddress || `${item.district} | ${item.ward} | ${item.locationDetail}`}
                  </p>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-medium">
                      Confidence:
                    </span>
                    <span className="text-[10px] font-bold text-slate-700">
                      {item.confidence}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="shrink-0 flex items-center space-x-2">
                {isApproved ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    <Check className="w-3 h-3 mr-1" /> Approved
                  </span>
                ) : isRejected ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-100 text-red-800">
                    <X className="w-3 h-3 mr-1" /> Rejected
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => onApprove && onApprove(item.id)}
                      className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-white hover:bg-emerald-50 border border-emerald-400 rounded-md transition-colors cursor-pointer shadow-2xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onReject && onReject(item.id)}
                      className="px-3 py-1 text-xs font-semibold text-red-600 bg-white hover:bg-red-50 border border-red-300 rounded-md transition-colors cursor-pointer shadow-2xs"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Link */}
      <div className="pt-2 border-t border-slate-100 text-right mt-1">
        <button
          onClick={onViewAll}
          className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          <span>View All Problem Submissions</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default PriorityAiTriageFeed;
