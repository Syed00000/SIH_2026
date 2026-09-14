import React from 'react';
import { GovernmentOverview } from '../overview/GovernmentOverview.jsx';
import { AITriageDashboard } from '../triage/AITriageDashboard.jsx';
import { HeiHubPanel } from '../heis/heiHubPanel.jsx';
import { ManageUniversitiesDashboard } from '../universities/ManageUniversitiesDashboard.jsx';
import { ManageIndustriesDashboard } from '../industries/ManageIndustriesDashboard.jsx';
import {
  ActiveProjectsPanel,
  SolutionProposalsPanel,
  MilestonesMonitoringPanel,
  PrototypesEvaluationPanel,
  DeploymentTelemetryPanel
} from '../projects/index.js';
import { GovernmentGisDashboard } from '../gis/GovernmentGisDashboard.jsx';
import { AdminManagement, DepartmentsManagementPanel } from '../governance/index.js';
import { StateDepartmentsManagementPanel } from '../state-departments/StateDepartmentsManagementPanel.jsx';
import { CSRGrantsLifecycleDashboard } from '../csr/CSRGrantsLifecycleDashboard.jsx';
import { ManageUpdatesDashboard } from '../updates/ManageUpdatesDashboard.jsx';
import { GovernmentReportsPanel } from '../reports/GovernmentReportsPanel.jsx';
import { ComingSoonPanel } from '../common/ComingSoonPanel.jsx';

export const GovernmentTabRouter = ({
  activeTab,
  kpis,
  filteredTriageFeed,
  sectors,
  sectorTimeframe,
  setSectorTimeframe,
  trendData,
  trendInterval,
  setTrendInterval,
  heis,
  selectedDistrict,
  setSelectedDistrict,
  setSelectedSector,
  handleApproveTriage,
  handleRejectTriage,
  handleSetActiveTab,
  getTabTitle
}) => {
  if (activeTab === 'overview') {
    return (
      <GovernmentOverview
        kpis={kpis}
        sectors={sectors}
        sectorTimeframe={sectorTimeframe}
        onChangeSectorTimeframe={setSectorTimeframe}
        trendData={trendData}
        trendInterval={trendInterval}
        onChangeTrendInterval={setTrendInterval}
        heis={heis}
        onSelectSector={setSelectedSector}
        onViewAllTriage={() => handleSetActiveTab('projects_proposals')}
        onViewAllHeis={() => handleSetActiveTab('heis')}
      />
    );
  }

  if (activeTab === 'reports' || activeTab.startsWith('reports_')) {
    return <GovernmentReportsPanel selectedDistrict={selectedDistrict} />;
  }

  if (activeTab === 'triage') {
    return (
      <AITriageDashboard
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
      />
    );
  }

  if (activeTab === 'updates') {
    return <ManageUpdatesDashboard />;
  }

  if (['projects_solutions', 'projects_overview', 'projects_active'].includes(activeTab)) {
    return <ActiveProjectsPanel />;
  }
  if (activeTab === 'projects_proposals') return <SolutionProposalsPanel />;
  if (activeTab === 'projects_milestones') return <MilestonesMonitoringPanel />;
  if (activeTab === 'projects_prototypes') return <PrototypesEvaluationPanel />;
  if (activeTab === 'projects_deployment') return <DeploymentTelemetryPanel />;
  if (activeTab === 'heis') {
    return <HeiHubPanel selectedDistrict={selectedDistrict} onSelectDistrict={setSelectedDistrict} />;
  }
  if (activeTab === 'csr' || activeTab === 'csr_grants') {
    return <CSRGrantsLifecycleDashboard />;
  }
  if (['governance_universities', 'manage_universities'].includes(activeTab)) {
    return <ManageUniversitiesDashboard initialMode="list" />;
  }
  if (['governance_industries', 'manage_industries', 'industries'].includes(activeTab)) {
    return <ManageIndustriesDashboard />;
  }
  if (activeTab === 'dept_state') {
    return <StateDepartmentsManagementPanel />;
  }

  if (['governance_departments', 'departments', 'dept_district', 'dept_panchayat', 'dept_block'].includes(activeTab)) {
    const cat = activeTab === 'dept_district' ? 'District Department' :
      activeTab === 'dept_panchayat' ? 'Gram Panchayat' :
      'Block / Tehsil Office';
    return <DepartmentsManagementPanel key={activeTab} category={cat} />;
  }
  if (activeTab === 'gis') return <GovernmentGisDashboard />;
  if (['users_admin', 'user_governance'].includes(activeTab)) {
    return <AdminManagement />;
  }

  return (
    <ComingSoonPanel
      title={getTabTitle(activeTab)}
      onBackToOverview={() => handleSetActiveTab('overview')}
    />
  );
};

export default GovernmentTabRouter;
