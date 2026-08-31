import React, { useState, useEffect } from 'react';
import { 
  X, Building2, Send, CheckCircle2, Factory, 
  FlaskConical, HandCoins, Briefcase, Search, Sparkles,
  ShieldCheck, FolderGit2
} from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';

export const CreatePartnershipModal = ({ 
  isOpen, 
  onClose, 
  partner: initialPartner = null, 
  onSuccess 
}) => {
  const [partners, setPartners] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState('');
  const [customProjectTitle, setCustomProjectTitle] = useState('');

  const [funding, setFunding] = useState(true);
  const [labAccess, setLabAccess] = useState(false);
  const [techMentorship, setTechMentorship] = useState(true);
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('3 Months');
  const [outcome, setOutcome] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load all partners & projects
      Promise.all([
        universityApiService.getPartners('RU001'),
        universityApiService.getProjects('RU001')
      ]).then(([partnersList, projectsList]) => {
        const pList = Array.isArray(partnersList) ? partnersList : [];
        const prjList = Array.isArray(projectsList) ? projectsList : [];
        setPartners(pList);
        setProjects(prjList);

        if (initialPartner) {
          setSelectedPartnerId(initialPartner.partnerId || initialPartner._id);
        } else if (pList.length > 0) {
          setSelectedPartnerId(pList[0].partnerId || pList[0]._id);
        }

        if (prjList.length > 0) {
          setSelectedProjectTitle(prjList[0].title);
        }
      }).catch(err => console.error('Error fetching modal data:', err));
    }
  }, [isOpen, initialPartner]);

  if (!isOpen) return null;

  const currentPartner = partners.find(
    (p) => (p.partnerId || p._id) === selectedPartnerId
  ) || initialPartner;

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    const finalProject = customProjectTitle.trim() || selectedProjectTitle || 'University R&D Innovation';
    const partnerName = currentPartner?.name || currentPartner?.legalName || 'Industry Partner';

    if (!partnerName || !outcome.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        projectTitle: finalProject,
        partnerId: currentPartner?.partnerId || currentPartner?._id,
        partnerName: partnerName,
        partnerEmail: currentPartner?.contactPerson?.email || currentPartner?.officialEmail || '',
        fundingRequested: funding,
        labAccessRequested: labAccess,
        mentorshipRequested: techMentorship,
        estimatedBudget: budget,
        duration,
        executionOutcome: outcome,
        facultyName: 'Dr. Binod Kumar (Nodal Faculty)',
        studentTeam: 'Smart Aqua Innovators / Binod GANG'
      };

      await universityApiService.createIndustryRequest(payload);
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setSuccess(false);
        setOutcome('');
        setBudget('');
      }, 2000);
    } catch (error) {
      console.error('Failed to submit industry request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
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
                  NEW COLLABORATION / CSR PROPOSAL
                </span>
              </div>
              <h2 className="text-base font-black text-white mt-0.5">
                Initiate Industry Partnership Request
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
              <h2 className="text-xl font-black text-slate-900">Partnership Proposal Dispatched!</h2>
              <p className="text-xs text-slate-500 font-medium text-center max-w-sm">
                The proposal has been dispatched to <strong>{currentPartner?.name || currentPartner?.legalName}</strong>. The nodal team will be notified upon corporate response.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Partner Display: Fixed if opened for specific partner, Dropdown if generic */}
              {initialPartner ? (
                <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#007A61] block flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#007A61]" />
                      <span>Target Industry Partner (Selected)</span>
                    </label>
                    <span className="px-2 py-0.5 bg-white text-[#007A61] border border-emerald-200 rounded-full text-[10px] font-extrabold">
                      {initialPartner.industryType || initialPartner.type || initialPartner.category || 'Verified Partner'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 pt-0.5">
                    <div className="w-9 h-9 rounded-xl bg-[#007A61] text-white font-black text-xs flex items-center justify-center shadow-xs">
                      {initialPartner.logoText || (initialPartner.name || initialPartner.legalName || 'IND').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 leading-snug">
                        {initialPartner.name || initialPartner.legalName}
                      </h4>
                      <p className="text-[10.5px] text-slate-600 font-medium">
                        {initialPartner.contactPerson?.name || initialPartner.spocName || 'Nodal SPOC'} • {initialPartner.location || 'Jharkhand'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#007A61]" />
                    <span>Select Target Industry Partner *</span>
                  </label>
                  <select
                    value={selectedPartnerId}
                    onChange={(e) => setSelectedPartnerId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs cursor-pointer"
                  >
                    {partners.map((p) => {
                      const id = p.partnerId || p._id;
                      const name = p.name || p.legalName;
                      const cat = p.industryType || p.type || p.category || 'Corporate';
                      return (
                        <option key={id} value={id}>
                          {name} ({cat})
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              {/* Project Selector */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block flex items-center space-x-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-[#007A61]" />
                  <span>Associated Project / Problem Statement *</span>
                </label>
                
                {projects.length > 0 ? (
                  <select
                    value={selectedProjectTitle}
                    onChange={(e) => setSelectedProjectTitle(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs cursor-pointer"
                  >
                    {projects.map((pr, idx) => (
                      <option key={pr.projectId || idx} value={pr.title}>
                        {pr.projectId ? `[${pr.projectId}] ` : ''}{pr.title}
                      </option>
                    ))}
                    <option value="custom">+ Other / Custom Research Project</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={customProjectTitle}
                    onChange={(e) => setCustomProjectTitle(e.target.value)}
                    placeholder="Enter project name..."
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs"
                  />
                )}

                {selectedProjectTitle === 'custom' && (
                  <input
                    type="text"
                    value={customProjectTitle}
                    onChange={(e) => setCustomProjectTitle(e.target.value)}
                    placeholder="Type custom R&D initiative name..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs"
                  />
                )}
              </div>

              {/* Execution Outcome & CSR Value */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Execution Outcome & Technical Deliverable *
                </label>
                <textarea
                  rows={3}
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  placeholder="Describe the prototype deliverable, expected CSR impact, and collaboration timeline..."
                  className="w-full text-xs font-medium text-slate-700 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] resize-none shadow-2xs"
                />
              </div>

              {/* Budget & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Estimated CSR Support (₹)
                  </label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. ₹ 5,00,000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs"
                  />
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Collaboration Duration
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
                    <option>Permanent MoU</option>
                  </select>
                </div>
              </div>

              {/* Support Modes Checkboxes */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Support Modalities Required
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className="flex items-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-emerald-50/50 transition-colors">
                    <input type="checkbox" checked={funding} onChange={(e) => setFunding(e.target.checked)} className="w-4 h-4 text-[#007A61] rounded border-slate-300 focus:ring-[#007A61] accent-[#007A61]" />
                    <span className="ml-2 text-xs font-bold text-slate-700">CSR Grant</span>
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
            </form>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-400 font-medium">
              Official University Nodal Dispatch
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
                disabled={isSubmitting || !outcome.trim()}
                className="px-5 py-2.5 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-emerald-300 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Proposal</span>
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

export default CreatePartnershipModal;
