import React, { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { AdminSummaryCards } from './AdminSummaryCards.jsx';
import { AdminDirectoryTable } from './AdminDirectoryTable.jsx';
import { AdminFormModal } from './AdminFormModal.jsx';
import { AdminViewModal } from './AdminViewModal.jsx';
import { adminService } from '../../services/adminService.js';

export const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [stats, setStats] = useState({ totalAdmins: 0, activeAdmins: 0, suspendedAdmins: 0, removedAdmins: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [viewingAdmin, setViewingAdmin] = useState(null);

  useEffect(() => {
    localStorage.removeItem('joharsetu_gov_admins');
  }, []);

  const fetchAdmins = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await adminService.getAdmins({ limit: 100 });
      if (res?.records) {
        setAdmins(res.records);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to connect to database');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleFormSubmit = async (formData) => {
    try {
      const targetId = editingAdmin?.id || editingAdmin?._id || formData?.id;
      if (editingAdmin && targetId) {
        const { id, _id, ...cleanData } = formData;
        await adminService.updateAdmin(targetId, cleanData);
      } else {
        await adminService.createAdmin(formData);
      }
      setIsFormOpen(false);
      setEditingAdmin(null);
      await fetchAdmins();
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Error saving administrator';
      alert(msg);
    }
  };

  const handleToggleStatus = async (id) => {
    const target = admins.find(a => (a.id === id || a._id === id));
    if (!target) return;
    const targetId = target.id || target._id;
    try {
      await adminService.toggleAdminStatus(targetId);
      await fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Error updating status');
    }
  };

  const handleDeleteAdmin = async (id) => {
    const target = admins.find(a => (a.id === id || a._id === id));
    const targetId = target?.id || target?._id || id;
    if (!window.confirm(`Are you sure you want to delete ${target?.fullName || 'this administrator'} from the database?`)) return;
    try {
      await adminService.deleteAdmin(targetId);
      await fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Error removing administrator');
    }
  };

  return (
    <div className="space-y-4 pb-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Admin Management</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Manage system administrators directly from MongoDB database.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchAdmins}
            className="p-2 border border-slate-200 rounded-md bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shadow-2xs"
            title="Refresh from Database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
          <button
            onClick={() => { setEditingAdmin(null); setIsFormOpen(true); }}
            className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-black text-white font-semibold px-3.5 py-2 rounded-md text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Admin</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <AdminSummaryCards stats={stats} />

      <AdminDirectoryTable
        admins={admins}
        isLoading={isLoading}
        onViewAdmin={(admin) => setViewingAdmin(admin)}
        onEditAdmin={(admin) => { setEditingAdmin(admin); setIsFormOpen(true); }}
        onToggleStatus={handleToggleStatus}
        onDeleteAdmin={handleDeleteAdmin}
      />

      <AdminFormModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingAdmin(null); }}
        onSubmit={handleFormSubmit}
        initialData={editingAdmin}
      />

      <AdminViewModal
        isOpen={Boolean(viewingAdmin)}
        onClose={() => setViewingAdmin(null)}
        admin={viewingAdmin}
      />
    </div>
  );
};

export default AdminManagement;
