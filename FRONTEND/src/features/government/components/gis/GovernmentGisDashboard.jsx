import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, MapPin } from 'lucide-react';
import { GisFilterBar } from './GisFilterBar.jsx';
import { GisMapCanvas } from './GisMapCanvas.jsx';
import { GisDetailedReportModal } from './GisDetailedReportModal.jsx';
import { GisProblemDetailModal } from './GisProblemDetailModal.jsx';
import apiClient from '../../../../infrastructure/api/client.js';
import { JHARKHAND_DISTRICTS_DICT } from '../../data/jharkhandDistrictsMeta.js';

export const GovernmentGisDashboard = () => {
  const [viewType, setViewType] = useState('heat_map');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [activeLayers, setActiveLayers] = useState({
    districtBoundary: true,
    problemMarkers: true,
    problemHeatMap: true,
    districtLabels: true
  });

  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedProblemDetail, setSelectedProblemDetail] = useState(null);
  const [lastUpdatedTime, setLastUpdatedTime] = useState('');

  const fetchGisData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (selectedDistrict && selectedDistrict !== 'All Districts') params.district = selectedDistrict;
      if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedSeverity && selectedSeverity !== 'all') params.severity = selectedSeverity;

      const res = await apiClient.get('admin/gis/problems', { params });
      const problemsList = Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.data) ? res.data.data : []);
      const statsObj = res?.stats || res?.data?.stats || {};
      setProblems(problemsList);
      setStats(statsObj);
      const now = new Date();
      setLastUpdatedTime(
        now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
        `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
      );
    } catch (err) {
      console.warn('Could not fetch GIS problem data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDistrict, selectedCategory, selectedSeverity]);

  useEffect(() => {
    fetchGisData();
  }, [fetchGisData]);

  const handleToggleLayer = (key) => {
    setActiveLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleResetFilters = () => {
    setViewType('heat_map');
    setSelectedCategory('all');
    setSelectedDistrict('All Districts');
    setSelectedSeverity('all');
    setSearchQuery('');
    setActiveLayers({
      districtBoundary: true,
      problemMarkers: true,
      problemHeatMap: true,
      districtLabels: true
    });
  };

  const activeDistrictMeta =
    selectedDistrict && selectedDistrict !== 'All Districts'
      ? Object.values(JHARKHAND_DISTRICTS_DICT).find(
          (d) => d.name.toLowerCase() === selectedDistrict.toLowerCase()
        ) || { name: selectedDistrict }
      : { name: 'Jharkhand State' };

  return (
    <div className="w-full space-y-3 pb-4">
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
        onOpenDetailedReport={() => setIsReportModalOpen(true)}
      />

      <GisMapCanvas
        problems={problems}
        stats={stats}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={(dist) => setSelectedDistrict(dist)}
        viewType={viewType}
        activeLayers={activeLayers}
        onToggleLayer={handleToggleLayer}
        onOpenDetailedReport={() => setIsReportModalOpen(true)}
        onViewProblemDetails={(p) => setSelectedProblemDetail(p)}
      />

      {/* Footer Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2 text-xs text-slate-500 font-medium gap-2">
        <div className="flex items-center space-x-2">
          <span>Official GIS Spatial Telemetry | Last Updated: {lastUpdatedTime || 'Synchronized'}</span>
          <button
            onClick={fetchGisData}
            disabled={isLoading}
            className="p-1 hover:text-slate-800 rounded transition-colors cursor-pointer"
            title="Refresh Live GIS Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#007A61]' : 'text-slate-400'}`} />
          </button>
        </div>

        <div className="flex items-center space-x-4 text-[11px] text-slate-400">
          <span>State: Jharkhand (24 Districts)</span>
          <span>Coverage: 100% Geo-Spatial Boundaries</span>
        </div>
      </div>

      <GisDetailedReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        districtData={activeDistrictMeta}
        problems={problems}
        stats={stats}
      />

      <GisProblemDetailModal
        problem={selectedProblemDetail}
        onClose={() => setSelectedProblemDetail(null)}
      />
    </div>
  );
};

export default GovernmentGisDashboard;
