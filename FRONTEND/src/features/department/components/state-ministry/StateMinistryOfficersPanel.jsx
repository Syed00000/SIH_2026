import React from 'react';
import { Users, Search, Plus, ShieldCheck, Mail, Phone, Edit2, ShieldAlert } from 'lucide-react';

export const StateMinistryOfficersPanel = ({ department }) => {
  const officers = [
    {
      id: 1,
      name: department?.headName || 'Not Assigned',
      role: department?.headRole || 'Principal Secretary',
      email: department?.headEmail || department?.credentials?.loginEmail || 'Not available',
      phone: department?.headPhone || 'Not available',
      type: 'Head of Department',
      status: 'Active'
    },
    {
      id: 2,
      name: department?.nodalOfficerName || 'Not Assigned',
      role: department?.nodalOfficerDesignation || 'Under Secretary',
      email: department?.nodalOfficerEmail || 'Not available',
      phone: department?.nodalOfficerPhone || 'Not available',
      type: 'Nodal Officer',
      status: 'Active'
    }
  ].filter(o => o.name !== 'Not Assigned');

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#007A61]" />
            Officers & Credentials
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage principal officers and system access permissions.
          </p>
        </div>
        <button className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Add Officer</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search officers..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#007A61] focus:border-[#007A61] outline-none transition-all"
            />
          </div>
        </div>

        {officers.length === 0 ? (
          <div className="text-center py-12 bg-slate-50">
            <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h3 className="text-xs font-bold text-slate-700">No Officers Found</h3>
            <p className="text-[11px] text-slate-500 mt-1">Add principal or nodal officers to grant them access.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Officer Details</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Designation</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {officers.map((officer) => (
                  <tr key={officer.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#007A61]/10 flex items-center justify-center font-bold text-[#007A61] text-xs">
                          {officer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{officer.name}</p>
                          <p className="text-[10px] font-bold text-slate-500">{officer.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-bold text-slate-700">{officer.role}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <p className="text-[11px] text-slate-600 flex items-center gap-1.5">
                          <Mail className="w-3 h-3" /> {officer.email}
                        </p>
                        <p className="text-[11px] text-slate-600 flex items-center gap-1.5">
                          <Phone className="w-3 h-3" /> {officer.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold border border-emerald-200 flex items-center gap-1 w-fit">
                        <ShieldCheck className="w-3 h-3" />
                        {officer.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
