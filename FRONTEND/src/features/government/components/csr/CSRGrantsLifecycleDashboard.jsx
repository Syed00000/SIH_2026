import React, { useState, useEffect } from 'react';
import {
  Building2,
  FileDown,
  Activity,
  CheckCircle
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
import { InitiateDisbursalModal } from './InitiateDisbursalModal.jsx';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';
import { exportCsrLifecycleReportPdf } from '../../services/exportPdfService.js';

export const CSRGrantsLifecycleDashboard = () => {
  // Navigation: 4 Modular Phases
  const [activePhase, setActivePhase] = useState('phase_1_2'); // 'phase_1_2' | 'phase_3_4' | 'phase_5_6' | 'phase_7_8'

  // Live Local State synced with service
  const [proposals, setProposals] = useState(() => projectCsrSyncService.getCsrProposals());
  const [ledger, setLedger] = useState(() => projectCsrSyncService.getCsrLedger());

  // Global Disbursal Action Modal
  const [isDisbursalModalOpen, setIsDisbursalModalOpen] = useState(false);
  const [disbursalTargetProposal, setDisbursalTargetProposal] = useState(null);

  // Subscribe to bidirectional sync events from Projects & Solutions
  useEffect(() => {
    const unsubscribe = projectCsrSyncService.subscribe((eventType, data) => {
      if (data?.updatedLedger) {
        setLedger(data.updatedLedger);
      } else if (data?.updatedCsrLedger) {
        setLedger(data.updatedCsrLedger);
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

  const handleUpdateProposal = (updatedProposal) => {
    const res = projectCsrSyncService.addOrUpdateCsrProposal(updatedProposal);
    setProposals(res.updatedCsrProposals);
  };

  const handleDeleteProposal = (proposalId) => {
    const res = projectCsrSyncService.deleteCsrProposal(proposalId);
    setProposals(res.updatedCsrProposals);
  };

  const handleAddNewDisbursal = (newEntry) => {
    const res = projectCsrSyncService.addCsrPayment(newEntry);
    setLedger(res.updatedLedger);
  };

  const handleAuthorizePayment = (ledgerId) => {
    try {
      const updated = projectCsrSyncService.authorizePayment(ledgerId);
      setLedger(updated);
      localStorage.setItem('joharsetu_csr_ledger', JSON.stringify(updated));
    } catch {}
  };

  // Trigger Tranche Disbursal from a proposal
  const handleInitiateDisbursalForProposal = (proposal) => {
    setDisbursalTargetProposal(proposal);
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
    if (sourceFilter === 'Corporate CSR' && p.sourceScheme?.includes('Corporate')) return true;
    if (sourceFilter === 'Govt Grants' && p.sourceScheme?.includes('Govt')) return true;
    if (sourceFilter === 'Joint Co-Funding' && p.sourceScheme?.includes('Joint')) return true;
    return false;
  });

  return (
    <div className="space-y-4 pb-10 max-w-[1600px] w-full mx-auto px-4 min-w-0 max-w-full overflow-hidden animate-in fade-in duration-200">
      {/* 1. Header Banner Card */}
      <div className="bg-white rounded-md p-5 sm:p-6 border border-slate-200 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            End-to-End Fund Flow & Payment Process Lifecycle
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1 leading-relaxed">
            Master ledger tracking across Schedule VII compliance, multi-tier vetting, and automated disbursement gateways.
          </p>
        </div>

        {/* Right Header Controls: Source Selector + Export + Badge */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Source Dropdown Filter */}
          <div className="flex items-center space-x-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-md text-xs shadow-xs">
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
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-xs font-bold text-slate-700 shadow-xs cursor-pointer transition-colors"
            title="Download Comprehensive Statutory Audit PDF"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-600" />
            <span>Export Audit Log</span>
          </button>

          {/* Audit Active Pill Badge */}
          <div className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-900 shadow-xs whitespace-nowrap">
            Audit Active: 2026-27
          </div>
        </div>
      </div>

      {/* 2. Four Phase Tabs */}
      <CSRPhaseTabs
        activePhase={activePhase}
        onSelectPhase={(phase) => setActivePhase(phase)}
      />

      {/* 3. Phase-Specific Tabbed Views */}
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
