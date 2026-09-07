import React, { useState, useEffect } from 'react';
import { X, Building2, Send, CheckCircle2 } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';
import { IndustryRequestFormFields } from './IndustryRequestFormFields.jsx';

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
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shadow-inner">
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
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
              <IndustryRequestFormFields
                partners={partners}
                loadingPartners={loadingPartners}
                selectedPartnerId={selectedPartnerId}
                setSelectedPartnerId={setSelectedPartnerId}
                partner={partner}
                outcome={outcome}
                setOutcome={setOutcome}
                budget={budget}
                setBudget={setBudget}
                duration={duration}
                setDuration={setDuration}
                funding={funding}
                setFunding={setFunding}
                labAccess={labAccess}
                setLabAccess={setLabAccess}
                techMentorship={techMentorship}
                setTechMentorship={setTechMentorship}
                approval={approval}
              />
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
