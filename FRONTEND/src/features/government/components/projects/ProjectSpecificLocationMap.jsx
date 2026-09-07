import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Building2, AlertCircle, CheckCircle2, ArrowRight, Compass } from 'lucide-react';
import { getMapTileConfig } from '../../utils/mapTileConfig.js';
import { JHARKHAND_DISTRICTS_DICT } from '../../data/jharkhandDistrictsMeta.js';

export const ProjectSpecificLocationMap = ({ project, height = '360px' }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const distKey = String(project?.district || '').toLowerCase().replace(/[-_ ]/g, '');
  const foundDist = Object.values(JHARKHAND_DISTRICTS_DICT).find(
    (d) => d.name.toLowerCase().replace(/[-_ ]/g, '') === distKey
  );
  const baseCoord = foundDist ? { lat: foundDist.lat, lng: foundDist.lng } : { lat: 23.65, lng: 85.55 };

  // Generate realistic offset for problem location vs university work site
  const problemLoc = {
    name: project?.problemOrigin || `${project?.district} Ground Problem Zone`,
    lat: baseCoord.lat - 0.04,
    lng: baseCoord.lng - 0.03
  };

  const workSiteLoc = {
    name: project?.activeWorkSite || `${project?.hei} Campus & Field Testing Site`,
    lat: baseCoord.lat + 0.03,
    lng: baseCoord.lng + 0.02
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [baseCoord.lat, baseCoord.lng],
        zoom: 11,
        minZoom: 8,
        maxZoom: 16,
        zoomControl: false,
        attributionControl: false
      });

      // Clean Basemap via getMapTileConfig
      const tileCfg = getMapTileConfig({ mode: 'light' });
      L.tileLayer(tileCfg.url, {
        subdomains: tileCfg.subdomains || 'abc',
        maxZoom: tileCfg.maxZoom || 19,
        attribution: tileCfg.attribution
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Marker 1: Problem Origin (Red Pin)
      const problemMarkerHtml = `
        <div class="flex flex-col items-center">
          <div class="px-2.5 py-1 rounded-md bg-rose-600 text-white font-bold text-[10px] shadow-md border border-white whitespace-nowrap flex items-center space-x-1">
            <span>📍 Problem Area</span>
          </div>
          <div class="w-2 h-2 rotate-45 bg-rose-600 -mt-1 border-r border-b border-white"></div>
        </div>
      `;

      const problemIcon = L.divIcon({
        html: problemMarkerHtml,
        className: 'problem-marker',
        iconSize: [110, 28],
        iconAnchor: [55, 28]
      });

      const pMarker = L.marker([problemLoc.lat, problemLoc.lng], { icon: problemIcon }).addTo(map);
      pMarker.bindPopup(`
        <div style="font-family: system-ui; padding: 4px; min-width: 180px;">
          <div style="font-weight: 800; font-size: 12px; color: #e11d48; margin-bottom: 2px;">
            🔴 Problem Origin Location
          </div>
          <div style="font-size: 11px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
            ${problemLoc.name}
          </div>
          <div style="font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 4px;">
            District: <strong>${project?.district}</strong>
          </div>
        </div>
      `);

      // Marker 2: Active Work Site (Emerald Pin)
      const workMarkerHtml = `
        <div class="flex flex-col items-center">
          <div class="px-2.5 py-1 rounded-md bg-slate-900 text-white font-bold text-[10px] shadow-md border border-white whitespace-nowrap flex items-center space-x-1">
            <span>🛠️ Active Work Site</span>
          </div>
          <div class="w-2 h-2 rotate-45 bg-slate-900 -mt-1 border-r border-b border-white"></div>
        </div>
      `;

      const workIcon = L.divIcon({
        html: workMarkerHtml,
        className: 'work-marker',
        iconSize: [120, 28],
        iconAnchor: [60, 28]
      });

      const wMarker = L.marker([workSiteLoc.lat, workSiteLoc.lng], { icon: workIcon }).addTo(map);
      wMarker.bindPopup(`
        <div style="font-family: system-ui; padding: 4px; min-width: 180px;">
          <div style="font-weight: 800; font-size: 12px; color: #0f172a; margin-bottom: 2px;">
            🟢 Active Work / Testing Site
          </div>
          <div style="font-size: 11px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
            ${workSiteLoc.name}
          </div>
          <div style="font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 4px;">
            Executing HEI: <strong>${project?.hei}</strong>
          </div>
        </div>
      `);

      // Connect with dashed line
      const latlngs = [
        [problemLoc.lat, problemLoc.lng],
        [workSiteLoc.lat, workSiteLoc.lng]
      ];
      L.polyline(latlngs, { color: '#0f172a', weight: 2, dashArray: '6, 6', opacity: 0.7 }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [project, baseCoord]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs space-y-0 select-none">
      {/* Header */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-slate-700" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Project Location Mapping: Problem Origin & Work Site
          </h4>
        </div>
        <span className="text-[11px] font-bold text-slate-600">{project?.district} District</span>
      </div>

      {/* Leaflet Canvas */}
      <div ref={mapContainerRef} style={{ height }} className="w-full relative z-10" />

      {/* Location Details Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50/80 border-t border-slate-200 text-xs">
        <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider flex items-center space-x-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Problem Origin Location:</span>
          </span>
          <p className="text-xs font-bold text-slate-900 leading-snug">
            {problemLoc.name}
          </p>
          <span className="text-[11px] text-slate-500 block">District: <strong>{project?.district}</strong></span>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active Work Site Location:</span>
          </span>
          <p className="text-xs font-bold text-slate-900 leading-snug">
            {workSiteLoc.name}
          </p>
          <span className="text-[11px] text-slate-500 block">Lead HEI: <strong>{project?.hei}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default ProjectSpecificLocationMap;
