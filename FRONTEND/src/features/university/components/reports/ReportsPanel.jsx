import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, UploadCloud, FileText, CheckCircle, 
  Users, Calendar, Loader2, Download, RefreshCw, IndianRupee, Landmark, Flag
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService.js';

import ChallengeAnalyticsSection from './ChallengeAnalyticsSection.jsx';
import HeiParticipationSection from './HeiParticipationSection.jsx';
import ProjectProgressSection from './ProjectProgressSection.jsx';
import MilestoneOverviewSection from './MilestoneOverviewSection.jsx';
import FundUtilizationSection from './FundUtilizationSection.jsx';

const InstitutionalKpi = ({ icon: Icon, title, value, subtext, badge }) => (
  <div className="rounded-none border border-slate-200 bg-white p-5 flex flex-col justify-between hover:border-[#007A61] transition-colors">
    <div className="flex items-center justify-between pb-2">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</h3>
      <div className="w-8 h-8 rounded-none border border-slate-200 bg-slate-50 flex items-center justify-center text-[#007A61]">
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <div className="flex flex-col gap-1 mt-1">
      <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">{value}</div>
      <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
        <span>{subtext}</span>
        {badge && (
          <span className="px-1.5 py-0.5 bg-emerald-50 border border-[#007A61] text-[#007A61] font-bold rounded-none text-[10px]">
            {badge}
          </span>
        )}
      </div>
    </div>
  </div>
);

export const ReportsPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('all');

  const loadData = () => {
    setLoading(true);
    analyticsService.fetchAll().then((raw) => {
      const analytics = analyticsService.buildAnalytics(raw);
      setData({ ...analytics, pArr: raw.pArr, cArr: raw.cArr }); 
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="w-8 h-8 text-[#007A61] animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-500">Loading actual metrics...</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-[1400px] mx-auto select-none font-sans text-slate-800 space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-none border border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Reports & Institutional Analytics</h2>
            <span className="px-2.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-700 text-[10.5px] font-bold rounded-none">
              RU001 &bull; Ranchi University
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time analytics on Government Grants, PFMS Disbursals, Project Milestones & Industry Collaborations.
          </p>
        </div>
        
        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={loadData}
            className="p-2 rounded-none border border-slate-200 bg-white text-[#007A61] hover:bg-emerald-50 cursor-pointer text-xs font-bold flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sync</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-none bg-[#007A61] text-white hover:bg-[#00604c] cursor-pointer text-xs font-bold flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'Executive Summary (All)' },
          { id: 'financials', label: 'Grant & PFMS Disbursal' },
          { id: 'projects', label: 'Projects & Milestones' },
          { id: 'challenges', label: 'Challenge Pipeline' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveView(tab.id)}
            className={`px-3.5 py-1.5 rounded-none font-bold transition-colors cursor-pointer text-xs ${
              activeView === tab.id
                ? 'bg-[#007A61] text-white border border-[#007A61]'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InstitutionalKpi
          icon={Landmark}
          title="Sanctioned Grant DPR"
          value={`₹ ${Number(data.totalSanctionedGrant || 80000).toLocaleString('en-IN')}`}
          subtext="State Innovation Scheme"
          badge="100% DPR"
        />
        <InstitutionalKpi
          icon={IndianRupee}
          title="PFMS Grant Disbursed"
          value={`₹ ${Number(data.totalDisbursed || 40000).toLocaleString('en-IN')}`}
          subtext={`Net ₹ ${Number(data.netUniversityFunds || 15000).toLocaleString('en-IN')} Escrow`}
          badge="Treasury Approved"
        />
        <InstitutionalKpi
          icon={Users}
          title="Active Projects"
          value={data.kpis.totalProjects.toLocaleString()}
          subtext={data.kpis.deployedProjects > 0 ? `${data.kpis.deployedProjects} Deployed (TRL-9)` : 'Active in Lab'}
          badge="State Certified"
        />
        <InstitutionalKpi
          icon={Flag}
          title="Assigned Challenges"
          value={data.kpis.totalChallenges.toLocaleString()}
          subtext="Urban Development"
          badge="100% Triage"
        />
      </div>

      {/* Sections based on active view */}
      <div className="space-y-6">
        {(activeView === 'all' || activeView === 'financials') && (
          <div className="w-full">
            <FundUtilizationSection
              totalSanctionedGrant={data.totalSanctionedGrant}
              totalDisbursed={data.totalDisbursed}
              netUniversityFunds={data.netUniversityFunds}
              pendingGrantEscrow={data.pendingGrantEscrow}
              totalLabFees={data.totalLabFees}
              expenseByCategory={data.expenseByCategory}
              fundDonut={data.fundDonut}
              cashFlowBarData={data.cashFlowBarData}
              ledgerTransactions={data.ledgerTransactions}
            />
          </div>
        )}

        {(activeView === 'all' || activeView === 'projects') && (
          <>
            <div className="w-full">
              <MilestoneOverviewSection
                totalMilestones={data.totalMilestones}
                completedMil={data.completedMil}
                inProgressMil={data.inProgressMil}
                pendingMil={data.pendingMil}
                overdueMil={data.overdueMil}
                milestoneByStage={data.milestoneByStage}
              />
            </div>
            <div className="w-full">
              <ProjectProgressSection
                byStatus={data.projectsByStatus}
                byStage={data.projectsByStage}
                delayedCount={data.delayedCount}
              />
            </div>
          </>
        )}

        {(activeView === 'all' || activeView === 'challenges') && (
          <div className="w-full">
            <ChallengeAnalyticsSection
              pipeline={data.pipeline}
              byDomain={data.challengesByDomain}
              trend={data.challengesTrend}
            />
          </div>
        )}

        {activeView === 'all' && (
          <div className="w-full">
            <HeiParticipationSection
              hei={data.hei}
              topUniversities={data.topUniversities}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPanel;
