import { MOCK_INDUSTRY_RECORDS } from '../data/mockIndustryData.js';

const STORAGE_KEY = 'joharsetu_raw_industries_v3';

const getStoredIndustries = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => a.legalName.localeCompare(b.legalName));
      }
    }
  } catch (err) {
    console.error('Error reading stored industries:', err);
  }
  const initial = [...MOCK_INDUSTRY_RECORDS].sort((a, b) => a.legalName.localeCompare(b.legalName));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

const saveStoredIndustries = (list) => {
  try {
    const sorted = [...list].sort((a, b) => a.legalName.localeCompare(b.legalName));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  } catch (err) {
    console.error('Error saving industries to storage:', err);
  }
};

export const industryService = {
  /**
   * Fetch all industries with search, filtering, alphabetical sorting, pagination and KPIs
   */
  async getIndustries(params = {}) {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const list = getStoredIndustries();

    const filtered = list.filter((item) => {
      // 1. Search Query Filter
      if (params.search && params.search.trim()) {
        const q = params.search.toLowerCase().trim();
        const match =
          (item.legalName && item.legalName.toLowerCase().includes(q)) ||
          (item.shortName && item.shortName.toLowerCase().includes(q)) ||
          (item.industryId && item.industryId.toLowerCase().includes(q)) ||
          (item.spocName && item.spocName.toLowerCase().includes(q)) ||
          (item.officialEmail && item.officialEmail.toLowerCase().includes(q)) ||
          (item.mobileNumber && item.mobileNumber.includes(q)) ||
          (item.registrationNumber && item.registrationNumber.toLowerCase().includes(q));
        if (!match) return false;
      }

      // 2. Category Filter
      if (params.category && params.category !== 'All' && params.category !== 'All Categories') {
        if (item.category?.toLowerCase() !== params.category.toLowerCase()) return false;
      }

      // 3. Thematic Domain Filter
      if (params.thematicDomain && params.thematicDomain !== 'All' && params.thematicDomain !== 'All Domains') {
        const domainMatch =
          item.thematicDomain?.toLowerCase() === params.thematicDomain.toLowerCase() ||
          (Array.isArray(item.thematicDomains) &&
            item.thematicDomains.some((d) => d.toLowerCase() === params.thematicDomain.toLowerCase()));
        if (!domainMatch) return false;
      }

      // 4. Status Filter
      if (params.status && params.status !== 'All' && params.status !== 'All Status') {
        const isEnabled = item.status === 'Active' && item.accessStatus !== 'Disabled';
        if (params.status === 'Active' && !isEnabled) return false;
        if (params.status === 'Disabled' && isEnabled) return false;
        if (params.status === 'Inactive' && item.status !== 'Inactive') return false;
      }

      // 5. Verification Status Filter
      if (params.verificationStatus && params.verificationStatus !== 'All' && params.verificationStatus !== 'All Verification') {
        if (item.verificationStatus?.toLowerCase() !== params.verificationStatus.toLowerCase()) return false;
      }

      // 6. District Filter
      if (params.district && params.district !== 'All' && params.district !== 'All Districts') {
        const itemDist = item.address?.district || item.address?.city || '';
        if (!itemDist.toLowerCase().includes(params.district.toLowerCase())) return false;
      }

      return true;
    });

    // Ensure strict alphabetical sorting (A to Z)
    const sorted = [...filtered].sort((a, b) => a.legalName.localeCompare(b.legalName));

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const total = sorted.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const records = sorted.slice(startIndex, startIndex + limit);

    // Accurate KPIs across all stored records
    const totalIndustries = list.length;
    const activeIndustries = list.filter((i) => i.status === 'Active' && i.verificationStatus !== 'Pending').length;
    const disabledIndustries = list.filter((i) => i.accessStatus === 'Disabled' || i.status === 'Inactive').length;
    const verifiedPartners = list.filter((i) => i.verificationStatus === 'Approved' || i.verificationStatus === 'Verified').length;
    const pendingReview = list.filter((i) => i.verificationStatus === 'Pending').length;

    return {
      records,
      total,
      page,
      limit,
      totalPages,
      kpis: {
        totalIndustries,
        activeIndustries,
        disabledIndustries,
        verifiedPartners,
        pendingReview,
        totalCsrFundsCr: 4.8,
        supportedProjects: 24,
        verifiedLabs: 12
      }
    };
  },

  /**
   * Get single industry by ID
   */
  async getIndustryById(id) {
    const list = getStoredIndustries();
    const item = list.find((i) => (i._id === id || i.id === id || i.industryId === id));
    if (item) return item;
    throw new Error('Industry organization not found');
  },

  /**
   * Register new Industry
   */
  async createIndustry(payload) {
    const list = getStoredIndustries();
    const nextNum = list.length + 1;
    const formattedId = `IND-2026-${String(nextNum).padStart(4, '0')}`;

    const newIndustry = {
      _id: `ind-${Date.now()}`,
      id: `ind-${Date.now()}`,
      industryId: formattedId,
      legalName: payload.legalName || 'Unnamed Entity',
      shortName: payload.shortName || '',
      category: payload.category || 'Private Industry',
      thematicDomain: payload.thematicDomain || 'Infrastructure',
      thematicDomains: payload.thematicDomains || [payload.thematicDomain || 'Infrastructure'],
      registrationNumber: payload.registrationNumber || '',
      status: 'Active',
      accessStatus: 'Enabled',
      verificationStatus: 'Approved',
      website: payload.website || '',
      officialEmail: payload.officialEmail || '',
      mobileNumber: payload.mobileNumber || '',
      spocName: payload.spocName || '',
      designation: payload.designation || 'Nodal SPOC',
      address: payload.address || {
        city: 'Ranchi',
        state: 'Jharkhand',
        district: 'Ranchi',
        pincode: '834001',
        fullAddress: 'Ranchi, Jharkhand'
      },
      supportModes: payload.supportModes || ['Funding'],
      credentials: payload.credentials || {
        loginEmail: payload.officialEmail || `partner${nextNum}@joharsetu.gov.in`,
        generatedPassword: payload.initialPassword || 'Ind@Jharkhand2026!'
      },
      createdAt: new Date().toISOString()
    };

    list.unshift(newIndustry);
    saveStoredIndustries(list);

    return {
      industry: newIndustry,
      credentials: {
        industryId: newIndustry.industryId,
        legalName: newIndustry.legalName,
        email: newIndustry.credentials.loginEmail,
        password: newIndustry.credentials.generatedPassword
      }
    };
  },

  /**
   * Update existing Industry details
   */
  async updateIndustry(id, payload) {
    const list = getStoredIndustries();
    const index = list.findIndex((i) => (i._id === id || i.id === id || i.industryId === id));
    if (index === -1) throw new Error('Industry organization not found');

    const updated = {
      ...list[index],
      ...payload,
      _id: list[index]._id,
      id: list[index].id,
      industryId: list[index].industryId
    };

    list[index] = updated;
    saveStoredIndustries(list);
    return updated;
  },

  /**
   * Approve Application
   */
  async approveApplication(id, payload = {}) {
    const list = getStoredIndustries();
    const index = list.findIndex((i) => (i._id === id || i.id === id || i.industryId === id));
    if (index === -1) throw new Error('Application not found');

    list[index].verificationStatus = 'Approved';
    list[index].status = 'Active';
    list[index].accessStatus = 'Enabled';
    if (payload.loginEmail || payload.initialPassword) {
      list[index].credentials = {
        loginEmail: payload.loginEmail || list[index].officialEmail,
        generatedPassword: payload.initialPassword || 'Ind@Jharkhand2026!'
      };
    }

    saveStoredIndustries(list);
    return {
      industry: list[index],
      credentials: {
        industryId: list[index].industryId,
        legalName: list[index].legalName,
        email: list[index].credentials?.loginEmail || list[index].officialEmail,
        password: list[index].credentials?.generatedPassword || 'Ind@Jharkhand2026!'
      }
    };
  },

  /**
   * Reject Application
   */
  async rejectApplication(id, payload = {}) {
    const list = getStoredIndustries();
    const index = list.findIndex((i) => (i._id === id || i.id === id || i.industryId === id));
    if (index === -1) throw new Error('Application not found');

    list[index].verificationStatus = 'Rejected';
    list[index].rejectionReason = payload.reason || 'Application criteria not met';
    saveStoredIndustries(list);
    return list[index];
  },

  /**
   * Toggle Industry Status
   */
  async toggleStatus(id) {
    const list = getStoredIndustries();
    const index = list.findIndex((i) => (i._id === id || i.id === id || i.industryId === id));
    if (index === -1) throw new Error('Industry not found');

    const currentActive = list[index].status === 'Active' && list[index].accessStatus !== 'Disabled';
    if (currentActive) {
      list[index].status = 'Inactive';
      list[index].accessStatus = 'Disabled';
    } else {
      list[index].status = 'Active';
      list[index].accessStatus = 'Enabled';
    }

    saveStoredIndustries(list);
    return list[index];
  },

  /**
   * Reset Password
   */
  async resetPassword(id) {
    const list = getStoredIndustries();
    const index = list.findIndex((i) => (i._id === id || i.id === id || i.industryId === id));
    if (index === -1) throw new Error('Industry not found');

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let pwd = 'Ind@';
    for (let i = 0; i < 8; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));

    list[index].credentials = {
      loginEmail: list[index].credentials?.loginEmail || list[index].officialEmail,
      generatedPassword: pwd
    };

    saveStoredIndustries(list);
    return {
      legalName: list[index].legalName,
      email: list[index].credentials.loginEmail,
      password: pwd
    };
  },

  /**
   * Delete Industry
   */
  async deleteIndustry(id) {
    let list = getStoredIndustries();
    list = list.filter((i) => (i._id !== id && i.id !== id && i.industryId !== id));
    saveStoredIndustries(list);
    return { success: true };
  }
};

export default industryService;
