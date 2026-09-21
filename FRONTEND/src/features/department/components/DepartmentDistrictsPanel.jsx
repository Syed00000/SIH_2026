import React, { useState } from 'react';
import { Building2, Plus, Search } from 'lucide-react';
import departmentService from '../../government/services/departmentService.js';
import { ViewDistrictModal } from './ViewDistrictModal.jsx';
import { getSectionTitle, getJurisdictionLabel } from './departmentDistricts.helper.js';
import { DepartmentDistrictDetailView } from './DepartmentDistrictDetailView.jsx';
import { DepartmentDistrictsTable } from './DepartmentDistrictsTable.jsx';

export const DepartmentDistrictsPanel = ({
  districts = [],
  isDistrictDept = false,
  isBlockDept = false,
  onAddDistrict,
  onDeletedDistrict
}) => {
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [viewingDistrict, setViewingDistrict] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const filtered = districts.filter((d) => {
    const q = search.toLowerCase();
    return (
      (d.name || '').toLowerCase().includes(q) ||
      (d.district || '').toLowerCase().includes(q) ||
      (d.block || '').toLowerCase().includes(q) ||
      (d.ward || '').toLowerCase().includes(q) ||
      (d.code || '').toLowerCase().includes(q) ||
      (d.deptId || '').toLowerCase().includes(q) ||
      (d.headEmail || d.credentials?.loginEmail || '').toLowerCase().includes(q) ||
      (d.headName || '').toLowerCase().includes(q)
    );
  });

  const handleDelete = async (e, dist) => {
    if (e) e.stopPropagation();
    const distId = dist.deptId || dist.id || dist._id;
    if (!window.confirm(`Are you sure you want to remove "${dist.name}"?`)) return;
    try {
      setDeletingId(distId);
      await departmentService.deleteDepartment(distId);
      if (onDeletedDistrict) onDeletedDistrict(distId);
      if (viewingDistrict && (viewingDistrict.deptId === distId || viewingDistrict.id === distId || viewingDistrict._id === distId)) {
        setViewingDistrict(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete department');
    } finally {
      setDeletingId(null);
    }
  };

  const togglePasswordVisibility = (e, idKey) => {
    if (e) e.stopPropagation();
    setVisiblePasswords((prev) => ({
      ...prev,
      [idKey]: !prev[idKey]
    }));
  };

  const handleCopy = (text, key) => {
    if (!text || text === '-') return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (viewingDistrict) {
    return (
      <DepartmentDistrictDetailView
        dist={viewingDistrict}
        setViewingDistrict={setViewingDistrict}
        isBlockDept={isBlockDept}
        isDistrictDept={isDistrictDept}
        visiblePasswords={visiblePasswords}
        togglePasswordVisibility={togglePasswordVisibility}
        copiedKey={copiedKey}
        handleCopy={handleCopy}
        deletingId={deletingId}
        handleDelete={handleDelete}
        getSectionTitle={() => getSectionTitle(isBlockDept, isDistrictDept)}
      />
    );
  }

  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-150">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0f4b3a]/10 text-[#0f4b3a] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 leading-tight">
              {getSectionTitle(isBlockDept, isDistrictDept)} ({districts.length})
            </h2>
            <p className="text-xs text-slate-500">
              {isBlockDept
                ? 'Manage ward-level offices & portal access credentials'
                : isDistrictDept
                ? 'Manage local block/tehsil bodies & portal access'
                : 'Manage district-level departments & portal access credentials'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isBlockDept ? 'Search wards...' : isDistrictDept ? 'Search blocks & tehsils...' : 'Search districts...'}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0f4b3a]"
            />
          </div>
          <button
            type="button"
            onClick={onAddDistrict}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f4b3a] hover:bg-[#0a3a2c] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isBlockDept ? 'Add Ward Commissioner' : isDistrictDept ? 'Add Block / Tehsil' : 'Add District'}</span>
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <DepartmentDistrictsTable
        filtered={filtered}
        isBlockDept={isBlockDept}
        isDistrictDept={isDistrictDept}
        getJurisdictionLabel={() => getJurisdictionLabel(isBlockDept, isDistrictDept)}
        visiblePasswords={visiblePasswords}
        togglePasswordVisibility={togglePasswordVisibility}
        setViewingDistrict={setViewingDistrict}
        deletingId={deletingId}
        handleDelete={handleDelete}
      />

      <ViewDistrictModal
        isOpen={false}
        onClose={() => setViewingDistrict(null)}
        district={null}
      />
    </div>
  );
};

export default DepartmentDistrictsPanel;
