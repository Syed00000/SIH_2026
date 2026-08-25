import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Users,
  ShieldCheck,
  Clock,
  Search,
  RotateCcw,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { universityService } from '../../services/universityService.js';
import { AddUniversityWizard } from './AddUniversityWizard.jsx';
import { ViewUniversityDetails } from './ViewUniversityDetails.jsx';
import { EditUniversityView } from './EditUniversityView.jsx';
import { DeleteUniversityModal } from './EditUniversityModal.jsx';
import { JHARKHAND_DISTRICTS_DATA } from '../../data/jharkhandGisData.js';

export const ManageUniversitiesDashboard = ({ initialMode = 'list' }) => {
  const [viewMode, setViewMode] = useState(initialMode); // 'list' | 'add' | 'view' | 'edit'
  const [activeUniversity, setActiveUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [universitiesData, setUniversitiesData] = useState({
    records: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    kpis: {
      totalUniversities: 0,
      activeUniversities: 0,
      disabledUniversities: 0,
      pendingApproval: 0,
      activePercentage: 0,
      disabledPercentage: 0
    }
  });

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Delete modal & notification
  const [selectedUniversityForDelete, setSelectedUniversityForDelete] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadUniversities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await universityService.getUniversities({
        search: searchQuery,
        district: selectedDistrict,
        status: selectedStatus,
        page,
        limit
      });
      if (data) {
        setUniversitiesData(data);
      }
    } catch (err) {
      console.error('Failed to load universities:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedDistrict, selectedStatus, page, limit]);

  useEffect(() => {
    loadUniversities();
  }, [loadUniversities]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDistrict('All Districts');
    setSelectedStatus('All Status');
    setPage(1);
  };

  // Immediate optimistic toggle with responsive backend synchronization
  const handleToggleAccess = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Enabled' ? 'Disabled' : 'Enabled';

    // 1. Immediate UI state update
    setUniversitiesData((prev) => {
      const updatedRecords = prev.records.map((r) => {
        if (r._id === id || r.id === id) {
          return { ...r, accessStatus: nextStatus };
        }
        return r;
      });

      const activeCount = updatedRecords.filter(
        (r) => r.accessStatus === 'Enabled' && (r.status === 'Approved' || r.status === 'Active')
      ).length;
      const disabledCount = updatedRecords.filter((r) => r.accessStatus === 'Disabled').length;

      return {
        ...prev,
        records: updatedRecords,
        kpis: {
          ...prev.kpis,
          activeUniversities: activeCount,
          disabledUniversities: disabledCount,
          activePercentage: updatedRecords.length
            ? Number(((activeCount / updatedRecords.length) * 100).toFixed(1))
            : prev.kpis.activePercentage,
          disabledPercentage: updatedRecords.length
            ? Number(((disabledCount / updatedRecords.length) * 100).toFixed(1))
            : prev.kpis.disabledPercentage
        }
      };
    });

    try {
      await universityService.toggleAccessStatus(id);
      showNotification(`University portal access changed to ${nextStatus}.`);
    } catch (err) {
      showNotification('Failed to update access status on server', 'error');
      loadUniversities();
    }
  };

  // Approve / Reject Handler
  const handleUpdateStatus = async (id, newStatus) => {
    // 1. Optimistic UI update
    setUniversitiesData((prev) => {
      const updatedRecords = prev.records.map((r) => {
        if (r._id === id || r.id === id) {
          return {
            ...r,
            status: newStatus,
            accessStatus: newStatus === 'Approved' ? 'Enabled' : (newStatus === 'Rejected' ? 'Disabled' : r.accessStatus)
          };
        }
        return r;
      });

      const activeCount = updatedRecords.filter(
        (r) => r.accessStatus === 'Enabled' && (r.status === 'Approved' || r.status === 'Active')
      ).length;
      const disabledCount = updatedRecords.filter((r) => r.accessStatus === 'Disabled').length;
      const pendingCount = updatedRecords.filter((r) => r.status === 'Pending').length;

      return {
        ...prev,
        records: updatedRecords,
        kpis: {
          ...prev.kpis,
          activeUniversities: activeCount,
          disabledUniversities: disabledCount,
          pendingApproval: pendingCount,
          activePercentage: updatedRecords.length
            ? Number(((activeCount / updatedRecords.length) * 100).toFixed(1))
            : prev.kpis.activePercentage,
          disabledPercentage: updatedRecords.length
            ? Number(((disabledCount / updatedRecords.length) * 100).toFixed(1))
            : prev.kpis.disabledPercentage
        }
      };
    });

    try {
      await universityService.updateStatus(id, newStatus);
      showNotification(`University status successfully updated to "${newStatus}".`);
      loadUniversities();
    } catch (err) {
      showNotification('Failed to update status', 'error');
      loadUniversities();
    }
  };

  const handleCreateUniversity = async (payload) => {
    const res = await universityService.createUniversity(payload);
    showNotification('University registered and credentials generated successfully!');
    if (res?.university) {
      setActiveUniversity(res.university);
      setViewMode('view');
    } else {
      setViewMode('list');
    }
    loadUniversities();
  };

  const handleSaveEdit = async (id, payload) => {
    const updated = await universityService.updateUniversity(id, payload);
    showNotification('University details updated successfully!');
    if (updated) {
      setActiveUniversity(updated);
      setViewMode('view');
    } else {
      setViewMode('list');
    }
    loadUniversities();
  };

  const handleDeleteConfirm = async (id) => {
    await universityService.deleteUniversity(id);
    showNotification('University removed from system.');
    loadUniversities();
  };

  const DISTRICT_OPTIONS = ['All Districts', ...Object.values(JHARKHAND_DISTRICTS_DATA).map((d) => d.name).sort()];

  // 1. ADD NEW UNIVERSITY VIEW
  if (viewMode === 'add') {
    return (
      <AddUniversityWizard
        onCancel={() => setViewMode('list')}
        onSuccess={() => {
          loadUniversities();
        }}
        onCreateUniversity={handleCreateUniversity}
      />
    );
  }

  // 2. VIEW UNIVERSITY DETAILS FULL COMPONENT
  if (viewMode === 'view' && activeUniversity) {
    return (
      <ViewUniversityDetails
        university={activeUniversity}
        onBack={() => {
          setActiveUniversity(null);
          setViewMode('list');
        }}
        onEdit={() => setViewMode('edit')}
        onUpdateStatus={async (id, status) => {
          await handleUpdateStatus(id, status);
          const fresh = await universityService.getUniversityById(id);
          setActiveUniversity(fresh);
        }}
      />
    );
  }

  // 3. EDIT UNIVERSITY FULL COMPONENT
  if (viewMode === 'edit' && activeUniversity) {
    return (
      <EditUniversityView
        university={activeUniversity}
        onCancel={() => setViewMode('view')}
        onSuccess={() => {
          loadUniversities();
        }}
        onUpdateUniversity={handleSaveEdit}
      />
    );
  }

  const { records, total, kpis } = universitiesData;

  // 4. MAIN LIST & TABLE VIEW
  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center space-x-2 animate-slideUp ${
            notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-900 text-white border border-slate-700'
          }`}
        >
          {notification.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">User Governance - Universities</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage, review and monitor all registered universities and their access to the platform.
        </p>
      </div>

      {/* Top 4 KPI Summary Cards (100% Real Live Database Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Universities */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Total Universities</div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {kpis.totalUniversities ?? total}
            </div>
            <div className="text-[11px] font-semibold text-slate-400">All Registered in DB</div>
          </div>
        </div>

        {/* Active Universities */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Active Universities</div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {kpis.activeUniversities ?? 0}
            </div>
            <div className="text-[11px] font-bold text-emerald-600">
              {kpis.activePercentage ?? 0}% <span className="font-medium text-slate-400">of total</span>
            </div>
          </div>
        </div>

        {/* Disabled Universities */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200/60 text-red-600 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Disabled Universities</div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {kpis.disabledUniversities ?? 0}
            </div>
            <div className="text-[11px] font-bold text-red-600">
              {kpis.disabledPercentage ?? 0}% <span className="font-medium text-slate-400">of total</span>
            </div>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Pending Approval</div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {kpis.pendingApproval ?? 0}
            </div>
            <div className="text-[11px] font-semibold text-amber-600">Awaiting Review</div>
          </div>
        </div>
      </div>

      {/* Filter Row & Action Button */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search universities by name, code or email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden transition-colors"
          />
        </div>

        {/* District Dropdown */}
        <div className="w-full md:w-44">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
          >
            {DISTRICT_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="w-full md:w-36">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
          >
            <option value="All Status">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Reset Filters */}
        <button
          type="button"
          onClick={handleResetFilters}
          className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Filters</span>
        </button>

        {/* + Add Universities Button */}
        <button
          type="button"
          onClick={() => setViewMode('add')}
          className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Universities</span>
        </button>
      </div>

      {/* Universities Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">University / Institution</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Nodal Officer</th>
                <th className="py-3 px-4">Registered On</th>
                <th className="py-3 px-4">Review Status</th>
                <th className="py-3 px-4">Access Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    <div className="inline-block animate-spin w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full mb-2"></div>
                    <div className="text-xs font-bold text-slate-700">Loading universities directly from database...</div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <div className="text-xs font-bold text-slate-700">No universities found in database matching criteria</div>
                    <button
                      onClick={handleResetFilters}
                      className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Reset all filters
                    </button>
                  </td>
                </tr>
              ) : (
                records.map((uni) => {
                  const firstLetter = uni.name ? uni.name.charAt(0).toUpperCase() : 'U';
                  const isEnabled = uni.accessStatus === 'Enabled';
                  const isPending = uni.status === 'Pending';
                  const isRejected = uni.status === 'Rejected';
                  const regDate = uni.createdAt
                    ? new Date(uni.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })
                    : '20 May 2025';

                  return (
                    <tr key={uni._id || uni.id || uni.code} className="hover:bg-slate-50/80 transition-colors">
                      {/* 1. University Column */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          {/* 1st Letter Circular Avatar */}
                          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-2xs border border-slate-700 flex-shrink-0">
                            {firstLetter}
                          </div>
                          <div>
                            <div
                              className="font-bold text-blue-700 hover:underline cursor-pointer"
                              onClick={() => {
                                setActiveUniversity(uni);
                                setViewMode('view');
                              }}
                            >
                              {uni.name}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">Code: {uni.code}</div>
                            <div className="text-[11px] text-slate-400">{uni.universityEmail}</div>
                          </div>
                        </div>
                      </td>

                      {/* 2. District Column */}
                      <td className="py-3 px-4 font-semibold text-slate-800">{uni.district}</td>

                      {/* 3. Nodal Officer Column */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{uni.nodalOfficer?.name || 'N/A'}</div>
                        <div className="text-[11px] text-slate-500">{uni.nodalOfficer?.email}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{uni.nodalOfficer?.phone}</div>
                      </td>

                      {/* 4. Registered On */}
                      <td className="py-3 px-4 font-medium text-slate-500">{regDate}</td>

                      {/* 5. Review Status Badge + Quick Action */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              uni.status === 'Approved' || uni.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : uni.status === 'Pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            {uni.status || 'Approved'}
                          </span>

                          {/* Quick Approve / Reject Buttons for Pending & Rejected */}
                          {isPending && (
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleUpdateStatus(uni._id || uni.id, 'Approved')}
                                className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors cursor-pointer"
                                title="Approve University"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(uni._id || uni.id, 'Rejected')}
                                className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors cursor-pointer"
                                title="Reject University"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          {isRejected && (
                            <button
                              onClick={() => handleUpdateStatus(uni._id || uni.id, 'Approved')}
                              className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-bold transition-colors cursor-pointer flex items-center space-x-0.5"
                              title="Re-Approve University"
                            >
                              <Check className="w-2.5 h-2.5" />
                              <span>Re-Approve</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* 6. Access Status Toggle Switch */}
                      <td className="py-3 px-4">
                        <div
                          onClick={() => handleToggleAccess(uni._id || uni.id, uni.accessStatus)}
                          className="inline-flex items-center space-x-2 cursor-pointer group"
                        >
                          <div
                            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                              isEnabled ? 'bg-emerald-600' : 'bg-slate-300 group-hover:bg-slate-400'
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                isEnabled ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </div>
                          <span className={`text-[11px] font-bold ${isEnabled ? 'text-slate-800' : 'text-slate-400'}`}>
                            {uni.accessStatus}
                          </span>
                        </div>
                      </td>

                      {/* 7. Action Buttons (View, Edit, Clock, Trash) */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          {/* View Component Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setActiveUniversity(uni);
                              setViewMode('view');
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="View University Full Details & Credentials"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Component Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setActiveUniversity(uni);
                              setViewMode('edit');
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit University"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Trash / Delete */}
                          <button
                            type="button"
                            onClick={() => setSelectedUniversityForDelete(uni)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete University"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-800">{records.length > 0 ? (page - 1) * limit + 1 : 0}</span> to{' '}
            <span className="font-bold text-slate-800">{Math.min(page * limit, total)}</span> of{' '}
            <span className="font-bold text-slate-800">{total}</span> universities
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>

            <div className="flex items-center space-x-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-xs">
                {page}
              </button>

              <button
                disabled={page >= Math.ceil(total / limit)}
                onClick={() => setPage((p) => p + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteUniversityModal
        university={selectedUniversityForDelete}
        isOpen={Boolean(selectedUniversityForDelete)}
        onClose={() => setSelectedUniversityForDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ManageUniversitiesDashboard;
