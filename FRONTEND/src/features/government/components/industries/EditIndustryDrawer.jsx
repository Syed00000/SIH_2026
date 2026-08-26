import React, { useState, useEffect } from 'react';
import { X, Check, Save, ChevronDown, Info } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../data/mockGovernmentData.js';
import { INDUSTRY_CATEGORIES, THEMATIC_DOMAINS, SUPPORT_MODES_LIST } from './AddIndustryDrawer.jsx';

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

  const validate = () => {
    const errs = {};
    if (!formData.category) errs.category = 'Category is required';
    if (!formData.legalName.trim()) errs.legalName = 'Legal name is required';
    if (!formData.thematicDomain) errs.thematicDomain = 'Thematic domain is required';
    if (!formData.spocName.trim()) errs.spocName = 'SPOC name is required';
    if (!formData.designation.trim()) errs.designation = 'Designation is required';
    if (!formData.officialEmail.trim()) errs.officialEmail = 'Official email is required';
    if (!formData.mobileNumber.trim()) errs.mobileNumber = 'Mobile number is required';
    if (formData.supportModes.length === 0) errs.supportModes = 'Select at least one mode of support';
    setErrors(errs);
    return Object.keys(errs).length === 0;
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
        state: formData.state,
        district: formData.district,
        city: formData.city.trim(),
        pincode: formData.pincode.trim()
      },
      supportModes: formData.supportModes
    };

    onSubmit(industry._id, payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-2xs flex justify-end">
      {/* Slide-over Panel */}
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-50 border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {industry.industryId}
              </span>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Edit Organization</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 truncate max-w-sm">
              Updating details for {industry.legalName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-4 cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* 1. Category */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              Organization Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 pr-8 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                {INDUSTRY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. Legal Name */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              Organization Legal Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.legalName}
              onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
              className={`w-full bg-white border ${
                errors.legalName ? 'border-red-400' : 'border-slate-200'
              } rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
            {errors.legalName && <p className="text-[11px] text-red-600 font-medium">{errors.legalName}</p>}
          </div>

          {/* Row: Short Name & Reg Number */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Short Name</label>
              <input
                type="text"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Registration / CIN</label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 3. Thematic Domain */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              Thematic Domain <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.thematicDomain}
                onChange={(e) => setFormData({ ...formData, thematicDomain: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 pr-8 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                {THEMATIC_DOMAINS.map((dom) => (
                  <option key={dom} value={dom}>
                    {dom}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Website URL */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 4. Mode of Support */}
          <div className="space-y-2 pt-1">
            <label className="font-semibold text-slate-700 block">
              Mode of Support (Select all that apply) <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded border border-slate-200/80">
              {SUPPORT_MODES_LIST.map((mode) => {
                const isChecked = formData.supportModes.includes(mode);
                return (
                  <label
                    key={mode}
                    onClick={() => handleToggleSupportMode(mode)}
                    className="flex items-center space-x-2 cursor-pointer select-none py-1"
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                        isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-[11px] font-medium text-slate-700">{mode}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* SPOC Information */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
              Nodal SPOC & Official Contact
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">
                  SPOC Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.spocName}
                  onChange={(e) => setFormData({ ...formData, spocName: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">
                  Designation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">
                  Official Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.officialEmail}
                  onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
              Registered Office Address
            </span>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Address Line 1</label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">District</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded px-2 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {JHARKHAND_DISTRICTS_LIST.filter((d) => d !== 'All').map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded px-2 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Pincode</label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded px-2 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Action Save Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0d1b3e] hover:bg-[#1a2f5e] disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 text-xs transition-colors cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Saving Changes...' : 'Save Organization Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIndustryDrawer;
