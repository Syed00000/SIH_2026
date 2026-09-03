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

export const IndustryDashboard = ({ activeTab, user }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const {
    loading,
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

  // If the user selects a specific tab from the sidebar (other than dashboard),
  // we could isolate that panel. But since the mockup shows a massive dashboard,
  // we will render the grid for "dashboard" and isolate specific ones if clicked.

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-8 gap-4">
            <Panel1_Overview user={user} />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-8 gap-4">
            <Panel2_Profile />
            <Panel3_Capabilities data={capabilitiesData} />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-8 gap-4">
            <Panel4_Collaboration data={collaborationRequests} onViewRequest={setSelectedRequest} />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <Panel5_Projects data={projects} />
            <Panel6_Funding data={fundingData} />
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
            <Panel14_Impact />
            <Panel15_Settings />
            <Panel16_QuickActions />
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'profile': return <div className="grid grid-cols-1 xl:grid-cols-4 gap-4"><Panel2_Profile /></div>;
      case 'capabilities': return <div className="grid grid-cols-1 xl:grid-cols-4 gap-4"><Panel3_Capabilities data={capabilitiesData} /></div>;
      case 'collaboration': return <div className="grid grid-cols-1 xl:grid-cols-8 gap-4"><Panel4_Collaboration data={collaborationRequests} onViewRequest={setSelectedRequest} /></div>;
      case 'projects': return <div className="grid grid-cols-1 xl:grid-cols-6 gap-4"><Panel5_Projects data={projects} /></div>;
      case 'funding': return <div className="grid grid-cols-1 xl:grid-cols-6 gap-4"><Panel6_Funding data={fundingData} /></div>;
      case 'testing': return <div className="grid grid-cols-1 xl:grid-cols-6 gap-4"><Panel7_Labs data={labsData} /></div>;
      case 'experts': return <div className="grid grid-cols-1 xl:grid-cols-6 gap-4"><Panel8_Experts data={expertsData} /></div>;
      case 'documents': return <div className="grid grid-cols-1 xl:grid-cols-6 gap-4"><Panel9_Documents data={documentsData} /></div>;
      case 'ip_transfer': return <div className="grid grid-cols-1 xl:grid-cols-6 gap-4"><Panel10_IP /></div>;
      case 'internships': return <div className="grid grid-cols-1 xl:grid-cols-6 gap-4"><Panel11_Internships data={internshipsData} /></div>;
      case 'communication': return <div className="grid grid-cols-1 xl:grid-cols-6 gap-4"><Panel12_Communication /></div>;
      case 'reports':
      case 'impact': return <div className="grid grid-cols-1 xl:grid-cols-6 gap-4"><Panel14_Impact /></div>;
      case 'settings': return <div className="grid grid-cols-1 xl:grid-cols-4 gap-4"><Panel15_Settings /></div>;
      default:
        return (
          <div className="bg-white p-6 rounded-xl shadow-2xs text-center text-slate-500">
            Work in progress for section: {activeTab}
          </div>
        );
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
