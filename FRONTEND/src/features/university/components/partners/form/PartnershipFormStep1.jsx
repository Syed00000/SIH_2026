import React from 'react';
import { Mail, Phone, MapPin, Users, Tag, Building2, FileText } from 'lucide-react';
import { SectionHeading, Field, inputCls, selectCls, textareaCls, PARTNERSHIP_TYPES, DOMAINS } from './PartnershipFormCommon.jsx';

export const PartnershipFormStep1 = ({ step, form, set, errors, partner, industries }) => {
  if (step === 1) {
    return (
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
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-6">
        <SectionHeading icon={FileText} title="Partnership Proposal Details" subtitle="Describe the nature and intent of this partnership clearly." />
        <div className="space-y-4">
          <Field label="Proposal Title" required>
            <input
              type="text"
              value={form.proposalTitle}
              onChange={(e) => set('proposalTitle', e.target.value)}
              placeholder="e.g. R&D Collaboration for Smart Irrigation System — MoU Request"
              className={inputCls}
            />
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
              <input type="text" value={form.projectTitle} onChange={(e) => set('projectTitle', e.target.value)} placeholder="e.g. Water Quality Monitoring in Rural Areas" className={inputCls} />
            </Field>
            <Field label="Challenge / Problem ID" hint="Government challenge reference, if applicable">
              <input type="text" value={form.challengeId} onChange={(e) => set('challengeId', e.target.value)} placeholder="e.g. CHL-1024" className={inputCls} />
            </Field>
          </div>
          <Field label="Problem Statement" required hint="Describe the problem you aim to solve through this partnership.">
            <textarea
              rows={4}
              value={form.problemStatement}
              onChange={(e) => set('problemStatement', e.target.value)}
              placeholder="Provide a detailed description of the problem and how this industry partner can contribute to solving it..."
              className={textareaCls}
            />
            {errors.problemStatement && <p className="text-[11px] text-rose-600 font-bold">{errors.problemStatement}</p>}
          </Field>
          <Field label="Expected Outcomes / Deliverables" hint="What tangible results do you expect from this collaboration?">
            <textarea
              rows={3}
              value={form.expectedOutcomes}
              onChange={(e) => set('expectedOutcomes', e.target.value)}
              placeholder="e.g. Working prototype tested in 3 villages, 5 patents filed, 20 students trained..."
              className={textareaCls}
            />
          </Field>
        </div>
      </div>
    );
  }

  return null;
};

export default PartnershipFormStep1;
