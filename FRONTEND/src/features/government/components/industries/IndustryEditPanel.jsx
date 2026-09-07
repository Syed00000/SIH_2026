import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Building2 } from 'lucide-react';
import { AddIndustryBasicFields } from './AddIndustryBasicFields.jsx';
import { AddIndustrySpocFields } from './AddIndustrySpocFields.jsx';
import { AddIndustryAddressFields } from './AddIndustryAddressFields.jsx';

export const IndustryEditPanel = ({ industry, onBack, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    category: '', legalName: '', shortName: '', registrationNumber: '', thematicDomain: '',
    website: '', spocName: '', designation: '', officialEmail: '', mobileNumber: '',
    alternateContact: '', addressLine1: '', addressLine2: '', state: 'Jharkhand',
    district: 'Ranchi', city: 'Ranchi', pincode: '834001', supportModes: ['Funding']
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

  if (!industry) return null;

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleToggleSupportMode = (mode) => {
    setFormData((prev) => {
      const exists = prev.supportModes.includes(mode);
      return {
        ...prev,
        supportModes: exists ? prev.supportModes.filter((m) => m !== mode) : [...prev.supportModes, mode]
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
      officialEmail: formData.officialEmail.trim().toLowerCase(),
      mobileNumber: formData.mobileNumber.trim(),
      alternateContact: formData.alternateContact.trim(),
      address: {
        addressLine1: formData.addressLine1.trim(),
        addressLine2: formData.addressLine2.trim(),
        state: formData.state,
        district: formData.district,
        city: formData.city.trim(),
        pincode: formData.pincode.trim()
      },
      supportModes: formData.supportModes
    };
    onSubmit(payload);
  };

  return (
    <div className="space-y-4 select-none max-w-[1200px] mx-auto pb-10">
      {/* Top Header Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Back to Industry Directory"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Edit Industry: {industry.legalName}
            </h1>
            <p className="text-xs text-slate-500 font-medium">Update company profile, SPOC details, address, and CSR support</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="industry-edit-form"
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Form Card */}
      <form id="industry-edit-form" onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6 text-xs">
        <AddIndustryBasicFields formData={formData} onChange={handleFieldChange} errors={errors} />

        <div className="pt-2 border-t border-slate-100">
          <AddIndustrySpocFields formData={formData} onChange={handleFieldChange} errors={errors} />
        </div>

        <div className="pt-2 border-t border-slate-100">
          <AddIndustryAddressFields formData={formData} onChange={handleFieldChange} errors={errors} />
        </div>

        {/* Support Modes */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <label className="font-bold text-slate-700 block">Modes of Partnership / Support *</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {['Funding', 'CSR Grant', 'Mentorship', 'Internships', 'Incubation', 'R&D Facilities'].map((mode) => {
              const checked = formData.supportModes.includes(mode);
              return (
                <label
                  key={mode}
                  className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 transition-colors ${
                    checked ? 'bg-blue-50/70 border-blue-300 text-blue-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleToggleSupportMode(mode)}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span>{mode}</span>
                </label>
              );
            })}
          </div>
          {errors.supportModes && <p className="text-[11px] text-red-500 mt-1">{errors.supportModes}</p>}
        </div>
      </form>
    </div>
  );
};

export default IndustryEditPanel;
