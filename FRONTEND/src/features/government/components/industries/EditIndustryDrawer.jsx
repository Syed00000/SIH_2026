import React, { useState, useEffect } from 'react';
import { X, Save, Building2 } from 'lucide-react';
import { AddIndustryBasicFields } from './AddIndustryBasicFields.jsx';
import { AddIndustrySpocFields } from './AddIndustrySpocFields.jsx';
import { AddIndustryAddressFields } from './AddIndustryAddressFields.jsx';

export const EditIndustryDrawer = ({ isOpen, onClose, onSubmit, industry, isLoading = false }) => {
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
    mobileNumber: '',
    alternateContact: '',
    addressLine1: '',
    addressLine2: '',
    state: 'Jharkhand',
    district: 'Ranchi',
    city: 'Ranchi',
    pincode: '834001',
    supportModes: ['Funding']
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (industry) {
      setFormData({
        category: industry.category || 'Private Industry',
        legalName: industry.legalName || '',
        shortName: industry.shortName || '',
        registrationNumber: industry.registrationNumber || '',
        thematicDomain: industry.thematicDomain || 'Agriculture, Livelihoods',
        website: industry.website || '',
        spocName: industry.spocName || '',
        designation: industry.designation || '',
        officialEmail: industry.officialEmail || '',
        mobileNumber: industry.mobileNumber || '',
        alternateContact: industry.alternateContact || '',
        addressLine1: industry.address?.addressLine1 || '',
        addressLine2: industry.address?.addressLine2 || '',
        state: industry.address?.state || 'Jharkhand',
        district: industry.address?.district || 'Ranchi',
        city: industry.address?.city || 'Ranchi',
        pincode: industry.address?.pincode || '834001',
        supportModes: Array.isArray(industry.supportModes) ? industry.supportModes : ['Funding']
      });
      setErrors({});
    }
  }, [industry]);

  if (!isOpen || !industry) return null;

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleToggleSupportMode = (mode) => {
    setFormData((prev) => {
      const exists = prev.supportModes.includes(mode);
      return {
        ...prev,
        supportModes: exists
          ? prev.supportModes.filter((m) => m !== mode)
          : [...prev.supportModes, mode]
      };
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.category) errs.category = 'Category is required';
    if (!formData.legalName.trim()) errs.legalName = 'Legal name is required';
    if (!formData.thematicDomain) errs.thematicDomain = 'Thematic domain is required';
    if (!formData.spocName.trim()) errs.spocName = 'SPOC name is required';
    if (!formData.officialEmail.trim()) errs.officialEmail = 'Official email is required';
    if (!formData.mobileNumber.trim()) errs.mobileNumber = 'Mobile number is required';
    if (formData.supportModes.length === 0) errs.supportModes = 'Select at least one mode of support';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      category: formData.category,
      legalName: formData.legalName.trim(),
      shortName: formData.shortName.trim(),
      registrationNumber: formData.registrationNumber.trim(),
      thematicDomain: formData.thematicDomain,
      website: formData.website.trim(),
      spocName: formData.spocName.trim(),
      designation: formData.designation.trim(),
      officialEmail: formData.officialEmail.toLowerCase().trim(),
      mobileNumber: formData.mobileNumber.trim(),
      alternateContact: formData.alternateContact.trim(),
      address: {
        addressLine1: formData.addressLine1.trim(),
        addressLine2: formData.addressLine2.trim(),
        district: formData.district,
        city: formData.city.trim(),
        state: formData.state,
        pincode: formData.pincode.trim()
      },
      supportModes: formData.supportModes
    };

    onSubmit(payload);
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
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Edit Industry Record</h3>
                <p className="text-xs text-slate-500 truncate max-w-xs">{industry.legalName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
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
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-md shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditIndustryDrawer;
