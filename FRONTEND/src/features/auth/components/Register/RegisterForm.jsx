import React, { useState } from 'react';
import { useAuth } from '../../AuthContext.jsx';
import { LandingLayout } from '../../../landing/components/layout/LandingLayout.jsx';
import registerBg from '../../../landing/assets/register_bg.jpg';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../../shared/components/ui/card.jsx';
import { Alert } from '../../../../shared/components/ui/alert.jsx';
import { RegisterStepper } from './RegisterStepper.jsx';
import { RegisterStepRole } from './RegisterStepRole.jsx';
import { RegisterStepAccount } from './RegisterStepAccount.jsx';
import { RegisterStepRoleDetails } from './RegisterStepRoleDetails.jsx';
import { RegisterStepReview } from './RegisterStepReview.jsx';
import { RegisterStepTerms } from './RegisterStepTerms.jsx';
import {
  INITIAL_FORM_DATA,
  getPasswordStrength,
  validateRegisterStep,
  buildRegistrationProfile
} from './registerConstants.js';

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
    const error = validateRegisterStep(step, formData);
    if (error) {
      setErrorMessage(error);
      return;
    }
    if (step < 5) setStep((prev) => prev + 1);
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
      const payloadProfile = buildRegistrationProfile(formData);

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
    <LandingLayout onNavigate={onNavigate} currentPath="/register">
      <div 
        className="min-h-screen flex items-center justify-center py-10 px-4 sm:px-6 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${registerBg})` }}
      >
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0"></div>
        <Card className="w-full max-w-xl bg-white/95 border border-white/50 shadow-2xl rounded-2xl relative z-10 my-8 overflow-hidden">
          {/* Compact Header with Smaller Logo */}
          <CardHeader className="text-center pb-2.5 pt-4 px-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex justify-center mb-1">
              <img
                src="https://www.jharkhand.gov.in/images/jhlogo55.PNG"
                alt="Government of Jharkhand"
                className="w-9 h-9 object-contain drop-shadow-xs"
              />
            </div>
            <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              JoharSetu Registration Portal
            </CardTitle>
            <CardDescription className="text-slate-500 text-[11px] mt-0.5 font-medium">
              Department of Higher & Technical Education, Government of Jharkhand
            </CardDescription>
          </CardHeader>

          {/* Scrollable Card Content without visible scrollbar */}
          <CardContent className="space-y-4 px-5 pt-4 pb-5 overflow-y-auto max-h-[calc(100vh-180px)] no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

            <div className="text-center text-[11.5px] text-slate-500 font-medium pt-2.5 border-t border-slate-100">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => (onNavigate ? onNavigate('/login') : (window.location.href = '/login'))}
                className="font-bold text-[#007A61] hover:text-[#005a47] hover:underline ml-1 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </LandingLayout>
  );
};

export default RegisterForm;
