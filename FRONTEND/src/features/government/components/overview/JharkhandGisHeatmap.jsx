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
  const [basemapMode, setBasemapMode] = useState('canvas');
  const [showHotspots, setShowHotspots] = useState(false);

  const JHARKHAND_CENTER = [23.65, 85.55];
  const DEFAULT_ZOOM = 7.4;

  // Compute District Color based on live problem density
  const getDistrictColor = useCallback((distId) => {
    const data = JHARKHAND_DISTRICTS_DATA[distId];
    if (!data) return '#22c55e';
    const count = data.totalProblems || 0;
    if (count >= 50) return '#ef4444';
    if (count >= 20) return '#fb923c';
    if (count >= 10) return '#fde047';
    if (count >= 1) return '#86efac';
    return '#22c55e';
  }, []);

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
  };

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

      const baseTile = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);
      baseTileLayerRef.current = baseTile;

      map.on('mousemove', (e) => {
        if (e && e.latlng) {
          setCursorCoords({
            lat: e.latlng.lat.toFixed(4),
            lng: e.latlng.lng.toFixed(4)
          });
        }
      });

      mapInstanceRef.current = map;
    }

    if (JHARKHAND_STATE_GEOJSON) {
      if (geoJsonLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(geoJsonLayerRef.current);
      }

      const layer = L.geoJSON(JHARKHAND_STATE_GEOJSON, {
        style: (feature) => {
          const distId = (feature.properties.id || feature.properties.dtname || '').toLowerCase().replace(/\s+/g, '_');
          const isSelected = selectedDistrict.toLowerCase() === distId || selectedDistrict === feature.properties.name;

          return {
            fillColor: getDistrictColor(distId),
            fillOpacity: isSelected ? 0.75 : 0.45,
            color: isSelected ? '#1e293b' : '#ffffff',
            weight: isSelected ? 2.5 : 1.2,
            dashArray: isSelected ? '' : '1',
            lineJoin: 'round'
          };
        },
        onEachFeature: (feature, featureLayer) => {
          const distId = (feature.properties.id || feature.properties.dtname || '').toLowerCase().replace(/\s+/g, '_');
          const distData = JHARKHAND_DISTRICTS_DATA[distId] || {
            name: feature.properties.name || feature.properties.dtname,
            totalProblems: 0,
            resolvedProblems: 0,
            activeHeis: 0,
            riskLevel: 'Zero Inflow',
            riskColor: '#22c55e',
            demographics: { population: '—' }
          };

          featureLayer.on({
            mouseover: (e) => {
              const target = e.target;
              target.setStyle({
                fillOpacity: 0.8,
                weight: 2,
                color: '#0f172a'
              });
              target.bringToFront();
              setHoveredDistrict({
                ...distData,
                name: distData.name || feature.properties.name
              });
            },
            mouseout: (e) => {
              if (geoJsonLayerRef.current) {
                geoJsonLayerRef.current.resetStyle(e.target);
              }
              setHoveredDistrict(null);
            },
            click: () => {
              const name = distData.name || feature.properties.name;
              if (onSelectDistrict) {
                onSelectDistrict(name);
              }
            }
          });
        }
      });

      layer.addTo(mapInstanceRef.current);
      geoJsonLayerRef.current = layer;
    }
  }, [getDistrictColor, onSelectDistrict, selectedDistrict]);

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

        {/* GIS Controls */}
        <div className="flex items-center space-x-1.5">
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
                className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
              >
                {hoveredDistrict.totalProblems > 0 ? 'Active Need' : 'Zero Inflow'}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>Total Problems:</span>
              <span className="font-bold text-white">
                {(hoveredDistrict.totalProblems || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>Resolved:</span>
              <span className="font-bold text-emerald-400">
                {(hoveredDistrict.resolvedProblems || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>Active HEIs:</span>
              <span className="font-bold text-purple-300">
                {hoveredDistrict.activeHeis || 0}
              </span>
            </div>
            <div className="text-[9.5px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between items-center">
              <span>District Node</span>
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
            <span className="text-slate-600 font-medium">Very High (&gt;50)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#fb923c]" />
            <span className="text-slate-600 font-medium">High (20-49)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#fde047]" />
            <span className="text-slate-600 font-medium">Moderate (10-19)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#86efac]" />
            <span className="text-slate-600 font-medium">Low (1-9)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#22c55e]" />
            <span className="text-slate-600 font-medium">Zero / Clean (0)</span>
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
