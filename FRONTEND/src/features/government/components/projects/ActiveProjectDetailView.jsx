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
  Activity,
  Award,
  FileText,
  Printer,
  Mail,
  Send,
  UserCheck,
  Edit,
  Trash2,
  CreditCard
} from 'lucide-react';
import ProjectSpecificLocationMap from './ProjectSpecificLocationMap.jsx';
import ProjectLeafletMap from './ProjectLeafletMap.jsx';
import ProjectTelemetryCharts from './ProjectTelemetryCharts.jsx';
import ProjectCertificateModal from './ProjectCertificateModal.jsx';
import ValidationEmailModal from './ValidationEmailModal.jsx';
import FinalProjectCompletionModal from './FinalProjectCompletionModal.jsx';
import { GrantPaymentModal, getGrantFinancials, formatGrantLakhs } from './GrantPaymentModal.jsx';
import EditProjectModal from './EditProjectModal.jsx';

export const ActiveProjectDetailView = ({
  project,
  onBack,
  onUpdateMilestoneStatus,
  onValidateDeployment,
  onApproveCompletion,
  onSaveProject,
  onDeleteProject,
  onConfirmPayment
}) => {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'milestones' | 'telemetry' | 'finances'
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!project) return null;

  const milestonesList = project.milestones || [];
  const completedMilestones = milestonesList.filter((m) => m.status === 'Completed').length;
  const isCompleted = project.isCompleted || (milestonesList.length > 0 && completedMilestones === milestonesList.length);

  // Exact 3-Way Financial Status
  const fin = getGrantFinancials(project.sanctionedGrant, project.disbursedAmount);

  const handleValidate = () => {
    if (onValidateDeployment) {
      onValidateDeployment(project.id);
    }
    setIsEmailModalOpen(true);
  };

  const handleConfirmCompletion = (prjId, completionData) => {
    if (onApproveCompletion) {
      onApproveCompletion(prjId, completionData);
    }
    setIsEmailModalOpen(true);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete project ${project.id} (${project.title})?`)) {
      if (onDeleteProject) {
        onDeleteProject(project.id);
      }
      onBack();
    }
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
          {/* Pay Grant Button */}
          {!fin.isFullyPaid && (
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Release Grant Payment ({fin.pendingStr} Pending)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
          >
            <Edit className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Project</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEmailModalOpen(true)}
            className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
          >
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            <span>Send Email</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCertificateOpen(true)}
            className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Certificate</span>
          </button>

          {!isCompleted ? (
            <button
              type="button"
              onClick={() => setIsCompletionModalOpen(true)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Approve Completion</span>
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Completed ✓</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleDelete}
            className="p-1.5 bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            title="Delete Project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Title & Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black bg-slate-900 text-white">
            {project.id}
          </span>
          <span className="text-slate-500">{project.sector}</span>
          <span>•</span>
          <span className="text-slate-700">{project.district} District</span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
            {project.trlLevel} ({project.prototypeType})
          </span>
          <span>•</span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
            fin.isFullyPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            {fin.isFullyPaid ? 'Grant Fully Paid (100%) ✓' : `Grant Partially Paid (${fin.percentage}% Disbursed)`}
          </span>
        </div>

        <h1 className="text-lg sm:text-xl font-bold text-slate-900">{project.title}</h1>

        {/* Project Completed Banner if done */}
        {isCompleted && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-950 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm block">Project Officially Completed & Approved by Government!</span>
                <span className="text-xs text-emerald-800">All milestones verified and field deployment successfully handed over.</span>
                {project.completedByOfficer && (
                  <span className="block text-[11px] text-emerald-700 mt-0.5 font-medium">
                    Signed off by: {project.completedByOfficer} ({project.officerDesignation})
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCertificateOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs cursor-pointer"
            >
              Download Handover Certificate
            </button>
          </div>
        )}

        {/* Quick Stats Grid with Exact 3-Way Financials */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Executing Institution</span>
            <span className="font-bold text-slate-900 block mt-0.5">{project.hei}</span>
            <span className="text-[11px] text-slate-500">{project.teamLead}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Stage</span>
            <span className="font-bold text-slate-900 block mt-0.5">{project.milestonePhase}</span>
            <span className="text-[11px] text-slate-500 font-semibold">{project.milestoneProgress || 50}% Done</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Approved Grant</span>
            <span className="font-bold text-slate-900 text-sm block mt-0.5">{fin.sanctionedStr}</span>
            <span className="text-[11px] text-emerald-700 font-semibold">Paid: {fin.disbursedStr}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Pending Payment</span>
            {fin.isFullyPaid ? (
              <span className="font-bold text-emerald-700 text-sm block mt-0.5">Fully Paid (100%) ✓</span>
            ) : (
              <span className="font-bold text-amber-700 text-sm block mt-0.5">{fin.pendingStr}</span>
            )}
            <span className="text-[11px] text-slate-500">{fin.percentage}% Disbursed</span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: '1. Project Overview & System Details', icon: Cpu },
          { id: 'milestones', label: '2. Project Steps & Verification', icon: CheckCircle2 },
          { id: 'telemetry', label: '3. Map & Live Device Status', icon: Activity },
          { id: 'finances', label: '4. Grant Funding & Payments', icon: IndianRupee }
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
          {/* Location Mapping Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Problem Location (Yeh Samasya Kahan Ki Hai):</span>
              </span>
              <p className="text-xs font-bold text-slate-900 leading-snug">
                {project.problemOrigin || `${project.district} District Ground Problem Zone`}
              </p>
              <span className="text-[11px] text-slate-500 block">District: <strong>{project.district}</strong></span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Active Work Site (Kaam Kahan Ho Rha Hai):</span>
              </span>
              <p className="text-xs font-bold text-slate-900 leading-snug">
                {project.activeWorkSite || `${project.hei} Campus Lab & Field Testing Site`}
              </p>
              <span className="text-[11px] text-slate-500 block">Executing Institution: <strong>{project.hei}</strong></span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              System Specifications & Solution Details
            </h3>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-800 leading-relaxed font-sans">
              {project.hardwareSpecs || 'Industrial Grade Embedded Microcontroller, Sub-GHz Transceiver, Integrated Solar Harvester.'}
            </div>
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
              <span><strong>Testing Lab:</strong> {project.labsAndFacilities}</span>
              <span><strong>Field Deployment Area:</strong> {project.deploymentLocation}</span>
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
                  Project Delivery Steps & Approvals
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Verify each deliverable step to complete the project</p>
              </div>
              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
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
                        <span>Verify Step</span>
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-bold text-xs flex items-center space-x-1 self-end sm:self-center">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Step Verified</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EXACT LOCATION MAP & LIVE DEVICE STATUS */}
      {activeSubTab === 'telemetry' && (
        <div className="space-y-5">
          {/* Specific Project Location Map */}
          <ProjectSpecificLocationMap
            project={project}
            height="360px"
          />

          {/* Sensor Graphs */}
          <ProjectTelemetryCharts project={project} />
        </div>
      )}

      {/* TAB 4: FINANCIALS & GRANT PAYMENTS (100% RIGOROUS & ACCURATE) */}
      {activeSubTab === 'finances' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-5 rounded-xl border border-slate-200 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">1. Total Sanctioned</span>
              <span className="text-base font-black text-slate-900 mt-1 block">{fin.sanctionedStr}</span>
              <span className="text-[10px] text-slate-500">Total Approved Pool</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">2. Already Paid</span>
              <span className="text-base font-black text-emerald-700 mt-1 block">{fin.disbursedStr}</span>
              <span className="text-[10px] text-slate-500">{fin.percentage}% Disbursed</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">3. Pending to Disburse</span>
              {fin.isFullyPaid ? (
                <span className="text-sm font-black text-emerald-700 mt-1 block">₹ 0.00 Lakhs</span>
              ) : (
                <span className="text-base font-black text-amber-700 mt-1 block">{fin.pendingStr}</span>
              )}
              <span className="text-[10px] text-slate-500">
                {fin.isFullyPaid ? '100% Fully Paid ✓' : 'Remaining Balance'}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              {!fin.isFullyPaid ? (
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center justify-center space-x-1"
                >
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>Release Payment</span>
                </button>
              ) : (
                <div className="text-center">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 inline-block">
                    Fully Paid (100%) ✓
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">No pending dues</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Grant Payment Vouchers & Disbursal Ledger
                </h3>
                <p className="text-[11px] text-slate-500">Record of all treasury tranches released for this project</p>
              </div>

              {!fin.isFullyPaid && (
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer flex items-center space-x-1"
                >
                  <span>+ Release Next Payment</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {(project.paymentRecords || [
                {
                  id: 'JH-GR-0981',
                  trancheName: 'Tranche 1: Equipment & Prototype Start',
                  amount: '₹ 8.00 Lakhs',
                  date: '2026-02-15',
                  paymentMode: 'PFMS Direct Treasury Transfer',
                  status: 'Paid'
                },
                {
                  id: 'JH-GR-1042',
                  trancheName: 'Tranche 2: Field Trial & Testing',
                  amount: '₹ 5.50 Lakhs',
                  date: '2026-05-10',
                  paymentMode: 'State Innovation Fund DBT',
                  status: 'Paid'
                }
              ]).map((pRec, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{pRec.trancheName}</span>
                    <span className="text-slate-500 block text-[11px]">
                      Voucher #{pRec.id} • {pRec.paymentMode} • {pRec.date}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-emerald-700">{pRec.amount} [{pRec.status}]</span>
                </div>
              ))}
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

      {/* Final Completion Modal */}
      <FinalProjectCompletionModal
        project={project}
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        onConfirmCompletion={handleConfirmCompletion}
      />

      {/* Grant Payment Modal */}
      <GrantPaymentModal
        project={project}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirmPayment={onConfirmPayment}
      />

      {/* Edit Project Modal */}
      <EditProjectModal
        project={project}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={onSaveProject}
      />
    </div>
  );
};

export default ActiveProjectDetailView;
