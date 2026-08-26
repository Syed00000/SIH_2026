import React from 'react';
import { Eye, Pencil, Trash2, Check, X, PauseCircle, PlayCircle } from 'lucide-react';

export const UniversityTableRow = ({
  uni,
  index,
  onViewUniversity,
  onEditUniversity,
  onToggleAccess,
  onUpdateStatus,
  onDeleteClick
}) => {
  const firstLetter = uni.name ? uni.name.charAt(0).toUpperCase() : 'U';
  const isEnabled = uni.accessStatus === 'Enabled';
  const isPending = uni.status === 'Pending';
  const regDate = uni.createdAt
    ? new Date(uni.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : '20 May 2025';

  return (
    <tr className="hover:bg-slate-50/70 transition-colors group select-none">
      {/* 0. S.No */}
      <td className="py-2.5 px-2.5 text-center font-mono text-[11px] font-semibold text-slate-400">
        {index}
      </td>

      {/* 1. University Column */}
      <td className="py-2.5 px-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0 border border-slate-200/60">
            {firstLetter}
          </div>
          <div className="min-w-0 max-w-[220px]">
            <div
              className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer text-xs truncate leading-tight"
              onClick={() => onViewUniversity(uni)}
              title={uni.name}
            >
              {uni.name}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
              Code: {uni.code} &bull; {uni.universityEmail}
            </div>
          </div>
        </div>
      </td>

      {/* 2. District Column */}
      <td className="py-2.5 px-2.5 font-semibold text-slate-700 text-[11px]">{uni.district}</td>

      {/* 3. Nodal Officer Column */}
      <td className="py-2.5 px-2.5">
        <div className="font-bold text-slate-900 text-xs leading-tight">{uni.nodalOfficer?.name || 'N/A'}</div>
        <div className="text-[10px] text-slate-400 mt-0.5 truncate">{uni.nodalOfficer?.email}</div>
        <div className="text-[10px] text-slate-400 font-mono">{uni.nodalOfficer?.phone}</div>
      </td>

      {/* 4. Registered On */}
      <td className="py-2.5 px-2.5 font-medium text-slate-500 text-[11px] whitespace-nowrap">{regDate}</td>

      {/* 5. Review Status */}
      <td className="py-2.5 px-2.5 whitespace-nowrap">
        <div className="flex items-center space-x-1.5">
          <span
            className={`inline-flex items-center space-x-1.5 text-[11px] font-semibold ${
              isPending
                ? 'text-amber-600'
                : uni.status === 'Approved' || uni.status === 'Active'
                ? 'text-emerald-600'
                : 'text-red-600'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPending
                  ? 'bg-amber-500 animate-pulse'
                  : uni.status === 'Approved' || uni.status === 'Active'
                  ? 'bg-emerald-500'
                  : 'bg-red-500'
              }`}
            />
            <span>{uni.status || 'Approved'}</span>
          </span>

          {isPending && (
            <div className="flex items-center space-x-1 ml-1">
              <button
                type="button"
                onClick={() => onUpdateStatus(uni, 'Approved')}
                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                title="Approve University"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onUpdateStatus(uni, 'Rejected')}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                title="Reject University"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </td>

      {/* 6. Access Status */}
      <td className="py-2.5 px-2.5 whitespace-nowrap">
        <span
          className={`inline-flex items-center space-x-1.5 text-[11px] font-semibold ${
            isEnabled ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span>{isEnabled ? 'Enabled' : 'Disabled'}</span>
        </span>
      </td>

      {/* 7. Action Controls */}
      <td className="py-2.5 px-3 text-right whitespace-nowrap">
        <div className="flex items-center justify-end space-x-1">
          <button
            type="button"
            onClick={() => onViewUniversity(uni)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEditUniversity(uni)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
            title="Edit University"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onToggleAccess(uni)}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isEnabled
                ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
            title={isEnabled ? 'Disable Access' : 'Enable Access'}
          >
            {isEnabled ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => onDeleteClick(uni)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
            title="Delete University"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UniversityTableRow;
