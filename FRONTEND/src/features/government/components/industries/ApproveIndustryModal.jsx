import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { ApproveIndustryDetailsSection } from './ApproveIndustryDetailsSection.jsx';
import { ApproveIndustryCredentialsForm } from './ApproveIndustryCredentialsForm.jsx';

const generateSecurePassword = (length = 12) => {
  const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijkmnopqrstuvwxyz';
  const numberChars = '23456789';
  const specialChars = '!@#$%';
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;

  const getRandomChar = (charset) => {
    if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
      const arr = new Uint32Array(1);
      window.crypto.getRandomValues(arr);
      return charset.charAt(arr[0] % charset.length);
    }
    return charset.charAt(Math.floor(Math.random() * charset.length));
  };

  const characters = [
    getRandomChar(uppercaseChars),
    getRandomChar(lowercaseChars),
    getRandomChar(numberChars),
    getRandomChar(specialChars)
  ];

  for (let i = 4; i < length; i++) {
    characters.push(getRandomChar(allChars));
  }

  for (let i = characters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [characters[i], characters[j]] = [characters[j], characters[i]];
  }

  return characters.join('');
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

  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (industry && isOpen) {
      setLoginEmail(industry.officialEmail || '');
      setPassword(generateSecurePassword());
      setRejectMode(false);
      setRejectReason('');
      setError('');
    }
  }, [industry, isOpen]);

  if (!isOpen || !industry) return null;

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
              {industry.legalName ? industry.legalName.charAt(0).toUpperCase() : 'I'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">
                  {industry.legalName}
                </h3>
                <span className="font-mono text-[10.5px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                  {industry.industryId}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {industry.category} &bull; {industry.thematicDomain}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-600">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Pending Review</span>
            </span>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors ml-2 cursor-pointer"
              title="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-center space-x-2 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Details Section */}
          <ApproveIndustryDetailsSection industry={industry} />

          {!rejectMode ? (
            <ApproveIndustryCredentialsForm
              loginEmail={loginEmail}
              onLoginEmailChange={setLoginEmail}
              password={password}
              onPasswordChange={setPassword}
              onRegeneratePassword={() => setPassword(generateSecurePassword())}
              officialEmail={industry.officialEmail}
            />
          ) : (
            /* Rejection Box */
            <div className="p-4 bg-red-50 border border-red-200 rounded-md space-y-2.5">
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
                  className="w-full p-2.5 border border-red-300 rounded-md text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-400 h-20"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {!rejectMode ? (
            <>
              <button
                type="button"
                onClick={() => setRejectMode(true)}
                className="px-3 py-1.5 border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                Reject Application
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApproveSubmit}
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-md flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Approving...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Send Credentials</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setRejectMode(false)}
                className="px-3 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-md hover:bg-slate-100"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleRejectSubmit}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-md cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {isLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApproveIndustryModal;
