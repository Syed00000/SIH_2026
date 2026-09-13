import React from 'react';
import { Activity, Clock, ShieldAlert, ArrowUpRight, Plus, Save } from 'lucide-react';

export const StateDepartmentEscalationPanel = ({ department, onRefresh }) => {
  const escalationRules = department.escalationRules || [];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-600" />
            Escalation Engine Configuration
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Define SLA timers and automatic escalation pathways for unresolved issues within this department.
          </p>
        </div>
        <button className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center space-x-1.5">
          <Plus className="w-4 h-4" />
          <span>Add Escalation Rule</span>
        </button>
      </div>

      <div className="space-y-4">
        {escalationRules.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No Escalation Rules Configured</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Issues will not automatically escalate. Add rules to ensure timely resolution across the administrative hierarchy.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Level</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">From Role</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Escalates To</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">SLA (Hours)</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {escalationRules.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-bold text-slate-900">Level {rule.level}</td>
                    <td className="px-4 py-3 text-xs text-slate-700">{rule.fromRole}</td>
                    <td className="px-4 py-3 text-xs font-bold text-[#007A61] flex items-center gap-1.5">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>{rule.toRole}</span>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-amber-600 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{rule.timeHours} Hours</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs font-bold text-slate-500 hover:text-slate-900">Edit</button>
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
