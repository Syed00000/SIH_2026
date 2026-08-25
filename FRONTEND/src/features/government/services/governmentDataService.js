import {
  MOCK_KPI_SUMMARY,
  MOCK_AI_TRIAGE_FEED,
  MOCK_SECTORS_DATA,
  MOCK_TREND_DATA,
  MOCK_TOP_HEIS,
  MOCK_CSR_GRANTS,
  MOCK_AUDIT_LOGS
} from '../data/mockGovernmentData.js';
import { JHARKHAND_GEOJSON } from '../data/jharkhandGeoJson.js';

const STORAGE_KEYS = {
  TRIAGE: 'joharsetu_gov_triage',
  HEIS: 'joharsetu_gov_heis',
  AUDIT: 'joharsetu_gov_audit',
  KPI: 'joharsetu_gov_kpis'
};

class GovernmentDataService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEYS.TRIAGE)) {
      localStorage.setItem(STORAGE_KEYS.TRIAGE, JSON.stringify(MOCK_AI_TRIAGE_FEED));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(MOCK_AUDIT_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.HEIS)) {
      localStorage.setItem(STORAGE_KEYS.HEIS, JSON.stringify(MOCK_TOP_HEIS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.KPI)) {
      localStorage.setItem(STORAGE_KEYS.KPI, JSON.stringify(MOCK_KPI_SUMMARY));
    }
  }

  // Dynamic KPI calculation based on District & Sector filters
  getFilteredKpis(district = 'All', sector = 'All') {
    const rawTriage = this.getTriageFeed();
    const approvedCount = rawTriage.filter(t => t.status === 'APPROVED').length;

    if (district === 'All' && sector === 'All') {
      const baseSolved = 10850 + approvedCount;
      return {
        problemsReceived: { value: "12,450", numeric: 12450, growthText: "+320 this week", growthDirection: "up" },
        activeHeis: { value: "340", numeric: 340, growthText: "+18 this month", growthDirection: "up" },
        csrFunds: { value: "₹4.2 Cr", numeric: 42000000, growthText: "+₹1.1 Cr this month", growthDirection: "up" },
        problemsSolved: { value: baseSolved.toLocaleString(), numeric: baseSolved, growthText: `+${410 + approvedCount} this week`, growthDirection: "up" }
      };
    }

    // Find district in GeoJSON
    const feat = JHARKHAND_GEOJSON.features.find(
      f => f.properties.name.toLowerCase() === district.toLowerCase()
    );

    let baseProblems = feat ? feat.properties.problems : 12450;
    let baseSolved = feat ? feat.properties.solved + approvedCount : 10850 + approvedCount;
    let baseHeis = feat ? feat.properties.activeHeis : 340;
    let baseFunds = feat ? `₹${(feat.properties.problems * 0.03).toFixed(1)}L` : '₹4.2 Cr';

    if (sector !== 'All') {
      baseProblems = Math.round(baseProblems * 0.22);
      baseSolved = Math.round(baseSolved * 0.22);
    }

    return {
      problemsReceived: { value: baseProblems.toLocaleString(), numeric: baseProblems, growthText: "+28 this week", growthDirection: "up" },
      activeHeis: { value: baseHeis.toString(), numeric: baseHeis, growthText: "+2 this month", growthDirection: "up" },
      csrFunds: { value: baseFunds, numeric: 1200000, growthText: "+₹2.5L this month", growthDirection: "up" },
      problemsSolved: { value: baseSolved.toLocaleString(), numeric: baseSolved, growthText: "+34 this week", growthDirection: "up" }
    };
  }

  // Dynamic Sector Distribution based on Timeframe and District
  getFilteredSectors(district = 'All', timeframe = 'This Month') {
    let multiplier = 1;
    if (timeframe === 'Last Month') multiplier = 0.74;
    else if (timeframe === 'This Quarter') multiplier = 2.8;
    else if (timeframe === 'Year 2026') multiplier = 5.2;
    else if (timeframe === 'Today' || timeframe === 'Daily') multiplier = 0.035;

    if (district !== 'All') {
      const feat = JHARKHAND_GEOJSON.features.find(
        f => f.properties.name.toLowerCase() === district.toLowerCase()
      );
      if (feat) {
        multiplier *= (feat.properties.problems / 12450);
      }
    }

    const baseData = [
      { name: "Water Management", count: Math.round(2850 * multiplier), percentage: 22, color: "#3b82f6" },
      { name: "Infrastructure", count: Math.round(2430 * multiplier), percentage: 20, color: "#f97316" },
      { name: "Education", count: Math.round(1980 * multiplier), percentage: 16, color: "#a855f7" },
      { name: "Health", count: Math.round(1560 * multiplier), percentage: 12, color: "#ef4444" },
      { name: "Sanitation", count: Math.round(1350 * multiplier), percentage: 11, color: "#10b981" },
      { name: "Agriculture", count: Math.round(1150 * multiplier), percentage: 9, color: "#eab308" },
      { name: "Others", count: Math.round(1130 * multiplier), percentage: 9, color: "#64748b" }
    ];

    const total = baseData.reduce((sum, s) => sum + s.count, 0) || 1;
    return baseData.map(s => ({
      ...s,
      percentage: Math.round((s.count / total) * 100)
    }));
  }

  // Dynamic Trend Graph based on Interval (Monthly, Weekly, Daily) and Filters
  getFilteredTrend(district = 'All', sector = 'All', interval = 'Monthly') {
    let scale = 1;
    if (district !== 'All') {
      const feat = JHARKHAND_GEOJSON.features.find(
        f => f.properties.name.toLowerCase() === district.toLowerCase()
      );
      if (feat) scale = feat.properties.problems / 12450;
    }

    if (interval === 'Daily') {
      const dailyPoints = [
        { month: "Mon", count: Math.round(380 * scale) },
        { month: "Tue", count: Math.round(420 * scale) },
        { month: "Wed", count: Math.round(410 * scale) },
        { month: "Thu", count: Math.round(490 * scale) },
        { month: "Fri", count: Math.round(540 * scale) },
        { month: "Sat", count: Math.round(610 * scale) },
        { month: "Sun", count: Math.round(680 * scale) }
      ];
      return {
        interval: 'Daily',
        points: dailyPoints,
        thisMonth: `${Math.round(680 * scale).toLocaleString()}`,
        lastMonth: `${Math.round(610 * scale).toLocaleString()}`,
        growth: "11.47% ↑",
        currentLabel: "Today",
        prevLabel: "Yesterday"
      };
    }

    if (interval === 'Weekly') {
      const weeklyPoints = [
        { month: "Week 1", count: Math.round(2420 * scale) },
        { month: "Week 2", count: Math.round(2780 * scale) },
        { month: "Week 3", count: Math.round(3150 * scale) },
        { month: "Week 4", count: Math.round(4100 * scale) }
      ];
      return {
        interval: 'Weekly',
        points: weeklyPoints,
        thisMonth: `${Math.round(4100 * scale).toLocaleString()}`,
        lastMonth: `${Math.round(3150 * scale).toLocaleString()}`,
        growth: "30.15% ↑",
        currentLabel: "This Week",
        prevLabel: "Last Week"
      };
    }

    // Default: Monthly (Last 6 Months)
    const monthlyPoints = [
      { month: "Dec 2025", count: Math.round(6240 * scale) },
      { month: "Jan 2026", count: Math.round(6980 * scale) },
      { month: "Feb 2026", count: Math.round(7120 * scale) },
      { month: "Mar 2026", count: Math.round(8050 * scale) },
      { month: "Apr 2026", count: Math.round(9200 * scale) },
      { month: "May 2026", count: Math.round(12450 * scale) }
    ];

    return {
      interval: 'Monthly',
      points: monthlyPoints,
      thisMonth: `${Math.round(12450 * scale).toLocaleString()}`,
      lastMonth: `${Math.round(9200 * scale).toLocaleString()}`,
      growth: "35.33% ↑",
      currentLabel: "This Month",
      prevLabel: "Last Month"
    };
  }

  // Dynamic HEIs filtering
  getFilteredHeis(district = 'All') {
    const list = this.getTopHeis();
    if (district === 'All') return list;

    // Put matching district HEIs at top
    const matched = list.filter(h => h.leadDistrict?.toLowerCase().includes(district.toLowerCase()));
    const rest = list.filter(h => !h.leadDistrict?.toLowerCase().includes(district.toLowerCase()));
    return [...matched, ...rest];
  }

  getTriageFeed() {
    if (typeof window === 'undefined') return MOCK_AI_TRIAGE_FEED;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRIAGE);
      return data ? JSON.parse(data) : MOCK_AI_TRIAGE_FEED;
    } catch {
      return MOCK_AI_TRIAGE_FEED;
    }
  }

  approveTriage(id) {
    const list = this.getTriageFeed();
    const updated = list.map(item => {
      if (item.id === id) {
        return { ...item, status: 'APPROVED' };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEYS.TRIAGE, JSON.stringify(updated));
    this.addAuditLog(`Approved AI Triage problem #${id} and matched with ${updated.find(x => x.id === id)?.recommendedHei || 'University'}`);
    return updated;
  }

  rejectTriage(id) {
    const list = this.getTriageFeed();
    const updated = list.map(item => {
      if (item.id === id) {
        return { ...item, status: 'REJECTED' };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEYS.TRIAGE, JSON.stringify(updated));
    this.addAuditLog(`Rejected AI Triage problem #${id} due to verification criteria mismatch`);
    return updated;
  }

  getTopHeis() {
    if (typeof window === 'undefined') return MOCK_TOP_HEIS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HEIS);
      return data ? JSON.parse(data) : MOCK_TOP_HEIS;
    } catch {
      return MOCK_TOP_HEIS;
    }
  }

  getAuditLogs() {
    if (typeof window === 'undefined') return MOCK_AUDIT_LOGS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT);
      return data ? JSON.parse(data) : MOCK_AUDIT_LOGS;
    } catch {
      return MOCK_AUDIT_LOGS;
    }
  }

  addAuditLog(actionText) {
    const logs = this.getAuditLogs();
    const newEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      actor: 'Admin (Super Admin)',
      action: actionText,
      ip: '10.0.12.4'
    };
    const updated = [newEntry, ...logs.slice(0, 49)];
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(updated));
  }
}

export const governmentDataService = new GovernmentDataService();
export default governmentDataService;
