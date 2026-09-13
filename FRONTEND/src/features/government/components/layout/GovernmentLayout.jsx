import React, { useState, useEffect } from 'react';
import { GovernmentHeader } from './GovernmentHeader.jsx';
import { GovernmentSidebar } from './GovernmentSidebar.jsx';
import { GovernmentFooter } from './GovernmentFooter.jsx';
import { GovernmentTabRouter } from './GovernmentTabRouter.jsx';
import { getGovTabTitle } from './govNavConfig.js';
import { OfficialPrintableDossier } from '../common/OfficialPrintableDossier.jsx';
import { governmentDataService } from '../../services/governmentDataService.js';
import { exportAdminDirectoryPdf, exportIndustryDirectoryPdf, exportUniversityDirectoryPdf, exportGenericReportPdf } from '../../services/exportPdfService.js';
import { industryService } from '../../services/industryService.js';
import { universityService } from '../../services/universityService.js';
import { adminService } from '../../services/adminService.js';

export const GovernmentLayout = ({ onLogout }) => {
  const getInitialTab = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab');
      if (urlTab) return urlTab;
      const stored = localStorage.getItem('joharsetu_gov_active_tab');
      if (stored) return stored;
    } catch {
      // fallback
    }
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem('joharsetu_gov_active_tab', tab);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlTab = params.get('tab');
        if (urlTab) setActiveTab(urlTab);
      } catch {
        // ignore
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [sectorTimeframe, setSectorTimeframe] = useState('Quarter');
  const [trendInterval, setTrendInterval] = useState('Monthly');

  const [kpis, setKpis] = useState(() => governmentDataService.getFilteredKpis(selectedDistrict, selectedSector));
  const [triageFeed, setTriageFeed] = useState(() => governmentDataService.getTriageFeed());
  const [sectors, setSectors] = useState(() => governmentDataService.getFilteredSectors(selectedDistrict, sectorTimeframe));
  const [trendData, setTrendData] = useState(() => governmentDataService.getFilteredTrend(selectedDistrict, selectedSector, trendInterval));
  const [heis, setHeis] = useState(() => governmentDataService.getFilteredHeis(selectedDistrict));

  const refreshStats = async () => {
    await governmentDataService.fetchLiveDatabaseStats();
    setKpis(governmentDataService.getFilteredKpis(selectedDistrict, selectedSector));
    setSectors(governmentDataService.getFilteredSectors(selectedDistrict, sectorTimeframe));
    setTrendData(governmentDataService.getFilteredTrend(selectedDistrict, selectedSector, trendInterval));
    setHeis(governmentDataService.getFilteredHeis(selectedDistrict));
  };

  useEffect(() => {
    refreshStats();
    const interval = setInterval(refreshStats, 5000);
    return () => clearInterval(interval);
  }, [selectedDistrict, selectedSector, sectorTimeframe, trendInterval]);

  const handleApproveTriage = async (id) => {
    const updated = await governmentDataService.approveTriage(id);
    setTriageFeed([...updated]);
    setKpis(governmentDataService.getFilteredKpis(selectedDistrict, selectedSector));
  };

  const handleRejectTriage = async (id) => {
    const updated = await governmentDataService.rejectTriage(id);
    setTriageFeed([...updated]);
    setKpis(governmentDataService.getFilteredKpis(selectedDistrict, selectedSector));
  };

  const handleExportPdf = async () => {
    if (activeTab === 'users_admin' || activeTab === 'user_governance') {
      try {
        const res = await adminService.getAdmins({ limit: 200, district: selectedDistrict !== 'All' ? selectedDistrict : undefined });
        exportAdminDirectoryPdf(res?.records || [], { district: selectedDistrict });
      } catch (err) {
        console.error('Failed to fetch admins for export:', err);
        exportAdminDirectoryPdf([], { district: selectedDistrict });
      }
    } else if (['governance_industries', 'industries', 'manage_industries'].includes(activeTab)) {
      try {
        const data = await industryService.getIndustries({ limit: 200, district: selectedDistrict !== 'All' ? selectedDistrict : undefined });
        exportIndustryDirectoryPdf(data?.records || [], { district: selectedDistrict, sector: selectedSector });
      } catch (err) {
        console.error('Failed to export industry directory:', err);
        exportIndustryDirectoryPdf([], { district: selectedDistrict, sector: selectedSector });
      }
    } else if (['governance_universities', 'universities', 'manage_universities', 'heis'].includes(activeTab)) {
      try {
        const data = await universityService.getUniversities({ limit: 200, district: selectedDistrict !== 'All' ? selectedDistrict : undefined });
        exportUniversityDirectoryPdf(data?.records || heis || [], { district: selectedDistrict });
      } catch (err) {
        console.error('Failed to fetch universities for export:', err);
        exportUniversityDirectoryPdf(heis || [], { district: selectedDistrict });
      }
    } else {
      exportGenericReportPdf(getGovTabTitle(activeTab), { district: selectedDistrict });
    }
  };

  const filteredTriageFeed = triageFeed.filter((item) => {
    if (selectedDistrict !== 'All' && item.district.toLowerCase() !== selectedDistrict.toLowerCase()) return false;
    if (selectedSector !== 'All') {
      const secMatch = item.category?.toLowerCase() || '';
      const selMatch = selectedSector.toLowerCase();
      if (!selMatch.includes(secMatch) && !secMatch.includes(selMatch.split(' ')[0])) return false;
    }
    return true;
  });

  return (
    <div className="w-full h-screen bg-white flex flex-col overflow-hidden text-slate-900 font-sans">
      <GovernmentHeader
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        onExportPdf={handleExportPdf}
        notificationCount={7}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="flex-1 flex overflow-hidden relative min-h-0 bg-white">
        <GovernmentSidebar
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onLogout={onLogout}
        />
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
          <main className="flex-1 p-3 md:p-4 overflow-y-auto overflow-x-hidden min-w-0 w-full min-h-0 bg-white">
            <GovernmentTabRouter
              activeTab={activeTab}
              kpis={kpis}
              filteredTriageFeed={filteredTriageFeed}
              sectors={sectors}
              sectorTimeframe={sectorTimeframe}
              setSectorTimeframe={setSectorTimeframe}
              trendData={trendData}
              trendInterval={trendInterval}
              setTrendInterval={setTrendInterval}
              heis={heis}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              setSelectedSector={setSelectedSector}
              handleApproveTriage={handleApproveTriage}
              handleRejectTriage={handleRejectTriage}
              handleSetActiveTab={handleSetActiveTab}
              getTabTitle={getGovTabTitle}
            />
          </main>
          <GovernmentFooter />
        </div>
      </div>
      <OfficialPrintableDossier
        selectedDistrict={selectedDistrict}
        selectedSector={selectedSector}
        kpis={kpis}
        triageFeed={filteredTriageFeed}
      />
    </div>
  );
};

export default GovernmentLayout;
