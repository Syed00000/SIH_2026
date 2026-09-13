import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Search,
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  KeyRound,
  Copy,
  Check,
  IndianRupee,
  Briefcase,
  Layers,
  Calendar,
  AlertCircle
} from 'lucide-react';
import departmentService from '../../government/services/departmentService.js';
import { ViewDistrictModal } from './ViewDistrictModal.jsx';

export const DepartmentDistrictsPanel = ({
  districts = [],
  isDistrictDept = false,
  isBlockDept = false,
  onAddDistrict,
  onDeletedDistrict
}) => {
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [viewingDistrict, setViewingDistrict] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const filtered = districts.filter((d) => {
    const q = search.toLowerCase();
    return (
      (d.name || '').toLowerCase().includes(q) ||
      (d.district || '').toLowerCase().includes(q) ||
      (d.block || '').toLowerCase().includes(q) ||
      (d.ward || '').toLowerCase().includes(q) ||
      (d.code || '').toLowerCase().includes(q) ||
      (d.deptId || '').toLowerCase().includes(q) ||
      (d.headEmail || d.credentials?.loginEmail || '').toLowerCase().includes(q) ||
      (d.headName || '').toLowerCase().includes(q)
    );
  });

  const handleDelete = async (e, dist) => {
    if (e) e.stopPropagation();
    const distId = dist.deptId || dist.id || dist._id;
    if (!window.confirm(`Are you sure you want to remove "${dist.name}"?`)) return;
    try {
      setDeletingId(distId);
      await departmentService.deleteDepartment(distId);
      if (onDeletedDistrict) onDeletedDistrict(distId);
      if (viewingDistrict && (viewingDistrict.deptId === distId || viewingDistrict.id === distId || viewingDistrict._id === distId)) {
        setViewingDistrict(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete department');
    } finally {
      setDeletingId(null);
    }
  };

  const togglePasswordVisibility = (e, idKey) => {
    if (e) e.stopPropagation();
    setVisiblePasswords((prev) => ({
      ...prev,
      [idKey]: !prev[idKey]
    }));
  };

  const handleCopy = (text, key) => {
    if (!text || text === '-') return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getSectionTitle = () => {
    if (isBlockDept) return 'Ward Commissioners';
    if (isDistrictDept) return 'Block & Tehsil Offices';
    return 'District Departments';
  };

  const getJurisdictionLabel = () => {
    if (isBlockDept) return 'Ward';
    if (isDistrictDept) return 'Block / Jurisdiction';
    return 'District';
  };

  // Full Details View when a department is selected
  if (viewingDistrict) {
    const dist = viewingDistrict;
    const targetId = dist.deptId || dist.id || dist._id;
    const loginEmail = dist.headEmail || dist.credentials?.loginEmail || dist.credentials?.loginId || '-';
    const password = dist.credentials?.password || dist.credentials?.generatedPassword || '-';
    const isPasswordVisible = visiblePasswords[`detail-${targetId}`] || false;
    const isInactive = dist.status === 'Inactive' || dist.status === 'Suspended';
    const jurisdictionValue = isBlockDept
      ? (dist.ward || dist.applicableJurisdiction || dist.district || 'Ward Office')
      : isDistrictDept
      ? (dist.block || dist.applicableJurisdiction || dist.district || 'Block Office')
      : (dist.district || 'District Territory');

    return (
      <div className="space-y-4 text-left select-none animate-in fade-in duration-200">
        {/* Top Navigation & Action Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewingDistrict(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-[#0f4b3a] hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
              title="Return to list"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {getSectionTitle()}</span>
            </button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-black text-slate-900 leading-tight">{dist.name}</h1>
                <span className="text-[10px] font-mono font-bold text-[#0f4b3a] bg-[#0f4b3a]/10 px-2 py-0.5 rounded-lg border border-[#0f4b3a]/20">
                  {dist.code || dist.deptId || 'DEPT-ID'}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${
                    !isInactive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${!isInactive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  <span>{!isInactive ? 'Active' : 'Inactive'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {dist.category || (isBlockDept ? 'Ward Commissioner Office' : isDistrictDept ? 'Block / Tehsil Office' : 'District Level Department')} • {jurisdictionValue}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  `Department: ${dist.name}\nID: ${dist.code || dist.deptId}\nLogin ID: ${loginEmail}\nPassword: ${password}\nJurisdiction: ${jurisdictionValue}`,
                  'all-creds'
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              {copiedKey === 'all-creds' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'all-creds' ? 'Credentials Copied' : 'Copy Credentials'}</span>
            </button>
            <button
              type="button"
              disabled={deletingId === targetId}
              onClick={(e) => handleDelete(e, dist)}
              className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Fund Pool */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <IndianRupee className="w-5 h-5 font-black" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Allocated Fund Pool</span>
              <div className="text-lg font-black text-emerald-700 truncate">
                ₹ {(Number(dist.allocatedFundPool) || 0).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Operational State Grant</span>
            </div>
          </div>

          {/* Jurisdiction */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jurisdiction Area</span>
              <div className="text-sm font-extrabold text-slate-900 truncate">{jurisdictionValue}</div>
              <span className="text-[10px] text-slate-500 font-medium">{dist.district ? `${dist.district} District` : 'Jharkhand'}</span>
            </div>
          </div>

          {/* In-Charge Lead */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Officer In-Charge</span>
              <div className="text-sm font-extrabold text-slate-900 truncate">{dist.headName || 'Department Head'}</div>
              <span className="text-[10px] text-slate-500 font-medium truncate block">{dist.headRole || 'Lead Nodal Officer'}</span>
            </div>
          </div>

          {/* Portal Access Status */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Portal Access</span>
              <div className="text-sm font-extrabold text-slate-900 truncate">
                {!isInactive ? 'Authorized & Active' : 'Access Suspended'}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Secured RBAC Login</span>
            </div>
          </div>
        </div>

        {/* Detailed Info Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Card 1: Department Identity & Scope */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-[#0f4b3a]/10 text-[#0f4b3a] flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Administrative Profile & Scope</h2>
                <p className="text-[10.5px] text-slate-400">Official department records and functional scope</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Official Name</span>
                  <p className="font-extrabold text-slate-900">{dist.name}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Department Code / ID</span>
                  <p className="font-mono font-bold text-[#0f4b3a]">{dist.code || dist.deptId || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Administrative Level</span>
                  <p className="font-bold text-slate-800">
                    {dist.category || (isBlockDept ? 'Ward Office' : isDistrictDept ? 'Block / Tehsil Office' : 'District Department')}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Coverage Territory</span>
                  <p className="font-bold text-slate-800">{jurisdictionValue}</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Official Mandate & Responsibilities</span>
                <p className="text-slate-700 leading-relaxed text-[11.5px]">
                  {dist.description ||
                    `Authorized local administrative wing responsible for executing state directives, maintaining public civic infrastructure, supervising field operations, and addressing citizen grievances across ${jurisdictionValue}.`}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Portal Authentication Credentials */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Portal Access Credentials</h2>
                  <p className="text-[10.5px] text-slate-400">Department login ID & authentication key</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9.5px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                RBAC Security
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Login ID */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Portal Login ID / Email
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(loginEmail, 'loginId')}
                    className="flex items-center gap-1 text-[10.5px] font-bold text-[#0f4b3a] hover:underline cursor-pointer"
                  >
                    {copiedKey === 'loginId' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'loginId' ? 'Copied' : 'Copy ID'}</span>
                  </button>
                </div>
                <div className="font-mono font-bold text-slate-900 text-xs break-all bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                  {loginEmail}
                </div>
              </div>

              {/* Password */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <KeyRound className="w-3 h-3" /> Access Password
                  </span>
                  <div className="flex items-center gap-2">
                    {password !== '-' && (
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(null, `detail-${targetId}`)}
                        className="flex items-center gap-1 text-[10.5px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        {isPasswordVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{isPasswordVisible ? 'Hide' : 'Show'}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCopy(password, 'pwd')}
                      className="flex items-center gap-1 text-[10.5px] font-bold text-[#0f4b3a] hover:underline cursor-pointer"
                    >
                      {copiedKey === 'pwd' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'pwd' ? 'Copied' : 'Copy Password'}</span>
                    </button>
                  </div>
                </div>
                <div className="font-mono font-bold text-slate-900 text-xs bg-white px-3 py-2 rounded-lg border border-slate-200/80 flex items-center justify-between">
                  <span>{password === '-' ? 'Not Configured' : isPasswordVisible ? password : '••••••••••••'}</span>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200/80 text-[11px] text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  Share these credentials strictly with authorized nodal officers of this department for grievance resolution & technician dispatch.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: In-Charge Officer & Direct Contacts */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Official In-Charge & Contacts</h2>
                <p className="text-[10.5px] text-slate-400">Direct contact details for administrative coordination</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Officer Name</span>
                  <p className="font-extrabold text-slate-900">{dist.headName || 'Officer in Charge'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Designation</span>
                  <p className="font-bold text-slate-800">{dist.headRole || 'Department Head'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-0.5">
                      <Mail className="w-3 h-3" /> Official Email
                    </span>
                    <p className="font-mono text-slate-800 truncate">{dist.headEmail || loginEmail}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(dist.headEmail || loginEmail, 'headEmail')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                    title="Copy Email"
                  >
                    {copiedKey === 'headEmail' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-0.5">
                      <Phone className="w-3 h-3" /> Helpline / Phone
                    </span>
                    <p className="font-mono text-slate-800 truncate">{dist.headPhone || '0651-2450000'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(dist.headPhone || '0651-2450000', 'headPhone')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                    title="Copy Phone"
                  >
                    {copiedKey === 'headPhone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Financial Governance */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <IndianRupee className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Fund Allocation & Governance</h2>
                <p className="text-[10.5px] text-slate-400">Budget pool & financial delegation</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Allocated Fund Pool</span>
                  <div className="text-xl font-black text-[#0f4b3a]">
                    ₹ {(Number(dist.allocatedFundPool) || 0).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10.5px] text-emerald-700 font-medium">State Budget Pool</span>
                </div>
                <span className="px-3 py-1 bg-white text-emerald-800 font-extrabold text-xs rounded-xl border border-emerald-200 shadow-2xs">
                  Active Pool
                </span>
              </div>

              <p className="text-slate-500 text-[11px] leading-relaxed">
                Funds are disbursed for quick-response civic problem resolution, procurement of maintenance materials, and emergency technician dispatch within this department's jurisdiction.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Back Button */}
        <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewingDistrict(null)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-[#0f4b3a] hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {getSectionTitle()} List</span>
          </button>
          <span className="text-[11px] text-slate-400 font-medium">
            Viewing Profile for {dist.name} ({dist.code || dist.deptId})
          </span>
        </div>
      </div>
    );
  }

  // Default List Table View
  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-150">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0f4b3a]/10 text-[#0f4b3a] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 leading-tight">
              {getSectionTitle()} ({districts.length})
            </h2>
            <p className="text-xs text-slate-500">
              {isBlockDept
                ? 'Manage ward-level offices & portal access credentials'
                : isDistrictDept
                ? 'Manage local block/tehsil bodies & portal access'
                : 'Manage district-level departments & portal access credentials'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isBlockDept ? 'Search wards...' : isDistrictDept ? 'Search blocks & tehsils...' : 'Search districts...'}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0f4b3a]"
            />
          </div>
          <button
            type="button"
            onClick={onAddDistrict}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f4b3a] hover:bg-[#0a3a2c] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isBlockDept ? 'Add Ward Commissioner' : isDistrictDept ? 'Add Block / Tehsil' : 'Add District'}</span>
          </button>
        </div>
      </div>

      {/* Content: Desktop Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">
            {isBlockDept
              ? 'No ward commissioners registered. Click "Add Ward Commissioner" to create credentials.'
              : isDistrictDept
              ? 'No blocks or tehsils registered. Click "Add Block / Tehsil" to create credentials.'
              : 'No district departments registered. Click "Add District" to create credentials.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Department & Code</th>
                  <th className="py-3 px-4">{getJurisdictionLabel()}</th>
                  <th className="py-3 px-4">Fund Pool</th>
                  <th className="py-3 px-4">Portal Login ID</th>
                  <th className="py-3 px-4">Password</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((dist) => {
                  const targetId = dist.deptId || dist.id || dist._id;
                  const loginEmail = dist.headEmail || dist.credentials?.loginEmail || dist.credentials?.loginId || '-';
                  const password = dist.credentials?.password || dist.credentials?.generatedPassword || '-';
                  const isPasswordVisible = visiblePasswords[targetId] || false;

                  return (
                    <tr
                      key={targetId}
                      onClick={() => setViewingDistrict(dist)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 group-hover:text-[#0f4b3a] transition-colors">
                          {dist.name}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#0f4b3a] bg-[#0f4b3a]/10 px-1.5 py-0.2 rounded inline-block mt-0.5">
                          {dist.code || dist.deptId}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {isBlockDept
                          ? (dist.ward || dist.applicableJurisdiction || dist.district)
                          : isDistrictDept
                          ? (dist.block || dist.applicableJurisdiction || dist.district)
                          : dist.district}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-emerald-700">
                        ₹ {(Number(dist.allocatedFundPool) || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">{loginEmail}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold w-24 truncate text-center">
                            {password === '-' ? '-' : isPasswordVisible ? password : '••••••••'}
                          </span>
                          {password !== '-' && (
                            <button
                              type="button"
                              onClick={(e) => togglePasswordVisibility(e, targetId)}
                              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                              title={isPasswordVisible ? 'Hide Password' : 'Show Password'}
                            >
                              {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            dist.status === 'Active' || !dist.status
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {dist.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="View Department Details"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingDistrict(dist);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 bg-[#0f4b3a]/10 hover:bg-[#0f4b3a] text-[#0f4b3a] hover:text-white font-bold text-[11px] rounded-lg border border-[#0f4b3a]/20 transition cursor-pointer shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            title="Delete Department"
                            disabled={deletingId === targetId}
                            onClick={(e) => handleDelete(e, dist)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ViewDistrictModal
        isOpen={false}
        onClose={() => setViewingDistrict(null)}
        district={null}
      />
    </div>
  );
};

export default DepartmentDistrictsPanel;

