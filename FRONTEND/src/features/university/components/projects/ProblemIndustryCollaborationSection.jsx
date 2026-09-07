import React, { useState, useEffect } from 'react';
import {
  Factory, ShieldCheck, CheckCircle2, Lock,
  FileText, ExternalLink, IndianRupee, Clock, ArrowUpRight
} from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';
import { getPdfViewUrl } from '../../../../shared/utils/openPdf.js';
import { GrantedTechHelpBadge } from '../partners/GrantedTechHelpBadge.jsx';

export const ProblemIndustryCollaborationSection = ({ project, onViewProblemDossier, onConnectIndustry }) => {
  const [matchedRequest, setMatchedRequest] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadIndustryRequest = async () => {
      if (!project) return;
      try {
        const reqs = await universityApiService.getIndustryRequests('RU001');
        const list = Array.isArray(reqs) ? reqs : (reqs?.data || []);
        const projId = project.projectId || project.id || project._id;
        const projTitle = (project.title || '').trim().toLowerCase();
        const found = list.find((r) =>
          (r.projectId && projId && String(r.projectId) === String(projId)) ||
          (r.projectTitle && projTitle && r.projectTitle.trim().toLowerCase() === projTitle)
        );
        if (isMounted) setMatchedRequest(found || null);
      } catch (err) {
        console.warn('Failed to load project industry request:', err);
      }
    };
    loadIndustryRequest();
    return () => { isMounted = false; };
  }, [project?.projectId, project?.id, project?.title]);

  if (!project) return null;

  const partnerName = matchedRequest?.partnerName || project.industryPartner || project.prototypeData?.industryRequisition?.selectedPartner || 'Industry Research Partner';
  const isApproved = matchedRequest?.status === 'Approved' || project.industryApproval === 'Approved';
  const isPending = matchedRequest?.status === 'Pending' || matchedRequest?.status === 'Under Evaluation';
  const hasRequest = Boolean(matchedRequest || project.industryApproval || project.industryPartner);
  const labFee = matchedRequest?.labChargesQuoted;
  const isFeeAccepted = matchedRequest?.quoteStatus === 'Accepted' || Boolean(project.labChargesAccepted);

  const mentor = project.industryMentor;
  const techHelp = project.grantedTechHelp;
  const pdfUrl = project.pdfUrl || project.prototypeData?.pdfUrl;
  const pdfName = project.pdfName || project.prototypeData?.pdfName || 'Technical_Blueprint.pdf';
  const labVerdict = project.prototypeData?.labTests?.status || project.labStatus || 'Passed';

  return (
    <div className="bg-white border-2 border-emerald-300 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4 text-left select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-emerald-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#007A61] text-white flex items-center justify-center shadow-2xs shrink-0">
            <Factory className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 flex items-center space-x-2">
              <span>Industry Partner & Lab Collaboration</span>
              {hasRequest ? (
                <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-extrabold border flex items-center space-x-1 ${
                  isApproved ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                  isPending ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {isApproved ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                  <span>{isApproved ? 'Approved & Facilities Unlocked' : isPending ? 'Pending Industry Review' : 'Active'}</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  Open for Collaboration
                </span>
              )}
            </h4>
            <p className="text-[10.5px] text-slate-500 font-medium">
              Verified corporate CSR grants, industry laboratory access, and assigned enterprise mentors.
            </p>
          </div>
        </div>

        {onViewProblemDossier && (
          <button
            type="button"
            onClick={() => onViewProblemDossier(project)}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#007A61] border border-emerald-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#007A61]" />
            <span>View Approved Dossier</span>
          </button>
        )}
      </div>

      {/* Official Approval & Lab Notification Banner (When Approved) */}
      {isApproved && (
        <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50/60 to-white rounded-xl border border-emerald-300 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#007A61] flex items-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>Industry Approval & Facility Status</span>
            </span>
            {labFee && (
              <span className="text-[10px] font-extrabold text-[#007A61] bg-white px-2 py-0.5 rounded border border-emerald-200 flex items-center space-x-1">
                <IndianRupee className="w-3 h-3" />
                <span>Lab Fee: {labFee} ({isFeeAccepted ? 'Fee Accepted' : 'Pending Review'})</span>
              </span>
            )}
          </div>
          <p className="text-xs font-bold text-slate-900">
            {partnerName} has officially approved collaboration & unlocked advanced research facilities for this problem.
          </p>
          <p className="text-[11px] text-slate-600 font-medium">
            {isFeeAccepted
              ? `Quoted lab fee of ${labFee || 'standard rate'} accepted. Testing laboratories & telemetry benches are fully operational.`
              : `Review terms in Dossier to confirm lab access booking.`}
          </p>
        </div>
      )}

      {/* Assigned Corporate Industry Mentor */}
      {mentor && (
        <div className="p-3 bg-slate-50/90 border border-slate-200 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#007A61]" />
              <span>Assigned Industry Corporate Mentor</span>
            </span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9.5px] font-extrabold rounded-full border border-emerald-200">
              Active Guide
            </span>
          </div>
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#007A61] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {mentor.name?.charAt(0) || 'M'}
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-black text-slate-900 truncate">{mentor.name}</h5>
              <p className="text-[10.5px] text-slate-600 font-medium truncate">
                {mentor.designation || 'Corporate Specialist'} &bull; {mentor.company || partnerName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-[9.5px] text-slate-500 font-mono pt-1 border-t border-slate-200">
            {mentor.email && <span>✉️ {mentor.email}</span>}
            {mentor.phone && <span>📞 {mentor.phone}</span>}
          </div>
        </div>
      )}

      {/* Granted Industry Tech Tools */}
      <GrantedTechHelpBadge techHelp={techHelp} project={project} />

      {/* Prototype Verification & PDF Dossier Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="font-semibold text-slate-600">Lab Verdict: <strong className="text-emerald-700 font-bold">{labVerdict}</strong></span>
          {pdfUrl && (
            <a
              href={getPdfViewUrl(pdfUrl, pdfName)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#007A61] hover:underline font-bold flex items-center space-x-1"
            >
              <FileText className="w-3.5 h-3.5 text-rose-500" />
              <span>View Technical Blueprint PDF</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {!hasRequest && onConnectIndustry && (
          <button
            type="button"
            onClick={() => onConnectIndustry(project)}
            className="px-3 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
          >
            <span>Request Industry Lab / CSR</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProblemIndustryCollaborationSection;
