import React, { useState } from 'react';
import {
  X,
  FileText,
  Layers,
  IndianRupee,
  DollarSign,
  ShieldCheck,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ProposalOverviewTab } from './dossier/ProposalOverviewTab.jsx';
import { ProposalTechnicalTab } from './dossier/ProposalTechnicalTab.jsx';
import { ProposalBudgetTab } from './dossier/ProposalBudgetTab.jsx';
import { ProposalPaymentsTab } from './dossier/ProposalPaymentsTab.jsx';
import { ProposalDueDiligenceTab } from './dossier/ProposalDueDiligenceTab.jsx';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';
import apiClient from '../../../../infrastructure/api/client.js';

export const ProposalDetailModal = ({
  isOpen,
  onClose,
  proposal,
  onUpdateProposal,
  onInitiateDisbursal
}) => {
  if (!isOpen || !proposal) return null;

  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [localDueDiligence, setLocalDueDiligence] = useState(proposal.dueDiligence || 'Passed (Technical Review)');
  const [localBoardApproval, setLocalBoardApproval] = useState(proposal.boardApproval || 'Approved (A-Grade)');
  const [localMouExecution, setLocalMouExecution] = useState(proposal.mouExecution || 'Signed & Active');
  const [adminNote, setAdminNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeProjects = projectCsrSyncService.getActiveProjects();
  const linkedProject = activeProjects.find(
    (p) => p.id === proposal.id || p.id === proposal.id?.replace('PROP-', '') || p.id === proposal.projectId || p.title === proposal.projectTitle
  );

  const paymentLedger = projectCsrSyncService.getCsrLedger();
  const linkedPayments = paymentLedger.filter(
    (p) => p.projectRef === proposal.id || p.projectRef === proposal.projectId || p.projectRef === proposal.id?.replace('PROP-', '') || (proposal.institutionName && p.payee?.toLowerCase().includes(proposal.institutionName.toLowerCase()))
  );

  const handleSaveStatus = async () => {
    const isFailed =
      localDueDiligence.includes('Failed') ||
      localDueDiligence.includes('Rejected') ||
      localBoardApproval.includes('Rejected');

    const updated = {
      ...proposal,
      dueDiligence: localDueDiligence,
      dueDiligenceStatus: isFailed ? 'failed' : localDueDiligence.includes('Passed') ? 'passed' : 'review',
      boardApproval: localBoardApproval,
      boardApprovalStatus: isFailed ? 'rejected' : localBoardApproval.includes('Approved') ? 'approved' : 'pending',
      mouExecution: localMouExecution,
      remarks: adminNote ? `${proposal.remarks || ''} | Note: ${adminNote}` : proposal.remarks
    };

    onUpdateProposal(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleRequestRevision = async () => {
    setIsProcessing(true);
    const noteText = adminNote || 'Government Authority requested revision in budget line items and methodology.';
    const updated = {
      ...proposal,
      dueDiligence: 'Needs Clarification / Revision',
      dueDiligenceStatus: 'review',
      boardApproval: 'Revision Requested by Government',
      boardApprovalStatus: 'pending',
      budgetStatus: 'Changes Required by Government',
      governmentRemarks: noteText,
      remarks: `${proposal.remarks || ''} | Revision Requested: ${noteText}`
    };

    try {
      const projId = proposal.projectId || proposal.id?.replace('PROP-', '');
      if (projId) {
        await apiClient.put(`university/projects/${projId}`, {
          budgetStatus: 'Changes Required by Government',
          adminRemarks: noteText,
          governmentRemarks: noteText
        });
      }
    } catch (e) {
      console.warn('Sync revision to university project:', e);
    }

    onUpdateProposal(updated);
    setIsProcessing(false);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const handleApproveAndSanction = async () => {
    setIsProcessing(true);
    const sanctionOrderNo = `JH-GOV-RD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const sanctionedAmount = proposal.fundingRequested || proposal.allocatedAmount || '₹ 75,000';

    const updated = {
      ...proposal,
      dueDiligence: 'Passed (All Checks)',
      dueDiligenceStatus: 'passed',
      boardApproval: 'Approved (A-Grade)',
      boardApprovalStatus: 'approved',
      mouExecution: 'Signed & Active',
      budgetStatus: 'Grant Sanctioned by Government',
      sanctionOrderNo,
      sanctionedAmount,
      remarks: `Grant sanctioned by Government under Order ${sanctionOrderNo}`
    };

    try {
      const projId = proposal.projectId || proposal.id?.replace('PROP-', '');
      if (projId) {
        await apiClient.put(`university/projects/${projId}`, {
          budgetStatus: 'Grant Sanctioned by Government',
          sanctionOrderNo,
          sanctionedBudget: sanctionedAmount,
          adminRemarks: `Grant Sanctioned under Order ${sanctionOrderNo}`,
          progressPercentage: 57,
          milestonesCompleted: 4
        });
      }
    } catch (e) {
      console.warn('Sync grant sanction to university project:', e);
    }

    onUpdateProposal(updated);
    setIsProcessing(false);
    onClose();
    if (onInitiateDisbursal) {
      onInitiateDisbursal(updated);
    }
  };

  const handlePrintSanctionOrder = () => {
    const printWin = window.open('', '_blank', 'width=850,height=750');
    if (!printWin) {
      alert('Please allow popups to print sanction order');
      return;
    }

    const orderNo = proposal.sanctionOrderNo || `JH-GOV-RD-${new Date().getFullYear()}-8842`;
    const docHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Government of Jharkhand - Sanction Order ${orderNo}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; }
            .header { text-align: center; border-bottom: 2px solid #007A61; padding-bottom: 15px; margin-bottom: 25px; }
            .title { font-size: 18px; font-weight: 800; text-transform: uppercase; color: #007A61; }
            .sub { font-size: 12px; color: #475569; margin-top: 4px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; font-size: 12px; }
            .badge { background: #ecfdf5; color: #065f46; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 11px; display: inline-block; }
            .amount-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 8px; font-size: 18px; font-weight: 800; margin: 20px 0; text-align: center; color: #007A61; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Government of Jharkhand</div>
            <div class="sub">Department of Higher & Technical Education • State Innovation Council</div>
            <div style="margin-top: 8px; font-weight: 700; font-size: 13px;">OFFICIAL GRANT SANCTION ORDER</div>
          </div>
          <div class="grid">
            <div><strong>Sanction Order No:</strong> ${orderNo}</div>
            <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</div>
            <div><strong>Proposal ID:</strong> ${proposal.id}</div>
            <div><strong>Beneficiary University:</strong> ${proposal.institutionName}</div>
            <div><strong>Lead Investigator:</strong> ${proposal.leadMentor || proposal.teamLead || 'Faculty Lead'}</div>
            <div><strong>Scheme / Category:</strong> ${proposal.sourceScheme}</div>
          </div>
          <div><strong>Project Title:</strong> ${proposal.projectTitle || proposal.title}</div>
          <div class="amount-box">
            Sanctioned Grant Allocation: ${proposal.fundingRequested || proposal.allocatedAmount || '₹ 75,000'}
          </div>
          <div style="font-size: 12px; line-height: 1.6; color: #334155;">
            The Competent Authority is pleased to convey administrative sanction and fund commitment for the implementation of the above research prototype. Payment tranches shall be released directly to the dedicated University Escrow Account against verified milestone deliverables.
          </div>
          <div class="footer">
            <div>Generated by JoharSetu Governance Engine</div>
            <div>Authorized Signatory: Principal Secretary, Govt of Jharkhand</div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWin.document.write(docHtml);
    printWin.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex-1 pr-4 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono font-black text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
                {proposal.id}
              </span>
              <span className="font-bold text-xs text-slate-200">{proposal.institutionName}</span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-300">{proposal.sourceScheme}</span>
            </div>
            <p className="text-xs text-slate-300 font-medium line-clamp-1">
              {proposal.projectTitle || proposal.title || 'Societal Problem Resolution Project'}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={handlePrintSanctionOrder}
              className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 text-white flex items-center space-x-1.5 text-xs font-bold cursor-pointer transition-all shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">Sanction Order</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 5 Tab Navigation */}
        <div className="flex items-center justify-between px-6 border-b border-slate-200 bg-white text-xs font-semibold overflow-x-auto">
          {[
            { id: 'overview', label: '1. Executive Abstract', icon: FileText },
            { id: 'methodology', label: '2. Technical Architecture', icon: Layers },
            { id: 'budget', label: '3. DPR Budget Table', icon: IndianRupee },
            { id: 'payments', label: '4. Tranches & Payments', icon: DollarSign },
            { id: 'statutory', label: '5. Due Diligence & MoU', icon: ShieldCheck }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`py-3 px-2.5 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  isActive
                    ? 'border-[#007A61] text-[#007A61] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-[#007A61]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1 bg-[#fafafa]">
          {activeSubTab === 'overview' && (
            <ProposalOverviewTab proposal={proposal} linkedProject={linkedProject} />
          )}

          {activeSubTab === 'methodology' && (
            <ProposalTechnicalTab proposal={proposal} linkedProject={linkedProject} />
          )}

          {activeSubTab === 'budget' && (
            <ProposalBudgetTab proposal={proposal} linkedProject={linkedProject} />
          )}

          {activeSubTab === 'payments' && (
            <ProposalPaymentsTab
              proposal={proposal}
              linkedPayments={linkedPayments}
              onInitiateDisbursal={onInitiateDisbursal}
            />
          )}

          {activeSubTab === 'statutory' && (
            <ProposalDueDiligenceTab
              localBoardApproval={localBoardApproval}
              setLocalBoardApproval={setLocalBoardApproval}
              localDueDiligence={localDueDiligence}
              setLocalDueDiligence={setLocalDueDiligence}
              localMouExecution={localMouExecution}
              setLocalMouExecution={setLocalMouExecution}
              adminNote={adminNote}
              setAdminNote={setAdminNote}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] font-bold text-slate-700">
            {isSaved && '✓ Proposal status updated and synchronized with University!'}
          </div>

          <div className="flex flex-wrap items-center space-x-2 justify-end w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all shadow-2xs"
            >
              Close Dossier
            </button>

            <button
              type="button"
              onClick={handleSaveStatus}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-2xs transition-all"
            >
              Save Notes
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleRequestRevision}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-2xs flex items-center space-x-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Request Revision</span>
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleApproveAndSanction}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#007A61] hover:bg-[#006650] text-white cursor-pointer shadow-2xs flex items-center space-x-1.5 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Approve & Sanction Grant</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailModal;
