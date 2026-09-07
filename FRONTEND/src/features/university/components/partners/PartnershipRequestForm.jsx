import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Loader2, Check, ChevronDown, AlertCircle } from 'lucide-react';
import { STEPS } from './form/PartnershipFormCommon.jsx';
import { PartnershipFormStep1 } from './form/PartnershipFormStep1.jsx';
import { PartnershipFormStep2 } from './form/PartnershipFormStep2.jsx';
import { PartnershipFormStep3 } from './form/PartnershipFormStep3.jsx';

export const PartnershipRequestForm = ({ partner, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [industries, setIndustries] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    selectedIndustryId: partner?._id || partner?.industryId || '',
    selectedIndustryName: partner?.legalName || partner?.name || '',
    industryCategory: partner?.category || '',
    industryEmail: partner?.officialEmail || '',
    industryCity: partner?.address?.city || '',
    spocName: partner?.spocName || '',
    proposalTitle: '',
    partnershipType: 'Research Collaboration',
    domain: '',
    projectTitle: '',
    challengeId: '',
    problemStatement: '',
    expectedOutcomes: '',
    supportModes: [],
    estimatedBudget: '',
    csrFundRequested: '',
    duration: '1 Year',
    startDate: '',
    teamName: '',
    facultyMentor: '',
    teamSize: '',
    priorWork: '',
    governmentAlignment: '',
    whyThisPartner: '',
    coverNote: '',
    authorizedBy: 'Dr. Ankit Verma, University Admin',
    declaration: false
  });

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await fetch('/api/v1/government/industries?page=1&limit=50');
        const json = await res.json();
        const recs = json?.data?.records || [];
        setIndustries(recs);
      } catch {}
    };
    if (!partner) fetchIndustries();
  }, [partner]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const toggleSupport = (mode) => {
    set('supportModes', form.supportModes.includes(mode)
      ? form.supportModes.filter((m) => m !== mode)
      : [...form.supportModes, mode]);
  };

  const validate = () => {
    const e = {};
    if (step === 1 && !form.selectedIndustryId) e.selectedIndustryId = 'Please select an industry partner';
    if (step === 2) {
      if (!form.proposalTitle.trim()) e.proposalTitle = 'Proposal title is required';
      if (!form.domain) e.domain = 'Select a domain';
      if (!form.problemStatement.trim()) e.problemStatement = 'Problem statement is required';
    }
    if (step === 3) {
      if (form.supportModes.length === 0) e.supportModes = 'Select at least one support mode';
      if (!form.estimatedBudget.trim()) e.estimatedBudget = 'Estimated budget is required';
      if (!form.duration) e.duration = 'Partnership duration is required';
    }
    if (step === 4) {
      if (!form.whyThisPartner.trim()) e.whyThisPartner = 'This field is required';
    }
    if (step === 5 && !form.declaration) e.declaration = 'You must accept the declaration';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(5, s + 1)); };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setSubmitted(true);
      setTimeout(() => { onSuccess && onSuccess(); }, 2000);
    } catch {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Partnership Proposal Submitted!</h2>
        <p className="text-sm text-slate-500 font-medium max-w-sm">
          Your partnership request has been officially dispatched to <strong>{form.selectedIndustryName}</strong> and is pending review.
          You will be notified once they respond.
        </p>
        <p className="text-xs text-slate-400 mt-4">Redirecting back to Industry Partners...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <button onClick={onClose} className="flex items-center space-x-1.5 text-slate-300 hover:text-white text-xs font-bold cursor-pointer transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Industry Partners</span>
          </button>
          <div className="w-px h-4 bg-slate-600" />
          <span className="text-xs font-black uppercase tracking-wider text-white">New Partnership Request</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Step {step} of {STEPS.length}</span>
          <div className="w-32 h-1 bg-slate-700 rounded-none overflow-hidden">
            <div className="h-full bg-white transition-all" style={{ width: `${(step / STEPS.length) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center space-x-0 shrink-0 overflow-x-auto">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          const isActive = s.id === step;
          const isDone = s.id < step;
          return (
            <React.Fragment key={s.id}>
              <button
                onClick={() => isDone && setStep(s.id)}
                className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer rounded-none
                  ${isActive ? 'bg-slate-900 text-white' : isDone ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100' : 'text-slate-400 cursor-default'}`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                <span>{s.label}</span>
              </button>
              {idx < STEPS.length - 1 && <ChevronDown className="w-3 h-3 text-slate-300 rotate-[-90deg] shrink-0" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {(step === 1 || step === 2) && (
            <PartnershipFormStep1 step={step} form={form} set={set} errors={errors} partner={partner} industries={industries} />
          )}
          {(step === 3 || step === 4) && (
            <PartnershipFormStep2 step={step} form={form} set={set} errors={errors} toggleSupport={toggleSupport} />
          )}
          {step === 5 && (
            <PartnershipFormStep3 form={form} set={set} errors={errors} partner={partner} />
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-slate-200 bg-white px-6 py-3.5 flex items-center justify-between shrink-0">
        <div className="text-xs text-slate-500 font-medium">
          {step < 5 ? (
            <span className="flex items-center space-x-1 text-slate-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>All fields marked * are required to proceed.</span>
            </span>
          ) : (
            <span className="text-emerald-700 font-bold">✓ Ready to submit</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {step > 1 && (
            <button onClick={back} className="px-5 py-2 border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer rounded-none transition-colors flex items-center space-x-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
          {step < 5 ? (
            <button onClick={next} className="px-8 py-2 bg-slate-900 hover:bg-black text-white text-sm font-bold cursor-pointer rounded-none transition-colors flex items-center space-x-1.5">
              <span>Continue</span>
              <ChevronDown className="w-3.5 h-3.5 rotate-[-90deg]" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className="px-8 py-2 bg-slate-900 hover:bg-black text-white text-sm font-bold cursor-pointer rounded-none transition-colors flex items-center space-x-1.5 disabled:opacity-70">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{submitting ? 'Submitting Proposal...' : 'Submit Partnership Request'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnershipRequestForm;
