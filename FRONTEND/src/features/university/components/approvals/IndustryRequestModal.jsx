import React, { useState, useEffect } from 'react';
import { 
  X, Building2, Send, CheckCircle2, Factory, 
  FlaskConical, HandCoins, Briefcase, Search, Sparkles,
  ChevronRight, MapPin, CheckCircle, ShieldCheck, Award
} from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';

export const IndustryRequestModal = ({ isOpen, onClose, approval, onSuccess }) => {
  const [partners, setPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  
  const [funding, setFunding] = useState(true);
  const [labAccess, setLabAccess] = useState(false);
  const [techMentorship, setTechMentorship] = useState(true);
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('3 Months');
  const [outcome, setOutcome] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch real partners from database on open
  useEffect(() => {
    if (isOpen) {
      setLoadingPartners(true);
      universityApiService.getPartners('RU001')
        .then((data) => {
          const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
          setPartners(list);
          if (list.length > 0) {
            setSelectedPartnerId(list[0].partnerId || list[0]._id);
          }
        })
        .catch((err) => console.error('Failed to load partners:', err))
        .finally(() => setLoadingPartners(false));
    }
  }, [isOpen]);

  if (!isOpen || !approval) return null;

  const partner = partners.find((p) => (p.partnerId || p._id) === selectedPartnerId) || partners[0];

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!partner || !outcome.trim()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        projectTitle: approval.project,
        projectId: approval.projectId || approval.challengeId || '',
        partnerId: partner.partnerId || partner._id,
        partnerName: partner.name || partner.legalName,
        partnerEmail: partner.contactPerson?.email || partner.officialEmail || '',
        fundingRequested: funding,
        labAccessRequested: labAccess,
        mentorshipRequested: techMentorship,
        estimatedBudget: budget,
        duration,
        executionOutcome: outcome,
        facultyName: approval.faculty?.name || approval.requestedBy || 'Lead Mentor',
        studentTeam: approval.teamName || approval.team?.name || 'Student Research Team'
      };
      await universityApiService.createIndustryRequest(payload);
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit industry request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div 
        className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#004D3D] via-[#007A61] to-[#004D3D] text-white flex items-center justify-between shrink-0 border-b border-emerald-900/50">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-emerald-200 shadow-inner">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-black text-xs tracking-wider text-emerald-300">
                  CSR / INDUSTRY PARTNERSHIP
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] font-bold border border-emerald-400/30">
                  Govt Verified
                </span>
              </div>
              <h2 className="text-sm font-extrabold text-white mt-0.5 line-clamp-1">
                Forward Prototype "{approval.project}" to Industry
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#fafafa] space-y-5">
          {success ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 py-12">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-10 h-10 text-[#007A61]" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Partnership Request Dispatched!</h2>
              <p className="text-xs text-slate-500 font-medium text-center max-w-sm">
                The prototype dossier has been forwarded to <strong className="text-slate-800">{partner?.name || partner?.legalName}</strong>. You will receive real-time notifications on response.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Target Industry Partner Dropdown */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#007A61]" />
                    <span>Select Target Industry Partner *</span>
                  </label>
                  <span className="text-[10px] font-bold text-slate-400">
                    {partners.length} Verified Partners in DB
                  </span>
                </div>

                {loadingPartners ? (
                  <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                ) : (
                  <select
                    value={selectedPartnerId}
                    onChange={(e) => setSelectedPartnerId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs cursor-pointer"
                  >
                    {partners.map((p) => {
                      const id = p.partnerId || p._id;
                      const name = p.name || p.legalName;
                      const category = p.industryType || p.type || p.category || 'Private Industry';
                      const loc = p.location || (p.address?.city ? `${p.address.city}, JH` : 'Jharkhand');
                      return (
                        <option key={id} value={id}>
                          {name} — {category} ({loc})
                        </option>
                      );
                    })}
                  </select>
                )}

                {/* Selected Partner Preview Badge */}
                {partner && (
                  <div className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#007A61] text-white font-black text-[10px] flex items-center justify-center">
                        {partner.logoText || (partner.name || partner.legalName || 'IND').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 text-xs">{partner.name || partner.legalName}</p>
                        <p className="text-[10px] text-slate-500 font-semibold">{partner.contactPerson?.name || partner.spocName || 'CSR Head'} • {partner.location || 'Jharkhand'}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white border border-emerald-200 text-[#007A61]">
                      {partner.industryType || partner.type || 'Corporate'}
                    </span>
                  </div>
                )}
              </div>

              {/* Execution Outcome & CSR Value */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Execution Outcome & Value Proposition *
                </label>
                <textarea 
                  rows={3}
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  placeholder="Explain how this prototype aligns with the industry partner's goals, CSR priorities, and what the expected technical outcome is..."
                  className="w-full text-xs font-medium text-slate-700 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] resize-none shadow-2xs"
                />
              </div>

              {/* Budget Support & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Budget Support Requested (CSR)
                  </label>
                  <input 
                    type="text" 
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. ₹ 5,00,000 for pilot scale-up"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs"
                  />
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Expected Partnership Duration
                  </label>
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs cursor-pointer"
                  >
                    <option>1 Month</option>
                    <option>3 Months</option>
                    <option>6 Months</option>
                    <option>1 Year</option>
                    <option>Ongoing / Permanent</option>
                  </select>
                </div>
              </div>

              {/* Support Modalities */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Specific Support Required
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className="flex items-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-emerald-50/50 transition-colors">
                    <input type="checkbox" checked={funding} onChange={(e) => setFunding(e.target.checked)} className="w-4 h-4 text-[#007A61] rounded border-slate-300 focus:ring-[#007A61] accent-[#007A61]" />
                    <span className="ml-2 text-xs font-bold text-slate-700">CSR Funding</span>
                  </label>

                  <label className="flex items-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-emerald-50/50 transition-colors">
                    <input type="checkbox" checked={labAccess} onChange={(e) => setLabAccess(e.target.checked)} className="w-4 h-4 text-[#007A61] rounded border-slate-300 focus:ring-[#007A61] accent-[#007A61]" />
                    <span className="ml-2 text-xs font-bold text-slate-700">Lab Access</span>
                  </label>

                  <label className="flex items-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-emerald-50/50 transition-colors">
                    <input type="checkbox" checked={techMentorship} onChange={(e) => setTechMentorship(e.target.checked)} className="w-4 h-4 text-[#007A61] rounded border-slate-300 focus:ring-[#007A61] accent-[#007A61]" />
                    <span className="ml-2 text-xs font-bold text-slate-700">Mentorship</span>
                  </label>
                </div>
              </div>

              {/* Summary Box */}
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Faculty: {approval.faculty?.name || approval.requestedBy || 'Lead Mentor'}</span>
                <span>Team: {approval.teamName || approval.team?.name || 'Student Research Team'}</span>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-400 font-medium">
              Dossier will be dispatched to {partner?.name || partner?.legalName || 'Target Partner'}.
            </span>
            <div className="flex items-center space-x-2.5">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!partner || !outcome.trim() || isSubmitting}
                className="px-5 py-2.5 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-emerald-300 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustryRequestModal;
