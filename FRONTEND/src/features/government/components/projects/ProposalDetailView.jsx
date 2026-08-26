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
  Clock
} from 'lucide-react';

export const ProposalDetailView = ({
  proposal,
  onBack,
  onApproveGrant,
  onRejectProposal
}) => {
  const [activeTab, setActiveTab] = useState('dpr'); // 'dpr' | 'methodology' | 'budget' | 'review'
  const [reviewerRemarks, setReviewerRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!proposal) return null;

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onApproveGrant(proposal, reviewerRemarks);
      setIsSubmitting(false);
      onBack();
    }, 400);
  };

  const handleReject = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onRejectProposal(proposal, reviewerRemarks);
      setIsSubmitting(false);
      onBack();
    }, 400);
  };

  const isApproved = proposal.status === 'Approved';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {/* Top Back Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Proposals List</span>
        </button>

        <div className="flex items-center space-x-2">
          {!isApproved ? (
            <>
              <button
                type="button"
                onClick={handleReject}
                disabled={isSubmitting}
                className="px-4 py-2 bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                Reject Proposal
              </button>

              <button
                type="button"
                onClick={handleApprove}
                disabled={isSubmitting}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs disabled:opacity-50"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Approve Grant & Sanction Project</span>
              </button>
            </>
          ) : (
            <span className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Grant Sanctioned & Approved</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Title & Status Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black bg-slate-900 text-white">
            {proposal.id}
          </span>
          <span className="text-slate-500">{proposal.sector}</span>
          <span>•</span>
          <span className="text-slate-700">{proposal.district} District</span>
          <span>•</span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Score: {proposal.evaluationScore || 92} / 100
          </span>
        </div>

        <h1 className="text-lg sm:text-xl font-bold text-slate-900">{proposal.title}</h1>
        <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">{proposal.abstract}</p>

        {/* Institution Info Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Submitting HEI</span>
            <span className="font-bold text-slate-900 block mt-0.5">{proposal.hei}</span>
            <span className="text-[11px] text-slate-500">{proposal.heiType}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Team Lead & PI</span>
            <span className="font-bold text-slate-900 block mt-0.5">{proposal.teamLead}</span>
            <span className="text-[11px] text-slate-500">{proposal.leadEmail}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Requested Funding</span>
            <span className="font-bold text-slate-900 text-sm block mt-0.5">{proposal.requestedGrant}</span>
            <span className="text-[11px] text-slate-500">Timeline: {proposal.estimatedMonths || 6} Months</span>
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
            <p className="text-xs text-slate-700 leading-relaxed">
              {proposal.problemStatement}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Attached Project Dossiers & Lab Verification Certificates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-slate-700" />
                  <div>
                    <span className="font-bold text-slate-900 block">{proposal.dossierFile || 'DPR_Technical_Dossier.pdf'}</span>
                    <span className="text-[10px] text-slate-500">Official Project Proposal & Specifications</span>
                  </div>
                </div>
                <button type="button" className="text-slate-700 hover:text-black p-1.5 rounded-lg border border-slate-200 bg-white">
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">{proposal.nablCertificate || 'NABL_Calibration_Report.pdf'}</span>
                    <span className="text-[10px] text-slate-500">Laboratory Accuracy Benchmark Proof</span>
                  </div>
                </div>
                <button type="button" className="text-slate-700 hover:text-black p-1.5 rounded-lg border border-slate-200 bg-white">
                  <Download className="w-4 h-4" />
                </button>
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
              Technical Implementation Steps
            </h3>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-800 font-mono whitespace-pre-line leading-relaxed">
              {proposal.methodology}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Project Delivery Schedule (4 Phases)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Phase 1</span>
                <span className="font-bold text-slate-900 mt-1 block">Architecture & Design</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Phase 2</span>
                <span className="font-bold text-slate-900 mt-1 block">Lab Build & NABL</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Phase 3</span>
                <span className="font-bold text-slate-900 mt-1 block">District Field Trial</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Phase 4</span>
                <span className="font-bold text-slate-900 mt-1 block">State Scaling</span>
              </div>
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
            <span className="text-sm font-black text-slate-900 font-mono">
              Total: {proposal.requestedGrant}
            </span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                <th className="py-3 px-4">Line Item Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(proposal.budgetBreakdown || [
                { item: 'Core Hardware Prototype Fabrication', cost: '₹ 8.50 Lakhs', category: 'Hardware' },
                { item: 'IoT Sensors & LoRa Relay Mast', cost: '₹ 4.00 Lakhs', category: 'Sensors' },
                { item: 'Junior Research Fellow Stipends (6 Mo)', cost: '₹ 3.60 Lakhs', category: 'Human Resource' },
                { item: 'NABL Lab Testing Certification', cost: '₹ 2.40 Lakhs', category: 'Compliance' }
              ]).map((b, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900">{b.item}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {b.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{b.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: EVALUATION & SANCTION DECISION */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          {/* Scorecards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-5 rounded-xl border border-slate-200 text-center text-xs">
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
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Composite</span>
              <span className="text-base font-black text-emerald-700 mt-1 block">{proposal.evaluationScore || 94} / 100</span>
            </div>
          </div>

          {/* Committee Remarks Input */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-2 text-xs">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Official Evaluation Remarks / Approval Order:
            </label>
            <textarea
              rows={4}
              value={reviewerRemarks}
              onChange={(e) => setReviewerRemarks(e.target.value)}
              placeholder="Enter official committee notes or approval remarks..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          {/* Action Trigger Box */}
          <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Final Grant Sanction Order
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Approving this proposal will sanction {proposal.requestedGrant} and create an active project.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleReject}
                disabled={isSubmitting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Reject Proposal
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={isSubmitting}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Approve Grant</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalDetailView;
