import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  JHARKHAND_STATE_GEOJSON,
  JHARKHAND_DISTRICTS_DATA
} from '../../data/jharkhandGisData.js';
import {
  Plus,
  Minus,
  Home,
  Layers,
  MapPin,
  Compass,
  Radio,
  Info
} from 'lucide-react';

export const JharkhandGisHeatmap = ({ selectedDistrict = 'All', onSelectDistrict }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const hotspotsLayerRef = useRef(null);
  const baseTileLayerRef = useRef(null);

  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [cursorCoords, setCursorCoords] = useState({ lat: '23.6500', lng: '85.5500' });
  const [basemapMode, setBasemapMode] = useState('canvas'); // 'canvas' | 'satellite' | 'topo'
  const [showHotspots, setShowHotspots] = useState(true);
  const [showLayersDropdown, setShowLayersDropdown] = useState(false);

  const JHARKHAND_CENTER = [23.65, 85.55];
  const DEFAULT_ZOOM = 7.4;

  // Compute District Color based on score
  const getDistrictColor = useCallback((distId) => {
    const data = JHARKHAND_DISTRICTS_DATA[distId];
    if (!data) return '#86efac';

    const score = data.overallScore || 50;
    if (score >= 81) return '#ef4444'; // Very High - Red
    if (score >= 61) return '#fb923c'; // High - Orange
    if (score >= 41) return '#fde047'; // Moderate - Warm Yellow
    if (score >= 21) return '#86efac'; // Low - Light Green
    return '#22c55e'; // Very Low - Emerald Green
  }, []);

  // Update base tile layer on mode change
  const updateBasemap = (mode) => {
    if (!mapInstanceRef.current) return;
    setBasemapMode(mode);

    if (baseTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(baseTileLayerRef.current);
    }

    let url = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
    let subdomains = 'abcd';
    let maxZoom = 19;

    if (mode === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      subdomains = 'abc';
      maxZoom = 18;
    } else if (mode === 'topo') {
      url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png';
      subdomains = 'abcd';
      maxZoom = 19;
    }

    const newTileLayer = L.tileLayer(url, { subdomains, maxZoom, attribution: '' });
    newTileLayer.addTo(mapInstanceRef.current);
    newTileLayer.bringToBack();
    baseTileLayerRef.current = newTileLayer;
    setShowLayersDropdown(false);
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: JHARKHAND_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: false,
        minZoom: 6.5,
        maxZoom: 13
      });

      // Default Canvas Tile Layer
      const baseTile = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);
      baseTileLayerRef.current = baseTile;

      // Track mouse coordinates for GIS HUD safely
      map.on('mousemove', (e) => {
        if (e && e.latlng && typeof e.latlng.lat === 'number' && typeof e.latlng.lng === 'number') {
          setCursorCoords({
            lat: e.latlng.lat.toFixed(4),
            lng: e.latlng.lng.toFixed(4)
          });
        }
      });

      // Add High-Precision GeoJSON layer
      const geoLayer = L.geoJSON(JHARKHAND_STATE_GEOJSON, {
        style: (feature) => {
          const distId = feature.id || feature.properties?.id;
          const distData = JHARKHAND_DISTRICTS_DATA[distId] || {};
          const isSelected =
            selectedDistrict &&
            selectedDistrict !== 'All' &&
            distData.name?.toLowerCase() === selectedDistrict.toLowerCase();

          return {
            fillColor: getDistrictColor(distId),
            weight: isSelected ? 2.8 : 1.2,
            opacity: 1,
            color: isSelected ? '#0f172a' : '#ffffff',
            dashArray: isSelected ? '' : '2',
            fillOpacity: isSelected ? 0.95 : 0.82
          };
        },
        onEachFeature: (feature, layer) => {
          const distId = feature.id || feature.properties?.id;
          const distData = JHARKHAND_DISTRICTS_DATA[distId] || { name: feature.properties?.name || distId };

          layer.on({
            mouseover: (e) => {
              const l = e.target;
              l.setStyle({
                weight: 2.8,
                color: '#0f172a',
                fillOpacity: 0.96
              });
              setHoveredDistrict({ ...distData, distId });
            },
            mouseout: (e) => {
              geoLayer.resetStyle(e.target);
              setHoveredDistrict(null);
            },
            click: () => {
              if (onSelectDistrict && distData.name) {
                onSelectDistrict(distData.name);
              }
            }
          });

          // Text label for district center
          if (distData.name && Array.isArray(distData.center) && distData.center.length === 2) {
            const labelIcon = L.divIcon({
              className: 'district-gis-label',
              html: `<div style="font-size: 9.5px; font-weight: 800; color: #0f172a; text-shadow: 0 1px 3px rgba(255,255,255,0.9), 0 -1px 3px rgba(255,255,255,0.9); pointer-events: none; transform: translate(-50%, -50%); text-align: center; white-space: nowrap;">${distData.name}</div>`,
              iconSize: [60, 16],
              iconAnchor: [30, 8]
            });
            L.marker(distData.center, { icon: labelIcon, interactive: false }).addTo(map);
          }
        }
      }).addTo(map);

      geoJsonLayerRef.current = geoLayer;

      // Extract hotspots safely from JHARKHAND_DISTRICTS_DATA
      const hotspotsGroup = L.layerGroup();
      Object.values(JHARKHAND_DISTRICTS_DATA || {}).forEach((dist) => {
        (dist.criticalHotspots || []).forEach((spot) => {
          if (typeof spot.lat === 'number' && typeof spot.lng === 'number') {
            const spotColor =
              spot.severity === 'Very High'
                ? '#dc2626'
                : spot.severity === 'High'
                ? '#ea580c'
                : '#eab308';

            const pinIcon = L.divIcon({
              className: 'gis-hotspot-marker',
              html: `
                <div style="position: relative; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center;">
                  <span style="position: absolute; width: 14px; height: 14px; border-radius: 9999px; background-color: ${spotColor}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
                  <span style="position: relative; width: 7px; height: 7px; border-radius: 9999px; background-color: ${spotColor}; border: 1.5px solid #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></span>
                </div>
              `,
              iconSize: [14, 14],
              iconAnchor: [7, 7]
            });

            const marker = L.marker([spot.lat, spot.lng], { icon: pinIcon });
            marker.bindTooltip(
              `<strong>${spot.name}</strong><br/><span style="font-size:10px; color:#64748b;">${dist.name} • ${spot.category || 'Issue'}</span>`,
              { direction: 'top', offset: [0, -6] }
            );
            hotspotsGroup.addLayer(marker);
          }
        });
      });

      hotspotsGroup.addTo(map);
      hotspotsLayerRef.current = hotspotsGroup;

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update styles if selected district changes
  useEffect(() => {
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.eachLayer((layer) => {
        const feature = layer.feature;
        const distId = feature?.id || feature?.properties?.id;
        const distData = JHARKHAND_DISTRICTS_DATA[distId] || {};
        const isSelected =
          selectedDistrict &&
          selectedDistrict !== 'All' &&
          distData.name?.toLowerCase() === selectedDistrict.toLowerCase();

        layer.setStyle({
          fillColor: getDistrictColor(distId),
          weight: isSelected ? 2.8 : 1.2,
          opacity: 1,
          color: isSelected ? '#0f172a' : '#ffffff',
          fillOpacity: isSelected ? 0.95 : 0.82
        });
      });
    }
  }, [selectedDistrict, getDistrictColor]);

  // Toggle Hotspots visibility
  useEffect(() => {
    if (!mapInstanceRef.current || !hotspotsLayerRef.current) return;
    if (showHotspots) {
      if (!mapInstanceRef.current.hasLayer(hotspotsLayerRef.current)) {
        hotspotsLayerRef.current.addTo(mapInstanceRef.current);
      }
    } else {
      if (mapInstanceRef.current.hasLayer(hotspotsLayerRef.current)) {
        mapInstanceRef.current.removeLayer(hotspotsLayerRef.current);
      }
    }
  }, [showHotspots]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(JHARKHAND_CENTER, DEFAULT_ZOOM);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 hover:border-slate-300/90 rounded-xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_-6px_rgba(15,23,42,0.07)] relative flex flex-col h-full min-h-[410px] transition-all duration-300">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-slate-700" />
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Jharkhand Geospatial Heatmap
            </h3>
            <p className="text-[10px] text-slate-400 font-medium leading-tight">
              Spatial density distribution across 24 districts (EPSG:4326)
            </p>
          </div>
        </div>

        {/* Professional GIS Controls */}
        <div className="flex items-center space-x-1.5">
          {/* Basemap Segmented Toggle */}
          <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200/70 text-[10px] font-semibold">
            <button
              type="button"
              onClick={() => updateBasemap('canvas')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                basemapMode === 'canvas'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Canvas
            </button>
            <button
              type="button"
              onClick={() => updateBasemap('satellite')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                basemapMode === 'satellite'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => updateBasemap('topo')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                basemapMode === 'topo'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Terrain
            </button>
          </div>

          {/* Hotspots Toggle */}
          <button
            type="button"
            onClick={() => setShowHotspots(!showHotspots)}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              showHotspots
                ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                showHotspots ? 'bg-red-400 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span>Hotspots</span>
          </button>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="relative flex-1 rounded-xl overflow-hidden border border-slate-100 bg-[#f8fafc] min-h-[320px]">
        <div ref={mapContainerRef} className="w-full h-full min-h-[320px]" />

        {/* Custom Map Floating Controls */}
        <div className="absolute top-3 left-3 z-[400] flex flex-col space-y-1 bg-white/95 backdrop-blur-xs p-1 rounded-xl border border-slate-200 shadow-xs">
          <button
            onClick={handleZoomIn}
            className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-lg text-xs transition-colors cursor-pointer"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-lg text-xs transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <div className="h-px bg-slate-200 my-0.5" />
          <button
            onClick={handleResetView}
            className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-lg text-xs transition-colors cursor-pointer"
            title="Reset Home View"
          >
            <Home className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Interactive District Hover Details Popup */}
        {hoveredDistrict && (
          <div className="absolute top-3 right-3 z-[400] bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1.5 min-w-[185px] animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-1">
              <span className="font-bold text-sm text-white flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                {hoveredDistrict.name}
              </span>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded border"
                style={{
                  backgroundColor: `${hoveredDistrict.riskColor || '#eab308'}20`,
                  color: hoveredDistrict.riskColor || '#eab308',
                  borderColor: `${hoveredDistrict.riskColor || '#eab308'}40`
                }}
              >
                {hoveredDistrict.riskLevel || 'Moderate'}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>Total Problems:</span>
              <span className="font-bold text-white">
                {(hoveredDistrict.totalProblems || 1200).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>Resolved:</span>
              <span className="font-bold text-emerald-400">
                {(hoveredDistrict.resolvedProblems || 1050).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>Active HEIs:</span>
              <span className="font-bold text-purple-300">
                {hoveredDistrict.activeHeis || 12}
              </span>
            </div>
            <div className="text-[9.5px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between items-center">
              <span>Population: {hoveredDistrict.demographics?.population || '2.4M'}</span>
              <span className="text-blue-400 font-semibold cursor-pointer">Click to filter</span>
            </div>
          </div>
        )}

        {/* GIS Density Legend on bottom-left */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 shadow-xs text-[10px] space-y-1">
          <span className="font-bold text-slate-700 block text-[9.5px] uppercase tracking-wider mb-1">
            Problem Density
          </span>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#ef4444]" />
            <span className="text-slate-600 font-medium">Very High (81-100)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#fb923c]" />
            <span className="text-slate-600 font-medium">High (61-80)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#fde047]" />
            <span className="text-slate-600 font-medium">Moderate (41-60)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#86efac]" />
            <span className="text-slate-600 font-medium">Low (21-40)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#22c55e]" />
            <span className="text-slate-600 font-medium">Very Low (0-20)</span>
          </div>
        </div>

        {/* GIS Scale & Coordinates Bar on bottom-right */}
        <div className="absolute bottom-3 right-3 z-[400] bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[9.5px] font-mono flex items-center space-x-2 border border-slate-700/60 shadow-xs">
          <span>{cursorCoords?.lat || '23.6500'}° N, {cursorCoords?.lng || '85.5500'}° E</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">EPSG:4326</span>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-2.5">
        <div className="flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Jharkhand State Remote Sensing Data Centre (JSAC) • 24 Districts</span>
        </div>
        <div className="text-[10px] font-semibold text-slate-500">
          Filtered District: <strong className="text-slate-800">{selectedDistrict}</strong>
        </div>
      </div>
    </div>
  );
};

export default JharkhandGisHeatmap;
