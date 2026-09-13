import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../../infrastructure/api/client.js';
import { JHARKHAND_DISTRICTS_DICT } from '../../data/jharkhandDistrictsMeta.js';

const buildBaseline = () => {
  const baseline = {};
  Object.keys(JHARKHAND_DISTRICTS_DICT).forEach((key) => {
    baseline[key] = {
      ...JHARKHAND_DISTRICTS_DICT[key],
      overallScore: 0,
      riskLevel: 'Zero / Clean',
      totalProblems: 0,
      resolvedProblems: 0,
      pendingProblems: 0,
      activeHeis: 0,
      topProblemAreas: []
    };
  });
  return baseline;
};

export const useJharkhandMapData = () => {
  const [districtsData, setDistrictsData] = useState(buildBaseline);
  const [liveProblemPins, setLiveProblemPins] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchMapData = async () => {
      const baseline = buildBaseline();
      const pins = [];

      try {
        const [citizenRes, statsRes] = await Promise.allSettled([
          apiClient.get('citizen/challenges?limit=100'),
          apiClient.get('government/overview/stats')
        ]);

        if (citizenRes.status === 'fulfilled') {
          const raw = citizenRes.value.data;
          const challenges = raw?.data?.challenges || raw?.challenges || (Array.isArray(raw?.data) ? raw.data : []);

          if (Array.isArray(challenges)) {
            challenges.forEach((c, idx) => {
              const rawDist = String(c.location?.district || c.district || 'Ranchi').toLowerCase().trim();
              const distKey = rawDist.replace(/\s+/g, '_');
              const targetDist = baseline[distKey] ? distKey : baseline[rawDist] ? rawDist : 'ranchi';

              baseline[targetDist].totalProblems += 1;
              const sev = String(c.priority || c.severity || 'Medium').toUpperCase();
              if (c.status === 'Resolved' || c.status === 'COMPLETED') {
                baseline[targetDist].resolvedProblems += 1;
              } else {
                baseline[targetDist].pendingProblems += 1;
              }
              baseline[targetDist].riskLevel =
                sev === 'CRITICAL' ? 'Critical / Urgent' : sev === 'HIGH' ? 'High Concern' : 'Active Need';
              baseline[targetDist].overallScore = Math.min(100, Math.max(45, baseline[targetDist].totalProblems * 25));

              if (c.title) {
                baseline[targetDist].topProblemAreas = Array.from(
                  new Set([...(baseline[targetDist].topProblemAreas || []), c.title])
                ).slice(0, 3);
              }

              // Extract or synthesize accurate geographic pin position
              const meta = JHARKHAND_DISTRICTS_DICT[targetDist] || JHARKHAND_DISTRICTS_DICT['ranchi'];
              let lat = null;
              let lng = null;

              if (c.location?.coordinates) {
                if (typeof c.location.coordinates === 'string' && c.location.coordinates.includes(',')) {
                  const [pLat, pLng] = c.location.coordinates.split(',').map(Number);
                  if (!isNaN(pLat) && !isNaN(pLng) && pLat > 21 && pLat < 26) {
                    lat = pLat;
                    lng = pLng;
                  }
                }
              }

              if (!lat || !lng) {
                // Micro-fanout around district centroid for distinct clickable pins
                const angle = idx * 1.35;
                const radius = 0.035 + (idx % 4) * 0.018;
                lat = (meta?.lat || 23.3441) + Math.cos(angle) * radius;
                lng = (meta?.lng || 85.3096) + Math.sin(angle) * radius;
              }

              pins.push({
                id: c.challengeId || c.id || String(c._id),
                title: c.title || 'Citizen Problem',
                domain: c.domain || 'General',
                priority: c.priority || 'Medium',
                status: c.status || 'Under Review',
                district: c.district || meta?.name || 'Ranchi',
                address: c.location?.fullAddress || c.location?.address || `${c.district || 'Ranchi'}, Jharkhand`,
                lat,
                lng
              });
            });
          }
        }

        if (statsRes.status === 'fulfilled') {
          const stats = statsRes.value.data?.data || statsRes.value.data || {};
          const heisByDist = stats.heisByDistrict || [];
          heisByDist.forEach((item) => {
            const distKey = String(item._id || 'Ranchi').toLowerCase().trim().replace(/\s+/g, '_');
            if (baseline[distKey]) {
              baseline[distKey].activeHeis = item.count || 0;
            }
          });
        }

        if (isMounted) {
          setDistrictsData(baseline);
          setLiveProblemPins(pins);
        }
      } catch (err) {
        console.warn('Failed to load dynamic GIS map data:', err);
      }
    };

    fetchMapData();
    return () => { isMounted = false; };
  }, []);

  const getDistrictColor = useCallback((distId) => {
    const data = districtsData[distId];
    if (!data) return '#f8fafc';
    const count = data.totalProblems || 0;
    const resolved = data.resolvedProblems || 0;
    const unresolved = count - resolved;
    const risk = String(data.riskLevel || '').toUpperCase();

    if (unresolved > 0) {
      if (risk.includes('CRITICAL') || unresolved >= 4) return '#dc2626'; // Deep Red Hotspot
      if (risk.includes('HIGH') || unresolved >= 2) return '#ea580c'; // Warm Orange
      return '#f59e0b'; // Amber
    }
    if (count > 0 && unresolved === 0) return '#10b981'; // Green Resolved
    return '#f1f5f9'; // Clean / Zero
  }, [districtsData]);

  return { districtsData, liveProblemPins, getDistrictColor };
};

export default useJharkhandMapData;
