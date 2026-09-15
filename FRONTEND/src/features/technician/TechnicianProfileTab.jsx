import React from 'react';
import { User, ShieldCheck, MapPin, Phone, Mail, Wrench, CheckCircle2 } from 'lucide-react';

export const TechnicianProfileTab = ({ user, counts }) => {
  const name = user?.fullName || user?.name || 'Field Technician';
  const techId = user?.technicianId || user?.id || 'TECH-FIELD';
  const dept = user?.department || user?.departmentName || 'Department of Electricity & Power';
  const phone = user?.mobileNumber || user?.phone || '9431100202';
  const email = user?.email || `${techId.toLowerCase()}@jharkhand.gov.in`;
  const spec = user?.specialization || 'High-Tension Lineman & Grid Overseer';
  const district = user?.district || 'Ranchi District';
  const block = user?.block || 'Kanke Block';

  return (
    <div className="space-y-4 max-w-4xl text-left select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-none border border-slate-200 p-6 shadow-2xs">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-none bg-emerald-800 text-white font-black text-2xl flex items-center justify-center shadow-xs">
            {name ? name.charAt(0).toUpperCase() : 'T'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900">{name}</h2>
              <span className="font-mono text-xs font-bold text-[#007A61]">
                {techId}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">{spec}</p>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none text-[10.5px] font-bold text-emerald-800 mt-1.5">
              <span className="w-1.5 h-1.5 rounded-none bg-emerald-600 animate-pulse" />
              Active Departmental Field Officer
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-[#007A61] shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10.5px] font-medium">Department</span>
              <strong className="text-slate-900">{dept}</strong>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700">
            <MapPin className="w-4 h-4 text-[#007A61] shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10.5px] font-medium">Jurisdiction</span>
              <strong className="text-slate-900">{block} • {district}</strong>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700">
            <Phone className="w-4 h-4 text-[#007A61] shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10.5px] font-medium">Contact Phone (Unlocked on Accept)</span>
              <strong className="font-mono text-slate-900">{phone}</strong>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700">
            <Mail className="w-4 h-4 text-[#007A61] shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10.5px] font-medium">Official Portal Email</span>
              <strong className="text-slate-900">{email}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Remediation Performance Metric Snapshot */}
      <div className="bg-white rounded-none border border-slate-200 p-5 shadow-2xs grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-slate-50 rounded-none">
          <span className="text-slate-500 text-[11px] font-bold block">Assigned Problems</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block">{counts.total}</span>
        </div>
        <div className="p-3 bg-blue-50/60 rounded-none">
          <span className="text-blue-700 text-[11px] font-bold block">Active on Ground</span>
          <span className="text-xl font-black text-blue-900 mt-0.5 block">{counts.active}</span>
        </div>
        <div className="p-3 bg-emerald-50/60 rounded-none">
          <span className="text-emerald-700 text-[11px] font-bold block">Completed / Done</span>
          <span className="text-xl font-black text-emerald-900 mt-0.5 block">{counts.completed}</span>
        </div>
      </div>
    </div>
  );
};

export default TechnicianProfileTab;
