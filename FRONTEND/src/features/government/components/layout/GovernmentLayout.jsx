import React, { useState, useEffect } from 'react';
import { GovernmentHeader } from './GovernmentHeader.jsx';
import { GovernmentSidebar } from './GovernmentSidebar.jsx';
import { GovernmentFooter } from './GovernmentFooter.jsx';
import { GovernmentOverview } from '../overview/GovernmentOverview.jsx';
import { AITriageDashboard } from '../triage/AITriageDashboard.jsx';
import { ComingSoonPanel } from '../common/ComingSoonPanel.jsx';
import { HeiHubPanel } from '../heis/heiHubPanel.jsx';
import { GovernmentGisDashboard } from '../gis/GovernmentGisDashboard.jsx';
import { governmentDataService } from '../../services/governmentDataService.js';

export const GovernmentLayout = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Reactive Global Filters
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [sectorTimeframe, setSectorTimeframe] = useState('This Month');
  const [trendInterval, setTrendInterval] = useState('Monthly');

  // Reactive State Data
  const [kpis, setKpis] = useState(governmentDataService.getFilteredKpis(selectedDistrict, selectedSector));
  const [triageFeed, setTriageFeed] = useState(governmentDataService.getTriageFeed());
  const [sectors, setSectors] = useState(governmentDataService.getFilteredSectors(selectedDistrict, sectorTimeframe));
  const [trendData, setTrendData] = useState(governmentDataService.getFilteredTrend(selectedDistrict, selectedSector, trendInterval));
  const [heis, setHeis] = useState(governmentDataService.getFilteredHeis(selectedDistrict));

  // Automatically recalculate data whenever filters or timeframes change
  useEffect(() => {
    setKpis(governmentDataService.getFilteredKpis(selectedDistrict, selectedSector));
    setSectors(governmentDataService.getFilteredSectors(selectedDistrict, sectorTimeframe));
    setTrendData(governmentDataService.getFilteredTrend(selectedDistrict, selectedSector, trendInterval));
    setHeis(governmentDataService.getFilteredHeis(selectedDistrict));
  }, [selectedDistrict, selectedSector, sectorTimeframe, trendInterval]);

  const handleApproveTriage = (id) => {
    const updated = governmentDataService.approveTriage(id);
    setTriageFeed(updated);
    setKpis(governmentDataService.getFilteredKpis(selectedDistrict, selectedSector));
  };

  const handleRejectTriage = (id) => {
    const updated = governmentDataService.rejectTriage(id);
    setTriageFeed(updated);
    setKpis(governmentDataService.getFilteredKpis(selectedDistrict, selectedSector));
  };

  const handleExportPdf = () => {
    window.print();
  };

  // Filtered Triage Feed by Selected District & Sector
  const filteredTriageFeed = triageFeed.filter((item) => {
    if (selectedDistrict !== 'All' && item.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
      return false;
    }
    if (selectedSector !== 'All') {
      const secMatch = item.category?.toLowerCase();
      const selMatch = selectedSector.toLowerCase();
      if (!selMatch.includes(secMatch) && !secMatch.includes(selMatch.split(' ')[0])) {
        return false;
      }
    }
    return true;
  });

  const getTabTitle = (tab) => {
    switch (tab) {
      case 'triage': return 'AI Problem Triage Queue';
      case 'heis': return 'HEI Hub & University Directory';
      case 'csr': return 'CSR Grants & Corporate Partnerships';
      case 'gis': return 'Jharkhand Geospatial Information System (GIS)';
      case 'user_governance':
      case 'users_admin': return 'User Admin & Departmental Governance';
      case 'users_audit': return 'System & Compliance Audit Trail';
      case 'reports':
      case 'reports_overview': return 'Report Overview';
      case 'reports_quick': return 'Quick Exports';
      case 'reports_custom': return 'Custom Reports';
      case 'reports_scheduled': return 'Scheduled Reports';
      case 'reports_history': return 'Report History';
      case 'settings': return 'Government Portal Settings & AI Controls';
      default: return 'Innovation Module';
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col h-screen overflow-hidden text-slate-900 font-sans">
      {/* 1. Top Fixed Government Header with real-time District & Sector Selectors */}
      <GovernmentHeader
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={(dist) => setSelectedDistrict(dist)}
        selectedSector={selectedSector}
        setSelectedSector={(sec) => setSelectedSector(sec)}
        onExportPdf={handleExportPdf}
        notificationCount={triageFeed.filter(x => x.status === 'PENDING').length + 7}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* 2. Body Container with Sidebar and Content Area */}
      <div className="flex-1 flex overflow-hidden relative min-h-0 bg-white">
        {/* Navigation Sidebar */}
        <GovernmentSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onLogout={onLogout}
        />

        {/* Content Area with Independent Scrolling & Bottom Footer */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
          <main className="flex-1 p-2.5 md:p-3.5 overflow-y-auto min-h-0 bg-white">
            {activeTab === 'overview' ? (
              <GovernmentOverview
                kpis={kpis}
                triageFeed={filteredTriageFeed}
                sectors={sectors}
                sectorTimeframe={sectorTimeframe}
                onChangeSectorTimeframe={(tf) => setSectorTimeframe(tf)}
                trendData={trendData}
                trendInterval={trendInterval}
                onChangeTrendInterval={(interval) => setTrendInterval(interval)}
                heis={heis}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={(dist) => setSelectedDistrict(dist)}
                onSelectSector={(sec) => setSelectedSector(sec)}
                onApproveTriage={handleApproveTriage}
                onRejectTriage={handleRejectTriage}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            ) : activeTab === 'triage' || activeTab === 'ai-triage' ? (
              <AITriageDashboard />
            ) : activeTab === 'heis' ? (
              <HeiHubPanel
                selectedDistrict={selectedDistrict}
                onSelectDistrict={(dist) => setSelectedDistrict(dist)}
              />
            ) : activeTab === 'gis' ? (
              <GovernmentGisDashboard />
            ) : (
              <ComingSoonPanel
                title={getTabTitle(activeTab)}
                onBackToOverview={() => setActiveTab('overview')}
              />
            )}
          </main>

          {/* Fixed Bottom Footer */}
          <GovernmentFooter />
        </div>
      </div>
    </div>
  );
};

export default GovernmentLayout;
