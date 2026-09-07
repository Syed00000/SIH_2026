import React, { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCw, Landmark } from 'lucide-react';
import { DepartmentSummaryCards } from './DepartmentSummaryCards.jsx';
import { DepartmentCard } from './DepartmentCard.jsx';
import { DepartmentDetailModal } from './DepartmentDetailModal.jsx';
import { adminService } from '../../services/adminService.js';
import { JHARKHAND_DEPARTMENTS } from '../../data/departmentsData.js';
import apiClient from '../../../../infrastructure/api/client.js';

export const DepartmentsManagementPanel = () => {
  const [admins, setAdmins] = useState([]);
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [adminsRes, gisRes] = await Promise.all([
        adminService.getAdmins({ limit: 100 }).catch(() => ({ records: [] })),
        apiClient.get('admin/gis/problems').catch(() => ({ data: [] }))
      ]);
      setAdmins(adminsRes?.records || []);
      const probData = Array.isArray(gisRes?.data)
        ? gisRes.data
        : (Array.isArray(gisRes?.data?.data) ? gisRes.data.data : []);
      setProblems(probData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const enrichedDepartments = useMemo(() => {
    return JHARKHAND_DEPARTMENTS.map((dept) => {
      const matchedOfficers = admins.filter(
        (a) =>
          a.assignedDepartment?.toLowerCase().includes(dept.code.toLowerCase()) ||
          dept.name.toLowerCase().includes(a.assignedDepartment?.toLowerCase() || '___')
      );
      const matchedProblems = problems.filter(
        (p) =>
          p.category?.toLowerCase().includes(dept.id) ||
          dept.mandate.toLowerCase().includes(p.category?.toLowerCase() || '___')
      );
      return {
        ...dept,
        officersCount: matchedOfficers.length > 0 ? matchedOfficers.length : 1,
        problemsCount: matchedProblems.length
      };
    });
  }, [admins, problems]);

  const filteredDepartments = useMemo(() => {
    if (!searchTerm.trim()) return enrichedDepartments;
    const q = searchTerm.toLowerCase().trim();
    return enrichedDepartments.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.mandate.toLowerCase().includes(q) ||
        d.secretariatLocation.toLowerCase().includes(q)
    );
  }, [enrichedDepartments, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900 tracking-tight">
              State Departments & Nodal Governance
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Line ministries and state departments collaborating on citizen problem statements
            </p>
          </div>
        </div>

        {/* Search & Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61] transition-all w-52 font-medium"
            />
          </div>
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            title="Refresh Departments"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#007A61]' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <DepartmentSummaryCards
        totalDepartments={JHARKHAND_DEPARTMENTS.length}
        totalOfficers={admins.length || 8}
        totalChallenges={problems.length}
        activeProjects={problems.filter((p) => p.status === 'DEPLOYED' || p.status === 'IN_PROGRESS').length}
      />

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDepartments.map((dept) => (
          <DepartmentCard
            key={dept.id}
            department={dept}
            onViewDetails={(d) => setSelectedDepartment(d)}
          />
        ))}
      </div>

      {/* Department Detail Modal */}
      <DepartmentDetailModal
        department={selectedDepartment}
        officers={admins}
        onClose={() => setSelectedDepartment(null)}
      />
    </div>
  );
};

export default DepartmentsManagementPanel;
