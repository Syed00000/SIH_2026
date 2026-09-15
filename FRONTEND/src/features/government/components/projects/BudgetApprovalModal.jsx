import React, { useState } from 'react';
import { X, FileCheck, IndianRupee, FileText, CheckCircle2 } from 'lucide-react';
import { openPdf } from '../../../../shared/utils/openPdf.js';

export const BudgetApprovalModal = ({ isOpen, onClose, project, onApprove }) => {
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !project) return null;

  const actualAmount = project.actualBudget?.amount || 0;
  const officerName = project.assignedBudgetOfficer?.name || 'Officer';

  const handleApprove = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate delay
    await new Promise(res => setTimeout(res, 800));
    onApprove(remarks);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-slideUp">
        
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#007A61]"></div>
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-[#007A61]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Approve Department Budget</h2>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{project.challengeId || 'PRJ'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors relative z-10">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-white">
          <div className="mb-6 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">{project.title}</h3>
              <p className="text-xs text-slate-500">{project.description || project.problemStatement}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Requested Amount</span>
                <span className="text-2xl font-black text-[#007A61] flex items-center">
                  <IndianRupee className="w-5 h-5 mr-0.5" />
                  {actualAmount.toLocaleString('en-IN')}
                </span>
              </div>
              
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Prepared By</span>
                  <span className="text-sm font-semibold text-slate-800">{officerName}</span>
                </div>
                
                {project.actualBudget?.details && (
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Justification</span>
                    <p className="text-xs text-slate-700 bg-white p-2 rounded border border-slate-100 mt-1 whitespace-pre-wrap max-h-24 overflow-y-auto custom-scrollbar">
                      {project.actualBudget.details}
                    </p>
                  </div>
                )}
                
                {project.actualBudget?.pdfUrl && (
                  <button 
                    onClick={() => openPdf(project.actualBudget.pdfUrl)}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors w-fit mt-2"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Quotation PDF
                  </button>
                )}
              </div>
            </div>
          </div>

          <form id="approveForm" onSubmit={handleApprove} className="space-y-4">
            <div className="bg-[#007A61]/5 border border-[#007A61]/20 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#007A61] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-900">Fund Disbursement</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Approving this budget will sanction ₹{actualAmount.toLocaleString('en-IN')} and dispatch a notification to the department to commence work.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Approval Remarks / Notes (Optional)</label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="E.g., Approved from State Reserve Fund. Keep receipts..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-[#007A61] transition-all resize-none custom-scrollbar"
              />
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="approveForm"
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#007A61] hover:bg-[#00604c] text-white text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FileCheck className="w-4 h-4" />
            )}
            <span>Sanction & Approve Budget</span>
          </button>
        </div>

      </div>
    </div>
  );
};
