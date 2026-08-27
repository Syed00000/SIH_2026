import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  Activity,
  FileDown,
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';
import { CSRPhaseTabs } from './CSRPhaseTabs.jsx';
import { CSRFundingSources } from './CSRFundingSources.jsx';
import { CSRStatutoryParameters } from './CSRStatutoryParameters.jsx';
import { CSRProposalPipelineTable } from './CSRProposalPipelineTable.jsx';
import { CSREscrowMatrix } from './CSREscrowMatrix.jsx';
import { CSRPaymentLedgerTable } from './CSRPaymentLedgerTable.jsx';
import { CSRFundUtilization } from './CSRFundUtilization.jsx';
import { CSRComplianceChecklist } from './CSRComplianceChecklist.jsx';
import { CSRClosureReporting } from './CSRClosureReporting.jsx';
import { CSRDisbursalModesTable } from './CSRDisbursalModesTable.jsx';
import { AddProposalModal } from './AddProposalModal.jsx';
import { InitiateDisbursalModal } from './InitiateDisbursalModal.jsx';
import {
  MOCK_PROPOSAL_PIPELINE,
  MOCK_PAYMENT_LEDGER
} from '../../data/mockCsrLifecycleData.js';
import { exportCsrLifecycleReportPdf } from '../../services/exportPdfService.js';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

export const CSRGrantsLifecycleDashboard = () => {
  const [activePhase, setActivePhase] = useState('phase_1_2');
  const [proposals, setProposals] = useState(() => projectCsrSyncService.getCsrProposals());
  const [ledger, setLedger] = useState(() => projectCsrSyncService.getCsrLedger());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDisbursalModalOpen, setIsDisbursalModalOpen] = useState(false);
  const [disbursalTargetProposal, setDisbursalTargetProposal] = useState(null);

  // Subscribe to bidirectional sync events from Projects & Solutions
  useEffect(() => {
    const unsubscribe = projectCsrSyncService.subscribe((eventType, data) => {
      if (data?.updatedLedger) {
        setLedger(data.updatedLedger);
      }
      if (data?.updatedCsrProposals) {
        setProposals(data.updatedCsrProposals);
      }
    });
    return unsubscribe;
  }, []);

  // Global Dashboard Filters
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [statutoryFilter, setStatutoryFilter] = useState(null);
  const [ledgerStatusFilter, setLedgerStatusFilter] = useState(null);

  // Add new proposal
  const handleAddProposal = (newEntry) => {
    const res = projectCsrSyncService.addOrUpdateCsrProposal(newEntry);
    setProposals(res.updatedCsrProposals);
  };

  // Update existing proposal
  const handleUpdateProposal = (updatedProposal) => {
    const res = projectCsrSyncService.addOrUpdateCsrProposal(updatedProposal);
    setProposals(res.updatedCsrProposals);
  };

  // Delete proposal
  const handleDeleteProposal = (id) => {
    const updated = projectCsrSyncService.deleteCsrProposal(id);
    setProposals(updated);
  };

  // Add new payment disbursal
  const handleAddNewDisbursal = (newPayment) => {
    const updated = [newPayment, ...ledger];
    setLedger(updated);
    try {
      localStorage.setItem('joharsetu_csr_ledger', JSON.stringify(updated));
      projectCsrSyncService.syncDisbursalFromCsr(newPayment);
    } catch {}
  };

  // Authorize payment (Maker-Checker Dual Key)
  const handleAuthorizePayment = (paymentId) => {
    const updated = ledger.map((item) =>
      item.id === paymentId
        ? {
            ...item,
            makerCheckerSign: 'Verified & Approved',
            makerCheckerStatus: 'approved',
            bankAckStatus: 'Acknowledged',
            bankStatus: 'ack'
          }
        : item
    );
    setLedger(updated);
    try {
      localStorage.setItem('joharsetu_csr_ledger', JSON.stringify(updated));
    } catch {}
  };

  // Trigger Tranche Disbursal from a proposal
  const handleInitiateDisbursalForProposal = (proposal) => {
    setDisbursalTargetProposal(proposal);
    setActivePhase('phase_3_4');
    setIsDisbursalModalOpen(true);
  };

  // Export Audit Report PDF
  const handleExportAudit = () => {
    exportCsrLifecycleReportPdf({
      proposals,
      ledger,
      filterSource: sourceFilter
    });
  };

  // Filter proposals by top-level source filter
  const filteredProposals = proposals.filter((p) => {
    if (sourceFilter === 'All Sources') return true;
    if (sourceFilter === 'Corporate CSR' && p.sourceScheme.includes('Corporate')) return true;
    if (sourceFilter === 'Govt Grants' && p.sourceScheme.includes('Govt')) return true;
    if (sourceFilter === 'Joint Co-Funding' && p.sourceScheme.includes('Joint')) return true;
    return false;
  });

  return (
    <div className="space-y-4 pb-8 max-w-[1600px] mx-auto animate-in fade-in duration-200">
      {/* 1. Header Banner Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
            {activePhase === 'phase_7_8'
              ? 'JoharSetu Fund Lifecycle & Transparency Matrix'
              : 'End-to-End Fund Flow & Payment Process Lifecycle'}
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {activePhase === 'phase_7_8'
              ? 'Direct phase-wise tracking fulfilling transparency, anti-leakage, and audit-readiness.'
              : activePhase === 'phase_5_6'
              ? 'From Fund Sources & Approval flow to Bank Transfers, Milestone Utilization, and CA Audit Closure.'
              : 'Master ledger tracking across Schedule VII compliance, multi-tier vetting, and automated disbursement gateways.'}
          </p>
        </div>

        {/* Right Header Controls: Source Selector + Export + Badge */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Source Dropdown Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 font-bold text-[11px]">Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
            >
              <option value="All Sources">All Sources (Corporate + Govt)</option>
              <option value="Corporate CSR">Corporate CSR Funds</option>
              <option value="Govt Grants">Government Grants</option>
              <option value="Joint Co-Funding">Joint Co-Funding</option>
            </select>
          </div>

          {/* Export Audit Log Button */}
          <button
            onClick={handleExportAudit}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs cursor-pointer transition-colors"
            title="Download Comprehensive Statutory Audit PDF"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-600" />
            <span>Export Audit Log</span>
          </button>

          {/* Status Badge */}
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50/80 border border-blue-200/80 shadow-2xs">
            {activePhase === 'phase_7_8' ? (
              <>
                <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>Active Monitoring</span>
              </>
            ) : activePhase === 'phase_5_6' ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Schedule VII Compliant</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Audit Active: 2026-27</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* 2. Four Phase Tabs */}
      <CSRPhaseTabs
        activePhase={activePhase}
        onSelectPhase={(phase) => setActivePhase(phase)}
      />

      {/* 3. Dynamic Phase Views */}
      {activePhase === 'phase_1_2' && (
        <div className="space-y-4">
          <CSRFundingSources
            selectedSourceFilter={sourceFilter}
            onFilterBySource={(sourceId) => {
              if (sourceId === 'corporate_csr') setSourceFilter('Corporate CSR');
              else if (sourceId === 'govt_grants') setSourceFilter('Govt Grants');
              else if (sourceId === 'joint_funding') setSourceFilter('Joint Co-Funding');
            }}
          />

          <CSRStatutoryParameters
            activeFilter={statutoryFilter}
            onSelectFilter={(f) => setStatutoryFilter(f)}
            proposals={filteredProposals}
          />

          <CSRProposalPipelineTable
            proposals={filteredProposals}
            activeFilter={statutoryFilter}
            onUpdateProposal={handleUpdateProposal}
            onDeleteProposal={handleDeleteProposal}
            onInitiateDisbursal={handleInitiateDisbursalForProposal}
          />
        </div>
      )}

      {activePhase === 'phase_3_4' && (
        <div className="space-y-4">
          <CSREscrowMatrix
            onFilterLedgerByStatus={(status) => setLedgerStatusFilter(status)}
          />

          <CSRPaymentLedgerTable
            ledger={ledger}
            proposals={proposals}
            statusFilter={ledgerStatusFilter}
            onClearStatusFilter={() => setLedgerStatusFilter(null)}
            onAddNewDisbursal={handleAddNewDisbursal}
            onAuthorizePayment={handleAuthorizePayment}
          />
        </div>
      )}

      {activePhase === 'phase_5_6' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-8">
            <CSRFundUtilization />
          </div>
          <div className="lg:col-span-4">
            <CSRComplianceChecklist />
          </div>
        </div>
      )}

      {activePhase === 'phase_7_8' && (
        <div className="space-y-4">
          <CSRClosureReporting />
          <CSRDisbursalModesTable />
        </div>
      )}

      {/* 4. Global Modals */}
      <InitiateDisbursalModal
        isOpen={isDisbursalModalOpen}
        onClose={() => {
          setIsDisbursalModalOpen(false);
          setDisbursalTargetProposal(null);
        }}
        proposals={proposals}
        initialProposal={disbursalTargetProposal}
        onDisbursalCreated={handleAddNewDisbursal}
      />
    </div>
  );
};

export default CSRGrantsLifecycleDashboard;
