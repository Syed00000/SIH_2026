import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flag, Building2, Users, Handshake, Loader2, ArrowUpRight, ArrowDownRight, IndianRupee } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService.js';

import ChallengeAnalyticsSection from './ChallengeAnalyticsSection.jsx';
import HeiParticipationSection from './HeiParticipationSection.jsx';
import IndustryCsrSection from './IndustryCsrSection.jsx';
import ProjectProgressSection from './ProjectProgressSection.jsx';
import SocialImpactSection from './SocialImpactSection.jsx';
import MilestoneOverviewSection from './MilestoneOverviewSection.jsx';
import FundUtilizationSection from './FundUtilizationSection.jsx';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } }
};

const ShadcnKpi = ({ icon: Icon, title, value, growth }) => {
  const isPositive = growth?.startsWith('+');
  return (
    <motion.div variants={itemVariants} className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium text-muted-foreground text-zinc-500">{title}</h3>
        <Icon className="h-4 w-4 text-muted-foreground text-zinc-500" />
      </div>
      <div className="flex flex-col gap-1 mt-2">
        <div className="text-2xl font-bold text-zinc-950">{value}</div>
        {growth && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 text-zinc-500">
            {isPositive ? <ArrowUpRight className="h-3 w-3 text-zinc-900" /> : <ArrowDownRight className="h-3 w-3 text-zinc-900" />}
            <span className="font-semibold text-zinc-900">{growth}</span> from last month
          </p>
        )}
      </div>
    </motion.div>
  );
};

export const ReportsPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    analyticsService.fetchAll().then((raw) => {
      if (!mounted) return;
      const analytics = analyticsService.buildAnalytics(raw);
      setData(analytics);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="w-8 h-8 text-zinc-900 animate-spin mb-4" />
        <p className="text-sm font-medium text-zinc-500">Loading metrics...</p>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 max-w-[1400px] mx-auto select-none pb-12 font-sans">
      
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-950">Dashboard</h2>
        <p className="text-sm text-zinc-500">Live platform metrics powered entirely by actual database records.</p>
      </motion.div>

      {/* KPI Row (Small Rectangles) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ShadcnKpi icon={IndianRupee} title="Total CSR Funding" value={`₹${data.kpis.totalFundingCr.toFixed(1)} Cr`} growth={data.kpis.fundingGrowth} />
        <ShadcnKpi icon={Flag} title="Total Challenges" value={data.kpis.totalChallenges.toLocaleString()} growth={data.kpis.challengesGrowth} />
        <ShadcnKpi icon={Users} title="Active Projects" value={data.kpis.totalProjects.toLocaleString()} growth={data.kpis.projectsGrowth} />
        <ShadcnKpi icon={Handshake} title="Industry Partners" value={data.kpis.industryPartners.toLocaleString()} growth={data.kpis.partnersGrowth} />
      </div>

      {/* Full Width Sections */}
      <div className="flex flex-col gap-6">
        <motion.div variants={itemVariants} className="w-full">
          <FundUtilizationSection totalFundingL={data.totalFundingL} utilizedL={data.utilizedL} availableL={data.availableL} thisMonthL={data.thisMonthL} expenseByCategory={data.expenseByCategory} fundDonut={data.fundDonut} />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <ProjectProgressSection byStatus={data.projectsByStatus} byStage={data.projectsByStage} delayedCount={data.delayedCount} />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <SocialImpactSection kpis={data.kpis} impactTrend={data.impactTrend} impactStats={data.impactStats} />
        </motion.div>
        
        <motion.div variants={itemVariants} className="w-full">
          <ChallengeAnalyticsSection pipeline={data.pipeline} byDomain={data.challengesByDomain} trend={data.challengesTrend} />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <MilestoneOverviewSection totalMilestones={data.totalMilestones} completedMil={data.completedMil} inProgressMil={data.inProgressMil} pendingMil={data.pendingMil} overdueMil={data.overdueMil} milestoneByStage={data.milestoneByStage} />
        </motion.div>
      </div>

    </motion.div>
  );
};

export default ReportsPanel;
