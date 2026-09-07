import React from 'react';
import { Send } from 'lucide-react';
import { SectionHeading, Field, inputCls, textareaCls } from './PartnershipFormCommon.jsx';

export const PartnershipFormStep3 = ({ form, set, errors, partner }) => {
  return (
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
        <textarea
          rows={4}
          value={form.coverNote}
          onChange={(e) => set('coverNote', e.target.value)}
          placeholder="e.g. We, Ranchi University, hereby formally submit this partnership request under the Government of Jharkhand Innovation Portal. We look forward to a fruitful collaboration..."
          className={textareaCls}
        />
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
  );
};

export default PartnershipFormStep3;
