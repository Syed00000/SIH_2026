import React, { useState } from 'react';
import {
  X,
  PlayCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Cpu,
  Radio,
  IndianRupee,
  ShieldCheck,
  Check,
  Layers,
  MapPin
} from 'lucide-react';

export const ProjectManageModal = ({
  project,
  isOpen,
  onClose,
  onUpdateMilestoneStatus,
  onValidateDeployment
}) => {
  const [activeTab, setActiveTab] = useState('milestones'); // 'milestones', 'prototype', 'deployment', 'financials'

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-900 text-white">
                {project.id}
              </span>
              <span className="text-xs font-bold text-slate-500">{project.sector}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {project.deploymentStatus}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">{project.title}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs Bar */}
        <div className="px-6 border-b border-slate-200 bg-white flex space-x-4 text-xs font-bold">
          {[
            { id: 'milestones', label: 'Milestones & Stages' },
            { id: 'prototype', label: 'Prototype & TRL Specs' },
            { id: 'deployment', label: 'Field Deployment' },
            { id: 'financials', label: 'Grant Disbursal' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* TAB 1: MILESTONES */}
          {activeTab === 'milestones' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Milestone Progression & Compliance
                </span>
                <span className="text-xs font-bold text-slate-900">
                  Overall: {project.milestoneProgress || 75}% Completed
                </span>
              </div>

              <div className="space-y-2.5">
                {(project.milestones || []).map((m) => {
                  const isCompleted = m.status === 'Completed';
                  const isInProgress = m.status === 'In Progress';

                  return (
                    <div
                      key={m.id}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-700'
                              : isInProgress
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {m.id}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{m.title}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 italic">
                            "{m.remarks}"
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : isInProgress
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {m.status} ({m.progress}%)
                        </span>

                        {!isCompleted && onUpdateMilestoneStatus && (
                          <button
                            type="button"
                            onClick={() => onUpdateMilestoneStatus(project.id, m.id, 'Completed')}
                            className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors cursor-pointer"
                            title="Mark Milestone Completed"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PROTOTYPE & TRL */}
          {activeTab === 'prototype' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">TRL Rating</span>
                  <span className="text-sm font-black text-slate-900 mt-0.5 block">{project.trlLevel}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Architecture</span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">{project.prototypeType}</span>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Technology Readiness Level Description
                </h4>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {project.trlDescription}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Hardware Specifications & BOM
                </h4>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {project.hardwareSpecs || 'Standard industrial microcontroller unit with solar backup.'}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Testing Facility & Laboratory
                </h4>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {project.labsAndFacilities}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: DEPLOYMENT */}
          {activeTab === 'deployment' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Telemetry Uptime</span>
                  <span className="text-base font-black text-emerald-700">{project.telemetryUptime || '99.4%'}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Field Nodes</span>
                  <span className="text-base font-black text-slate-900">{project.liveSensorsCount || 12} Active</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Beneficiaries</span>
                  <span className="text-base font-black text-slate-900">{project.beneficiariesCount || '45,000+'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Deployment Coordinates & Sites
                </h4>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {project.deploymentLocation || `${project.district} District Field Units`}
                </p>
              </div>

              {onValidateDeployment && (
                <button
                  type="button"
                  onClick={() => onValidateDeployment(project.id)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Issue Official State Deployment Certificate</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 4: FINANCIALS */}
          {activeTab === 'financials' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Sanctioned Grant</span>
                  <span className="text-base font-black text-slate-900">{project.sanctionedGrant}</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">Disbursed</span>
                  <span className="text-base font-black text-emerald-800">{project.disbursedAmount}</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-amber-700 uppercase block">Pending Milestone Tranche</span>
                  <span className="text-base font-black text-amber-800">{project.pendingDisbursal || '₹ 0 Lakhs'}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
                Fund utilization is linked to milestone compliance. All installments require UC (Utilization Certificate) endorsed by the Finance Registrar of <strong>{project.hei}</strong>.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Operating Institution: <strong className="text-slate-800">{project.hei}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectManageModal;
