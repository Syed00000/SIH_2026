import React from 'react';
import { X, Landmark, Users, MapPin, Mail, Phone, AlertCircle, ShieldCheck, Home } from 'lucide-react';

export const DepartmentDetailModal = ({ department, onClose }) => {
  if (!department) return null;

  const officers = department.officers || [];
  const problems = department.problems || [];
  const isGramPanchayat = department.category === 'Gram Panchayat';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isGramPanchayat ? 'bg-amber-500/10 text-amber-700' : 'bg-[#007A61]/10 text-[#007A61]'
            }`}>
              {isGramPanchayat ? <Home className="w-5 h-5" /> : <Landmark className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">{department.name}</h3>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  {department.deptId || department.code}
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-400">{department.category} • Government of Jharkhand</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-slate-200/60 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Head Officer & Location Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {department.headRole || 'Department Head'}
              </span>
              <p className="font-extrabold text-slate-900">{department.headName || 'Not Assigned'}</p>
              <div className="text-[11px] text-slate-500 font-mono">
                {[department.headEmail, department.headPhone].filter(Boolean).join(' • ') || 'No direct phone/email'}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500" /> Jurisdiction
              </span>
              <p className="font-extrabold text-slate-900">{department.district} District</p>
              {(department.block || department.panchayat) && (
                <p className="text-[11px] text-slate-600 font-medium">
                  {[department.block && `Block: ${department.block}`, department.panchayat && `GP: ${department.panchayat}`].filter(Boolean).join(' • ')}
                </p>
              )}
            </div>
          </div>

          {department.description && (
            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Mandate & Scope</span>
              <p className="text-slate-700 leading-relaxed font-medium">{department.description}</p>
            </div>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Officers</span>
              <span className="text-sm font-black text-slate-900">{officers.length}</span>
            </div>
            <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-200/70">
              <span className="text-[10px] font-bold text-amber-600 uppercase block">Problems</span>
              <span className="text-sm font-black text-amber-700">{problems.length}</span>
            </div>
            <div className="bg-emerald-50/60 p-2 rounded-xl border border-emerald-200/70">
              <span className="text-[10px] font-bold text-emerald-600 uppercase block">Solutions</span>
              <span className="text-sm font-black text-emerald-700">{department.activeProjectsCount || 0}</span>
            </div>
          </div>

          {/* Assigned Nodal Officers */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-600" /> Assigned Nodal Officers ({officers.length})
            </span>
            {officers.length === 0 ? (
              <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-500 text-center font-medium">
                No nodal officers assigned to this department yet in the database.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {officers.map((officer) => (
                  <div key={officer.id || officer._id} className="p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 block">{officer.fullName}</span>
                      <span className="text-[10px] text-slate-500">{officer.role || 'Nodal Officer'} • {officer.district || 'State HQ'}</span>
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-slate-700">{officer.mobileNumber || officer.email}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Linked Citizen Problems */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-600" /> Linked Citizen Problems ({problems.length})
            </span>
            {problems.length === 0 ? (
              <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-500 text-center font-medium">
                No citizen problem statements linked to this department in the database.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {problems.map((prob) => (
                  <div key={prob.id || prob.challengeId} className="p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-slate-900 block truncate">{prob.title || 'Untitled Problem'}</span>
                      <span className="text-[10px] text-slate-500">{prob.id || prob.challengeId} • {prob.district || 'Jharkhand'}</span>
                    </div>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#007A61]/10 text-[#007A61] shrink-0">
                      {prob.rawStatus || prob.status || 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex justify-end bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailModal;
