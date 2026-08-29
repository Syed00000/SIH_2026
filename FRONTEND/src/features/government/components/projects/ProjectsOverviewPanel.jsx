import React, { useState, useEffect } from 'react';
import { Building2, FileCheck, PlayCircle, CheckCircle2, Cpu, Rocket } from 'lucide-react';
import ProjectKpiCards from './ProjectKpiCards.jsx';
import ProjectLeafletMap from './ProjectLeafletMap.jsx';
import ProjectsOverviewLifecycle from './ProjectsOverviewLifecycle.jsx';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';
import apiClient from '../../../../infrastructure/api/client.js';

export const ProjectsOverviewPanel = ({ onNavigateTab }) => {
  const [projects, setProjects] = useState(() => projectCsrSyncService.getActiveProjects());
  const [proposals, setProposals] = useState(() => projectCsrSyncService.getSolutionProposals());
  const [totalChallenges, setTotalChallenges] = useState(0);

  useEffect(() => {
    const unsubscribe = projectCsrSyncService.subscribe((eventType, data) => {
      if (data?.updatedProjects) setProjects(data.updatedProjects);
      if (data?.updatedSolProposals) setProposals(data.updatedSolProposals);
    });
    return unsubscribe;
  }, []);

  // Fetch real challenges count from backend
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await apiClient.get('university/challenges?universityCode=RU001&limit=1');
        const total = res.data?.total ?? 0;
        setTotalChallenges(total);
      } catch (err) {
        console.warn('Failed to fetch challenges count:', err);
        setTotalChallenges(0);
      }
    };
    fetchChallenges();
  }, []);

  const totalSanctionedLakhs = projects.reduce((acc, p) => {
    const val = parseFloat(String(p.sanctionedGrant || '0').replace(/[^\d.]/g, '')) || 0;
    return acc + val;
  }, 0);
  const totalDisbursedLakhs = projects.reduce((acc, p) => {
    const val = parseFloat(String(p.disbursedGrant || '0').replace(/[^\d.]/g, '')) || 0;
    return acc + val;
  }, 0);
  const pendingLakhs = Math.max(0, totalSanctionedLakhs - totalDisbursedLakhs);
  const livePercent = totalSanctionedLakhs > 0 ? Math.round((totalDisbursedLakhs / totalSanctionedLakhs) * 100) : 0;

  const liveKpis = {
    totalChallenges: totalChallenges,
    solutionProposals: proposals.length,
    projectsApproved: proposals.filter((p) => p.status === 'Approved' || p.status === 'Verified').length,
    inProgress: projects.filter((p) => p.status === 'Active' || p.status === 'In Progress').length,
    deployed: projects.filter((p) => p.status === 'Deployed').length,
    completed: projects.filter((p) => p.status === 'Completed').length
  };

  const liveFinancials = {
    totalPoolCr: `₹ ${(totalSanctionedLakhs / 100).toFixed(2)} Cr`,
    disbursedCr: `₹ ${(totalDisbursedLakhs / 100).toFixed(2)} Cr`,
    pendingCr: `₹ ${(pendingLakhs / 100).toFixed(2)} Cr`,
    disbursedPercentage: livePercent,
    sanctionedProjectsCount: projects.length
  };


  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span className="flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Government of Jharkhand</span>
            </span>
            <span>•</span>
            <span className="text-slate-700">Societal Innovation Hub</span>
          </div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight">
            INNOVATION LIFECYCLE MANAGEMENT DASHBOARD
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Master command overview for solution proposals, active R&D, milestone stage gates, prototypes, and field deployments
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('projects_proposals')}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Review Proposals ({proposals.length})</span>
          </button>
        </div>
      </div>

      <ProjectKpiCards
        kpis={liveKpis}
        onKpiClick={(kpiId) => {
          if (kpiId === 'solution_proposals') onNavigateTab && onNavigateTab('projects_proposals');
          if (kpiId === 'in_progress') onNavigateTab && onNavigateTab('projects_active');
          if (kpiId === 'deployed') onNavigateTab && onNavigateTab('projects_deployment');
        }}
      />

      {/* Module Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { id: 'projects_active', title: 'Active Projects', count: `${projects.length} Active`, icon: PlayCircle, badge: 'Stage Gates' },
          { id: 'projects_proposals', title: 'Solution Proposals', count: `${proposals.length} Submissions`, icon: FileCheck, badge: 'Queue' },
          { id: 'projects_milestones', title: 'Milestones & Monitoring', count: 'Phase Gates', icon: CheckCircle2, badge: 'Audit' },
          { id: 'projects_prototypes', title: 'Prototypes & TRL', count: 'TRL 1 to 9', icon: Cpu, badge: 'Readiness' },
          { id: 'projects_deployment', title: 'Deployment / Validation', count: 'Field Pilots', icon: Rocket, badge: 'Live Network' }
        ].map((module) => {
          const Icon = module.icon;
          return (
            <div
              key={module.id}
              onClick={() => onNavigateTab && onNavigateTab(module.id)}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700">{module.badge}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 mt-3">{module.title}</h3>
                <div className="text-sm font-black text-slate-900 mt-0.5">{module.count}</div>
              </div>
            </div>
          );
        })}
      </div>

      <ProjectLeafletMap projects={projects} proposals={proposals} />

      <ProjectsOverviewLifecycle liveFinancials={liveFinancials} onNavigateTab={onNavigateTab} />
    </div>
  );
};

export default ProjectsOverviewPanel;
