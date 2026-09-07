import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Flag, Users, Handshake, Loader2, IndianRupee, Landmark,
  Download, RefreshCw, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService.js';

import ChallengeAnalyticsSection from './ChallengeAnalyticsSection.jsx';
import HeiParticipationSection from './HeiParticipationSection.jsx';
import IndustryCsrSection from './IndustryCsrSection.jsx';
import ProjectProgressSection from './ProjectProgressSection.jsx';
import MilestoneOverviewSection from './MilestoneOverviewSection.jsx';
import FundUtilizationSection from './FundUtilizationSection.jsx';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } }
};

const InstitutionalKpi = ({ icon: Icon, title, value, subtext, badge }) => (
  <motion.div
    variants={itemVariants}
    className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors"
  >
    <div className="flex items-center justify-between pb-2">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</h3>
      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <div className="flex flex-col gap-1 mt-1">
      <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">{value}</div>
      <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
        <span>{subtext}</span>
        {badge && (
          <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded text-[10px]">
            {badge}
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

export const ReportsPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('all');

  const loadData = () => {
    setLoading(true);
    analyticsService.fetchAll().then((raw) => {
      const analytics = analyticsService.buildAnalytics(raw);
      setData(analytics);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[65vh]">
        <Loader2 className="w-8 h-8 text-slate-900 animate-spin mb-4" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Live Database Metrics...</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 max-w-[1400px] mx-auto select-none pb-12 font-sans">
      {/* Header Bar */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Reports & Institutional Analytics</h2>
            <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10.5px] font-bold rounded-full">
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
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer text-xs font-bold flex items-center space-x-1"
            title="Refresh database records"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sync</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-black cursor-pointer text-xs font-bold flex items-center space-x-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </motion.div>

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
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors cursor-pointer text-xs ${
              activeView === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
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
      {(activeView === 'all' || activeView === 'financials') && (
        <motion.div variants={itemVariants} className="w-full">
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
        </motion.div>
      )}

      {(activeView === 'all' || activeView === 'projects') && (
        <>
          <motion.div variants={itemVariants} className="w-full">
            <MilestoneOverviewSection
              totalMilestones={data.totalMilestones}
              completedMil={data.completedMil}
              inProgressMil={data.inProgressMil}
              pendingMil={data.pendingMil}
              overdueMil={data.overdueMil}
              milestoneByStage={data.milestoneByStage}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="w-full">
            <ProjectProgressSection
              byStatus={data.projectsByStatus}
              byStage={data.projectsByStage}
              delayedCount={data.delayedCount}
            />
          </motion.div>
        </>
      )}

      {(activeView === 'all' || activeView === 'challenges') && (
        <motion.div variants={itemVariants} className="w-full">
          <ChallengeAnalyticsSection
            pipeline={data.pipeline}
            byDomain={data.challengesByDomain}
            trend={data.challengesTrend}
          />
        </motion.div>
      )}

      {activeView === 'all' && (
        <motion.div variants={itemVariants} className="w-full">
          <HeiParticipationSection
            hei={data.hei}
            topUniversities={data.topUniversities}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ReportsPanel;
