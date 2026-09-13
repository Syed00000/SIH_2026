import React, { useState } from 'react';
import { useIndustryData } from './hooks/useIndustryData.js';
import { 
  Panel1_Overview, Panel2_Profile, Panel4_Collaboration, 
  Panel5_Projects, Panel6_Funding 
} from './panels/IndustryPanels1To6.jsx';
import { 
  Panel7_Labs, Panel8_Experts, Panel10_IP, 
  Panel15_Settings, Panel16_QuickActions 
} from './panels/IndustryPanels7To16.jsx';
import { IndustryRequestDetailPanel } from './IndustryRequestDetailPanel.jsx';
import { IndustryFundingView } from '../funding/IndustryFundingView.jsx';
import { IndustryActiveProjectsView } from '../projects/IndustryActiveProjectsView.jsx';
import { IndustryTestingLabsView } from '../labs/IndustryTestingLabsView.jsx';
import { IndustryExpertsView } from '../experts/IndustryExpertsView.jsx';
import { IndustryTechTransferView } from '../tech/IndustryTechTransferView.jsx';
import { IndustryComingSoonPanel } from '../common/IndustryComingSoonPanel.jsx';

export const IndustryDashboard = ({ activeTab, setActiveTab, user }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const {
    loading,
    industryProfile,
    stats,
    collaborationRequests,
    projects,
    fundingData,
    labsData,
    expertsData,
    expertStats,
    mentorshipProblemsAwaiting,
    refreshData
  } = useIndustryData(user);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007A61]"></div>
      </div>
    );
  }

  const renderContent = () => {
    if (activeTab === 'dashboard' || activeTab === 'overview') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-8 gap-4">
            <Panel1_Overview user={user} industry={industryProfile} stats={stats} />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-8 gap-4">
            <Panel2_Profile user={user} industry={industryProfile} />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-8 gap-4">
            <Panel4_Collaboration 
              data={collaborationRequests} 
              onViewRequest={setSelectedRequest}
              onViewAll={() => setActiveTab && setActiveTab('collaboration')}
            />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <Panel5_Projects 
              data={projects} 
              onViewAll={() => setActiveTab && setActiveTab('projects')}
            />
            <Panel6_Funding data={fundingData} onNavigateToFunding={() => setActiveTab && setActiveTab('funding')} />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-10 gap-4">
            <Panel7_Labs data={labsData} />
            <Panel8_Experts data={expertsData} />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <Panel10_IP />
            <Panel15_Settings />
            <Panel16_QuickActions onNavigate={setActiveTab} />
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'collaboration':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-8 gap-4">
            <Panel4_Collaboration data={collaborationRequests} onViewRequest={setSelectedRequest} />
          </div>
        );
      case 'projects':
        return <IndustryActiveProjectsView projects={projects} onNavigateToFunding={() => setActiveTab && setActiveTab('funding')} />;
      case 'funding':
        return <IndustryFundingView user={user} />;
      case 'testing':
        return <IndustryTestingLabsView projects={projects} />;
      case 'profile':
        return <IndustryComingSoonPanel title="Industry Profile & Credentials" onBackToDashboard={() => setActiveTab('dashboard')} />;
      case 'experts':
        return (
          <IndustryExpertsView
            user={user}
            expertsData={expertsData}
            expertStats={expertStats}
            mentorshipProblemsAwaiting={mentorshipProblemsAwaiting}
            onRefresh={refreshData}
          />
        );
      case 'ip_transfer':
        return <IndustryTechTransferView user={user} onRefresh={refreshData} />;
      case 'reports':
        return <IndustryComingSoonPanel title="Reports & Analytics" onBackToDashboard={() => setActiveTab('dashboard')} />;
      case 'settings':
        return <IndustryComingSoonPanel title="Security & Organization Settings" onBackToDashboard={() => setActiveTab('dashboard')} />;
      default:
        return <IndustryComingSoonPanel title={`Module: ${activeTab}`} onBackToDashboard={() => setActiveTab('dashboard')} />;
    }
  };

  if (selectedRequest) {
    return (
      <IndustryRequestDetailPanel
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onSuccess={() => {
          setSelectedRequest(null);
          if (typeof refreshData === 'function') refreshData();
        }}
      />
    );
  }

  return renderContent();
};

export default IndustryDashboard;
