import React from 'react';
import {
  X,
  Building,
  Mail,
  Globe,
  CheckCircle2
} from 'lucide-react';
import { IndustryCredentialsSection } from './IndustryCredentialsSection.jsx';

const getCategoryTextStyle = (category) => {
  const map = {
    'Private Industry': 'text-blue-700 font-bold',
    'Govt Dept': 'text-purple-700 font-bold',
    'Government Department': 'text-purple-700 font-bold',
    'MSME': 'text-amber-700 font-bold',
    'Research Lab': 'text-teal-700 font-bold',
    'Startup': 'text-emerald-700 font-bold',
    'CSR': 'text-violet-700 font-bold',
    'PSU': 'text-sky-700 font-bold',
    'Industry Association': 'text-indigo-700 font-bold'
  };
  return map[category] || 'text-slate-700 font-semibold';
};

export const IndustryDetailsModal = ({ isOpen, onClose, industry }) => {
  if (!isOpen || !industry) return null;

  const supportModes = Array.isArray(industry.supportModes)
    ? industry.supportModes
    : [industry.supportModes || 'Funding'];
  const isEnabled = industry.status === 'Active' && industry.accessStatus !== 'Disabled';

  const loginEmail = industry.credentials?.loginEmail || industry.officialEmail || 'partner@joharsetu.gov.in';
  const loginPassword = industry.credentials?.generatedPassword || 'Ind@Jharkhand2026!';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-2xl w-full overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 shrink-0">
          <div className="flex items-center space-x-2.5 min-w-0">
            <Building className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">
                  {industry.legalName}
                </h3>
                <span className="font-mono text-[11px] font-bold text-slate-600">
                  ({industry.industryId})
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                <span className={getCategoryTextStyle(industry.category)}>{industry.category}</span> &bull; {industry.thematicDomain}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <span
              className={`inline-flex items-center space-x-1.5 text-[11px] font-semibold ${
                isEnabled ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span>{isEnabled ? 'Active' : 'Disabled'}</span>
            </span>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Section 1: Overview Details */}
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 pb-1 border-b border-slate-100">
              <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-[11px] font-bold text-slate-800">Organization Details</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50/70 p-3 rounded-md border border-slate-200/80">
              <div>
                <span className="text-slate-400 font-medium text-[10px] block">Category</span>
                <span className={`font-bold text-xs mt-0.5 block ${getCategoryTextStyle(industry.category)}`}>
                  {industry.category}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium text-[10px] block">Short Name</span>
                <span className="font-bold text-slate-800 text-xs mt-0.5 block">{industry.shortName || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium text-[10px] block">CIN / Reg No.</span>
                <span className="font-mono font-bold text-slate-800 text-xs mt-0.5 block">
                  {industry.registrationNumber || 'Not Specified'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium text-[10px] block">Thematic Domain</span>
                <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{industry.thematicDomain}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium text-[10px] block">Verification Status</span>
                <span className="font-semibold text-emerald-600 text-xs mt-0.5 block">
                  {industry.verificationStatus || 'Verified'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium text-[10px] block">Website</span>
                {industry.website ? (
                  <a
                    href={industry.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-slate-900 hover:underline mt-0.5 flex items-center space-x-1 truncate text-xs"
                  >
                    <Globe className="w-3 h-3 shrink-0" />
                    <span className="truncate">{industry.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                ) : (
                  <span className="text-slate-400 text-xs mt-0.5 block">—</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Mode of Support */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-1.5 pb-1 border-b border-slate-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-[11px] font-bold text-slate-800">Modes of Support & Collaboration</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {supportModes.map((mode) => (
                <span
                  key={mode}
                  className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-slate-50 text-slate-700 border border-slate-200 rounded text-[11px] font-semibold"
                >
                  <span>&bull;</span>
                  <span>{mode}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Section 3: SPOC & Contact Information */}
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 pb-1 border-b border-slate-100">
              <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-[11px] font-bold text-slate-800">Nodal SPOC & Official Contact</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50/70 p-3 rounded-md border border-slate-200/80">
              <div>
                <span className="text-slate-400 font-medium text-[10px] block">SPOC Name</span>
                <span className="font-bold text-slate-900 text-xs mt-0.5 block">{industry.spocName}</span>
                <span className="text-[10.5px] text-slate-500 font-medium block">{industry.designation}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium text-[10px] block">Official Email</span>
                <span className="font-mono font-bold text-slate-800 text-xs mt-0.5 block">{industry.officialEmail}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium text-[10px] block">Mobile Number</span>
                <span className="font-mono font-semibold text-slate-800 text-xs mt-0.5 block">{industry.mobileNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium text-[10px] block">Office Address</span>
                <span className="text-slate-700 text-xs mt-0.5 block">
                  {industry.address?.city || '—'}, {industry.address?.state || 'Jharkhand'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Login Credentials */}
          <IndustryCredentialsSection
            loginEmail={loginEmail}
            loginPassword={loginPassword}
          />
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-slate-400 font-mono">
            ID: {industry.industryId}
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer rounded shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndustryDetailsModal;
