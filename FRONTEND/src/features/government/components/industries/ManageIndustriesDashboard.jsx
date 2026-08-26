import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, ChevronDown, SlidersHorizontal, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { IndustrySummaryCards } from './IndustrySummaryCards.jsx';
import { IndustryTable } from './IndustryTable.jsx';
import { AddIndustryDrawer, INDUSTRY_CATEGORIES, THEMATIC_DOMAINS } from './AddIndustryDrawer.jsx';
import { EditIndustryDrawer } from './EditIndustryDrawer.jsx';
import { IndustryDetailsModal } from './IndustryDetailsModal.jsx';
import { IndustrySuccessModal } from './IndustrySuccessModal.jsx';
import { industryService } from '../../services/industryService.js';

export const ManageIndustriesDashboard = () => {
  const [industries, setIndustries] = useState([]);
  const [kpis, setKpis] = useState({
    totalIndustries: 0,
    activeIndustries: 0,
    disabledIndustries: 0,
    verifiedPartners: 0,
    totalCsrFundsCr: 0,
    supportedProjects: 0,
    verifiedLabs: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal / Drawer States
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState(null);
  const [viewingIndustry, setViewingIndustry] = useState(null);
  const [successCredentials, setSuccessCredentials] = useState(null);

  // Fetch industries from real MongoDB backend
  const fetchIndustries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await industryService.getIndustries({
        search: searchTerm,
        category: selectedCategory,
        thematicDomain: selectedDomain,
        status: selectedStatus,
        page: currentPage,
        limit: itemsPerPage
      });

      if (data) {
        setIndustries(data.records || []);
        setTotalRecords(data.total || 0);
        setTotalPages(data.totalPages || 1);
        if (data.kpis) setKpis(data.kpis);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to load industry directory');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedDomain, selectedStatus, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchIndustries();
  }, [fetchIndustries]);

  // Handle Create Industry
  const handleCreateIndustry = async (payload) => {
    try {
      setIsSubmitting(true);
      const res = await industryService.createIndustry(payload);
      setIsAddDrawerOpen(false);
      if (res?.data?.credentials) {
        setSuccessCredentials(res.data.credentials);
      }
      await fetchIndustries();
    } catch (err) {
      alert(err.response?.data?.error?.message || err.message || 'Error registering industry');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Update Industry
  const handleUpdateIndustry = async (id, payload) => {
    try {
      setIsSubmitting(true);
      await industryService.updateIndustry(id, payload);
      setEditingIndustry(null);
      await fetchIndustries();
    } catch (err) {
      alert(err.response?.data?.error?.message || err.message || 'Error updating industry details');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Toggle Status (Active <-> Disabled)
  const handleToggleStatus = async (ind) => {
    const isCurrentlyActive = ind.status === 'Active' && ind.accessStatus !== 'Disabled';
    const confirmMsg = isCurrentlyActive
      ? `Are you sure you want to disable "${ind.legalName}"?\n\nThe organization will no longer be able to log in, and all active sessions will be terminated.`
      : `Enable portal access for "${ind.legalName}"?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await industryService.toggleStatus(ind._id);
      await fetchIndustries();
    } catch (err) {
      alert(err.response?.data?.error?.message || err.message || 'Error updating status');
    }
  };

  // Handle Password Reset
  const handleResetPassword = async (ind) => {
    if (
      !window.confirm(
        `Regenerate security credentials for "${ind.legalName}"?\n\nThis will generate a new access key and invalidate current sessions.`
      )
    )
      return;

    try {
      const res = await industryService.resetPassword(ind._id);
      if (res?.data) {
        setSuccessCredentials({
          industryId: res.data.industryId,
          legalName: res.data.legalName,
          email: res.data.email,
          password: res.data.password
        });
      }
      await fetchIndustries();
    } catch (err) {
      alert(err.response?.data?.error?.message || err.message || 'Error resetting password');
    }
  };

  // Handle Delete Industry
  const handleDeleteIndustry = async (ind) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently remove "${ind.legalName}" from the government registry?`
      )
    )
      return;

    try {
      await industryService.deleteIndustry(ind._id);
      await fetchIndustries();
    } catch (err) {
      alert(err.response?.data?.error?.message || err.message || 'Error deleting industry');
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (industries.length === 0) return;
    const headers = ['Industry ID', 'Legal Name', 'Category', 'Domain', 'Support Modes', 'SPOC Name', 'Email', 'Mobile', 'Status'];
    const rows = industries.map((i) => [
      i.industryId,
      `"${i.legalName}"`,
      i.category,
      `"${i.thematicDomain}"`,
      `"${Array.isArray(i.supportModes) ? i.supportModes.join(', ') : i.supportModes}"`,
      `"${i.spocName}"`,
      i.officialEmail,
      i.mobileNumber,
      i.status
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `JoharSetu_Industries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-8 max-w-[1600px] mx-auto">
      {/* Top 4 KPI Summary Cards matching reference */}
      <IndustrySummaryCards stats={kpis} />

      {/* Directory Main Section Container */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
        {/* Header Title Bar with Badges and Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Industry & Partner Directory
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100/80 text-amber-800 border border-amber-200">
              Awaiting Review
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchIndustries}
              className="p-2 border border-slate-200 rounded hover:bg-slate-50 text-slate-600 cursor-pointer shadow-2xs"
              title="Refresh Directory"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>

            {/* Export Dropdown Button matching Reference */}
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-3 py-1.5 rounded border border-slate-200 text-xs shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Primary Action Button matching Reference */}
            <button
              onClick={() => setIsAddDrawerOpen(true)}
              className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded text-xs shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Industry</span>
            </button>
          </div>
        </div>

        {/* Error Alert Display if any */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID, domain, SPOC or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
            />
          </div>

          {/* Category Filter */}
          <div className="relative min-w-[140px]">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 pr-8 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none cursor-pointer appearance-none shadow-2xs"
            >
              <option value="All">All Categories</option>
              {INDUSTRY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Thematic Domain Filter */}
          <div className="relative min-w-[150px]">
            <select
              value={selectedDomain}
              onChange={(e) => {
                setSelectedDomain(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 pr-8 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none cursor-pointer appearance-none shadow-2xs"
            >
              <option value="All">All Domains</option>
              {THEMATIC_DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[120px]">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 pr-8 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none cursor-pointer appearance-none shadow-2xs"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedDomain('All');
              setSelectedStatus('All');
              setCurrentPage(1);
            }}
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-600 font-medium px-3 py-1.5 rounded border border-slate-200 text-xs transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>

        {/* Real Server-Backed Industry Directory Table */}
        <IndustryTable
          industries={industries}
          isLoading={isLoading}
          totalRecords={totalRecords}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={(p) => setCurrentPage(p)}
          onLimitChange={(l) => {
            setItemsPerPage(l);
            setCurrentPage(1);
          }}
          onView={(ind) => setViewingIndustry(ind)}
          onEdit={(ind) => setEditingIndustry(ind)}
          onToggleStatus={handleToggleStatus}
          onResetPassword={handleResetPassword}
          onDelete={handleDeleteIndustry}
        />
      </div>

      {/* 1. Slide-over Add Industry Drawer */}
      <AddIndustryDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onSubmit={handleCreateIndustry}
        isLoading={isSubmitting}
      />

      {/* 2. Slide-over Edit Industry Drawer */}
      <EditIndustryDrawer
        isOpen={Boolean(editingIndustry)}
        industry={editingIndustry}
        onClose={() => setEditingIndustry(null)}
        onSubmit={handleUpdateIndustry}
        isLoading={isSubmitting}
      />

      {/* 3. View Industry Details Modal */}
      <IndustryDetailsModal
        isOpen={Boolean(viewingIndustry)}
        industry={viewingIndustry}
        onClose={() => setViewingIndustry(null)}
      />

      {/* 4. Success / One-time Credentials Modal */}
      <IndustrySuccessModal
        isOpen={Boolean(successCredentials)}
        credentials={successCredentials}
        onClose={() => setSuccessCredentials(null)}
      />
    </div>
  );
};

export default ManageIndustriesDashboard;
