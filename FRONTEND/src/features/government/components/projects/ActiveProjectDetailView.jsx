import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Calendar,
  IndianRupee,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Award,
  Layers,
  MapPin,
  Send,
  CreditCard,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { GrantPaymentModal, parseGrantRupees, formatRupeesINR } from './GrantPaymentModal.jsx';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

export const ActiveProjectDetailView = ({
  project,
  onBack,
  onInitiateNextTranche
}) => {
  const [activeSubTab, setActiveSubTab] = useState('milestones'); // 'milestones' | 'finances'
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  if (!project) return null;

  const totalSanctionedNum = parseGrantRupees(project.sanctionedGrant || project.budget) || 73000;
  const currentDisbursedNum = parseGrantRupees(project.disbursedAmount || project.disbursedGrant) || 0;
  const pendingGrantNum = Math.max(0, totalSanctionedNum - currentDisbursedNum);
  const isFullyPaid = currentDisbursedNum >= totalSanctionedNum && totalSanctionedNum > 0;

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // 3-Tranche Breakdown: Tranche 1 (50%), Tranche 2 (25%), Tranche 3 (25%)
  const tranche1Target = Math.round(totalSanctionedNum * 0.5);
  const tranche2Target = Math.round(totalSanctionedNum * 0.25);
  const tranche3Target = totalSanctionedNum - tranche1Target - tranche2Target;

  // Real paid amounts per tranche based on actual currentDisbursedNum
  const tranche1Paid = Math.min(tranche1Target, currentDisbursedNum);
  const tranche1Remaining = Math.max(0, tranche1Target - tranche1Paid);
  const isTranche1Complete = tranche1Paid >= tranche1Target;

  const tranche2Paid = Math.max(0, Math.min(tranche2Target, currentDisbursedNum - tranche1Target));
  const tranche2Remaining = Math.max(0, tranche2Target - tranche2Paid);
  const isTranche2Complete = isTranche1Complete && tranche2Paid >= tranche2Target;

  const tranche3Paid = Math.max(0, Math.min(tranche3Target, currentDisbursedNum - tranche1Target - tranche2Target));
  const tranche3Remaining = Math.max(0, tranche3Target - tranche3Paid);
  const isTranche3Complete = isFullyPaid;

  const handlePayInstallment = (trancheName, amountNum) => {
    if (onInitiateNextTranche) {
      onInitiateNextTranche({
        ...project,
        installmentType: trancheName,
        suggestedAmount: formatRupeesINR(amountNum)
      });
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {/* Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-bold flex items-center space-x-2 bg-slate-900 text-white border-slate-800 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Back & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Active Projects</span>
        </button>

        <div className="flex items-center space-x-2">
          {!isFullyPaid ? (
            <a
              href="?tab=csr"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
            >
              <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {!isTranche1Complete
                  ? `Pay Tranche 1 Balance (${formatRupeesINR(tranche1Remaining)})`
                  : !isTranche2Complete
                  ? `Disburse Tranche 2 (${formatRupeesINR(tranche2Remaining)})`
                  : `Disburse Tranche 3 (${formatRupeesINR(tranche3Remaining)})`}
              </span>
            </a>
          ) : (
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>All Tranches Disbursed (100%) ✓</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Title & Institution Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black bg-slate-900 text-white">
            {project.id}
          </span>
          <span className="text-slate-500">{project.sector || 'State Innovation Project'}</span>
          <span>•</span>
          <span className="text-slate-700">{project.district || 'Ranchi'} District</span>
          <span>•</span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            Execution Status: Active Telemetry
          </span>
        </div>

        <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {project.title}
        </h1>

        {/* Institution Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Executing Institution
            </span>
            <span className="font-bold text-slate-900 text-sm block">
              {project.hei || 'Ranchi University (RU001)'}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Nodal State R&D Center
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Sanctioned Grant Corpus
            </span>
            <span className="font-mono font-black text-slate-900 text-base block">
              {formatRupeesINR(totalSanctionedNum)}
            </span>
            <span className="text-[11px] text-[#007A61] font-bold">
              Disbursed: {formatRupeesINR(currentDisbursedNum)}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Pending Grant Balance
            </span>
            <span className="font-mono font-black text-amber-700 text-base block">
              {formatRupeesINR(pendingGrantNum)}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {isFullyPaid ? '100% Released ✓' : 'Subject to Milestone Gate Clearance'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('milestones')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeSubTab === 'milestones'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>1. Project Steps & Milestone Verification</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('finances')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeSubTab === 'finances'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <IndianRupee className="w-3.5 h-3.5" />
          <span>2. Grant Funding & Tranche Disbursal Ledger</span>
        </button>
      </div>

      {/* TAB 1: MILESTONES */}
      {activeSubTab === 'milestones' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Research & Execution Milestones (4 Stage Gates)
              </h3>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Progress: {project.progress || 57}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              {[
                { stage: 'Stage 1', title: 'Problem Baseline & DPR Formulation', dur: 'Days 1-30', status: isTranche1Complete ? 'Completed' : 'In Progress', note: 'Architecture verified and initial DPR sanctioned by State Council.' },
                { stage: 'Stage 2', title: 'Lab Prototyping & Embedded Build', dur: 'Days 31-75', status: isTranche1Complete ? 'In Progress' : 'Pending Tranche 1', note: 'Hardware prototype under calibration at Ranchi University Lab.' },
                { stage: 'Stage 3', title: 'District Field Trial & Telemetry', dur: 'Days 76-135', status: isTranche2Complete ? 'In Progress' : 'Pending', note: 'Awaiting completion of Stage 2 lab calibration.' },
                { stage: 'Stage 4', title: 'NABL Certification & Handover', dur: 'Days 136-180', status: isFullyPaid ? 'In Progress' : 'Pending', note: 'Final compliance benchmarking and district deployment.' }
              ].map((m, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border space-y-2 ${
                    m.status === 'Completed'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : m.status === 'In Progress'
                      ? 'bg-blue-50/40 border-blue-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-black uppercase text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {m.stage} • {m.dur}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        m.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : m.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs">{m.title}</h4>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{m.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GRANT FUNDING & INSTALLMENTS */}
      {activeSubTab === 'finances' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Tranche Disbursal Schedule & Installments
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  State PFMS Host-to-Host payments linked to Milestone Gate clearance
                </p>
              </div>
              <span className="text-sm font-black font-mono text-slate-900">
                Total Grant: {formatRupeesINR(totalSanctionedNum)}
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {/* Tranche 1 */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-xs">
                      Tranche 1 (50% = {formatRupeesINR(tranche1Target)})
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isTranche1Complete ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                      {isTranche1Complete ? 'Initial Mobilization & DPR (Fully Paid)' : `Partially Disbursed: ${formatRupeesINR(tranche1Paid)}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Purpose: Baseline Sensor Acquisition, BOM Components & DPR Inception
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-black text-[#007A61] text-sm">
                    {formatRupeesINR(tranche1Paid)} / {formatRupeesINR(tranche1Target)}
                  </span>
                  {isTranche1Complete ? (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Disbursed via PFMS ✓
                    </span>
                  ) : (
                    <a
                      href="?tab=csr"
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs shadow-2xs cursor-pointer flex items-center space-x-1"
                    >
                      <IndianRupee className="w-3.5 h-3.5 text-slate-300" />
                      <span>Release Balance ({formatRupeesINR(tranche1Remaining)})</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Tranche 2 */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-xs">
                      Tranche 2 (25% = {formatRupeesINR(tranche2Target)})
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      Hardware Prototyping
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Purpose: Lab Testing, Embedded Firmware Prototyping & Calibration
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-black text-slate-900 text-sm">
                    {formatRupeesINR(tranche2Paid)} / {formatRupeesINR(tranche2Target)}
                  </span>
                  {isTranche2Complete ? (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Disbursed ✓
                    </span>
                  ) : (
                    <a
                      href="?tab=csr"
                      disabled={!isTranche1Complete}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs shadow-2xs cursor-pointer flex items-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <IndianRupee className="w-3.5 h-3.5 text-slate-300" />
                      <span>Release Tranche 2</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Tranche 3 */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-xs">
                      Tranche 3 (25% = {formatRupeesINR(tranche3Target)})
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      Field Deployment & Handover
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Purpose: Final District Deployment, NABL Proof Benchmark & Public Rollout
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-black text-slate-900 text-sm">
                    {formatRupeesINR(tranche3Paid)} / {formatRupeesINR(tranche3Target)}
                  </span>
                  {isTranche3Complete ? (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Disbursed ✓
                    </span>
                  ) : (
                    <a
                      href="?tab=csr"
                      disabled={!isTranche2Complete}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs shadow-2xs cursor-pointer flex items-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <IndianRupee className="w-3.5 h-3.5 text-slate-300" />
                      <span>Release Tranche 3</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveProjectDetailView;
