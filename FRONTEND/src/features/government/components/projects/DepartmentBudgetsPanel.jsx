import React, { useState } from 'react';
import { Search, Landmark, CheckCircle, Clock, CheckCircle2, IndianRupee, MapPin } from 'lucide-react';
import { BudgetApprovalModal } from './BudgetApprovalModal.jsx';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

export const DepartmentBudgetsPanel = ({ onApproveBudget }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [projects, setProjects] = useState([]);

  React.useEffect(() => {
    projectCsrSyncService.initializeFromBackend().then(() => {
      setProjects(projectCsrSyncService.getActiveProjects());
    });

    const unsubscribe = projectCsrSyncService.subscribe((event, data) => {
      if (data?.updatedProjects) {
        setProjects([...data.updatedProjects]);
      }
    });

    return unsubscribe;
  }, []);

  const handleApprove = (budget, remarks) => {
    if (onApproveBudget) {
      onApproveBudget(budget, remarks);
    } else {
      projectCsrSyncService.approveDepartmentBudget(budget.id || budget.challengeId || budget._id, remarks);
      setProjects(projectCsrSyncService.getActiveProjects());
    }
  };

  // Budgets that have been forwarded to the government or already approved
  const forwardedBudgets = projects.filter(p => 
    p.assignedBudgetOfficer?.status === 'Forwarded' || 
    p.assignedBudgetOfficer?.status === 'Approved'
  );

  const filteredBudgets = forwardedBudgets.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.challengeId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Landmark className="w-6 h-6 text-indigo-600" />
            DEPARTMENT BUDGETS
          </h2>
          <p className="text-[13px] text-slate-500 font-medium mt-1">
            Review and approve actual budgets prepared and submitted by State Departments.
          </p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-lg text-center min-w-[120px]">
          <span className="block text-2xl font-black text-indigo-700 font-mono leading-none">
            {forwardedBudgets.filter(p => p.assignedBudgetOfficer?.status === 'Forwarded').length}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 mt-1 block">
            Pending Approval
          </span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search budgets by project ID or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 shadow-xs"
        />
      </div>

      {filteredBudgets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">All Caught Up!</h3>
          <p className="text-sm text-slate-500 mt-1">No budget proposals from departments are pending your review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBudgets.map((project) => {
            const isApproved = project.assignedBudgetOfficer?.status === 'Approved';
            const actualBudget = project.actualBudget?.amount || 0;
            const officerName = project.assignedBudgetOfficer?.name || 'Unknown Officer';
            const deptName = project.department || project.handoverDepartment || 'N/A';

            return (
              <div key={project.challengeId || project.id || project._id} className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all overflow-hidden flex flex-col relative group">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
                  <div>
                    <div className="flex gap-2 mb-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-white border border-slate-200 rounded-md">
                        {project.challengeId || 'PRJ'}
                      </span>
                      {isApproved ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-1" title={project.title}>
                      {project.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Landmark className="w-3 h-3" /> Department</p>
                      <p className="text-xs font-semibold text-slate-800 line-clamp-1 mt-0.5">{deptName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><MapPin className="w-3 h-3" /> Prepared By</p>
                      <p className="text-xs font-semibold text-slate-800 line-clamp-1 mt-0.5">{officerName}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Requested Budget</p>
                      <p className="text-lg font-black text-slate-900 flex items-center">
                        <IndianRupee className="w-4 h-4 mr-0.5" />
                        {Number(actualBudget).toLocaleString('en-IN')}
                      </p>
                    </div>
                    {!isApproved && (
                      <button
                        onClick={() => setSelectedBudget(project)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                      >
                        Review & Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BudgetApprovalModal
        isOpen={Boolean(selectedBudget)}
        onClose={() => setSelectedBudget(null)}
        project={selectedBudget}
        onApprove={(remarks) => {
          handleApprove(selectedBudget, remarks);
          setSelectedBudget(null);
        }}
      />
    </div>
  );
};

export default DepartmentBudgetsPanel;
