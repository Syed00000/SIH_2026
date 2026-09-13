import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { JHARKHAND_GEOJSON as JHARKHAND_STATE_GEOJSON } from '../../data/jharkhandGeoJson.js';
import { getMapTileConfig } from '../../utils/mapTileConfig.js';
import { useJharkhandMapData } from './useJharkhandMapData.js';
import { JharkhandGisHeader, JharkhandGisFloatingControls } from './JharkhandGisControls.jsx';
import { JharkhandGisHoverCard } from './JharkhandGisHoverCard.jsx';
import { JharkhandGisLegend, JharkhandGisFooter } from './JharkhandGisLegend.jsx';
import { createProblemMarkersGroup } from './gisMarkersHelper.js';

const JHARKHAND_CENTER = [23.65, 85.55];
const DEFAULT_ZOOM = 7.4;

export const JharkhandGisHeatmap = ({ selectedDistrict = 'All', onSelectDistrict }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const baseTileLayerRef = useRef(null);

  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [cursorCoords, setCursorCoords] = useState({ lat: '23.6500', lng: '85.5500' });
  const [basemapMode, setBasemapMode] = useState('canvas');

  const { districtsData, liveProblemPins, getDistrictColor } = useJharkhandMapData();

  const updateBasemap = (mode) => {
    if (!mapInstanceRef.current?._mapPane) return;
    setBasemapMode(mode);
    if (baseTileLayerRef.current) {
      try { mapInstanceRef.current.removeLayer(baseTileLayerRef.current); } catch {}
    }
    const tileCfg = getMapTileConfig({ mode });
    const newTile = L.tileLayer(tileCfg.url, {
      subdomains: tileCfg.subdomains || 'abc',
      maxZoom: tileCfg.maxZoom || 19,
      attribution: tileCfg.attribution
    }).addTo(mapInstanceRef.current);
    newTile.bringToBack();
    baseTileLayerRef.current = newTile;
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!mapInstanceRef.current) {
      if (mapContainerRef.current._leaflet_id) delete mapContainerRef.current._leaflet_id;
      const map = L.map(mapContainerRef.current, {
        center: JHARKHAND_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: false,
        minZoom: 6.5,
        maxZoom: 13
      });

      const tileCfg = getMapTileConfig({ mode: 'canvas' });
      baseTileLayerRef.current = L.tileLayer(tileCfg.url, {
        subdomains: tileCfg.subdomains || 'abcd',
        maxZoom: tileCfg.maxZoom || 19,
        attribution: tileCfg.attribution
      }).addTo(map);

      map.on('mousemove', (e) => {
        if (e?.latlng) {
          setCursorCoords({ lat: e.latlng.lat.toFixed(4), lng: e.latlng.lng.toFixed(4) });
        }
      });
      mapInstanceRef.current = map;
    }

    const currentMap = mapInstanceRef.current;
    if (JHARKHAND_STATE_GEOJSON && currentMap?._mapPane) {
      if (geoJsonLayerRef.current) {
        try { currentMap.removeLayer(geoJsonLayerRef.current); } catch {}
      }

      const layer = L.geoJSON(JHARKHAND_STATE_GEOJSON, {
        style: (feature) => {
          const distId = (feature.properties.id || feature.properties.dtname || '').toLowerCase().replace(/\s+/g, '_');
          const isSelected = selectedDistrict.toLowerCase() === distId || selectedDistrict === feature.properties.name;
          const distData = districtsData[distId];
          const hasProblems = (distData?.totalProblems || 0) > 0;
          return {
            fillColor: getDistrictColor(distId),
            fillOpacity: hasProblems ? (isSelected ? 0.85 : 0.65) : (isSelected ? 0.35 : 0.15),
            color: hasProblems ? '#991b1b' : (isSelected ? '#007A61' : '#94a3b8'),
            weight: hasProblems ? 2.5 : (isSelected ? 2.5 : 1),
            dashArray: hasProblems ? '' : '2',
            lineJoin: 'round'
          };
        },
        onEachFeature: (feature, featureLayer) => {
          const distId = (feature.properties.id || feature.properties.dtname || '').toLowerCase().replace(/\s+/g, '_');
          const distData = districtsData[distId] || {
            name: feature.properties.name || feature.properties.dtname,
            totalProblems: 0,
            resolvedProblems: 0,
            activeHeis: 0,
            riskLevel: 'Zero / Clean'
          };

          featureLayer.on({
            mouseover: (e) => {
              e.target.setStyle({ fillOpacity: 0.85, weight: 2.5, color: '#0f172a' });
              e.target.bringToFront();
              setHoveredDistrict({ ...distData, name: distData.name || feature.properties.name });
            },
            mouseout: (e) => {
              if (geoJsonLayerRef.current) geoJsonLayerRef.current.resetStyle(e.target);
              setHoveredDistrict(null);
            },
            click: () => {
              const name = distData.name || feature.properties.name;
              if (onSelectDistrict) onSelectDistrict(name);
            }
          });
        }
      });

      layer.addTo(currentMap);
      geoJsonLayerRef.current = layer;
    }

    // Render interactive problem pinpoint markers
    if (markersLayerRef.current && currentMap?._mapPane) {
      try { currentMap.removeLayer(markersLayerRef.current); } catch {}
    }

    if (currentMap?._mapPane && Array.isArray(liveProblemPins) && liveProblemPins.length > 0) {
      const markersGroup = createProblemMarkersGroup(liveProblemPins);
      markersGroup.addTo(currentMap);
      markersLayerRef.current = markersGroup;
    }

    return () => {
      if (geoJsonLayerRef.current && mapInstanceRef.current?._mapPane) {
        try { mapInstanceRef.current.removeLayer(geoJsonLayerRef.current); } catch {}
      }
      if (markersLayerRef.current && mapInstanceRef.current?._mapPane) {
        try { mapInstanceRef.current.removeLayer(markersLayerRef.current); } catch {}
      }
    };
  }, [getDistrictColor, onSelectDistrict, selectedDistrict, districtsData, liveProblemPins]);

  // Clean unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current?._mapPane) {
        try { mapInstanceRef.current.remove(); } catch {}
      }
      if (mapContainerRef.current) delete mapContainerRef.current._leaflet_id;
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="bg-white border border-slate-200/80 hover:border-slate-300/90 rounded-xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_-6px_rgba(15,23,42,0.07)] relative flex flex-col h-full min-h-[410px] transition-all duration-300">
      <JharkhandGisHeader
        basemapMode={basemapMode}
        onUpdateBasemap={updateBasemap}
        problemCount={liveProblemPins.length}
      />

      <div className="relative flex-1 rounded-xl overflow-hidden border border-slate-100 bg-[#f8fafc] min-h-[320px]">
        <div ref={mapContainerRef} className="w-full h-full min-h-[320px]" />

        <JharkhandGisFloatingControls
          onZoomIn={() => mapInstanceRef.current?._mapPane && mapInstanceRef.current.zoomIn()}
          onZoomOut={() => mapInstanceRef.current?._mapPane && mapInstanceRef.current.zoomOut()}
          onResetView={() => mapInstanceRef.current?._mapPane && mapInstanceRef.current.setView(JHARKHAND_CENTER, DEFAULT_ZOOM)}
        />

        <JharkhandGisHoverCard hoveredDistrict={hoveredDistrict} />
        <JharkhandGisLegend cursorCoords={cursorCoords} />
      </div>

      <JharkhandGisFooter selectedDistrict={selectedDistrict} />
    </div>
  );
};

export default JharkhandGisHeatmap;
