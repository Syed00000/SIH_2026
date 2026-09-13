import React, { useState } from 'react';
import { 
  Building2, ArrowLeft, Network, FileText, CheckCircle2,
  Users, Activity, Edit2, ShieldAlert
} from 'lucide-react';
import { StateDepartmentHierarchyConfig } from './StateDepartmentHierarchyConfig.jsx';
import { StateDepartmentEscalationPanel } from './StateDepartmentEscalationPanel.jsx';

export const StateDepartmentDetailView = ({ department, onBack, onEdit, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Department Overview', icon: Building2 },
    { id: 'hierarchy', label: 'Hierarchy & Structure', icon: Network },
    { id: 'escalation', label: 'Escalation Engine', icon: Activity }
  ];

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto pb-12 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#007A61]/10 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-[#007A61]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">{department.name}</h1>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    department.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {department.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                  <span>{department.deptId}</span>
                  <span>•</span>
                  <span>{department.category}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(department)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Configuration</span>
            </button>
          </div>
        </div>

        <div className="mt-6 flex overflow-x-auto space-x-1 border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#007A61] text-[#007A61]'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#007A61]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  Mandate & Functions
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Objective</h4>
                    <p className="text-xs text-slate-700">{department.mandate?.objective || 'Not specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Key Functions</h4>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                      {(department.keyFunctions || []).filter(Boolean).map((fn, i) => (
                        <li key={i}>{fn}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Network className="w-4 h-4 text-slate-500" />
                  Jurisdiction & Coverage
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Coverage Type</h4>
                    <p className="text-xs text-slate-700 font-bold">{department.operationalDistrictsType}</p>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Specific Districts</h4>
                    <p className="text-xs text-slate-700">
                      {department.districtCoverage?.length > 0 ? department.districtCoverage.join(', ') : 'State Wide'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  Leadership
                </h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Head of Department</h4>
                    <p className="font-bold text-slate-900">{department.headName || 'Not Assigned'}</p>
                    <p className="text-slate-600">{department.headRole}</p>
                    {department.headEmail && <p className="text-slate-500 mt-1">{department.headEmail}</p>}
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nodal Officer</h4>
                    <p className="font-bold text-slate-900">{department.nodalOfficerName || 'Not Assigned'}</p>
                    <p className="text-slate-600">{department.nodalOfficerDesignation}</p>
                    {department.nodalOfficerEmail && <p className="text-slate-500 mt-1">{department.nodalOfficerEmail}</p>}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  Office Details
                </h3>
                <div className="text-xs space-y-3">
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Headquarters</h4>
                    <p className="text-slate-900 font-bold">{department.headquartersLocation}</p>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Address</h4>
                    <p className="text-slate-700">{department.officeAddress || 'Not specified'}</p>
                  </div>
                  {department.officialWebsite && (
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Website</h4>
                      <a href={department.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-[#007A61] hover:underline font-bold">
                        {department.officialWebsite}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hierarchy' && (
          <StateDepartmentHierarchyConfig department={department} onRefresh={onRefresh} />
        )}

        {activeTab === 'escalation' && (
          <StateDepartmentEscalationPanel department={department} onRefresh={onRefresh} />
        )}
      </div>
    </div>
  );
};
