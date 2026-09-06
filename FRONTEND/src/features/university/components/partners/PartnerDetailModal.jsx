import React, { useState, useEffect } from 'react';
import { X, Factory, ShieldCheck, Send, Lock, Clock, MapPin, ExternalLink } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';
import { PartnerSpocCard } from './PartnerSpocCard.jsx';
import { PartnerDomainBadges } from './PartnerDomainBadges.jsx';
import { PartnerProblemStatementSection } from './PartnerProblemStatementSection.jsx';

export const PartnerDetailModal = ({
  partner,
  initialProblem = null,
  isOpen,
  onClose,
  onOpenSendRequest
}) => {
  const [partnerRequests, setPartnerRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(initialProblem);

  useEffect(() => {
    if (initialProblem) {
      setSelectedProblem(initialProblem);
    }
  }, [initialProblem]);

  useEffect(() => {
    if (isOpen && partner) {
      setLoadingRequests(true);
      universityApiService.getIndustryRequests('RU001')
        .then((allReqs) => {
          const pName = partner.name || partner.legalName;
          const pId = partner.partnerId || partner._id;
          const matched = (Array.isArray(allReqs) ? allReqs : []).filter(
            (r) => r.partnerId === pId || r.partnerName === pName
          );
          setPartnerRequests(matched);
        })
        .catch((err) => console.error('Error fetching partner requests:', err))
        .finally(() => setLoadingRequests(false));
    }
  }, [isOpen, partner]);

  if (!isOpen || !partner) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div 
        className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#004D3D] via-[#007A61] to-[#004D3D] text-white flex items-center justify-between shrink-0 border-b border-emerald-900/50">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-emerald-200 text-base font-black shadow-inner">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] font-extrabold border border-emerald-400/30 uppercase tracking-wider flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                  <span>Verified Corporate Partner</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-200/80">
                  {partner.partnerId || 'IND-JH-2026'}
                </span>
              </div>
              <h2 className="text-base font-black text-white mt-1 line-clamp-1">
                {partnerName}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fafafa]">
          {/* Overview Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Corporate Profile & Domain
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-[#007A61] border border-emerald-200 rounded-full text-[10px] font-extrabold">
                {category}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {partner.about || `${partnerName} is an official industrial CSR partner onboarded under the Jharkhand Higher & Technical Education Innovation Framework.`}
            </p>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 pt-1 border-t border-slate-100">
              <MapPin className="w-3.5 h-3.5 text-[#007A61] shrink-0" />
              <span>{location}</span>
              {partner.website && (
                <>
                  <span className="text-slate-300">•</span>
                  <a href={partner.website} target="_blank" rel="noreferrer" className="text-[#007A61] hover:underline flex items-center space-x-1 font-bold">
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* SPOC Contact Card */}
          <PartnerSpocCard spoc={spoc} />

          {/* Actual Problem Statement Selection for this Partner */}
          <PartnerProblemStatementSection
            partner={partner}
            partnerRequests={partnerRequests}
            selectedProblem={selectedProblem}
            onSelectProblem={setSelectedProblem}
          />

          {/* Research Domains & Support Capabilities */}
          <PartnerDomainBadges domains={domains} supportModes={supportModes} />
        </div>

        {/* Footer with ONLY 1 Request Lab Access button */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            Active under Jharkhand Higher Education MoU.
          </span>
          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Close
            </button>
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
                  onClose();
                  onOpenSendRequest && onOpenSendRequest(partner, selectedProblem);
                }}
                className={`px-5 py-2.5 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-md ${
                  selectedProblem ? 'bg-[#007A61] hover:bg-[#00604c] text-white cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                }`}
                title={selectedProblem ? 'Request Collaboration for Problem' : 'No submitted prototype available yet'}
              >
                <Send className="w-4 h-4" />
                <span>Request Collaboration for Problem</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetailModal;
