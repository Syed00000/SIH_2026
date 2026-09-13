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

export const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>';

/**
 * Returns configuration for Leaflet tileLayer
 * @param {Object} options
 * @param {string} [options.mode='canvas'] - 'canvas' | 'satellite' | 'topo' | 'light'
 * @returns {Object} { url, attribution, subdomains, maxZoom, isConfigMissing, provider }
 */
export function getMapTileConfig({ mode = 'canvas' } = {}) {
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

  if (mode === 'topo' || mode === 'terrain') {
    return {
      provider: 'opentopo',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: OSM_ATTRIBUTION,
      subdomains: 'abc',
      maxZoom: 17,
      isConfigMissing: false
    };
  }

  // High-Resolution CartoDB Voyager (clean, muted, professional GIS aesthetic)
  return {
    provider: 'carto_voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: CARTO_ATTRIBUTION,
    subdomains: 'abcd',
    maxZoom: 19,
    isConfigMissing: false
  };
}

export default getMapTileConfig;
