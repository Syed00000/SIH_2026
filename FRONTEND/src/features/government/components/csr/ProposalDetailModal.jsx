import React, { useState } from 'react';
import {
  X,
  FileText,
  Layers,
  IndianRupee,
  DollarSign,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

export const ProposalDetailModal = ({
  isOpen,
  onClose,
  proposal,
  onUpdateProposal,
  onInitiateDisbursal
}) => {
  if (!isOpen || !proposal) return null;

  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [localDueDiligence, setLocalDueDiligence] = useState(proposal.dueDiligence || 'Passed (All Checks)');
  const [localBoardApproval, setLocalBoardApproval] = useState(proposal.boardApproval || 'Approved (A-Grade)');
  const [localMouExecution, setLocalMouExecution] = useState(proposal.mouExecution || 'Signed & Active');
  const [adminNote, setAdminNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Fetch live payment history for this proposal
  const activeProjects = projectCsrSyncService.getActiveProjects();
  const linkedProject = activeProjects.find((p) => p.id === proposal.id || p.id === proposal.id.replace('PROP-', 'PRJ-') || p.title === proposal.projectTitle);

  const paymentLedger = projectCsrSyncService.getCsrLedger();
  const linkedPayments = paymentLedger.filter((p) => p.projectRef === proposal.id || p.payee?.toLowerCase().includes(proposal.institutionName?.toLowerCase()));

  const handleSaveStatus = () => {
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
      remarks: adminNote ? `${proposal.remarks || ''} | Update: ${adminNote}` : proposal.remarks
    };
    onUpdateProposal(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handlePrintSanctionOrder = () => {
    const printWin = window.open('', '_blank', 'width=850,height=750');
    if (!printWin) {
      alert('Please allow popups to print sanction order');
      return;
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Sanction Order - ${proposal.id}</title>
  <style>
    body { font-family: 'Times New Roman', serif; padding: 40px; color: #111; line-height: 1.5; font-size: 13px; }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 24px; }
    .header h2 { margin: 0; font-size: 16px; text-transform: uppercase; }
    .header h3 { margin: 4px 0 0 0; font-size: 13px; font-weight: normal; }
    .meta-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .meta-table td { padding: 6px 10px; border: 1px solid #999; }
    .meta-table td.label { font-weight: bold; background: #f4f4f4; width: 30%; }
    .seal { margin-top: 50px; display: flex; justify-content: space-between; }
    .seal div { text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h2>Government of Jharkhand</h2>
    <h3>Department of Higher & Technical Education · JoharSetu Innovation Hub</h3>
    <p style="margin: 4px 0 0; font-size: 11px; font-weight: bold;">STATUTORY CSR / GRANT SANCTION ORDER</p>
  </div>

  <p><strong>Sanction Order Reference:</strong> DHTE/CSR-JH/${new Date().getFullYear()}/${proposal.id}</p>
  <p><strong>Date of Sanction:</strong> ${new Date().toLocaleDateString('en-IN')}</p>

  <p>In exercise of powers conferred under the State Innovation & CSR Facilitation Policy, administrative sanction is hereby accorded for the release and implementation of the project described below:</p>

  <table class="meta-table">
    <tr><td class="label">Proposal Code</td><td>${proposal.id}</td></tr>
    <tr><td class="label">Beneficiary Institution</td><td>${proposal.institutionName} (${proposal.district} District)</td></tr>
    <tr><td class="label">Project Title</td><td>${proposal.projectTitle || 'Societal Innovation & Research Initiative'}</td></tr>
    <tr><td class="label">Funding Source & Scheme</td><td>${proposal.sourceScheme} (${proposal.donor || 'State & Corporate Pool'})</td></tr>
    <tr><td class="label">Total Approved Grant</td><td>${proposal.allocatedAmount}</td></tr>
    <tr><td class="label">Disbursed to Date</td><td>${proposal.disbursedToDate || (linkedProject?.disbursedAmount || '₹ 0.00 Lakhs')}</td></tr>
    <tr><td class="label">MCA CSR-1 Registration</td><td>${proposal.csr1Number || 'CSR00018921'}</td></tr>
    <tr><td class="label">Income Tax 80G / 12A Ref</td><td>${proposal.pan80G || '80G-VALIDATED'}</td></tr>
    <tr><td class="label">MoU Legal Status</td><td>${localMouExecution}</td></tr>
    <tr><td class="label">Apex Committee Sanction</td><td>${localBoardApproval}</td></tr>
  </table>

  <p><strong>Special Terms & Escrow Lock-in:</strong></p>
  <ol>
    <li>Funds shall be credited strictly to the designated Zero-Balance Escrow Vault.</li>
    <li>GFR 12-A Utilization Certificate must be submitted within 90 days of tranche consumption.</li>
    <li>All expenditures are subject to independent CA Audit under Schedule VII norms.</li>
  </ol>

  <div class="seal">
    <div>
      <br/><br/>
      __________________________<br/>
      <strong>State Financial Advisor</strong><br/>
      Govt of Jharkhand
    </div>
    <div>
      <br/><br/>
      __________________________<br/>
      <strong>Principal Secretary</strong><br/>
      Dept of Higher & Tech Education
    </div>
  </div>
</body>
</html>
    `;

    printWin.document.write(html);
    printWin.document.close();
    setTimeout(() => {
      printWin.print();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn select-none">
      <div className="bg-white rounded-lg max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header - Pure Text, No Gray Background Box */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-sm text-slate-900">{proposal.id}</span>
              <span className="text-slate-400">•</span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">{proposal.institutionName}</h3>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-600 font-medium">{proposal.district || 'Jharkhand'}</span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-600 font-medium">{proposal.sourceScheme}</span>
            </div>
            <p className="text-xs text-slate-600 font-normal line-clamp-1">
              {proposal.projectTitle || proposal.title || 'Societal Innovation Project'}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handlePrintSanctionOrder}
              className="px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-900 flex items-center space-x-1.5 text-xs font-semibold cursor-pointer shadow-xs"
              title="Print Official Sanction Order"
            >
              <Printer className="w-3.5 h-3.5 text-slate-900" />
              <span className="hidden sm:inline">Sanction Order</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-900 cursor-pointer"
            >
              <X className="w-4 h-4 text-slate-900" />
            </button>
          </div>
        </div>

        {/* 5 Tabs - Perfectly fitting in 1 line with NO horizontal scrollbar */}
        <div className="flex items-center justify-between px-5 border-b border-slate-200 bg-white text-xs font-semibold">
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
                className={`py-3 px-2 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  isActive
                    ? 'border-slate-900 text-slate-900 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5 text-slate-900" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body - Fixed 460px Height so tabs never jump */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs h-[460px] max-h-[460px] bg-white">
          {/* TAB 1: EXECUTIVE ABSTRACT */}
          {activeSubTab === 'overview' && (
            <div className="space-y-4">
              {/* 3 Metric Cards - Pure Monochrome Black & White */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
                  <span className="text-[10.5px] uppercase font-bold text-slate-500 block tracking-wider">
                    Approved DPR Budget
                  </span>
                  <span className="text-base font-bold text-slate-900 block mt-1">
                    {proposal.allocatedAmount || proposal.requestedGrant}
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal mt-0.5 block">
                    Source: {proposal.donor || proposal.sourceScheme}
                  </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
                  <span className="text-[10.5px] uppercase font-bold text-slate-500 block tracking-wider">
                    Disbursed to Escrow
                  </span>
                  <span className="text-base font-bold text-slate-900 block mt-1">
                    {proposal.disbursedToDate || (linkedProject?.disbursedAmount || '₹ 5.00 Lakhs')}
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal mt-0.5 block">
                    Initial Tranche Released
                  </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
                  <span className="text-[10.5px] uppercase font-bold text-slate-500 block tracking-wider">
                    Feasibility Score
                  </span>
                  <span className="text-base font-bold text-slate-900 block mt-1">
                    {proposal.feasibilityScore || '94/100'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal mt-0.5 block">
                    Technical Committee Rating
                  </span>
                </div>
              </div>

              {/* Problem Statement & Summary */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2 shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Project Abstract
                </h4>
                <p className="text-slate-700 leading-relaxed font-normal text-xs">
                  {proposal.projectTitle
                    ? `${proposal.projectTitle}. Project implementation in ${proposal.district || 'Jharkhand'} district under State Higher & Technical Education innovation facilitation.`
                    : 'Societal innovation initiative addressing ground community challenges in Jharkhand state.'}
                </p>
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-4 text-[11px] text-slate-600 font-normal">
                  <span><strong>Lead PI:</strong> {proposal.leadSpoc || proposal.teamLead || 'Dr. Amitabh Verma'}</span>
                  <span><strong>Funding Donor:</strong> {proposal.donor || 'Tata Steel CSR / State Pool'}</span>
                  <span><strong>District:</strong> {proposal.district || 'Ranchi'}</span>
                </div>
              </div>

              {/* Statutory Registrations */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3 shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Statutory Registrations
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-semibold uppercase">MCA CSR-1 No.</span>
                    <span className="font-mono font-bold text-slate-900 text-[11.5px]">{proposal.csr1Number || 'CSR00018921'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-semibold uppercase">80G / 12A Status</span>
                    <span className="font-mono font-bold text-slate-900 text-[11.5px]">{proposal.pan80G || '80G-VALIDATED'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-semibold uppercase">Board Approval</span>
                    <span className="font-bold text-slate-900 text-[11.5px]">{proposal.boardApproval}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-semibold uppercase">MoU Status</span>
                    <span className="font-bold text-slate-900 text-[11.5px]">{proposal.mouExecution}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECHNICAL ARCHITECTURE */}
          {activeSubTab === 'methodology' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-2 shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Technical Specifications
                </h4>
                <p className="text-slate-700 leading-relaxed font-normal text-xs">
                  {proposal.hardwareSpecs || (linkedProject?.hardwareSpecs || 'Integrated embedded microcontroller with LoRaWAN wireless telemetry, solar harvesting, and cloud synchronization to JoharSetu state portal.')}
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-2.5 shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Milestone Roadmap
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-3 bg-white border border-slate-200 rounded-md">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Stage 1</span>
                    <span className="font-bold text-slate-900 text-[11px] mt-0.5 block">Lab CAD & Circuit Rig</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-md">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Stage 2</span>
                    <span className="font-bold text-slate-900 text-[11px] mt-0.5 block">Field Ground Testing</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-md">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Stage 3</span>
                    <span className="font-bold text-slate-900 text-[11px] mt-0.5 block">NABL Lab Certification</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-md">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Stage 4</span>
                    <span className="font-bold text-slate-900 text-[11px] mt-0.5 block">Public Rollout & Scale</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DPR BUDGET TABLE */}
          {activeSubTab === 'budget' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                <div>
                  <span className="text-[10.5px] font-bold text-slate-500 uppercase block">Approved Grant Budget</span>
                  <div className="text-base font-black text-slate-900 mt-0.5">{proposal.budgetSanctioned || proposal.allocatedAmount || proposal.requestedGrant || proposal.budgetRequested || '₹ 0'}</div>
                </div>
                <span className="text-xs font-medium text-slate-600">
                  Itemized DPR Allocation
                </span>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Line Item Description</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4 text-right">Estimated Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {((proposal.dprBudgetItems && proposal.dprBudgetItems.length > 0)
                      ? proposal.dprBudgetItems
                      : (proposal.budgetBreakdown && proposal.budgetBreakdown.length > 0)
                      ? proposal.budgetBreakdown.map((b) => ({
                          item: b.item || b.description || b.category,
                          category: b.category || 'General',
                          cost: b.cost || b.amount || '—'
                        }))
                      : [
                          { item: 'Core Prototype Hardware Fabrication & Embedded Sensors', cost: '₹ 8.50 Lakhs', category: 'Hardware CapEx' },
                          { item: 'Wireless LoRaWAN Nodes & Field Telemetry Rig', cost: '₹ 4.00 Lakhs', category: 'Sensors' },
                          { item: 'Research Scholars / JRF Field Testing Stipends', cost: '₹ 3.60 Lakhs', category: 'Human Resource' },
                          { item: 'NABL Certified Laboratory Benchmark Fees', cost: '₹ 2.40 Lakhs', category: 'Testing & Quality' }
                        ]
                    ).map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-semibold text-slate-900">{b.item}</td>
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {b.category}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{b.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: TRANCHES & PAYMENTS */}
          {activeSubTab === 'payments' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Payment History & UTR Ledger</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Direct Escrow bank disbursements for {proposal.institutionName}</p>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onInitiateDisbursal?.(proposal);
                    }}
                    className="px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>Initiate Tranche Disbursal</span>
                  </button>
                </div>

                {linkedPayments.length > 0 ? (
                  <div className="space-y-2">
                    {linkedPayments.map((pay) => (
                      <div key={pay.id} className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-slate-900">{pay.id}</span>
                            <span className="font-mono text-[11px] text-slate-700">
                              UTR: {pay.utrNumber}
                            </span>
                            <span className="text-[11px] text-slate-700 font-medium">
                              • {pay.mode}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 font-normal">
                            Disbursed: <strong>{pay.disbursedAmount}</strong> · Payer: {pay.payer} · TDS: {pay.tdsAmount || 'Sec 194C @ 2%'}
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-900">
                          {pay.makerCheckerSign || 'Verified'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">Tranche 1: Advance Rig Setup</span>
                      <span className="text-[11px] text-slate-500">Transferred via RTGS from State Bank of India Escrow Vault</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-900">
                      Disbursed & Active
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: STATUTORY DUE DILIGENCE & MOU */}
          {activeSubTab === 'statutory' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2 shadow-xs">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Board Approval Committee Decision
                  </label>
                  <select
                    value={localBoardApproval}
                    onChange={(e) => setLocalBoardApproval(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md font-semibold text-slate-900 text-xs focus:border-slate-900 focus:outline-hidden"
                  >
                    <option value="Approved (A-Grade)">Approved (A-Grade)</option>
                    <option value="Sanctioned Board">Sanctioned Board</option>
                    <option value="Under Technical Review">Under Technical Review</option>
                    <option value="Pending Meeting">Pending Meeting</option>
                    <option value="Rejected (Technical Review Failed)">Rejected (Technical Review Failed)</option>
                  </select>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2 shadow-xs">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Statutory Due Diligence Status
                  </label>
                  <select
                    value={localDueDiligence}
                    onChange={(e) => setLocalDueDiligence(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md font-semibold text-slate-900 text-xs focus:border-slate-900 focus:outline-hidden"
                  >
                    <option value="Passed (All Checks)">Passed (All Checks)</option>
                    <option value="Under Technical Review">Under Technical Review</option>
                    <option value="Needs Clarification / Revision">Needs Clarification / Revision</option>
                    <option value="Failed / Disqualified">Failed / Disqualified</option>
                  </select>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2 shadow-xs">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  MoU Legal Execution Stage
                </label>
                <select
                  value={localMouExecution}
                  onChange={(e) => setLocalMouExecution(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md font-semibold text-slate-900 text-xs focus:border-slate-900 focus:outline-hidden"
                >
                  <option value="Signed & Active">Signed & Active</option>
                  <option value="Executed">Executed</option>
                  <option value="Drafting Stage">Drafting Stage</option>
                  <option value="Sent to University Registrar">Sent to University Registrar</option>
                  <option value="Terminated / Not Executed">Terminated / Not Executed</option>
                </select>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2 shadow-xs">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Official Audit Remarks & Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cleared by State Technical Steering Committee"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-900 focus:border-slate-900 focus:outline-hidden"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between">
          <div className="text-[11px] font-bold text-slate-900">
            {isSaved && '✓ Status updated & synchronized successfully!'}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              Close Dossier
            </button>
            <button
              onClick={handleSaveStatus}
              className="px-5 py-2 rounded-md text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-xs"
            >
              Save & Synchronize Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailModal;
