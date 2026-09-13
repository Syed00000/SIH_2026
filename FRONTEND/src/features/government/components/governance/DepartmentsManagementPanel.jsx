import React, { useState, useEffect, useMemo } from 'react';
import { DepartmentSummaryCards } from './DepartmentSummaryCards.jsx';
import { DepartmentBanner } from './DepartmentBanner.jsx';
import { DepartmentToolbar } from './DepartmentToolbar.jsx';
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

  const META = {
    'State Ministry': { t: 'STATE MINISTRIES & SECRETARIATS', s: 'Central state line ministries, secretariats, and nodal administrative desks' },
    'District Department': { t: 'DISTRICT DEPARTMENTS & NODAL DESKS', s: 'District-level line departments, administrative collectors, and nodal authorities' },
    'Gram Panchayat': { t: 'GRAM PANCHAYATS & WARDS', s: 'Gram Panchayat Mukhiya and Ward Commissioner local governance telemetry desks' },
    'Block / Tehsil Office': { t: 'BLOCK & TEHSIL OFFICES', s: 'Block development offices (BDO) and tehsil administrative units' }
  };
  const { t: title, s: subtitle } = META[category] || { t: 'DEPARTMENTS DIRECTORY', s: 'Department administrative units' };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 select-none animate-fadeIn">
      <DepartmentBanner
        category={category}
        title={title}
        subtitle={subtitle}
        isLoading={isLoading}
        onRefresh={loadData}
        onAdd={() => { setEditingDepartment(null); setActiveView('edit'); }}
      />

      <DepartmentSummaryCards
        totalDepartments={filteredDepartments.length}
        totalOfficers={filteredDepartments.reduce((acc, d) => acc + (d.officersCount || 0), 0) || admins.length}
        totalChallenges={filteredDepartments.reduce((acc, d) => acc + (d.problemsCount || 0), 0)}
        activeProjects={filteredDepartments.reduce((acc, d) => acc + (d.activeProjectsCount || 0), 0)}
      />

      <DepartmentToolbar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

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
