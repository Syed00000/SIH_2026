import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Loader2 } from 'lucide-react';
import { AddIndustryBasicFields } from './AddIndustryBasicFields.jsx';
import { AddIndustrySpocFields } from './AddIndustrySpocFields.jsx';
import { AddIndustryAddressFields } from './AddIndustryAddressFields.jsx';
import { AddIndustryCredentialsCard } from './AddIndustryCredentialsCard.jsx';

const generateRandomPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  const parts = [['I', 'n', 'd', '@'].join('')];
  for (let i = 0; i < 8; i++) {
    parts.push(chars.charAt(Math.floor(Math.random() * chars.length)));
  }
  return parts.join('');
};

export const AddIndustryDrawer = ({ isOpen, onClose, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    category: '',
    legalName: '',
    shortName: '',
    registrationNumber: '',
    thematicDomain: '',
    website: '',
    spocName: '',
    designation: '',
    officialEmail: '',
    loginEmail: '',
    initialPassword: generateRandomPassword(),
    mobileNumber: '',
    alternateContact: '',
    addressLine1: '',
    addressLine2: '',
    state: 'Jharkhand',
    district: 'Ranchi',
    city: 'Ranchi',
    pincode: '834001',
    supportModes: ['Funding', 'Mentorship']
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        initialPassword: generateRandomPassword()
      }));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleToggleSupportMode = (mode) => {
    setFormData((prev) => {
      const current = prev.supportModes || [];
      const updated = current.includes(mode)
        ? current.filter((m) => m !== mode)
        : [...current, mode];
      return { ...prev, supportModes: updated };
    });
    if (errors.supportModes) {
      setErrors((prev) => ({ ...prev, supportModes: null }));
    }
  };

  const handleAutoGenerateLoginEmail = () => {
    const fallback = (formData.officialEmail || '').trim().toLowerCase();
    const slug = (formData.shortName || formData.legalName || 'partner')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 12);
    const generated = fallback || `${slug || 'industry'}@partner.joharsetu.gov.in`;
    setFormData((prev) => ({
      ...prev,
      loginEmail: generated
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.category) errs.category = 'Please select an industry category';
    if (!formData.legalName?.trim()) errs.legalName = 'Legal entity name is required';
    if (!formData.registrationNumber?.trim()) errs.registrationNumber = 'Registration/CIN number is required';
    if (!formData.thematicDomain) errs.thematicDomain = 'Thematic domain is required';
    if (!formData.spocName?.trim()) errs.spocName = 'SPOC name is required';
    if (!formData.officialEmail?.trim()) errs.officialEmail = 'Official email is required';
    if (!formData.mobileNumber?.trim()) errs.mobileNumber = 'Mobile number is required';
    if (!formData.addressLine1?.trim()) errs.addressLine1 = 'Address line 1 is required';
    if (!formData.pincode?.trim()) errs.pincode = 'Pincode is required';
    if (!formData.supportModes || formData.supportModes.length === 0) {
      errs.supportModes = 'Select at least one support mode';
    }
    if (!formData.loginEmail?.trim()) errs.loginEmail = 'Login email is required for credentials';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Add Industry Partner</h3>
                <p className="text-xs text-slate-500">Register new enterprise partner & auto-generate portal credentials</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            <AddIndustryBasicFields
              formData={formData}
              onChange={handleFieldChange}
              errors={errors}
            />

            <AddIndustrySpocFields
              formData={formData}
              onChange={handleFieldChange}
              errors={errors}
            />

            <AddIndustryAddressFields
              formData={formData}
              onChange={handleFieldChange}
              onToggleSupportMode={handleToggleSupportMode}
              errors={errors}
            />

            <AddIndustryCredentialsCard
              formData={formData}
              onChange={handleFieldChange}
              onAutoGenerateEmail={handleAutoGenerateLoginEmail}
              errors={errors}
            />
          </form>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating Partner...</span>
                </>
              ) : (
                <span>Create & Generate Credentials</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddIndustryDrawer;
