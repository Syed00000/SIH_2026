import React from 'react';
import { Clock, FolderGit2 } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';

export const PartnerRequestsHistory = ({
  partnerName,
  partnerRequests = [],
  loadingRequests = false,
  setPartnerRequests
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-[#007A61]" />
          <span>Proposals Dispatched to {partnerName}</span>
        </span>
        <span className="text-[11px] font-bold text-[#007A61]">
          {partnerRequests.length} Dispatched
        </span>
      </div>

      {loadingRequests ? (
        <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
      ) : partnerRequests.length === 0 ? (
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center text-xs text-slate-400 font-semibold">
          No active proposals dispatched to this partner yet. Click below to initiate collaboration.
        </div>
      ) : (
        <div className="space-y-2">
          {partnerRequests.map((req, idx) => (
            <div key={req.requestId || idx} className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-900 truncate">
                  <FolderGit2 className="w-3.5 h-3.5 text-[#007A61] shrink-0" />
                  <span className="truncate">{req.projectTitle}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                  req.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                  req.status === 'Rejected' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                  'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {req.status || 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-100">
                <span>Budget: <strong className="text-slate-800">{req.estimatedBudget || 'CSR Grant'}</strong> ({req.duration})</span>
                <div className="flex items-center space-x-2">
                  <span>{req.submittedAt ? new Date(req.submittedAt).toLocaleDateString('en-GB') : 'Recently'}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      await universityApiService.deleteIndustryRequest(req.requestId);
                      setPartnerRequests?.(prev => prev.filter(r => r.requestId !== req.requestId));
                    }}
                    className="text-rose-500 hover:text-rose-700 text-[10.5px] font-bold hover:underline cursor-pointer"
                    title="Delete dispatched proposal record"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnerRequestsHistory;
