import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

if (typeof window !== 'undefined' && !window.L) {
  window.L = L;
}

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

const SEVERITY_COLORS = {
  CRITICAL: '#dc2626',
  HIGH: '#ea580c',
  MEDIUM: '#d97706',
  LOW: '#16a34a'
};

export const ProblemMarkersLayer = ({
  map,
  problems = [],
  visible = true,
  onViewProblemDetails,
  onSelectDistrict
}) => {
  const clusterGroupRef = useRef(null);

  useEffect(() => {
    if (clusterGroupRef.current) {
      if (map?._mapPane) {
        try {
          map.removeLayer(clusterGroupRef.current);
          clusterGroupRef.current.clearLayers();
        } catch {}
      }
      clusterGroupRef.current = null;
    }

    if (!visible || !map?._mapPane || !Array.isArray(problems) || problems.length === 0) return;

    const cluster = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 40,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false
    });

    problems.forEach((p) => {
      const lat = Number(p.latitude);
      const lng = Number(p.longitude);
      if (isNaN(lat) || isNaN(lng) || lat < 20 || lat > 26 || lng < 82 || lng > 89) return;

      const sev = (p.severity || 'MEDIUM').toUpperCase();
      const pinColor = SEVERITY_COLORS[sev] || SEVERITY_COLORS.MEDIUM;

      const pinHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div style="position: absolute; bottom: 0; width: 14px; height: 14px; background: ${pinColor}40; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 22px; height: 26px; background: ${pinColor}; border: 2px solid #ffffff; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 6px -1px rgba(0,0,0,0.35);">
            <div style="width: 6px; height: 6px; background: #ffffff; border-radius: 50%; transform: rotate(45deg);"></div>
          </div>
        </div>
      `;

      const pinIcon = L.divIcon({
        className: 'custom-gis-problem-pin',
        html: pinHtml,
        iconSize: [22, 26],
        iconAnchor: [11, 26]
      });

      const marker = L.marker([lat, lng], { icon: pinIcon });

      const popupHtml = `
        <div style="font-family: system-ui, -apple-system, sans-serif; padding: 4px 6px; min-width: 190px;">
          <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 3px; line-height: 1.25;">
            ${p.title || 'Untitled Problem'}
          </div>
          <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 800; color: ${pinColor}; background: ${pinColor}15; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
              ${sev}
            </span>
            <span style="font-size: 10px; font-weight: 600; color: #475569; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">
              ${p.rawStatus || p.status || 'Active'}
            </span>
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 2px;">
            <strong>District:</strong> ${p.district || 'Ranchi'}${p.block ? ` • ${p.block}` : ''}
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">
            <strong>Category:</strong> ${p.category || 'General'}
          </div>
          <button id="view-details-btn-${p.id}" style="width: 100%; background: #007A61; color: #ffffff; font-weight: 700; font-size: 11px; padding: 5px 8px; border-radius: 6px; border: none; cursor: pointer; transition: background 0.15s;">
            View Details
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-details-btn-${p.id}`);
        if (btn && onViewProblemDetails) {
          btn.onclick = () => onViewProblemDetails(p);
        }
      });

      marker.on('click', () => {
        if (onSelectDistrict && p.district) onSelectDistrict(p.district);
      });

      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
    clusterGroupRef.current = cluster;

    return () => {
      if (clusterGroupRef.current && map?._mapPane) {
        try { map.removeLayer(clusterGroupRef.current); } catch {}
      }
      clusterGroupRef.current = null;
    };
  }, [map, problems, visible, onViewProblemDetails, onSelectDistrict]);

  return null;
};

export default ProblemMarkersLayer;
