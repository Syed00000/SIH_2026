import React, { useState } from 'react';
import {
  ArrowLeft,
  Landmark,
  Users,
  MapPin,
  Mail,
  Phone,
  Home,
  Edit2,
  Trash2,
  Power,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  BarChart3
} from 'lucide-react';
import { DepartmentCredentialsCard } from './DepartmentCredentialsCard.jsx';

export const DepartmentDetailPanel = ({
  department,
  onBack,
  onEdit,
  onToggleStatus,
  onDelete
}) => {
  const [activeSubTab, setActiveSubTab] = useState('credentials'); // 'credentials' | 'officers' | 'profile'
  const [notification, setNotification] = useState(null);

  if (!department) return null;

  const officers = department.officers || [];
  const problems = department.problems || [];
  const isGramPanchayat = department.category === 'Gram Panchayat' || department.category === 'Ward Commissioner';
  const isActive = department.status === 'Active';
  const deptCode = department.deptId || department.code || 'DEPT-JH-2026';

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-bold flex items-center space-x-2 bg-slate-900 text-white border-slate-800 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Back & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {isGramPanchayat ? 'Gram Panchayats & Wards' : 'Departments'}</span>
        </button>

        <div className="flex items-center space-x-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              if (onToggleStatus) onToggleStatus(department);
              showToast(`Department marked as ${isActive ? 'Inactive' : 'Active'}`);
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs cursor-pointer transition-colors"
          >
            <Power className="w-3.5 h-3.5 text-slate-500" />
            <span>{isActive ? 'Mark Inactive' : 'Mark Active'}</span>
          </button>
          <button
            type="button"
            onClick={() => onEdit && onEdit(department)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-300" />
            <span>Edit Department</span>
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(department.deptId || department.id || department._id)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Title & Institution Overview Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black bg-slate-900 text-white">
            {deptCode}
          </span>
          <span className="text-slate-500">{department.category || 'Line Department'}</span>
          <span>•</span>
          <span className="text-slate-700">{department.district ? `${department.district} District` : 'Statewide Jurisdiction'}</span>
          <span>•</span>
          <span className={`px-2 py-0.5 rounded font-bold border ${
            isActive
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : 'text-slate-600 bg-slate-100 border-slate-200'
          }`}>
            Governance Status: {department.status || 'Active'}
          </span>
        </div>

        <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {department.name}
        </h1>

        {/* 3-Column Info Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {department.headRole || (isGramPanchayat ? 'Mukhiya / Ward Officer' : 'Department Officer')}
            </span>
            <span className="font-bold text-slate-900 text-sm block">
              {department.headName || 'Not Assigned'}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {department.headEmail || department.headPhone || 'Official In-Charge'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Jurisdiction & Coverage
            </span>
            <span className="font-bold text-slate-900 text-sm block">
              {department.district ? `${department.district} District` : 'Statewide'}
            </span>
            <span className="text-[11px] text-[#007A61] font-bold">
              {department.block ? `Block: ${department.block}` : (department.panchayat ? `Gram Panchayat: ${department.panchayat}` : 'Administrative Zone')}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Governance Telemetry
            </span>
            <span className="font-mono font-black text-slate-900 text-base block">
              {officers.length} Assigned Officers
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {problems.length} Local Issues Reported
            </span>
          </div>
        </div>

        {/* Mandate & Scope description if present */}
        {department.description && (
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Mandate & Scope</span>
            <p className="leading-relaxed">{department.description}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('credentials')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'credentials'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>1. Official Portal Credentials & Access Keys</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'profile'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>2. Department Profile & Jurisdiction</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('officers')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'officers'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>3. Assigned Nodal Officers & Staff ({officers.length})</span>
        </button>
      </div>

      {/* TAB 1: CREDENTIALS */}
      {activeSubTab === 'credentials' && (
        <div className="space-y-4">
          <DepartmentCredentialsCard department={department} onToast={showToast} />
        </div>
      )}

      {/* TAB 2: PROFILE & METRICS */}
      {activeSubTab === 'profile' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left 2 Cols: Profile info */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Department Administrative Profile
                  </h3>
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    ID: {deptCode}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {department.headRole || (isGramPanchayat ? 'Mukhiya / Head' : 'Department Officer')}
                    </span>
                    <p className="text-sm font-bold text-slate-900">{department.headName || 'Not Assigned'}</p>
                    <div className="text-xs text-slate-500 font-mono mt-1 space-y-0.5">
                      {department.headEmail && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{department.headEmail}</span>
                        </div>
                      )}
                      {department.headPhone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{department.headPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500" /> Jurisdiction & Coverage
                    </span>
                    <p className="text-sm font-bold text-slate-900">{department.district ? `${department.district} District` : 'Statewide'}</p>
                    <div className="text-xs text-slate-600 font-medium space-y-0.5 mt-1">
                      {department.block && <div>Block / Mandal: <span className="font-bold text-slate-800">{department.block}</span></div>}
                      {department.panchayat && <div>Gram Panchayat: <span className="font-bold text-slate-800">{department.panchayat}</span></div>}
                    </div>
                  </div>
                </div>

                {department.description && (
                  <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/70 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Mandate & Scope</span>
                    <p className="text-slate-700 leading-relaxed font-medium">{department.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Metrics */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Department Telemetry Metrics
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600">Assigned Officers</span>
                    <span className="text-base font-black text-slate-900 font-mono">{officers.length}</span>
                  </div>
                  <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/70 flex items-center justify-between">
                    <span className="text-xs font-medium text-amber-800">Challenges / Issues</span>
                    <span className="text-base font-black text-amber-700 font-mono">{problems.length}</span>
                  </div>
                  <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/70 flex items-center justify-between">
                    <span className="text-xs font-medium text-emerald-800">Active Solutions</span>
                    <span className="text-base font-black text-emerald-700 font-mono">{department.activeProjectsCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OFFICERS LIST */}
      {activeSubTab === 'officers' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-slate-600" />
                <span>Assigned Nodal Officers & Staff ({officers.length})</span>
              </h3>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Total: {officers.length}
              </span>
            </div>

            {officers.length === 0 ? (
              <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-500 text-xs text-center font-medium space-y-1">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700">No individual nodal officers linked to this department record yet.</p>
                <p className="text-slate-400">Officers assigned through Admin Management will appear here automatically.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {officers.map((officer, idx) => (
                  <div key={officer.id || idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/80 px-2 rounded-lg transition-colors">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{officer.name || officer.fullName}</p>
                      <p className="text-[11px] text-slate-500">{officer.designation || officer.role || 'Officer'}</p>
                    </div>
                    <div className="text-left sm:text-right text-[11px] font-mono text-slate-500 space-y-0.5">
                      {officer.email && <div className="text-slate-700 font-medium">{officer.email}</div>}
                      {officer.mobileNumber && <div>{officer.mobileNumber}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentDetailPanel;
