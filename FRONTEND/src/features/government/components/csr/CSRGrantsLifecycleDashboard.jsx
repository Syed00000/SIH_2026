import React, { useState, useEffect } from 'react';
import { CSRPhaseTabs } from './CSRPhaseTabs.jsx';
import { CSRFundingSources } from './CSRFundingSources.jsx';
import { CSRStatutoryParameters } from './CSRStatutoryParameters.jsx';
import { CSRProposalPipelineTable } from './CSRProposalPipelineTable.jsx';
import { CSREscrowMatrix } from './CSREscrowMatrix.jsx';
import { CSRPaymentLedgerTable } from './CSRPaymentLedgerTable.jsx';
import { CSRFundUtilization } from './CSRFundUtilization.jsx';
import { CSRComplianceChecklist } from './CSRComplianceChecklist.jsx';
import { CSRLifecycleHeader } from './CSRLifecycleHeader.jsx';
import { InitiateDisbursalModal } from './InitiateDisbursalModal.jsx';
import { ProposalDetailModal } from './ProposalDetailModal.jsx';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';
import { exportCsrLifecycleReportPdf } from '../../services/exportPdfService.js';

export const CSRGrantsLifecycleDashboard = () => {
  // Navigation: 4 Modular Phases
  const [activePhase, setActivePhase] = useState('phase_1_2');
  const [selectedProposal, setSelectedProposal] = useState(null);

  // Live Local State synced with service
  const [proposals, setProposals] = useState(() => projectCsrSyncService.getCsrProposals());
  const [ledger, setLedger] = useState(() => projectCsrSyncService.getCsrLedger());

  // Global Disbursal Action Modal
  const [isDisbursalModalOpen, setIsDisbursalModalOpen] = useState(false);
  const [disbursalTargetProposal, setDisbursalTargetProposal] = useState(null);

  // Subscribe to bidirectional sync events from Projects & Solutions
  useEffect(() => {
    projectCsrSyncService.initializeFromBackend().then(() => {
      setProposals(projectCsrSyncService.getCsrProposals());
      setLedger(projectCsrSyncService.getCsrLedger());
    });
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

  const handleUpdateProposal = (p) => {
    const res = projectCsrSyncService.addOrUpdateCsrProposal(p);
    setProposals(res?.updatedCsrProposals || projectCsrSyncService.getCsrProposals() || []);
  };

  const handleDeleteProposal = (id) => {
    const res = projectCsrSyncService.deleteCsrProposal(id);
    setProposals(res?.updatedCsrProposals || projectCsrSyncService.getCsrProposals() || []);
  };

  const handleAddNewDisbursal = (entry) => {
    const res = projectCsrSyncService.addCsrPayment(entry);
    setLedger(res?.updatedLedger || res?.updatedCsrLedger || projectCsrSyncService.getCsrLedger() || []);
  };

  const handleAuthorizePayment = (id) => {
    try {
      const u = projectCsrSyncService.authorizePayment(id);
      setLedger(Array.isArray(u) ? u : projectCsrSyncService.getCsrLedger() || []);
    } catch {}
  };

  const handleInitiateDisbursalForProposal = (p) => {
    setDisbursalTargetProposal(p);
    setIsDisbursalModalOpen(true);
  };

  const handleExportAudit = () => {
    exportCsrLifecycleReportPdf({ proposals: proposals || [], ledger: ledger || [], filterSource: sourceFilter });
  };

  const filteredProposals = (proposals || []).filter((p) => {
    if (sourceFilter === 'All Sources') return true;
    if (sourceFilter === 'Corporate CSR' && p.sourceScheme?.includes('Corporate')) return true;
    if (sourceFilter === 'Govt Grants' && p.sourceScheme?.includes('Govt')) return true;
    if (sourceFilter === 'Joint Co-Funding' && p.sourceScheme?.includes('Joint')) return true;
    return false;
  });

  if (selectedProposal) {
    return (
      <div className="w-full pb-10 max-w-[1600px] mx-auto px-4 min-w-0 max-w-full overflow-hidden animate-in fade-in duration-200">
        <ProposalDetailModal
          isOpen={true}
          onClose={() => setSelectedProposal(null)}
          proposal={selectedProposal}
          onUpdateProposal={(u) => {
            handleUpdateProposal(u);
            setSelectedProposal(u);
          }}
          onInitiateDisbursal={handleInitiateDisbursalForProposal}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10 max-w-[1600px] w-full mx-auto px-4 min-w-0 max-w-full overflow-hidden animate-in fade-in duration-200">
      <CSRLifecycleHeader sourceFilter={sourceFilter} setSourceFilter={setSourceFilter} onExportAudit={handleExportAudit} />
      <CSRPhaseTabs activePhase={activePhase} onSelectPhase={(p) => setActivePhase(p)} />

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
            onSelectProposal={(p) => setSelectedProposal(p)}
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
