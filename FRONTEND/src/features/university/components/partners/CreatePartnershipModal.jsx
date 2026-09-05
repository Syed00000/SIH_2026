import React, { useState } from 'react';
import { X, Building2, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';
import { usePartnershipModalData } from './usePartnershipModalData.js';
import { ProblemStatementSelector } from './ProblemStatementSelector.jsx';
import { PartnershipModalFormFields } from './PartnershipModalFormFields.jsx';

export const CreatePartnershipModal = ({ isOpen, onClose, partner: initialPartner = null, initialProblem = null, onSuccess }) => {
  const {
    partners, selectedPartnerId, setSelectedPartnerId,
    problemStatements, selectedProblem, setSelectedProblem,
    outcome, setOutcome
  } = usePartnershipModalData(isOpen, initialPartner, initialProblem);

  const [customTitle, setCustomTitle] = useState('');
  const [customStatement, setCustomStatement] = useState('');
  const [funding, setFunding] = useState(true);
  const [labAccess, setLabAccess] = useState(true);
  const [techMentorship, setTechMentorship] = useState(true);
  const [duration, setDuration] = useState('3 Months');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const currentPartner = partners.find((p) => (p.partnerId || p._id) === selectedPartnerId) || initialPartner;
  const isResearchLab = currentPartner?.industryType?.toLowerCase().includes('lab') || currentPartner?.category?.toLowerCase().includes('lab');

  const handleSelectProblem = (item) => {
    setSelectedProblem(item);
    if (item.id !== 'custom') {
      setOutcome(`R&D validation & lab testing for problem statement: "${item.problemStatement || item.title}". Technical facilities and sample testing required.`);
    }
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    const isCustom = selectedProblem?.id === 'custom';
    const finalTitle = isCustom ? customTitle.trim() : selectedProblem?.title;
    const finalStatement = isCustom ? customStatement.trim() : (selectedProblem?.problemStatement || selectedProblem?.title);
    const partnerName = currentPartner?.name || currentPartner?.legalName || 'Industry Partner';

    if (!finalTitle || !outcome.trim()) return;
    setIsSubmitting(true);
    try {
      await universityApiService.createIndustryRequest({
        projectTitle: finalTitle,
        problemStatement: finalStatement,
        projectId: isCustom ? '' : selectedProblem?.id,
        challengeId: selectedProblem?.type === 'CHALLENGE' ? selectedProblem.id : '',
        partnerId: currentPartner?.partnerId || currentPartner?._id,
        partnerName,
        partnerEmail: currentPartner?.contactPerson?.email || currentPartner?.officialEmail || '',
        fundingRequested: funding,
        labAccessRequested: labAccess,
        mentorshipRequested: techMentorship,
        estimatedBudget: 'Awaiting Industry Lab Fee',
        duration,
        executionOutcome: outcome,
        facultyName: selectedProblem?.facultyName || 'Faculty Nodal Officer',
        studentTeam: selectedProblem?.studentTeam || 'University Research Team',
        pdfUrl: selectedProblem?.pdfUrl || '',
        pdfName: selectedProblem?.pdfName || '',
        prototypeData: selectedProblem?.prototypeData || null
      });
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setSuccess(false);
      }, 1800);
    } catch (err) {
      console.error('Failed to submit industry request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-5 bg-gradient-to-r from-[#004D3D] via-[#007A61] to-[#004D3D] text-white flex items-center justify-between shrink-0 border-b border-emerald-900/50">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-emerald-200 shadow-inner">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono font-black text-xs tracking-wider text-emerald-300 uppercase">New Collaboration Request</span>
              <h2 className="text-base font-black text-white mt-0.5">Dispatch Research Lab & CSR Proposal</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[#fafafa] space-y-4">
          {success ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 py-12">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-10 h-10 text-[#007A61]" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Partnership Proposal Dispatched!</h2>
              <p className="text-xs text-slate-500 font-medium text-center max-w-sm">
                The proposal and problem statement have been dispatched to <strong>{currentPartner?.name || currentPartner?.legalName}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {initialPartner ? (
                <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#007A61] flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#007A61]" />
                      <span>Target Research / Industry Partner</span>
                    </label>
                    <span className="px-2 py-0.5 bg-white text-[#007A61] border border-emerald-200 rounded-full text-[10px] font-extrabold">
                      {initialPartner.industryType || initialPartner.category || 'Partner'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 pt-0.5">
                    <div className="w-9 h-9 rounded-xl bg-[#007A61] text-white font-black text-xs flex items-center justify-center shadow-xs">
                      {initialPartner.logoText || (initialPartner.name || initialPartner.legalName || 'IND').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 leading-snug">{initialPartner.name || initialPartner.legalName}</h4>
                      <p className="text-[10.5px] text-slate-600 font-medium">{initialPartner.contactPerson?.name || initialPartner.spocName || 'SPOC'} &bull; {initialPartner.location || 'Jharkhand'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#007A61]" />
                    <span>Select Target Industry / Research Lab *</span>
                  </label>
                  <select value={selectedPartnerId} onChange={(e) => setSelectedPartnerId(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] shadow-2xs cursor-pointer">
                    {partners.map((p) => (<option key={p.partnerId || p._id} value={p.partnerId || p._id}>{p.name || p.legalName} ({p.industryType || p.category || 'Partner'})</option>))}
                  </select>
                </div>
              )}

              <ProblemStatementSelector problemStatements={problemStatements} selectedItem={selectedProblem} onSelect={handleSelectProblem} customTitle={customTitle} onChangeCustomTitle={setCustomTitle} customStatement={customStatement} onChangeCustomStatement={setCustomStatement} />
              <PartnershipModalFormFields outcome={outcome} onChangeOutcome={setOutcome} duration={duration} onChangeDuration={setDuration} funding={funding} onChangeFunding={setFunding} labAccess={labAccess} onChangeLabAccess={setLabAccess} techMentorship={techMentorship} onChangeTechMentorship={setTechMentorship} isResearchLab={isResearchLab} />
            </form>
          )}
        </div>

        {!success && (
          <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-400 font-medium">Official University Nodal Dispatch</span>
            <div className="flex items-center space-x-2.5">
              <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">Cancel</button>
              <button type="button" onClick={handleSubmit} disabled={isSubmitting || !outcome.trim()} className="px-5 py-2.5 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-md disabled:opacity-50 cursor-pointer">
                {isSubmitting ? <div className="w-4 h-4 border-2 border-emerald-300 border-t-white rounded-full animate-spin" /> : (<><Send className="w-4 h-4" /><span>Dispatch Request to Lab</span></>)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePartnershipModal;
