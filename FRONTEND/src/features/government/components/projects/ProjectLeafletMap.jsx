import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Radio,
  Building2,
  Activity,
  Layers,
  MapPin,
  Maximize2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { JHARKHAND_DISTRICTS_GEODATA } from '../../data/projectsSolutionsData.js';

export const ProjectLeafletMap = ({
  selectedDistrict = 'All Districts',
  onSelectDistrict,
  onSelectProject,
  height = '420px'
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const [activeNode, setActiveNode] = useState(JHARKHAND_DISTRICTS_GEODATA[0]);
  const [filterType, setFilterType] = useState('all');

  const JHARKHAND_CENTER = [23.65, 85.55];
  const DEFAULT_ZOOM = 7.5;

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

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    JHARKHAND_DISTRICTS_GEODATA.forEach((district) => {
      const isWarning = district.status === 'Warning Sync';
      const isSelected = selectedDistrict === district.name || activeNode?.name === district.name;

      if (filterType === 'warning' && !isWarning) return;
      if (filterType === 'active' && isWarning) return;

      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${isSelected ? `<div class="absolute w-8 h-8 rounded-full ${isWarning ? 'bg-red-500/30' : 'bg-emerald-500/30'} animate-ping"></div>` : ''}
          <div class="w-6 h-6 rounded-full ${isWarning ? 'bg-rose-600' : 'bg-slate-900'} text-white flex items-center justify-center font-bold text-[10px] shadow-md border-2 border-white">
            ${district.totalSensors}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([district.lat, district.lng], { icon: customIcon });

      marker.on('click', () => {
        setActiveNode(district);
        if (onSelectDistrict) onSelectDistrict(district.name);
      });

      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; min-width: 180px; padding: 4px;">
          <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 2px;">
            ${district.name} District
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            ${district.leadHei}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; padding: 4px 0; border-top: 1px solid #e2e8f0;">
            <span>Active Projects:</span>
            <strong style="color: #0f172a;">${district.activeProjects}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; padding: 4px 0; border-top: 1px solid #e2e8f0;">
            <span>IoT Sensors:</span>
            <strong style="color: #0f172a;">${district.totalSensors} Nodes</strong>
          </div>
          <div style="margin-top: 6px; font-size: 10px; font-weight: 700; color: ${isWarning ? '#b91c1c' : '#047857'}; background: ${isWarning ? '#fef2f2' : '#ecfdf5'}; padding: 2px 6px; border-radius: 4px; text-align: center;">
            Status: ${district.status} (${district.complianceRate})
          </div>
        </div>
      `);

      markersLayerRef.current.addLayer(marker);
    });
  }, [selectedDistrict, activeNode, filterType, onSelectDistrict]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden select-none">
      {/* Map Control Toolbar */}
      <div className="p-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Jharkhand Live Telemetry Map
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Real-time sensor nodes in 12 monitoring zones (Leaflet GIS)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {['all', 'active', 'warning'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilterType(f)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer capitalize ${
                filterType === f
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {f} Nodes
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas & Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-8 relative">
          <div ref={mapContainerRef} style={{ height }} className="w-full z-10" />

          {/* Map Floating Indicator */}
          <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] shadow-sm flex items-center space-x-3">
            <span className="flex items-center space-x-1 font-bold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-slate-900 inline-block" />
              <span>Normal Node</span>
            </span>
            <span className="flex items-center space-x-1 font-bold text-rose-700">
              <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
              <span>Warning Node</span>
            </span>
          </div>
        </div>

        {/* Right Info Box */}
        <div className="lg:col-span-4 p-4 bg-slate-50/60 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between space-y-3 text-xs">
          {activeNode ? (
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Selected District Zone</span>
                <h4 className="text-sm font-bold text-slate-900">{activeNode.name}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{activeNode.leadHei}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Projects</span>
                  <span className="text-sm font-black text-slate-900">{activeNode.activeProjects}</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Sensors</span>
                  <span className="text-sm font-black text-slate-900">{activeNode.totalSensors}</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Uptime & Compliance:</span>
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="text-emerald-700">{activeNode.complianceRate} Compliance</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100">{activeNode.status}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              Click a marker on the map to see district project details.
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              if (onSelectProject && activeNode) onSelectProject(activeNode);
            }}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1 shadow-2xs"
          >
            <span>Filter Projects in {activeNode?.name || 'District'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectLeafletMap;
