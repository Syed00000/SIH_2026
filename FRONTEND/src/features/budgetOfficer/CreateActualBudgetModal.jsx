import React, { useState } from 'react';
import { X, Calculator, IndianRupee, FileText, Upload, Save } from 'lucide-react';
import { getPreliminaryBudget, formatIndianCurrency } from './budgetUtils.js';

export const CreateActualBudgetModal = ({ isOpen, onClose, task, onSubmit }) => {
  const [actualAmount, setActualAmount] = useState('');
  const [details, setDetails] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !task) return null;

  const oldBudget = getPreliminaryBudget(task);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!actualAmount) return;
    
    setIsSubmitting(true);
    
    // Simulate delay
    await new Promise(res => setTimeout(res, 800));
    
    onSubmit({
      amount: Number(actualAmount),
      details,
      pdfUrl: fileUrl,
      submittedAt: new Date().toISOString()
    });
    
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-slideUp">
        
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Calculator className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Prepare Actual Budget</h2>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{task.challengeId || 'Task'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200 flex flex-col space-y-1">
            <span className="text-xs font-bold text-amber-700 uppercase">Preliminary Estimate Provided by Dept</span>
            <span className="text-2xl font-black text-amber-900 flex items-center">
              <IndianRupee className="w-5 h-5 mr-1" />
              {formatIndianCurrency(oldBudget)}
            </span>
            <span className="text-xs text-amber-800 font-medium pt-1">
              Please review this figure and prepare the final required amount based on actual material and labor cost calculations.
            </span>
          </div>

          <form id="budgetForm" onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                Actual Budget Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  required
                  min="0"
                  value={actualAmount}
                  onChange={(e) => setActualAmount(e.target.value)}
                  placeholder="e.g. 275000"
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Financial Breakdown / Justification</label>
              <textarea
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Detail the materials, labor cost, transportation, and other overheads..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all resize-none custom-scrollbar"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Detailed Quotation / Report (PDF) - Optional</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="https://link-to-report.pdf"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="relative overflow-hidden">
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFileUrl(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    title="Upload PDF"
                  />
                  <button type="button" className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-700 transition flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {fileUrl && fileUrl.startsWith('blob:') && (
                <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ PDF Attached Successfully</p>
              )}
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
            form="budgetForm"
            disabled={isSubmitting || !actualAmount}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Submit to Department</span>
          </button>
        </div>

      </div>
    </div>
  );
};
