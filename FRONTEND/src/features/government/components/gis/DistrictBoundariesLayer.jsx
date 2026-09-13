import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

let cachedGeoJson = null;

export const DistrictBoundariesLayer = ({
  map,
  visible = true,
  selectedDistrict = 'All Districts',
  onSelectDistrict,
  districtStats = {},
  onHoverDistrict
}) => {
  const geoJsonLayerRef = useRef(null);
  const [geoData, setGeoData] = useState(cachedGeoJson);

  // 1. Fetch the authentic high-resolution 24 Jharkhand district boundaries
  useEffect(() => {
    if (cachedGeoJson) {
      setGeoData(cachedGeoJson);
      return;
    }
    let isMounted = true;
    fetch('/geojson/jharkhand-districts.geojson')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && isMounted) {
          cachedGeoJson = data;
          setGeoData(data);
        }
      })
      .catch((err) => console.error('Failed to load Jharkhand district boundaries:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  const getDistrictCount = (distName) => {
    if (!distName || !districtStats) return 0;
    const name = String(distName).toLowerCase().trim();
    const raw = districtStats[name] ?? districtStats[distName];
    if (typeof raw === 'number') return raw;
    if (raw && typeof raw.total === 'number') return raw.total;
    // Check aliases / partial matches
    for (const [k, v] of Object.entries(districtStats)) {
      if (k.toLowerCase().replace(/[^a-z]/g, '') === name.replace(/[^a-z]/g, '')) {
        return typeof v === 'number' ? v : (v?.total || 0);
      }
    }
    return 0;
  };

  // 2. Heatmap styling across districts
  const getDistrictStyle = (distName, maxCount) => {
    const isStateView = !selectedDistrict || selectedDistrict === 'All Districts';
    const isSelected = !isStateView && String(distName).toLowerCase() === String(selectedDistrict).toLowerCase();
    const count = getDistrictCount(distName);

    if (isSelected) {
      return {
        fillColor: '#007A61',
        weight: 3.5,
        opacity: 1,
        color: '#004d3d',
        dashArray: '',
        fillOpacity: 0.35
      };
    }

    if (!isStateView) {
      // Another district is selected: render background districts subdued
      return {
        fillColor: '#64748b',
        weight: 1.2,
        opacity: 0.4,
        color: '#94a3b8',
        dashArray: '2',
        fillOpacity: 0.05
      };
    }

    // "All Districts" State Heatmap View: color by problem density
    let fillColor = '#007A61';
    let fillOpacity = 0.08;
    let weight = 1.6;
    let color = '#007A61';

    if (count > 0 && maxCount > 0) {
      const ratio = count / maxCount;
      if (ratio >= 0.6) {
        fillColor = '#ef4444'; // Red: High Problem Zone
        color = '#b91c1c';
        fillOpacity = 0.45;
        weight = 2;
      } else if (ratio >= 0.3) {
        fillColor = '#f97316'; // Orange/Amber: Moderate Zone
        color = '#c2410c';
        fillOpacity = 0.38;
        weight = 1.8;
      } else {
        fillColor = '#22c55e'; // Light Green: Low Zone
        color = '#15803d';
        fillOpacity = 0.3;
        weight = 1.6;
      }
    }

    return {
      fillColor,
      weight,
      opacity: 0.85,
      color,
      dashArray: count > 0 ? '' : '3',
      fillOpacity
    };
  };

  useEffect(() => {
    if (!map || !geoData) return;

    if (geoJsonLayerRef.current) {
      if (map?._mapPane) {
        try { map.removeLayer(geoJsonLayerRef.current); } catch {}
      }
      geoJsonLayerRef.current = null;
    }

    if (!visible || !map?._mapPane) return;

    // Calculate maximum problem count across districts for heatmap normalization
    let maxCount = 1;
    geoData.features.forEach((f) => {
      const name = f.properties.district || f.properties.name;
      const cnt = getDistrictCount(name);
      if (cnt > maxCount) maxCount = cnt;
    });

    const layer = L.geoJSON(geoData, {
      style: (feature) => {
        const distName = feature.properties.district || feature.properties.name;
        return getDistrictStyle(distName, maxCount);
      },
      onEachFeature: (feature, l) => {
        const distName = feature.properties.district || feature.properties.name;
        l.on({
          mouseover: (e) => {
            const target = e.target;
            target.setStyle({ weight: 3, color: '#0f172a', fillOpacity: 0.5 });
            if (onHoverDistrict) {
              const count = getDistrictCount(distName);
              onHoverDistrict({ name: distName, total: count });
            }
          },
          mouseout: (e) => {
            layer.resetStyle(e.target);
            if (onHoverDistrict) onHoverDistrict(null);
          },
          click: () => {
            if (onSelectDistrict) onSelectDistrict(distName);
            try {
              if (map?._mapPane) map.flyToBounds(l.getBounds(), { maxZoom: 11, duration: 1 });
            } catch (err) {}
          }
        });
      }
    }).addTo(map);

    geoJsonLayerRef.current = layer;

    return () => {
      if (geoJsonLayerRef.current && map?._mapPane) {
        try { map.removeLayer(geoJsonLayerRef.current); } catch {}
      }
      geoJsonLayerRef.current = null;
    };
  }, [map, visible, geoData, selectedDistrict, districtStats]);

  return null;
};

export default DistrictBoundariesLayer;
