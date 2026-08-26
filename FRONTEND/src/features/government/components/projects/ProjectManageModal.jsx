import React, { useState } from 'react';
import {
  X,
  Building2,
  Calendar,
  IndianRupee,
  CheckCircle2,
  Clock,
  AlertCircle,
  Cpu,
  MapPin,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Award,
  FileText,
  FileCheck,
  Printer
} from 'lucide-react';
import ProjectCertificateModal from './ProjectCertificateModal.jsx';

export const ProjectManageModal = ({
  project,
  isOpen,
  onClose,
  onUpdateMilestoneStatus,
  onValidateDeployment
}) => {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'milestones' | 'telemetry' | 'finances'
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Top Header Bar */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/80">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black bg-slate-900 text-white">
                {project.id}
              </span>
              <span className="text-xs font-bold text-slate-500">{project.sector}</span>
              <span>•</span>
              <span className="font-semibold text-xs text-slate-700">{project.district} District</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  project.deploymentStatus?.includes('Validated')
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {project.deploymentStatus}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">{project.title}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 flex items-center space-x-6 bg-white overflow-x-auto">
          {[
            { id: 'overview', label: '1. Overview & Hardware Specs', icon: Cpu },
            { id: 'milestones', label: '2. Stage-Gate Milestones', icon: CheckCircle2 },
            { id: 'telemetry', label: '3. Live IoT Telemetry', icon: Activity },
            { id: 'finances', label: '4. Financials & Tranches', icon: IndianRupee }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`py-3.5 border-b-2 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <TabIcon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body Canvas */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs bg-slate-50/40">
          {/* TAB 1: OVERVIEW & SPECS */}
          {activeSubTab === 'overview' && (
            <div className="space-y-5">
              {/* Institution & Team Lead Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Executing HEI</span>
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span>{project.hei}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{project.heiType || 'State University'}</span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Principal Investigator</span>
                  <div className="font-bold text-slate-900">{project.teamLead}</div>
                  <span className="text-[11px] text-slate-500">{project.leadEmail}</span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Technology Readiness</span>
                  <div className="font-mono font-black text-sm text-slate-900 flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-white rounded-md">{project.trlLevel}</span>
                    <span className="text-xs font-bold text-slate-700">{project.prototypeType}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 line-clamp-1">{project.trlDescription}</span>
                </div>
              </div>

              {/* Hardware Bill of Materials (BOM) */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <Cpu className="w-4 h-4 text-slate-700" />
                  <span>Technical Architecture & Hardware Bill of Materials (BOM)</span>
                </h3>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-800 leading-relaxed font-mono text-xs">
                  {project.hardwareSpecs || 'Industrial Grade Embedded Microcontroller, Sub-GHz Transceiver, Integrated Solar Harvester.'}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                  <span className="font-bold text-slate-700">Lab Facility:</span>
                  <span>{project.labsAndFacilities}</span>
                </div>
              </div>

              {/* State Validation Certificate Banner */}
              <div className="p-5 bg-slate-900 text-white rounded-xl flex items-center justify-between shadow-md">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>State Validation & Deployment Status</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Certified compliant with Jharkhand State Societal Innovation Standards.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCertificateOpen(true)}
                  className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View Official Certificate</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MILESTONES & STAGE GATES */}
          {activeSubTab === 'milestones' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Overall Milestone Progress</span>
                  <div className="text-base font-black text-slate-900 mt-0.5">{project.milestonePhase}</div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-slate-900">{project.milestoneProgress || 50}%</span>
                  <span className="text-[10px] text-slate-500 block">Completed</span>
                </div>
              </div>

              <div className="space-y-3">
                {(project.milestones || []).map((m, idx) => {
                  const isDone = m.status === 'Completed';
                  const isInProg = m.status === 'In Progress';

                  return (
                    <div
                      key={m.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            isDone
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isInProg
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {m.id}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                                isDone
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : isInProg
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              {m.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 italic">"{m.remarks}"</p>
                          {m.date && <span className="text-[10px] text-slate-400 font-mono">Date: {m.date}</span>}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-end sm:self-center">
                        {!isDone && (
                          <button
                            type="button"
                            onClick={() => onUpdateMilestoneStatus && onUpdateMilestoneStatus(project.id, m.id, 'Completed')}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Mark Complete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE IOT TELEMETRY */}
          {activeSubTab === 'telemetry' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Telemetry Uptime</span>
                  <span className="text-base font-black text-emerald-700 mt-0.5">{project.telemetryUptime || '99.4%'}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Sensor Nodes</span>
                  <span className="text-base font-black text-slate-900 mt-0.5">{project.liveSensorsCount || 12} Nodes</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Citizen Beneficiaries</span>
                  <span className="text-base font-black text-slate-900 mt-0.5">{project.beneficiariesCount || '45,000+'}</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Real-time Sensor Broadcast Feed
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Sensor Node</th>
                        <th className="py-2.5 px-3">Telemetry Readings</th>
                        <th className="py-2.5 px-3">Operational Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(project.telemetryReadings || [
                        { timestamp: '10:00 AM', node: 'NODE-01', ph: '7.4', status: 'Optimal' },
                        { timestamp: '12:00 PM', node: 'NODE-02', ph: '7.2', status: 'Optimal' }
                      ]).map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono text-slate-500">{r.timestamp}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">{r.node}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-700">
                            {r.ph ? `pH: ${r.ph} | Turbidity: ${r.turbidity || '2 NTU'}` : r.chamberTemp ? `Temp: ${r.chamberTemp} | Humidity: ${r.humidity}` : JSON.stringify(r)}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FINANCIALS & TRANCHES */}
          {activeSubTab === 'finances' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Sanctioned Grant</span>
                  <span className="text-base font-black text-slate-900">{project.sanctionedGrant}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Disbursed</span>
                  <span className="text-base font-black text-emerald-700">{project.disbursedAmount}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Disbursal Progress</span>
                  <span className="text-base font-black text-slate-900">{project.disbursedPercentage || 70}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Audit Status</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                    UC Verified ✓
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Grant Tranche Schedule & Ledger
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">Tranche 1 (Advance & CapEx)</span>
                      <span className="text-slate-500 block text-[11px]">Voucher #JH-GR-0981 • Disbursed upon RFP approval</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">₹ 8.00 Lakhs [Paid]</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">Tranche 2 (Prototype Lab Validation)</span>
                      <span className="text-slate-500 block text-[11px]">Voucher #JH-GR-1042 • Disbursed upon Stage Gate 2 sign-off</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">₹ 5.50 Lakhs [Paid]</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">Tranche 3 (Field Scaling & Final Report)</span>
                      <span className="text-slate-500 block text-[11px]">Subject to final state deployment validation</span>
                    </div>
                    <span className="font-mono font-bold text-amber-700">₹ 5.00 Lakhs [Pending]</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-white">
          <button
            type="button"
            onClick={() => setIsCertificateOpen(true)}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print State Certificate</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
              Close Inspector
            </button>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <ProjectCertificateModal
        project={project}
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />
    </div>
  );
};

export default ProjectManageModal;
