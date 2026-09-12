import React, { useState, useEffect } from 'react';
import { 
  Building2, Map, Users, Shield, FileText, Upload, Settings, 
  ArrowLeft, CheckCircle2, ChevronRight, DownloadCloud, Lock, FileBadge2, Save,
  AlertCircle, KeyRound, Sparkles, Send
} from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../data/governmentConstants.js';

export const DepartmentEditPanel = ({ department, onBack, onSave }) => {
  const isEditing = Boolean(department);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'State Ministry',
    departmentType: 'State Government Department',
    parentAuthority: 'Government of Jharkhand',
    officialWebsite: '',
    headEmail: '',
    officeAddress: '',
    applicableJurisdiction: 'Entire State of Jharkhand',
    headquartersLocation: 'Ranchi',
    operationalDistrictsType: 'All 24 Districts (State Wide)',
    district: '',
    involvedLowerLevels: [
      'State Department (Mandatory)',
      'District Department',
      'Block / Sub-Division / Local Office',
      'Gram Panchayat / Urban Local Body'
    ],
    headName: '',
    headRole: 'Principal Secretary',
    headPhone: '',
    officeSecretariatLocation: '',
    nodalOfficerName: '',
    nodalOfficerDesignation: 'Under Secretary',
    nodalOfficerEmail: '',
    nodalOfficerPhone: '',
    description: '',
    keyFunctions: [''],
    powersApprovalAuthority: '',
    schemesManaged: '',
    departmentsCoordinated: '',
    problemCategoriesHandled: '',
    goNumber: '',
    goDate: '',
    verificationStatus: 'Pending Verification',
    status: 'Active',
    effectiveFrom: new Date().toISOString().split('T')[0],
    approvalRequired: true,
    remarks: '',
    credentials: {
      loginId: '',
      loginEmail: '',
      password: '',
      mfaRequired: false,
      firstLoginPasswordChange: true,
      credentialCreatedBy: 'Super Admin (Government)',
      credentialStatus: 'Pending Activation'
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '',
        code: department.code || department.deptId || '',
        category: department.category || 'State Ministry',
        departmentType: department.departmentType || 'State Government Department',
        parentAuthority: department.parentAuthority || 'Government of Jharkhand',
        officialWebsite: department.officialWebsite || '', 
        headEmail: department.headEmail || '',
        officeAddress: department.officeAddress || '',
        applicableJurisdiction: department.applicableJurisdiction || 'Entire State of Jharkhand',
        headquartersLocation: department.headquartersLocation || 'Ranchi',
        operationalDistrictsType: department.operationalDistrictsType || 'All 24 Districts (State Wide)',
        district: department.district || '',
        involvedLowerLevels: department.involvedLowerLevels?.length
          ? department.involvedLowerLevels
          : [
              'State Department (Mandatory)',
              'District Department',
              'Block / Sub-Division / Local Office',
              'Gram Panchayat / Urban Local Body'
            ],
        headName: department.headName || '',
        headRole: department.headRole || 'Principal Secretary',
        headPhone: department.headPhone || '',
        officeSecretariatLocation: department.officeSecretariatLocation || '',
        nodalOfficerName: department.nodalOfficerName || '',
        nodalOfficerDesignation: department.nodalOfficerDesignation || 'Under Secretary',
        nodalOfficerEmail: department.nodalOfficerEmail || '',
        nodalOfficerPhone: department.nodalOfficerPhone || '',
        description: department.description || '',
        keyFunctions: department.keyFunctions?.length ? department.keyFunctions : [''], 
        powersApprovalAuthority: department.powersApprovalAuthority || '',
        schemesManaged: department.schemesManaged || '',
        departmentsCoordinated: department.departmentsCoordinated || '',
        problemCategoriesHandled: department.problemCategoriesHandled || '',
        goNumber: department.goNumber || '',
        goDate: department.goDate || '',
        verificationStatus: department.verificationStatus || 'Pending Verification',
        status: department.status || 'Active',
        effectiveFrom: department.effectiveFrom || new Date().toISOString().split('T')[0],
        approvalRequired: department.approvalRequired ?? true,
        remarks: department.remarks || '',
        credentials: {
          loginId: department.credentials?.loginId || '',
          loginEmail: department.credentials?.loginEmail || '',
          password: department.credentials?.password || '', 
          mfaRequired: department.credentials?.mfaRequired || false,
          firstLoginPasswordChange: department.credentials?.firstLoginPasswordChange ?? true,
          credentialCreatedBy: department.credentials?.credentialCreatedBy || 'Super Admin (Government)',
          credentialStatus: department.credentials?.credentialStatus || 'Pending Activation'
        }
      });
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('credentials.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        credentials: { ...prev.credentials, [field]: type === 'checkbox' ? checked : value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCheckboxChange = (level) => {
    setFormData(prev => {
      if (level === 'State Department (Mandatory)') return prev;
      const isChecked = prev.involvedLowerLevels.includes(level);
      const newLevels = isChecked 
        ? prev.involvedLowerLevels.filter((l) => l !== level)
        : [...prev.involvedLowerLevels, level];
      return { ...prev, involvedLowerLevels: newLevels };
    });
  };

  const handleKeyFunctionChange = (index, value) => {
    const newFunctions = [...formData.keyFunctions];
    newFunctions[index] = value;
    setFormData(prev => ({ ...prev, keyFunctions: newFunctions }));
  };

  const addKeyFunction = () => {
    setFormData(prev => ({ ...prev, keyFunctions: [...prev.keyFunctions, ''] }));
  };

  const removeKeyFunction = (index) => {
    if (formData.keyFunctions.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      keyFunctions: prev.keyFunctions.filter((_, i) => i !== index)
    }));
  };

  const handleGeneratePassword = () => {
    const generated = 'Jharkhand@' + Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({
      ...prev,
      credentials: { ...prev.credentials, password: generated }
    }));
    showToast('Secure password generated!');
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Department Name is Required';
    if (!formData.headEmail.trim() && !formData.credentials.loginEmail.trim()) {
      errs.headEmail = 'Official Department / Login Email is Required';
    }
    setErrors(errs);
    
    if (Object.keys(errs).length > 0) {
      alert(`Validation Failed:\n${Object.values(errs).join('\n')}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      if (!payload.credentials.loginEmail) {
        payload.credentials.loginEmail = payload.headEmail;
      }
      if (!payload.credentials.loginId) {
        payload.credentials.loginId = payload.code || payload.name.split(' ').map(w => w[0] || '').join('').toUpperCase();
      }
      await onSave(payload);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to save department');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 select-none max-w-[1400px] mx-auto pb-12 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-bold flex items-center space-x-2 bg-slate-900 text-white border-slate-800 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card - Consistent with User Admin Theme */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Back to Departments"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-0.5">
              <span>Departments</span>
              <span>/</span>
              <span>State Ministries</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">{isEditing ? 'Edit Department' : 'Register State Department'}</span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-700" />
              <span>{isEditing ? `Edit: ${department?.name || 'Department'}` : 'Register State Department'}</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Create state-level department, define administrative hierarchy, and configure secure department access
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="department-edit-form"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-slate-300" />
            <span>{isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create State Department')}</span>
          </button>
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Please complete all required fields marked with *</span>
        </div>
      )}

      {/* Main Grid: Form Sections + Sticky Access Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Main Form (8 Columns) */}
        <form id="department-edit-form" onSubmit={handleSubmit} className="lg:col-span-8 space-y-5 text-xs">
          
          {/* Section 1: Department Identity */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">1. Department Identity</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Basic information & office location</span>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Department / Ministry Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Department of Higher & Technical Education"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Department Code / Unique ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  placeholder="e.g. DHTE-001"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 uppercase font-mono font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Department Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                >
                  <option value="State Ministry">State Ministry</option>
                  <option value="District Department">District Department</option>
                  <option value="Block / Tehsil Office">Block / Tehsil Office</option>
                  <option value="Gram Panchayat">Gram Panchayat</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Department Type
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.departmentType}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-xs font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Parent Administrative Authority
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.parentAuthority}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-xs font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Official Website
                </label>
                <input
                  type="text"
                  name="officialWebsite"
                  placeholder="https://dhte.jharkhand.gov.in"
                  value={formData.officialWebsite}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Official Department Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="headEmail"
                  placeholder="dept@jharkhand.gov.in"
                  value={formData.headEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Office Secretariat Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="officeAddress"
                  rows={3}
                  placeholder="e.g. Project Bhawan, Dhurwa, Ranchi, Jharkhand - 834004"
                  value={formData.officeAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Department Seal / Logo
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl bg-slate-50/60 hover:bg-slate-100/60 p-3.5 text-center cursor-pointer transition-colors flex flex-col items-center justify-center h-[76px]">
                  <DownloadCloud className="w-5 h-5 text-slate-500 mb-1" />
                  <p className="text-[10px] text-slate-600 font-bold">Upload Logo (PNG, JPG)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Administrative Scope & Hierarchy */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Map className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">2. Administrative Scope & Hierarchy</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Jurisdictional coverage & sub-tiers</span>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Jurisdiction <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="applicableJurisdiction"
                    value={formData.applicableJurisdiction}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                  >
                    <option value="Entire State of Jharkhand">Entire State of Jharkhand</option>
                    <option value="District Level Jurisdiction">District Level Jurisdiction</option>
                    <option value="Block Level Jurisdiction">Block Level Jurisdiction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                    District Coverage <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 transition-colors">
                      <input
                        type="radio"
                        name="operationalDistrictsType"
                        value="All 24 Districts (State Wide)"
                        checked={formData.operationalDistrictsType === 'All 24 Districts (State Wide)'}
                        onChange={handleChange}
                        className="accent-slate-900"
                      />
                      <span className="font-bold text-slate-900 text-xs">All 24 Districts (State Wide)</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 transition-colors">
                      <input
                        type="radio"
                        name="operationalDistrictsType"
                        value="Select Specific Districts"
                        checked={formData.operationalDistrictsType === 'Select Specific Districts'}
                        onChange={handleChange}
                        className="accent-slate-900"
                      />
                      <span className="text-slate-700 font-medium text-xs">Select Specific Districts</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                  Administrative Levels Enabled
                </label>
                <div className="space-y-2">
                  {[
                    'State Department (Mandatory)',
                    'District Department',
                    'Block / Sub-Division / Local Office',
                    'Gram Panchayat / Urban Local Body',
                    'Ward / Field Office'
                  ].map((level) => {
                    const isChecked = formData.involvedLowerLevels.includes(level);
                    return (
                      <label
                        key={level}
                        className={`flex items-center space-x-2.5 p-2 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100/70'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(level)}
                        />
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-white border-white' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />}
                        </div>
                        <span className="text-xs font-semibold">{level}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
                <span className="text-slate-500 font-bold mt-0.5">ⓘ</span>
                <p className="leading-relaxed">
                  Note: Lower administrative levels are configurable per department requirements and propagate telemetry up the hierarchy automatically.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: State Department Leadership */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">3. State Department Leadership</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">HOD & Nodal Officer Information</span>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Head of Department (HOD) Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="headName"
                  placeholder="e.g. Shri Ramesh Kumar, IAS"
                  value={formData.headName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Designation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="headRole"
                  placeholder="e.g. Principal Secretary"
                  value={formData.headRole}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Official HOD Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="headEmail"
                  placeholder="hod@jharkhand.gov.in"
                  value={formData.headEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Official HOD Contact Number
                </label>
                <input
                  type="text"
                  name="headPhone"
                  placeholder="+91 9876543210"
                  value={formData.headPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                />
              </div>

              <div className="md:col-span-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block mb-3">
                  Designated Nodal Officer Contact
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nodal Officer Name
                    </label>
                    <input
                      type="text"
                      name="nodalOfficerName"
                      placeholder="e.g. Smt. Anita Verma"
                      value={formData.nodalOfficerName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nodal Officer Email
                    </label>
                    <input
                      type="email"
                      name="nodalOfficerEmail"
                      placeholder="nodal@jharkhand.gov.in"
                      value={formData.nodalOfficerEmail}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nodal Officer Phone
                    </label>
                    <input
                      type="text"
                      name="nodalOfficerPhone"
                      placeholder="+91 9876543210"
                      value={formData.nodalOfficerPhone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Department Login & Portal Access */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">4. Department Login & Portal Access</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Principal portal credentials</span>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Login ID / Official Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="credentials.loginEmail"
                  placeholder="dept@jharkhand.gov.in"
                  value={formData.credentials.loginEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Username / Department UID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="credentials.loginId"
                  placeholder="e.g. DHTE-001"
                  value={formData.credentials.loginId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Initial Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="credentials.password"
                  placeholder="Enter or generate password"
                  value={formData.credentials.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-mono"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="w-full py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Generate Secure Password</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block text-xs">MFA Authentication</span>
                  <span className="text-[10px] text-slate-500">Require multi-factor OTP on login</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="credentials.mfaRequired"
                    checked={formData.credentials.mfaRequired}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                </label>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block text-xs">Password Reset on 1st Login</span>
                  <span className="text-[10px] text-slate-500">Force password change initially</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="credentials.firstLoginPasswordChange"
                    checked={formData.credentials.firstLoginPasswordChange}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Section 5: Mandate, Functions & Authority */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">5. Mandate, Functions & Authority</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Civic duties and scope</span>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Mandate / Department Objective <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Describe the main mandate, scope, and key objectives of this department..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                  Key Functions & Responsibilities
                </label>
                <div className="space-y-2">
                  {formData.keyFunctions.map((kf, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-400 text-xs w-4">{i + 1}.</span>
                      <input
                        type="text"
                        value={kf}
                        onChange={(e) => handleKeyFunctionChange(i, e.target.value)}
                        placeholder="e.g. Policy formulation, Higher education infrastructure development..."
                        className="flex-1 px-3 py-1.5 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                      />
                      {formData.keyFunctions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeKeyFunction(i)}
                          className="text-slate-400 hover:text-red-600 px-2 py-1 text-xs font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addKeyFunction}
                    className="text-slate-900 hover:text-black font-bold text-xs mt-1 inline-flex items-center space-x-1 cursor-pointer"
                  >
                    <span>+ Add Another Function</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Powers & Approval Authority
                </label>
                <input
                  type="text"
                  name="powersApprovalAuthority"
                  placeholder="e.g. Policy approval, university funding..."
                  value={formData.powersApprovalAuthority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Major Schemes Managed
                </label>
                <input
                  type="text"
                  name="schemesManaged"
                  placeholder="e.g. Student fellowship, Innovation Labs..."
                  value={formData.schemesManaged}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Documents & Government Verification */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileBadge2 className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">6. Documents & Government Verification</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Official Government Orders</span>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Government Order (GO) No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="goNumber"
                  placeholder="e.g. GO/JH/2026/089"
                  value={formData.goNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  GO Notification Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="goDate"
                  value={formData.goDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Verification Status
                </label>
                <div className="w-full px-3 py-2 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-800 font-bold text-xs flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>{formData.verificationStatus}</span>
                </div>
              </div>

              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl bg-slate-50/60 hover:bg-slate-100/60 p-3 text-center cursor-pointer transition-colors flex items-center justify-center space-x-2.5">
                  <Upload className="w-4 h-4 text-slate-500" />
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-slate-800">Upload Official GO Document</p>
                    <p className="text-[9px] text-slate-400">PDF, scanned copy (Max 5 MB)</p>
                  </div>
                </div>

                <div className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl bg-slate-50/60 hover:bg-slate-100/60 p-3 text-center cursor-pointer transition-colors flex items-center justify-center space-x-2.5">
                  <Upload className="w-4 h-4 text-slate-500" />
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-slate-800">Upload Department Hierarchy PDF</p>
                    <p className="text-[9px] text-slate-400">PDF structure chart (Max 5 MB)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: Activation & Audit */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">7. Activation & Audit Status</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">State status flags</span>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-2">
                    Department Status <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="Active"
                        checked={formData.status === 'Active'}
                        onChange={handleChange}
                        className="accent-slate-900"
                      />
                      <span className="text-emerald-700 font-bold">Active</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="Inactive"
                        checked={formData.status === 'Inactive'}
                        onChange={handleChange}
                        className="accent-slate-900"
                      />
                      <span className="text-slate-600 font-medium">Inactive</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Effective From Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="effectiveFrom"
                    value={formData.effectiveFrom}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    State Higher Approval
                  </label>
                  <div className="flex items-center space-x-2 pt-1.5">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="approvalRequired"
                        checked={formData.approvalRequired}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                    </label>
                    <span className="text-[11px] text-slate-600 font-medium">Requires approval</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Administrative Remarks (Optional)
                </label>
                <input
                  type="text"
                  name="remarks"
                  placeholder="Any operational notes or comments..."
                  value={formData.remarks}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Bottom Form Action Buttons */}
            <div className="bg-slate-50/80 border-t border-slate-100 p-4 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />
                <span>{isSubmitting ? 'Saving...' : (isEditing ? 'Update Department' : 'Create State Department')}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Right Sticky Column: Department Access Summary (4 Columns) */}
        <div className="lg:col-span-4 space-y-4 sticky top-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Users className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Department Access Summary
              </h2>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200/70 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Department Type
                  </span>
                  <p className="text-xs font-bold text-slate-900">{formData.departmentType}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Map className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Jurisdiction
                  </span>
                  <p className="text-xs font-bold text-slate-900">{formData.applicableJurisdiction}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Map className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    District Coverage
                  </span>
                  <p className="text-xs font-bold text-slate-900">
                    {formData.operationalDistrictsType.includes('All') ? 'All 24 Districts' : 'Specific Districts'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Login Role
                  </span>
                  <p className="text-xs font-bold text-slate-900">State Department Principal</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Lower Levels
                  </span>
                  <p className="text-xs font-bold text-slate-900">Configurable ({formData.involvedLowerLevels.length} tiers active)</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Credential Status
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  {formData.credentials.credentialStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DepartmentEditPanel;
