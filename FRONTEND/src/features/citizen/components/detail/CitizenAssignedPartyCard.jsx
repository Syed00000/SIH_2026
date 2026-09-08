import React from 'react';
import { Wrench, Phone, Building2, Building, ShieldCheck, UserCheck } from 'lucide-react';

export const CitizenAssignedPartyCard = ({ challenge }) => {
  if (!challenge) return null;

  const tech = challenge.assignedTechnician;
  const dept = challenge.assignedDepartment;
  const uni = challenge.assignedUniversity;
  const isWithdrawn = (challenge.status || '').toLowerCase() === 'withdrawn';

  if (isWithdrawn) return null;

  return (
    <div className="space-y-3 select-none text-left">
      {/* 1. Dedicated Field Technician Card */}
      {tech && (tech.name || tech.technicianId || tech.phone) && (() => {
        const isAccepted = tech.status === 'Accepted' || tech.status === 'Completed' || tech.status === 'In Progress';
        return (
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/90 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Wrench className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-black text-blue-950 uppercase tracking-wide block">
                    Assigned Field Technician
                  </span>
                  <span className="text-[10px] text-blue-700 font-semibold">
                    {isAccepted ? 'Ground repair crew deployed & active' : 'Awaiting technician task acceptance'}
                  </span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                isAccepted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isAccepted ? (tech.status === 'Completed' ? 'Task Completed' : 'Task Accepted • Active') : 'Pending Acceptance'}
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{tech.name || 'Field Technician'}</span>
                  {tech.technicianId && (
                    <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded font-mono text-[10px] font-bold">
                      {tech.technicianId}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Trade: <strong className="text-slate-700">{tech.specialization || 'Civic Remediation'}</strong>
                </p>
                {tech.instructions && (
                  <p className="text-[10.5px] text-slate-600 italic">
                    Note: "{tech.instructions}"
                  </p>
                )}
                {!isAccepted && (
                  <p className="text-[10.5px] text-amber-700 font-medium pt-1">
                    Direct phone number will unlock as soon as technician accepts assignment.
                  </p>
                )}
              </div>

              {/* Direct Contact Button (Only visible after technician accepts) */}
              {isAccepted && tech.phone && (
                <a
                  href={`tel:${tech.phone}`}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                  title={`Call ${tech.name} at ${tech.phone}`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call: {tech.phone}</span>
                </a>
              )}
            </div>
          </div>
        );
      })()}

      {/* 2. Block Department Jurisdiction Card */}
      {dept && (dept.name || dept.block) && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center justify-between font-bold text-slate-900 text-xs">
            <div className="flex items-center space-x-1.5 text-emerald-900">
              <Building2 className="w-4 h-4 text-[#007A61]" />
              <span>Assigned Block & Department</span>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-extrabold">
              {dept.category || 'Civic Triage'}
            </span>
          </div>
          <div className="text-xs text-slate-700 flex flex-wrap items-center gap-2 pt-0.5">
            <span className="font-bold text-slate-900">{dept.name || 'Block Wing'}</span>
            {dept.block && <span className="text-slate-500">• {dept.block} Block</span>}
            {dept.headName && (
              <span className="text-slate-500 flex items-center gap-1">
                • <ShieldCheck className="w-3 h-3 text-[#007A61]" /> In-Charge: {dept.headName}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 3. University Lab Card (For Big / R&D Problems) */}
      {uni && (uni.name || uni.universityName) && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center justify-between font-bold text-slate-900 text-xs">
            <div className="flex items-center space-x-1.5 text-emerald-950">
              <Building className="w-4 h-4 text-[#047857]" />
              <span>Assigned University R&D</span>
            </div>
            <span className="text-[10.5px] text-emerald-800 font-extrabold">
              {challenge.assignmentStatus === 'ACCEPTED' ? 'Accepted' : 'Under Lab Review'}
            </span>
          </div>
          <div className="text-slate-700 text-xs">
            <span className="font-bold text-slate-900">{uni.name || uni.universityName}</span>
            {uni.department && <span className="text-slate-500"> • {uni.department}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenAssignedPartyCard;
