import React, { useState, useEffect } from 'react';
import { Search, Landmark, CheckCircle, Clock, CheckCircle2, IndianRupee, MapPin, Lock } from 'lucide-react';
import { BudgetApprovalModal } from './BudgetApprovalModal.jsx';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';
import apiClient from '../../../../infrastructure/api/client.js';

export const DepartmentBudgetsPanel = ({ onApproveBudget }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [projects, setProjects] = useState([]);

  const refreshProjects = () => {
    projectCsrSyncService.initializeFromBackend().then(() => setProjects(projectCsrSyncService.getActiveProjects()));
  };

  useEffect(() => {
    refreshProjects();
    const unsubscribe = projectCsrSyncService.subscribe((event, data) => {
      if (data?.updatedProjects) setProjects([...data.updatedProjects]);
    });
    return unsubscribe;
  }, []);

  const handleApprove = async (budget, remarks) => {
    if (onApproveBudget) return await onApproveBudget(budget, remarks);
    const actualAmount = budget.actualBudget?.amount || 0;
    const deptName = budget.department || budget.handoverDepartment || 'Department';
    const deptId = budget.departmentId || budget.deptId || (deptName.toLowerCase().includes('ranchi') ? 'DEPT-JH-DIST-RNC' : (deptName.toLowerCase().includes('dhanbad') ? 'DEPT-JH-DIST-DHN' : ''));

    // 1. Allocate & deduct from Government State Grants pool
    await apiClient.post('government/funds', {
      amount: actualAmount, fundType: 'DEPARTMENT_ALLOCATION',
      departmentId: deptId, department: deptName, departmentCategory: 'District Department',
      title: `Sanctioned Budget: ${budget.title || budget.challengeId}`,
      scheme: 'Jharkhand State Innovation & Problem Resolution Budget',
      description: `State budget sanctioned for ${budget.challengeId || budget.title}. Prepared by ${budget.assignedBudgetOfficer?.name || 'Officer'}. ${remarks || ''}`
    });

    // 2. Persist project approval in backend
    const cleanId = String(budget.id || budget.challengeId || budget._id || '').replace('PROP-', '');
    try {
      await apiClient.put(`university/projects/${cleanId}?universityCode=ALL`, {
        assignedBudgetOfficer: { ...(budget.assignedBudgetOfficer || {}), status: 'Approved', approvedAt: new Date().toISOString(), governmentRemarks: remarks },
        budgetStatus: 'Sanctioned', sanctionedAmount: actualAmount, sanctionedBudget: actualAmount
      });
    } catch (e) { console.warn('Project update notice:', e.message); }

    try {
      await apiClient.put(`citizen/challenges/${budget.challengeId || cleanId}`, {
        budgetStatus: 'Sanctioned',
        assignedBudgetOfficer: { ...(budget.assignedBudgetOfficer || {}), status: 'Approved', approvedAt: new Date().toISOString(), governmentRemarks: remarks }
      });
    } catch {}

    projectCsrSyncService.approveDepartmentBudget(budget.id || budget.challengeId || budget._id, remarks);
    refreshProjects();
  };

  const forwardedBudgets = projects.filter(p =>
    p.assignedBudgetOfficer?.status === 'Forwarded' || p.assignedBudgetOfficer?.status === 'Approved'
  );

  const filteredBudgets = forwardedBudgets.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || p.challengeId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12 select-none">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Landmark className="w-6 h-6 text-indigo-600" /> DEPARTMENT BUDGETS
          </h2>
          <p className="text-[13px] text-slate-500 font-medium mt-1">
            Review and approve actual budgets prepared by State Departments. Approved budgets are deducted from State Grants.
          </p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-lg text-center min-w-[120px]">
          <span className="block text-2xl font-black text-indigo-700 font-mono leading-none">
            {forwardedBudgets.filter(p => p.assignedBudgetOfficer?.status === 'Forwarded').length}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 mt-1 block">Pending Approval</span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text" placeholder="Search budgets by project ID or name..."
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 shadow-xs"
        />
      </div>

      {filteredBudgets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-slate-400" /></div>
          <h3 className="text-lg font-bold text-slate-900">All Caught Up!</h3>
          <p className="text-sm text-slate-500 mt-1">No budget proposals from departments are pending your review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBudgets.map((project) => {
            const isApproved = project.assignedBudgetOfficer?.status === 'Approved';
            const actualBudget = project.actualBudget?.amount || 0;
            const officerName = project.assignedBudgetOfficer?.name || 'Officer';
            const deptName = project.department || project.handoverDepartment || 'N/A';

            return (
              <div key={project.challengeId || project.id || project._id} className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-4.5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 text-[10.5px] font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-md font-mono">{project.challengeId || 'PRJ'}</span>
                      {isApproved ? (
                        <span className="px-2.5 py-0.5 text-[10.5px] font-bold text-[#007A61] bg-emerald-50 border border-emerald-300 rounded-md flex items-center gap-1 uppercase">
                          <Lock className="w-3 h-3 text-[#007A61]" /> Sanctioned & Dispatched
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 text-[10.5px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md flex items-center gap-1 uppercase">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Landmark className="w-3 h-3 text-slate-400" />
                        <strong className="text-slate-800">{deptName}</strong>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">Prepared by <strong className="text-slate-700">{officerName}</strong></span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug">{project.title}</h3>

                    {project.actualBudget?.details && (
                      <p className="text-xs text-slate-600 font-medium line-clamp-1 italic bg-slate-50 px-2.5 py-1 rounded border border-slate-100 inline-block max-w-2xl">
                        <span className="font-semibold text-slate-400 uppercase not-italic text-[10px] mr-1.5">Scope:</span>
                        "{project.actualBudget.details}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
                    <div className={`px-4 py-2 rounded-lg border text-right min-w-[140px] ${isApproved ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'}`}>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">{isApproved ? 'Sanctioned Pool' : 'Requested Budget'}</span>
                      <span className="block text-base font-black text-slate-900 flex items-center justify-end font-mono">
                        <IndianRupee className="w-4 h-4 mr-0.5 text-indigo-600" />{Number(actualBudget).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {!isApproved ? (
                      <button onClick={() => setSelectedBudget(project)} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5">
                        <span>Review & Approve</span>
                      </button>
                    ) : (
                      <div className="px-3.5 py-2 bg-emerald-50 text-[#007A61] border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                        <Lock className="w-3.5 h-3.5 text-[#007A61]" />
                        <span>Transferred & Locked</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BudgetApprovalModal
        isOpen={Boolean(selectedBudget)} onClose={() => setSelectedBudget(null)} project={selectedBudget}
        onApprove={async (remarks) => {
          await handleApprove(selectedBudget, remarks);
          setSelectedBudget(null);
        }}
      />
    </div>
  );
};

export default DepartmentBudgetsPanel;
