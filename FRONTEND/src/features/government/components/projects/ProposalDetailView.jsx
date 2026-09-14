import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  Building2,
  Calendar,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Download,
  Check,
  ShieldCheck,
  Award,
  Layers,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  Lock
} from 'lucide-react';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';
import { formatRupeesINR, parseGrantRupees } from './GrantPaymentModal.jsx';
import { useGovernmentTreasury } from '../../hooks/useGovernmentTreasury.js';
import { LowFundAlertBanner } from '../common/LowFundAlertBanner.jsx';
import { AddStateGrantModal } from '../csr/AddStateGrantModal.jsx';

export const ProposalDetailView = ({
  proposal,
  onBack,
  onApproveGrant,
  onRejectProposal,
  onDeleteProposal,
  onNavigateToCsr
}) => {
  const [activeTab, setActiveTab] = useState('dpr'); // 'dpr' | 'methodology' | 'budget' | 'review'
  const [reviewerRemarks, setReviewerRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const treasury = useGovernmentTreasury();
  const [isAddStateGrantOpen, setIsAddStateGrantOpen] = useState(false);

  if (!proposal) return null;

  const totalBudgetStr =
    proposal.requestedGrant ||
    proposal.budgetRequested ||
    proposal.allocatedAmount ||
    proposal.fundingRequested ||
    proposal.budget ||
    '₹ 73,000';

  const rawBudgetNum = parseGrantRupees(totalBudgetStr) || 73000;

  // Check live CSR disbursals
  const projId = proposal.projectId || proposal.id?.replace('PROP-', '') || proposal.id;
  const rawDisbursed =
    projectCsrSyncService.getProjectDisbursed(proposal.id) ||
    projectCsrSyncService.getProjectDisbursed(projId) ||
    (proposal.disbursedAmount ? parseGrantRupees(proposal.disbursedAmount) : 0);

  const pendingBalanceNum = Math.max(0, rawBudgetNum - rawDisbursed);
  const disbursedFormatted = rawDisbursed > 0 ? formatRupeesINR(rawDisbursed) : '₹ 0';
  const pendingFormatted = formatRupeesINR(pendingBalanceNum);

  const isAlreadyInCsr =
    proposal.status === 'Approved' ||
    proposal.status === 'Forwarded to CSR Grants Pipeline' ||
    proposal.budgetStatus === 'Forwarded to CSR Grants Pipeline' ||
    proposal.budgetStatus === 'Grant Sanctioned by Government' ||
    proposal.budgetStatus === 'Grant Disbursed' ||
    rawDisbursed > 0;

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onApproveGrant(proposal, reviewerRemarks);
      setIsSubmitting(false);
    }, 400);
  };

  const handleReject = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onRejectProposal(proposal, reviewerRemarks);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {/* Top Back & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Solution Proposals</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {rawDisbursed > 0 || proposal.budgetStatus === 'Grant Sanctioned by Government' ? (
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Grant Disbursed ({disbursedFormatted} Paid) - Active in Execution ✓</span>
              </span>
              <a
                href="?tab=projects_active"
                className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#00624e] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
              >
                <span>View in Active Projects</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              </a>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Forwarded to CSR Grants Pipeline ✓</span>
              </span>
              <a
                href="?tab=csr"
                className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#00624e] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
              >
                <span>Open CSR Grants & Disbursal</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Main Title & Status Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black bg-slate-900 text-white">
            {proposal.id}
          </span>
          <span className="text-slate-500 font-semibold">{proposal.sector}</span>
          <span>•</span>
          <span className="text-slate-700">{proposal.district || 'Ranchi'} District</span>
          <span>•</span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            Score: {proposal.evaluationScore || 92} / 100
          </span>
        </div>

        <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {proposal.title || proposal.projectTitle}
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
          {proposal.abstract || proposal.problemStatement || 'Grassroots technological solution addressing civic infrastructure, ecological sustainability, or public health in Jharkhand.'}
        </p>

        {/* 3 Metric Summary Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Sanctioned DPR Budget
            </span>
            <span className="font-mono font-black text-slate-900 text-base block">
              {formatRupeesINR(rawBudgetNum)}
            </span>
            <span className="text-[11px] text-slate-500">
              Submitting HEI: {proposal.hei || 'Ranchi University (RU001)'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Disbursed via PFMS
            </span>
            <span className="font-mono font-black text-[#007A61] text-base block">
              {disbursedFormatted}
            </span>
            <span className="text-[11px] text-slate-500">
              {rawDisbursed > 0 ? 'Released to Escrow Node ✓' : 'Awaiting Tranche Release'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Pending Grant Balance
            </span>
            <span className="font-mono font-black text-amber-700 text-base block">
              {pendingFormatted}
            </span>
            <span className="text-[11px] text-slate-500">
              Timeline: {proposal.estimatedMonths || 6} Months
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'dpr', label: '1. Ground Problem & Context', icon: FileText },
          { id: 'methodology', label: '2. Technical Architecture & Steps', icon: Layers },
          { id: 'budget', label: '3. Detailed DPR Budget Table', icon: IndianRupee },
          { id: 'review', label: '4. Evaluation Score & Remarks', icon: ShieldCheck }
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
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

      {/* TAB 1: GROUND PROBLEM & CONTEXT */}
      {activeTab === 'dpr' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Jharkhand Ground Problem & Socio-Economic Need
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {proposal.problemStatement || proposal.title || 'Civic Problem Statement submitted for state intervention.'}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Faculty & Student Research Team
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Lead Faculty Mentor / PI</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">{proposal.teamLead || 'Faculty Investigator'}</span>
                <span className="text-[11px] text-slate-500 font-medium">{proposal.hei || 'Ranchi University (RU001)'}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Student Research Fellows</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">{proposal.studentTeam || 'Student Research Cohort'}</span>
                <span className="text-[11px] text-slate-500 font-medium">B.Tech / M.Tech Research Cohort</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TECHNICAL ARCHITECTURE & STEPS */}
      {activeTab === 'methodology' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Technical Implementation Steps & Methodology
            </h3>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 font-mono whitespace-pre-line leading-relaxed">
              {proposal.methodology || `1. Baseline Ground Data Acquisition & Sensor Calibration\n2. Hardware-in-Loop Embedded Microcontroller Prototyping\n3. Pilot Testbed Deployment in Local Block / Urban Node\n4. Cloud Telemetry Analytics & Field Validation Report`}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              4-Phase Research & Milestone Delivery Roadmap
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                { phase: 'Stage 1', title: 'Architecture & Simulation', dur: 'Days 1-30', deliverable: 'Schematics & BOM Approval' },
                { phase: 'Stage 2', title: 'Lab Build & Integration', dur: 'Days 31-75', deliverable: 'Hardware Prototype & Firmware' },
                { phase: 'Stage 3', title: 'District Field Trial', dur: 'Days 76-135', deliverable: 'Live Telemetry & Field Testing' },
                { phase: 'Stage 4', title: 'NABL & State Rollout', dur: 'Days 136-180', deliverable: 'Final DPR & Commercial Scale' }
              ].map((stg, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{stg.phase}</span>
                    <span className="text-[10px] font-bold font-mono text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">{stg.dur}</span>
                  </div>
                  <span className="font-bold text-slate-900 text-xs block">{stg.title}</span>
                  <p className="text-[11px] text-slate-500 font-medium leading-snug">{stg.deliverable}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DETAILED DPR BUDGET TABLE */}
      {activeTab === 'budget' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Itemized Project Budget Breakdown (DPR)
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Full expense itemization for requested grant</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Requested</span>
              <span className="text-base font-black text-slate-900 font-mono">
                {formatRupeesINR(rawBudgetNum)}
              </span>
            </div>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Line Item Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Cost (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {((proposal.budgetBreakdown && proposal.budgetBreakdown.length > 0)
                ? proposal.budgetBreakdown
                : [
                    { item: 'Core Hardware Prototype Fabrication', cost: '₹ 25,000', category: 'Hardware' },
                    { item: 'IoT Sensors & LoRa Relay Mast', cost: '₹ 20,000', category: 'Sensors' },
                    { item: 'Research Fellow Stipend & Field Testing', cost: '₹ 18,000', category: 'Human Resource' },
                    { item: 'Lab Calibration & Compliance Testing', cost: '₹ 10,000', category: 'Compliance' }
                  ]
              ).map((b, i) => {
                const desc = b.title || b.item || b.description || b.name || `Budget Line Item ${i + 1}`;
                const cat = b.category || b.type || 'Consumables';
                const costVal = b.cost || b.amount || (b.costNum ? formatRupeesINR(b.costNum) : '₹ 15,000');

                return (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-slate-400 font-bold">{i + 1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{desc}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {cat}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{costVal}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50/80 border-t-2 border-slate-200 text-xs font-bold">
                <td colSpan={3} className="py-3 px-4 text-slate-900 text-right uppercase tracking-wider">
                  Total DPR Allocation:
                </td>
                <td className="py-3 px-4 text-right font-mono font-black text-slate-900 text-sm">
                  {formatRupeesINR(rawBudgetNum)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* TAB 4: EVALUATION SCORE & REMARKS */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          {/* Scorecards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-5 rounded-xl border border-slate-200 text-center text-xs shadow-2xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Feasibility</span>
              <span className="text-base font-black text-slate-900 mt-1 block">95 / 100</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Impact</span>
              <span className="text-base font-black text-slate-900 mt-1 block">96 / 100</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Budget Score</span>
              <span className="text-base font-black text-slate-900 mt-1 block">91 / 100</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Composite Score</span>
              <span className="text-base font-black text-emerald-700 mt-1 block">{proposal.evaluationScore || 94} / 100</span>
            </div>
          </div>

          {/* Committee Remarks Input */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-2 text-xs">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Official Review Remarks / Directives:
            </label>
            <textarea
              rows={4}
              value={reviewerRemarks}
              onChange={(e) => setReviewerRemarks(e.target.value)}
              placeholder="Enter official evaluation notes, justification or clarification requirements..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          {/* Low Budget Warning Banner */}
          <LowFundAlertBanner
            availableAmount={treasury.availableStateFund}
            requiredAmount={rawBudgetNum}
            onOpenAddFund={() => setIsAddStateGrantOpen(true)}
          />

          {/* Action Trigger Box */}
          <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Review & Pipeline Routing Decision
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {isAlreadyInCsr
                  ? `Proposal is active in CSR Grants. Financial disbursal is managed in the CSR & State Grants panel.`
                  : `Approving this proposal will forward it to CSR & State Grants with ${formatRupeesINR(rawBudgetNum)} allocated.`}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {isAlreadyInCsr ? (
                <a
                  href="?tab=csr"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                >
                  <span>Open in CSR Grants Panel ➔</span>
                </a>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Request Revision / Reject
                  </button>
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve & Forward to CSR Grants</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isAddStateGrantOpen && (
        <AddStateGrantModal
          isOpen={isAddStateGrantOpen}
          onClose={() => {
            setIsAddStateGrantOpen(false);
            treasury.refreshTreasury();
          }}
          onFundCreated={() => {
            setIsAddStateGrantOpen(false);
            treasury.refreshTreasury();
          }}
        />
      )}
    </div>
  );
};

export default ProposalDetailView;
