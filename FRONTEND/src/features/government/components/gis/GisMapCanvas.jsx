import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Plus,
  Minus,
  Crosshair,
  Layers
} from 'lucide-react';
import {
  JHARKHAND_STATE_GEOJSON,
  JHARKHAND_DISTRICTS_DATA,
  GIS_HOTSPOT_PINS,
  PROBLEM_CATEGORIES
} from '../../data/jharkhandGisData.js';
import {
  MapLayersCard,
  ProblemCategoriesCard,
  HeatmapIntensityCard,
  DistrictOverviewPanel,
  LegendCard,
  MapScaleBar
} from './GisOverlays.jsx';

export const GisMapCanvas = ({
  viewType = 'heat_map',
  selectedCategory = 'all',
  selectedDistrict = 'All Districts',
  onSelectDistrict,
  selectedSeverity = 'all',
  activeLayers = {
    districtBoundary: true,
    problemHeatMap: true,
    problemHotspots: true,
    districtLabels: true
  },
  onToggleLayer,
  onOpenDetailedReport
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const hotspotsLayerGroupRef = useRef(null);
  const labelsLayerGroupRef = useRef(null);
  const baseTileLayerRef = useRef(null);
  const hasFittedInitialBounds = useRef(false);

  const [tileMode, setTileMode] = useState('light'); // 'light', 'osm', 'satellite'
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [selectedCategoriesList, setSelectedCategoriesList] = useState(
    PROBLEM_CATEGORIES.map((c) => c.id)
  );

  const JHARKHAND_CENTER = [23.65, 85.55];
  const DEFAULT_ZOOM = 7.6;

  // Compute color for a district based on its severity and active category filter
  const getFeatureColor = useCallback(
    (distId) => {
      const data = JHARKHAND_DISTRICTS_DATA[distId];
      if (!data) return '#86efac';

      let score = data.overallScore;
      if (selectedCategory && selectedCategory !== 'all') {
        score = data.categoryScores?.[selectedCategory] || score;
      }

      // Exact color mapping matching the reference image
      if (score >= 81) return '#ef4444'; // Very High - Red (Garhwa, Godda, Dhanbad)
      if (score >= 61) return '#fb923c'; // High - Orange (Deoghar, Bokaro, Pakur, East Singhbhum, Simdega)
      if (score >= 41) return '#fde047'; // Moderate - Warm Yellow (Ranchi, Hazaribagh, Dumka, Jamtara, Chatra, Latehar, Ramgarh, Khunti, Seraikela)
      if (score >= 21) return '#86efac'; // Low - Light Green (Koderma, Giridih, Sahibganj, Gumla, Lohardaga)
      return '#22c55e'; // Very Low - Emerald Green (West Singhbhum)
    },
    [selectedCategory]
  );

  // Check if a district matches the selected severity filter
  const matchesSeverityFilter = useCallback(
    (distId) => {
      if (selectedSeverity === 'all') return true;
      const data = JHARKHAND_DISTRICTS_DATA[distId];
      if (!data) return true;

      const score =
        selectedCategory !== 'all'
          ? data.categoryScores?.[selectedCategory] || data.overallScore
          : data.overallScore;

      if (selectedSeverity === 'very_high') return score >= 81;
      if (selectedSeverity === 'high') return score >= 61 && score <= 80;
      if (selectedSeverity === 'moderate') return score >= 41 && score <= 60;
      if (selectedSeverity === 'low') return score >= 21 && score <= 40;
      if (selectedSeverity === 'very_low') return score <= 20;
      return true;
    },
    [selectedSeverity, selectedCategory]
  );

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: JHARKHAND_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: false,
        minZoom: 6,
        maxZoom: 13
      });

      // CartoDB Positron Light Tile Layer (clean, muted background)
      const baseTile = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
        {
          subdomains: 'abcd',
          maxZoom: 19
        }
      ).addTo(map);

      baseTileLayerRef.current = baseTile;
      hotspotsLayerGroupRef.current = L.layerGroup().addTo(map);
      labelsLayerGroupRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Base Tile Layer when tileMode changes
  useEffect(() => {
    if (!mapInstanceRef.current || !baseTileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(baseTileLayerRef.current);

    let newUrl = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
    let subdomains = 'abcd';

    if (tileMode === 'osm' || viewType === 'density') {
      newUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      subdomains = 'abc';
    } else if (tileMode === 'satellite' || viewType === 'satellite') {
      newUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      subdomains = 'abc';
    }

    const newTile = L.tileLayer(newUrl, { subdomains, maxZoom: 19 }).addTo(mapInstanceRef.current);
    baseTileLayerRef.current = newTile;
  }, [tileMode, viewType]);

  // Update GeoJSON Districts Layer (Clean, crisp polygon colors matching the image)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (geoJsonLayerRef.current) {
      mapInstanceRef.current.removeLayer(geoJsonLayerRef.current);
    }

    const geoLayer = L.geoJSON(JHARKHAND_STATE_GEOJSON, {
      style: (feature) => {
        const distId = feature.properties.id;
        const isMatchedSeverity = matchesSeverityFilter(distId);
        const isSelected =
          selectedDistrict &&
          selectedDistrict !== 'All Districts' &&
          feature.properties.name.toLowerCase() === selectedDistrict.toLowerCase();

        const fillColor = getFeatureColor(distId);

        return {
          fillColor: isMatchedSeverity ? fillColor : '#e2e8f0',
          weight: isSelected ? 2.5 : activeLayers.districtBoundary ? 1.0 : 0,
          opacity: 1,
          color: isSelected ? '#0f172a' : '#ffffff',
          fillOpacity: !activeLayers.problemHeatMap
            ? 0.05
            : isSelected
            ? 0.95
            : isMatchedSeverity
            ? 0.88
            : 0.25
        };
      },
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({
              weight: 2.5,
              color: '#0f172a',
              fillOpacity: 0.98
            });
            const data = JHARKHAND_DISTRICTS_DATA[feature.properties.id] || feature.properties;
            setHoveredDistrict(data);
          },
          mouseout: (e) => {
            geoLayer.resetStyle(e.target);
            setHoveredDistrict(null);
          },
          click: (e) => {
            if (onSelectDistrict) {
              onSelectDistrict(feature.properties.name);
            }
            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyToBounds(layer.getBounds(), {
                maxZoom: 9.5,
                duration: 0.8
              });
            }
          }
        });
      }
    }).addTo(mapInstanceRef.current);

    geoJsonLayerRef.current = geoLayer;

    // Fit bounds once on first load so the whole state is perfectly centered
    if (!hasFittedInitialBounds.current && mapInstanceRef.current) {
      try {
        const bounds = geoLayer.getBounds();
        if (bounds && bounds.isValid()) {
          mapInstanceRef.current.fitBounds(bounds, { padding: [25, 25] });
          hasFittedInitialBounds.current = true;
        }
      } catch (err) {
        // fallback
      }
    }
  }, [
    activeLayers.districtBoundary,
    activeLayers.problemHeatMap,
    selectedDistrict,
    selectedCategory,
    selectedSeverity,
    getFeatureColor,
    matchesSeverityFilter,
    onSelectDistrict
  ]);

  // Update District Text Labels (100% Sharp, perfectly positioned at centroids)
  useEffect(() => {
    if (!mapInstanceRef.current || !labelsLayerGroupRef.current) return;

    labelsLayerGroupRef.current.clearLayers();

    if (!activeLayers.districtLabels) return;

    // Explicit centroid coordinates for all 24 districts matching the exact visual centers
    const DISTRICT_LABEL_COORDS = {
      garhwa: [24.08, 83.74],
      palamu: [24.20, 84.20],
      chatra: [24.12, 84.95],
      koderma: [24.51, 85.65],
      hazaribagh: [24.02, 85.38],
      giridih: [24.28, 86.15],
      deoghar: [24.32, 86.74],
      dumka: [24.28, 87.24],
      godda: [24.82, 87.31],
      sahibganj: [24.98, 87.68],
      pakur: [24.60, 87.70],
      jamtara: [23.96, 86.92],
      dhanbad: [23.82, 86.44],
      bokaro: [23.70, 86.00],
      ramgarh: [23.63, 85.56],
      ranchi: [23.32, 85.32],
      latehar: [23.72, 84.49],
      lohardaga: [23.48, 84.68],
      gumla: [23.07, 84.58],
      simdega: [22.64, 84.65],
      khunti: [22.93, 85.21],
      'west-singhbhum': [22.38, 85.50],
      'seraikela-kharsawan': [22.82, 85.90],
      'east-singhbhum': [22.56, 86.50]
    };

    Object.entries(JHARKHAND_DISTRICTS_DATA).forEach(([distId, dist]) => {
      const pos = DISTRICT_LABEL_COORDS[distId] || dist.center;
      if (!pos) return;

      const isSelected =
        selectedDistrict &&
        selectedDistrict !== 'All Districts' &&
        dist.name.toLowerCase() === selectedDistrict.toLowerCase();

      // Sharp, bold text label matching the reference image typography
      const labelHtml = `
        <div style="
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: ${isSelected ? '12px' : '10.5px'};
          font-weight: 800;
          color: ${isSelected ? '#0f172a' : '#1e293b'};
          text-shadow: 0 1px 2px #ffffff, 0 -1px 2px #ffffff, 1px 0 2px #ffffff, -1px 0 2px #ffffff, 0 0 4px #ffffff;
          pointer-events: none;
          text-align: center;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          letter-spacing: -0.2px;
        ">
          ${dist.name}
        </div>
      `;

      const labelIcon = L.divIcon({
        className: 'custom-district-label-container',
        html: labelHtml,
        iconSize: [80, 20],
        iconAnchor: [40, 10]
      });

      L.marker(pos, {
        icon: labelIcon,
        interactive: false
      }).addTo(labelsLayerGroupRef.current);
    });
  }, [activeLayers.districtLabels, selectedDistrict]);

  // Update Problem Hotspot Pin Markers (Matching the red location pin icon in the reference image)
  useEffect(() => {
    if (!mapInstanceRef.current || !hotspotsLayerGroupRef.current) return;

    hotspotsLayerGroupRef.current.clearLayers();

    if (!activeLayers.problemHotspots || viewType === 'choropleth') return;

    const filteredHotspots = GIS_HOTSPOT_PINS.filter((pin) => {
      if (
        selectedDistrict !== 'All Districts' &&
        pin.district.toLowerCase() !== selectedDistrict.toLowerCase()
      ) {
        return false;
      }
      return true;
    });

    filteredHotspots.forEach((pin) => {
      // Red pin SVG matching the exact shape in the image
      const pinHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer; transform: translate(-50%, -100%);">
          <!-- Outer Pulsing Glow -->
          <div style="position: absolute; bottom: 0px; width: 14px; height: 14px; background: rgba(220, 38, 38, 0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <!-- Pin Body -->
          <div style="width: 24px; height: 28px; background: #dc2626; border: 2px solid #ffffff; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 6px -1px rgba(0,0,0,0.35);">
            <div style="width: 7px; height: 7px; background: #ffffff; border-radius: 50%; transform: rotate(45deg);"></div>
          </div>
        </div>
      `;

      const pinIcon = L.divIcon({
        className: 'custom-hotspot-pin',
        html: pinHtml,
        iconSize: [24, 28],
        iconAnchor: [12, 28]
      });

      const marker = L.marker([pin.lat, pin.lng], { icon: pinIcon });

      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px; max-width: 200px;">
          <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-bottom: 2px;">${pin.name}</div>
          <div style="font-size: 10px; font-weight: 700; color: #dc2626; margin-bottom: 4px;">Severity: ${pin.severityScore}/100 (${pin.severityLevel})</div>
          <div style="font-size: 10px; color: #475569; line-height: 1.3;">${pin.summary}</div>
          <div style="margin-top: 6px; font-size: 9px; font-weight: 700; color: #2563eb; cursor: pointer;">Click district for full report &rarr;</div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectDistrict) {
          onSelectDistrict(pin.district);
        }
      });

      marker.addTo(hotspotsLayerGroupRef.current);
    });
  }, [activeLayers.problemHotspots, selectedDistrict, viewType, onSelectDistrict]);

  // Pan to selected district when selectedDistrict changes externally
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (!selectedDistrict || selectedDistrict === 'All Districts') {
      if (geoJsonLayerRef.current) {
        try {
          const bounds = geoJsonLayerRef.current.getBounds();
          if (bounds && bounds.isValid()) {
            mapInstanceRef.current.flyToBounds(bounds, {
              padding: [25, 25],
              duration: 1
            });
            return;
          }
        } catch (e) {}
      }
      mapInstanceRef.current.flyTo(JHARKHAND_CENTER, DEFAULT_ZOOM, {
        duration: 1
      });
      return;
    }

    const distKey = Object.keys(JHARKHAND_DISTRICTS_DATA).find(
      (k) => JHARKHAND_DISTRICTS_DATA[k].name.toLowerCase() === selectedDistrict.toLowerCase()
    );

    if (distKey && JHARKHAND_DISTRICTS_DATA[distKey]) {
      const data = JHARKHAND_DISTRICTS_DATA[distKey];
      mapInstanceRef.current.flyTo(data.center, 9.2, {
        duration: 1
      });
    }
  }, [selectedDistrict]);

  // Active district data for the right sidebar panel (fallback to Ranchi if All Districts)
  const activeDistrictData =
    selectedDistrict && selectedDistrict !== 'All Districts'
      ? Object.values(JHARKHAND_DISTRICTS_DATA).find(
          (d) => d.name.toLowerCase() === selectedDistrict.toLowerCase()
        ) || JHARKHAND_DISTRICTS_DATA.ranchi
      : JHARKHAND_DISTRICTS_DATA.ranchi;

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current && geoJsonLayerRef.current) {
      const bounds = geoJsonLayerRef.current.getBounds();
      if (bounds && bounds.isValid()) {
        mapInstanceRef.current.flyToBounds(bounds, { padding: [25, 25], duration: 1 });
      } else {
        mapInstanceRef.current.flyTo(JHARKHAND_CENTER, DEFAULT_ZOOM, { duration: 1 });
      }
    }
    if (onSelectDistrict) {
      onSelectDistrict('All Districts');
    }
  };

  const handleToggleTileMode = () => {
    setTileMode((prev) => (prev === 'light' ? 'satellite' : 'light'));
  };

  return (
    <div className="relative w-full h-[650px] rounded-3xl overflow-hidden border border-slate-200 shadow-xs bg-[#f8fafc] select-none">
      {/* 1. Leaflet Canvas Viewport */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* 2. Floating Map Action Buttons (Top Left Inside Map) */}
      <div className="absolute top-4 left-64 z-[500] flex flex-col space-y-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-md">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="h-px bg-slate-200 my-0.5 mx-1" />
        <button
          type="button"
          onClick={handleRecenter}
          className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-blue-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          title="Recenter Map View"
        >
          <Crosshair className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleToggleTileMode}
          className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            tileMode === 'satellite'
              ? 'bg-blue-600 text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Toggle Satellite / Canvas Basemap"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Left Overlays Column (Map Layers, Problem Categories, Heatmap Intensity) */}
      <div className="absolute top-4 left-4 z-[500] flex flex-col space-y-2.5 max-h-[610px] overflow-y-auto pr-1">
        <MapLayersCard
          layers={activeLayers}
          onToggleLayer={onToggleLayer}
        />
        <ProblemCategoriesCard
          selectedCategories={selectedCategoriesList}
          onToggleCategory={(catId) => {
            setSelectedCategoriesList((prev) =>
              prev.includes(catId)
                ? prev.filter((id) => id !== catId)
                : [...prev, catId]
            );
          }}
        />
        <HeatmapIntensityCard />
      </div>

      {/* 4. Right Overlays Column (District Overview, Legend) */}
      <div className="absolute top-4 right-4 z-[500] flex flex-col space-y-2.5 max-h-[610px] overflow-y-auto pl-1">
        <DistrictOverviewPanel
          districtData={activeDistrictData}
          onOpenDetailedReport={onOpenDetailedReport}
        />
        <LegendCard />
      </div>

      {/* 5. Bottom Scale Bar */}
      <div className="absolute bottom-4 right-72 z-[500] hidden md:block">
        <MapScaleBar />
      </div>
    </div>
  );
};

export default GisMapCanvas;
