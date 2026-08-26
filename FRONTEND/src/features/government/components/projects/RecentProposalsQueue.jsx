import React from 'react';
import {
  FileText,
  Building2,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Check,
  ChevronRight,
  Sparkles,
  Award,
  IndianRupee
} from 'lucide-react';

export const RecentProposalsQueue = ({
  proposals = [],
  onReviewProposal,
  onApproveGrant,
  onQuickApprove
}) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'New Submission':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'High Priority':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Under Evaluation':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Verified':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Approved':
        return 'bg-slate-900 text-white border-slate-900';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getSectorIcon = (sector) => {
    switch (sector) {
      case 'Agriculture & Food':
        return '🌱';
      case 'Water & Sanitation':
        return '💧';
      case 'Mining & Energy':
        return '⚡';
      case 'Healthcare & Telemedicine':
        return '🏥';
      case 'Infrastructure & Transport':
        return '🚗';
      case 'Environment & Forest':
        return '🌲';
      case 'Tribal Tech & Education':
        return '📚';
      default:
        return '💡';
    }
  };

  if (!proposals || proposals.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-2xs">
        <FileText className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-800">No Solution Proposals Found</h3>
        <p className="text-xs text-slate-500 mt-1">Try adjusting your search keyword or sector filter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">
            Recently Submitted Solution Proposals - Extensive Queue
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Verified academic & innovator proposals submitted for Jharkhand state challenges
          </p>
        </div>
        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          {proposals.length} Proposals in Queue
        </span>
      </div>

      <div className="space-y-3">
        {proposals.map((proposal) => {
          const isApproved = proposal.status === 'Approved';

          return (
            <div
              key={proposal.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 transition-all duration-150 hover:shadow-xs hover:border-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
            >
              {/* Left Details */}
              <div className="flex items-start space-x-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-lg flex-shrink-0">
                  {getSectorIcon(proposal.sector)}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {proposal.title}
                    </h3>
                    <span className="font-mono text-[11px] font-bold text-slate-500">
                      ({proposal.id})
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                        proposal.status
                      )}`}
                    >
                      {proposal.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-1">
                    <span className="font-semibold text-slate-800 flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{proposal.hei}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Team Lead: <strong className="text-slate-700">{proposal.teamLead}</strong></span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Submitted {proposal.submittedTime}</span>
                    </span>
                    <span>•</span>
                    <span className="font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                      {proposal.requestedGrant}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action Controls */}
              <div className="flex items-center space-x-2 flex-shrink-0 self-end md:self-center">
                {!isApproved ? (
                  <button
                    type="button"
                    onClick={() => onApproveGrant && onApproveGrant(proposal)}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Approve Grant</span>
                  </button>
                ) : (
                  <span className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Grant Sanctioned</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => onReviewProposal && onReviewProposal(proposal)}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Review File</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentProposalsQueue;
