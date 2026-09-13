import React from 'react';
import { FileText, Search, Filter, ShieldCheck, Activity, User, Clock } from 'lucide-react';

export const StateMinistryAuditPanel = ({ department }) => {
  const auditLogs = [
    {
      id: 1,
      action: 'Escalation Rule Modified',
      module: 'Escalation Engine',
      user: department?.headName || 'Admin User',
      role: 'Principal Secretary',
      timestamp: new Date().toISOString(),
      status: 'Success'
    },
    {
      id: 2,
      action: 'Nodal Officer Assigned',
      module: 'Officers Management',
      user: 'Super Admin',
      role: 'System Administrator',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'Success'
    },
    {
      id: 3,
      action: 'Hierarchy Configuration Updated',
      module: 'Hierarchy',
      user: department?.headName || 'Admin User',
      role: 'Principal Secretary',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      status: 'Success'
    }
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#007A61]" />
            Audit & Compliance Logs
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Immutable log of all administrative actions and configuration changes.
          </p>
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 shrink-0">
          <Filter className="w-4 h-4" />
          <span>Export Logs</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search audit trail..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#007A61] focus:border-[#007A61] outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Action Details</th>
                <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Performed By</th>
                <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Module</th>
                <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 text-xs">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-slate-400" />
                      {log.action}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="w-3 h-3 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{log.user}</p>
                        <p className="text-[10px] text-slate-500">{log.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold border border-slate-200">
                      {log.module}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
