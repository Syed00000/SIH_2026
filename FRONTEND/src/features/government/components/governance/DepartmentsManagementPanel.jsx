import React, { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCw, Landmark, Plus, LayoutGrid, List, SlidersHorizontal, Table, Grid, ChevronRight, CheckCircle2 } from 'lucide-react';
import { DepartmentSummaryCards } from './DepartmentSummaryCards.jsx';
import { DepartmentCard } from './DepartmentCard.jsx';
import { DepartmentTable } from './DepartmentTable.jsx';
import { DepartmentDetailPanel } from './DepartmentDetailPanel.jsx';
import { DepartmentEditPanel } from './DepartmentEditPanel.jsx';
import { DeleteDepartmentConfirmModal } from './DeleteDepartmentConfirmModal.jsx';
import { departmentService } from '../../services/departmentService.js';
import { adminService } from '../../services/adminService.js';

export const DepartmentsManagementPanel = ({ category = 'State Ministry' }) => {
  const [departments, setDepartments] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [statusFilter, setStatusFilter] = useState('All');

  // Dedicated Panel state: 'list' | 'detail' | 'edit'
  const [activeView, setActiveView] = useState('list');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [deletingDepartment, setDeletingDepartment] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [deptRes, adminsRes] = await Promise.all([
        departmentService.getDepartments().catch(() => ({ data: [] })),
        adminService.getAdmins({ limit: 100 }).catch(() => ({ records: [] }))
      ]);
      setDepartments(Array.isArray(deptRes) ? deptRes : (Array.isArray(deptRes?.data) ? deptRes.data : []));
      setAdmins(adminsRes?.records || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setActiveView('list');
    setSelectedDepartment(null);
    setEditingDepartment(null);
    loadData();
  }, [category]);

  const handleSaveDepartment = async (payload) => {
    try {
      const id = editingDepartment?.deptId || editingDepartment?.id || editingDepartment?._id;
      if (editingDepartment && id) {
        await departmentService.updateDepartment(id, payload);
      } else {
        await departmentService.createDepartment(payload);
      }
      await loadData();
    } catch (err) {
      console.error('Error saving department:', err);
    }
  };

  const handleToggleStatus = async (dept) => {
    try {
      const id = dept.deptId || dept.id || dept._id;
      const nextStatus = dept.status === 'Active' ? 'Inactive' : 'Active';
      await departmentService.updateDepartment(id, { status: nextStatus });
      await loadData();
      if (selectedDepartment && (selectedDepartment.deptId === id || selectedDepartment._id === id)) {
        setSelectedDepartment((prev) => ({ ...prev, status: nextStatus }));
      }
    } catch (err) {
      console.error('Error toggling department status:', err);
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      await departmentService.deleteDepartment(id);
      setDeletingDepartment(null);
      await loadData();
    } catch (err) {
      console.error('Error deleting department:', err);
    }
  };

  const filteredDepartments = useMemo(() => {
    return departments.filter((d) => {
      if (category === 'Gram Panchayat') {
        if (d.category !== 'Gram Panchayat' && d.category !== 'Ward Commissioner') return false;
      } else {
        if (d.category !== category) return false;
      }

      if (statusFilter === 'Active' && d.status !== 'Active') return false;
      if (statusFilter === 'Inactive' && d.status === 'Active') return false;

      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase().trim();
      return (
        d.name?.toLowerCase().includes(q) ||
        d.code?.toLowerCase().includes(q) ||
        d.deptId?.toLowerCase().includes(q) ||
        d.headName?.toLowerCase().includes(q) ||
        d.district?.toLowerCase().includes(q) ||
        d.block?.toLowerCase().includes(q) ||
        d.panchayat?.toLowerCase().includes(q)
      );
    });
  }, [departments, searchTerm, category, statusFilter]);

  if (activeView === 'detail' && selectedDepartment) {
    return (
      <DepartmentDetailPanel
        department={selectedDepartment}
        onBack={() => setActiveView('list')}
        onEdit={(dept) => { setEditingDepartment(dept); setActiveView('edit'); }}
        onToggleStatus={handleToggleStatus}
        onDelete={(id) => { handleDeleteDepartment(id); setActiveView('list'); }}
      />
    );
  }

  if (activeView === 'edit') {
    return (
      <DepartmentEditPanel
        department={editingDepartment}
        onBack={() => setActiveView('list')}
        onSave={async (payload) => { await handleSaveDepartment(payload); setActiveView('list'); }}
      />
    );
  }

  const title = category === 'State Ministry' ? 'STATE MINISTRIES & SECRETARIATS' :
                category === 'District Department' ? 'DISTRICT DEPARTMENTS & NODAL DESKS' :
                category === 'Gram Panchayat' ? 'GRAM PANCHAYATS & WARDS' :
                category === 'Block / Tehsil Office' ? 'BLOCK & TEHSIL OFFICES' : 'DEPARTMENTS DIRECTORY';

  const subtitle = category === 'State Ministry' ? 'Central state line ministries, secretariats, and nodal administrative desks' :
                   category === 'District Department' ? 'District-level line departments, administrative collectors, and nodal authorities' :
                   category === 'Gram Panchayat' ? 'Gram Panchayat Mukhiya and Ward Commissioner local governance telemetry desks' :
                   'Block development offices (BDO) and tehsil administrative units';

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 select-none animate-fadeIn">
      {/* Header Banner - Active Projects Theme */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span className="flex items-center space-x-1">
              <Landmark className="w-3.5 h-3.5 text-slate-400" />
              <span>Governance Directory</span>
            </span>
            <span>•</span>
            <span className="text-slate-700">{category}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            {title}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center space-x-2.5 flex-wrap">
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shadow-2xs"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#007A61]' : ''}`} />
          </button>
          {category === 'State Ministry' && (
            <button
              type="button"
              onClick={() => { setEditingDepartment(null); setActiveView('edit'); }}
              className="px-4 py-2 bg-[#007A61] hover:bg-[#00624e] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4 text-emerald-100" />
              <span>Add Department</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Metric Summary Cards */}
      <DepartmentSummaryCards
        totalDepartments={filteredDepartments.length}
        totalOfficers={filteredDepartments.reduce((acc, d) => acc + (d.officersCount || 0), 0) || admins.length}
        totalChallenges={filteredDepartments.reduce((acc, d) => acc + (d.problemsCount || 0), 0)}
        activeProjects={filteredDepartments.reduce((acc, d) => acc + (d.activeProjectsCount || 0), 0)}
      />

      {/* Filter Toolbar & Status Filter Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {['All', 'Active', 'Inactive'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab
                    ? 'bg-[#007A61] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'All' ? 'All Units' : tab}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search departments, portal UID, Mukhiya, jurisdiction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Content: List Table or Grid Cards */}
      {viewMode === 'list' ? (
        <DepartmentTable
          departments={filteredDepartments}
          onViewDetails={(d) => { setSelectedDepartment(d); setActiveView('detail'); }}
          onEdit={(d) => { setEditingDepartment(d); setActiveView('edit'); }}
          onToggleStatus={handleToggleStatus}
          onDelete={(d) => setDeletingDepartment(d)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepartments.map((dept) => (
            <DepartmentCard
              key={dept.deptId || dept.id || dept._id}
              department={dept}
              onViewDetails={(d) => { setSelectedDepartment(d); setActiveView('detail'); }}
              onEdit={(d) => { setEditingDepartment(d); setActiveView('edit'); }}
              onToggleStatus={handleToggleStatus}
              onDelete={(d) => setDeletingDepartment(d)}
            />
          ))}
        </div>
      )}

      <DeleteDepartmentConfirmModal
        isOpen={Boolean(deletingDepartment)}
        department={deletingDepartment}
        onClose={() => setDeletingDepartment(null)}
        onConfirm={handleDeleteDepartment}
      />
    </div>
  );
};

export default DepartmentsManagementPanel;
