import React, { useState, useEffect } from 'react';
import { 
  X, Building2, Factory, Mail, Phone, MapPin, 
  ExternalLink, ShieldCheck, HandCoins, FlaskConical, 
  Users, Send, Award, CheckCircle2, Globe, Clock, FolderGit2
} from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';

export const PartnerDetailModal = ({
  partner,
  isOpen,
  onClose,
  onOpenSendRequest
}) => {
  const [partnerRequests, setPartnerRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

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
    name: partner.spocName || 'Nodal Officer',
    role: partner.designation || 'Chief of CSR / Nodal Lead',
    email: partner.officialEmail || partner.credentials?.loginEmail || 'corporate@partner.org',
    phone: partner.mobileNumber || '+91 98350 00000'
  };
  const domains = Array.isArray(partner.domains) && partner.domains.length > 0 
    ? partner.domains 
    : [partner.focusArea || partner.thematicDomain || 'Technology & R&D'];
  const supportModes = Array.isArray(partner.supportOffered) && partner.supportOffered.length > 0 
    ? partner.supportOffered 
    : (Array.isArray(partner.supportModes) ? partner.supportModes : ['CSR Funding', 'Lab Testing', 'Mentorship']);
  const location = partner.location || (partner.address?.city ? `${partner.address.city}, ${partner.address.district || ''}, Jharkhand` : 'Jharkhand, India');

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
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#fafafa]">
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
                  <a 
                    href={partner.website} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[#007A61] hover:underline flex items-center space-x-1 font-bold"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* SPOC Contact Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Official Corporate SPOC / Nodal Contact
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">SPOC Name & Role</span>
                <p className="text-xs font-black text-slate-900">{spoc.name}</p>
                <p className="text-[11px] text-[#007A61] font-bold">{spoc.role}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Direct Channels</span>
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{spoc.email}</span>
                </div>
                {spoc.phone && (
                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{spoc.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Research Domains & Support Capabilities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Thematic Research Domains
              </span>
              <div className="flex flex-wrap gap-1.5">
                {domains.map((d, i) => (
                  <span key={i} className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-[#007A61] text-[11px] font-bold rounded-lg">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Support Modes Offered
              </span>
              <div className="flex flex-wrap gap-1.5">
                {supportModes.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold rounded-lg flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" />
                    <span>{s}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Dispatched Proposals History from DB */}
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
                            setPartnerRequests(prev => prev.filter(r => r.requestId !== req.requestId));
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
        </div>

        {/* Footer */}
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
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSendRequest && onOpenSendRequest(partner);
              }}
              className="px-5 py-2.5 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Initiate CSR / Partnership Request</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetailModal;
