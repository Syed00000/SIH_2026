import React from 'react';
import { Phone, MapPin, Building2, Clock, ShieldCheck } from 'lucide-react';
import { getStatusStyle } from './adminViewStyles.helper.js';

export const AdminViewDetailsList = ({ currentAdmin }) => {
  const statusStyle = getStatusStyle(currentAdmin?.status);

  return (
    <div className="divide-y divide-slate-100 pt-1 border-t border-slate-100 text-xs">
      <div className="flex items-center justify-between py-1.5">
        <span className="text-slate-500 flex items-center space-x-1.5 font-medium text-[11px]">
          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
          <span>Contact Number</span>
        </span>
        <span className="font-semibold text-slate-800 font-mono text-[11px]">{currentAdmin.mobileNumber || '—'}</span>
      </div>

      <div className="flex items-center justify-between py-1.5">
        <span className="text-slate-500 flex items-center space-x-1.5 font-medium text-[11px]">
          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
          <span>Assigned District</span>
        </span>
        <span className="font-semibold text-slate-800 text-[11px]">{currentAdmin.district || 'All Districts'}</span>
      </div>

      {currentAdmin.assignedDepartment && (
        <div className="flex items-center justify-between py-1.5">
          <span className="text-slate-500 flex items-center space-x-1.5 font-medium text-[11px]">
            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Department</span>
          </span>
          <span className="font-semibold text-slate-800 text-[11px]">{currentAdmin.assignedDepartment}</span>
        </div>
      )}

      <div className="flex items-center justify-between py-1.5">
        <span className="text-slate-500 flex items-center space-x-1.5 font-medium text-[11px]">
          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
          <span>Last Login</span>
        </span>
        <span className="font-medium text-slate-600 text-[11px]">{currentAdmin.lastLogin || 'Never logged in'}</span>
      </div>

      <div className="flex items-center justify-between py-1.5">
        <span className="text-slate-500 flex items-center space-x-1.5 font-medium text-[11px]">
          <ShieldCheck className="w-3 h-3 text-slate-400 shrink-0" />
          <span>Account Status</span>
        </span>
        <span className={`inline-flex items-center space-x-1.5 text-[11px] font-semibold ${statusStyle.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
          <span>{currentAdmin.status}</span>
        </span>
      </div>
    </div>
  );
};

export default AdminViewDetailsList;
