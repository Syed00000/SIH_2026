import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { AdminSummaryCards } from './AdminSummaryCards.jsx';
import { AdminDirectoryTable } from './AdminDirectoryTable.jsx';
import { AdminFormModal } from './AdminFormModal.jsx';
import { AdminViewModal } from './AdminViewModal.jsx';
import { governmentDataService } from '../../services/governmentDataService.js';
import axios from 'axios';

export const AdminManagement = () => {
  const [admins, setAdmins] = useState(governmentDataService.getAdmins());
  const [stats, setStats] = useState(governmentDataService.getAdminStats());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [viewingAdmin, setViewingAdmin] = useState(null);

  // Sync with Backend API on mount
  useEffect(() => {
    const fetchBackendAdmins = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/government/admins?limit=100');
        if (res.data?.success && res.data?.data) {
          setAdmins(res.data.data);
          if (res.data.stats) {
            setStats(res.data.stats);
          }
        }
      } catch {
        // Fallback to local storage / mock data
        setAdmins(governmentDataService.getAdmins());
        setStats(governmentDataService.getAdminStats());
      }
    };

    fetchBackendAdmins();
  }, []);

  // Handler: Add or Update Admin
  const handleFormSubmit = async (adminData) => {
    if (editingAdmin) {
      // Update existing admin
      const updated = governmentDataService.updateAdmin(editingAdmin.id, adminData);
      setAdmins(updated);
      setStats(governmentDataService.getAdminStats());

      // Sync backend
      try {
        await axios.put(`http://localhost:3000/api/v1/government/admins/${editingAdmin.id}`, adminData);
      } catch (err) {
        console.warn('Backend update failed, kept local change:', err.message);
      }
    } else {
      // Create new admin
      const updated = governmentDataService.createAdmin(adminData);
      setAdmins(updated);
      setStats(governmentDataService.getAdminStats());

      // Sync backend
      try {
        await axios.post('http://localhost:3000/api/v1/government/admins', adminData);
      } catch (err) {
        console.warn('Backend create failed, kept local change:', err.message);
      }
    }

    setIsFormOpen(false);
    setEditingAdmin(null);
  };

  // Handler: Toggle Status (Active / Suspended)
  const handleToggleStatus = async (id) => {
    const updated = governmentDataService.toggleAdminStatus(id);
    setAdmins(updated);
    setStats(governmentDataService.getAdminStats());

    const target = updated.find((a) => a.id === id);
    if (target) {
      try {
        await axios.patch(`http://localhost:3000/api/v1/government/admins/${id}/status`, {
          status: target.status
        });
      } catch (err) {
        console.warn('Backend status toggle failed, kept local change:', err.message);
      }
    }
  };

  // Handler: Delete Admin
  const handleDeleteAdmin = async (id) => {
    if (window.confirm('Are you sure you want to remove this administrator?')) {
      const updated = governmentDataService.deleteAdmin(id);
      setAdmins(updated);
      setStats(governmentDataService.getAdminStats());

      try {
        await axios.delete(`http://localhost:3000/api/v1/government/admins/${id}`);
      } catch (err) {
        console.warn('Backend delete failed, kept local change:', err.message);
      }
    }
  };

  return (
    <div className="space-y-5 pb-8 max-w-[1600px] mx-auto">
      {/* 1. Main Header Title & Top-Right Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Admin Management
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            Manage system administrators and their access privileges.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingAdmin(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-all cursor-pointer hover:shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Admin</span>
        </button>
      </div>

      {/* 2. Top 4 Summary / KPI Stat Cards */}
      <AdminSummaryCards stats={stats} />

      {/* 3. Main Admin Directory Table with Filters and Pagination */}
      <AdminDirectoryTable
        admins={admins}
        onViewAdmin={(admin) => setViewingAdmin(admin)}
        onEditAdmin={(admin) => {
          setEditingAdmin(admin);
          setIsFormOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
        onDeleteAdmin={handleDeleteAdmin}
      />

      {/* 4. Add / Edit Admin Modal */}
      <AdminFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAdmin(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingAdmin}
      />

      {/* 5. View Admin Details Modal */}
      <AdminViewModal
        isOpen={Boolean(viewingAdmin)}
        onClose={() => setViewingAdmin(null)}
        admin={viewingAdmin}
      />
    </div>
  );
};

export default AdminManagement;
