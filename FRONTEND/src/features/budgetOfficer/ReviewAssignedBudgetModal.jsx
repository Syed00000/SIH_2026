import React from 'react';
import { X, FileText, IndianRupee, Target, MapPin, Eye, ArrowRight } from 'lucide-react';

export const ReviewAssignedBudgetModal = ({ isOpen, onClose, task, onProceedToPrepare }) => {
  if (!isOpen || !task) return null;

  const oldBudget = Number(task.estimatedCost || task.sanctionedBudget || task.budget || 250000);
  const protoUrl = task.prototypePdfUrl || task.resolutionDossier?.prototypePdfUrl || task.pdfUrl || task.testingReportPdfUrl;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-slideUp">
        
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#007A61]/10 rounded-full flex items-center justify-center border border-[#007A61]/20">
              <FileText className="w-5 h-5 text-[#007A61]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Review Assigned Project</h2>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{task.challengeId || 'PRJ'} • PROVIDED BY DEPT</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">{task.title}</h3>
            <p className="text-sm text-slate-600 font-medium">
              {task.description || task.problemStatement || 'No description provided by the department.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                <Target className="w-3 h-3" /> Sector / Domain
              </span>
              <span className="text-sm font-bold text-slate-800">{task.sector || task.domain || 'General'}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                <MapPin className="w-3 h-3" /> Location
              </span>
              <span className="text-sm font-bold text-slate-800">{task.district || 'Statewide'}</span>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase flex items-center gap-1 mb-1">
                <IndianRupee className="w-4 h-4" /> Preliminary Estimate (Dept)
              </span>
              <span className="text-2xl font-black text-amber-900">
                ₹ {oldBudget.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right max-w-[200px]">
              <span className="text-[10px] font-bold text-amber-700/70 uppercase">Instructions</span>
              <p className="text-xs text-amber-800 font-medium leading-tight mt-0.5">
                Review blueprint and calculate actual costs required for deployment.
              </p>
            </div>
          </div>

          {protoUrl && (
            <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Prototype Blueprint / DPR</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Review the engineering plan to assess costs.</p>
                </div>
              </div>
              <button 
                onClick={() => window.open(protoUrl, '_blank')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" /> View Blueprint
              </button>
            </div>
          )}

        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onProceedToPrepare(task);
            }}
            className="px-6 py-2 bg-[#007A61] hover:bg-[#006651] text-white text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span>Prepare Actual Budget</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
