import React from 'react';
import { Building2, FileText, Banknote, Target, Send } from 'lucide-react';

export const SUPPORT_MODES = ['Funding', 'Lab Access', 'Equipment', 'Mentorship', 'Data Sharing', 'Pilot Support', 'Technical Support', 'Field Testing'];
export const PARTNERSHIP_TYPES = ['Research Collaboration', 'CSR Funding', 'MoU / Agreement', 'Internship Program', 'Joint Project', 'Lab Partnership', 'Skill Development', 'Technology Transfer'];
export const DURATIONS = ['3 Months', '6 Months', '1 Year', '2 Years', '3 Years', 'Ongoing'];
export const DOMAINS = ['Water & Sanitation', 'Agriculture & Food', 'Healthcare & Nutrition', 'Rural Infrastructure', 'Renewable Energy', 'Education', 'Environment', 'Digital Innovation'];

export const STEPS = [
  { id: 1, label: 'Industry Partner', icon: Building2 },
  { id: 2, label: 'Proposal Details', icon: FileText },
  { id: 3, label: 'Support & Budget', icon: Banknote },
  { id: 4, label: 'Project Alignment', icon: Target },
  { id: 5, label: 'Review & Submit', icon: Send }
];

export const SectionHeading = ({ icon: Icon, title, subtitle }) => (
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

export const Field = ({ label, required, children, hint }) => (
  <div className="space-y-1">
    <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
      {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-[10.5px] text-slate-400 font-medium">{hint}</p>}
  </div>
);

export const inputCls = "w-full px-3 py-2 bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-900 rounded-none placeholder:text-slate-400 font-medium";
export const selectCls = "w-full px-3 py-2 bg-white border border-slate-200 text-sm text-slate-800 font-medium focus:outline-none focus:border-slate-900 rounded-none cursor-pointer";
export const textareaCls = "w-full px-3 py-2.5 bg-white border border-slate-200 text-sm text-slate-900 resize-none focus:outline-none focus:border-slate-900 rounded-none placeholder:text-slate-400 font-medium";
