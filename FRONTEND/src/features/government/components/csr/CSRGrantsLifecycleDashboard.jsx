import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle, Activity, FileDown } from 'lucide-react';
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
import { InitiateDisbursalModal } from './InitiateDisbursalModal.jsx';
import { exportCsrLifecycleReportPdf } from '../../services/exportPdfService.js';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

export const CSRGrantsLifecycleDashboard = () => {
  const [activePhase, setActivePhase] = useState('phase_1_2');
  const [proposals, setProposals] = useState(() => projectCsrSyncService.getCsrProposals() || []);
  const [ledger, setLedger] = useState(() => projectCsrSyncService.getCsrLedger() || []);
  const [isDisbursalModalOpen, setIsDisbursalModalOpen] = useState(false);
  const [disbursalTargetProposal, setDisbursalTargetProposal] = useState(null);
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [statutoryFilter, setStatutoryFilter] = useState(null);
  const [ledgerStatusFilter, setLedgerStatusFilter] = useState(null);

  useEffect(() => {
    return projectCsrSyncService.subscribe((eventType, data) => {
      if (data?.updatedCsrLedger) setLedger(Array.isArray(data.updatedCsrLedger) ? data.updatedCsrLedger : []);
      if (data?.updatedCsrProposals) setProposals(Array.isArray(data.updatedCsrProposals) ? data.updatedCsrProposals : []);
    });
  }, []);

  const handleUpdateProposal = (updatedProposal) => {
    const res = projectCsrSyncService.addOrUpdateCsrProposal(updatedProposal);
    setProposals(Array.isArray(res) ? res : projectCsrSyncService.getCsrProposals() || []);
  };

  const handleDeleteProposal = (id) => {
    const updated = projectCsrSyncService.deleteCsrProposal(id);
    setProposals(Array.isArray(updated) ? updated : projectCsrSyncService.getCsrProposals() || []);
  };

  const handleAddNewDisbursal = (newPayment) => {
    const updated = projectCsrSyncService.recordDisbursal(newPayment);
    setLedger(Array.isArray(updated) ? updated : projectCsrSyncService.getCsrLedger() || []);
  };

  const handleAuthorizePayment = (paymentId) => {
    const updated = (ledger || []).map((item) =>
      item.id === paymentId ? { ...item, makerCheckerStatus: 'approved', bankStatus: 'ack' } : item
    );
    setLedger(updated);
  };

  const handleInitiateDisbursalForProposal = (proposal) => {
    setDisbursalTargetProposal(proposal);
    setActivePhase('phase_3_4');
    setIsDisbursalModalOpen(true);
  };

  const safeProposals = Array.isArray(proposals) ? proposals : [];

  const filteredProposals = safeProposals.filter((p) => {
    if (!p) return false;
    if (sourceFilter === 'All Sources') return true;
    const scheme = p.sourceScheme || '';
    if (sourceFilter === 'Corporate CSR' && scheme.includes('Corporate')) return true;
    if (sourceFilter === 'Govt Grants' && scheme.includes('Govt')) return true;
    if (sourceFilter === 'Joint Co-Funding' && scheme.includes('Joint')) return true;
    return false;
  });

  return (
    <div className="space-y-4 pb-8 max-w-[1600px] mx-auto animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
            JoharSetu State R&D & CSR Grants Master Treasury (Corpus: ₹ 15.00 Lakhs)
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Multi-source funding lifecycle: Government State Grants (₹5L) + Corporate CSR Sec 135 (₹10L) with statutory PFMS/RTGS audit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 font-bold text-[11px]">Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
            >
              <option value="All Sources">All Sources (₹ 15.00 L Pool)</option>
              <option value="Corporate CSR">Corporate CSR (₹ 10.00 L)</option>
              <option value="Govt Grants">Govt State Grants (₹ 5.00 L)</option>
              <option value="Joint Co-Funding">Joint Co-Funding</option>
            </select>
          </div>

          <button
            onClick={() => exportCsrLifecycleReportPdf({ proposals, ledger, filterSource: sourceFilter })}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-600" />
            <span>Export Audit Log</span>
          </button>
        </div>
      </div>

      <CSRPhaseTabs activePhase={activePhase} onSelectPhase={(phase) => setActivePhase(phase)} />

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
          <CSRStatutoryParameters activeFilter={statutoryFilter} onSelectFilter={(f) => setStatutoryFilter(f)} proposals={filteredProposals} />
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
          <CSREscrowMatrix onFilterLedgerByStatus={(status) => setLedgerStatusFilter(status)} />
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
          <div className="lg:col-span-8"><CSRFundUtilization /></div>
          <div className="lg:col-span-4"><CSRComplianceChecklist /></div>
        </div>
      )}

      {activePhase === 'phase_7_8' && (
        <div className="space-y-4">
          <CSRClosureReporting />
          <CSRDisbursalModesTable />
        </div>
      )}

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
