import React, { useState } from 'react';
import { Save, ArrowLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../data/governmentConstants.js';
import { EditUniversityBasicSection } from './EditUniversityBasicSection.jsx';
import { EditUniversityNodalSection } from './EditUniversityNodalSection.jsx';
import { EditUniversityAccreditationFocus } from './EditUniversityAccreditationFocus.jsx';
import { EditUniversityCapacitySection } from './EditUniversityCapacitySection.jsx';

export const EditUniversityView = ({ university, onCancel, onSuccess, onUpdateUniversity }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [formData, setFormData] = useState({
    name: university?.name || '',
    shortName: university?.shortName || '',
    code: university?.code || '',
    universityType: university?.universityType || 'State University',
    institutionCategory: university?.institutionCategory || 'University',
    status: university?.status || 'Approved',
    establishmentYear: university?.establishmentYear || '2012',
    website: university?.website || '',
    district: university?.district || 'Ranchi',

    // Nodal officer & contacts
    nodalOfficerName: university?.nodalOfficer?.name || '',
    nodalOfficerDesignation: university?.nodalOfficer?.designation || 'Registrar',
    nodalOfficerEmail: university?.nodalOfficer?.email || '',
    nodalOfficerPhone: university?.nodalOfficer?.phone || '',
    universityEmail: university?.universityEmail || '',
    universityPhone: university?.universityPhone || '',

    // Accreditation
    naacGrade: university?.accreditation?.naacGrade || 'A',
    naacValidity: university?.accreditation?.validity || '2028-12-31',
    nirfRanking: university?.accreditation?.nirfRanking || '',

    // Focus Areas
    focusAreas: university?.focusAreas || ['Water Management', 'Infrastructure', 'Education', 'Public Health'],

    // Capacity
    departments: university?.quickSummary?.departments ?? '',
    totalFaculty: university?.quickSummary?.totalFaculty ?? '',
    availableFaculty: university?.quickSummary?.availableFaculty ?? '',
    labsAndFacilities: university?.quickSummary?.labsAndFacilities ?? '',
    activeProjects: university?.quickSummary?.activeProjects ?? '',
    capacityStatus: university?.quickSummary?.capacityStatus || 'Available',

    // Password
    loginPassword: university?.credentials?.generatedPassword || 'HEI@Jharkhand2026!'
  });

  const DISTRICT_OPTIONS = JHARKHAND_DISTRICTS_LIST;

  const FOCUS_AREA_OPTIONS = [
    'Water Management',
    'Waste Management',
    'Environmental Science',
    'Infrastructure',
    'Renewable Energy',
    'AI / ML',
    'IoT',
    'Agriculture',
    'Education',
    'Public Health',
    'Rural Development',
    'Transportation',
    'Skill Development',
    'Governance',
    'Public Safety',
    'Other'
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const handleToggleFocusArea = (area) => {
    setFormData((prev) => {
      const exists = prev.focusAreas.includes(area);
      const nextAreas = exists
        ? prev.focusAreas.filter((a) => a !== area)
        : [...prev.focusAreas, area];
      return { ...prev, focusAreas: nextAreas };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('University name is required.');
      return;
    }
    if (!formData.code.trim()) {
      setFormError('University unique code is required.');
      return;
    }
    if (!formData.nodalOfficerName.trim() || !formData.nodalOfficerEmail.trim()) {
      setFormError('Nodal officer name and official email are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        shortName: formData.shortName.trim(),
        code: formData.code.trim().toUpperCase(),
        universityType: formData.universityType,
        institutionCategory: formData.institutionCategory,
        status: formData.status,
        establishmentYear: Number(formData.establishmentYear),
        website: formData.website.trim(),
        district: formData.district,
        quickSummary: {
          departments: Number(formData.departments),
          totalFaculty: Number(formData.totalFaculty),
          availableFaculty: Number(formData.availableFaculty),
          labsAndFacilities: Number(formData.labsAndFacilities),
          activeProjects: Number(formData.activeProjects),
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
          designation: formData.nodalOfficerDesignation.trim(),
          email: formData.nodalOfficerEmail.trim().toLowerCase(),
          phone: formData.nodalOfficerPhone.trim()
        },
        universityEmail: formData.universityEmail.trim().toLowerCase(),
        universityPhone: formData.universityPhone.trim(),
        credentials: {
          loginEmail: formData.nodalOfficerEmail.trim().toLowerCase() || formData.universityEmail.trim().toLowerCase(),
          generatedPassword: formData.loginPassword
        }
      };

      if (onUpdateUniversity) {
        await onUpdateUniversity(university._id || university.id, payload);
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setFormError(err?.message || 'Failed to save changes. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 select-none w-full max-w-[1600px] mx-auto pb-10">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-400 mb-0.5">
            <button onClick={onCancel} className="hover:text-slate-900 cursor-pointer">
              User Governance
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <button onClick={onCancel} className="hover:text-slate-900 cursor-pointer">
              Universities
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 font-bold">Edit</span>
          </div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Edit University: {university?.name}
          </h1>
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
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-md shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {formError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-md flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{formError}</span>
        </div>
      )}

      {/* 1. Basic Information Section */}
      <EditUniversityBasicSection
        formData={formData}
        onInputChange={handleInputChange}
        districtOptions={DISTRICT_OPTIONS}
      />

      {/* 2. Nodal Officer Section */}
      <EditUniversityNodalSection
        formData={formData}
        onInputChange={handleInputChange}
      />

      {/* 3 & 4. Accreditation & Focus Areas */}
      <EditUniversityAccreditationFocus
        formData={formData}
        onInputChange={handleInputChange}
        onToggleFocusArea={handleToggleFocusArea}
        focusAreaOptions={FOCUS_AREA_OPTIONS}
      />

      {/* 5 & 6. Capacity & Credentials */}
      <EditUniversityCapacitySection
        formData={formData}
        onInputChange={handleInputChange}
      />

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-2xs">
        <button
          type="button"
          onClick={onCancel}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer shadow-2xs"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-md shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSubmitting ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>
    </div>
  );
};

export default EditUniversityView;
