import React, { useState } from 'react';
import { RefreshCw, Info, Database } from 'lucide-react';
import { GisFilterBar } from './GisFilterBar.jsx';
import { GisMapCanvas } from './GisMapCanvas.jsx';
import { GisDetailedReportModal } from './GisDetailedReportModal.jsx';
import { JHARKHAND_DISTRICTS_DATA } from '../../data/jharkhandGisData.js';

export const GovernmentGisDashboard = () => {
  // Filter States
  const [viewType, setViewType] = useState('heat_map');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Map Layer States
  const [activeLayers, setActiveLayers] = useState({
    districtBoundary: true,
    problemHeatMap: true,
    problemHotspots: true,
    districtLabels: true
  });

  // Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState('22 May 2026, 11:30 AM');

  const handleToggleLayer = (layerKey) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  const handleResetFilters = () => {
    setViewType('heat_map');
    setSelectedCategory('all');
    setSelectedDistrict('All Districts');
    setSelectedSeverity('all');
    setSearchQuery('');
    setActiveLayers({
      districtBoundary: true,
      problemHeatMap: true,
      problemHotspots: true,
      districtLabels: true
    });
  };

  const handleSyncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const now = new Date();
      const formatted = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
      setLastUpdatedTime(formatted);
      setIsSyncing(false);
    }, 600);
  };

  // Find active district data for modal
  const activeDistrictData =
    selectedDistrict && selectedDistrict !== 'All Districts'
      ? Object.values(JHARKHAND_DISTRICTS_DATA).find(
          (d) => d.name.toLowerCase() === selectedDistrict.toLowerCase()
        ) || JHARKHAND_DISTRICTS_DATA.ranchi
      : JHARKHAND_DISTRICTS_DATA.ranchi;

  return (
    <div className="w-full space-y-3 pb-4">
      {/* 1. Top Filter Bar */}
      <GisFilterBar
        viewType={viewType}
        setViewType={setViewType}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedSeverity={selectedSeverity}
        setSelectedSeverity={setSelectedSeverity}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onResetFilters={handleResetFilters}
      />

      {/* 2. Interactive Leaflet GIS Map Canvas with Overlays */}
      <GisMapCanvas
        viewType={viewType}
        selectedCategory={selectedCategory}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={(dist) => setSelectedDistrict(dist)}
        selectedSeverity={selectedSeverity}
        activeLayers={activeLayers}
        onToggleLayer={handleToggleLayer}
        onOpenDetailedReport={() => setIsReportModalOpen(true)}
      />

      {/* 3. Bottom Information & Live Timestamp Source Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2 text-xs text-slate-500 font-medium gap-2">
        <div className="flex items-center space-x-2">
          <span>Source: Department Records | Last Updated: {lastUpdatedTime}</span>
          <button
            onClick={handleSyncData}
            disabled={isSyncing}
            className="p-1 hover:text-slate-800 rounded transition-colors cursor-pointer"
            title="Refresh Live GIS Data"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : 'text-slate-400'}`}
            />
          </button>
        </div>

        <div className="flex items-center space-x-4 text-[11px] text-slate-400">
          <span>State: Jharkhand (24 Districts)</span>
          <span>Coverage: 100% Geo-Spatial Boundaries</span>
        </div>
      </div>

      {/* 4. Deep Analytical Report Modal */}
      <GisDetailedReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        districtData={activeDistrictData}
      />
    </div>
  );
};

export default GovernmentGisDashboard;
