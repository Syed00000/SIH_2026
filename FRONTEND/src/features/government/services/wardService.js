import apiClient from '../../../infrastructure/api/client.js';

export const wardService = {
  async getWards(params = {}) {
    const query = new URLSearchParams();
    if (params.district && params.district !== 'All') query.append('district', params.district);
    if (params.blockId) query.append('blockId', params.blockId);
    if (params.search) query.append('search', params.search);
    const queryString = query.toString();
    const res = await apiClient.get(`government/wards${queryString ? `?${queryString}` : ''}`);
    return res?.data || res || [];
  },

  async getWardById(id) {
    if (!id) return null;
    const res = await apiClient.get(`government/wards/${id}`);
    return res?.data || res;
  },

  async createWard(payload) {
    const res = await apiClient.post('government/wards', payload);
    return res?.data || res;
  },

  async updateWard(id, payload) {
    const res = await apiClient.put(`government/wards/${id}`, payload);
    return res?.data || res;
  },

  async deleteWard(id) {
    const res = await apiClient.delete(`government/wards/${id}`);
    return res?.data || res;
  },

  async assignProblemToWard(challengeId, ward, instructions = '') {
    const wardPayload = {
      id: ward.id || ward._id,
      wardId: ward.wardId,
      wardNumber: ward.wardNumber,
      name: ward.name,
      councillorName: ward.councillorName || '',
      councillorEmail: ward.councillorEmail || '',
      councillorPhone: ward.councillorPhone || '',
      district: ward.district || 'Ranchi',
      instructions: instructions.trim() || 'Assigned by District Nodal Officer for municipal resolution.',
      status: 'Assigned'
    };
    const res = await apiClient.patch(`citizen/challenges/${challengeId}/triage`, {
      assignedWard: wardPayload,
      status: 'In Progress'
    });
    return res?.data?.data || res?.data;
  }
};

export default wardService;
