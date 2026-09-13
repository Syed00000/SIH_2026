import React from 'react';
import { Landmark, Building2, Users, MapPin, Activity, Clock } from 'lucide-react';

export const StateDepartmentSummaryCards = ({ departments = [] }) => {
  const activeCount = departments.filter(d => d.status === 'Active').length;
  const pendingVerifications = departments.filter(d => d.verificationStatus === 'Pending Verification').length;
  
  // Calculate total lower level units (mocked based on schema arrays if populated, or defaults)
  const totalDistricts = departments.reduce((acc, d) => acc + (d.districtCoverageCount || 0), 0);
  const totalOfficers = departments.reduce((acc, d) => acc + (d.officersCount || 0), 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Landmark className="w-16 h-16 text-[#007A61]" />
        </div>
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-[#007A61]/10 flex items-center justify-center">
            <Landmark className="w-4 h-4 text-[#007A61]" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Departments</h3>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-black text-slate-900">{departments.length}</div>
          <div className="text-xs font-bold text-slate-400 mb-1">{activeCount} Active</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Users className="w-16 h-16 text-blue-600" />
        </div>
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Officers</h3>
        </div>
        <div className="text-2xl font-black text-slate-900">{totalOfficers}</div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Building2 className="w-16 h-16 text-orange-600" />
        </div>
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-orange-600" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Linked Districts</h3>
        </div>
        <div className="text-2xl font-black text-slate-900">{totalDistricts}</div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Activity className="w-16 h-16 text-amber-600" />
        </div>
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Action</h3>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-black text-slate-900">{pendingVerifications}</div>
          <div className="text-[10px] font-bold text-slate-400 mb-1">Verifications</div>
        </div>
      </div>
    </div>
  );
};
