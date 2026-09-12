import apiClient from '../../../infrastructure/api/client.js';

export const departmentService = {
  getDepartments: async (params = {}) => {
    const res = await apiClient.get('government/departments', { params });
    return res?.data?.data || res?.data || (Array.isArray(res) ? res : []);
  },

  getDepartmentById: async (id) => {
    const res = await apiClient.get(`government/departments/${id}`);
    return res?.data?.data || res?.data;
  },

  createDepartment: async (payload) => {
    const res = await apiClient.post('government/departments', payload);
    return res?.data?.data || res?.data;
  },

  updateDepartment: async (id, payload) => {
    const res = await apiClient.put(`government/departments/${id}`, payload);
    return res?.data?.data || res?.data;
  },

  deleteDepartment: async (id) => {
    const res = await apiClient.delete(`government/departments/${id}`);
    return res?.data || res;
  },

  assignProblemToDepartment: async (challengeId, dept, instructions = '') => {
    const deptPayload = {
      id: dept.id || dept._id,
      deptId: dept.deptId || dept.code,
      name: dept.name,
      code: dept.code,
      category: dept.category || 'District Department',
      headName: dept.headName || '',
      headEmail: dept.headEmail || '',
      headPhone: dept.headPhone || '',
      district: dept.district || 'Ranchi',
      instructions: instructions.trim() || 'Assigned by State Nodal Officer for official department resolution.',
      status: 'Assigned'
    };
    const res = await apiClient.patch(`citizen/challenges/${challengeId}/triage`, {
      assignedDepartment: deptPayload,
      status: 'In Progress'
    });
    return res?.data?.data || res?.data;
  }
};

export default departmentService;
