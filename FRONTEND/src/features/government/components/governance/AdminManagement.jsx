import React, { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { AdminSummaryCards } from './AdminSummaryCards.jsx';
import { AdminDirectoryTable } from './AdminDirectoryTable.jsx';
import { AdminFormModal } from './AdminFormModal.jsx';
import { AdminViewModal } from './AdminViewModal.jsx';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/v1/government/admins';

export const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [stats, setStats] = useState({ totalAdmins: 0, activeAdmins: 0, suspendedAdmins: 0, removedAdmins: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [viewingAdmin, setViewingAdmin] = useState(null);

  // Clear any legacy mock data from browser localStorage
  useEffect(() => {
    localStorage.removeItem('joharsetu_gov_admins');
  }, []);

  const fetchAdmins = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE}?limit=100`);
      if (res.data?.success) {
        setAdmins(res.data.data || []);
        if (res.data.stats) setStats(res.data.stats);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to database');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleFormSubmit = async (formData) => {
    try {
      if (editingAdmin) {
        await axios.put(`${API_BASE}/${editingAdmin.id}`, formData);
      } else {
        await axios.post(API_BASE, formData);
      }
      setIsFormOpen(false);
      setEditingAdmin(null);
      await fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving administrator');
    }
  };

  const handleToggleStatus = async (id) => {
    const target = admins.find(a => a.id === id);
    if (!target) return;
    const nextStatus = target.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await axios.patch(`${API_BASE}/${id}/status`, { status: nextStatus });
      await fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this administrator from the database?')) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      await fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.message || 'Error removing administrator');
    }
  };

  return (
    <div className="space-y-5 pb-8 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Admin Management</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Manage system administrators directly from MongoDB database.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={fetchAdmins} className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 cursor-pointer" title="Refresh from Database">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
          <button onClick={() => { setEditingAdmin(null); setIsFormOpen(true); }} className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Add New Admin</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stat Cards */}
      <AdminSummaryCards stats={stats} />

      {/* Admin Directory Table */}
      <AdminDirectoryTable
        admins={admins}
        isLoading={isLoading}
        onViewAdmin={(admin) => setViewingAdmin(admin)}
        onEditAdmin={(admin) => { setEditingAdmin(admin); setIsFormOpen(true); }}
        onToggleStatus={handleToggleStatus}
        onDeleteAdmin={handleDeleteAdmin}
      />

      {/* Add / Edit Admin Modal */}
      <AdminFormModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingAdmin(null); }}
        onSubmit={handleFormSubmit}
        initialData={editingAdmin}
      />

      {/* View Admin Details Modal */}
      <AdminViewModal
        isOpen={Boolean(viewingAdmin)}
        onClose={() => setViewingAdmin(null)}
        admin={viewingAdmin}
      />
    </div>
  );
};

export default AdminManagement;
