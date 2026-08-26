import React, { useState } from 'react';
import {
  X,
  FileText,
  Building2,
  Calendar,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  ShieldCheck,
  Check,
  Eye,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';

export const ProposalReviewModal = ({
  proposal,
  isOpen,
  onClose,
  onApproveGrant,
  onRejectProposal
}) => {
  const [activeTab, setActiveTab] = useState('dpr'); // 'dpr' | 'methodology' | 'budget' | 'review'
  const [reviewerRemarks, setReviewerRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !proposal) return null;

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onApproveGrant(proposal, reviewerRemarks);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const handleReject = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onRejectProposal(proposal, reviewerRemarks);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const isApproved = proposal.status === 'Approved';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Top Header Bar */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/80">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black bg-slate-900 text-white">
                {proposal.id}
              </span>
              <span className="text-xs font-bold text-slate-500">{proposal.sector}</span>
              <span>•</span>
              <span className="font-semibold text-xs text-slate-700">{proposal.district} District</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                Score: {proposal.evaluationScore || 92} / 100
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">{proposal.title}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 flex items-center space-x-6 bg-white overflow-x-auto">
          {[
            { id: 'dpr', label: '1. Executive Abstract & Problem', icon: FileText },
            { id: 'methodology', label: '2. Technical Architecture', icon: Layers },
            { id: 'budget', label: '3. Detailed DPR Budget Table', icon: IndianRupee },
            { id: 'review', label: '4. Evaluation & Sanction Decision', icon: ShieldCheck }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 border-b-2 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <TabIcon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body Canvas */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs bg-slate-50/40">
          {/* TAB 1: EXECUTIVE ABSTRACT & PROBLEM */}
          {activeTab === 'dpr' && (
            <div className="space-y-5">
              {/* Institution and Team Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Submitting HEI</span>
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span>{proposal.hei}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{proposal.heiType}</span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Principal Investigator</span>
                  <div className="font-bold text-slate-900">{proposal.teamLead}</div>
                  <span className="text-[11px] text-slate-500">{proposal.leadEmail} • {proposal.leadMobile}</span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Grant & Timeline</span>
                  <div className="font-mono font-black text-sm text-slate-900">{proposal.requestedGrant}</div>
                  <span className="text-[11px] text-slate-500">Duration: {proposal.estimatedMonths || 6} Months</span>
                </div>
              </div>

              {/* Technical Abstract */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Technical Abstract & Societal Value Proposition
                </h3>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {proposal.abstract}
                </p>
              </div>

              {/* State Problem Statement */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-rose-700">
                  Jharkhand Ground Problem & Vulnerability Context
                </h3>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {proposal.problemStatement}
                </p>
              </div>

              {/* Attached Dossiers */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Attached Technical Dossiers & Lab Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-slate-600" />
                      <span className="font-mono text-xs font-bold text-slate-800">{proposal.dossierFile || 'DPR_Technical_Dossier_2026.pdf'}</span>
                    </div>
                    <button type="button" className="text-slate-700 hover:text-black p-1">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-mono text-xs font-bold text-slate-800">{proposal.nablCertificate || 'NABL_Calibration_Report.pdf'}</span>
                    </div>
                    <button type="button" className="text-slate-700 hover:text-black p-1">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECHNICAL ARCHITECTURE & METHODOLOGY */}
          {activeTab === 'methodology' && (
            <div className="space-y-5">
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Engineering Methodology & Implementation Pipeline
                </h3>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 font-mono text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                  {proposal.methodology}
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Deployment Roadmap & Stage-Gate Milestones
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Stage 1 (Month 1-2)</span>
                    <span className="font-bold text-slate-900 text-xs mt-1 block">Architecture & Simulation</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Stage 2 (Month 3-4)</span>
                    <span className="font-bold text-slate-900 text-xs mt-1 block">Lab Prototyping & NABL</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Stage 3 (Month 5-6)</span>
                    <span className="font-bold text-slate-900 text-xs mt-1 block">District Field Pilot</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Stage 4 (Scaling)</span>
                    <span className="font-bold text-slate-900 text-xs mt-1 block">State Scaling & Validation</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DETAILED DPR BUDGET TABLE */}
          {activeTab === 'budget' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Requested Grant</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">{proposal.requestedGrant}</div>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                  Itemized DPR Breakdown
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
                    {(proposal.budgetBreakdown || [
                      { item: 'Core Prototype Hardware Fabrication', cost: '₹ 8.50 Lakhs', category: 'Hardware CapEx' },
                      { item: 'Field Sensors & LoRaWAN Relays', cost: '₹ 4.00 Lakhs', category: 'Sensors' },
                      { item: 'Junior Research Fellow Stipends (6 Mo)', cost: '₹ 3.60 Lakhs', category: 'Human Resource' },
                      { item: 'NABL Laboratory Benchmark Fees', cost: '₹ 2.40 Lakhs', category: 'Testing' }
                    ]).map((b, idx) => (
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

          {/* TAB 4: EVALUATION & SANCTION DECISION */}
          {activeTab === 'review' && (
            <div className="space-y-5">
              {/* Scorecard Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-5 rounded-xl border border-slate-200 text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Technical Feasibility</span>
                  <span className="text-base font-black text-slate-900 mt-1 block">95 / 100</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Jharkhand Impact</span>
                  <span className="text-base font-black text-slate-900 mt-1 block">96 / 100</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Budget Justification</span>
                  <span className="text-base font-black text-slate-900 mt-1 block">91 / 100</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Composite Score</span>
                  <span className="text-base font-black text-emerald-700 mt-1 block">{proposal.evaluationScore || 94} / 100</span>
                </div>
              </div>

              {/* Reviewer Remarks Input */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  State Technical Steering Committee Remarks & Sanction Order:
                </label>
                <textarea
                  rows={4}
                  value={reviewerRemarks}
                  onChange={(e) => setReviewerRemarks(e.target.value)}
                  placeholder="Enter official committee approval notes, tranche schedule recommendations, or rejection grounds..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
                />
              </div>

              {/* Sanction Decision Buttons */}
              <div className="p-5 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Official Grant Sanction Action
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Sanctioning will release Tranche 1 (₹{(parseFloat(proposal.requestedGrant?.replace(/[^0-9.]/g, '') || 15) * 0.4).toFixed(2)} Lakhs) and spawn an active project.
                  </p>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Reject Proposal
                  </button>

                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isApproved ? 'Update Sanction' : 'Approve & Sanction Grant'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Close */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-end bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalReviewModal;
