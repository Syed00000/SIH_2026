import React, { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import {
  User,
  Building2,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Globe,
  MapPin,
  Award,
  FileText,
  AlertCircle
} from 'lucide-react';

const JHARKHAND_DISTRICTS = {
  Ranchi: ['Kanke', 'Ratu', 'Namkum', 'Ormanjhi', 'Bero', 'Ranchi Municipal Corporation'],
  Dhanbad: ['Dhanbad Sadar', 'Jharia', 'Baghmara', 'Nirsa', 'Dhanbad Municipal Corporation'],
  EastSinghbhum: ['Jamshedpur', 'Ghatshila', 'Potka', 'Patamda', 'Mango Municipal Corporation'],
  Hazaribagh: ['Hazaribagh Sadar', 'Barhi', 'Chorparan', 'Ichak', 'Hazaribagh Municipal Corporation'],
  Bokaro: ['Chas', 'Bermo', 'Gomia', 'Chandan Kiyari', 'Chas Municipal Corporation'],
  Deoghar: ['Deoghar Sadar', 'Madhupur', 'Sarath', 'Deoghar Municipal Corporation']
};

const ACADEMIC_DOMAINS = [
  'WATER',
  'AGRICULTURE',
  'CIVIL',
  'HEALTHCARE',
  'AI_IT',
  'ENVIRONMENT',
  'ENERGY',
  'EDUCATION',
  'RURAL_DEVELOPMENT',
  'ACCESSIBILITY',
  'OTHER'
];

const SUPPORT_SECTORS = [
  'WATER',
  'AGRICULTURE',
  'HEALTHCARE',
  'AI_IT',
  'EDUCATION',
  'ENVIRONMENT',
  'ENERGY',
  'INFRASTRUCTURE',
  'RURAL_DEVELOPMENT',
  'ACCESSIBILITY',
  'OTHER'
];

export const RegisterForm = ({ onNavigate }) => {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CITIZEN',
    profile: {
      district: 'Ranchi',
      blockOrULB: 'Kanke',
      panchayatOrWard: '',
      preferredLanguage: 'HINDI',
      // University fields
      institutionName: '',
      aisheCode: '',
      registrationNumber: '',
      institutionType: 'STATE_UNIVERSITY',
      nodalOfficerDesignation: '',
      academicFocusDomains: [],
      // Industry fields
      organizationName: '',
      entityType: 'CORPORATE',
      cin: '',
      gstin: '',
      ngoDarpanId: '',
      primaryContactDesignation: '',
      supportSectors: []
    },
    termsAccepted: false
  });

  const getPasswordStrength = (pass) => {
    if (!pass) return { label: 'None', width: '0%', color: 'bg-slate-200' };
    if (pass.length < 6) return { label: 'Weak', width: '33%', color: 'bg-red-500' };
    if (pass.length < 10 || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) {
      return { label: 'Medium', width: '66%', color: 'bg-amber-500' };
    }
    return { label: 'Strong', width: '100%', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleRoleSelect = (roleName) => {
    setFormData((prev) => ({
      ...prev,
      role: roleName,
      profile: {
        district: 'Ranchi',
        blockOrULB: 'Kanke',
        panchayatOrWard: '',
        preferredLanguage: 'HINDI',
        institutionName: '',
        aisheCode: '',
        registrationNumber: '',
        institutionType: 'STATE_UNIVERSITY',
        nodalOfficerDesignation: '',
        academicFocusDomains: [],
        organizationName: '',
        entityType: 'CORPORATE',
        cin: '',
        gstin: '',
        ngoDarpanId: '',
        primaryContactDesignation: '',
        supportSectors: []
      }
    }));
  };

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      profile: { ...prev.profile, [name]: value }
    }));
  };

  const toggleArrayItem = (fieldName, item) => {
    setFormData((prev) => {
      const currentList = prev.profile[fieldName] || [];
      const updatedList = currentList.includes(item)
        ? currentList.filter((i) => i !== item)
        : [...currentList, item];
      return {
        ...prev,
        profile: { ...prev.profile, [fieldName]: updatedList }
      };
    });
  };

  const validateStep2 = () => {
    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      setErrorMessage('Full Name must be at least 2 characters.');
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(formData.mobileNumber.trim())) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return false;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const validateStep3 = () => {
    if (formData.role === 'CITIZEN') {
      if (!formData.profile.district || !formData.profile.blockOrULB) {
        setErrorMessage('District and Block/ULB are required for Citizens.');
        return false;
      }
    } else if (formData.role === 'UNIVERSITY') {
      if (!formData.profile.institutionName.trim()) {
        setErrorMessage('Institution Name is required.');
        return false;
      }
      if (!formData.profile.aisheCode.trim()) {
        setErrorMessage('AISHE Code is required.');
        return false;
      }
      if (!formData.profile.nodalOfficerDesignation.trim()) {
        setErrorMessage('Nodal Officer Designation is required.');
        return false;
      }
      if (formData.profile.academicFocusDomains.length === 0) {
        setErrorMessage('Select at least one Academic Focus Domain.');
        return false;
      }
    } else if (formData.role === 'INDUSTRY') {
      if (!formData.profile.organizationName.trim()) {
        setErrorMessage('Organization Name is required.');
        return false;
      }
      if (!formData.profile.primaryContactDesignation.trim()) {
        setErrorMessage('Primary Contact Designation is required.');
        return false;
      }
      if (formData.profile.supportSectors.length === 0) {
        setErrorMessage('Select at least one Support Sector.');
        return false;
      }
    }
    setErrorMessage('');
    return true;
  };

  const handleNext = () => {
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setErrorMessage('');
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrorMessage('');
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      setErrorMessage('You must accept the terms and conditions.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
        profile: {
          ...(formData.role === 'CITIZEN' && {
            preferredLanguage: formData.profile.preferredLanguage,
            location: {
              district: formData.profile.district,
              blockOrULB: formData.profile.blockOrULB,
              panchayatOrWard: formData.profile.panchayatOrWard
            }
          }),
          ...(formData.role === 'UNIVERSITY' && {
            institutionName: formData.profile.institutionName,
            aisheCode: formData.profile.aisheCode,
            registrationNumber: formData.profile.registrationNumber,
            institutionType: formData.profile.institutionType,
            nodalOfficerDesignation: formData.profile.nodalOfficerDesignation,
            academicFocusDomains: formData.profile.academicFocusDomains
          }),
          ...(formData.role === 'INDUSTRY' && {
            organizationName: formData.profile.organizationName,
            entityType: formData.profile.entityType,
            cin: formData.profile.cin,
            gstin: formData.profile.gstin,
            ngoDarpanId: formData.profile.ngoDarpanId,
            primaryContactDesignation: formData.profile.primaryContactDesignation,
            supportSectors: formData.profile.supportSectors
          })
        }
      };

      await register(payload);

      if (onNavigate) {
        onNavigate('/verify-email', { email: formData.email });
      } else {
        window.location.href = `/verify-email?email=${encodeURIComponent(formData.email)}`;
      }
    } catch (error) {
      const msg = error?.response?.data?.error?.message || error?.message || 'Registration failed';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-2xl bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 mb-3 shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Create JoharSetu Account</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Multi-step role registration portal</p>
        </div>

        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-xs mx-auto">
            {[1, 2, 3, 4, 5].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    s === step
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-4 ring-blue-100'
                      : s < step
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                {s < 5 && (
                  <div
                    className={`flex-1 h-1 mx-1 rounded ${
                      s < step ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="text-center mt-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
            {step === 1 && 'Step 1: Select Role'}
            {step === 2 && 'Step 2: Basic Account Info'}
            {step === 3 && 'Step 3: Role-Specific Details'}
            {step === 4 && 'Step 4: Review Information'}
            {step === 5 && 'Step 5: Terms & Confirmation'}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: SELECT ROLE */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center mb-4">
              Select Your Role Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Citizen Card */}
              <div
                onClick={() => handleRoleSelect('CITIZEN')}
                className={`p-5 rounded-2xl cursor-pointer border transition-all ${
                  formData.role === 'CITIZEN'
                    ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                  <User className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">CITIZEN</h4>
                <p className="text-xs text-slate-500">
                  Submit community and local societal challenges across Jharkhand.
                </p>
              </div>

              {/* University Card */}
              <div
                onClick={() => handleRoleSelect('UNIVERSITY')}
                className={`p-5 rounded-2xl cursor-pointer border transition-all ${
                  formData.role === 'UNIVERSITY'
                    ? 'bg-purple-50 border-purple-600 ring-2 ring-purple-500/20 shadow-md'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">UNIVERSITY / HEI</h4>
                <p className="text-xs text-slate-500">
                  Contribute academic and technological research expertise.
                </p>
              </div>

              {/* Industry Card */}
              <div
                onClick={() => handleRoleSelect('INDUSTRY')}
                className={`p-5 rounded-2xl cursor-pointer border transition-all ${
                  formData.role === 'INDUSTRY'
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">INDUSTRY / CSR</h4>
                <p className="text-xs text-slate-500">
                  Provide CSR funding, technology, mentoring, and execution support.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={handleNext}
                className="w-full btn-primary font-semibold py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-sm text-sm"
              >
                <span>Continue to Account Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BASIC ACCOUNT INFORMATION */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleBasicChange}
                placeholder="Rahul Kumar"
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Mobile Number *</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleBasicChange}
                  placeholder="9876543210"
                  className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleBasicChange}
                  placeholder="rahul@example.com"
                  className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleBasicChange}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-2.5 pr-10 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength Indicator */}
              <div className="mt-2">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-500 font-medium">Strength:</span>
                  <span className="font-semibold text-slate-700">{passwordStrength.label}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: passwordStrength.width }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleBasicChange}
                placeholder="Re-enter password"
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 text-sm font-medium"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="w-1/3 bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold py-3 rounded-xl flex items-center justify-center space-x-1 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-2/3 btn-primary font-semibold py-3 rounded-xl flex items-center justify-center space-x-1 shadow-sm text-sm"
              >
                <span>Next: Role Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ROLE-SPECIFIC INFORMATION */}
        {step === 3 && (
          <div className="space-y-4">
            {/* CITIZEN FIELDS */}
            {formData.role === 'CITIZEN' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">District *</label>
                    <select
                      name="district"
                      value={formData.profile.district}
                      onChange={(e) => {
                        const dist = e.target.value;
                        const blocks = JHARKHAND_DISTRICTS[dist] || [];
                        setFormData((prev) => ({
                          ...prev,
                          profile: { ...prev.profile, district: dist, blockOrULB: blocks[0] || '' }
                        }));
                      }}
                      className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 text-sm font-medium"
                    >
                      {Object.keys(JHARKHAND_DISTRICTS).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Block / ULB *</label>
                    <select
                      name="blockOrULB"
                      value={formData.profile.blockOrULB}
                      onChange={handleProfileChange}
                      className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 text-sm font-medium"
                    >
                      {(JHARKHAND_DISTRICTS[formData.profile.district] || []).map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Panchayat / Ward (Optional)</label>
                  <input
                    type="text"
                    name="panchayatOrWard"
                    value={formData.profile.panchayatOrWard}
                    onChange={handleProfileChange}
                    placeholder="Enter Panchayat or Ward number"
                    className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Preferred Language *</label>
                  <select
                    name="preferredLanguage"
                    value={formData.profile.preferredLanguage}
                    onChange={handleProfileChange}
                    className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 text-sm font-medium"
                  >
                    <option value="HINDI">Hindi (हिंदी)</option>
                    <option value="ENGLISH">English</option>
                    <option value="REGIONAL">Regional (Santhali / Mundari / Ho)</option>
                  </select>
                </div>
              </>
            )}

            {/* UNIVERSITY FIELDS */}
            {formData.role === 'UNIVERSITY' && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Institution Name *</label>
                  <input
                    type="text"
                    name="institutionName"
                    value={formData.profile.institutionName}
                    onChange={handleProfileChange}
                    placeholder="BIT Mesra / Ranchi University"
                    className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">AISHE Code *</label>
                    <input
                      type="text"
                      name="aisheCode"
                      value={formData.profile.aisheCode}
                      onChange={handleProfileChange}
                      placeholder="U-0205"
                      className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Institution Type *</label>
                    <select
                      name="institutionType"
                      value={formData.profile.institutionType}
                      onChange={handleProfileChange}
                      className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 text-sm font-medium"
                    >
                      <option value="STATE_UNIVERSITY">State University</option>
                      <option value="CENTRAL_UNIVERSITY">Central University</option>
                      <option value="NIT">NIT</option>
                      <option value="BIT">BIT</option>
                      <option value="POLYTECHNIC">Polytechnic</option>
                      <option value="ITI">ITI</option>
                      <option value="PRIVATE">Private Institute</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Nodal Officer Designation *</label>
                  <input
                    type="text"
                    name="nodalOfficerDesignation"
                    value={formData.profile.nodalOfficerDesignation}
                    onChange={handleProfileChange}
                    placeholder="Dean R&D / HOD Computer Science"
                    className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-2">Academic Focus Domains *</label>
                  <div className="flex flex-wrap gap-2">
                    {ACADEMIC_DOMAINS.map((domain) => {
                      const selected = formData.profile.academicFocusDomains.includes(domain);
                      return (
                        <button
                          key={domain}
                          type="button"
                          onClick={() => toggleArrayItem('academicFocusDomains', domain)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            selected
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {domain}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* INDUSTRY FIELDS */}
            {formData.role === 'INDUSTRY' && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Organization Name *</label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.profile.organizationName}
                    onChange={handleProfileChange}
                    placeholder="Tata Steel / CSR Foundation"
                    className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Entity Type *</label>
                    <select
                      name="entityType"
                      value={formData.profile.entityType}
                      onChange={handleProfileChange}
                      className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 text-sm font-medium"
                    >
                      <option value="CORPORATE">Corporate</option>
                      <option value="MSME">MSME</option>
                      <option value="STARTUP">Startup</option>
                      <option value="CSR_FOUNDATION">CSR Foundation</option>
                      <option value="R_AND_D_LAB">R&D Lab</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">CIN / GSTIN / NGO Darpan (Optional)</label>
                    <input
                      type="text"
                      name="cin"
                      value={formData.profile.cin}
                      onChange={handleProfileChange}
                      placeholder="L27100JH1907PLC000015"
                      className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Primary Contact Designation *</label>
                  <input
                    type="text"
                    name="primaryContactDesignation"
                    value={formData.profile.primaryContactDesignation}
                    onChange={handleProfileChange}
                    placeholder="Head of CSR / VP Technology"
                    className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-2">Support Sectors *</label>
                  <div className="flex flex-wrap gap-2">
                    {SUPPORT_SECTORS.map((sector) => {
                      const selected = formData.profile.supportSectors.includes(sector);
                      return (
                        <button
                          key={sector}
                          type="button"
                          onClick={() => toggleArrayItem('supportSectors', sector)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            selected
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {sector}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="w-1/3 bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold py-3 rounded-xl flex items-center justify-center space-x-1 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-2/3 btn-primary font-semibold py-3 rounded-xl flex items-center justify-center space-x-1 shadow-sm text-sm"
              >
                <span>Next: Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW INFORMATION */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h4 className="font-bold text-slate-900 text-sm">Account Information</h4>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Name:</span>
                  <span className="text-slate-900 font-semibold">{formData.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Role:</span>
                  <span className="text-blue-600 font-bold">{formData.role}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Email:</span>
                  <span className="text-slate-900 font-semibold">{formData.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Mobile:</span>
                  <span className="text-slate-900 font-semibold">{formData.mobileNumber}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h4 className="font-bold text-slate-900 text-sm">Role Profile Summary</h4>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>

              {formData.role === 'CITIZEN' && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">District:</span>
                    <span className="text-slate-900 font-semibold">{formData.profile.district}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Block/ULB:</span>
                    <span className="text-slate-900 font-semibold">{formData.profile.blockOrULB}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Language:</span>
                    <span className="text-slate-900 font-semibold">{formData.profile.preferredLanguage}</span>
                  </div>
                </div>
              )}

              {formData.role === 'UNIVERSITY' && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">Institution:</span>
                    <span className="text-slate-900 font-semibold">{formData.profile.institutionName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">AISHE Code:</span>
                    <span className="text-slate-900 font-mono font-bold">{formData.profile.aisheCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Nodal Officer:</span>
                    <span className="text-slate-900 font-semibold">{formData.profile.nodalOfficerDesignation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Domains:</span>
                    <span className="text-purple-600 font-semibold">
                      {formData.profile.academicFocusDomains.join(', ')}
                    </span>
                  </div>
                </div>
              )}

              {formData.role === 'INDUSTRY' && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">Organization:</span>
                    <span className="text-slate-900 font-semibold">{formData.profile.organizationName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Entity Type:</span>
                    <span className="text-slate-900 font-semibold">{formData.profile.entityType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Designation:</span>
                    <span className="text-slate-900 font-semibold">{formData.profile.primaryContactDesignation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Sectors:</span>
                    <span className="text-emerald-600 font-semibold">
                      {formData.profile.supportSectors.join(', ')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="w-1/3 bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold py-3 rounded-xl flex items-center justify-center space-x-1 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-2/3 btn-primary font-semibold py-3 rounded-xl flex items-center justify-center space-x-1 shadow-sm text-sm"
              >
                <span>Proceed to Terms</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: TERMS + SUBMIT */}
        {step === 5 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs text-slate-600">
              <h4 className="font-bold text-slate-900 text-sm">Terms of Service & Privacy Policy</h4>
              <p>
                By registering on JoharSetu, you agree to submit authentic societal challenges and institutional data for Jharkhand community innovation.
              </p>
              <p>
                Verification details may be validated by district nodal officers or authorized department representatives.
              </p>
            </div>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }))}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-700 font-medium">
                I confirm that the information provided is accurate and I agree to JoharSetu terms.
              </span>
            </label>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="w-1/3 bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold py-3.5 rounded-xl flex items-center justify-center space-x-1 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.termsAccepted}
                className="w-2/3 btn-primary font-semibold py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Creating Account...</span>
                  </span>
                ) : (
                  <>
                    <span>Create Account & Send OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500 font-medium">
          Already registered?{' '}
          <button
            type="button"
            onClick={() => onNavigate ? onNavigate('/login') : (window.location.href = '/login')}
            className="font-bold text-blue-600 hover:text-blue-700 ml-1"
          >
            Sign In here
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
