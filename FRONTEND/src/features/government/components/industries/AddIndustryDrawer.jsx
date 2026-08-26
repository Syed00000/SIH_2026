import React, { useState, useEffect } from 'react';
import { X, Check, Link2, Info, ChevronDown, Key, RefreshCw, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../data/mockGovernmentData.js';

export const INDUSTRY_CATEGORIES = [
  'Private Industry',
  'MSME',
  'Govt Dept',
  'Research Lab',
  'Startup',
  'CSR',
  'PSU',
  'Industry Association',
  'Other'
];

export const THEMATIC_DOMAINS = [
  'Agriculture, Livelihoods',
  'Agriculture, Agri-tech',
  'AI / ML, Education',
  'AI / ML, IoT',
  'Healthcare, MedTech',
  'Healthcare, Mental Health',
  'Water Management',
  'Rural Livelihoods',
  'Education, Skill Dev.',
  'Innovation Ecosystem',
  'Clean Energy, Environment',
  'Infrastructure, Smart Cities',
  'Mining, Heavy Industry'
];

export const SUPPORT_MODES_LIST = [
  'Funding',
  'Mentorship',
  'Prototyping',
  'Tech Transfer',
  'Research',
  'Incubation',
  'CSR Support',
  'Skill Development'
];

const generateRandomPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  let pwd = 'Ind@';
  for (let i = 0; i < 8; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
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

  const [showPassword, setShowPassword] = useState(false);
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

  const handleAutoGenerateLoginEmail = () => {
    const slug = (formData.shortName || formData.legalName || 'partner')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 12);
    const generatedEmail = `${slug || 'industry'}@partner.joharsetu.gov.in`;
    setFormData((prev) => ({
      ...prev,
      loginEmail: generatedEmail
    }));
  };

  const handleRegeneratePassword = () => {
    setFormData((prev) => ({
      ...prev,
      initialPassword: generateRandomPassword()
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.category) errs.category = 'Organization category is required';
    if (!formData.legalName.trim()) errs.legalName = 'Organization legal name is required';
    if (!formData.thematicDomain) errs.thematicDomain = 'Thematic domain is required';
    if (!formData.spocName.trim()) errs.spocName = 'Nodal SPOC name is required';
    if (!formData.designation.trim()) errs.designation = 'SPOC designation is required';
    if (!formData.officialEmail.trim()) {
      errs.officialEmail = 'Official contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.officialEmail)) {
      errs.officialEmail = 'Please enter a valid email address';
    }
    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = 'Mobile number is required';
    } else if (!/^\+?[0-9]{10,13}$/.test(formData.mobileNumber.replace(/\s/g, ''))) {
      errs.mobileNumber = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.addressLine1.trim()) errs.addressLine1 = 'Address line is required';
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.trim())) {
      errs.pincode = 'Enter a valid 6-digit pincode';
    }
    if (formData.supportModes.length === 0) {
      errs.supportModes = 'Select at least one mode of support';
    }
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
      loginEmail: (formData.loginEmail && formData.loginEmail.trim() ? formData.loginEmail : formData.officialEmail).toLowerCase().trim(),
      initialPassword: formData.initialPassword || generateRandomPassword(),
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-2xs flex justify-end">
      {/* Slide-over Panel */}
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-50 border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Onboard Industry / Partner
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Register a new industry or partner organization and generate their official portal login credentials.
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
          {/* 1. Organization Category */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              Organization Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full bg-white border ${
                  errors.category ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'
                } rounded px-3 py-2 pr-8 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 appearance-none cursor-pointer`}
              >
                <option value="">Select Category</option>
                {INDUSTRY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.category && <p className="text-[11px] text-red-600 font-medium">{errors.category}</p>}
          </div>

          {/* 2. Organization Legal Name */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              Organization Legal Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter legal name of organization"
              value={formData.legalName}
              onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
              className={`w-full bg-white border ${
                errors.legalName ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'
              } rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1`}
            />
            {errors.legalName && <p className="text-[11px] text-red-600 font-medium">{errors.legalName}</p>}
          </div>

          {/* Row: Short Name & Reg Number */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Organization Short Name</label>
              <input
                type="text"
                placeholder="e.g. TSF, RSTECH"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">CIN / Registration No.</label>
              <input
                type="text"
                placeholder="e.g. U12345JH2024"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 3. Thematic / Societal Domain */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              Thematic / Societal Domain <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.thematicDomain}
                onChange={(e) => setFormData({ ...formData, thematicDomain: e.target.value })}
                className={`w-full bg-white border ${
                  errors.thematicDomain ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'
                } rounded px-3 py-2 pr-8 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 appearance-none cursor-pointer`}
              >
                <option value="">Select Domain</option>
                {THEMATIC_DOMAINS.map((dom) => (
                  <option key={dom} value={dom}>
                    {dom}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.thematicDomain && <p className="text-[11px] text-red-600 font-medium">{errors.thematicDomain}</p>}
          </div>

          {/* Website URL */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Official Website</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 4. Mode of Support (Checkboxes in 2 Columns) */}
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
            {errors.supportModes && <p className="text-[11px] text-red-600 font-medium">{errors.supportModes}</p>}
          </div>

          {/* 5. GOVERNMENT GENERATED CREDENTIALS SECTION */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between border-b border-blue-200/70 pb-2">
              <span className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Government-Generated Login Credentials</span>
              </span>
            </div>

            {/* Generated Login Email */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-700 block text-[11px]">
                  Portal Login Username / Email
                </label>
                <button
                  type="button"
                  onClick={handleAutoGenerateLoginEmail}
                  className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Generate from Org
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. tsf@partner.joharsetu.gov.in"
                value={formData.loginEmail}
                onChange={(e) => setFormData({ ...formData, loginEmail: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-[10px] text-slate-500">
                Leave blank to automatically use the Official SPOC email below.
              </p>
            </div>

            {/* Generated Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-700 block text-[11px]">
                  Generated Portal Password <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleRegeneratePassword}
                  className="text-[10px] text-blue-600 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Generate New</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.initialPassword}
                  onChange={(e) => setFormData({ ...formData, initialPassword: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded px-3 py-2 pr-9 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Section: SPOC & Contact Information */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
              Nodal SPOC & Official Contact
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">
                  Nodal SPOC Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Full name of SPOC"
                  value={formData.spocName}
                  onChange={(e) => setFormData({ ...formData, spocName: e.target.value })}
                  className={`w-full bg-white border ${
                    errors.spocName ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'
                  } rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1`}
                />
                {errors.spocName && <p className="text-[11px] text-red-600 font-medium">{errors.spocName}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">
                  Designation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chief of CSR"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className={`w-full bg-white border ${
                    errors.designation ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'
                  } rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1`}
                />
                {errors.designation && <p className="text-[11px] text-red-600 font-medium">{errors.designation}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">
                  Official SPOC Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="spoc@company.org"
                  value={formData.officialEmail}
                  onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                  className={`w-full bg-white border ${
                    errors.officialEmail ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'
                  } rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1`}
                />
                {errors.officialEmail && <p className="text-[11px] text-red-600 font-medium">{errors.officialEmail}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="9835012345"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  className={`w-full bg-white border ${
                    errors.mobileNumber ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'
                  } rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1`}
                />
                {errors.mobileNumber && <p className="text-[11px] text-red-600 font-medium">{errors.mobileNumber}</p>}
              </div>
            </div>
          </div>

          {/* Section: Address */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
              Registered Office Address
            </span>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Street address, Industrial estate or building"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                className={`w-full bg-white border ${
                  errors.addressLine1 ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'
                } rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1`}
              />
              {errors.addressLine1 && <p className="text-[11px] text-red-600 font-medium">{errors.addressLine1}</p>}
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
                <label className="font-semibold text-slate-700 block">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className={`w-full bg-white border ${
                    errors.pincode ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'
                  } rounded px-2 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1`}
                />
              </div>
            </div>
          </div>

          {/* Info Notice Box matching Reference */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg flex items-start space-x-2 text-slate-600">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-relaxed">
              The partner will be notified by email when registered before verification and linking to HEIs.
            </span>
          </div>

          {/* Action Submit Button matching Reference */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 text-xs transition-colors cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Link2 className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Registering Industry Partner...' : 'Save & Link Partner to HEIs'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIndustryDrawer;
