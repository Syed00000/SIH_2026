/**
 * Reusable Map Tile Provider Configuration Abstraction
 * Supports MapTiler raster XYZ tiles with OpenStreetMap / Satellite fallbacks.
 * Keeps map keys secure by reading exclusively from environment variables.
 */

export const MAPTILER_ATTRIBUTION =
  '&copy; <a href="https://www.maptiler.com/" target="_blank" rel="noopener noreferrer">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

export const ESRI_ATTRIBUTION =
  'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

/**
 * Returns configuration for Leaflet tileLayer
 * @param {Object} options
 * @param {string} [options.mode='light'] - 'light' | 'satellite'
 * @returns {Object} { url, attribution, subdomains, maxZoom, isConfigMissing, provider }
 */
export function getMapTileConfig({ mode = 'light' } = {}) {
  const provider = (import.meta.env.VITE_MAP_PROVIDER || 'maptiler').toLowerCase();
  const maptilerApiKey = import.meta.env.VITE_MAPTILER_API_KEY;
  const maptilerMapId = import.meta.env.VITE_MAPTILER_MAP_ID || 'streets-v4';

  if (mode === 'satellite') {
    return {
      provider: 'esri_satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: ESRI_ATTRIBUTION,
      subdomains: ['server', 'services'],
      maxZoom: 19,
      isConfigMissing: false
    };
  }

  // 1. MapTiler Provider (if key is explicitly configured)
  if (provider === 'maptiler' && maptilerApiKey && maptilerApiKey.trim() !== '' && maptilerApiKey !== 'YOUR_MAPTILER_API_KEY') {
    return {
      provider: 'maptiler',
      url: `https://api.maptiler.com/maps/${encodeURIComponent(maptilerMapId)}/256/{z}/{x}/{y}.png?key=${encodeURIComponent(maptilerApiKey)}`,
      attribution: MAPTILER_ATTRIBUTION,
      subdomains: [],
      maxZoom: 19,
      isConfigMissing: false
    };
  }

  // 2. OpenStreetMap / Default High-Resolution Provider (no key required, fully supported)
  return {
    provider: 'osm',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: OSM_ATTRIBUTION,
    subdomains: 'abc',
    maxZoom: 19,
    isConfigMissing: false
  };
}

export default getMapTileConfig;
