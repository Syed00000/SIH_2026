import React, { useState, useEffect } from 'react';
import { 
  Building2, Map, Users, Shield, FileText, Upload, Settings, 
  ArrowLeft, CheckCircle2, ChevronRight, DownloadCloud, Lock, FileBadge2, Save
} from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../data/governmentConstants.js';

export const DepartmentEditPanel = ({ department, onBack, onSave }) => {
  const isEditing = Boolean(department);

  const [formData, setFormData] = useState({
    name: '', code: '', category: 'State Ministry', departmentType: 'State Government Department',
    parentAuthority: 'Government of Jharkhand', officialWebsite: '', headEmail: '', officeAddress: '',
    applicableJurisdiction: 'Entire State of Jharkhand', headquartersLocation: 'Ranchi',
    operationalDistrictsType: 'All 24 Districts (State Wide)', district: '',
    involvedLowerLevels: ['State Department (Mandatory)', 'District Department', 'Block / Sub-Division / Local Office', 'Gram Panchayat / Urban Local Body'],
    headName: '', headRole: 'Principal Secretary', headPhone: '', officeSecretariatLocation: '',
    nodalOfficerName: '', nodalOfficerDesignation: 'Under Secretary', nodalOfficerEmail: '', nodalOfficerPhone: '',
    description: '', keyFunctions: [''], powersApprovalAuthority: '', schemesManaged: '', departmentsCoordinated: '', problemCategoriesHandled: '',
    goNumber: '', goDate: '', verificationStatus: 'Pending Verification',
    status: 'Active', effectiveFrom: new Date().toISOString().split('T')[0], approvalRequired: true, remarks: '',
    credentials: {
      loginId: '', loginEmail: '', password: '', mfaRequired: false, firstLoginPasswordChange: true,
      credentialCreatedBy: 'Super Admin (Government)', credentialStatus: 'Pending Activation'
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '', code: department.code || department.deptId || '',
        category: department.category || 'State Ministry', departmentType: department.departmentType || 'State Government Department',
        parentAuthority: department.parentAuthority || 'Government of Jharkhand', officialWebsite: department.officialWebsite || '', 
        headEmail: department.headEmail || '', officeAddress: department.officeAddress || '',
        applicableJurisdiction: department.applicableJurisdiction || 'Entire State of Jharkhand', headquartersLocation: department.headquartersLocation || 'Ranchi',
        operationalDistrictsType: department.operationalDistrictsType || 'All 24 Districts (State Wide)', district: department.district || '',
        involvedLowerLevels: department.involvedLowerLevels?.length ? department.involvedLowerLevels : ['State Department (Mandatory)', 'District Department', 'Block / Sub-Division / Local Office', 'Gram Panchayat / Urban Local Body'],
        headName: department.headName || '', headRole: department.headRole || 'Principal Secretary', headPhone: department.headPhone || '', officeSecretariatLocation: department.officeSecretariatLocation || '',
        nodalOfficerName: department.nodalOfficerName || '', nodalOfficerDesignation: department.nodalOfficerDesignation || 'Under Secretary',
        nodalOfficerEmail: department.nodalOfficerEmail || '', nodalOfficerPhone: department.nodalOfficerPhone || '',
        description: department.description || '', keyFunctions: department.keyFunctions?.length ? department.keyFunctions : [''], 
        powersApprovalAuthority: department.powersApprovalAuthority || '', schemesManaged: department.schemesManaged || '', departmentsCoordinated: department.departmentsCoordinated || '', problemCategoriesHandled: department.problemCategoriesHandled || '',
        goNumber: department.goNumber || '', goDate: department.goDate || '', verificationStatus: department.verificationStatus || 'Pending Verification',
        status: department.status || 'Active', effectiveFrom: department.effectiveFrom || new Date().toISOString().split('T')[0], approvalRequired: department.approvalRequired ?? true, remarks: department.remarks || '',
        credentials: {
          loginId: department.credentials?.loginId || '', loginEmail: department.credentials?.loginEmail || '', password: department.credentials?.password || '', 
          mfaRequired: department.credentials?.mfaRequired || false, firstLoginPasswordChange: department.credentials?.firstLoginPasswordChange ?? true,
          credentialCreatedBy: department.credentials?.credentialCreatedBy || 'Super Admin (Government)', credentialStatus: department.credentials?.credentialStatus || 'Pending Activation'
        }
      });
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('credentials.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, credentials: { ...prev.credentials, [field]: type === 'checkbox' ? checked : value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCheckboxChange = (level) => {
    setFormData((prev) => {
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

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Department Name is Required';
    if (!formData.headEmail.trim() && !formData.credentials.loginEmail.trim()) {
      errs.headEmail = 'Login Email is Required';
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
      // Ensure credentials loginEmail is synced if missing
      const payload = { ...formData };
      if (!payload.credentials.loginEmail) {
        payload.credentials.loginEmail = payload.headEmail;
      }
      await onSave(payload);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to save department');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="select-none bg-slate-50 min-h-screen pb-12">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button type="button" onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                <span>Departments</span> <ChevronRight className="w-3 h-3" />
                <span>State Ministries</span> <ChevronRight className="w-3 h-3" />
                <span className="text-[#007A61] font-bold">Register State Department</span>
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Building2 className="w-5 h-5 text-[#007A61]" />
                {isEditing ? `Edit: ${department?.name}` : 'Register State Department'}
              </h1>
              <p className="text-xs text-slate-500">Create state-level department, define administrative hierarchy, and create secure department access</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onBack} className="px-5 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2 bg-[#007A61] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#00624e] disabled:opacity-50 transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" /> {isSubmitting ? 'Saving...' : 'Create State Department'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6 items-start">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* Section 1: Department Identity */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <Building2 className="w-4 h-4 text-[#007A61]" />
              <div>
                <h2 className="text-sm font-bold text-[#007A61]">Department Identity</h2>
                <p className="text-[11px] text-slate-500">Provide basic information about the state department</p>
              </div>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Department / Ministry Name *</label>
                <input type="text" name="name" placeholder="e.g. Department of Rural Development" value={formData.name} onChange={handleChange} className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Department Code / Unique ID *</label>
                <input type="text" name="code" placeholder="e.g. RD-001" value={formData.code} onChange={handleChange} className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Department Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]">
                  <option value="State Ministry">Select Category</option>
                  <option value="State Ministry">State Ministry</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Department Type *</label>
                <input type="text" disabled value={formData.departmentType} className="w-full p-2.5 bg-slate-100 text-slate-500 rounded-lg border border-slate-200 focus:outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="font-bold text-slate-700 block mb-1.5">Parent Government / Administrative Authority</label>
                <input type="text" disabled value={formData.parentAuthority} className="w-full p-2.5 bg-slate-100 text-slate-500 rounded-lg border border-slate-200 focus:outline-none" />
              </div>

              <div className="md:col-span-1">
                <label className="font-bold text-slate-700 block mb-1.5">Official Website</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔗</span>
                  <input type="text" name="officialWebsite" placeholder="https://example.jharkhand.gov.in" value={formData.officialWebsite} onChange={handleChange} className="w-full pl-8 p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="font-bold text-slate-700 block mb-1.5">Official Department Email *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">✉️</span>
                  <input type="email" name="headEmail" placeholder="dept@jharkhand.gov.in" value={formData.headEmail} onChange={handleChange} className="w-full pl-8 p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="font-bold text-slate-700 block mb-1.5">Office Address *</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">📍</span>
                  <textarea name="officeAddress" rows={3} placeholder="e.g. Project Bhawan, Dhurwa, Ranchi - 834004" value={formData.officeAddress} onChange={handleChange} className="w-full pl-8 p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
                </div>
              </div>
              <div className="md:col-span-1 flex flex-col justify-end">
                <label className="font-bold text-slate-700 block mb-1.5">Department Logo</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 p-4 text-center cursor-pointer hover:bg-slate-100 hover:border-[#007A61] transition-colors">
                  <DownloadCloud className="w-6 h-6 text-[#007A61] mx-auto mb-2" />
                  <p className="text-[10px] text-slate-500">Click to upload or drag & drop<br/>PNG, JPG (Max 2 MB)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Administrative Scope & Hierarchy */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <Map className="w-4 h-4 text-[#007A61]" />
              <div>
                <h2 className="text-sm font-bold text-[#007A61]">Administrative Scope & Hierarchy</h2>
                <p className="text-[11px] text-slate-500">Define jurisdiction and applicable administrative levels</p>
              </div>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Jurisdiction *</label>
                  <select name="applicableJurisdiction" value={formData.applicableJurisdiction} onChange={handleChange} className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]">
                    <option value="Entire State of Jharkhand">Entire State of Jharkhand</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-2">District Coverage *</label>
                  <label className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input type="radio" name="operationalDistrictsType" value="All 24 Districts (State Wide)" checked={formData.operationalDistrictsType === 'All 24 Districts (State Wide)'} onChange={handleChange} className="accent-[#007A61]" />
                    <span className="font-bold text-slate-800">All 24 Districts (State Wide)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="operationalDistrictsType" value="Select Specific Districts" checked={formData.operationalDistrictsType === 'Select Specific Districts'} onChange={handleChange} className="accent-[#007A61]" />
                    <span className="text-slate-600">Select Specific Districts</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-2">Administrative Levels Enabled</label>
                <div className="space-y-2.5">
                  {['State Department (Mandatory)', 'District Department', 'Block / Sub-Division / Local Office', 'Gram Panchayat / Urban Local Body', 'Ward / Field Office'].map((level) => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.involvedLowerLevels.includes(level) ? 'bg-[#007A61] border-[#007A61]' : 'border-slate-300'}`}>
                        {formData.involvedLowerLevels.includes(level) && <span className="text-white text-[10px]">✓</span>}
                      </div>
                      <input type="checkbox" className="hidden" checked={formData.involvedLowerLevels.includes(level)} onChange={() => handleCheckboxChange(level)} />
                      <span className={`text-slate-700 ${level === 'State Department (Mandatory)' ? 'font-semibold' : ''}`}>{level}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 bg-blue-50/50 rounded-lg p-3 border border-blue-100 flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-0.5">ⓘ</span>
                <p className="text-blue-800 leading-relaxed">Note: Lower administrative levels are configurable as per department requirements and are NOT mandatory for every department.</p>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="button" className="px-4 py-2 border border-[#007A61] text-[#007A61] rounded-lg font-bold hover:bg-[#007A61]/5 transition-colors flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5" /> Configure Hierarchy
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: State Department Leadership */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <Users className="w-4 h-4 text-[#007A61]" />
              <div>
                <h2 className="text-sm font-bold text-[#007A61]">State Department Leadership</h2>
                <p className="text-[11px] text-slate-500">Add head of department and nodal officer details</p>
              </div>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Head of Department (HOD) Name *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">👤</span>
                  <input type="text" name="headName" placeholder="e.g. Shri Ramesh Kumar" value={formData.headName} onChange={handleChange} className="w-full pl-8 p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Designation *</label>
                <input type="text" name="headRole" placeholder="e.g. Principal Secretary" value={formData.headRole} onChange={handleChange} className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Official Email *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">✉️</span>
                  <input type="email" name="headEmail" placeholder="hod@jharkhand.gov.in" value={formData.headEmail} onChange={handleChange} className="w-full pl-8 p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Official Phone *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📞</span>
                  <input type="text" name="headPhone" placeholder="+91 9876543210" value={formData.headPhone} onChange={handleChange} className="w-full pl-8 p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Office / Secretariat Location *</label>
                <input type="text" name="officeSecretariatLocation" placeholder="e.g. Project Bhawan, Ranchi" value={formData.officeSecretariatLocation} onChange={handleChange} className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Nodal Officer Name *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">👤</span>
                  <input type="text" name="nodalOfficerName" placeholder="e.g. Smt. Anita Verma" value={formData.nodalOfficerName} onChange={handleChange} className="w-full pl-8 p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Nodal Officer Email *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">✉️</span>
                  <input type="email" name="nodalOfficerEmail" placeholder="nodal@jharkhand.gov.in" value={formData.nodalOfficerEmail} onChange={handleChange} className="w-full pl-8 p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Nodal Officer Phone *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📞</span>
                  <input type="text" name="nodalOfficerPhone" placeholder="+91 9876543210" value={formData.nodalOfficerPhone} onChange={handleChange} className="w-full pl-8 p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: State Department Login & Access */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <Shield className="w-4 h-4 text-[#007A61]" />
              <div>
                <h2 className="text-sm font-bold text-[#007A61]">State Department Login & Access</h2>
                <p className="text-[11px] text-slate-500">Create principal login account for the department</p>
              </div>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Login ID / Official Email *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">✉️</span>
                  <input type="text" name="credentials.loginEmail" placeholder="dept@jharkhand.gov.in" value={formData.credentials.loginEmail} onChange={handleChange} className="w-full pl-8 p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Username / Department ID *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">👤</span>
                  <input type="text" name="credentials.loginId" placeholder="e.g. RD-001" value={formData.credentials.loginId} onChange={handleChange} className="w-full pl-8 p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Initial Password *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Lock className="w-3.5 h-3.5" /></span>
                  <input type="password" name="credentials.password" placeholder="•••••••••" value={formData.credentials.password} onChange={handleChange} className="w-full pl-8 p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Lock className="w-3.5 h-3.5" /></span>
                  <input type="password" placeholder="•••••••••" className="w-full pl-8 p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-700">MFA Required ⓘ</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="credentials.mfaRequired" checked={formData.credentials.mfaRequired} onChange={handleChange} className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#007A61]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-700">First Login Password Change</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="credentials.firstLoginPasswordChange" checked={formData.credentials.firstLoginPasswordChange} onChange={handleChange} className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#007A61]"></div>
                </label>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Role</label>
                <select className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]">
                  <option>State Department Principal</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Access Scope</label>
                <select className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]">
                  <option>State Department only</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Credential Created By</label>
                <input type="text" disabled value={formData.credentials.credentialCreatedBy} className="w-full p-2.5 bg-slate-100 text-slate-500 rounded-lg border border-slate-200 focus:outline-none" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Credential Status</label>
                <input type="text" disabled value={formData.credentials.credentialStatus} className="w-full p-2.5 bg-slate-100 text-slate-500 rounded-lg border border-slate-200 focus:outline-none" />
              </div>
              <div className="md:col-span-2 flex items-end gap-3 justify-end">
                <button type="button" className="px-4 py-2 border border-[#007A61] text-[#007A61] rounded-lg font-bold hover:bg-[#007A61]/5 transition-colors flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" /> Generate Secure Password
                </button>
                <button type="button" className="px-4 py-2 bg-[#007A61] text-white rounded-lg font-bold shadow-xs hover:bg-[#00624e] transition-colors flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" /> Send Activation Link
                </button>
              </div>
            </div>
          </div>

          {/* Section 5: Mandate, Functions & Authority */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <FileText className="w-4 h-4 text-[#007A61]" />
              <div>
                <h2 className="text-sm font-bold text-[#007A61]">Mandate, Functions & Authority</h2>
                <p className="text-[11px] text-slate-500">Define mandate, key functions and operational scope</p>
              </div>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Mandate / Objective *</label>
                <textarea name="description" rows={5} placeholder="Describe the main mandate and objective of this department..." value={formData.description} onChange={handleChange} className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
                <div className="text-right text-[10px] text-slate-400 mt-1">0/1000</div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Key Functions</label>
                <div className="space-y-2">
                  {formData.keyFunctions.map((kf, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="font-bold text-slate-400">{i+1}.</span>
                      <input type="text" value={kf} onChange={(e) => handleKeyFunctionChange(i, e.target.value)} placeholder={`e.g. ${['Policy formulation', 'Program implementation', 'Monitoring and evaluation'][i] || 'New function'}`} className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
                    </div>
                  ))}
                  <button type="button" onClick={addKeyFunction} className="text-[#007A61] font-bold mt-2 flex items-center gap-1 hover:underline">
                    + Add Another Function
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Powers / Approval Authority</label>
                <input type="text" name="powersApprovalAuthority" placeholder="e.g. Policy decisions, fund allocation..." value={formData.powersApprovalAuthority} onChange={handleChange} className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Schemes / Programmes Managed</label>
                <input type="text" name="schemesManaged" placeholder="e.g. List major schemes..." value={formData.schemesManaged} onChange={handleChange} className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Departments / Offices Coordinated With</label>
                <input type="text" name="departmentsCoordinated" placeholder="e.g. Finance, Planning, etc..." value={formData.departmentsCoordinated} onChange={handleChange} className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Problem Categories Handled</label>
                <input type="text" name="problemCategoriesHandled" placeholder="e.g. Infrastructure, Education, Health..." value={formData.problemCategoriesHandled} onChange={handleChange} className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
              </div>
            </div>
          </div>

          {/* Section 6: Documents & Government Verification */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <FileBadge2 className="w-4 h-4 text-[#007A61]" />
              <div>
                <h2 className="text-sm font-bold text-[#007A61]">Documents & Government Verification</h2>
                <p className="text-[11px] text-slate-500">Upload supporting documents and verification details</p>
              </div>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Government Order / Notification No. *</label>
                <input type="text" name="goNumber" placeholder="e.g. GO-1234" value={formData.goNumber} onChange={handleChange} className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">GO Date *</label>
                <input type="date" name="goDate" value={formData.goDate} onChange={handleChange} className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
              </div>
              <div className="row-span-3 border-l border-slate-100 pl-5">
                <h3 className="font-bold text-slate-700 mb-3">Verification Status</h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full font-bold mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pending Verification
                </div>
                <div className="space-y-4 text-slate-500">
                  <div>
                    <span className="block font-bold text-slate-700 mb-1">Verified By</span>
                    <span>—</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-700 mb-1">Verified On</span>
                    <span>—</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Upload Government Order (PDF) *</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 p-3 text-center cursor-pointer hover:bg-slate-100 hover:border-[#007A61] transition-colors flex items-center justify-center gap-3">
                  <Upload className="w-5 h-5 text-[#007A61]" />
                  <div className="text-left">
                    <p className="text-[10px] text-slate-600">Click to upload or drag & drop</p>
                    <p className="text-[9px] text-slate-400">PDF (Max 5 MB)</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Organizational Structure (PDF)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 p-3 text-center cursor-pointer hover:bg-slate-100 hover:border-[#007A61] transition-colors flex items-center justify-center gap-3">
                  <Upload className="w-5 h-5 text-[#007A61]" />
                  <div className="text-left">
                    <p className="text-[10px] text-slate-600">Click to upload or drag & drop</p>
                    <p className="text-[9px] text-slate-400">PDF (Max 5 MB)</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Authorization / Appointment Order</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 p-3 text-center cursor-pointer hover:bg-slate-100 hover:border-[#007A61] transition-colors flex items-center justify-center gap-3">
                  <Upload className="w-5 h-5 text-[#007A61]" />
                  <div className="text-left">
                    <p className="text-[10px] text-slate-600">Click to upload or drag & drop</p>
                    <p className="text-[9px] text-slate-400">PDF (Max 5 MB)</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Additional Documents</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 p-3 text-center cursor-pointer hover:bg-slate-100 hover:border-[#007A61] transition-colors flex items-center justify-center gap-3">
                  <Upload className="w-5 h-5 text-[#007A61]" />
                  <div className="text-left">
                    <p className="text-[10px] text-slate-600">Click to upload or drag & drop</p>
                    <p className="text-[9px] text-slate-400">PDF, DOC, PNG (Max 5 MB)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: Activation & Audit */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <Settings className="w-4 h-4 text-[#007A61]" />
              <div>
                <h2 className="text-sm font-bold text-[#007A61]">Activation & Audit</h2>
                <p className="text-[11px] text-slate-500">Set initial status and view audit information</p>
              </div>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-6 gap-5 text-xs">
              <div className="col-span-1">
                <label className="font-bold text-slate-700 block mb-2">Initial Status *</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="status" value="Active" checked={formData.status === 'Active'} onChange={handleChange} className="accent-[#007A61]" />
                    <span className="font-semibold text-slate-800">Active</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="status" value="Inactive" checked={formData.status === 'Inactive'} onChange={handleChange} className="accent-[#007A61]" />
                    <span className="text-slate-600">Inactive</span>
                  </label>
                </div>
              </div>
              <div className="col-span-1">
                <label className="font-bold text-slate-700 block mb-1.5">Effective From *</label>
                <input type="date" name="effectiveFrom" value={formData.effectiveFrom} onChange={handleChange} className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
              </div>
              <div className="col-span-1">
                <label className="font-bold text-slate-700 block mb-1.5">Approval Required</label>
                <div className="flex items-center gap-2 mt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="approvalRequired" checked={formData.approvalRequired} onChange={handleChange} className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#007A61]"></div>
                  </label>
                  <span className="text-[9px] text-slate-500 leading-tight max-w-[80px]">Requires higher authority approval</span>
                </div>
              </div>
              <div className="col-span-3 grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-[10px]">
                <div>
                  <span className="block font-bold text-slate-600 mb-1">Created By</span>
                  <span className="text-slate-800 font-medium bg-white px-2 py-1 rounded border border-slate-200 block">Super Admin</span>
                </div>
                <div>
                  <span className="block font-bold text-slate-600 mb-1">Created Date</span>
                  <span className="text-slate-800 font-medium bg-white px-2 py-1 rounded border border-slate-200 block">13-09-2025 10:30 AM</span>
                </div>
                <div>
                  <span className="block font-bold text-slate-600 mb-1">Last Updated</span>
                  <span className="text-slate-800 font-medium bg-white px-2 py-1 rounded border border-slate-200 block">13-09-2025 10:30 AM</span>
                </div>
              </div>
              <div className="md:col-span-6">
                <label className="font-bold text-slate-700 block mb-1.5">Remarks (Optional)</label>
                <input type="text" name="remarks" placeholder="Add any remarks..." value={formData.remarks} onChange={handleChange} className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#007A61]" />
              </div>
            </div>
            
            {/* Action Bar */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-end gap-3">
              <button type="button" onClick={onBack} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="button" className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Save className="w-3.5 h-3.5" /> Save as Draft
              </button>
              <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2.5 bg-[#007A61] text-white rounded-lg text-xs font-bold shadow-md hover:bg-[#00624e] disabled:opacity-50 transition-colors flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {isSubmitting ? 'Saving...' : 'Create State Department'}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Summary Area */}
        <div className="w-full lg:w-80 flex-shrink-0 sticky top-24 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <Users className="w-4 h-4 text-[#007A61]" />
              <h2 className="text-sm font-bold text-slate-800">Department Access Summary</h2>
            </div>
            <div className="p-5 space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Department Type</h3>
                  <p className="text-xs font-bold text-slate-800">{formData.departmentType}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Map className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Jurisdiction</h3>
                  <p className="text-xs font-bold text-slate-800">{formData.applicableJurisdiction}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Map className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">District Coverage</h3>
                  <p className="text-xs font-bold text-slate-800">{formData.operationalDistrictsType.includes('All') ? 'All 24 Districts' : 'Specific Districts'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Login Role</h3>
                  <p className="text-xs font-bold text-slate-800">State Department Principal</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Lower Levels</h3>
                  <p className="text-xs font-bold text-slate-800">Configurable (As per requirement)</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Credential Status</h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> {formData.credentials.credentialStatus}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DepartmentEditPanel;
