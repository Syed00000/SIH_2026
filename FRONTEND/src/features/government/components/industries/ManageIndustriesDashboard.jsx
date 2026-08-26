import React, { useState, useEffect, useCallback } from 'react';
import { Building2, AlertCircle } from 'lucide-react';
import { industryService } from '../../services/industryService.js';
import { IndustrySummaryCards } from './IndustrySummaryCards.jsx';
import { IndustryFiltersToolbar } from './IndustryFiltersToolbar.jsx';
import { IndustryTable } from './IndustryTable.jsx';
import { AddIndustryDrawer } from './AddIndustryDrawer.jsx';
import { EditIndustryDrawer } from './EditIndustryDrawer.jsx';
import { IndustryDetailsModal } from './IndustryDetailsModal.jsx';
import { IndustrySuccessModal } from './IndustrySuccessModal.jsx';
import { ApproveIndustryModal } from './ApproveIndustryModal.jsx';

export const ManageIndustriesDashboard = () => {
  const [industries, setIndustries] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedVerification, setSelectedVerification] = useState('All Verification');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal / Drawer States
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [viewingIndustry, setViewingIndustry] = useState(null);
  const [editingIndustry, setEditingIndustry] = useState(null);
  const [approvingIndustry, setApprovingIndustry] = useState(null);
  const [successCredentials, setSuccessCredentials] = useState(null);

  const fetchIndustries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await industryService.getIndustries({
        search: searchTerm,
        category: selectedCategory,
        thematicDomain: selectedDomain,
        status: selectedStatus,
        verificationStatus: selectedVerification,
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
  }, [searchTerm, selectedCategory, selectedDomain, selectedStatus, selectedVerification, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchIndustries();
  }, [fetchIndustries]);

  const handleCreateIndustry = async (payload) => {
    try {
      setIsSubmitting(true);
      const res = await industryService.createIndustry(payload);
      setIsAddDrawerOpen(false);
      const creds = res?.credentials || res?.data?.credentials;
      if (creds) setSuccessCredentials(creds);
      await fetchIndustries();
    } catch (err) {
      alert(err.response?.data?.error?.message || err.message || 'Error registering industry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveApplication = async (id, payload) => {
    try {
      setIsSubmitting(true);
      const res = await industryService.approveApplication(id, payload);
      setApprovingIndustry(null);
      const creds = res?.credentials || res?.data?.credentials;
      if (creds) setSuccessCredentials(creds);
      await fetchIndustries();
    } catch (err) {
      alert(err.response?.data?.error?.message || err.message || 'Error approving application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectApplication = async (id, payload) => {
    try {
      setIsSubmitting(true);
      await industryService.rejectApplication(id, payload);
      setApprovingIndustry(null);
      await fetchIndustries();
    } catch (err) {
      alert(err.response?.data?.error?.message || err.message || 'Error rejecting application');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleToggleStatus = async (ind) => {
    const isCurrentlyActive = ind.status === 'Active' && ind.accessStatus !== 'Disabled';
    const confirmMsg = isCurrentlyActive
      ? `Are you sure you want to disable "${ind.legalName}"?\n\nThe organization will no longer be able to log in, and all active sessions will be terminated.`
      : `Enable portal access for "${ind.legalName}"?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await industryService.toggleStatus(ind._id || ind.id);
      await fetchIndustries();
    } catch (err) {
      alert(err.response?.data?.error?.message || err.message || 'Error updating status');
    }
  };

  const handleResetPassword = async (ind) => {
    if (!window.confirm(`Regenerate security credentials for "${ind.legalName}"?\n\nThis will generate a new access key and invalidate current sessions.`)) {
      return;
    }

    try {
      const res = await industryService.resetPassword(ind._id || ind.id);
      const creds = res?.data || res;
      if (creds) {
        setSuccessCredentials({
          industryId: creds.industryId || ind.industryId,
          legalName: creds.legalName || ind.legalName,
          email: creds.email || ind.officialEmail,
          password: creds.password
        });
      }
      await fetchIndustries();
    } catch (err) {
      alert(err.response?.data?.error?.message || err.message || 'Error resetting password');
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedDomain('All Domains');
    setSelectedStatus('All Status');
    setSelectedVerification('All Verification');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4 pb-8 max-w-[1600px] w-full mx-auto select-none">
      {/* Header */}
      <div>
        <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Industry & Enterprise Governance</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage, verify and monitor industry partnerships, corporate support and enterprise participation.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <IndustrySummaryCards kpis={kpis} />

      {/* Main Directory Table Card */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-3.5">
        <IndustryFiltersToolbar
          searchTerm={searchTerm}
          onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
          selectedCategory={selectedCategory}
          onCategoryChange={(val) => { setSelectedCategory(val); setCurrentPage(1); }}
          selectedDomain={selectedDomain}
          onDomainChange={(val) => { setSelectedDomain(val); setCurrentPage(1); }}
          selectedStatus={selectedStatus}
          onStatusChange={(val) => { setSelectedStatus(val); setCurrentPage(1); }}
          selectedVerification={selectedVerification}
          onVerificationChange={(val) => { setSelectedVerification(val); setCurrentPage(1); }}
          onResetFilters={handleResetFilters}
          onAddIndustry={() => setIsAddDrawerOpen(true)}
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-md flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <IndustryTable
          industries={industries}
          isLoading={isLoading}
          totalRecords={totalRecords}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onLimitChange={(l) => { setItemsPerPage(l); setCurrentPage(1); }}
          onView={setViewingIndustry}
          onEdit={setEditingIndustry}
          onApprove={setApprovingIndustry}
          onReject={(ind) => handleRejectApplication(ind._id, { reason: 'Application rejected by administration' })}
          onToggleStatus={handleToggleStatus}
          onResetPassword={handleResetPassword}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Modals & Drawers */}
      <AddIndustryDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onSubmit={handleCreateIndustry}
        isLoading={isSubmitting}
      />

      <EditIndustryDrawer
        isOpen={Boolean(editingIndustry)}
        industry={editingIndustry}
        onClose={() => setEditingIndustry(null)}
        onSubmit={(payload) => handleUpdateIndustry(editingIndustry._id, payload)}
        isLoading={isSubmitting}
      />

      <ApproveIndustryModal
        isOpen={Boolean(approvingIndustry)}
        industry={approvingIndustry}
        onClose={() => setApprovingIndustry(null)}
        onApprove={handleApproveApplication}
        onReject={handleRejectApplication}
        isLoading={isSubmitting}
      />

      <IndustryDetailsModal
        isOpen={Boolean(viewingIndustry)}
        industry={viewingIndustry}
        onClose={() => setViewingIndustry(null)}
        onEdit={(ind) => {
          setViewingIndustry(null);
          setEditingIndustry(ind);
        }}
        onToggleStatus={handleToggleStatus}
      />

      <IndustrySuccessModal
        isOpen={Boolean(successCredentials)}
        credentials={successCredentials}
        onClose={() => setSuccessCredentials(null)}
      />
    </div>
  );
};

export default ManageIndustriesDashboard;
