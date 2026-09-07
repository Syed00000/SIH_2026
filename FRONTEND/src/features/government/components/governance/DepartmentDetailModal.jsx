import React from 'react';
import { X, Landmark, Users, MapPin, Mail, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DepartmentDetailModal = ({ department, onClose, officers = [] }) => {
  if (!department) return null;

  const matchedOfficers = officers.filter(
    (o) =>
      o.assignedDepartment?.toLowerCase().includes(department.code.toLowerCase()) ||
      department.name.toLowerCase().includes(o.assignedDepartment?.toLowerCase() || '___')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">{department.name}</h3>
              <span className="text-[11px] font-bold text-slate-400">{department.code} • Jharkhand Line Ministry</span>
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
          {/* Department Mandate */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Mandate</span>
            <p className="text-slate-700 leading-relaxed font-medium">{department.mandate}</p>
          </div>

          {/* Secretariat Info */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500" /> Secretariat
              </span>
              <p className="font-bold text-slate-800">{department.secretariatLocation}</p>
            </div>
            <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Mail className="w-3 h-3 text-[#007A61]" /> Nodal Email
              </span>
              <p className="font-bold text-slate-800 font-mono truncate">{department.email}</p>
            </div>
          </div>

          {/* Assigned Nodal Officers */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-600" /> Assigned Nodal Officers ({matchedOfficers.length})
              </span>
              <span className="text-[10px] font-bold text-[#007A61] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> State Authorized
              </span>
            </div>

            {matchedOfficers.length === 0 ? (
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 text-center font-medium">
                Lead Officer: {department.leadOfficer || 'State Secretarial Desk'}
              </div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {matchedOfficers.map((officer) => (
                  <div
                    key={officer.id || officer._id}
                    className="p-2 bg-white border border-slate-200/80 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{officer.fullName}</span>
                      <span className="text-[10px] text-slate-400">{officer.role} • {officer.district || 'State HQ'}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{officer.mobileNumber || officer.email}</span>
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
