import React from 'react';
import { useIndustryRegistration } from './useIndustryRegistration.js';
import { IndustrySuccessScreen } from './IndustrySuccessScreen.jsx';
import { IndustryHeaderNotice } from './IndustryHeaderNotice.jsx';
import { IndustryOrgDetailsSection } from './IndustryOrgDetailsSection.jsx';
import { IndustryDomainSupportSection } from './IndustryDomainSupportSection.jsx';
import { IndustryContactSection } from './IndustryContactSection.jsx';
import { IndustryAddressSection } from './IndustryAddressSection.jsx';

export const IndustryRegistrationPage = ({ onNavigate }) => {
  const {
    formData,
    errors,
    isSubmitting,
    submitError,
    applicationSuccess,
    handleInputChange,
    handleSupportModeToggle,
    handleSubmit,
    resetForm
  } = useIndustryRegistration();

  if (applicationSuccess) {
    return (
      <IndustrySuccessScreen
        applicationSuccess={applicationSuccess}
        onReset={resetForm}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 text-black">
      <div className="max-w-3xl mx-auto space-y-5">
        <IndustryHeaderNotice
          onNavigate={onNavigate}
          submitError={submitError}
        />

        <form onSubmit={handleSubmit} className="space-y-5">
          <IndustryOrgDetailsSection
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
          />

          <IndustryDomainSupportSection
            formData={formData}
            handleInputChange={handleInputChange}
            handleSupportModeToggle={handleSupportModeToggle}
          />

          <IndustryContactSection
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
          />

          <IndustryAddressSection
            formData={formData}
            errors={errors}
            isSubmitting={isSubmitting}
            handleInputChange={handleInputChange}
            onNavigate={onNavigate}
          />
        </form>
      </div>
    </div>
  );
};

export default IndustryRegistrationPage;
