import React, { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCw, Landmark, Plus, Table, Grid } from 'lucide-react';
import { departmentService } from '../../services/departmentService.js';
import { StateDepartmentSummaryCards } from './StateDepartmentSummaryCards.jsx';
import { StateDepartmentTable } from './StateDepartmentTable.jsx';
import { StateDepartmentDetailView } from './StateDepartmentDetailView.jsx';
import { StateDepartmentEditPanel } from './StateDepartmentEditPanel.jsx';

export const StateDepartmentsManagementPanel = () => {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [statusFilter, setStatusFilter] = useState('All');

  const [activeView, setActiveView] = useState('list'); // list, detail, edit
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await departmentService.getDepartments({ category: 'State Ministry' });
      setDepartments(Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []));
    } catch (err) {
      console.error('Error loading state departments:', err);
      setDepartments([]);
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
        await departmentService.createDepartment({ ...payload, category: 'State Ministry' });
      }
      await loadData();
      setActiveView('list');
    } catch (err) {
      console.error('Error saving department:', err);
      throw err;
    }
  };

  const filteredDepartments = useMemo(() => {
    return departments.filter((d) => {
      if (d.category !== 'State Ministry') return false;
      if (statusFilter === 'Active' && d.status !== 'Active') return false;
      if (statusFilter === 'Inactive' && d.status === 'Active') return false;
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase().trim();
      return (
        d.name?.toLowerCase().includes(q) ||
        d.code?.toLowerCase().includes(q) ||
        d.deptId?.toLowerCase().includes(q) ||
        d.headName?.toLowerCase().includes(q)
      );
    });
  }, [departments, searchTerm, statusFilter]);

  if (activeView === 'detail' && selectedDepartment) {
    return (
      <StateDepartmentDetailView
        department={selectedDepartment}
        onBack={() => setActiveView('list')}
        onEdit={(dept) => { setEditingDepartment(dept); setActiveView('edit'); }}
        onRefresh={loadData}
      />
    );
  }

  if (activeView === 'edit') {
    return (
      <StateDepartmentEditPanel
        department={editingDepartment}
        onBack={() => setActiveView('list')}
        onSave={handleSaveDepartment}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 select-none animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span className="flex items-center space-x-1">
              <Landmark className="w-3.5 h-3.5 text-slate-400" />
              <span>State Governance</span>
            </span>
            <span>•</span>
            <span className="text-slate-700">State Departments</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            STATE DEPARTMENTS OVERVIEW
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            Manage state-level government departments, leadership, jurisdiction, officers and administrative hierarchy.
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
          <button
            type="button"
            onClick={() => { setEditingDepartment(null); setActiveView('edit'); }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4 text-slate-300" />
            <span>Add State Department</span>
          </button>
        </div>
      </div>

      <StateDepartmentSummaryCards departments={filteredDepartments} />

      {/* Filter Toolbar */}
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
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'All' ? 'All Departments' : tab}
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
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Department Name, ID, HOD, Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      <StateDepartmentTable
        departments={filteredDepartments}
        viewMode={viewMode}
        onViewDetails={(d) => { setSelectedDepartment(d); setActiveView('detail'); }}
        onEdit={(d) => { setEditingDepartment(d); setActiveView('edit'); }}
      />
    </div>
  );
};
