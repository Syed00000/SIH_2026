import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../data/governmentConstants.js';
import { UNIVERSITY_STEPS, UNIVERSITY_FOCUS_AREAS } from './universityConstants.js';
import { AddUniversityStepperBar } from './AddUniversityStepperBar.jsx';
import { AddUniversityStepBasic } from './AddUniversityStepBasic.jsx';
import { AddUniversityStepNodal } from './AddUniversityStepNodal.jsx';
import { AddUniversityStepAccreditation } from './AddUniversityStepAccreditation.jsx';
import { AddUniversityStepFocus } from './AddUniversityStepFocus.jsx';
import { AddUniversityStepCapacity } from './AddUniversityStepCapacity.jsx';
import { AddUniversityStepReview } from './AddUniversityStepReview.jsx';

export const AddUniversityWizard = ({ onCancel, onSuccess, onCreateUniversity }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    code: '',
    universityType: 'State University',
    institutionCategory: 'University',
    status: 'Approved',
    establishmentYear: '2012',
    website: '',
    district: 'Ranchi',
    universityEmail: '',
    universityPhone: '',
    nodalOfficerName: '',
    nodalOfficerDesignation: 'Registrar',
    nodalOfficerEmail: '',
    nodalOfficerPhone: '',
    naacGrade: 'A',
    naacValidity: '2028-12-31',
    nirfRanking: '',
    focusAreas: ['Water Management', 'Infrastructure', 'Education', 'Public Health'],
    departments: 16,
    totalFaculty: 120,
    availableFaculty: 58,
    labsAndFacilities: 28,
    activeProjects: 14,
    capacityStatus: 'Available',
    initialPassword: 'HEI@Jharkhand2026!'
  });

  const DISTRICT_OPTIONS = JHARKHAND_DISTRICTS_LIST;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const handleToggleFocusArea = (area) => {
    setFormData((prev) => {
      const exists = prev.focusAreas.includes(area);
      const nextAreas = exists ? prev.focusAreas.filter((a) => a !== area) : [...prev.focusAreas, area];
      return { ...prev, focusAreas: nextAreas };
    });
  };

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let pwd = 'HEI@';
    for (let i = 0; i < 8; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    setFormData((prev) => ({ ...prev, initialPassword: pwd }));
  };

  const validateStep = (step) => {
    setFormError(null);
    if (step === 1) {
      if (!formData.name.trim()) return 'University name is required.';
      if (!formData.code.trim()) return 'University code is required.';
      if (!formData.district) return 'District jurisdiction is required.';
    }
    if (step === 2) {
      if (!formData.nodalOfficerName.trim()) return 'Nodal officer name is required.';
      if (!formData.nodalOfficerEmail.trim()) return 'Official nodal email is required.';
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep(currentStep);
    if (error) return setFormError(error);
    if (currentStep < 6) setCurrentStep((prev) => prev + 1);
    else handleFinalSubmit();
  };

  const handlePrev = () => {
    setFormError(null);
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const payload = {
        name: formData.name.trim(),
        shortName: formData.shortName.trim(),
        code: formData.code.trim().toUpperCase(),
        universityType: formData.universityType,
        institutionCategory: formData.institutionCategory,
        status: formData.status || 'Approved',
        establishmentYear: Number(formData.establishmentYear) || 2012,
        website: formData.website.trim(),
        district: formData.district,
        quickSummary: {
          departments: Number(formData.departments) || 16,
          totalFaculty: Number(formData.totalFaculty) || 120,
          availableFaculty: Number(formData.availableFaculty) || 58,
          labsAndFacilities: Number(formData.labsAndFacilities) || 28,
          activeProjects: Number(formData.activeProjects) || 14,
          capacityStatus: formData.capacityStatus
        },
        focusAreas: formData.focusAreas,
        accreditation: {
          naacGrade: formData.naacGrade,
          validity: formData.naacValidity,
          nirfRanking: formData.nirfRanking ? Number(formData.nirfRanking) : null
        },
        nodalOfficer: {
          name: formData.nodalOfficerName.trim(),
          designation: formData.nodalOfficerDesignation.trim() || 'Registrar',
          email: formData.nodalOfficerEmail.trim().toLowerCase(),
          phone: formData.nodalOfficerPhone.trim()
        },
        universityEmail: formData.universityEmail.trim().toLowerCase() || formData.nodalOfficerEmail.trim().toLowerCase(),
        universityPhone: formData.universityPhone.trim(),
        credentials: {
          loginEmail: formData.nodalOfficerEmail.trim().toLowerCase() || formData.universityEmail.trim().toLowerCase(),
          generatedPassword: formData.initialPassword
        }
      };

      if (onCreateUniversity) await onCreateUniversity(payload);
      if (onSuccess) onSuccess();
    } catch (err) {
      setFormError(err?.message || 'Failed to register university. Please verify details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginEmail = formData.nodalOfficerEmail.trim().toLowerCase() || 'nodal@university.ac.in';

  return (
    <div className="space-y-4 select-none w-full max-w-[1600px] mx-auto pb-10">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-400 mb-0.5">
            <button onClick={onCancel} className="hover:text-slate-900 cursor-pointer">User Governance</button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <button onClick={onCancel} className="hover:text-slate-900 cursor-pointer">Universities</button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 font-bold">Add University</span>
          </div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Register Higher Education Institution</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-md shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
          >
            <span>{currentStep === 6 ? (isSubmitting ? 'Registering...' : 'Complete & Register') : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <AddUniversityStepperBar steps={UNIVERSITY_STEPS} currentStep={currentStep} onStepClick={setCurrentStep} />

      {/* Error Alert */}
      {formError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-md flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
          <span>{formError}</span>
        </div>
      )}

      {currentStep === 1 && <AddUniversityStepBasic formData={formData} onInputChange={handleInputChange} districtOptions={DISTRICT_OPTIONS} />}
      {currentStep === 2 && <AddUniversityStepNodal formData={formData} onInputChange={handleInputChange} />}
      {currentStep === 3 && <AddUniversityStepAccreditation formData={formData} onInputChange={handleInputChange} />}
      {currentStep === 4 && <AddUniversityStepFocus formData={formData} onToggleFocusArea={handleToggleFocusArea} focusAreaOptions={UNIVERSITY_FOCUS_AREAS} />}
      {currentStep === 5 && <AddUniversityStepCapacity formData={formData} onInputChange={handleInputChange} />}
      {currentStep === 6 && <AddUniversityStepReview formData={formData} onGeneratePassword={generateStrongPassword} loginEmail={loginEmail} />}

      {/* Bottom Sticky Action Controls */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-2xs">
        <button
          type="button"
          onClick={onCancel}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer shadow-2xs"
        >
          Cancel Registration
        </button>

        <div className="flex items-center space-x-2">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-md shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
          >
            <span>{currentStep === 6 ? (isSubmitting ? 'Registering University...' : 'Complete & Register') : 'Continue to Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUniversityWizard;
