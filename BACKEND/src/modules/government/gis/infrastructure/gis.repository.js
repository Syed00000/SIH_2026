import { CitizenChallenge } from '../../../citizen/infrastructure/model.js';

// Fallback centroid coordinates for Jharkhand 24 districts
const DISTRICT_CENTROIDS = {
  ranchi: { lat: 23.3441, lng: 85.3096 },
  dhanbad: { lat: 23.7957, lng: 86.4304 },
  'east singhbhum': { lat: 22.8046, lng: 86.2029 },
  bokaro: { lat: 23.6693, lng: 86.1511 },
  hazaribagh: { lat: 23.9937, lng: 85.3623 },
  deoghar: { lat: 24.4826, lng: 86.7001 },
  dumka: { lat: 24.2677, lng: 87.2535 },
  palamu: { lat: 24.0416, lng: 84.0725 },
  'west singhbhum': { lat: 22.5526, lng: 85.8081 },
  giridih: { lat: 24.1856, lng: 86.3093 },
  ramgarh: { lat: 23.6307, lng: 85.5186 },
  'seraikela kharsawan': { lat: 22.7001, lng: 85.9287 },
  khunti: { lat: 23.0729, lng: 85.2789 },
  gumla: { lat: 23.0428, lng: 84.5414 },
  simdega: { lat: 22.6167, lng: 84.5000 },
  lohardaga: { lat: 23.4317, lng: 84.6811 },
  latehar: { lat: 23.7431, lng: 84.4984 },
  garhwa: { lat: 24.1611, lng: 83.8078 },
  chatra: { lat: 24.2083, lng: 84.8717 },
  koderma: { lat: 24.4697, lng: 85.5947 },
  jamtara: { lat: 23.9622, lng: 86.8017 },
  godda: { lat: 24.8267, lng: 87.2144 },
  sahibganj: { lat: 25.2425, lng: 87.6436 },
  sahebganj: { lat: 25.2425, lng: 87.6436 },
  pakur: { lat: 24.6333, lng: 87.8500 }
};

function parseCoordinates(str) {
  if (!str || typeof str !== 'string') return null;
  const cleaned = str.replace(/[°NSEW]/gi, '').trim();
  const parts = cleaned.split(/[, ]+/).filter(Boolean);
  if (parts.length >= 2) {
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= 21.5 && lat <= 25.5 && lng >= 83.0 && lng <= 88.0) {
      return { lat, lng };
    }
  }
  return null;
}

function resolveCoordinates(challenge, index) {
  if (challenge.location?.geoJSON?.coordinates?.length === 2) {
    const [lng, lat] = challenge.location.geoJSON.coordinates;
    if (lat >= 21.5 && lat <= 25.5 && lng >= 83.0 && lng <= 88.0) {
      return { latitude: lat, longitude: lng };
    }
  }
  const parsed = parseCoordinates(challenge.location?.coordinates);
  if (parsed) {
    return { latitude: parsed.lat, longitude: parsed.lng };
  }
  const distKey = String(challenge.district || challenge.location?.district || 'ranchi')
    .toLowerCase()
    .replace(/[-_]/g, ' ')
    .trim();
  const centroid = DISTRICT_CENTROIDS[distKey] || DISTRICT_CENTROIDS.ranchi;
  const hash = Math.abs(String(challenge.challengeId || index).split('').reduce((a, c) => a + c.charCodeAt(0), 0));
  const offsetLat = ((hash % 17) - 8) * 0.005;
  const offsetLng = (((hash * 7) % 17) - 8) * 0.005;
  return {
    latitude: Number((centroid.lat + offsetLat).toFixed(4)),
    longitude: Number((centroid.lng + offsetLng).toFixed(4))
  };
}

export class GisRepository {
  async findProblems(filters = {}) {
    const query = { isDeleted: { $ne: true } };

    if (filters.district && filters.district !== 'all' && filters.district !== 'All Districts') {
      const reg = new RegExp(`^${filters.district.trim()}$`, 'i');
      query.$or = [{ district: reg }, { 'location.district': reg }];
    }
    if (filters.category && filters.category !== 'all') {
      query.domain = new RegExp(`^${filters.category.trim()}$`, 'i');
    }
    if (filters.severity && filters.severity !== 'all') {
      const s = filters.severity.toLowerCase();
      if (s === 'high' || s === 'critical') {
        query.priority = { $in: ['High', 'Critical'] };
      } else if (s === 'normal' || s === 'medium' || s === 'low') {
        query.priority = { $in: ['Medium', 'Low'] };
      } else {
        query.priority = filters.severity;
      }
    }
    if (filters.status && filters.status !== 'all') {
      const formattedStatus = filters.status.replace(/_/g, ' ');
      query.status = new RegExp(`^${formattedStatus}$`, 'i');
    }
    if (filters.dateFrom || filters.dateTo) {
      query.submittedAt = {};
      if (filters.dateFrom) query.submittedAt.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) query.submittedAt.$lte = new Date(filters.dateTo);
    }

    const challenges = await CitizenChallenge.find(query)
      .select('challengeId title district domain priority status location submittedAt isDeployed')
      .lean();

    return challenges.map((c, idx) => {
      const coords = resolveCoordinates(c, idx);
      const sev = (c.priority || 'Medium').toUpperCase();
      const st = (c.status || 'Under Review').toUpperCase().replace(/\s+/g, '_');
      return {
        id: c.challengeId || String(c._id),
        title: c.title || 'Untitled Problem Statement',
        latitude: coords.latitude,
        longitude: coords.longitude,
        district: c.district || c.location?.district || 'Ranchi',
        block: c.location?.block || '',
        category: c.domain || 'General',
        severity: sev,
        status: st,
        rawStatus: c.status || 'Under Review',
        rawSeverity: c.priority || 'Medium',
        submittedAt: c.submittedAt
      };
    });
  }
}

export const gisRepository = new GisRepository();
export default gisRepository;
