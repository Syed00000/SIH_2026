import apiClient from '../../../infrastructure/api/client.js';
import { JHARKHAND_GEOJSON } from '../data/jharkhandGeoJson.js';

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

  approveTriage(id) {
    this.triageItems = this.triageItems.map((t) => (t.id === id ? { ...t, status: 'APPROVED' } : t));
    return this.triageItems;
  }

  rejectTriage(id) {
    this.triageItems = this.triageItems.map((t) => (t.id === id ? { ...t, status: 'REJECTED' } : t));
    return this.triageItems;
  }

  getFilteredKpis(district = 'All', sector = 'All') {
    const approvedCount = this.triageItems.filter((t) => t.status === 'APPROVED').length;
    const stats = this.statsData;

    const totalHeis = stats?.heis?.total || 0;
    const activeHeis = stats?.heis?.active || totalHeis || 0;
    const realProblemsCount = stats?.problems?.total ?? stats?.citizens?.total ?? 0;
    
    // Live Corpus = Corporate CSR + State Grants (Net Available after Disbursal)
    const availableCorpus = stats?.financials?.availableInnovationCorpus || (stats?.financials?.stateGrantsTotal || 0);
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
        growthDirection: 'up'
      },
      activeHeis: {
        value: activeHeis.toLocaleString(),
        numeric: activeHeis,
        growthText: 'Accredited HEIs',
        growthDirection: 'up'
      },
      csrFunds: {
        value: corpusDisplay,
        numeric: availableCorpusCr,
        growthText: 'Available Innovation Pool',
        growthDirection: 'up'
      },
      problemsSolved: {
        value: approvedCount.toLocaleString(),
        numeric: approvedCount,
        growthText: 'Resolved',
        growthDirection: 'up'
      }
    };
  }

  getFilteredSectors(district = 'All', timeframe = 'Quarter') {
    return [];
  }

  getFilteredTrend(district = 'All', sector = 'All', interval = 'Monthly') {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        { label: 'Received', data: [0, 0, 0, 0, 0, 0] },
        { label: 'Solved', data: [0, 0, 0, 0, 0, 0] }
      ]
    };
  }

  getFilteredHeis(district = 'All') {
    return [];
  }

  getGeoJson() {
    return JHARKHAND_GEOJSON;
  }

  getDistrictMetrics(districtName) {
    return {
      district: districtName,
      activeProjects: 0,
      totalFunds: '₹0.0 Cr',
      heisCount: 0,
      problemsSolved: 0,
      status: 'Active'
    };
  }
}

export const governmentDataService = new GovernmentDataService();
export default governmentDataService;
