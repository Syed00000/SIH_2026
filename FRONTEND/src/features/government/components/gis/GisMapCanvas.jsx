import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { getMapTileConfig } from '../../utils/mapTileConfig.js';
import { DistrictBoundariesLayer } from './DistrictBoundariesLayer.jsx';
import { DistrictLabelsLayer } from './DistrictLabelsLayer.jsx';
import { ProblemMarkersLayer } from './ProblemMarkersLayer.jsx';
import { ProblemHeatmapLayer } from './ProblemHeatmapLayer.jsx';
import { MapControls } from './MapControls.jsx';
import { MapLegendCard } from './MapLegendCard.jsx';
import { DistrictOverviewCard } from './DistrictOverviewCard.jsx';
import { JHARKHAND_DISTRICTS_DICT } from '../../data/jharkhandDistrictsMeta.js';

const JHARKHAND_BOUNDS = [[21.9, 83.2], [25.4, 88.0]];
const JHARKHAND_CENTER = [23.65, 85.60];

export const GisMapCanvas = ({
  problems = [],
  stats = {},
  selectedDistrict = 'All Districts',
  onSelectDistrict,
  viewType = 'heat_map',
  activeLayers = {},
  onToggleLayer,
  onOpenDetailedReport,
  onViewProblemDetails
}) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const tileLayerRef = useRef(null);
  const [tileMode, setTileMode] = useState('light');
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [configError, setConfigError] = useState(null);

  useEffect(() => {
    if (!mapContainerRef.current || map) return;
    if (mapContainerRef.current._leaflet_id) delete mapContainerRef.current._leaflet_id;
    const instance = L.map(mapContainerRef.current, {
      center: JHARKHAND_CENTER,
      zoom: 7.6,
      zoomControl: false,
      attributionControl: true,
      minZoom: 6,
      maxZoom: 16
    });

    const tileCfg = getMapTileConfig({ mode: tileMode });
    setConfigError(tileCfg.isConfigMissing ? (tileCfg.missingReason || 'Map configuration missing.') : null);

    tileLayerRef.current = L.tileLayer(tileCfg.url, {
      attribution: tileCfg.attribution,
      subdomains: tileCfg.subdomains || 'abc',
      maxZoom: tileCfg.maxZoom || 19
    }).addTo(instance);

    if (instance._mapPane) instance.fitBounds(JHARKHAND_BOUNDS, { padding: [15, 15] });
    const timerId = setTimeout(() => {
      if (instance?._mapPane) {
        instance.invalidateSize();
        instance.fitBounds(JHARKHAND_BOUNDS, { padding: [15, 15] });
      }
    }, 150);

    setMap(instance);
    return () => {
      clearTimeout(timerId);
      if (instance?._mapPane) {
        try { instance.remove(); } catch {}
      }
      if (mapContainerRef.current) delete mapContainerRef.current._leaflet_id;
      setMap(null);
    };
  }, []);

  useEffect(() => {
    if (!map?._mapPane) return;
    const tileCfg = getMapTileConfig({ mode: tileMode });
    setConfigError(tileCfg.isConfigMissing ? (tileCfg.missingReason || 'Map configuration missing.') : null);
    if (tileLayerRef.current) {
      try { map.removeLayer(tileLayerRef.current); } catch {}
    }
    tileLayerRef.current = L.tileLayer(tileCfg.url, {
      attribution: tileCfg.attribution,
      subdomains: tileCfg.subdomains || 'abc',
      maxZoom: tileCfg.maxZoom || 19
    }).addTo(map);
  }, [map, tileMode]);

  useEffect(() => {
    if (!map?._mapPane) return;
    if (!selectedDistrict || selectedDistrict === 'All Districts') {
      map.flyToBounds(JHARKHAND_BOUNDS, { padding: [15, 15], duration: 1 });
      return;
    }
    const distKey = String(selectedDistrict).toLowerCase().replace(/[-_ ]/g, '');
    const meta = Object.values(JHARKHAND_DISTRICTS_DICT).find((d) => d.name.toLowerCase().replace(/[-_ ]/g, '') === distKey);
    if (meta?.center) map.flyTo(meta.center, 10.5, { duration: 1 });
  }, [map, selectedDistrict]);

  const showMarkers = activeLayers.problemMarkers !== false && viewType !== 'district_analysis';
  const showHeatmap = activeLayers.problemHeatMap !== false && (viewType === 'heat_map' || viewType === 'all');
  const isDistrictSelected = selectedDistrict && selectedDistrict !== 'All Districts';

  const resetToState = () => {
    if (onSelectDistrict) onSelectDistrict('All Districts');
    if (map?._mapPane) map.flyToBounds(JHARKHAND_BOUNDS, { padding: [15, 15], duration: 1 });
  };

  return (
    <div className="w-full relative h-[650px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-[#f8fafc]">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      {configError && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-amber-50/95 border border-amber-300 text-amber-900 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-md">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>{configError}</span>
        </div>
      )}

      {/* Floating Hamburger Controls Top-Left */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2">
        <MapControls
          onZoomIn={() => map?._mapPane && map.zoomIn()}
          onZoomOut={() => map?._mapPane && map.zoomOut()}
          onRecenter={resetToState}
          tileMode={tileMode}
          onToggleTileMode={() => setTileMode((m) => (m === 'light' ? 'satellite' : 'light'))}
          layers={activeLayers}
          onToggleLayer={onToggleLayer}
          isDistrictSelected={isDistrictSelected}
          onBackToState={resetToState}
        />
        {isDistrictSelected && (
          <button
            type="button"
            onClick={resetToState}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#007A61] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#00624e] transition-all cursor-pointer border border-[#00624e]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>State Overview</span>
          </button>
        )}
      </div>

      {/* Floating Info Top-Right */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col items-end gap-2">
        <DistrictOverviewCard
          selectedDistrict={selectedDistrict}
          stats={stats}
          problems={problems}
          onViewProblemDetails={onViewProblemDetails}
        />
        <MapLegendCard />
      </div>

      {/* District Hover Badge */}
      {hoveredDistrict && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] bg-slate-900/90 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg pointer-events-none">
          {hoveredDistrict.name} • {hoveredDistrict.total} Problem{hoveredDistrict.total === 1 ? '' : 's'}
        </div>
      )}

      {/* Empty Problems Notice */}
      {problems.length === 0 && (
        <div className="absolute bottom-6 left-4 z-[400] bg-white/95 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-medium shadow-sm flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>No problem data available for the selected filters.</span>
        </div>
      )}

      <DistrictBoundariesLayer
        map={map}
        visible={activeLayers.districtBoundary !== false}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={onSelectDistrict}
        districtStats={stats.byDistrict || {}}
        onHoverDistrict={setHoveredDistrict}
      />
      <DistrictLabelsLayer
        map={map}
        visible={activeLayers.districtLabels !== false}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={onSelectDistrict}
        districtStats={stats.byDistrict || {}}
      />
      <ProblemMarkersLayer
        map={map}
        problems={problems}
        visible={showMarkers}
        onViewProblemDetails={onViewProblemDetails}
        onSelectDistrict={onSelectDistrict}
      />
      <ProblemHeatmapLayer map={map} problems={problems} visible={showHeatmap} />
    </div>
  );
};

export default GisMapCanvas;
