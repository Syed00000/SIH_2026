import React, { useState, useEffect } from 'react';
import { Factory, Send, Lock, Clock, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { FullPageDetailPanel } from '../../../../shared/components/layout/FullPageDetailPanel.jsx';
import { universityApiService } from '../../services/universityApiService.js';
import { PartnerSpocCard } from './PartnerSpocCard.jsx';
import { PartnerProblemStatementSection } from './PartnerProblemStatementSection.jsx';

export const PartnerDetailPanel = ({
  partner,
  initialProblem = null,
  onClose,
  onOpenSendRequest,
  onViewProblemDossier
}) => {
  const [partnerRequests, setPartnerRequests] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(initialProblem);

  useEffect(() => {
    if (initialProblem) setSelectedProblem(initialProblem);
  }, [initialProblem]);

  useEffect(() => {
    if (partner) {
      universityApiService.getIndustryRequests('RU001')
        .then((allReqs) => {
          const pName = partner.name || partner.legalName;
          const pId = partner.partnerId || partner._id;
          const matched = (Array.isArray(allReqs) ? allReqs : []).filter(
            (r) => r.partnerId === pId || r.partnerName === pName
          );
          setPartnerRequests(matched);
        })
        .catch((err) => console.error('Error fetching partner requests:', err));
    }
  }, [partner]);

  if (!partner) return null;

  const partnerName = partner.name || partner.legalName || 'Industry Partner';
  const category = partner.industryType || partner.type || partner.category || 'Private Industry';
  const spoc = partner.contactPerson || {
    name: partner.spocName || 'Nodal Officer', role: partner.designation || 'Nodal Lead',
    email: partner.officialEmail || partner.credentials?.loginEmail || 'corporate@partner.org',
    phone: partner.mobileNumber || '+91 98350 00000'
  };
  const domains = partner.domains?.length ? partner.domains : [partner.focusArea || partner.thematicDomain || 'Technology & R&D'];
  const supportModes = partner.supportOffered?.length ? partner.supportOffered : (partner.supportModes || ['CSR Funding', 'Lab Testing', 'Mentorship']);
  const location = partner.location || (partner.address?.city ? `${partner.address.city}, ${partner.address.district || ''}, Jharkhand` : 'Jharkhand, India');

  const matchedReqForProblem = partnerRequests.find(
    (r) => (!selectedProblem || r.projectTitle?.toLowerCase() === selectedProblem?.title?.toLowerCase() || r.projectId === selectedProblem?.id)
  );
  const isSelectedProblemApproved = matchedReqForProblem?.status === 'Approved';
  const isSelectedProblemPending = matchedReqForProblem?.status === 'Pending';

  return (
    <FullPageDetailPanel
      onBack={onClose}
      backLabel="Back to Industry Partners"
      breadcrumbs={['University Nodal Center', 'Industry Collaborations', partnerName]}
      idBadge={partner.partnerId || 'IND-PARTNER'}
      statusBadge={
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black border bg-emerald-50 text-emerald-800 border-emerald-300 flex items-center space-x-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Verified Industry Partner</span>
        </span>
      }
      title={partnerName}
      subtitle={`${category} • Location: ${location}`}
      stickyFooter={
        <div className="w-full flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            Back to Industry Partners
          </button>
          <div className="flex items-center space-x-2.5">
            {isSelectedProblemApproved ? (
              <div className="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-2xs select-none">
                <Lock className="w-4 h-4 text-[#007A61]" />
                <span>Approved from University</span>
              </div>
            ) : isSelectedProblemPending ? (
              <div className="px-4 py-2 bg-amber-50 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-2xs select-none">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Request Pending</span>
              </div>
            ) : (
              <button
                type="button"
                disabled={!selectedProblem}
                onClick={() => {
                  if (!selectedProblem) return;
                  onOpenSendRequest && onOpenSendRequest(partner, selectedProblem);
                }}
                className={`px-5 py-2 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-md ${
                  selectedProblem ? 'bg-[#007A61] hover:bg-[#00604c] text-white cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Request Collaboration for Problem</span>
              </button>
            )}
          </div>
        </div>
      }
    >
      {/* Header Info Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#007A61] flex items-center justify-center font-black text-base border border-emerald-200 shrink-0">
            <Factory className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">{partnerName}</h3>
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <span className="flex items-center space-x-1"><MapPin className="w-3 h-3 text-slate-400" /><span>{location}</span></span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">{category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SPOC Contact Details */}
      <PartnerSpocCard spoc={spoc} />

      {/* Submitted Problem Statement & Prototype Selection */}
      <PartnerProblemStatementSection
        partner={partner}
        partnerRequests={partnerRequests}
        selectedProblem={selectedProblem}
        onSelectProblem={setSelectedProblem}
      />
    </FullPageDetailPanel>
  );
};

export default PartnerDetailPanel;
