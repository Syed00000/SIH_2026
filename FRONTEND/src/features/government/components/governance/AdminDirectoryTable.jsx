import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, UserCheck } from 'lucide-react';
import { TableSkeleton } from '../../../../shared/components/ui/tableSkeleton.jsx';
import { AdminDirectoryToolbar } from './AdminDirectoryToolbar.jsx';
import { AdminDirectoryRow } from './AdminDirectoryRow.jsx';

export const AdminDirectoryTable = ({
  admins = [],
  isLoading = false,
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
      const match =
        admin.fullName.toLowerCase().includes(q) ||
        admin.email.toLowerCase().includes(q) ||
        admin.role.toLowerCase().includes(q) ||
        admin.district.toLowerCase().includes(q) ||
        admin.mobileNumber.includes(q);
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

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRole('All Roles');
    setSelectedStatus('All Status');
    setSelectedDistrict('All');
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col select-none">
      {/* Header & Filter Toolbar */}
      <div className="p-4 border-b border-slate-100 space-y-3.5">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">Admin Directory</h2>

        <AdminDirectoryToolbar
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          selectedRole={selectedRole}
          onRoleChange={(val) => {
            setSelectedRole(val);
            setCurrentPage(1);
          }}
          selectedStatus={selectedStatus}
          onStatusChange={(val) => {
            setSelectedStatus(val);
            setCurrentPage(1);
          }}
          selectedDistrict={selectedDistrict}
          onDistrictChange={(val) => {
            setSelectedDistrict(val);
            setCurrentPage(1);
          }}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Directory Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[780px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider select-none">
              <th className="py-2.5 px-2.5 w-[45px] text-center">#</th>
              <th className="py-2.5 px-3 min-w-[190px]">Administrator</th>
              <th className="py-2.5 px-2.5 w-[140px]">Role / Department</th>
              <th className="py-2.5 px-2.5 w-[110px]">District</th>
              <th className="py-2.5 px-2.5 w-[115px]">Contact Phone</th>
              <th className="py-2.5 px-2.5 w-[90px]">Status</th>
              <th className="py-2.5 px-3 w-[110px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {isLoading ? (
              <TableSkeleton rows={6} columns={7} />
            ) : paginatedAdmins.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <UserCheck className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                  <div className="font-semibold text-slate-600">No administrators found matching criteria</div>
                  <button
                    onClick={handleResetFilters}
                    className="mt-1 text-[11px] font-bold text-slate-900 hover:underline cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </td>
              </tr>
            ) : (
              paginatedAdmins.map((admin, index) => (
                <AdminDirectoryRow
                  key={admin.id || admin._id || index}
                  admin={admin}
                  index={(validCurrentPage - 1) * itemsPerPage + index + 1}
                  onViewAdmin={onViewAdmin}
                  onEditAdmin={onEditAdmin}
                  onToggleStatus={onToggleStatus}
                  onDeleteAdmin={onDeleteAdmin}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/30">
        <div>
          Showing <span className="font-bold text-slate-800">{totalRecords > 0 ? startIndex + 1 : 0}</span> to{' '}
          <span className="font-bold text-slate-800">{endIndex}</span> of{' '}
          <span className="font-bold text-slate-800">{totalRecords}</span> entries
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-md px-2 py-1 pr-6 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none cursor-pointer appearance-none shadow-2xs"
            >
              <option value={8}>8 per page</option>
              <option value={15}>15 per page</option>
              <option value={30}>30 per page</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center space-x-1">
            <button
              disabled={validCurrentPage <= 1}
              onClick={() => setCurrentPage(Math.max(1, validCurrentPage - 1))}
              className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                  validCurrentPage === pageNum
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              disabled={validCurrentPage >= totalPages}
              onClick={() => setCurrentPage(validCurrentPage + 1)}
              className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDirectoryTable;
