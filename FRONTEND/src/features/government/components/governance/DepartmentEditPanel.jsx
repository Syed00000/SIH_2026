import React, { useState, useEffect } from 'react';
import { 
  Building2, Map, Users, Shield, FileText, Upload, Settings, 
  ArrowLeft, CheckCircle2, ChevronRight, DownloadCloud, Lock, FileBadge2, Save,
  AlertCircle, KeyRound, Sparkles, Send
} from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../data/governmentConstants.js';

export const DepartmentEditPanel = ({ department, defaultCategory = 'State Ministry', onBack, onSave }) => {
  const isEditing = Boolean(department);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: defaultCategory,
    departmentType: 'State Government Department',
    parentAuthority: 'Government of Jharkhand',
    officialWebsite: '',
    headEmail: '',
    officeAddress: '',
    applicableJurisdiction: 'Entire State of Jharkhand',
    headquartersLocation: 'Ranchi',
    operationalDistrictsType: 'All 24 Districts (State Wide)',
    district: 'Ranchi',
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
        district: department.district || 'Ranchi',
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
    const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijkmnopqrstuvwxyz';
    const numberChars = '23456789';
    const specialChars = '!@#$%';
    const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;

    const getRandomChar = (charset) => {
      if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
        const arr = new Uint32Array(1);
        window.crypto.getRandomValues(arr);
        return charset.charAt(arr[0] % charset.length);
      }
      return charset.charAt(Math.floor(Math.random() * charset.length));
    };

    const characters = [
      getRandomChar(uppercaseChars),
      getRandomChar(lowercaseChars),
      getRandomChar(numberChars),
      getRandomChar(specialChars)
    ];

    for (let i = 4; i < 12; i++) {
      characters.push(getRandomChar(allChars));
    }

    for (let i = characters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [characters[i], characters[j]] = [characters[j], characters[i]];
    }

    const generated = characters.join('');
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
              <span>{formData.category}</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">{isEditing ? 'Edit Department' : `Register ${formData.category}`}</span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-700" />
              <span>{isEditing ? `Edit: ${department?.name || 'Department'}` : `Register ${formData.category}`}</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Create department, define administrative hierarchy, and configure secure department access
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
            <span>{isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : `Create ${formData.category}`)}</span>
          </button>
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Please complete all required fields marked with *</span>
        </div>
      )}

      {/* Main Form */}
      <div className="flex justify-center items-start">
        <form id="department-edit-form" onSubmit={handleSubmit} className="w-full max-w-4xl space-y-5 text-xs">
          
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

              {(formData.category === 'District Department' || formData.category === 'Block / Tehsil Office' || formData.category === 'Gram Panchayat') && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Select District <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                  >
                    {JHARKHAND_DISTRICTS_LIST.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}

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
            </div>
          </div>

          {/* Section 3: Department Leadership */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">3. Department Leadership</h3>
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
                <span>{isSubmitting ? 'Saving...' : (isEditing ? 'Update Department' : `Create ${formData.category}`)}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentEditPanel;
