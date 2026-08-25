import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  Eye,
  Pencil,
  PauseCircle,
  PlayCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../data/mockGovernmentData.js';
import { ADMIN_ROLES_LIST, ADMIN_STATUS_LIST } from '../../data/mockAdminData.js';

const AVATAR_COLOR_MAP = {
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  pink: 'bg-pink-100 text-pink-700 border-pink-200',
  yellow: 'bg-amber-100 text-amber-700 border-amber-200',
  teal: 'bg-teal-100 text-teal-700 border-teal-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  cyan: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  violet: 'bg-violet-100 text-violet-700 border-violet-200',
  rose: 'bg-rose-100 text-rose-700 border-rose-200',
  indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200'
};

const getRoleBadgeStyle = (role) => {
  const map = {
    'Super Admin': 'bg-purple-50 text-purple-700 border-purple-200/70',
    'Nodal Officer': 'bg-blue-50 text-blue-600 border-blue-200/70',
    'District Admin': 'bg-sky-50 text-sky-700 border-sky-200/70',
    'HEI Admin': 'bg-cyan-50 text-cyan-700 border-cyan-200/70'
  };
  return map[role] || 'bg-slate-100 text-slate-700 border-slate-200';
};

const getStatusBadgeStyle = (status) => {
  const map = {
    Active: { pill: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', dot: 'bg-emerald-500' },
    Suspended: { pill: 'bg-amber-50 text-amber-700 border-amber-200/80', dot: 'bg-amber-500' },
    Removed: { pill: 'bg-red-50 text-red-600 border-red-200/80', dot: 'bg-red-500' }
  };
  return map[status] || { pill: 'bg-slate-50 text-slate-600 border-slate-200', dot: 'bg-slate-400' };
};

const getInitials = (name = '') => {
  const parts = name.trim().split(' ');
  return (parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2) || 'AD').toUpperCase();
};

export const AdminDirectoryTable = ({
  admins = [],
  onViewAdmin,
  onEditAdmin,
  onToggleStatus,
  onDeleteAdmin
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const filteredAdmins = admins.filter((admin) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const match = admin.fullName.toLowerCase().includes(q) || admin.email.toLowerCase().includes(q) ||
        admin.role.toLowerCase().includes(q) || admin.district.toLowerCase().includes(q) || admin.mobileNumber.includes(q);
      if (!match) return false;
    }
    if (selectedRole !== 'All Roles' && admin.role.toLowerCase() !== selectedRole.toLowerCase()) return false;
    if (selectedStatus !== 'All Status' && admin.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;
    if (selectedDistrict !== 'All' && admin.district.toLowerCase() !== selectedDistrict.toLowerCase()) return false;
    return true;
  });

  const totalRecords = filteredAdmins.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalRecords);
  const paginatedAdmins = filteredAdmins.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      {/* Directory Header & Filtering Toolbar */}
      <div className="p-5 border-b border-slate-100 space-y-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">Admin Directory</h2>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input Bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200/90 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Filters: Role, Status, District */}
          {[
            { value: selectedRole, setter: setSelectedRole, options: ADMIN_ROLES_LIST },
            { value: selectedStatus, setter: setSelectedStatus, options: ADMIN_STATUS_LIST },
            { value: selectedDistrict, setter: setSelectedDistrict, options: ['All Districts', ...JHARKHAND_DISTRICTS_LIST.filter(d => d !== 'All')] }
          ].map((flt, idx) => (
            <div key={idx} className="relative min-w-[130px]">
              <select
                value={flt.value === 'All' ? 'All Districts' : flt.value}
                onChange={(e) => { flt.setter(e.target.value === 'All Districts' ? 'All' : e.target.value); setCurrentPage(1); }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer appearance-none shadow-2xs"
              >
                {flt.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          ))}

          <button
            onClick={() => { setSearchTerm(''); setSelectedRole('All Roles'); setSelectedStatus('All Status'); setSelectedDistrict('All'); setCurrentPage(1); }}
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-3.5 py-2 rounded-xl border border-slate-200 text-xs shadow-2xs transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Table Viewport */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-5">Admin Name</th>
              <th className="py-3.5 px-4">Email ID</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">District</th>
              <th className="py-3.5 px-4">Last Login</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedAdmins.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <UserCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-600">No administrators found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Try adjusting your search query or filters.</p>
                </td>
              </tr>
            ) : (
              paginatedAdmins.map((admin) => {
                const avatarClass = AVATAR_COLOR_MAP[admin.avatarColor] || AVATAR_COLOR_MAP.purple;
                const statusStyle = getStatusBadgeStyle(admin.status);

                return (
                  <tr key={admin.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${avatarClass}`}>
                          {getInitials(admin.fullName)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 leading-tight">{admin.fullName}</div>
                          <div className="text-[11px] font-medium text-slate-400 mt-0.5">{admin.mobileNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium font-mono text-[11px]">{admin.email}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getRoleBadgeStyle(admin.role)}`}>
                        {admin.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-semibold">{admin.district}</td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] font-medium whitespace-nowrap">{admin.lastLogin}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusStyle.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        <span>{admin.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button onClick={() => onViewAdmin?.(admin)} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer shadow-2xs" title="View Admin Profile">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onEditAdmin?.(admin)} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer shadow-2xs" title="Edit Admin">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onToggleStatus?.(admin.id)}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shadow-2xs ${
                            admin.status === 'Suspended' ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300' : 'border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300'
                          }`}
                          title={admin.status === 'Suspended' ? 'Activate Admin' : 'Suspend Admin'}
                        >
                          {admin.status === 'Suspended' ? <PlayCircle className="w-3.5 h-3.5" /> : <PauseCircle className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => onDeleteAdmin?.(admin.id)} className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer shadow-2xs" title="Remove Admin">
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing <span className="font-bold text-slate-800">{totalRecords > 0 ? startIndex + 1 : 0}</span> to <span className="font-bold text-slate-800">{endIndex}</span> of <span className="font-bold text-slate-800">{totalRecords}</span> records
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none cursor-pointer appearance-none shadow-2xs"
            >
              <option value={8}>8 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="flex items-center space-x-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={validCurrentPage <= 1} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${validCurrentPage === pageNum ? 'bg-blue-600 text-white shadow-xs' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                {pageNum}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={validCurrentPage >= totalPages} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDirectoryTable;
