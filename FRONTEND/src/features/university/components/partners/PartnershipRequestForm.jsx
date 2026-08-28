import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Send, Loader2, Check, Building2, Users, FileText,
  Banknote, Calendar, Tag, Globe, Phone, Mail, MapPin,
  ChevronDown, Plus, X, AlertCircle, Briefcase, Lightbulb, Target
} from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';

const SUPPORT_MODES = ['Funding', 'Lab Access', 'Equipment', 'Mentorship', 'Data Sharing', 'Pilot Support', 'Technical Support', 'Field Testing'];
const PARTNERSHIP_TYPES = ['Research Collaboration', 'CSR Funding', 'MoU / Agreement', 'Internship Program', 'Joint Project', 'Lab Partnership', 'Skill Development', 'Technology Transfer'];
const DURATIONS = ['3 Months', '6 Months', '1 Year', '2 Years', '3 Years', 'Ongoing'];
const DOMAINS = ['Water & Sanitation', 'Agriculture & Food', 'Healthcare & Nutrition', 'Rural Infrastructure', 'Renewable Energy', 'Education', 'Environment', 'Digital Innovation'];

const STEPS = [
  { id: 1, label: 'Industry Partner', icon: Building2 },
  { id: 2, label: 'Proposal Details', icon: FileText },
  { id: 3, label: 'Support & Budget', icon: Banknote },
  { id: 4, label: 'Project Alignment', icon: Target },
  { id: 5, label: 'Review & Submit', icon: Send }
];

const SectionHeading = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-start space-x-3 pb-3 border-b border-slate-200 mb-4">
    <div className="w-8 h-8 bg-slate-900 flex items-center justify-center shrink-0 rounded-none">
      <Icon className="w-4 h-4 text-white" />
    </div>
    <div>
      <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const Field = ({ label, required, children, hint }) => (
  <div className="space-y-1">
    <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
      {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-[10.5px] text-slate-400 font-medium">{hint}</p>}
  </div>
);

const inputCls = "w-full px-3 py-2 bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-900 rounded-none placeholder:text-slate-400 font-medium";
const selectCls = "w-full px-3 py-2 bg-white border border-slate-200 text-sm text-slate-800 font-medium focus:outline-none focus:border-slate-900 rounded-none cursor-pointer";
const textareaCls = "w-full px-3 py-2.5 bg-white border border-slate-200 text-sm text-slate-900 resize-none focus:outline-none focus:border-slate-900 rounded-none placeholder:text-slate-400 font-medium";

export const PartnershipRequestForm = ({ partner, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [industries, setIndustries] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    // Step 1 — Industry
    selectedIndustryId: partner?._id || partner?.industryId || '',
    selectedIndustryName: partner?.legalName || partner?.name || '',
    industryCategory: partner?.category || '',
    industryEmail: partner?.officialEmail || '',
    industryCity: partner?.address?.city || '',
    spocName: partner?.spocName || '',
    // Step 2 — Proposal
    proposalTitle: '',
    partnershipType: 'Research Collaboration',
    domain: '',
    projectTitle: '',
    challengeId: '',
    problemStatement: '',
    expectedOutcomes: '',
    // Step 3 — Support & Budget
    supportModes: [],
    estimatedBudget: '',
    csrFundRequested: '',
    duration: '1 Year',
    startDate: '',
    // Step 4 — Project Alignment
    teamName: '',
    facultyMentor: '',
    teamSize: '',
    priorWork: '',
    governmentAlignment: '',
    whyThisPartner: '',
    // Step 5 — Cover Note
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
      await new Promise((r) => setTimeout(r, 1200)); // Replace with real API call
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
          <span className="text-xs font-black uppercase tracking-wider text-white">
            New Partnership Request
          </span>
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

          {/* STEP 1 — Select Industry */}
          {step === 1 && (
            <div className="space-y-6">
              <SectionHeading icon={Building2} title="Select Industry Partner" subtitle="Choose the government-registered industry you wish to partner with." />
              {partner ? (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-none space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-black text-slate-900 text-base">{partner.legalName || partner.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{partner.category} · {partner.thematicDomain}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-bold rounded-none">Pre-selected</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {[
                      { icon: Mail, label: 'Email', value: partner.officialEmail },
                      { icon: Phone, label: 'Contact', value: partner.mobileNumber },
                      { icon: MapPin, label: 'City', value: partner.address?.city },
                      { icon: Users, label: 'SPOC', value: partner.spocName }
                    ].map(({ icon: I, label, value }) => value && (
                      <div key={label} className="flex items-center space-x-2 text-slate-600">
                        <I className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold">{label}:</span>
                        <span className="font-bold text-slate-900 truncate">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Field label="Select Industry Partner" required hint="Only government-approved industries are listed.">
                    <select
                      value={form.selectedIndustryId}
                      onChange={(e) => {
                        const ind = industries.find((i) => i._id === e.target.value);
                        if (ind) {
                          set('selectedIndustryId', ind._id);
                          set('selectedIndustryName', ind.legalName);
                          set('industryCategory', ind.category);
                          set('industryEmail', ind.officialEmail);
                          set('industryCity', ind.address?.city);
                          set('spocName', ind.spocName);
                        }
                      }}
                      className={selectCls}
                    >
                      <option value="">-- Select a Government-Registered Industry --</option>
                      {industries.map((ind) => (
                        <option key={ind._id} value={ind._id}>
                          {ind.legalName} ({ind.category}) — {ind.address?.city}
                        </option>
                      ))}
                    </select>
                    {errors.selectedIndustryId && <p className="text-[11px] text-rose-600 font-bold">{errors.selectedIndustryId}</p>}
                  </Field>

                  {form.selectedIndustryId && (
                    <div className="bg-slate-50 border border-slate-200 p-4 grid grid-cols-2 gap-3 text-xs">
                      {[
                        { icon: Mail, label: 'Official Email', value: form.industryEmail },
                        { icon: MapPin, label: 'City', value: form.industryCity },
                        { icon: Tag, label: 'Category', value: form.industryCategory },
                        { icon: Users, label: 'SPOC', value: form.spocName }
                      ].map(({ icon: I, label, value }) => value && (
                        <div key={label} className="flex items-center space-x-2 text-slate-600">
                          <I className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-semibold">{label}:</span>
                          <span className="font-bold text-slate-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — Proposal Details */}
          {step === 2 && (
            <div className="space-y-6">
              <SectionHeading icon={FileText} title="Partnership Proposal Details" subtitle="Describe the nature and intent of this partnership clearly." />
              <div className="space-y-4">
                <Field label="Proposal Title" required>
                  <input type="text" value={form.proposalTitle} onChange={(e) => set('proposalTitle', e.target.value)}
                    placeholder="e.g. R&D Collaboration for Smart Irrigation System — MoU Request"
                    className={inputCls} />
                  {errors.proposalTitle && <p className="text-[11px] text-rose-600 font-bold">{errors.proposalTitle}</p>}
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Partnership Type" required>
                    <select value={form.partnershipType} onChange={(e) => set('partnershipType', e.target.value)} className={selectCls}>
                      {PARTNERSHIP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Thematic Domain" required>
                    <select value={form.domain} onChange={(e) => set('domain', e.target.value)} className={selectCls}>
                      <option value="">-- Select Domain --</option>
                      {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errors.domain && <p className="text-[11px] text-rose-600 font-bold">{errors.domain}</p>}
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Linked Project Title" hint="Optional — if partnering for a specific project">
                    <input type="text" value={form.projectTitle} onChange={(e) => set('projectTitle', e.target.value)}
                      placeholder="e.g. Water Quality Monitoring in Rural Areas" className={inputCls} />
                  </Field>
                  <Field label="Challenge / Problem ID" hint="Government challenge reference, if applicable">
                    <input type="text" value={form.challengeId} onChange={(e) => set('challengeId', e.target.value)}
                      placeholder="e.g. CHL-1024" className={inputCls} />
                  </Field>
                </div>
                <Field label="Problem Statement" required hint="Describe the problem you aim to solve through this partnership.">
                  <textarea rows={4} value={form.problemStatement} onChange={(e) => set('problemStatement', e.target.value)}
                    placeholder="Provide a detailed description of the problem and how this industry partner can contribute to solving it..."
                    className={textareaCls} />
                  {errors.problemStatement && <p className="text-[11px] text-rose-600 font-bold">{errors.problemStatement}</p>}
                </Field>
                <Field label="Expected Outcomes / Deliverables" hint="What tangible results do you expect from this collaboration?">
                  <textarea rows={3} value={form.expectedOutcomes} onChange={(e) => set('expectedOutcomes', e.target.value)}
                    placeholder="e.g. Working prototype tested in 3 villages, 5 patents filed, 20 students trained..."
                    className={textareaCls} />
                </Field>
              </div>
            </div>
          )}

          {/* STEP 3 — Support & Budget */}
          {step === 3 && (
            <div className="space-y-6">
              <SectionHeading icon={Banknote} title="Support Required & Budget Proposal" subtitle="Specify what support you need and the financial commitment expected." />
              <div className="space-y-4">
                <Field label="Support Modes Required" required hint="Select all modes of support you are requesting from the industry.">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {SUPPORT_MODES.map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => toggleSupport(mode)}
                        className={`px-3 py-1.5 text-xs font-bold border rounded-none cursor-pointer transition-colors select-none
                          ${form.supportModes.includes(mode) ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-900 hover:bg-slate-50'}`}
                      >
                        {form.supportModes.includes(mode) && <span className="mr-1">✓</span>}
                        {mode}
                      </button>
                    ))}
                  </div>
                  {errors.supportModes && <p className="text-[11px] text-rose-600 font-bold mt-1">{errors.supportModes}</p>}
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Estimated Total Budget" required hint="Total project budget including all sources.">
                    <input type="text" value={form.estimatedBudget} onChange={(e) => set('estimatedBudget', e.target.value)}
                      placeholder="e.g. ₹ 5,00,000" className={inputCls} />
                    {errors.estimatedBudget && <p className="text-[11px] text-rose-600 font-bold">{errors.estimatedBudget}</p>}
                  </Field>
                  <Field label="CSR Fund / Grant Requested" hint="Amount specifically requested from this industry partner.">
                    <input type="text" value={form.csrFundRequested} onChange={(e) => set('csrFundRequested', e.target.value)}
                      placeholder="e.g. ₹ 2,00,000" className={inputCls} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Partnership Duration" required>
                    <select value={form.duration} onChange={(e) => set('duration', e.target.value)} className={selectCls}>
                      {DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errors.duration && <p className="text-[11px] text-rose-600 font-bold">{errors.duration}</p>}
                  </Field>
                  <Field label="Proposed Start Date">
                    <input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} className={inputCls} />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — Project Alignment */}
          {step === 4 && (
            <div className="space-y-6">
              <SectionHeading icon={Target} title="Team & Project Alignment" subtitle="Provide details about your team and why this specific partner is ideal." />
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Student Team Name">
                    <input type="text" value={form.teamName} onChange={(e) => set('teamName', e.target.value)}
                      placeholder="e.g. Smart Aqua Innovators" className={inputCls} />
                  </Field>
                  <Field label="Faculty Mentor">
                    <input type="text" value={form.facultyMentor} onChange={(e) => set('facultyMentor', e.target.value)}
                      placeholder="e.g. Dr. Priya Sharma" className={inputCls} />
                  </Field>
                  <Field label="Team Size">
                    <input type="number" min="1" max="20" value={form.teamSize} onChange={(e) => set('teamSize', e.target.value)}
                      placeholder="e.g. 5" className={inputCls} />
                  </Field>
                </div>
                <Field label="Prior Work & Achievements" hint="Describe relevant work your team has done that proves capability.">
                  <textarea rows={3} value={form.priorWork} onChange={(e) => set('priorWork', e.target.value)}
                    placeholder="e.g. Developed a working IoT soil moisture sensor, presented at IIT Kharagpur Tech Fest 2025..."
                    className={textareaCls} />
                </Field>
                <Field label="Government Scheme Alignment" hint="Which government programs or schemes does this partnership align with?">
                  <textarea rows={2} value={form.governmentAlignment} onChange={(e) => set('governmentAlignment', e.target.value)}
                    placeholder="e.g. Jal Jeevan Mission, PM KUSUM, Aspirational Districts Programme..."
                    className={textareaCls} />
                </Field>
                <Field label="Why This Industry Partner?" required hint="Explain why this specific company is uniquely suited for this collaboration.">
                  <textarea rows={4} value={form.whyThisPartner} onChange={(e) => set('whyThisPartner', e.target.value)}
                    placeholder="e.g. This company has domain expertise in water treatment technology, active CSR commitments in Jharkhand, and established lab infrastructure that directly supports our project goals..."
                    className={textareaCls} />
                  {errors.whyThisPartner && <p className="text-[11px] text-rose-600 font-bold">{errors.whyThisPartner}</p>}
                </Field>
              </div>
            </div>
          )}

          {/* STEP 5 — Review & Submit */}
          {step === 5 && (
            <div className="space-y-6">
              <SectionHeading icon={Send} title="Review & Submit Partnership Proposal" subtitle="Verify all details before dispatching the official partnership request." />

              {/* Full Summary */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Industry Partner', value: partner?.legalName || partner?.name || form.selectedIndustryName },
                  { label: 'Partnership Type', value: form.partnershipType },
                  { label: 'Proposal Title', value: form.proposalTitle, full: true },
                  { label: 'Domain', value: form.domain },
                  { label: 'Duration', value: form.duration },
                  { label: 'Estimated Budget', value: form.estimatedBudget },
                  { label: 'CSR Grant Requested', value: form.csrFundRequested || '—' },
                  { label: 'Start Date', value: form.startDate || '—' },
                  { label: 'Faculty Mentor', value: form.facultyMentor || '—' },
                  { label: 'Team', value: form.teamName ? `${form.teamName} (${form.teamSize || '?'} members)` : '—' }
                ].map(({ label, value, full }) => (
                  <div key={label} className={`${full ? 'col-span-2' : ''} bg-slate-50 border border-slate-200 p-3`}>
                    <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider block mb-0.5">{label}</span>
                    <span className="text-sm font-bold text-slate-900">{value || '—'}</span>
                  </div>
                ))}
              </div>

              {form.supportModes.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 p-3">
                  <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider block mb-1.5">Support Modes</span>
                  <div className="flex flex-wrap gap-1.5">
                    {form.supportModes.map((m) => (
                      <span key={m} className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded-none">{m}</span>
                    ))}
                  </div>
                </div>
              )}

              <Field label="Official Cover Note" hint="This will be sent along with the partnership proposal to the industry partner.">
                <textarea rows={4} value={form.coverNote} onChange={(e) => set('coverNote', e.target.value)}
                  placeholder="e.g. We, Ranchi University, hereby formally submit this partnership request under the Government of Jharkhand Innovation Portal. We look forward to a fruitful collaboration..."
                  className={textareaCls} />
              </Field>

              <Field label="Authorized By" required>
                <input type="text" value={form.authorizedBy} onChange={(e) => set('authorizedBy', e.target.value)} className={inputCls} />
              </Field>

              <div className={`border p-4 rounded-none flex items-start space-x-3 ${errors.declaration ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'}`}>
                <input
                  type="checkbox"
                  id="declaration"
                  checked={form.declaration}
                  onChange={(e) => set('declaration', e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-slate-900 cursor-pointer"
                />
                <label htmlFor="declaration" className="text-xs text-slate-700 font-medium cursor-pointer leading-relaxed">
                  I hereby declare that all information provided in this partnership proposal is accurate and complete.
                  I am authorized to submit this request on behalf of Ranchi University. I understand that any misrepresentation
                  may lead to rejection of the proposal and appropriate action under the university's academic code of conduct.
                </label>
              </div>
              {errors.declaration && <p className="text-[11px] text-rose-600 font-bold">{errors.declaration}</p>}
            </div>
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
            <button
              onClick={back}
              className="px-5 py-2 border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer rounded-none transition-colors flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
          {step < 5 ? (
            <button
              onClick={next}
              className="px-8 py-2 bg-slate-900 hover:bg-black text-white text-sm font-bold cursor-pointer rounded-none transition-colors flex items-center space-x-1.5"
            >
              <span>Continue</span>
              <ChevronDown className="w-3.5 h-3.5 rotate-[-90deg]" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-2 bg-slate-900 hover:bg-black text-white text-sm font-bold cursor-pointer rounded-none transition-colors flex items-center space-x-1.5 disabled:opacity-70"
            >
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
