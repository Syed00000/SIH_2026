import apiClient from '../../../infrastructure/api/client.js';
import { JHARKHAND_GEOJSON } from '../data/jharkhandGeoJson.js';

const SECTOR_COLORS = {
  Water: '#3b82f6',
  'Water Resources': '#3b82f6',
  Agriculture: '#10b981',
  Healthcare: '#ef4444',
  Health: '#ef4444',
  Education: '#8b5cf6',
  'Urban Development': '#f59e0b',
  Energy: '#eab308',
  Environment: '#14b8a6',
  Accessibility: '#06b6d4',
  'Rural Livelihoods': '#84cc16'
};

class GovernmentDataService {
  constructor() {
    this.triageItems = [];
    this.statsData = null;
    this.fetchLiveDatabaseStats();
  }

  async fetchLiveDatabaseStats() {
    try {
      const res = await apiClient.get('government/overview/stats');
      const data = res?.data?.data || res?.data;
      if (data) {
        this.statsData = data;
        if (Array.isArray(data.recentChallenges) && data.recentChallenges.length > 0) {
          this.triageItems = data.recentChallenges.map((c) => ({
            id: c.challengeId || String(c._id),
            title: c.title || 'Citizen Problem',
            category: (c.domain || 'OTHER').toUpperCase(),
            district: c.district || c.location?.district || 'Ranchi',
            fullAddress: c.location?.address || `${c.district || 'Ranchi'} | ${c.domain || 'General'}`,
            confidence: c.confidence || 92,
            status: c.status === 'Resolved' || c.status === 'Accepted' ? 'APPROVED' : c.status === 'Rejected' ? 'REJECTED' : 'PENDING'
          }));
        }
        return data;
      }
    } catch (err) {
      console.warn('API fetchLiveDatabaseStats error:', err.message);
    }
    return null;
  }

  getTriageFeed() {
    return this.triageItems;
  }

  async approveTriage(id) {
    this.triageItems = this.triageItems.map((t) => (t.id === id ? { ...t, status: 'APPROVED' } : t));
    try {
      await apiClient.patch(`citizen/challenges/${id}/triage`, {
        status: 'Under Review',
        acceptanceStatus: 'Accepted'
      });
    } catch (err) {
      console.warn('Failed to persist triage approval to backend:', err.message);
    }
    return this.triageItems;
  }

  async rejectTriage(id) {
    this.triageItems = this.triageItems.map((t) => (t.id === id ? { ...t, status: 'REJECTED' } : t));
    try {
      await apiClient.patch(`citizen/challenges/${id}/triage`, {
        status: 'Rejected',
        acceptanceStatus: 'Declined'
      });
    } catch (err) {
      console.warn('Failed to persist triage rejection to backend:', err.message);
    }
    return this.triageItems;
  }

  getFilteredKpis(district = 'All', sector = 'All') {
    const stats = this.statsData;

    const totalHeis = stats?.heis?.total || 0;
    const activeHeis = stats?.heis?.active || totalHeis || 0;
    const realProblemsCount = stats?.problems?.received ?? stats?.problems?.total ?? 0;
    const solvedCount = stats?.problems?.solved ?? this.triageItems.filter((t) => t.status === 'APPROVED').length;
    const resolutionRate = stats?.problems?.resolutionRate ?? (realProblemsCount > 0 ? Math.round((solvedCount / realProblemsCount) * 100) : 0);

    const availableCorpus = stats?.financials?.availableInnovationCorpus ?? stats?.financials?.stateGrantsTotal ?? 0;
    const availableCorpusCr = stats?.financials?.availableInnovationCorpusCr || stats?.financials?.totalInnovationCorpusCr || 0;

    let corpusDisplay = `₹ ${availableCorpus.toLocaleString('en-IN')}`;
    if (availableCorpus >= 10000000) {
      corpusDisplay = `₹ ${availableCorpusCr.toFixed(2)} Cr`;
    } else if (availableCorpus >= 100000) {
      corpusDisplay = `₹ ${(availableCorpus / 100000).toFixed(2)} L`;
    } else if (availableCorpus === 0) {
      corpusDisplay = '₹ 0.00';
    }

    return {
      problemsReceived: {
        value: realProblemsCount.toLocaleString('en-IN'),
        numeric: realProblemsCount,
        growthText: 'Verified Citizen Grievances',
        indicator: 'Total Inflow',
        growthDirection: 'up'
      },
      activeHeis: {
        value: activeHeis.toLocaleString('en-IN'),
        numeric: activeHeis,
        growthText: 'Accredited HEIs',
        indicator: 'All 24 Districts',
        growthDirection: 'up'
      },
      csrFunds: {
        value: corpusDisplay,
        numeric: availableCorpusCr,
        growthText: 'Available Innovation Pool',
        indicator: 'Govt. Approved',
        growthDirection: 'up'
      },
      problemsSolved: {
        value: solvedCount.toLocaleString('en-IN'),
        numeric: solvedCount,
        rate: resolutionRate,
        growthText: `${resolutionRate}% Resolution Rate`,
        indicator: 'Verified Solved',
        growthDirection: 'up'
      }
    };
  }

  getFilteredSectors(district = 'All', timeframe = 'Quarter') {
    const rawSectors = this.statsData?.sectors || [];
    const total = rawSectors.reduce((acc, curr) => acc + (curr.count || 0), 0);
    return rawSectors.map((s) => ({
      name: s.name,
      count: s.count,
      percentage: total > 0 ? Math.round((s.count / total) * 100) : 0,
      color: SECTOR_COLORS[s.name] || '#64748b'
    }));
  }

  getFilteredTrend(district = 'All', sector = 'All', interval = 'Monthly') {
    const total = this.statsData?.problems?.total || 0;
    return {
      points: [
        { month: 'Apr', count: 0 },
        { month: 'May', count: 0 },
        { month: 'Jun', count: 0 },
        { month: 'Jul', count: 0 },
        { month: 'Aug', count: 0 },
        { month: 'Sep', count: total }
      ]
    };
  }

  getFilteredHeis(district = 'All') {
    const list = this.statsData?.topHeis || [];
    if (!district || district === 'All' || district === 'All Districts') {
      return list;
    }
    return list.filter((h) => String(h.district).toLowerCase() === district.toLowerCase());
  }

  getGeoJson() {
    return JHARKHAND_GEOJSON;
  }
}

export const governmentDataService = new GovernmentDataService();
export default governmentDataService;
