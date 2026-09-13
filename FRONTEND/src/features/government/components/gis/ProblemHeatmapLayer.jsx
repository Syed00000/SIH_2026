import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Ensure L is attached to window globally for leaflet plugins like leaflet.heat
if (typeof window !== 'undefined' && !window.L) {
  window.L = L;
}

const SEVERITY_WEIGHTS = {
  CRITICAL: 1.0,
  HIGH: 0.8,
  MEDIUM: 0.5,
  LOW: 0.3
};

export const ProblemHeatmapLayer = ({ map, problems = [], visible = true }) => {
  const heatLayerRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    const setupHeatmap = async () => {
      if (!map?._mapPane) return;

      if (heatLayerRef.current) {
        try { map.removeLayer(heatLayerRef.current); } catch {}
        heatLayerRef.current = null;
      }

      if (!visible || !Array.isArray(problems) || problems.length === 0) return;

      // Format: [lat, lng, intensity]
      const heatPoints = problems
        .map((p) => {
          const lat = Number(p.latitude);
          const lng = Number(p.longitude);
          if (isNaN(lat) || isNaN(lng) || lat < 20 || lat > 26 || lng < 82 || lng > 89) return null;
          const sev = (p.severity || 'MEDIUM').toUpperCase();
          const weight = SEVERITY_WEIGHTS[sev] || 0.5;
          return [lat, lng, weight];
        })
        .filter(Boolean);

      if (heatPoints.length === 0) return;

      // Ensure leaflet.heat plugin is loaded onto L
      if (!L.heatLayer) {
        if (typeof window !== 'undefined') {
          window.L = L;
        }
        try {
          await import('leaflet.heat');
        } catch (err) {
          console.error('Failed to load leaflet.heat:', err);
          return;
        }
      }

      if (isCancelled || !map?._mapPane) return;

      // Check if L.heatLayer exists
      if (typeof L.heatLayer === 'function') {
        const heat = L.heatLayer(heatPoints, {
          radius: 35,
          blur: 20,
          maxZoom: 12,
          max: 1.0,
          gradient: {
            0.2: '#22c55e',
            0.4: '#facc15',
            0.6: '#fb923c',
            0.8: '#ef4444',
            1.0: '#991b1b'
          }
        }).addTo(map);

        heatLayerRef.current = heat;
      }
    };

    setupHeatmap();

    return () => {
      isCancelled = true;
      if (heatLayerRef.current && map?._mapPane) {
        try { map.removeLayer(heatLayerRef.current); } catch {}
        heatLayerRef.current = null;
      }
    };
  }, [map, problems, visible]);

  return null;
};

export default ProblemHeatmapLayer;
