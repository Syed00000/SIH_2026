import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Search,
  Building2,
  AlertCircle,
  CheckCircle2,
  Layers,
  ArrowRight,
  RotateCcw,
  Users,
  Compass
} from 'lucide-react';
import { JHARKHAND_24_DISTRICTS } from '../../data/jharkhand24DistrictsData.js';

export const ProjectLeafletMap = ({
  selectedDistrict = 'All Districts',
  onSelectDistrict,
  onSelectProject,
  height = '440px'
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [activeDistrict, setActiveDistrict] = useState(() => {
    return JHARKHAND_24_DISTRICTS.find((d) => d.name === selectedDistrict) || JHARKHAND_24_DISTRICTS[0];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState('all');

  const JHARKHAND_CENTER = [23.65, 85.55];
  const DEFAULT_ZOOM = 7.4;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: JHARKHAND_CENTER,
        zoom: DEFAULT_ZOOM,
        minZoom: 6.5,
        maxZoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Positron clean light tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Custom Zoom Control top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Filter districts
  const filteredDistricts = JHARKHAND_24_DISTRICTS.filter((dist) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      dist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dist.primaryProblem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dist.affectedBlocks.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dist.leadHei.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity =
      selectedSeverityFilter === 'all' ||
      (selectedSeverityFilter === 'critical' && dist.severity === 'Critical Need') ||
      (selectedSeverityFilter === 'high' && dist.severity === 'High Need') ||
      (selectedSeverityFilter === 'moderate' && dist.severity === 'Moderate Need');

    return matchesSearch && matchesSeverity;
  });

  // Update Map Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    filteredDistricts.forEach((dist) => {
      const isSelected = activeDistrict?.id === dist.id;
      const isCritical = dist.severity === 'Critical Need';
      const isHigh = dist.severity === 'High Need';

      const pinBg = isCritical ? 'bg-rose-600' : isHigh ? 'bg-amber-600' : 'bg-slate-900';

      const markerHtml = `
        <div class="relative flex flex-col items-center cursor-pointer group">
          ${isSelected ? `<div class="absolute -top-1 w-8 h-8 rounded-full ${isCritical ? 'bg-rose-500/30' : 'bg-slate-900/20'} animate-ping"></div>` : ''}
          <div class="px-2 py-0.5 rounded-md ${pinBg} text-white font-bold text-[10px] shadow-md border border-white flex items-center space-x-1 whitespace-nowrap">
            <span>${dist.name}</span>
          </div>
          <div class="w-1.5 h-1.5 rotate-45 ${pinBg} -mt-0.5 border-r border-b border-white"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-district-marker',
        iconSize: [80, 24],
        iconAnchor: [40, 24]
      });

      const marker = L.marker([dist.lat, dist.lng], { icon: customIcon });

      marker.on('click', () => {
        setActiveDistrict(dist);
        if (onSelectDistrict) onSelectDistrict(dist.name);
        mapInstanceRef.current.panTo([dist.lat, dist.lng], { animate: true, duration: 0.6 });
      });

      markersLayerRef.current.addLayer(marker);
    });
  }, [filteredDistricts, activeDistrict, onSelectDistrict]);

  const handleSelectDistrictCard = (dist) => {
    setActiveDistrict(dist);
    if (onSelectDistrict) onSelectDistrict(dist.name);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([dist.lat, dist.lng], { animate: true, duration: 0.6 });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden select-none">
      {/* Top Map Header & Search Toolbar */}
      <div className="p-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Jharkhand 24 Districts Problem Map
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Geographical distribution of local ground challenges & university solutions
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search district, area or problem..."
              className="pl-7 pr-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-800 w-44"
            />
          </div>

          <div className="flex items-center space-x-1 bg-white p-0.5 rounded-lg border border-slate-200">
            {[
              { id: 'all', label: 'All 24' },
              { id: 'critical', label: 'Critical' },
              { id: 'high', label: 'High' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedSeverityFilter(tab.id)}
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors cursor-pointer ${
                  selectedSeverityFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Canvas & Detailed Problem Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Map View */}
        <div className="lg:col-span-7 relative">
          <div ref={mapContainerRef} style={{ height }} className="w-full z-10" />

          {/* Floating Map Legend */}
          <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] shadow-sm flex items-center space-x-3">
            <span className="flex items-center space-x-1 font-bold text-rose-700">
              <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
              <span>Critical Need</span>
            </span>
            <span className="flex items-center space-x-1 font-bold text-amber-700">
              <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" />
              <span>High Need</span>
            </span>
            <span className="flex items-center space-x-1 font-bold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-slate-900 inline-block" />
              <span>Moderate</span>
            </span>
          </div>
        </div>

        {/* Right District Problem & Solution Inspector */}
        <div className="lg:col-span-5 p-4 bg-slate-50/70 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between space-y-3.5 text-xs overflow-y-auto max-h-[440px]">
          {activeDistrict ? (
            <div className="space-y-3">
              {/* Header Box */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2.5">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-black text-slate-900">{activeDistrict.name} District</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${activeDistrict.severityColor}`}>
                      {activeDistrict.severity}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">HQ: {activeDistrict.headquarters} • Area: <strong>{activeDistrict.areaSqKm}</strong></span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 shrink-0">
                  Pop: {activeDistrict.population}
                </span>
              </div>

              {/* Problem Description Box */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5 shadow-2xs">
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Ground Problem in this District:</span>
                </span>
                <p className="text-xs text-slate-900 font-semibold leading-relaxed">
                  {activeDistrict.primaryProblem}
                </p>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <strong className="text-slate-700">Affected Local Areas / Blocks:</strong> {activeDistrict.affectedBlocks}
                </div>
              </div>

              {/* Working Solution & Academic Partner */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1.5 text-emerald-950">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Active Innovation & University Solution:</span>
                </span>
                <p className="text-xs text-emerald-900 font-semibold leading-relaxed">
                  {activeDistrict.currentSolution}
                </p>
                <div className="text-[11px] text-emerald-800 pt-1 border-t border-emerald-200/60 flex items-center justify-between">
                  <span>Lead HEI: <strong>{activeDistrict.leadHei}</strong></span>
                  <span className="font-bold">{activeDistrict.activeProjectsCount} Projects Active</span>
                </div>
              </div>

              {/* Quick District Grid Switcher */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Jump to District:</span>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto p-1 bg-white rounded-lg border border-slate-200">
                  {JHARKHAND_24_DISTRICTS.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleSelectDistrictCard(d)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                        activeDistrict.id === d.id
                          ? 'bg-slate-900 text-white font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              Select a district on the map to see problems and solutions.
            </div>
          )}

          {/* Filter Trigger Button */}
          <button
            type="button"
            onClick={() => {
              if (onSelectProject && activeDistrict) onSelectProject(activeDistrict);
            }}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
          >
            <span>View All Projects in {activeDistrict?.name || 'District'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectLeafletMap;
