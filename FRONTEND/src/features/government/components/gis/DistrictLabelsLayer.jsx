import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { JHARKHAND_DISTRICTS_META } from '../../data/jharkhandDistrictsMeta.js';

export const DistrictLabelsLayer = ({
  map,
  visible = true,
  selectedDistrict = 'All Districts',
  onSelectDistrict,
  districtStats = {}
}) => {
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    if (layerGroupRef.current) {
      map.removeLayer(layerGroupRef.current);
      layerGroupRef.current.clearLayers();
      layerGroupRef.current = null;
    }

    if (!visible) return;

    const group = L.layerGroup();

    const getCount = (name) => {
      if (!name || !districtStats) return 0;
      const n = String(name).toLowerCase().trim();
      const raw = districtStats[name] ?? districtStats[n];
      if (typeof raw === 'number') return raw;
      if (raw && typeof raw.total === 'number') return raw.total;
      for (const [k, v] of Object.entries(districtStats)) {
        if (k.toLowerCase().replace(/[^a-z]/g, '') === n.replace(/[^a-z]/g, '')) {
          return typeof v === 'number' ? v : (v?.total || 0);
        }
      }
      return 0;
    };

    JHARKHAND_DISTRICTS_META.forEach((dist) => {
      const isSelected =
        selectedDistrict &&
        selectedDistrict !== 'All Districts' &&
        dist.name.toLowerCase() === selectedDistrict.toLowerCase();

      const count = getCount(dist.name);

      const labelHtml = `
        <div class="district-name-badge" style="
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 7px;
          border-radius: 6px;
          background: ${isSelected ? '#007A61' : 'rgba(255, 255, 255, 0.92)'};
          color: ${isSelected ? '#ffffff' : '#0f172a'};
          border: 1.5px solid ${isSelected ? '#004d3d' : '#94a3b8'};
          box-shadow: 0 2px 5px rgba(0,0,0,0.18);
          font-family: system-ui, -apple-system, sans-serif;
          font-size: ${isSelected ? '12px' : '11px'};
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          transition: all 0.15s ease;
          user-select: none;
        ">
          <span>${dist.name}</span>
          ${count > 0 ? `<span style="
            background: ${isSelected ? '#ffffff' : '#007A61'};
            color: ${isSelected ? '#007A61' : '#ffffff'};
            font-size: 9px;
            font-weight: 800;
            padding: 1px 4px;
            border-radius: 9999px;
          ">${count}</span>` : ''}
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-district-center-label',
        html: labelHtml,
        iconSize: [80, 24],
        iconAnchor: [40, 12]
      });

      const marker = L.marker([dist.lat, dist.lng], { icon, interactive: true });

      marker.on('click', () => {
        if (onSelectDistrict) onSelectDistrict(dist.name);
        try {
          map.flyTo([dist.lat, dist.lng], 10.5, { duration: 1 });
        } catch (e) {}
      });

      group.addLayer(marker);
    });

    map.addLayer(group);
    layerGroupRef.current = group;

    return () => {
      if (layerGroupRef.current && map) {
        map.removeLayer(layerGroupRef.current);
      }
    };
  }, [map, visible, selectedDistrict, districtStats, onSelectDistrict]);

  return null;
};

export default DistrictLabelsLayer;
