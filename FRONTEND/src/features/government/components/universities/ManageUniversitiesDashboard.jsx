import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { universityService } from '../../services/universityService.js';
import { UniversitySummaryCards } from './UniversitySummaryCards.jsx';
import { UniversityFiltersToolbar } from './UniversityFiltersToolbar.jsx';
import { UniversityTable } from './UniversityTable.jsx';
import { AddUniversityWizard } from './AddUniversityWizard.jsx';
import { ViewUniversityDetails } from './ViewUniversityDetails.jsx';
import { EditUniversityView } from './EditUniversityView.jsx';
import { DeleteUniversityModal } from './DeleteUniversityModal.jsx';
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
      pendingApproval: 0
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

  const handleToggleAccess = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Enabled' ? 'Disabled' : 'Enabled';
    setUniversitiesData((prev) => ({
      ...prev,
      records: prev.records.map((r) => (r._id === id || r.id === id ? { ...r, accessStatus: nextStatus } : r))
    }));

    try {
      await universityService.toggleAccessStatus(id);
      showNotification(`University portal access changed to ${nextStatus}.`);
      loadUniversities();
    } catch (err) {
      showNotification('Failed to update access status on server', 'error');
      loadUniversities();
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setUniversitiesData((prev) => ({
      ...prev,
      records: prev.records.map((r) =>
        r._id === id || r.id === id
          ? {
              ...r,
              status: newStatus,
              accessStatus: newStatus === 'Approved' ? 'Enabled' : (newStatus === 'Rejected' ? 'Disabled' : r.accessStatus)
            }
          : r
      )
    }));

    try {
      await universityService.updateStatus(id, newStatus);
      showNotification(`University status marked as ${newStatus}.`);
      loadUniversities();
    } catch (err) {
      showNotification('Failed to update status on server', 'error');
      loadUniversities();
    }
  };

  const DISTRICT_OPTIONS = ['All Districts', ...Object.values(JHARKHAND_DISTRICTS_DATA).map((d) => d.name).sort()];

  if (viewMode === 'add') {
    return (
      <AddUniversityWizard
        onCancel={() => setViewMode('list')}
        onSuccess={() => {
          setViewMode('list');
          loadUniversities();
        }}
        onCreateUniversity={async (payload) => {
          const created = await universityService.createUniversity(payload);
          showNotification('University successfully registered into JoharSetu!');
          return created;
        }}
      />
    );
  }

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

  if (viewMode === 'edit' && activeUniversity) {
    return (
      <EditUniversityView
        university={activeUniversity}
        onCancel={() => setViewMode('view')}
        onSuccess={() => {
          loadUniversities();
        }}
        onUpdateUniversity={async (id, payload) => {
          const updated = await universityService.updateUniversity(id, payload);
          showNotification('University details updated successfully!');
          if (updated) {
            setActiveUniversity(updated);
            setViewMode('view');
          } else {
            setViewMode('list');
          }
          loadUniversities();
        }}
      />
    );
  }

  const { records, total, kpis } = universitiesData;

  return (
    <div className="space-y-4 pb-8 max-w-[1600px] w-full mx-auto select-none">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-md shadow-xl text-xs font-semibold flex items-center space-x-2 animate-slideUp ${
            notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-900 text-white border border-slate-700'
          }`}
        >
          {notification.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">User Governance - Universities</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage, review and monitor all registered universities and their access to the platform.
        </p>
      </div>

      {/* Top Summary Cards */}
      <UniversitySummaryCards kpis={kpis} total={total} />

      {/* Directory Section Container */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-3.5">
        <UniversityFiltersToolbar
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val);
            setPage(1);
          }}
          selectedDistrict={selectedDistrict}
          onDistrictChange={(val) => {
            setSelectedDistrict(val);
            setPage(1);
          }}
          districtOptions={DISTRICT_OPTIONS}
          selectedStatus={selectedStatus}
          onStatusChange={(val) => {
            setSelectedStatus(val);
            setPage(1);
          }}
          onResetFilters={handleResetFilters}
          onAddUniversity={() => setViewMode('add')}
        />

        <UniversityTable
          loading={loading}
          records={records}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
          onViewUniversity={(uni) => {
            setActiveUniversity(uni);
            setViewMode('view');
          }}
          onEditUniversity={(uni) => {
            setActiveUniversity(uni);
            setViewMode('edit');
          }}
          onToggleAccess={handleToggleAccess}
          onUpdateStatus={handleUpdateStatus}
          onDeleteClick={setSelectedUniversityForDelete}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Delete Modal */}
      <DeleteUniversityModal
        university={selectedUniversityForDelete}
        isOpen={Boolean(selectedUniversityForDelete)}
        onClose={() => setSelectedUniversityForDelete(null)}
        onConfirm={async (id) => {
          await universityService.deleteUniversity(id);
          showNotification('University removed from system.');
          loadUniversities();
        }}
      />
    </div>
  );
};

export default ManageUniversitiesDashboard;
