import apiClient from '../../../infrastructure/api/client.js';
import { JHARKHAND_GEOJSON } from '../data/jharkhandGeoJson.js';
import { JHARKHAND_DISTRICTS_LIST, SECTORS_LIST } from '../data/governmentConstants.js';

class GovernmentDataService {
  constructor() {
    this.triageItems = [
      { id: 'TRG-01', title: 'Groundwater Arsenic Detection Node', district: 'Dumka', sector: 'Water & Sanitation', status: 'PENDING', confidence: '96%', date: '22 May 2026' },
      { id: 'TRG-02', title: 'Solar Cold Chain for Tribal Produce', district: 'Ranchi', sector: 'Agriculture & Food Security', status: 'APPROVED', confidence: '92%', date: '21 May 2026' },
      { id: 'TRG-03', title: 'Underground Seismic Gas Monitor', district: 'Dhanbad', sector: 'Renewable Energy', status: 'PENDING', confidence: '98%', date: '20 May 2026' }
    ];
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
    const baseSolved = 11260 + approvedCount;
    return {
      problemsReceived: { value: '12,450', numeric: 12450, growthText: '+320 this week', growthDirection: 'up' },
      activeHeis: { value: '12', numeric: 12, growthText: '100% Accredited', growthDirection: 'up' },
      csrFunds: { value: '₹73.50 Cr', numeric: 73.5, growthText: 'Committed Funds', growthDirection: 'up' },
      problemsSolved: { value: baseSolved.toLocaleString(), numeric: baseSolved, growthText: `+${410 + approvedCount} this week`, growthDirection: 'up' }
    };
  }

  getFilteredSectors(district = 'All', timeframe = 'Quarter') {
    return [
      { name: 'Water & Sanitation', count: 48, percentage: 32, color: '#3b82f6' },
      { name: 'Agriculture & Food', count: 36, percentage: 24, color: '#10b981' },
      { name: 'Healthcare & Nutrition', count: 28, percentage: 19, color: '#8b5cf6' },
      { name: 'Rural Infrastructure', count: 22, percentage: 15, color: '#f59e0b' },
      { name: 'Renewable Energy', count: 16, percentage: 10, color: '#06b6d4' }
    ];
  }

  getFilteredTrend(district = 'All', sector = 'All', interval = 'Monthly') {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        { label: 'Received', data: [120, 190, 240, 310, 420, 560] },
        { label: 'Solved', data: [80, 140, 190, 260, 380, 510] }
      ]
    };
  }

  getFilteredHeis(district = 'All') {
    return [
      { id: 'HEI-01', name: 'BIT Sindri', district: 'Dhanbad', activeProjects: 8, solvedChallenges: 24, score: '98%' },
      { id: 'HEI-02', name: 'NIT Jamshedpur', district: 'East Singhbhum', activeProjects: 6, solvedChallenges: 19, score: '96%' },
      { id: 'HEI-03', name: 'Ranchi University', district: 'Ranchi', activeProjects: 10, solvedChallenges: 32, score: '99%' }
    ];
  }

  getGeoJson() {
    return JHARKHAND_GEOJSON;
  }

  getDistrictMetrics(districtName) {
    return {
      district: districtName,
      activeProjects: 4,
      totalFunds: '₹2.4 Cr',
      heisCount: 1,
      problemsSolved: 48,
      status: 'Active'
    };
  }
}

export const governmentDataService = new GovernmentDataService();
export default governmentDataService;
