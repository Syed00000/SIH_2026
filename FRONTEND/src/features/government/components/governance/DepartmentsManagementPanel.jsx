import React, { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCw, Landmark, Plus, LayoutGrid, List } from 'lucide-react';
import { DepartmentSummaryCards } from './DepartmentSummaryCards.jsx';
import { DepartmentCard } from './DepartmentCard.jsx';
import { DepartmentTable } from './DepartmentTable.jsx';
import { DepartmentDetailPanel } from './DepartmentDetailPanel.jsx';
import { DepartmentEditPanel } from './DepartmentEditPanel.jsx';
import { DeleteDepartmentConfirmModal } from './DeleteDepartmentConfirmModal.jsx';
import { departmentService } from '../../services/departmentService.js';
import { adminService } from '../../services/adminService.js';

export const DepartmentsManagementPanel = () => {
  const [departments, setDepartments] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [viewMode, setViewMode] = useState('list');

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
      setDepartments(Array.isArray(deptRes?.data) ? deptRes.data : []);
      setAdmins(adminsRes?.records || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
      if (filterCategory !== 'All' && d.category !== filterCategory) return false;
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase().trim();
      return (d.name?.toLowerCase().includes(q) || d.code?.toLowerCase().includes(q) || d.headName?.toLowerCase().includes(q) || d.district?.toLowerCase().includes(q));
    });
  }, [departments, searchTerm, filterCategory]);

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

  return (
    <div className="space-y-4 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0"><Landmark className="w-5 h-5" /></div>
          <div>
            <h1 className="text-base font-black text-slate-900 tracking-tight">State Departments & Local Governance</h1>
            <p className="text-xs text-slate-500 font-medium">Manage line ministries, district departments, and Gram Panchayat governance desks</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search department, ID, Mukhiya..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61] transition-all w-52 font-medium" />
          </div>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
            <button type="button" onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'list' ? 'bg-white text-[#007A61] shadow-2xs font-bold' : 'text-slate-500'}`} title="Table View"><List className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white text-[#007A61] shadow-2xs font-bold' : 'text-slate-500'}`} title="Grid View"><LayoutGrid className="w-3.5 h-3.5" /></button>
          </div>
          <button type="button" onClick={loadData} disabled={isLoading} className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors cursor-pointer"><RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#007A61]' : ''}`} /></button>
          <button type="button" onClick={() => { setEditingDepartment(null); setActiveView('edit'); }} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#007A61] hover:bg-[#00624e] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"><Plus className="w-3.5 h-3.5" /><span>Add Department</span></button>
        </div>
      </div>

      <DepartmentSummaryCards totalDepartments={departments.length} totalOfficers={departments.reduce((acc, d) => acc + (d.officersCount || 0), 0) || admins.length} totalChallenges={departments.reduce((acc, d) => acc + (d.problemsCount || 0), 0)} activeProjects={departments.reduce((acc, d) => acc + (d.activeProjectsCount || 0), 0)} />

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {['All', 'State Ministry', 'District Department', 'Gram Panchayat'].map((cat) => (
          <button key={cat} type="button" onClick={() => setFilterCategory(cat)} className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all ${filterCategory === cat ? 'bg-[#007A61] text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>{cat}</button>
        ))}
      </div>

      {viewMode === 'list' ? (
        <DepartmentTable departments={filteredDepartments} onViewDetails={(d) => { setSelectedDepartment(d); setActiveView('detail'); }} onEdit={(d) => { setEditingDepartment(d); setActiveView('edit'); }} onToggleStatus={handleToggleStatus} onDelete={(d) => setDeletingDepartment(d)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepartments.map((dept) => (
            <DepartmentCard key={dept.deptId || dept.id || dept._id} department={dept} onViewDetails={(d) => { setSelectedDepartment(d); setActiveView('detail'); }} onEdit={(d) => { setEditingDepartment(d); setActiveView('edit'); }} onToggleStatus={handleToggleStatus} onDelete={(d) => setDeletingDepartment(d)} />
          ))}
        </div>
      )}

      <DeleteDepartmentConfirmModal isOpen={Boolean(deletingDepartment)} department={deletingDepartment} onClose={() => setDeletingDepartment(null)} onConfirm={handleDeleteDepartment} />
    </div>
  );
};

export default DepartmentsManagementPanel;
