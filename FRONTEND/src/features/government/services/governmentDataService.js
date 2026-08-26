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
  KPI: 'joharsetu_gov_kpis',
  ADMINS: 'joharsetu_gov_admins'
};

class GovernmentDataService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    if (typeof window === 'undefined') return;
    const defaults = [
      [STORAGE_KEYS.TRIAGE, MOCK_AI_TRIAGE_FEED],
      [STORAGE_KEYS.AUDIT, MOCK_AUDIT_LOGS],
      [STORAGE_KEYS.HEIS, MOCK_TOP_HEIS],
      [STORAGE_KEYS.KPI, MOCK_KPI_SUMMARY]
    ];
    defaults.forEach(([k, v]) => {
      if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify(v));
    });
  }

  async fetchLiveDatabaseStats() {
    try {
      const res = await fetch('http://localhost:3000/api/v1/government/overview/stats');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // ignore
    }
    return null;
  }

  getFilteredKpis(district = 'All', sector = 'All') {
    const approvedCount = this.getTriageFeed().filter(t => t.status === 'APPROVED').length;
    if (district === 'All' && sector === 'All') {
      const baseSolved = 10850 + approvedCount;
      return {
        problemsReceived: { value: "12,450", numeric: 12450, growthText: "+320 this week", growthDirection: "up" },
        activeHeis: { value: "12", numeric: 12, growthText: "100% Accredited", growthDirection: "up" },
        csrFunds: { value: "₹0.00 Cr", numeric: 0, growthText: "Committed Funds", growthDirection: "up" },
        problemsSolved: { value: baseSolved.toLocaleString(), numeric: baseSolved, growthText: `+${410 + approvedCount} this week`, growthDirection: "up" }
      };
    }

    const feat = JHARKHAND_GEOJSON.features.find(f => f.properties.name.toLowerCase() === district.toLowerCase());
    let baseProblems = feat ? feat.properties.problems : 12450;
    let baseSolved = feat ? feat.properties.solved + approvedCount : 10850 + approvedCount;
    let baseHeis = feat ? feat.properties.activeHeis : 12;
    let baseFunds = feat ? `₹0.00 Cr` : '₹0.00 Cr';

    if (sector !== 'All') {
      baseProblems = Math.round(baseProblems * 0.22);
      baseSolved = Math.round(baseSolved * 0.22);
    }

    return {
      problemsReceived: { value: baseProblems.toLocaleString(), numeric: baseProblems, growthText: "+28 this week", growthDirection: "up" },
      activeHeis: { value: baseHeis.toString(), numeric: baseHeis, growthText: "Operational", growthDirection: "up" },
      csrFunds: { value: baseFunds, numeric: 1200000, growthText: "Committed", growthDirection: "up" },
      problemsSolved: { value: baseSolved.toLocaleString(), numeric: baseSolved, growthText: "+34 this week", growthDirection: "up" }
    };
  }

  getFilteredSectors(district = 'All', timeframe = 'This Month') {
    const multiMap = { 'Last Month': 0.74, 'This Quarter': 2.8, 'Year 2026': 5.2, 'Today': 0.035, 'Daily': 0.035 };
    let multiplier = multiMap[timeframe] || 1;

    if (district !== 'All') {
      const feat = JHARKHAND_GEOJSON.features.find(f => f.properties.name.toLowerCase() === district.toLowerCase());
      if (feat) multiplier *= (feat.properties.problems / 12450);
    }

    const baseData = [
      { name: "Water Management", count: Math.round(2850 * multiplier), color: "#3b82f6" },
      { name: "Infrastructure", count: Math.round(2430 * multiplier), color: "#f97316" },
      { name: "Education", count: Math.round(1980 * multiplier), color: "#a855f7" },
      { name: "Health", count: Math.round(1560 * multiplier), color: "#ef4444" },
      { name: "Sanitation", count: Math.round(1350 * multiplier), color: "#10b981" },
      { name: "Agriculture", count: Math.round(1150 * multiplier), color: "#eab308" },
      { name: "Others", count: Math.round(1130 * multiplier), color: "#64748b" }
    ];
    const total = baseData.reduce((sum, s) => sum + s.count, 0) || 1;
    return baseData.map(s => ({ ...s, percentage: Math.round((s.count / total) * 100) }));
  }

  getFilteredTrend(district = 'All', sector = 'All', interval = 'Monthly') {
    let scale = 1;
    if (district !== 'All') {
      const feat = JHARKHAND_GEOJSON.features.find(f => f.properties.name.toLowerCase() === district.toLowerCase());
      if (feat) scale = feat.properties.problems / 12450;
    }

    if (interval === 'Daily') {
      return {
        interval: 'Daily',
        points: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => ({ month: d, count: Math.round([380,420,410,490,540,610,680][i] * scale) })),
        thisMonth: `${Math.round(680 * scale).toLocaleString()}`,
        lastMonth: `${Math.round(610 * scale).toLocaleString()}`,
        growth: "11.47% ↑", currentLabel: "Today", prevLabel: "Yesterday"
      };
    }
    if (interval === 'Weekly') {
      return {
        interval: 'Weekly',
        points: ["Week 1","Week 2","Week 3","Week 4"].map((w, i) => ({ month: w, count: Math.round([2420,2780,3150,4100][i] * scale) })),
        thisMonth: `${Math.round(4100 * scale).toLocaleString()}`,
        lastMonth: `${Math.round(3150 * scale).toLocaleString()}`,
        growth: "30.15% ↑", currentLabel: "This Week", prevLabel: "Last Week"
      };
    }
    return {
      interval: 'Monthly',
      points: ["Dec 2025","Jan 2026","Feb 2026","Mar 2026","Apr 2026","May 2026"].map((m, i) => ({ month: m, count: Math.round([6240,6980,7120,8050,9200,12450][i] * scale) })),
      thisMonth: `${Math.round(12450 * scale).toLocaleString()}`,
      lastMonth: `${Math.round(9200 * scale).toLocaleString()}`,
      growth: "35.33% ↑", currentLabel: "This Month", prevLabel: "Last Month"
    };
  }

  getFilteredHeis(district = 'All') {
    const list = this.getTopHeis();
    if (district === 'All') return list;
    return [...list.filter(h => h.leadDistrict?.toLowerCase().includes(district.toLowerCase())), ...list.filter(h => !h.leadDistrict?.toLowerCase().includes(district.toLowerCase()))];
  }

  getTriageFeed() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRIAGE)) || MOCK_AI_TRIAGE_FEED; } catch { return MOCK_AI_TRIAGE_FEED; }
  }

  approveTriage(id) {
    const updated = this.getTriageFeed().map(item => item.id === id ? { ...item, status: 'APPROVED' } : item);
    localStorage.setItem(STORAGE_KEYS.TRIAGE, JSON.stringify(updated));
    this.addAuditLog(`Approved AI Triage problem #${id}`);
    return updated;
  }

  rejectTriage(id) {
    const updated = this.getTriageFeed().map(item => item.id === id ? { ...item, status: 'REJECTED' } : item);
    localStorage.setItem(STORAGE_KEYS.TRIAGE, JSON.stringify(updated));
    this.addAuditLog(`Rejected AI Triage problem #${id}`);
    return updated;
  }

  getTopHeis() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.HEIS)) || MOCK_TOP_HEIS; } catch { return MOCK_TOP_HEIS; }
  }

  getAuditLogs() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT)) || MOCK_AUDIT_LOGS; } catch { return MOCK_AUDIT_LOGS; }
  }

  addAuditLog(actionText) {
    const newEntry = { id: `aud-${Date.now()}`, timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }), actor: 'Admin (Super Admin)', action: actionText, ip: '10.0.12.4' };
    const updated = [newEntry, ...this.getAuditLogs().slice(0, 49)];
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(updated));
  }

  // --- Admin Directory Management ---
  getAdmins() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS)) || MOCK_ADMIN_RECORDS; } catch { return MOCK_ADMIN_RECORDS; }
  }

  getAdminStats() {
    const list = this.getAdmins();
    return {
      totalAdmins: list.length,
      activeAdmins: list.filter(a => a.status === 'Active').length,
      suspendedAdmins: list.filter(a => a.status === 'Suspended').length,
      removedAdmins: list.filter(a => a.status === 'Removed').length
    };
  }

  createAdmin(data) {
    const newAdmin = {
      id: `adm-${Date.now().toString().slice(-4)}`,
      fullName: data.fullName.trim(),
      mobileNumber: data.mobileNumber.startsWith('+91') ? data.mobileNumber.trim() : `+91 ${data.mobileNumber.trim()}`,
      email: data.email.toLowerCase().trim(),
      role: data.role || 'District Admin',
      district: data.district || 'Ranchi',
      lastLogin: 'Never logged in',
      status: 'Active',
      avatarColor: ['purple', 'green', 'orange', 'pink', 'teal', 'blue', 'cyan'][Math.floor(Math.random() * 7)]
    };
    const updated = [newAdmin, ...this.getAdmins()];
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(updated));
    this.addAuditLog(`Created admin: ${newAdmin.fullName} (${newAdmin.role})`);
    return updated;
  }

  updateAdmin(id, data) {
    const updated = this.getAdmins().map(a => a.id === id ? { ...a, ...data, email: data.email ? data.email.toLowerCase().trim() : a.email } : a);
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(updated));
    this.addAuditLog(`Updated admin #${id}`);
    return updated;
  }

  toggleAdminStatus(id) {
    const updated = this.getAdmins().map(a => a.id === id ? { ...a, status: a.status === 'Active' ? 'Suspended' : 'Active' } : a);
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(updated));
    this.addAuditLog(`Toggled status for admin #${id}`);
    return updated;
  }

  deleteAdmin(id) {
    const target = this.getAdmins().find(a => a.id === id);
    const updated = this.getAdmins().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(updated));
    if (target) this.addAuditLog(`Removed admin: ${target.fullName}`);
    return updated;
  }
}

export const governmentDataService = new GovernmentDataService();
export default governmentDataService;
