import React, { useState } from 'react';
import { ShieldCheck, CheckCircle } from 'lucide-react';
import { CSRPhaseTabs } from './CSRPhaseTabs.jsx';
import { CSRFundingSources } from './CSRFundingSources.jsx';
import { CSRStatutoryParameters } from './CSRStatutoryParameters.jsx';
import { CSRProposalPipelineTable } from './CSRProposalPipelineTable.jsx';
import { CSREscrowMatrix } from './CSREscrowMatrix.jsx';
import { CSRPaymentLedgerTable } from './CSRPaymentLedgerTable.jsx';
import { CSRFundUtilization } from './CSRFundUtilization.jsx';
import { CSRComplianceChecklist } from './CSRComplianceChecklist.jsx';
import { AddProposalModal } from './AddProposalModal.jsx';
import { MOCK_PROPOSAL_PIPELINE } from '../../data/mockCsrLifecycleData.js';

export const CSRGrantsLifecycleDashboard = () => {
  const [activePhase, setActivePhase] = useState('phase_5_6');
  const [proposals, setProposals] = useState(MOCK_PROPOSAL_PIPELINE);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddProposal = (newEntry) => {
    setProposals([newEntry, ...proposals]);
  };

  return (
    <div className="space-y-4 pb-8 max-w-[1600px] mx-auto animate-in fade-in duration-200">
      {/* 1. Header Banner Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
            End-to-End Fund Flow & Payment Process Lifecycle
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {activePhase === 'phase_5_6'
              ? 'From Fund Sources & Approval flow to Bank Transfers, Milestone Utilization, and CA Audit Closure.'
              : 'Master ledger tracking across Schedule VII compliance, multi-tier vetting, and automated disbursement gateways.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50/80 border border-blue-200/80 shadow-2xs">
            {activePhase === 'phase_5_6' ? (
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
        <>
          <CSRFundingSources />
          <CSRStatutoryParameters />
          <CSRProposalPipelineTable
            proposals={proposals}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        </>
      )}

      {activePhase === 'phase_3_4' && (
        <>
          <CSREscrowMatrix />
          <CSRPaymentLedgerTable />
        </>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-8">
            <CSRFundUtilization />
          </div>
          <div className="lg:col-span-4">
            <CSRComplianceChecklist />
          </div>
        </div>
      )}

      {/* 4. Add Proposal Modal */}
      <AddProposalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProposal={handleAddProposal}
      />
    </div>
  );
};

export default CSRGrantsLifecycleDashboard;
