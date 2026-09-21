import { useState } from 'react';
import { industryService } from '../../../government/services/industryService.js';
import {
  INITIAL_INDUSTRY_FORM_DATA,
  validateIndustryForm
} from './industryRegistrationConstants.js';

export const useIndustryRegistration = () => {
  const [formData, setFormData] = useState(INITIAL_INDUSTRY_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSupportModeToggle = (mode) => {
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

  const resetForm = () => {
    setApplicationSuccess(null);
    setFormData(INITIAL_INDUSTRY_FORM_DATA);
    setErrors({});
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const validation = validateIndustryForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setSubmitError(validation.firstError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        category: formData.category,
        legalName: formData.legalName.trim(),
        shortName: formData.shortName.trim(),
        registrationNumber: formData.registrationNumber.trim(),
        thematicDomain: formData.thematicDomain,
        thematicDomains: [formData.thematicDomain],
        supportModes: formData.supportModes,
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
        }
      };

      const res = await industryService.applyIndustry(payload);
      setApplicationSuccess(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit application. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    submitError,
    applicationSuccess,
    handleInputChange,
    handleSupportModeToggle,
    handleSubmit,
    resetForm
  };
};

export default useIndustryRegistration;
