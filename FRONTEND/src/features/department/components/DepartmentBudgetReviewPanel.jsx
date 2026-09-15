import React, { useState } from 'react';
import { IndianRupee, FileText, CheckCircle, Clock, Search, Filter, Send, AlertCircle } from 'lucide-react';
import { openPdf } from '../../../shared/utils/openPdf.js';

export const DepartmentBudgetReviewPanel = ({ problems = [], onSubmitToGovernment }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter problems that have an actual budget submitted by the officer
  const reviewableBudgets = problems.filter(p => p.assignedBudgetOfficer?.status === 'Submitted' || p.assignedBudgetOfficer?.status === 'Forwarded');

  const filteredBudgets = reviewableBudgets.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.challengeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.assignedBudgetOfficer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-[#007A61]" />
            BUDGET APPROVALS
          </h2>
          <p className="text-[13px] text-slate-500 font-medium mt-1">
            Review actual budgets prepared by officers and submit them to the Government for final sanction.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by project name or officer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#007A61] shadow-xs"
          />
        </div>
      </div>

      {filteredBudgets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Budgets Pending Review</h3>
          <p className="text-sm text-slate-500 mt-1">There are currently no actual budgets submitted by your officers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBudgets.map(task => {
            const isForwarded = task.assignedBudgetOfficer?.status === 'Forwarded';
            const oldBudget = task.estimatedCost || task.sanctionedBudget || task.budget || 250000;
            const actualBudget = task.actualBudget?.amount || 0;
            const diff = actualBudget - oldBudget;
            
            return (
              <div key={task.id || task.challengeId || task._id} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row">
                
                {/* Left side: Project Details */}
                <div className="p-5 md:w-1/2 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {task.challengeId || 'PRJ'}
                      </span>
                      {isForwarded ? (
                        <span className="text-[10px] font-bold text-[#007A61] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Sent to Govt
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Needs Review
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-slate-900 text-base leading-tight mb-2">
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium line-clamp-3">
                      {task.description || task.problemStatement}
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                    <span className="font-bold">Prepared By:</span>
                    <span className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded">{task.assignedBudgetOfficer?.name || 'Budget Officer'}</span>
                  </div>
                </div>

                {/* Right side: Financials & Actions */}
                <div className="p-5 md:w-1/2 bg-slate-50 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                        <span className="block text-[10px] font-bold text-slate-500 uppercase">Old Estimate</span>
                        <span className="block text-sm font-black text-slate-700 flex items-center">
                          <IndianRupee className="w-4 h-4 mr-0.5" />
                          {Number(oldBudget).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs ring-1 ring-[#007A61]/20">
                        <span className="block text-[10px] font-bold text-[#007A61] uppercase">Actual Budget</span>
                        <span className="block text-lg font-black text-slate-900 flex items-center">
                          <IndianRupee className="w-5 h-5 mr-0.5 text-[#007A61]" />
                          {Number(actualBudget).toLocaleString('en-IN')}
                        </span>
                        {diff > 0 ? (
                          <span className="text-[10px] font-bold text-rose-500 block mt-0.5">+₹{diff.toLocaleString('en-IN')} higher</span>
                        ) : diff < 0 ? (
                          <span className="text-[10px] font-bold text-emerald-500 block mt-0.5">-₹{Math.abs(diff).toLocaleString('en-IN')} lower</span>
                        ) : null}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Financial Justification</span>
                      <p className="text-xs text-slate-700 font-medium whitespace-pre-wrap max-h-24 overflow-y-auto custom-scrollbar">
                        {task.actualBudget?.details || 'No justification provided.'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 justify-end">
                    {task.actualBudget?.pdfUrl && (
                      <button 
                        onClick={() => openPdf(task.actualBudget.pdfUrl)}
                        className="px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center gap-1.5 transition-colors border border-indigo-200"
                      >
                        <FileText className="w-4 h-4" />
                        <span>View Quotation</span>
                      </button>
                    )}
                    
                    {!isForwarded && (
                      <button 
                        onClick={() => onSubmitToGovernment(task)}
                        className="px-4 py-2 text-xs font-bold text-white bg-[#007A61] hover:bg-[#00604c] rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Submit to Government</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DepartmentBudgetReviewPanel;
