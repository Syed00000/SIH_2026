import React from 'react';
import { Banknote, Target } from 'lucide-react';
import { SectionHeading, Field, inputCls, selectCls, textareaCls, SUPPORT_MODES, DURATIONS } from './PartnershipFormCommon.jsx';

export const PartnershipFormStep2 = ({ step, form, set, errors, toggleSupport }) => {
  if (step === 3) {
    return (
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
              <input
                type="text"
                value={form.estimatedBudget}
                onChange={(e) => set('estimatedBudget', e.target.value)}
                placeholder="e.g. ₹ 5,00,000"
                className={inputCls}
              />
              {errors.estimatedBudget && <p className="text-[11px] text-rose-600 font-bold">{errors.estimatedBudget}</p>}
            </Field>
            <Field label="CSR Fund / Grant Requested" hint="Amount specifically requested from this industry partner.">
              <input
                type="text"
                value={form.csrFundRequested}
                onChange={(e) => set('csrFundRequested', e.target.value)}
                placeholder="e.g. ₹ 2,00,000"
                className={inputCls}
              />
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
    );
  }

  if (step === 4) {
    return (
      <div className="space-y-6">
        <SectionHeading icon={Target} title="Team & Project Alignment" subtitle="Provide details about your team and why this specific partner is ideal." />
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Student Team Name">
              <input type="text" value={form.teamName} onChange={(e) => set('teamName', e.target.value)} placeholder="e.g. Smart Aqua Innovators" className={inputCls} />
            </Field>
            <Field label="Faculty Mentor">
              <input type="text" value={form.facultyMentor} onChange={(e) => set('facultyMentor', e.target.value)} placeholder="e.g. Dr. Priya Sharma" className={inputCls} />
            </Field>
            <Field label="Team Size">
              <input type="number" min="1" max="20" value={form.teamSize} onChange={(e) => set('teamSize', e.target.value)} placeholder="e.g. 5" className={inputCls} />
            </Field>
          </div>
          <Field label="Prior Work & Achievements" hint="Describe relevant work your team has done that proves capability.">
            <textarea
              rows={3}
              value={form.priorWork}
              onChange={(e) => set('priorWork', e.target.value)}
              placeholder="e.g. Developed a working IoT soil moisture sensor, presented at IIT Kharagpur Tech Fest 2025..."
              className={textareaCls}
            />
          </Field>
          <Field label="Government Scheme Alignment" hint="Which government programs or schemes does this partnership align with?">
            <textarea
              rows={2}
              value={form.governmentAlignment}
              onChange={(e) => set('governmentAlignment', e.target.value)}
              placeholder="e.g. Jal Jeevan Mission, PM KUSUM, Aspirational Districts Programme..."
              className={textareaCls}
            />
          </Field>
          <Field label="Why This Industry Partner?" required hint="Explain why this specific company is uniquely suited for this collaboration.">
            <textarea
              rows={4}
              value={form.whyThisPartner}
              onChange={(e) => set('whyThisPartner', e.target.value)}
              placeholder="e.g. This company has domain expertise in water treatment technology, active CSR commitments in Jharkhand, and established lab infrastructure that directly supports our project goals..."
              className={textareaCls}
            />
            {errors.whyThisPartner && <p className="text-[11px] text-rose-600 font-bold">{errors.whyThisPartner}</p>}
          </Field>
        </div>
      </div>
    );
  }

  return null;
};

export default PartnershipFormStep2;
