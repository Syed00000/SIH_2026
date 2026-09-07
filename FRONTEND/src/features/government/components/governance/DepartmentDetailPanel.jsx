import React from 'react';
import { ArrowLeft, Landmark, Users, MapPin, Mail, Phone, Home, Edit2, Trash2, Power } from 'lucide-react';
import { DepartmentCredentialsCard } from './DepartmentCredentialsCard.jsx';

export const DepartmentDetailPanel = ({ department, onBack, onEdit, onToggleStatus, onDelete }) => {
  if (!department) return null;

  const officers = department.officers || [];
  const problems = department.problems || [];
  const isGramPanchayat = department.category === 'Gram Panchayat';
  const isActive = department.status === 'Active';

  return (
    <div className="space-y-4 select-none max-w-[1600px] mx-auto pb-10">
      {/* Top Header Card with Back Button and Quick Actions */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer shrink-0"
            title="Back to Departments"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isGramPanchayat ? 'bg-amber-500/10 text-amber-700' : 'bg-[#007A61]/10 text-[#007A61]'
            }`}>
              {isGramPanchayat ? <Home className="w-6 h-6" /> : <Landmark className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{department.name}</h1>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  {department.deptId || department.code}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                  isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {department.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {department.category} &bull; Government of Jharkhand Governance Network
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onToggleStatus && onToggleStatus(department)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isActive ? 'Mark Inactive' : 'Mark Active'}</span>
          </button>
          <button
            type="button"
            onClick={() => onEdit && onEdit(department)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#007A61] hover:bg-[#00624e] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Department</span>
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(department.deptId || department.id || department._id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Official Access Credentials Card (ID & Password) */}
      <DepartmentCredentialsCard department={department} />

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left 2 Cols: Info & Overview */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Department Profile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {department.headRole || (isGramPanchayat ? 'Mukhiya / Head' : 'Department Head')}
                </span>
                <p className="text-sm font-black text-slate-900">{department.headName || 'Not Assigned'}</p>
                <div className="text-xs text-slate-500 font-mono mt-1 space-y-0.5">
                  {department.headEmail && <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-400" />{department.headEmail}</div>}
                  {department.headPhone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" />{department.headPhone}</div>}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" /> Jurisdiction & Coverage
                </span>
                <p className="text-sm font-black text-slate-900">{department.district} District</p>
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

          {/* Assigned Officers List */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-600" />
              <span>Assigned Nodal Officers & Staff ({officers.length})</span>
            </h2>
            {officers.length === 0 ? (
              <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-500 text-xs text-center font-medium">
                No individual nodal officers linked to this department record yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {officers.map((officer, idx) => (
                  <div key={officer.id || idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{officer.name || officer.fullName}</p>
                      <p className="text-[11px] text-slate-500">{officer.designation || officer.role || 'Officer'}</p>
                    </div>
                    <div className="text-right text-[11px] font-mono text-slate-500">
                      <div>{officer.email}</div>
                      <div>{officer.mobileNumber || officer.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Metrics & Stats */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Department Metrics</h2>
            <div className="grid grid-cols-1 gap-2.5">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">Assigned Officers</span>
                <span className="text-base font-black text-slate-900">{officers.length}</span>
              </div>
              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/70 flex items-center justify-between">
                <span className="text-xs font-medium text-amber-800">Challenges / Issues</span>
                <span className="text-base font-black text-amber-700">{problems.length}</span>
              </div>
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/70 flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-800">Active Solutions</span>
                <span className="text-base font-black text-emerald-700">{department.activeProjectsCount || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailPanel;
