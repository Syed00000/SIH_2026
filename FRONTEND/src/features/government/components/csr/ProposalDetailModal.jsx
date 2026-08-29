import React, { useState } from 'react';
import {
  X,
  FileCheck2,
  Building2,
  Landmark,
  ShieldCheck,
  Calendar,
  Layers,
  FileText,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Printer,
  DollarSign,
  IndianRupee,
  MapPin,
  Cpu,
  User,
  ArrowRight,
  Receipt,
  Check
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

  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'methodology' | 'budget' | 'payments' | 'statutory'
  const [localDueDiligence, setLocalDueDiligence] = useState(proposal.dueDiligence || 'Passed (All Checks)');
  const [localBoardApproval, setLocalBoardApproval] = useState(proposal.boardApproval || 'Approved (A-Grade)');
  const [localMouExecution, setLocalMouExecution] = useState(proposal.mouExecution || 'Signed & Active');
  const [adminNote, setAdminNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Fetch live payment history for this proposal if linked with projects
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn select-none">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
              {proposal.id}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">{proposal.institutionName}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {proposal.district || 'Jharkhand'} District
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {proposal.sourceScheme}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold line-clamp-1 mt-0.5">
                {proposal.projectTitle || proposal.title || 'Societal Innovation Project'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrintSanctionOrder}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center space-x-1 text-xs font-semibold cursor-pointer shadow-2xs"
              title="Print Sanction Order"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Sanction Order</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Nav Tabs */}
        <div className="flex items-center space-x-1 px-6 border-b border-slate-200 bg-white text-xs font-bold overflow-x-auto">
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
                className={`py-3 px-3.5 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  isActive
                    ? 'border-slate-900 text-slate-900 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1 bg-slate-50/40">
          {/* TAB 1: EXECUTIVE ABSTRACT */}
          {activeSubTab === 'overview' && (
            <div className="space-y-4">
              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Approved DPR Budget</span>
                  <span className="text-base font-black text-slate-900 block mt-0.5">{proposal.allocatedAmount || proposal.requestedGrant}</span>
                  <span className="text-[10.5px] text-slate-500 font-medium">Via {proposal.donor || proposal.sourceScheme}</span>
                </div>
                <div className="bg-white border border-emerald-200 rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider">Disbursed to Escrow</span>
                  <span className="text-base font-black text-emerald-900 block mt-0.5">
                    {proposal.disbursedToDate || (linkedProject?.disbursedAmount || '₹ 5.00 Lakhs')}
                  </span>
                  <span className="text-[10.5px] text-emerald-700 font-medium">Tranche 1 Disbursed</span>
                </div>
                <div className="bg-white border border-blue-200 rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-blue-700 block tracking-wider">Feasibility Score</span>
                  <span className="text-base font-black text-blue-950 block mt-0.5">{proposal.feasibilityScore || '94/100'}</span>
                  <span className="text-[10.5px] text-blue-700 font-medium">Apex Technical Clearance</span>
                </div>
              </div>

              {/* Problem Statement & Societal Value */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Project Abstract & Societal Value Proposition
                </h4>
                <p className="text-slate-700 leading-relaxed font-medium text-xs">
                  {proposal.projectTitle
                    ? `${proposal.projectTitle}. Deployed in ${proposal.district || 'Jharkhand'} district under State Higher & Technical Education innovation facilitation.`
                    : 'Societal innovation and technology transfer initiative addressing ground community challenges in Jharkhand state.'}
                </p>
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-medium">
                  <span><strong>Lead SPOC / PI:</strong> {proposal.leadSpoc || proposal.teamLead || 'Dr. Amitabh Verma'}</span>
                  <span><strong>Corporate Donor:</strong> {proposal.donor || 'Tata Steel CSR / State Pool'}</span>
                  <span><strong>District Ground Origin:</strong> {proposal.district || 'Ranchi'}</span>
                </div>
              </div>

              {/* Statutory Dossier Credentials */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Statutory Governance Registrations</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">MCA CSR-1 No.</span>
                    <span className="font-mono font-bold text-slate-800 text-[11px]">{proposal.csr1Number || 'CSR00018921'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">80G / 12A Status</span>
                    <span className="font-mono font-bold text-emerald-700 text-[11px]">{proposal.pan80G || '80G-VALIDATED'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Board Approval</span>
                    <span className="font-bold text-slate-800 text-[11px]">{proposal.boardApproval}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">MoU Execution</span>
                    <span className="font-bold text-slate-800 text-[11px]">{proposal.mouExecution}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECHNICAL ARCHITECTURE & METHODOLOGY */}
          {activeSubTab === 'methodology' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Hardware Specifications & Field Stack
                </h4>
                <p className="text-slate-800 leading-relaxed font-medium text-xs">
                  {proposal.hardwareSpecs || (linkedProject?.hardwareSpecs || 'Integrated embedded microcontroller with LoRaWAN wireless telemetry, solar harvesting, and cloud synchronization to JoharSetu state portal.')}
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2.5 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  4-Stage Milestone Roadmap
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-blue-50/60 border border-blue-200 rounded-lg">
                    <span className="text-[10px] font-bold text-blue-700 uppercase block">Stage 1</span>
                    <span className="font-bold text-blue-950 text-[11px] mt-0.5 block">Lab CAD & Circuit Rig</span>
                  </div>
                  <div className="p-2.5 bg-purple-50/60 border border-purple-200 rounded-lg">
                    <span className="text-[10px] font-bold text-purple-700 uppercase block">Stage 2</span>
                    <span className="font-bold text-purple-950 text-[11px] mt-0.5 block">Field Ground Testing</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-lg">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block">Stage 3</span>
                    <span className="font-bold text-emerald-950 text-[11px] mt-0.5 block">NABL Lab Certification</span>
                  </div>
                  <div className="p-2.5 bg-slate-100 border border-slate-300 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-700 uppercase block">Stage 4</span>
                    <span className="font-bold text-slate-900 text-[11px] mt-0.5 block">District Rollout & Scale</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DPR BUDGET TABLE */}
          {activeSubTab === 'budget' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Approved Grant Budget</span>
                  <div className="text-base font-black text-slate-900 mt-0.5">{proposal.budgetSanctioned || proposal.allocatedAmount || proposal.requestedGrant || proposal.budgetRequested || '₹ 0'}</div>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                  Itemized DPR Allocation
                </span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
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
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                            {b.category}
                          </span>
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
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Tranche Disbursal History & UTR Ledger</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Direct Escrow bank disbursements for {proposal.institutionName}</p>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onInitiateDisbursal?.(proposal);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center space-x-1.5"
                  >
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Initiate Tranche Disbursal</span>
                  </button>
                </div>

                {linkedPayments.length > 0 ? (
                  <div className="space-y-2">
                    {linkedPayments.map((pay) => (
                      <div key={pay.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-black text-slate-900">{pay.id}</span>
                            <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              UTR: {pay.utrNumber}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {pay.mode}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 font-medium">
                            Disbursed: <strong>{pay.disbursedAmount}</strong> · Payer: {pay.payer} · TDS: {pay.tdsAmount || 'Sec 194C @ 2%'}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-900">
                          {pay.makerCheckerSign || 'Verified'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">Tranche 1: Equipment & Advance Rig Setup</span>
                      <span className="text-[11px] text-slate-500">Transferred via RTGS from State Bank of India Escrow Vault</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
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
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-2xs">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wide block">
                    Board Approval Committee Decision
                  </label>
                  <select
                    value={localBoardApproval}
                    onChange={(e) => setLocalBoardApproval(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus:bg-white focus:border-slate-800 focus:outline-hidden"
                  >
                    <option value="Approved (A-Grade)">Approved (A-Grade)</option>
                    <option value="Sanctioned Board">Sanctioned Board</option>
                    <option value="Under Technical Review">Under Technical Review</option>
                    <option value="Pending Meeting">Pending Meeting</option>
                    <option value="Rejected (Technical Review Failed)">Rejected (Technical Review Failed)</option>
                  </select>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-2xs">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wide block">
                    Statutory Due Diligence Status
                  </label>
                  <select
                    value={localDueDiligence}
                    onChange={(e) => setLocalDueDiligence(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus:bg-white focus:border-slate-800 focus:outline-hidden"
                  >
                    <option value="Passed (All Checks)">Passed (All Checks)</option>
                    <option value="Under Technical Review">Under Technical Review</option>
                    <option value="Needs Clarification / Revision">Needs Clarification / Revision</option>
                    <option value="Failed / Disqualified">Failed / Disqualified</option>
                  </select>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-2xs">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wide block">
                  MoU Legal Execution Stage
                </label>
                <select
                  value={localMouExecution}
                  onChange={(e) => setLocalMouExecution(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus:bg-white focus:border-slate-800 focus:outline-hidden"
                >
                  <option value="Signed & Active">Signed & Active</option>
                  <option value="Executed">Executed</option>
                  <option value="Drafting Stage">Drafting Stage</option>
                  <option value="Sent to University Registrar">Sent to University Registrar</option>
                  <option value="Terminated / Not Executed">Terminated / Not Executed</option>
                </select>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-2xs">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wide block">
                  Official Audit Remarks & Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cleared by State Technical Steering Committee"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="text-[11px] font-bold text-emerald-700">
            {isSaved && '✓ Status updated & synchronized across all dashboards!'}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              Close Dossier
            </button>
            <button
              onClick={handleSaveStatus}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-xs"
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
