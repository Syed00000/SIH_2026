import React, { useState } from 'react';
import { IndianRupee, FileText, CheckCircle, Clock, Search, Send, AlertCircle, Edit3, Lock } from 'lucide-react';
import { openPdf } from '../../../shared/utils/openPdf.js';
import { EditDepartmentBudgetModal } from './EditDepartmentBudgetModal.jsx';
import { projectCsrSyncService } from '../../government/services/projectCsrSyncService.js';
import apiClient from '../../../infrastructure/api/client.js';

export const DepartmentBudgetReviewPanel = ({ problems = [], onSubmitToGovernment }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  const reviewableBudgets = problems.filter(p =>
    p.assignedBudgetOfficer?.status === 'Submitted' ||
    p.assignedBudgetOfficer?.status === 'Forwarded' ||
    p.assignedBudgetOfficer?.status === 'Approved'
  );

  const filteredBudgets = reviewableBudgets.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.challengeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.assignedBudgetOfficer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveRequisition = async ({ amount, details, resubmitToGov }) => {
    if (!editingTask) return;
    const targetId = editingTask.challengeId || editingTask.id || editingTask._id;
    const cleanId = String(targetId).replace('PROP-', '');
    const updatedBudget = { ...(editingTask.actualBudget || {}), amount, details, submittedAt: new Date().toISOString() };
    const updatedOfficer = {
      ...(editingTask.assignedBudgetOfficer || {}),
      status: resubmitToGov ? 'Forwarded' : (editingTask.assignedBudgetOfficer?.status || 'Submitted'),
      forwardedAt: resubmitToGov ? new Date().toISOString() : editingTask.assignedBudgetOfficer?.forwardedAt
    };
    try {
      await apiClient.put(`university/projects/${cleanId}?universityCode=ALL`, { actualBudget: updatedBudget, assignedBudgetOfficer: updatedOfficer });
    } catch {}
    try {
      await apiClient.put(`citizen/challenges/${editingTask.challengeId || cleanId}`, { actualBudget: updatedBudget, assignedBudgetOfficer: updatedOfficer });
    } catch {}
    projectCsrSyncService.submitActualBudget(targetId, updatedBudget);
    if (resubmitToGov) projectCsrSyncService.submitBudgetToGovernment(targetId);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 select-none">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-[#007A61]" /> BUDGET APPROVALS & REQUISITIONS
          </h2>
          <p className="text-[13px] text-slate-500 font-medium mt-1">
            Review, edit budget amounts & resources, forward to Government, and track state sanctions.
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        <input
          type="text" placeholder="Search by project name or officer..."
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#007A61] shadow-xs"
        />
      </div>

      {filteredBudgets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4"><Clock className="w-8 h-8 text-slate-400" /></div>
          <h3 className="text-lg font-bold text-slate-900">No Budgets In Pipeline</h3>
          <p className="text-sm text-slate-500 mt-1">There are currently no budgets in review or pending sanction.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBudgets.map(task => {
            const status = task.assignedBudgetOfficer?.status;
            const isApproved = status === 'Approved';
            const isForwarded = status === 'Forwarded';
            const actualBudget = Number(task.actualBudget?.amount) || 0;

            return (
              <div key={task.id || task.challengeId || task._id} className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10.5px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md uppercase font-mono">{task.challengeId || 'PRJ'}</span>
                      {isApproved ? (
                        <span className="text-[10.5px] font-bold text-[#007A61] bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-md uppercase flex items-center gap-1">
                          <Lock className="w-3 h-3 text-[#007A61]" /> Sanctioned & Dispatched
                        </span>
                      ) : isForwarded ? (
                        <span className="text-[10.5px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Sent to Govt
                        </span>
                      ) : (
                        <span className="text-[10.5px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md uppercase flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Needs Review
                        </span>
                      )}
                      <span className="text-xs text-slate-500">Prepared by <strong className="text-slate-800">{task.assignedBudgetOfficer?.name || 'Budget Officer'}</strong></span>
                    </div>
                    <h3 className="font-black text-slate-900 text-lg leading-snug">{task.title}</h3>
                    <p className="text-xs text-slate-600 font-medium line-clamp-2 max-w-3xl">{task.description || task.problemStatement}</p>
                  </div>

                  <div className="self-start lg:self-center shrink-0">
                    <div className={`px-4 py-2 rounded-lg border text-right min-w-[140px] ${isApproved ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/30' : 'bg-slate-50 border-slate-200'}`}>
                      <span className="block text-[10px] font-bold text-[#007A61] uppercase tracking-wide">{isApproved ? 'Sanctioned Budget' : 'Requisition Budget'}</span>
                      <span className="block text-lg font-black text-slate-900 flex items-center justify-end font-mono">
                        <IndianRupee className="w-4 h-4 mr-0.5 text-[#007A61]" />{actualBudget.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1 bg-slate-50/80 rounded-lg p-2.5 border border-slate-100 flex items-start gap-2">
                    <span className="text-[10.5px] font-bold text-slate-500 uppercase shrink-0 mt-0.5">Purpose & Scope:</span>
                    <p className="text-xs text-slate-700 font-medium line-clamp-1 italic">
                      "{task.actualBudget?.details || 'Department project execution allocation.'}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {task.actualBudget?.pdfUrl && (
                      <button onClick={() => openPdf(task.actualBudget.pdfUrl)} className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center gap-1.5 transition-colors border border-indigo-200 cursor-pointer">
                        <FileText className="w-3.5 h-3.5" /><span>Quotation</span>
                      </button>
                    )}

                    {!isApproved && (
                      <button type="button" onClick={() => setEditingTask(task)} className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-lg flex items-center gap-1 transition-colors border border-slate-300 cursor-pointer shadow-2xs">
                        <Edit3 className="w-3.5 h-3.5 text-slate-600" /><span>Edit Budget & Purpose</span>
                      </button>
                    )}

                    {isApproved ? (
                      <div className="px-3.5 py-1.5 bg-emerald-100 text-[#007A61] rounded-lg text-xs font-bold flex items-center gap-1.5 border border-emerald-300 shadow-2xs">
                        <Lock className="w-3.5 h-3.5 text-[#007A61]" /><span>Funds Received & Locked</span>
                      </div>
                    ) : !isForwarded ? (
                      <button onClick={() => onSubmitToGovernment(task)} className="px-4 py-1.5 text-xs font-bold text-white bg-[#007A61] hover:bg-[#00604c] rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer">
                        <Send className="w-3.5 h-3.5" /><span>Submit to Government</span>
                      </button>
                    ) : (
                      <span className="px-3.5 py-1.5 text-xs font-bold text-indigo-800 bg-indigo-100/80 border border-indigo-200 rounded-lg flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" /><span>Awaiting Govt Approval</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingTask && (
        <EditDepartmentBudgetModal
          isOpen={Boolean(editingTask)}
          onClose={() => setEditingTask(null)}
          task={editingTask}
          onSave={handleSaveRequisition}
        />
      )}
    </div>
  );
};

export default DepartmentBudgetReviewPanel;
