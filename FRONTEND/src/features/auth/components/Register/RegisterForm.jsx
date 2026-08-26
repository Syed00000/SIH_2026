import React, { useState } from 'react';
import { useAuth } from '../../AuthContext.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../../shared/components/ui/card.jsx';
import { Alert } from '../../../../shared/components/ui/alert.jsx';
import { RegisterStepper } from './RegisterStepper.jsx';
import { RegisterStepRole } from './RegisterStepRole.jsx';
import { RegisterStepAccount } from './RegisterStepAccount.jsx';
import { RegisterStepRoleDetails } from './RegisterStepRoleDetails.jsx';
import { RegisterStepReview } from './RegisterStepReview.jsx';
import { RegisterStepTerms } from './RegisterStepTerms.jsx';
import { INITIAL_FORM_DATA, getPasswordStrength } from './registerConstants.js';

export const RegisterForm = ({ onNavigate }) => {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

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
        location:
          formData.role === 'CITIZEN'
            ? {
                district: formData.district,
                blockOrULB: formData.blockOrULB,
                panchayatOrWard: formData.panchayatOrWard
              }
            : null,
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
        setStep(2);
      } else if (msg === 'MOBILE_ALREADY_EXISTS') {
        setErrorMessage('This mobile number is already registered.');
        setStep(2);
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
          <RegisterStepper step={step} totalSteps={5} />

          {errorMessage && (
            <Alert variant="error" title="Error">
              {errorMessage}
            </Alert>
          )}

          {step === 1 && (
            <RegisterStepRole
              role={formData.role}
              onRoleSelect={handleRoleSelect}
              onNext={handleNext}
              onNavigate={onNavigate}
            />
          )}

          {step === 2 && (
            <RegisterStepAccount
              formData={formData}
              onChange={handleInputChange}
              showPassword={showPassword}
              onToggleShowPassword={() => setShowPassword(!showPassword)}
              passwordStrength={passwordStrength}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}

          {step === 3 && (
            <RegisterStepRoleDetails
              formData={formData}
              onChange={handleInputChange}
              onCheckboxListChange={handleCheckboxListChange}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}

          {step === 4 && (
            <RegisterStepReview
              formData={formData}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}

          {step === 5 && (
            <RegisterStepTerms
              termsAccepted={formData.termsAccepted}
              onChange={handleInputChange}
              isSubmitting={isSubmitting}
              onBack={handleBack}
              onSubmit={handleSubmit}
            />
          )}

          <div className="text-center text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate('/login') : (window.location.href = '/login'))}
              className="font-bold text-slate-900 hover:underline ml-1 cursor-pointer"
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
