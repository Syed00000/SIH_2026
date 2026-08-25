import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { JHARKHAND_GEOJSON } from '../../data/jharkhandGeoJson.js';
import { Plus, Minus, Home, Layers, Info } from 'lucide-react';

export const JharkhandGisHeatmap = ({ selectedDistrict = 'All', onSelectDistrict }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  const JHARKHAND_CENTER = [23.65, 85.55];
  const DEFAULT_ZOOM = 7.4;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: JHARKHAND_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: false,
        minZoom: 6,
        maxZoom: 11
      });

      // Sleek Light Canvas Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Add GeoJSON Layer with district styling matching the image
      const geoLayer = L.geoJSON(JHARKHAND_GEOJSON, {
        style: (feature) => {
          const isSelected = selectedDistrict && selectedDistrict !== 'All' && 
            feature.properties.name.toLowerCase() === selectedDistrict.toLowerCase();
          
          return {
            fillColor: feature.properties.color || '#86efac',
            weight: isSelected ? 2.5 : 1,
            opacity: 1,
            color: isSelected ? '#0f172a' : '#ffffff',
            dashArray: isSelected ? '' : '1',
            fillOpacity: isSelected ? 0.95 : 0.85
          };
        },
        onEachFeature: (feature, layer) => {
          layer.on({
            mouseover: (e) => {
              const l = e.target;
              l.setStyle({
                weight: 2,
                color: '#0f172a',
                fillOpacity: 0.95
              });
              setHoveredDistrict(feature.properties);
            },
            mouseout: (e) => {
              geoLayer.resetStyle(e.target);
              setHoveredDistrict(null);
            },
            click: () => {
              if (onSelectDistrict) {
                onSelectDistrict(feature.properties.name);
              }
            }
          });

          // Text labels for districts
          if (feature.properties.name) {
            const center = layer.getBounds().getCenter();
            const labelIcon = L.divIcon({
              className: 'district-label-marker',
              html: `<div style="font-size: 9.5px; font-weight: 700; color: #1e293b; text-shadow: 0 1px 2px #ffffff; pointer-events: none; transform: translate(-50%, -50%); text-align: center; white-space: nowrap;">${feature.properties.name}</div>`,
              iconSize: [60, 16],
              iconAnchor: [30, 8]
            });
            L.marker(center, { icon: labelIcon, interactive: false }).addTo(map);
          }
        }
      }).addTo(map);

      geoJsonLayerRef.current = geoLayer;
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
        const isSelected = selectedDistrict && selectedDistrict !== 'All' && 
          feature.properties.name.toLowerCase() === selectedDistrict.toLowerCase();
        
        layer.setStyle({
          fillColor: feature.properties.color || '#86efac',
          weight: isSelected ? 2.5 : 1,
          opacity: 1,
          color: isSelected ? '#0f172a' : '#ffffff',
          fillOpacity: isSelected ? 0.95 : 0.85
        });
      });
    }
  }, [selectedDistrict]);

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
    <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs relative flex flex-col h-full min-h-[390px]">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Jharkhand GIS Heatmap Overlay
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Problem Density by District
          </p>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="relative flex-1 rounded-xl overflow-hidden border border-slate-100 bg-[#f8fafc] min-h-[310px]">
        <div ref={mapContainerRef} className="w-full h-full min-h-[310px]" />

        {/* Custom Map Floating Controls */}
        <div className="absolute top-3 left-3 z-400 flex flex-col space-y-1 bg-white/95 backdrop-blur-xs p-1 rounded-lg border border-slate-200 shadow-xs">
          <button
            onClick={handleZoomIn}
            className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded text-xs transition-colors cursor-pointer"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded text-xs transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <div className="h-px bg-slate-200 my-0.5" />
          <button
            onClick={handleResetView}
            className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded text-xs transition-colors cursor-pointer"
            title="Reset Home View"
          >
            <Home className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetView}
            className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded text-xs transition-colors cursor-pointer"
            title="Toggle Layers"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Interactive District Hover Details Popup */}
        {hoveredDistrict && (
          <div className="absolute top-3 right-3 z-400 bg-slate-900/90 backdrop-blur-md text-white p-2.5 rounded-xl border border-slate-700 shadow-md text-xs space-y-1 min-w-[160px]">
            <div className="font-bold text-sm text-white border-b border-slate-700 pb-1">
              {hoveredDistrict.name}
            </div>
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>Density:</span>
              <span className="font-bold text-amber-300">{hoveredDistrict.density}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>Problems:</span>
              <span className="font-semibold text-white">{hoveredDistrict.problems?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>Resolved:</span>
              <span className="font-semibold text-emerald-400">{hoveredDistrict.solved?.toLocaleString()}</span>
            </div>
            <div className="text-[10px] text-slate-400 pt-1">
              Top: {hoveredDistrict.topSector}
            </div>
          </div>
        )}

        {/* Density Legend on bottom-left */}
        <div className="absolute bottom-3 left-3 z-400 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 shadow-xs text-[10px] space-y-1">
          <span className="font-bold text-slate-700 block text-[9.5px] uppercase tracking-wider mb-1">
            Problem Density
          </span>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#ef4444]" />
            <span className="text-slate-600 font-medium">Very High</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#fb923c]" />
            <span className="text-slate-600 font-medium">High</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#fde047]" />
            <span className="text-slate-600 font-medium">Medium</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#86efac]" />
            <span className="text-slate-600 font-medium">Low</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#22c55e]" />
            <span className="text-slate-600 font-medium">Very Low</span>
          </div>
        </div>
      </div>

      {/* Footer Timestamp */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-2.5">
        <div className="flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Data updated: 22 May 2026 11:30 AM</span>
        </div>
      </div>
    </div>
  );
};

export default JharkhandGisHeatmap;
