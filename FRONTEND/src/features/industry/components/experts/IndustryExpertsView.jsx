import React, { useState } from 'react';
import { Users, Plus, Search, Sparkles, AlertCircle, FolderGit2 } from 'lucide-react';
import { ExpertsKpiCards } from './ExpertsKpiCards.jsx';
import { ExpertsListTable } from './ExpertsListTable.jsx';
import { AddExpertModal } from './AddExpertModal.jsx';
import { IndustryAssignProblemPanel } from './IndustryAssignProblemPanel.jsx';

export const IndustryExpertsView = ({
  user,
  expertsData = [],
  expertStats = {},
  mentorshipProblemsAwaiting = [],
  onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedExpertForAssign, setSelectedExpertForAssign] = useState(null);

  const awaitingCount = mentorshipProblemsAwaiting.length;

  if (selectedExpertForAssign) {
    return (
      <IndustryAssignProblemPanel
        expert={selectedExpertForAssign}
        eligibleProblems={mentorshipProblemsAwaiting}
        onBack={() => setSelectedExpertForAssign(null)}
        onSuccess={() => {
          setSelectedExpertForAssign(null);
          onRefresh && onRefresh();
        }}
      />
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12 text-left">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Corporate Innovation Node</span><span>/</span><span className="text-slate-900 font-bold">Experts & Engineers</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#007A61]" />
            <span>Industrial Experts & Mentorship Network</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign corporate domain specialists, chief engineers, and research directors to sanctioned university problem statements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expert / Technical Engineer</span>
        </button>
      </div>

      {/* 2. Notification Banner for Problem Statements Awaiting Assignment */}
      {awaitingCount > 0 && (
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#007A61] text-white flex items-center justify-center font-black shrink-0 shadow-2xs">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-emerald-950 flex items-center space-x-1.5">
                <span>{awaitingCount} Problem Statement(s) Awaiting Industry Mentor Assignment</span>
                <span className="px-2 py-0.2 bg-emerald-200 text-emerald-900 rounded-full text-[9.5px]">Fee Accepted</span>
              </h4>
              <p className="text-[11px] text-emerald-800 font-medium">
                University approved the mentorship fee quote. Click "Assign Problem" on an expert below to allocate guidance.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-white border border-emerald-300 text-[#007A61] rounded-xl text-xs font-black self-start sm:self-auto shrink-0 shadow-2xs">
            Action Ready
          </span>
        </div>
      )}

      {/* 3. KPI Statistics Cards */}
      <ExpertsKpiCards stats={expertStats} />

      {/* 4. Search and Filter Bar */}
      <div className="p-3 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experts by name, corporate role, domain, or ID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">Domain:</span>
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] cursor-pointer"
          >
            <option value="All">All Domains</option>
            <option value="IoT">IoT & Embedded</option>
            <option value="Water">Water & Environment</option>
            <option value="Automation">Automation & Robotics</option>
            <option value="Energy">Clean Energy</option>
            <option value="AI">AI & Machine Learning</option>
          </select>
        </div>
      </div>

      {/* 5. Listing Table */}
      <ExpertsListTable
        experts={expertsData}
        search={search}
        domainFilter={domainFilter}
        onAssignProblem={(expert) => setSelectedExpertForAssign(expert)}
        onOpenAddExpert={() => setIsAddModalOpen(true)}
      />

      {/* 6. Modals */}
      <AddExpertModal
        isOpen={isAddModalOpen}
        user={user}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          onRefresh && onRefresh();
        }}
      />
    </div>
  );
};

export default IndustryExpertsView;
