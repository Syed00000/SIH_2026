import React, { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { Input } from '../../../shared/components/ui/input.jsx';
import { Button } from '../../../shared/components/ui/button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/ui/card.jsx';
import { Alert } from '../../../shared/components/ui/alert.jsx';
import { Eye, EyeOff } from 'lucide-react';

const JHARKHAND_DISTRICTS = {
  Ranchi: ['Kanke', 'Ratu', 'Namkum', 'Ormanjhi', 'Bero', 'Ranchi Municipal Corporation'],
  Dhanbad: ['Dhanbad Sadar', 'Jharia', 'Baghmara', 'Nirsa', 'Tundi'],
  Jamshedpur: ['Golmuri-cum-Jugsalai', 'Bahragora', 'Ghatshila', 'Patamda', 'Potka'],
  Hazaribagh: ['Hazaribagh Sadar', 'Ichak', 'Barkagaon', 'Katkamsandi', 'Chirki']
};

export const RegisterForm = ({ onNavigate }) => {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    role: 'CITIZEN',
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    district: '',
    blockOrULB: '',
    panchayatOrWard: '',
    preferredLanguage: 'HINDI',
    institutionName: '',
    aisheCode: '',
    registrationNumber: '',
    nodalOfficerDesignation: '',
    academicFocusDomains: [],
    institutionType: 'STATE_UNIVERSITY',
    organizationName: '',
    entityType: 'CORPORATE',
    cin: '',
    gstin: '',
    ngoDarpanId: '',
    primaryContactDesignation: '',
    supportSectors: [],
    termsAccepted: false
  });

  const getPasswordStrength = (pass) => {
    if (!pass) return { label: 'None', width: '0%', color: 'bg-slate-200' };
    if (pass.length < 6) return { label: 'Weak', width: '33%', color: 'bg-slate-900' };
    if (pass.length < 10 || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) {
      return { label: 'Medium', width: '66%', color: 'bg-slate-900' };
    }
    return { label: 'Strong', width: '100%', color: 'bg-slate-900' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxListChange = (field, itemValue) => {
    const currentList = formData[field] || [];
    const updatedList = currentList.includes(itemValue)
      ? currentList.filter((x) => x !== itemValue)
      : [...currentList, itemValue];
    setFormData((prev) => ({ ...prev, [field]: updatedList }));
  };

  const handleNext = () => {
    setErrorMessage('');
    if (step === 1) {
      if (!formData.role) {
        setErrorMessage('Please select a registration role.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.fullName.trim()) return setErrorMessage('Full Name is required.');
      if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) return setErrorMessage('Invalid 10-digit Indian mobile number.');
      if (!formData.email.trim() || !formData.email.includes('@')) return setErrorMessage('Invalid email address.');
      if (formData.password.length < 8) return setErrorMessage('Password must be at least 8 characters long.');
      if (formData.password !== formData.confirmPassword) return setErrorMessage('Passwords do not match.');
      setStep(3);
    } else if (step === 3) {
      if (formData.role === 'CITIZEN') {
        if (!formData.district) return setErrorMessage('Please select your District.');
        if (!formData.blockOrULB) return setErrorMessage('Please select your Block/ULB.');
      } else if (formData.role === 'UNIVERSITY') {
        if (!formData.institutionName.trim()) return setErrorMessage('Institution Name is required.');
        if (!formData.aisheCode.trim()) return setErrorMessage('AISHE Code is required.');
      } else if (formData.role === 'INDUSTRY') {
        if (!formData.organizationName.trim()) return setErrorMessage('Organization Name is required.');
      }
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    }
  };

  const handleBack = () => {
    setErrorMessage('');
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      setErrorMessage('You must accept the terms and conditions to proceed.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payloadProfile = {
        preferredLanguage: formData.preferredLanguage,
        location: formData.role === 'CITIZEN' ? {
          district: formData.district,
          blockOrULB: formData.blockOrULB,
          panchayatOrWard: formData.panchayatOrWard
        } : null,
        institutionName: formData.role === 'UNIVERSITY' ? formData.institutionName : null,
        aisheCode: formData.role === 'UNIVERSITY' ? formData.aisheCode : null,
        registrationNumber: formData.role === 'UNIVERSITY' ? formData.registrationNumber : null,
        institutionType: formData.role === 'UNIVERSITY' ? formData.institutionType : null,
        nodalOfficerDesignation: formData.role === 'UNIVERSITY' ? formData.nodalOfficerDesignation : null,
        academicFocusDomains: formData.role === 'UNIVERSITY' ? formData.academicFocusDomains : [],
        organizationName: formData.role === 'INDUSTRY' ? formData.organizationName : null,
        entityType: formData.role === 'INDUSTRY' ? formData.entityType : null,
        cin: formData.role === 'INDUSTRY' ? formData.cin : null,
        gstin: formData.role === 'INDUSTRY' ? formData.gstin : null,
        ngoDarpanId: formData.role === 'INDUSTRY' ? formData.ngoDarpanId : null,
        primaryContactDesignation: formData.role === 'INDUSTRY' ? formData.primaryContactDesignation : null,
        supportSectors: formData.role === 'INDUSTRY' ? formData.supportSectors : []
      };

      await register({
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
        profile: payloadProfile
      });

      if (onNavigate) {
        onNavigate('/verify-email', { email: formData.email });
      } else {
        window.location.href = `/verify-email?email=${encodeURIComponent(formData.email)}`;
      }
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err?.message || 'Registration failed';
      if (msg === 'EMAIL_ALREADY_EXISTS') {
        setErrorMessage('This email address is already registered.');
        setStep(2); // Go back to Step 2 to correct the email
      } else if (msg === 'MOBILE_ALREADY_EXISTS') {
        setErrorMessage('This mobile number is already registered.');
        setStep(2); // Go back to Step 2 to correct the mobile number
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-2xl bg-white border border-slate-200 shadow-sm rounded-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Create JoharSetu Account
          </CardTitle>
          <CardDescription className="text-slate-500 text-sm mt-1">
            Multi-step role registration portal
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stepper Node Display */}
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    s === step
                      ? 'bg-slate-900 text-white shadow-sm ring-4 ring-slate-100'
                      : s < step
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {s}
                </div>
                {s < 5 && (
                  <div className={`h-[2px] w-8 sm:w-12 ${s < step ? 'bg-slate-900' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {errorMessage && (
            <Alert variant="error" title="Error">
              {errorMessage}
            </Alert>
          )}

          {/* STEP 1: SELECT ROLE */}
          {step === 1 && (
            <div className="space-y-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Choose Registration Role
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  onClick={() => handleRoleSelect('CITIZEN')}
                  className={`p-5 rounded-lg cursor-pointer border transition-all ${
                    formData.role === 'CITIZEN'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
                  }`}
                >
                  <h4 className="font-bold text-sm mb-1">CITIZEN</h4>
                  <p className={`text-xs ${formData.role === 'CITIZEN' ? 'text-slate-300' : 'text-slate-500'}`}>
                    Submit local community and societal challenges across Jharkhand.
                  </p>
                </div>

                <div
                  onClick={() => handleRoleSelect('UNIVERSITY')}
                  className={`p-5 rounded-lg cursor-pointer border transition-all ${
                    formData.role === 'UNIVERSITY'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
                  }`}
                >
                  <h4 className="font-bold text-sm mb-1">UNIVERSITY</h4>
                  <p className={`text-xs ${formData.role === 'UNIVERSITY' ? 'text-slate-300' : 'text-slate-500'}`}>
                    Submit educational, institutional, or research-domain societal challenges.
                  </p>
                </div>

                <div
                  onClick={() => handleRoleSelect('INDUSTRY')}
                  className={`p-5 rounded-lg cursor-pointer border transition-all ${
                    formData.role === 'INDUSTRY'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
                  }`}
                >
                  <h4 className="font-bold text-sm mb-1">INDUSTRY</h4>
                  <p className={`text-xs ${formData.role === 'INDUSTRY' ? 'text-slate-300' : 'text-slate-500'}`}>
                    Submit industrial, corporate-level, or CSR-domain societal challenges.
                  </p>
                </div>
              </div>

              {formData.role === 'INDUSTRY' && (
                <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-xl text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                  <div>
                    <p className="font-bold text-blue-900">Official Industry & Partner Onboarding</p>
                    <p className="text-blue-700 text-[11.5px] mt-0.5">
                      Partner with state universities & student researchers. Government of Jharkhand provisions verified credentials upon application review.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => (onNavigate ? onNavigate('/register/industry') : (window.location.href = '/register/industry'))}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg shrink-0 shadow-2xs cursor-pointer text-center"
                  >
                    Open Industry Application
                  </button>
                </div>
              )}

              <div className="pt-4">
                <Button onClick={handleNext} className="w-full py-2.5">
                  Continue to Account Details
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: ACCOUNT DETAILS */}
          {step === 2 && (
            <div className="space-y-4">
              <Input
                label="Full Name *"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Mobile Number *"
                  type="text"
                  required
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  placeholder="Indian 10-digit number"
                />
                <Input
                  label="Email Address *"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="name@example.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md transition-all focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900 pr-12 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                      title={showPassword ? 'Hide password' : 'Show password'}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {/* Strength Bar */}
                  <div className="mt-2">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-slate-500 font-medium">Strength:</span>
                      <span className="font-semibold text-slate-700">{passwordStrength.label}</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: passwordStrength.width }}
                      />
                    </div>
                  </div>
                </div>

                <Input
                  label="Confirm Password *"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Re-enter password"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button variant="secondary" onClick={handleBack} className="w-1/3">
                  Back
                </Button>
                <Button onClick={handleNext} className="w-2/3">
                  Next: Role Details
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: ROLE DETAILS */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Citizen fields */}
              {formData.role === 'CITIZEN' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        District *
                      </label>
                      <select
                        value={formData.district}
                        onChange={(e) => {
                          handleInputChange('district', e.target.value);
                          handleInputChange('blockOrULB', '');
                        }}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md transition-all focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900"
                      >
                        <option value="">Select District</option>
                        {Object.keys(JHARKHAND_DISTRICTS).map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Block / ULB *
                      </label>
                      <select
                        value={formData.blockOrULB}
                        disabled={!formData.district}
                        onChange={(e) => handleInputChange('blockOrULB', e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md transition-all focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900 disabled:opacity-50"
                      >
                        <option value="">Select Block</option>
                        {formData.district &&
                          JHARKHAND_DISTRICTS[formData.district].map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <Input
                    label="Panchayat / Ward"
                    type="text"
                    value={formData.panchayatOrWard}
                    onChange={(e) => handleInputChange('panchayatOrWard', e.target.value)}
                    placeholder="Enter Panchayat or Ward name"
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Preferred Language
                    </label>
                    <select
                      value={formData.preferredLanguage}
                      onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md transition-all focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900"
                    >
                      <option value="HINDI">Hindi</option>
                      <option value="ENGLISH">English</option>
                      <option value="SANTHALI">Santhali</option>
                    </select>
                  </div>
                </div>
              )}

              {/* University fields */}
              {formData.role === 'UNIVERSITY' && (
                <div className="space-y-4">
                  <Input
                    label="Institution Name *"
                    type="text"
                    required
                    value={formData.institutionName}
                    onChange={(e) => handleInputChange('institutionName', e.target.value)}
                    placeholder="e.g. BIT Mesra"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="AISHE Code *"
                      type="text"
                      required
                      value={formData.aisheCode}
                      onChange={(e) => handleInputChange('aisheCode', e.target.value)}
                      placeholder="e.g. U-0205"
                    />
                    <Input
                      label="Registration Number"
                      type="text"
                      value={formData.registrationNumber}
                      onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                      placeholder="University Registration No"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Institution Type
                      </label>
                      <select
                        value={formData.institutionType}
                        onChange={(e) => handleInputChange('institutionType', e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md transition-all focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900"
                      >
                        <option value="STATE_UNIVERSITY">State University</option>
                        <option value="CENTRAL_UNIVERSITY">Central University</option>
                        <option value="DEEMED_UNIVERSITY">Deemed University</option>
                        <option value="PRIVATE_UNIVERSITY">Private University</option>
                        <option value="NIT_IIT">NIT / IIT</option>
                      </select>
                    </div>

                    <Input
                      label="Nodal Officer Designation"
                      type="text"
                      value={formData.nodalOfficerDesignation}
                      onChange={(e) => handleInputChange('nodalOfficerDesignation', e.target.value)}
                      placeholder="e.g. Dean R&D"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      Academic Focus Domains (Choose all that apply)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['AI_IT', 'WATER', 'CIVIL', 'AGRICULTURE', 'HEALTHCARE', 'ENERGY'].map((domain) => (
                        <label key={domain} className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.academicFocusDomains.includes(domain)}
                            onChange={() => handleCheckboxListChange('academicFocusDomains', domain)}
                            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                          />
                          <span>{domain}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Industry fields */}
              {formData.role === 'INDUSTRY' && (
                <div className="space-y-4">
                  <Input
                    label="Organization Name *"
                    type="text"
                    required
                    value={formData.organizationName}
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    placeholder="Company or Corporate CSR Name"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Entity Type
                      </label>
                      <select
                        value={formData.entityType}
                        onChange={(e) => handleInputChange('entityType', e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md transition-all focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900"
                      >
                        <option value="CORPORATE">Corporate / PSU</option>
                        <option value="NGO">NGO / Foundation</option>
                        <option value="SOCIETY">Registered Society</option>
                      </select>
                    </div>

                    <Input
                      label="Primary Contact Designation"
                      type="text"
                      value={formData.primaryContactDesignation}
                      onChange={(e) => handleInputChange('primaryContactDesignation', e.target.value)}
                      placeholder="e.g. Head of CSR"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="CIN (Corporate ID)"
                      type="text"
                      value={formData.cin}
                      onChange={(e) => handleInputChange('cin', e.target.value)}
                      placeholder="U12345JH2020PTC..."
                    />
                    <Input
                      label="GSTIN"
                      type="text"
                      value={formData.gstin}
                      onChange={(e) => handleInputChange('gstin', e.target.value)}
                      placeholder="20AAAAA0000A1Z..."
                    />
                    <Input
                      label="NGO Darpan ID"
                      type="text"
                      value={formData.ngoDarpanId}
                      onChange={(e) => handleInputChange('ngoDarpanId', e.target.value)}
                      placeholder="JH/2021/000000"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      CSR Support Sectors (Choose all that apply)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['WATER', 'INFRASTRUCTURE', 'EDUCATION', 'LIVELIHOOD', 'HEALTHCARE', 'ENVIRONMENT'].map((sector) => (
                        <label key={sector} className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.supportSectors.includes(sector)}
                            onChange={() => handleCheckboxListChange('supportSectors', sector)}
                            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                          />
                          <span>{sector}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button variant="secondary" onClick={handleBack} className="w-1/3">
                  Back
                </Button>
                <Button onClick={handleNext} className="w-2/3">
                  Next: Review
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW */}
          {step === 4 && (
            <div className="space-y-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Review Your Details
              </span>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-3">
                  <div>
                    <span className="font-semibold text-slate-500 uppercase block mb-0.5">Role Type</span>
                    <span className="font-bold text-slate-900">{formData.role}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 uppercase block mb-0.5">Full Name</span>
                    <span className="font-bold text-slate-900">{formData.fullName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-3">
                  <div>
                    <span className="font-semibold text-slate-500 uppercase block mb-0.5">Email</span>
                    <span className="font-bold text-slate-900">{formData.email}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 uppercase block mb-0.5">Mobile</span>
                    <span className="font-bold text-slate-900">{formData.mobileNumber}</span>
                  </div>
                </div>

                {formData.role === 'CITIZEN' && (
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="font-semibold text-slate-500 uppercase block mb-0.5">District</span>
                      <span className="font-bold text-slate-900">{formData.district}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500 uppercase block mb-0.5">Block</span>
                      <span className="font-bold text-slate-900">{formData.blockOrULB}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500 uppercase block mb-0.5">Panchayat</span>
                      <span className="font-bold text-slate-900">{formData.panchayatOrWard || 'N/A'}</span>
                    </div>
                  </div>
                )}

                {formData.role === 'UNIVERSITY' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-semibold text-slate-500 uppercase block mb-0.5">Institution</span>
                      <span className="font-bold text-slate-900">{formData.institutionName}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500 uppercase block mb-0.5">AISHE Code</span>
                      <span className="font-bold text-slate-900">{formData.aisheCode}</span>
                    </div>
                  </div>
                )}

                {formData.role === 'INDUSTRY' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-semibold text-slate-500 uppercase block mb-0.5">Organization</span>
                      <span className="font-bold text-slate-900">{formData.organizationName}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500 uppercase block mb-0.5">Entity Type</span>
                      <span className="font-bold text-slate-900">{formData.entityType}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <Button variant="secondary" onClick={handleBack} className="w-1/3">
                  Back
                </Button>
                <Button onClick={handleNext} className="w-2/3">
                  Proceed to Terms
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: TERMS & SUBMIT */}
          {step === 5 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Terms of Service
              </span>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-xs text-slate-600 max-h-48 overflow-y-auto space-y-3 leading-relaxed">
                <p className="font-bold text-slate-900">JoharSetu Societal Innovation Platform Terms</p>
                <p>
                  By checking the box below, you agree to represent your institution, organization, or personal profile truthfully. You declare that any societal challenges submitted contain real-world community verification details and do not contain false or misleading claims.
                </p>
                <p>
                  Your registration is subject to verification by State Nodal Administrators. If any details are found to be fraudulent, your account may be suspended or blocked without prior warning.
                </p>
              </div>

              <label className="flex items-start space-x-2.5 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  required
                  checked={formData.termsAccepted}
                  onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                />
                <span className="text-xs text-slate-600 font-semibold select-none leading-tight">
                  I accept all Terms of Service and declare the information provided is accurate.
                </span>
              </label>

              <div className="flex space-x-3 pt-2">
                <Button variant="secondary" onClick={handleBack} className="w-1/3">
                  Back
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={!formData.termsAccepted}
                  className="w-2/3 py-3"
                >
                  Create Account & Send OTP
                </Button>
              </div>
            </form>
          )}

          <div className="text-center text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('/login') : (window.location.href = '/login')}
              className="font-bold text-slate-900 hover:underline ml-1"
            >
              Sign In
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
