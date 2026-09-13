import L from 'leaflet';

/**
 * Creates an interactive Leaflet LayerGroup populated with glowing problem pinpoint markers.
 * @param {Array} liveProblemPins
 * @returns {L.LayerGroup}
 */
export const createProblemMarkersGroup = (liveProblemPins = []) => {
  const markersGroup = L.layerGroup();

  liveProblemPins.forEach((pin) => {
    if (!pin.lat || !pin.lng) return;
    const isCritical = String(pin.priority || '').toLowerCase() === 'critical';

    const customIcon = L.divIcon({
      className: 'custom-gis-pin',
      html: `
        <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${isCritical ? '#ef4444' : '#f97316'}; opacity: 0.55; animation: ping 1.8s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="width: 22px; height: 22px; border-radius: 50%; background: ${isCritical ? '#dc2626' : '#ea580c'}; color: white; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; border: 2px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.35); text-align: center; line-height: 18px;">
            !
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14]
    });

    const marker = L.marker([pin.lat, pin.lng], { icon: customIcon });

    const popupHtml = `
      <div style="min-width: 220px; max-width: 260px; font-family: inherit;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
          <span style="font-size: 9px; font-weight: 800; background: ${isCritical ? '#fee2e2' : '#ffedd5'}; color: ${isCritical ? '#991b1b' : '#9a3412'}; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
            ${pin.priority} • ${pin.domain}
          </span>
          <span style="font-size: 9.5px; font-weight: 700; color: #64748b;">${pin.id}</span>
        </div>
        <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-bottom: 4px; line-height: 1.35;">
          ${pin.title}
        </div>
        <div style="font-size: 10.5px; color: #475569; margin-bottom: 6px; line-height: 1.3;">
          📍 ${pin.address}
        </div>
        <div style="font-size: 10px; font-weight: 700; color: #007A61; border-top: 1px solid #f1f5f9; padding-top: 4px; display: flex; justify-content: space-between;">
          <span>Status: ${pin.status}</span>
          <span style="color: #64748b;">${pin.district}</span>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml, { maxWidth: 280 });
    markersGroup.addLayer(marker);
  });

  return markersGroup;
};

export default createProblemMarkersGroup;
