import React, { useState } from 'react';
import { IndianRupee, MapPin, Target, Calendar, Edit3, ShieldAlert, Sparkles, FileSearch } from 'lucide-react';
import { CreateActualBudgetModal } from './CreateActualBudgetModal.jsx';
import { ReviewAssignedBudgetModal } from './ReviewAssignedBudgetModal.jsx';

export const BudgetOfficerTasksPanel = ({ tasks, loading, onSubmitBudget }) => {
  const [selectedTaskToReview, setSelectedTaskToReview] = useState(null);
  const [selectedTaskToPrepare, setSelectedTaskToPrepare] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center flex flex-col items-center justify-center shadow-xs">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-black text-slate-800 mb-2">No Budget Assignments</h3>
        <p className="text-sm text-slate-500 font-medium max-w-md">
          You currently have no civic problems or projects assigned for financial planning and budget preparation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tasks.map((task) => {
          const officerStatus = task.assignedBudgetOfficer?.status || 'Assigned';
          const isSubmitted = officerStatus === 'Submitted';
          const oldBudget = task.estimatedCost || task.sanctionedBudget || task.budget || 250000;

          return (
            <div key={task.id || task.challengeId || task._id} className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-[#007A61]/30 transition-all overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                    isSubmitted 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-[#007A61]/10 text-[#007A61] border-[#007A61]/20'
                  }`}>
                    {isSubmitted ? 'Budget Prepared' : 'Pending Review'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                    {task.challengeId || 'PRJ'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-2" title={task.title}>
                  {task.title}
                </h3>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100 flex items-start space-x-2">
                    <IndianRupee className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="block text-[10px] font-bold text-amber-700 uppercase">Provided Budget (Dept)</span>
                      <span className="block text-sm font-black text-amber-900">
                        ₹ {Number(oldBudget).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="block text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</span>
                      <span className="block text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">
                        {task.district || 'Statewide'}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="block text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1"><Calendar className="w-3 h-3" /> Date</span>
                      <span className="block text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">
                        {new Date(task.assignedBudgetOfficer?.assignedAt || Date.now()).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  {isSubmitted ? (
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Actual Budget Sent</span>
                        <span className="text-sm font-black text-emerald-700">₹ {Number(task.actualBudget?.amount || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold flex items-center gap-1 border border-slate-200">
                        Submitted <Sparkles className="w-3 h-3" />
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedTaskToReview(task)}
                      className="w-full px-3 py-2 bg-[#007A61] hover:bg-[#006651] text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                    >
                      <FileSearch className="w-4 h-4" />
                      <span>Review Assigned Budget</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ReviewAssignedBudgetModal
        isOpen={Boolean(selectedTaskToReview)}
        onClose={() => setSelectedTaskToReview(null)}
        task={selectedTaskToReview}
        onProceedToPrepare={(t) => setSelectedTaskToPrepare(t)}
      />

      <CreateActualBudgetModal
        isOpen={Boolean(selectedTaskToPrepare)}
        onClose={() => setSelectedTaskToPrepare(null)}
        task={selectedTaskToPrepare}
        onSubmit={(actualBudgetDetails) => {
          onSubmitBudget(selectedTaskToPrepare, actualBudgetDetails);
          setSelectedTaskToPrepare(null);
        }}
      />
    </div>
  );
};

export default BudgetOfficerTasksPanel;
