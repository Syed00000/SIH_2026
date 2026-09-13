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

  useEffect(() => {
    let isMounted = true;
    const fetchMapData = async () => {
      const baseline = buildBaseline();
      try {
        const [citizenRes, statsRes] = await Promise.allSettled([
          apiClient.get('citizen/challenges?limit=100'),
          apiClient.get('government/overview/stats')
        ]);

        if (citizenRes.status === 'fulfilled') {
          const challenges = citizenRes.value.data?.data || citizenRes.value.data || [];
          if (Array.isArray(challenges)) {
            challenges.forEach((c) => {
              const dist = String(c.location?.district || c.district || 'Ranchi').toLowerCase().trim();
              if (baseline[dist]) {
                baseline[dist].totalProblems += 1;
                const sev = String(c.severity || c.priority || 'High').toUpperCase();
                if (c.status === 'Resolved' || c.status === 'COMPLETED') {
                  baseline[dist].resolvedProblems += 1;
                } else {
                  baseline[dist].pendingProblems += 1;
                }
                baseline[dist].riskLevel = sev === 'CRITICAL' ? 'Critical / Urgent' : sev === 'HIGH' ? 'High Concern' : 'Active Need';
                baseline[dist].overallScore = Math.min(100, Math.max(45, baseline[dist].totalProblems * 25));
                if (c.title) {
                  baseline[dist].topProblemAreas = Array.from(new Set([...(baseline[dist].topProblemAreas || []), c.title])).slice(0, 3);
                }
              }
            });
          }
        }

        if (statsRes.status === 'fulfilled') {
          const stats = statsRes.value.data?.data || statsRes.value.data || {};
          const heisByDist = stats.heisByDistrict || [];
          heisByDist.forEach((item) => {
            const dist = String(item._id || 'Ranchi').toLowerCase().trim();
            if (baseline[dist]) {
              baseline[dist].activeHeis = item.count || 0;
            }
          });
        }

        if (isMounted) setDistrictsData(baseline);
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
      if (risk.includes('CRITICAL') || unresolved >= 3) return '#ef4444';
      if (risk.includes('HIGH') || unresolved >= 2) return '#f97316';
      return '#f59e0b';
    }
    if (count > 0 && unresolved === 0) return '#10b981';
    return '#e2e8f0';
  }, [districtsData]);

  return { districtsData, getDistrictColor };
};

export default useJharkhandMapData;
