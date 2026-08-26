import React, { useState } from 'react';
import {
  Building2,
  User,
  Award,
  Layers,
  GraduationCap,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  KeyRound,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  FlaskConical,
  ShieldCheck,
  Save,
  Globe,
  MapPin,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';
import { JHARKHAND_DISTRICTS_DATA } from '../../data/jharkhandGisData.js';

export const AddUniversityWizard = ({ onCancel, onSuccess, onCreateUniversity }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [showPassword, setShowPassword] = useState(true);
  const [copiedPassword, setCopiedPassword] = useState(false);

  // Form State initialized with realistic defaults that can be edited
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    shortName: '',
    code: '',
    universityType: 'State University',
    institutionCategory: 'University',
    status: 'Approved',
    establishmentYear: '2012',
    website: '',
    district: 'Ranchi',

    // Step 2: Contact & Nodal Officer
    universityEmail: '',
    universityPhone: '',
    nodalOfficerName: '',
    nodalOfficerDesignation: 'Registrar',
    nodalOfficerEmail: '',
    nodalOfficerPhone: '',

    // Step 3: Accreditation
    naacGrade: 'A',
    naacValidity: '2028-12-31',
    nirfRanking: '',

    // Step 4: Focus Areas
    focusAreas: [
      'Water Management',
      'Infrastructure',
      'Education',
      'Public Health'
    ],

    // Step 5: Capacity
    departments: 16,
    totalFaculty: 120,
    availableFaculty: 58,
    labsAndFacilities: 28,
    activeProjects: 14,
    capacityStatus: 'Available',

    // Step 6: Credentials
    initialPassword: 'HEI@Jharkhand2026!'
  });

  const STEPS = [
    { id: 1, label: 'Basic Info', icon: Building2 },
    { id: 2, label: 'Contact & Nodal', icon: User },
    { id: 3, label: 'Accreditation', icon: Award },
    { id: 4, label: 'Departments & Focus', icon: Layers },
    { id: 5, label: 'Capacity', icon: GraduationCap },
    { id: 6, label: 'Review & Submit', icon: CheckCircle2 }
  ];

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

  const DISTRICT_OPTIONS = Object.values(JHARKHAND_DISTRICTS_DATA).map((d) => d.name).sort();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
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

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let pwd = 'HEI@';
    for (let i = 0; i < 6; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    pwd += '2026!';
    setFormData((prev) => ({ ...prev, initialPassword: pwd }));
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(formData.initialPassword);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  // Step-by-step strict validations
  const validateCurrentStep = () => {
    if (currentStep === 1) {
      if (!formData.name.trim()) return 'Please enter the official University / Institution Name.';
      if (!formData.code.trim()) return 'Please enter the University Code (e.g. RU001, CUJ-2026).';
      if (!formData.district) return 'Please select the District Jurisdiction.';
    }
    if (currentStep === 2) {
      if (!formData.nodalOfficerName.trim()) return 'Please enter the Nodal Officer Full Name.';
      if (!formData.nodalOfficerEmail.trim() || !formData.nodalOfficerEmail.includes('@')) {
        return 'Please provide a valid Nodal Officer Email address.';
      }
      if (!formData.nodalOfficerPhone.trim()) {
        return 'Please provide the Nodal Officer Phone Number.';
      }
      if (!formData.universityEmail.trim() || !formData.universityEmail.includes('@')) {
        return 'Please provide a valid University General Email address.';
      }
    }
    if (currentStep === 4) {
      if (formData.focusAreas.length === 0) {
        return 'Please select at least one Focus Area or Domain.';
      }
    }
    if (currentStep === 6) {
      if (!formData.initialPassword || formData.initialPassword.length < 6) {
        return 'Please ensure a strong initial password of at least 6 characters is generated.';
      }
    }
    return null;
  };

  const handleNext = () => {
    const error = validateCurrentStep();
    if (error) {
      setFormError(error);
      return;
    }
    setFormError(null);
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    setFormError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const error = validateCurrentStep();
    if (error) {
      setFormError(error);
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const loginEmail = (formData.nodalOfficerEmail || formData.universityEmail).toLowerCase().trim();
      const payload = {
        name: formData.name.trim(),
        shortName: formData.shortName.trim() || (formData.name.match(/\b(\w)/g) || []).join('').toUpperCase(),
        code: formData.code.trim().toUpperCase(),
        universityType: formData.universityType,
        institutionCategory: formData.institutionCategory,
        status: formData.status || 'Approved',
        establishmentYear: Number(formData.establishmentYear) || 2012,
        website: formData.website.trim(),
        district: formData.district,
        initialPassword: formData.initialPassword,
        quickSummary: {
          departments: Number(formData.departments) || 16,
          totalFaculty: Number(formData.totalFaculty) || 120,
          availableFaculty: Number(formData.availableFaculty) || 58,
          labsAndFacilities: Number(formData.labsAndFacilities) || 28,
          activeProjects: Number(formData.activeProjects) || 14,
          capacityStatus: formData.capacityStatus || 'Available'
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
          email: loginEmail,
          phone: formData.nodalOfficerPhone.trim()
        },
        universityEmail: (formData.universityEmail || loginEmail).toLowerCase().trim(),
        universityPhone: formData.universityPhone.trim()
      };

      if (onCreateUniversity) {
        await onCreateUniversity(payload);
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setFormError(err?.message || 'Registration failed. Please check the form fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginEmail = formData.nodalOfficerEmail || formData.universityEmail || 'nodal@university.ac.in';

  return (
    <div className="space-y-6 animate-fadeIn select-none max-w-5xl mx-auto pb-8">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span>User Governance</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Universities</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-bold">Add University</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Register New University / HEI</h1>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
          >
            <span>{currentStep === 6 ? (isSubmitting ? 'Registering...' : 'Complete & Register') : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stepper Progress Bar (6 Steps) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[650px] px-2">
          {STEPS.map((step, idx) => {
            const StepIcon = step.icon;
            const isPassed = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (step.id < currentStep) setCurrentStep(step.id);
                  }}
                  className={`flex flex-col items-center group ${step.id < currentStep ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                      isCurrent
                        ? 'bg-slate-900 text-white ring-4 ring-slate-100 shadow-sm'
                        : isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPassed ? <Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-[11px] mt-1.5 font-bold whitespace-nowrap ${
                      isCurrent ? 'text-slate-900' : isPassed ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {step.id}. {step.label}
                  </span>
                </button>

                {idx < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-colors ${
                      currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Error Alert */}
      {formError && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center space-x-2 animate-shake">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
          <span>{formError}</span>
        </div>
      )}

      {/* STEP 1: Basic Information */}
      {currentStep === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 animate-fadeIn">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Step 1: Institutional Identification & Location</h2>
            <p className="text-xs text-slate-500">Provide official university recognition details and administrative district.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* University Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                University / Institution Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. Central University of Jharkhand"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-slate-800 focus:outline-hidden transition-colors"
                autoFocus
              />
            </div>

            {/* Short Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Short Name / Acronym</label>
              <input
                type="text"
                value={formData.shortName}
                onChange={(e) => handleInputChange('shortName', e.target.value)}
                placeholder="e.g. CUJ"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-slate-800 focus:outline-hidden transition-colors"
              />
            </div>

            {/* University Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                University Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="e.g. CUJ-2026 or RU001"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden transition-colors"
              />
            </div>

            {/* University Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                University Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.universityType}
                onChange={(e) => handleInputChange('universityType', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="Central University">Central University</option>
                <option value="State University">State University</option>
                <option value="Private University">Private University</option>
                <option value="Deemed">Deemed University</option>
                <option value="Autonomous">Autonomous Institute</option>
                <option value="Institute of National Importance">Institute of National Importance</option>
              </select>
            </div>

            {/* Institution Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.institutionCategory}
                onChange={(e) => handleInputChange('institutionCategory', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="University">University</option>
                <option value="Institute of National Importance">Institute of National Importance</option>
                <option value="Engineering College">Engineering College</option>
                <option value="Medical College">Medical College</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                District Jurisdiction <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
              >
                {DISTRICT_OPTIONS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Establishment Year */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Establishment Year</label>
              <input
                type="number"
                value={formData.establishmentYear}
                onChange={(e) => handleInputChange('establishmentYear', e.target.value)}
                placeholder="2012"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            {/* Official Website */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Website URL</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://www.university.ac.in"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Contact & Nodal Officer Details */}
      {currentStep === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 animate-fadeIn">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Step 2: Nodal Officer & Institutional Contact</h2>
            <p className="text-xs text-slate-500">
              The Nodal Officer is the administrative point of contact whose email will be used for portal credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nodal Officer Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nodalOfficerName}
                onChange={(e) => handleInputChange('nodalOfficerName', e.target.value)}
                placeholder="e.g. Dr. Anil Kumar"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nodal Officer Designation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nodalOfficerDesignation}
                onChange={(e) => handleInputChange('nodalOfficerDesignation', e.target.value)}
                placeholder="e.g. Registrar / Dean R&D"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nodal Officer Email (Login ID) <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.nodalOfficerEmail}
                onChange={(e) => {
                  handleInputChange('nodalOfficerEmail', e.target.value);
                  if (!formData.universityEmail) handleInputChange('universityEmail', e.target.value);
                }}
                placeholder="anil.kumar@university.ac.in"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nodal Officer Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.nodalOfficerPhone}
                onChange={(e) => handleInputChange('nodalOfficerPhone', e.target.value)}
                placeholder="+91 98000 00000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                University General Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.universityEmail}
                onChange={(e) => handleInputChange('universityEmail', e.target.value)}
                placeholder="info@university.ac.in"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">University Landline / Phone</label>
              <input
                type="text"
                value={formData.universityPhone}
                onChange={(e) => handleInputChange('universityPhone', e.target.value)}
                placeholder="0651-2205177"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Accreditation */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 animate-fadeIn">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Step 3: Quality Accreditation & Rankings</h2>
            <p className="text-xs text-slate-500">Enter NAAC recognition grade and NIRF ranking tier.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NAAC Grade</label>
              <select
                value={formData.naacGrade}
                onChange={(e) => handleInputChange('naacGrade', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="A++">A++</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B++">B++</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="Non-Accredited">Non-Accredited / Under Evaluation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Accreditation Validity</label>
              <input
                type="date"
                value={formData.naacValidity}
                onChange={(e) => handleInputChange('naacValidity', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NIRF Ranking (Optional)</label>
              <input
                type="number"
                value={formData.nirfRanking}
                onChange={(e) => handleInputChange('nirfRanking', e.target.value)}
                placeholder="e.g. 45"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Departments & Focus Expertise */}
      {currentStep === 4 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 animate-fadeIn">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Step 4: Academic Focus Areas & Problem Domains</h2>
            <p className="text-xs text-slate-500">Select the problem sectors and domains this university can research and resolve.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {FOCUS_AREA_OPTIONS.map((area) => {
              const isChecked = formData.focusAreas.includes(area);
              return (
                <label
                  key={area}
                  className={`flex items-center space-x-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                    isChecked
                      ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleFocusArea(area)}
                    className="w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-slate-800"
                  />
                  <span>{area}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 5: Capacity & Resources */}
      {currentStep === 5 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 animate-fadeIn">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Step 5: Institutional Capacity & Resources</h2>
            <p className="text-xs text-slate-500">Provide faculty strength, laboratory facilities, and current workload status.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Academic Departments</label>
              <input
                type="number"
                value={formData.departments}
                onChange={(e) => handleInputChange('departments', e.target.value)}
                className="w-20 mx-auto text-center font-black text-lg text-slate-900 bg-white border border-slate-200 rounded-lg py-1 focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Total Faculty Count</label>
              <input
                type="number"
                value={formData.totalFaculty}
                onChange={(e) => handleInputChange('totalFaculty', e.target.value)}
                className="w-20 mx-auto text-center font-black text-lg text-slate-900 bg-white border border-slate-200 rounded-lg py-1 focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Available R&D Faculty</label>
              <input
                type="number"
                value={formData.availableFaculty}
                onChange={(e) => handleInputChange('availableFaculty', e.target.value)}
                className="w-20 mx-auto text-center font-black text-lg text-slate-900 bg-white border border-slate-200 rounded-lg py-1 focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Laboratories & Facilities</label>
              <input
                type="number"
                value={formData.labsAndFacilities}
                onChange={(e) => handleInputChange('labsAndFacilities', e.target.value)}
                className="w-20 mx-auto text-center font-black text-lg text-slate-900 bg-white border border-slate-200 rounded-lg py-1 focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Active Projects</label>
              <input
                type="number"
                value={formData.activeProjects}
                onChange={(e) => handleInputChange('activeProjects', e.target.value)}
                className="w-20 mx-auto text-center font-black text-lg text-slate-900 bg-white border border-slate-200 rounded-lg py-1 focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Capacity Status</label>
              <select
                value={formData.capacityStatus}
                onChange={(e) => handleInputChange('capacityStatus', e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-hidden"
              >
                <option value="Available">Available</option>
                <option value="Limited">Limited</option>
                <option value="Full">Full</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: Account Credentials & Final Review */}
      {currentStep === 6 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Step 6: Review & HEI Login Credentials Generation</h2>
            <p className="text-xs text-slate-500">
              Verify all entered institutional details and generate portal login credentials for the HEI.
            </p>
          </div>

          {/* Credentials Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">HEI Dashboard Login Credentials</h3>
                  <p className="text-[11px] text-slate-400">These credentials will allow the university to log in to the platform.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={generateStrongPassword}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Regenerate Password</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Login ID / Email</span>
                <span className="text-xs font-bold text-white select-all">{loginEmail}</span>
              </div>

              <div className="bg-white/10 rounded-xl p-3 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Generated Password</span>
                  <span className="text-xs font-mono font-bold text-white select-all">
                    {showPassword ? formData.initialPassword : '••••••••••••'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
                    title="Copy Password"
                  >
                    {copiedPassword ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Review Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block pb-1 border-b border-slate-200">University Details</span>
              <div className="flex justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-bold text-slate-800">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Code:</span>
                <span className="font-mono font-bold text-slate-800">{formData.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Type:</span>
                <span className="font-medium text-slate-800">{formData.universityType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">District:</span>
                <span className="font-medium text-slate-800">{formData.district}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block pb-1 border-b border-slate-200">Nodal Officer</span>
              <div className="flex justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-bold text-slate-800">{formData.nodalOfficerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Designation:</span>
                <span className="font-medium text-slate-800">{formData.nodalOfficerDesignation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-medium text-slate-800">{formData.nodalOfficerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-medium text-slate-800">{formData.nodalOfficerPhone}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
        >
          Cancel Registration
        </button>

        <div className="flex items-center space-x-2">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="px-6 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
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
