import React from 'react';
import { ArrowLeft, Building2, Mail, Phone, MapPin, Globe, Edit2, Power, KeyRound, ShieldCheck, ChevronRight } from 'lucide-react';
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
    'PSU': 'text-sky-700 font-bold'
  };
  return map[category] || 'text-slate-700 font-semibold';
};

export const IndustryDetailPanel = ({ industry, onBack, onEdit, onToggleStatus, onResetPassword }) => {
  if (!industry) return null;

  const isEnabled = industry.status === 'Active' && industry.accessStatus !== 'Disabled';
  const supportModes = Array.isArray(industry.supportModes) ? industry.supportModes : [industry.supportModes || 'Funding'];
  const loginEmail = industry.credentials?.loginEmail || industry.officialEmail || 'partner@joharsetu.gov.in';
  const loginPassword = industry.credentials?.generatedPassword || 'Ind@Jharkhand2026!';

  return (
    <div className="space-y-4 select-none max-w-[1600px] mx-auto pb-10">
      {/* Top Header Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer shrink-0"
            title="Back to Industry Directory"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{industry.legalName}</h1>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  {industry.industryId}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                  isEnabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {isEnabled ? 'Active' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                <span className={getCategoryTextStyle(industry.category)}>{industry.category}</span> &bull; {industry.thematicDomain}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onResetPassword && onResetPassword(industry)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Password</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus && onToggleStatus(industry)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isEnabled ? 'Disable Access' : 'Enable Access'}</span>
          </button>
          <button
            type="button"
            onClick={() => onEdit && onEdit(industry)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Industry</span>
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left 2 Cols: Profile, SPOC, Location */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 text-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Organization & Registration</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 font-medium text-[10px] block">Category</span>
                <span className={`font-bold text-xs mt-0.5 block ${getCategoryTextStyle(industry.category)}`}>{industry.category}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium text-[10px] block">Short Name</span>
                <span className="font-bold text-slate-800 text-xs mt-0.5 block">{industry.shortName || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium text-[10px] block">CIN / Reg No.</span>
                <span className="font-mono font-bold text-slate-800 text-xs mt-0.5 block">{industry.registrationNumber || 'Pending'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium text-[10px] block">Thematic Domain</span>
                <span className="font-bold text-slate-800 text-xs mt-0.5 block">{industry.thematicDomain}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium text-[10px] block">Verification Status</span>
                <span className="font-bold text-emerald-600 text-xs mt-0.5 block">{industry.verificationStatus || 'Verified'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium text-[10px] block">Website</span>
                {industry.website ? (
                  <a href={industry.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold text-xs mt-0.5 block truncate">
                    {industry.website.replace(/^https?:\/\//, '')}
                  </a>
                ) : (<span className="text-slate-400 text-xs mt-0.5 block">—</span>)}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 text-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Corporate SPOC & Headquarters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Single Point of Contact</span>
                <p className="text-sm font-black text-slate-900">{industry.spocName || 'Not Assigned'}</p>
                <p className="text-xs text-slate-500">{industry.designation || 'Lead Representative'}</p>
                <div className="text-xs text-slate-600 mt-2 space-y-1">
                  <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-400" />{industry.officialEmail}</div>
                  <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" />{industry.mobileNumber}</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" /> Registered Address
                </span>
                <p className="font-bold text-slate-800 text-xs mt-1">
                  {[industry.address?.addressLine1, industry.address?.addressLine2].filter(Boolean).join(', ') || 'Address on file'}
                </p>
                <p className="text-slate-600 text-xs">
                  {[industry.address?.city, industry.address?.district, industry.address?.state].filter(Boolean).join(', ')}
                  {industry.address?.pincode && ` - ${industry.address?.pincode}`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 text-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Partnership & Support Modes</h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {supportModes.map((mode, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-bold text-xs">
                  {mode}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Credentials & Access */}
        <div className="space-y-4">
          <IndustryCredentialsSection
            industry={industry}
            loginEmail={loginEmail}
            loginPassword={loginPassword}
          />
        </div>
      </div>
    </div>
  );
};

export default IndustryDetailPanel;
