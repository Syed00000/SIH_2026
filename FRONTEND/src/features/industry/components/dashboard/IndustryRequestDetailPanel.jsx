import React, { useState } from 'react';
import {
  CheckCircle2, XCircle, FileText, Building2, IndianRupee, ExternalLink,
  Users, Cpu, ArrowLeft
} from 'lucide-react';
import { FullPageDetailPanel } from '../../../../shared/components/layout/FullPageDetailPanel.jsx';
import { universityApiService } from '../../../university/services/universityApiService.js';
import { getPdfViewUrl } from '../../../../shared/utils/openPdf.js';

export const IndustryRequestDetailPanel = ({ request, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState(request?.labChargesQuoted || '₹ 25,000');
  const [quoteTerms, setQuoteTerms] = useState(
    request?.quoteTerms || 'Access to certified research lab, advanced testing apparatus & technician assistance.'
  );

  if (!request) return null;

  const isAlreadyApproved = request.status === 'Approved';
  const isDeclined = request.status === 'Fee Declined' || request.quoteStatus === 'Declined';
  const isMentorship = Boolean(request.mentorshipRequested || request.collaborationPurpose === 'Mentorship' || request.required?.includes('Mentorship'));

  const handleAction = async (status) => {
    setIsSubmitting(true);
    try {
      const targetId = request.requestId || request.id;
      const targetCode = request.universityCode || 'RU001';
      const extra = status === 'Approved' ? {
        labChargesQuoted: quoteAmount.trim(),
        quoteTerms: quoteTerms.trim(),
        quoteStatus: 'Pending University Acceptance'
      } : {};
      await universityApiService.updateIndustryRequestStatus(targetId, status, targetCode, extra);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update request status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FullPageDetailPanel
      onBack={onClose}
      backLabel="Back to Collaboration Requests"
      breadcrumbs={['Corporate Innovation Node', 'Collaboration Requests', request.requestId || request.id]}
      idBadge={request.requestId || request.id}
      statusBadge={
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
          isAlreadyApproved ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
          isDeclined ? 'bg-rose-50 text-rose-800 border-rose-300' :
          'bg-amber-50 text-amber-800 border-amber-300'
        }`}>
          {isDeclined ? 'Fee Declined' : request.status || 'Pending Review'}
        </span>
      }
      title={request.title || 'University Innovation Proposal'}
      subtitle={`Institution: ${request.university || 'State University'} • Lead: ${request.faculty || 'Faculty Officer'} • Duration: ${request.duration || '3 Months'}`}
      stickyFooter={
        <div className="w-full flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer shadow-2xs"
          >
            Back to Requests
          </button>
          <div className="flex items-center space-x-2.5">
            {isDeclined ? (
              <div className="px-3.5 py-2 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold rounded-xl flex items-center space-x-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Quote Declined by University</span>
              </div>
            ) : !isAlreadyApproved ? (
              <>
                <button
                  type="button"
                  onClick={() => handleAction('Rejected')}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  Decline Proposal
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('Approved')}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isMentorship ? 'Approve & Request Mentorship Fee' : 'Approve & Request Lab Fee'}</span>
                </button>
              </>
            ) : (
              <div className="px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Proposal Approved & Quoted</span>
              </div>
            )}
          </div>
        </div>
      }
    >
      {/* Ground Problem Statement Card */}
      <div className="bg-gradient-to-r from-emerald-50/70 via-slate-50 to-teal-50/50 p-4 rounded-2xl border border-emerald-200/90 shadow-2xs space-y-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#007A61] flex items-center space-x-1">
          <FileText className="w-3.5 h-3.5" />
          <span>Ground Problem Statement & Citizen Challenge</span>
        </span>
        <p className="text-xs text-slate-800 italic font-medium leading-relaxed">
          "{request.problemStatement || request.title}"
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-600 font-medium">
          <span>Squad: <strong className="text-slate-800">{request.studentTeam || 'Student Research Team'}</strong></span>
          <span>&bull;</span>
          <span>Requested Support: <strong className="text-[#007A61]">{request.required || 'Research Collaboration'}</strong></span>
        </div>
      </div>

      {/* Prototype Deliverable & PDF Blueprint */}
      {request.prototypeData?.content && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
            <Cpu className="w-4 h-4 text-[#007A61]" />
            <span>Prototype Deliverable: {request.prototypeData.title || request.title}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {request.prototypeData.content}
          </p>
          {request.pdfUrl && (
            <div className="flex items-center justify-between p-2.5 bg-rose-50 border border-rose-200 rounded-xl mt-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-900 line-clamp-1">{request.pdfName || 'Blueprint.pdf'}</span>
                  <span className="text-[9.5px] text-emerald-700 font-semibold block">✓ Verified Cloudinary Blueprint</span>
                </div>
              </div>
              <a
                href={getPdfViewUrl(request.pdfUrl, request.pdfName || 'Blueprint.pdf')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-white hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg text-xs font-bold flex items-center space-x-1 shadow-2xs cursor-pointer"
              >
                <span>View PDF</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Lab Fee & Mentorship Quoting Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
          <IndianRupee className="w-4 h-4 text-[#007A61]" />
          <span>{isMentorship ? 'Corporate Mentorship & Expert Hours Fee Quote *' : 'Industry Laboratory Facility & Access Fee Quote *'}</span>
        </label>
        <p className="text-xs text-slate-500 leading-normal">
          {isMentorship
            ? 'Specify the fee your organization charges for technical mentoring, roadmap reviews, and corporate expert allocation.'
            : 'Specify the charges for physical testing equipment, spectrometer validation, and lab apparatus access.'}
        </p>

        {(isAlreadyApproved || isDeclined) && request.labChargesQuoted ? (
          <div className={`p-3.5 rounded-xl space-y-1 border ${isDeclined ? 'bg-rose-50/50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">{isMentorship ? 'Quoted Mentorship Fee:' : 'Quoted Lab Fee:'}</span>
              <span className={`text-base font-black ${isDeclined ? 'text-rose-700' : 'text-emerald-700'}`}>{request.labChargesQuoted}</span>
            </div>
            {request.quoteTerms && <p className="text-xs text-slate-600 italic pt-1">{request.quoteTerms}</p>}
          </div>
        ) : (
          <div className="space-y-2.5 pt-1">
            <input
              type="text"
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(e.target.value)}
              placeholder="e.g. ₹ 25,000"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61]"
            />
            <textarea
              rows={3}
              value={quoteTerms}
              onChange={(e) => setQuoteTerms(e.target.value)}
              placeholder={isMentorship ? 'Describe mentorship scope and consultation schedule...' : 'Describe laboratory access, apparatus, and testing terms...'}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61]"
            />
          </div>
        )}
      </div>
    </FullPageDetailPanel>
  );
};

export default IndustryRequestDetailPanel;
