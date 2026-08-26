import React, { useState } from 'react';
import {
  ArrowLeft,
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
  Award,
  FileText,
  Printer,
  Mail,
  Send
} from 'lucide-react';
import ProjectLeafletMap from './ProjectLeafletMap.jsx';
import ProjectTelemetryCharts from './ProjectTelemetryCharts.jsx';
import ProjectCertificateModal from './ProjectCertificateModal.jsx';
import ValidationEmailModal from './ValidationEmailModal.jsx';

export const ActiveProjectDetailView = ({
  project,
  onBack,
  onUpdateMilestoneStatus,
  onValidateDeployment
}) => {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'milestones' | 'telemetry' | 'finances'
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  if (!project) return null;

  const milestonesList = project.milestones || [];
  const completedMilestones = milestonesList.filter((m) => m.status === 'Completed').length;
  const isAllMilestonesDone = milestonesList.length > 0 && completedMilestones === milestonesList.length;

  const handleValidate = () => {
    if (onValidateDeployment) {
      onValidateDeployment(project.id);
    }
    setIsEmailModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {/* Top Back & Quick Action Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects List</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEmailModalOpen(true)}
            className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            <span>Send Email Notification</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCertificateOpen(true)}
            className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>View Certificate</span>
          </button>

          {!project.deploymentStatus?.includes('Validated') ? (
            <button
              type="button"
              onClick={handleValidate}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Validate & Issue Certificate</span>
            </button>
          ) : (
            <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>State Validated ✓</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Title & Progress Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black bg-slate-900 text-white">
            {project.id}
          </span>
          <span className="text-slate-500">{project.sector}</span>
          <span>•</span>
          <span className="text-slate-700">{project.district} District</span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 font-mono">
            {project.trlLevel} ({project.prototypeType})
          </span>
        </div>

        <h1 className="text-lg sm:text-xl font-bold text-slate-900">{project.title}</h1>

        {/* Project Completed Banner if 100% done */}
        {isAllMilestonesDone && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900 text-xs">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="font-bold block">All Project Milestones Completed (100% Done)!</span>
                <span className="text-[11px] text-emerald-700">Project ready for state-wide public deployment and scaling.</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-2xs">
              Project Completed ✓
            </span>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Executing HEI</span>
            <span className="font-bold text-slate-900 block mt-0.5">{project.hei}</span>
            <span className="text-[11px] text-slate-500">{project.teamLead}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Milestone Stage</span>
            <span className="font-bold text-slate-900 block mt-0.5">{project.milestonePhase}</span>
            <span className="text-[11px] text-slate-500 font-semibold">{project.milestoneProgress || 50}% Done</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Funding Disbursed</span>
            <span className="font-bold text-emerald-700 text-sm block mt-0.5">{project.disbursedAmount}</span>
            <span className="text-[11px] text-slate-500">of {project.sanctionedGrant}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Telemetry Health</span>
            <span className="font-bold text-slate-900 block mt-0.5">{project.telemetryUptime || '99.4%'} Uptime</span>
            <span className="text-[11px] text-slate-500">{project.liveSensorsCount || 12} Active Nodes</span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: '1. Overview & Hardware Specs', icon: Cpu },
          { id: 'milestones', label: '2. Stage-Gate Milestones & Steps', icon: CheckCircle2 },
          { id: 'telemetry', label: '3. Real-time Map & Sensor Graphs', icon: Activity },
          { id: 'finances', label: '4. Financials & Grant Ledger', icon: IndianRupee }
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & SPECS */}
      {activeSubTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Technical Specifications & Hardware Components
            </h3>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 font-mono text-xs text-slate-800 leading-relaxed">
              {project.hardwareSpecs || 'Industrial Grade Embedded Microcontroller, Sub-GHz Transceiver, Integrated Solar Harvester.'}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span><strong>Testing Lab:</strong> {project.labsAndFacilities}</span>
              <span><strong>Field Deployment:</strong> {project.deploymentLocation}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MILESTONES & STEPS */}
      {activeSubTab === 'milestones' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Project Milestone Verification Steps
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Verify each deliverable stage to progress the project</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-800">
                {completedMilestones} of {milestonesList.length} Steps Verified
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {milestonesList.map((m) => {
                const isDone = m.status === 'Completed';

                return (
                  <div
                    key={m.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {m.id}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-900">{m.title}</h4>
                          <span
                            className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                              isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {m.status}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5 italic">"{m.remarks}"</p>
                        {m.date && <span className="text-[10px] text-slate-400 font-mono">Date: {m.date}</span>}
                      </div>
                    </div>

                    {!isDone ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (onUpdateMilestoneStatus) {
                            onUpdateMilestoneStatus(project.id, m.id, 'Completed');
                          }
                        }}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs self-end sm:self-center"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verify & Approve Step</span>
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-bold text-xs flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verified Step</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REAL-TIME LEAFLET MAP & SENSOR CHARTS */}
      {activeSubTab === 'telemetry' && (
        <div className="space-y-5">
          {/* Real Leaflet Map */}
          <ProjectLeafletMap
            selectedDistrict={project.district}
            height="360px"
          />

          {/* Sensor Graphs */}
          <ProjectTelemetryCharts project={project} />
        </div>
      )}

      {/* TAB 4: FINANCIALS & GRANT LEDGER */}
      {activeSubTab === 'finances' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-5 rounded-xl border border-slate-200 text-center text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Sanctioned</span>
              <span className="text-base font-black text-slate-900 mt-1 block">{project.sanctionedGrant}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Disbursed</span>
              <span className="text-base font-black text-emerald-700 mt-1 block">{project.disbursedAmount}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Disbursed %</span>
              <span className="text-base font-black text-slate-900 mt-1 block">{project.disbursedPercentage || 70}%</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Audit Verification</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                UC Verified ✓
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3 text-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Grant Tranches & Audit Ledger
            </h3>
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">Tranche 1 (Project Start & Equipment)</span>
                  <span className="text-slate-500 block text-[11px]">Voucher #JH-GR-0981 • Disbursed</span>
                </div>
                <span className="font-mono font-bold text-emerald-700">₹ 8.00 Lakhs [Paid]</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">Tranche 2 (Lab Validation & NABL)</span>
                  <span className="text-slate-500 block text-[11px]">Voucher #JH-GR-1042 • Disbursed</span>
                </div>
                <span className="font-mono font-bold text-emerald-700">₹ 5.50 Lakhs [Paid]</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">Tranche 3 (Field Deployment & Validation)</span>
                  <span className="text-slate-500 block text-[11px]">Pending final scaling audit</span>
                </div>
                <span className="font-mono font-bold text-amber-700">₹ 5.00 Lakhs [Pending]</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Certificate Modal */}
      <ProjectCertificateModal
        project={project}
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />

      {/* Email Modal */}
      <ValidationEmailModal
        project={project}
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </div>
  );
};

export default ActiveProjectDetailView;
