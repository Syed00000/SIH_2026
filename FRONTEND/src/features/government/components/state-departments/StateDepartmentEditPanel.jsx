import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Settings, ArrowLeft, CheckCircle2, Save,
  AlertCircle, KeyRound, Sparkles, Network, FileText
} from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../data/governmentConstants.js';

export const StateDepartmentEditPanel = ({ department, onBack, onSave }) => {
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
    operationalDistrictsType: 'All Districts',
    district: 'Ranchi',
    districtCoverage: [],
    hierarchyConfig: [
      'State Department',
      'District Department',
      'Block / Tehsil Office',
      'Ward / Field Office'
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
    mandate: {
      objective: '',
      description: ''
    },
    keyFunctions: [''],
    powersApprovalAuthority: '',
    schemesManaged: '',
    departmentsCoordinated: '',
    problemCategoriesHandled: '',
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
        category: 'State Ministry',
        departmentType: department.departmentType || 'State Government Department',
        parentAuthority: department.parentAuthority || 'Government of Jharkhand',
        officialWebsite: department.officialWebsite || '', 
        headEmail: department.headEmail || '',
        officeAddress: department.officeAddress || '',
        applicableJurisdiction: department.applicableJurisdiction || 'Entire State of Jharkhand',
        headquartersLocation: department.headquartersLocation || 'Ranchi',
        operationalDistrictsType: department.operationalDistrictsType || 'All Districts',
        district: department.district || 'Ranchi',
        districtCoverage: department.districtCoverage || [],
        hierarchyConfig: department.hierarchyConfig?.length ? department.hierarchyConfig : [
          'State Department',
          'District Department',
          'Block / Tehsil Office',
          'Ward / Field Office'
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
        mandate: department.mandate || { objective: '', description: '' },
        keyFunctions: department.keyFunctions?.length ? department.keyFunctions : [''], 
        powersApprovalAuthority: department.powersApprovalAuthority || '',
        schemesManaged: department.schemesManaged || '',
        departmentsCoordinated: department.departmentsCoordinated || '',
        problemCategoriesHandled: department.problemCategoriesHandled || '',
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
    } else if (name.startsWith('mandate.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        mandate: { ...prev.mandate, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDistrictCoverageToggle = (dist) => {
    setFormData(prev => {
      const coverage = prev.districtCoverage || [];
      const newCoverage = coverage.includes(dist) 
        ? coverage.filter(d => d !== dist) 
        : [...coverage, dist];
      return { ...prev, districtCoverage: newCoverage };
    });
  };

  const handleHierarchyToggle = (level) => {
    setFormData(prev => {
      if (level === 'State Department') return prev; // Cannot toggle root
      const isChecked = prev.hierarchyConfig.includes(level);
      const newLevels = isChecked 
        ? prev.hierarchyConfig.filter((l) => l !== level)
        : [...prev.hierarchyConfig, level];
      return { ...prev, hierarchyConfig: newLevels };
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

      {/* Top Header Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-0.5">
              <span>State Governance</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">{isEditing ? 'Edit State Department' : 'Register State Department'}</span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-700" />
              <span>{isEditing ? `Edit: ${department?.name}` : `Register New State Department`}</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Create and configure a new state-level government department.
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
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Department / Ministry Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Department of Rural Development"
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
                  placeholder="e.g. RDD-JH-001"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 uppercase font-mono font-medium"
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
                  rows={2}
                  placeholder="e.g. Project Bhawan, Dhurwa, Ranchi"
                  value={formData.officeAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Administrative Hierarchy */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Network className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">2. Administrative Hierarchy & Jurisdiction</h3>
              </div>
            </div>
            
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  District Coverage
                </label>
                <select
                  name="operationalDistrictsType"
                  value={formData.operationalDistrictsType}
                  onChange={handleChange}
                  className="w-full md:w-1/2 px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium mb-3"
                >
                  <option value="All Districts">All Districts (Entire State)</option>
                  <option value="Selected Districts">Selected Districts Only</option>
                </select>

                {formData.operationalDistrictsType === 'Selected Districts' && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl max-h-48 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {JHARKHAND_DISTRICTS_LIST.map((dist) => (
                        <label key={dist} className="flex items-center space-x-2 cursor-pointer p-1.5 hover:bg-slate-100 rounded">
                          <input
                            type="checkbox"
                            checked={formData.districtCoverage.includes(dist)}
                            onChange={() => handleDistrictCoverageToggle(dist)}
                            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                          />
                          <span className="text-[11px] font-medium text-slate-700">{dist}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-2">
                  Configurable Department Hierarchy (Select Applicable Lower Levels)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    'State Department',
                    'District Department',
                    'Division / Zone',
                    'Sub-Division',
                    'Block / Tehsil Office',
                    'Municipality',
                    'Municipal Corporation',
                    'Gram Panchayat',
                    'Ward / Field Office'
                  ].map((level) => (
                    <label key={level} className={`flex items-start space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      formData.hierarchyConfig.includes(level)
                        ? 'border-[#007A61] bg-[#007A61]/5'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}>
                      <input
                        type="checkbox"
                        disabled={level === 'State Department'}
                        checked={formData.hierarchyConfig.includes(level)}
                        onChange={() => handleHierarchyToggle(level)}
                        className="mt-0.5 rounded border-slate-300 text-[#007A61] focus:ring-[#007A61]"
                      />
                      <span className={`text-[11px] font-bold ${formData.hierarchyConfig.includes(level) ? 'text-[#007A61]' : 'text-slate-600'}`}>
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Mandate & Functions */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">3. Mandate & Functions</h3>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Department Objective / Mandate
                </label>
                <textarea
                  name="mandate.objective"
                  rows={2}
                  placeholder="Primary objective of the department..."
                  value={formData.mandate.objective}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Key Functions
                </label>
                <div className="space-y-2">
                  {formData.keyFunctions.map((func, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={func}
                        onChange={(e) => handleKeyFunctionChange(index, e.target.value)}
                        placeholder="e.g. Policy formulation, monitoring..."
                        className="flex-1 px-3 py-1.5 bg-slate-50/60 border border-slate-200 rounded-lg outline-none text-xs text-slate-900 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => removeKeyFunction(index)}
                        className="px-2 py-1.5 text-red-500 hover:bg-red-50 rounded-lg font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addKeyFunction}
                    className="text-[11px] font-bold text-[#007A61] hover:underline"
                  >
                    + Add Key Function
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Department Leadership */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">4. Department Leadership</h3>
              </div>
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
            </div>
          </div>

          {/* Section 5: State Department Principal Credentials */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">5. State Department Principal Login & Access</h3>
              </div>
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
                  placeholder="e.g. RDD-JH-001"
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

          <div className="bg-slate-50/80 border-t border-slate-100 p-4 flex items-center justify-end gap-2.5 rounded-2xl">
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
              <span>{isSubmitting ? 'Saving...' : (isEditing ? 'Update State Department' : 'Create State Department')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


