import React, { useState } from 'react';
import { useIndustryData } from './hooks/useIndustryData.js';
import { 
  Panel1_Overview, Panel2_Profile, Panel3_Capabilities, Panel4_Collaboration, 
  Panel5_Projects, Panel6_Funding 
} from './panels/IndustryPanels1To6.jsx';
import { 
  Panel7_Labs, Panel8_Experts, Panel9_Documents, Panel10_IP, 
  Panel11_Internships, Panel12_Communication, Panel14_Impact, 
  Panel15_Settings, Panel16_QuickActions 
} from './panels/IndustryPanels7To16.jsx';
import { IndustryRequestActionModal } from './IndustryRequestActionModal.jsx';
import { IndustryFundingView } from '../funding/IndustryFundingView.jsx';
import { IndustryActiveProjectsView } from '../projects/IndustryActiveProjectsView.jsx';
import { IndustryTestingLabsView } from '../labs/IndustryTestingLabsView.jsx';
import { IndustryComingSoonPanel } from '../common/IndustryComingSoonPanel.jsx';

export const IndustryDashboard = ({ activeTab, setActiveTab, user }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const {
    loading,
    industryProfile,
    stats,
    collaborationRequests,
    projects,
    capabilitiesData,
    fundingData,
    labsData,
    expertsData,
    documentsData,
    internshipsData,
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
    if (activeTab === 'dashboard') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-8 gap-4">
            <Panel1_Overview user={user} industry={industryProfile} stats={stats} />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-8 gap-4">
            <Panel2_Profile user={user} industry={industryProfile} />
            <Panel3_Capabilities data={capabilitiesData} industry={industryProfile} />
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
          <div className="grid grid-cols-1 xl:grid-cols-10 gap-4">
            <Panel9_Documents data={documentsData} />
            <Panel10_IP />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-10 gap-4">
            <Panel11_Internships data={internshipsData} />
            <Panel12_Communication />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <Panel14_Impact stats={stats} fundingData={fundingData} />
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
      case 'capabilities':
        return <IndustryComingSoonPanel title="R&D Capabilities & Infrastructure" onBackToDashboard={() => setActiveTab('dashboard')} />;
      case 'experts':
        return <IndustryComingSoonPanel title="Domain Experts & Mentorship Network" onBackToDashboard={() => setActiveTab('dashboard')} />;
      case 'documents':
        return <IndustryComingSoonPanel title="Legal Dossiers & MOUs" onBackToDashboard={() => setActiveTab('dashboard')} />;
      case 'ip_transfer':
        return <IndustryComingSoonPanel title="IP Licensing & Patent Commercialization" onBackToDashboard={() => setActiveTab('dashboard')} />;
      case 'internships':
        return <IndustryComingSoonPanel title="Student Internships & Talent Hiring" onBackToDashboard={() => setActiveTab('dashboard')} />;
      case 'communication':
        return <IndustryComingSoonPanel title="Direct University R&D Communications" onBackToDashboard={() => setActiveTab('dashboard')} />;
      case 'reports':
      case 'impact':
        return <IndustryComingSoonPanel title="Impact Assessment & Milestone Analytics" onBackToDashboard={() => setActiveTab('dashboard')} />;
      case 'settings':
        return <IndustryComingSoonPanel title="Security & Organization Settings" onBackToDashboard={() => setActiveTab('dashboard')} />;
      default:
        return <IndustryComingSoonPanel title={`Module: ${activeTab}`} onBackToDashboard={() => setActiveTab('dashboard')} />;
    }
  };

  return (
    <>
      {renderContent()}
      
      {selectedRequest && (
        <IndustryRequestActionModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onSuccess={() => {
            setSelectedRequest(null);
            if (typeof refreshData === 'function') refreshData();
          }}
        />
      )}
    </>
  );
};

export default IndustryDashboard;
