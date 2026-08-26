import React, { useState, useEffect } from 'react';
import {
  X,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../../../shared/components/ui/button.jsx';
import { Input } from '../../../../shared/components/ui/input.jsx';

const generateSecurePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  let pwd = 'Ind@';
  for (let i = 0; i < 8; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
};

export const ApproveIndustryModal = ({
  isOpen,
  onClose,
  industry,
  onApprove,
  onReject,
  isLoading = false
}) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (industry && isOpen) {
      setLoginEmail(industry.officialEmail || '');
      setPassword(generateSecurePassword());
      setShowPassword(false);
      setCopied(false);
      setRejectMode(false);
      setRejectReason('');
      setError('');
    }
  }, [industry, isOpen]);

  if (!isOpen || !industry) return null;

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const supportModes = Array.isArray(industry.supportModes)
    ? industry.supportModes
    : [industry.supportModes || 'Funding'];

  const handleApproveSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setError('Please enter a valid login email address.');
      return;
    }
    if (!password.trim() || password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      await onApprove(industry._id, {
        loginEmail: loginEmail.trim().toLowerCase(),
        initialPassword: password.trim()
      });
    } catch (err) {
      setError(err.message || 'Failed to approve application.');
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onReject(industry._id, {
        reason: rejectReason.trim() || 'Application criteria not met'
      });
    } catch (err) {
      setError(err.message || 'Failed to reject application.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
      {/* Centered Modal Panel matching IndustryDetailsModal */}
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
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-amber-50 text-amber-800 border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Pending Review</span>
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
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
          
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center space-x-2 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Organization Details */}
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
                <span className="text-slate-400 font-medium block">CIN / Reg Number</span>
                <span className="font-mono font-bold text-slate-800 mt-0.5 block">{industry.registrationNumber || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Thematic Domain</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{industry.thematicDomain}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Location</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{industry.address?.city || industry.address?.district}, Jharkhand</span>
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

          {/* Section 2: Modes of Support */}
          <div>
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Modes of Support Offered</span>
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

          {/* Section 3: Contact Person Details */}
          <div>
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>Contact Person Details</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200/80">
              <div>
                <span className="text-slate-400 font-medium block">Contact Person Name</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{industry.spocName}</span>
                <span className="text-[11px] text-slate-500 font-medium block">{industry.designation}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Official Email</span>
                <span className="font-mono font-bold text-slate-800 mt-0.5 block">{industry.officialEmail}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Mobile Number</span>
                <span className="font-mono font-semibold text-slate-800 mt-0.5 block">{industry.mobileNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Alternate Phone</span>
                <span className="text-slate-600 mt-0.5 block">{industry.alternateContact || '—'}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Address */}
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

          {!rejectMode ? (
            /* Section 5: Portal Credentials */
            <div>
              <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span>Assign Portal Login Credentials</span>
              </h4>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80 space-y-3.5">
                {/* Login Email */}
                <div>
                  <label className="text-slate-700 font-semibold text-xs block mb-1">
                    Portal Login Email / Username <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="h-9 text-xs bg-white border-slate-300 text-slate-900 font-medium"
                    required
                  />
                </div>

                {/* Password Generator */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-700 font-semibold text-xs">
                      Temporary Password <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setPassword(generateSecurePassword())}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Generate New Password</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-9 text-xs font-mono font-bold pr-10 bg-white border-slate-300 text-slate-900"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCopyPassword}
                      className="h-9 px-3 border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shrink-0"
                      title="Copy Password"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-[11.5px] text-blue-900 flex items-start space-x-2">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Upon clicking approve, an official email with these login credentials will be automatically sent to <strong>{industry.officialEmail}</strong>.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Rejection Box */
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
              <h4 className="font-bold text-red-900 text-xs flex items-center space-x-1.5">
                <XCircle className="w-4 h-4 text-red-600" />
                <span>Reject Application</span>
              </h4>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-red-900 block">Reason for Rejection</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter rejection remarks..."
                  className="w-full p-2.5 border border-red-300 rounded text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-400 h-20"
                />
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {!rejectMode ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRejectMode(true)}
                className="border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold"
              >
                Reject Application
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleApproveSubmit}
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-md flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  {isLoading ? (
                    <span>Approving...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Send Email</span>
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRejectMode(false)}
                className="border-slate-300 text-slate-700 text-xs font-semibold"
              >
                Back
              </Button>

              <Button
                type="button"
                onClick={handleRejectSubmit}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-md cursor-pointer"
              >
                {isLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </Button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default ApproveIndustryModal;
