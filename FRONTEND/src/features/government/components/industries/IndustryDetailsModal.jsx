import React, { useState } from 'react';
import {
  X,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  ShieldCheck,
  Calendar,
  Activity,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

export const IndustryDetailsModal = ({ isOpen, onClose, industry }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen || !industry) return null;

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const supportModes = Array.isArray(industry.supportModes)
    ? industry.supportModes
    : [industry.supportModes || 'Funding'];
  const isEnabled = industry.status === 'Active' && industry.accessStatus !== 'Disabled';

  const loginEmail = industry.credentials?.loginEmail || industry.officialEmail || 'partner@joharsetu.gov.in';
  const loginPassword = industry.credentials?.generatedPassword || 'Ind@Jharkhand2026!';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-base flex items-center justify-center shrink-0">
              {industry.legalName ? industry.legalName.charAt(0).toUpperCase() : 'I'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
                  {industry.legalName}
                </h3>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {industry.industryId}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {industry.category} &bull; {industry.thematicDomain}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span
              className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                isEnabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-red-50 text-red-600 border-red-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span>{isEnabled ? 'Active' : 'Disabled'}</span>
            </span>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors ml-2 cursor-pointer"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto text-xs">
          {/* Section 1: Overview Grid */}
          <div>
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>Organization Details</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200/80">
              <div>
                <span className="text-slate-400 font-medium block">Category</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{industry.category}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Short Name</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{industry.shortName || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">CIN / Reg No.</span>
                <span className="font-mono font-bold text-slate-800 mt-0.5 block">
                  {industry.registrationNumber || 'Not Specified'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Thematic Domain</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{industry.thematicDomain}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Verification Status</span>
                <span className="font-semibold text-emerald-700 mt-0.5 block">
                  {industry.verificationStatus || 'Verified'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Website</span>
                {industry.website ? (
                  <a
                    href={industry.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-blue-600 hover:underline mt-0.5 flex items-center space-x-1 truncate"
                  >
                    <Globe className="w-3 h-3 shrink-0" />
                    <span className="truncate">{industry.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                ) : (
                  <span className="text-slate-400 mt-0.5 block">—</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Mode of Support */}
          <div>
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Modes of Support & Collaboration</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {supportModes.map((mode) => (
                <span
                  key={mode}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full font-semibold text-[11px]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>{mode}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Section 3: SPOC & Contact Information */}
          <div>
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>Nodal SPOC & Official Contact</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200/80">
              <div>
                <span className="text-slate-400 font-medium block">SPOC Name</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{industry.spocName}</span>
                <span className="text-[11px] text-slate-500 font-medium block">{industry.designation}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Official Contact Email</span>
                <span className="font-mono font-bold text-slate-800 mt-0.5 block">{industry.officialEmail}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Mobile Number</span>
                <span className="font-mono font-semibold text-slate-800 mt-0.5 block">{industry.mobileNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Alternate Contact</span>
                <span className="text-slate-600 mt-0.5 block">{industry.alternateContact || '—'}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Registered Office Address */}
          <div>
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Office Address</span>
            </h4>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80 space-y-1">
              <p className="font-semibold text-slate-800">{industry.address?.addressLine1 || '—'}</p>
              {industry.address?.addressLine2 && <p className="text-slate-600">{industry.address.addressLine2}</p>}
              <p className="text-slate-600 font-medium">
                {industry.address?.city}, {industry.address?.district}, {industry.address?.state} -{' '}
                <span className="font-mono font-bold text-slate-800">{industry.address?.pincode}</span>
              </p>
            </div>
          </div>

          {/* Section 5: GOVERNMENT GENERATED CREDENTIALS & AUDIT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Login Credentials Box */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span>Portal Login Credentials</span>
              </h4>
              <div className="bg-blue-50/70 p-4 rounded-lg border border-blue-200/80 space-y-3">
                {/* Login Username / Email */}
                <div>
                  <span className="text-slate-500 text-[11px] font-semibold block mb-1">
                    Portal Login Email / Username
                  </span>
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded border border-blue-200">
                    <span className="font-mono font-bold text-slate-900 text-xs truncate mr-2">
                      {loginEmail}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(loginEmail, 'email')}
                      className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer shrink-0"
                      title="Copy Login Email"
                    >
                      {copiedField === 'email' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password with Show/Hide Toggle */}
                <div>
                  <span className="text-slate-500 text-[11px] font-semibold block mb-1">
                    Portal Access Password
                  </span>
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded border border-blue-200">
                    <span className="font-mono font-bold text-slate-900 text-xs tracking-wider">
                      {showPassword ? loginPassword : '••••••••••••'}
                    </span>
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                        title={showPassword ? 'Hide Password' : 'Show Password'}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(loginPassword, 'password')}
                        className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer"
                        title="Copy Password"
                      >
                        {copiedField === 'password' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-blue-100">
                  <span>Role: <strong className="text-blue-700">INDUSTRY</strong></span>
                  <span>Status: <strong className={isEnabled ? 'text-emerald-700' : 'text-red-600'}>{isEnabled ? 'Active' : 'Disabled'}</strong></span>
                </div>
              </div>
            </div>

            {/* Audit Activity Trail */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-slate-500" />
                <span>Audit Activity Trail</span>
              </h4>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 h-[175px] overflow-y-auto space-y-2">
                {industry.auditLogs && industry.auditLogs.length > 0 ? (
                  industry.auditLogs.map((log, idx) => (
                    <div key={idx} className="text-[11px] border-b border-slate-200/60 pb-1.5 last:border-b-0 last:pb-0">
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>{log.action}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[10px] mt-0.5">{log.details || log.performedBy}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-center py-4">No activity records logged.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="bg-white hover:bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded border border-slate-200 text-xs transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndustryDetailsModal;
