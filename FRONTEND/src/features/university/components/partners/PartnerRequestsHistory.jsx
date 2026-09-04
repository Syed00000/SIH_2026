import React, { useState } from 'react';
import { Clock, FolderGit2, IndianRupee, CheckCircle2, XCircle, FlaskConical } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';
import { ManageTestingStagesModal } from './ManageTestingStagesModal.jsx';

export const PartnerRequestsHistory = ({
  partnerName,
  partnerRequests = [],
  loadingRequests = false,
  setPartnerRequests
}) => {
  const [managingStagesReq, setManagingStagesReq] = useState(null);

  const handleQuoteDecision = async (requestId, decision) => {
    try {
      await universityApiService.updateIndustryRequestStatus(requestId, 'Approved', 'RU001', { quoteStatus: decision });
      setPartnerRequests?.((prev) =>
        prev.map((r) => (r.requestId === requestId ? { ...r, quoteStatus: decision } : r))
      );
    } catch (err) {
      console.error('Failed to update quote decision:', err);
    }
  };

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
        <div className="space-y-2.5">
          {partnerRequests.map((req, idx) => (
            <div key={req.requestId || idx} className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-2">
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

              {/* Lab Access Fee Quoted by Industry Section */}
              {req.labChargesQuoted && (
                <div className="p-2.5 bg-emerald-50/80 border border-emerald-200/90 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-emerald-950 flex items-center space-x-1">
                      <IndianRupee className="w-3 h-3 text-[#007A61]" />
                      <span>Industry Quoted Lab Fee:</span>
                    </span>
                    <span className="text-xs font-black text-[#007A61] bg-white px-2 py-0.5 rounded border border-emerald-200">
                      {req.labChargesQuoted}
                    </span>
                  </div>
                  {req.quoteTerms && (
                    <p className="text-[10.5px] text-slate-600 italic leading-snug">"{req.quoteTerms}"</p>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900">
                      Fee Decision:
                    </span>
                    {req.quoteStatus === 'Accepted' ? (
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-extrabold text-[10px] flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-[#007A61]" />
                          <span>Fee Accepted</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setManagingStagesReq(req)}
                          className="px-2.5 py-1 bg-[#007A61] hover:bg-[#00604c] text-white rounded text-[10.5px] font-bold flex items-center space-x-1 shadow-2xs cursor-pointer"
                        >
                          <FlaskConical className="w-3 h-3" />
                          <span>Manage Lab Stages ({req.testingStages?.length || 3})</span>
                        </button>
                      </div>
                    ) : req.quoteStatus === 'Declined' ? (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-extrabold text-[10px] flex items-center space-x-1">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        <span>Fee Declined</span>
                      </span>
                    ) : (
                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuoteDecision(req.requestId, 'Declined')}
                          className="px-2 py-0.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10.5px] font-bold cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuoteDecision(req.requestId, 'Accepted')}
                          className="px-2.5 py-0.5 bg-[#007A61] hover:bg-[#00604c] text-white rounded text-[10.5px] font-bold flex items-center space-x-1 shadow-2xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Accept Lab Fee</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-100">
                <span>Budget: <strong className="text-slate-800">{req.estimatedBudget || 'CSR Grant'}</strong> ({req.duration})</span>
                <div className="flex items-center space-x-2">
                  <span>{req.submittedAt ? new Date(req.submittedAt).toLocaleDateString('en-GB') : 'Recently'}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      await universityApiService.deleteIndustryRequest(req.requestId);
                      setPartnerRequests?.((prev) => prev.filter((r) => r.requestId !== req.requestId));
                    }}
                    className="text-rose-500 hover:text-rose-700 text-[10.5px] font-bold hover:underline cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {managingStagesReq && (
        <ManageTestingStagesModal
          isOpen={Boolean(managingStagesReq)}
          request={managingStagesReq}
          onClose={() => setManagingStagesReq(null)}
          onStagesUpdated={(id, stages) => {
            setPartnerRequests?.((prev) =>
              prev.map((r) => (r.requestId === id ? { ...r, testingStages: stages } : r))
            );
          }}
        />
      )}
    </div>
  );
};

export default PartnerRequestsHistory;
