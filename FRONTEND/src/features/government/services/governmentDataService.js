import apiClient from '../../../infrastructure/api/client.js';
import { JHARKHAND_GEOJSON } from '../data/jharkhandGeoJson.js';

class GovernmentDataService {
  constructor() {
    this.triageItems = [];
  }

  async fetchLiveDatabaseStats() {
    try {
      const res = await apiClient.get('government/overview/stats');
      if (res?.data) return res.data;
    } catch (err) {
      console.error('API fetchLiveDatabaseStats error:', err.message);
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
    return {
      problemsReceived: { value: '0', numeric: 0, growthText: 'Live DB', growthDirection: 'up' },
      activeHeis: { value: '0', numeric: 0, growthText: 'Accredited HEIs', growthDirection: 'up' },
      csrFunds: { value: '₹0.00 Cr', numeric: 0, growthText: 'Committed Funds', growthDirection: 'up' },
      problemsSolved: { value: approvedCount.toLocaleString(), numeric: approvedCount, growthText: 'Resolved', growthDirection: 'up' }
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
