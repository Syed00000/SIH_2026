import React, { useState } from 'react';
import {
  Building2,
  User,
  Award,
  Layers,
  GraduationCap,
  KeyRound,
  Save,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react';
import { JHARKHAND_DISTRICTS_DATA } from '../../data/jharkhandGisData.js';

export const EditUniversityView = ({ university, onCancel, onSuccess, onUpdateUniversity }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

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
    focusAreas: university?.focusAreas || [
      'Water Management',
      'Infrastructure',
      'Education',
      'Public Health'
    ],

    // Capacity
    departments: university?.quickSummary?.departments || 16,
    totalFaculty: university?.quickSummary?.totalFaculty || 120,
    availableFaculty: university?.quickSummary?.availableFaculty || 58,
    labsAndFacilities: university?.quickSummary?.labsAndFacilities || 28,
    activeProjects: university?.quickSummary?.activeProjects || 14,
    capacityStatus: university?.quickSummary?.capacityStatus || 'Available',

    // Password
    loginPassword: university?.credentials?.generatedPassword || 'HEI@Jharkhand2026!'
  });

  const DISTRICT_OPTIONS = Object.values(JHARKHAND_DISTRICTS_DATA).map((d) => d.name).sort();

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
    if (e) e.preventDefault();

    if (!formData.name.trim()) {
      setFormError('University name is required.');
      return;
    }
    if (!formData.code.trim()) {
      setFormError('University code is required.');
      return;
    }
    if (!formData.nodalOfficerName.trim() || !formData.nodalOfficerEmail.trim()) {
      setFormError('Nodal officer name and email are required.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

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
    <div className="space-y-6 animate-fadeIn select-none max-w-5xl mx-auto pb-10">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <button onClick={onCancel} className="hover:text-slate-900 cursor-pointer">
              User Governance
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button onClick={onCancel} className="hover:text-slate-900 cursor-pointer">
              Universities
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-bold">Edit</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Edit University: {university?.name}
          </h1>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Saving Changes...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {formError && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
          <span>{formError}</span>
        </div>
      )}

      {/* 1. Basic Information Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-1.5">
          <Building2 className="w-4 h-4 text-slate-700" />
          <span>1. Basic Institutional Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">University Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Short Name</label>
            <input
              type="text"
              value={formData.shortName}
              onChange={(e) => handleInputChange('shortName', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">University Code *</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">University Type</label>
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">District *</label>
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="Approved">Approved</option>
              <option value="Pending">Pending Review</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Establishment Year</label>
            <input
              type="number"
              value={formData.establishmentYear}
              onChange={(e) => handleInputChange('establishmentYear', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Website URL</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 2. Nodal Officer & Contact Details Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-1.5">
          <User className="w-4 h-4 text-slate-700" />
          <span>2. Nodal Officer & Contact Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nodal Officer Name *</label>
            <input
              type="text"
              value={formData.nodalOfficerName}
              onChange={(e) => handleInputChange('nodalOfficerName', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nodal Officer Designation</label>
            <input
              type="text"
              value={formData.nodalOfficerDesignation}
              onChange={(e) => handleInputChange('nodalOfficerDesignation', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nodal Officer Email *</label>
            <input
              type="email"
              value={formData.nodalOfficerEmail}
              onChange={(e) => handleInputChange('nodalOfficerEmail', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nodal Officer Phone *</label>
            <input
              type="text"
              value={formData.nodalOfficerPhone}
              onChange={(e) => handleInputChange('nodalOfficerPhone', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">University General Email</label>
            <input
              type="email"
              value={formData.universityEmail}
              onChange={(e) => handleInputChange('universityEmail', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">University Landline / Phone</label>
            <input
              type="text"
              value={formData.universityPhone}
              onChange={(e) => handleInputChange('universityPhone', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 3. Accreditation & Ranking Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-1.5">
          <Award className="w-4 h-4 text-slate-700" />
          <span>3. Accreditation & Rankings</span>
        </h3>

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
              <option value="Non-Accredited">Non-Accredited</option>
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
            <label className="block text-xs font-bold text-slate-700 mb-1">NIRF Ranking</label>
            <input
              type="number"
              value={formData.nirfRanking}
              onChange={(e) => handleInputChange('nirfRanking', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 4. Focus Areas Checkbox Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-1.5">
          <Layers className="w-4 h-4 text-slate-700" />
          <span>4. Research & Problem Focus Areas</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {FOCUS_AREA_OPTIONS.map((area) => {
            const isChecked = formData.focusAreas.includes(area);
            return (
              <label
                key={area}
                className={`flex items-center space-x-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                  isChecked
                    ? 'bg-slate-900 border-slate-900 text-white font-bold'
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

      {/* 5. Capacity & Resource Statistics */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-1.5">
          <GraduationCap className="w-4 h-4 text-slate-700" />
          <span>5. Capacity & Faculty Resources</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Departments</label>
            <input
              type="number"
              value={formData.departments}
              onChange={(e) => handleInputChange('departments', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Total Faculty</label>
            <input
              type="number"
              value={formData.totalFaculty}
              onChange={(e) => handleInputChange('totalFaculty', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Available R&D Faculty</label>
            <input
              type="number"
              value={formData.availableFaculty}
              onChange={(e) => handleInputChange('availableFaculty', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Labs & Facilities</label>
            <input
              type="number"
              value={formData.labsAndFacilities}
              onChange={(e) => handleInputChange('labsAndFacilities', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Active Projects</label>
            <input
              type="number"
              value={formData.activeProjects}
              onChange={(e) => handleInputChange('activeProjects', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Capacity Status</label>
            <select
              value={formData.capacityStatus}
              onChange={(e) => handleInputChange('capacityStatus', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            >
              <option value="Available">Available</option>
              <option value="Limited">Limited</option>
              <option value="Full">Full</option>
            </select>
          </div>
        </div>
      </div>

      {/* 6. Credentials Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">HEI Login Password Override</h3>
            <p className="text-[11px] text-slate-400">Modify the active login password for this university portal user.</p>
          </div>
        </div>

        <div className="max-w-md">
          <label className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Account Password</label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.loginPassword}
              onChange={(e) => handleInputChange('loginPassword', e.target.value)}
              className="w-full px-3 py-2 pr-16 bg-white/10 border border-white/20 rounded-xl text-xs font-mono font-bold text-white focus:border-white focus:outline-hidden"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 p-1 text-slate-400 hover:text-white rounded cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSubmitting ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>
    </div>
  );
};

export default EditUniversityView;
