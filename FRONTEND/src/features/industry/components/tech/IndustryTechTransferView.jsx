import React, { useState, useEffect } from 'react';
import { Cpu, RefreshCw, FolderGit2 } from 'lucide-react';
import { TechKpiCards } from './TechKpiCards.jsx';
import { SubmittedProblemsTable } from './SubmittedProblemsTable.jsx';
import { IndustryGrantTechPanel } from './IndustryGrantTechPanel.jsx';
import { industryTechService } from '../../services/industryTechService.js';

export const IndustryTechTransferView = ({ user, onRefresh }) => {
  const [toolsData, setToolsData] = useState([]);
  const [eligibleProblems, setEligibleProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblemForGrant, setSelectedProblemForGrant] = useState(null);

  const fetchTechData = async () => {
    try {
      setLoading(true);
      const indName = user?.organizationName || '';
      const res = await industryTechService.getTechTools(indName);
      if (res?.tools) setToolsData(res.tools);
      if (res?.eligibleProblemStatements) setEligibleProblems(res.eligibleProblemStatements);
    } catch (err) {
      console.error('Failed to load tech transfer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechData();
  }, [user]);

  const handleProblemSelect = (prob) => {
    setSelectedProblemForGrant(prob);
  };

  if (selectedProblemForGrant) {
    return (
      <IndustryGrantTechPanel
        tool={toolsData[0] || null}
        tools={toolsData}
        eligibleProblems={eligibleProblems}
        initialProblem={selectedProblemForGrant}
        onBack={() => setSelectedProblemForGrant(null)}
        onSuccess={() => {
          setSelectedProblemForGrant(null);
          fetchTechData();
          onRefresh && onRefresh();
        }}
      />
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#007A61] to-teal-800 text-white flex items-center justify-center shadow-xs shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <span>IP &amp; Technology Transfer Arsenal</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                Industry R&amp;D Suite
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Grant research laboratory facility access, authorized apparatus, and official Access ID Letters for submitted university prototypes.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={fetchTechData}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            title="Refresh Submitted Problems"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <TechKpiCards eligibleProblems={eligibleProblems} />

      {/* Exclusively Submitted Problem Statements (Where University Locked/Accepted Fee) */}
      <SubmittedProblemsTable
        eligibleProblems={eligibleProblems}
        onSelectProblem={handleProblemSelect}
      />
    </div>
  );
};

export default IndustryTechTransferView;
