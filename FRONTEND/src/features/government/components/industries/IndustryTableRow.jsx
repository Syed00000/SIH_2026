import React from 'react';
import { Eye, Pencil, Key, Check, X } from 'lucide-react';

export const IndustryTableRow = ({
  ind,
  index,
  onView,
  onEdit,
  onApprove,
  onReject,
  onToggleStatus,
  onResetPassword
}) => {
  const isPending = ind.verificationStatus === 'Pending';
  const isActive = ind.status === 'Active' && ind.accessStatus !== 'Disabled';
  const firstLetter = ind.legalName ? ind.legalName.charAt(0).toUpperCase() : 'I';

  return (
    <tr className="hover:bg-slate-50/70 transition-colors group select-none">
      {/* 0. Index / S.No */}
      <td className="py-2.5 px-2.5 text-center font-mono text-[11px] font-semibold text-slate-400">
        {index}
      </td>

      {/* 1. Industry / Enterprise */}
      <td className="py-2.5 px-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0 border border-slate-200/60">
            {firstLetter}
          </div>
          <div className="min-w-0 max-w-[210px]">
            <div
              className="font-bold text-slate-900 hover:text-slate-600 cursor-pointer text-xs truncate leading-tight"
              onClick={() => onView(ind)}
              title={ind.legalName}
            >
              {ind.legalName}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
              ID: {ind.industryId || '—'} &bull; {ind.category}
            </div>
          </div>
        </div>
      </td>

      {/* 2. Thematic Domain */}
      <td className="py-2.5 px-2.5">
        <div className="font-semibold text-slate-800 text-xs truncate max-w-[130px]" title={ind.thematicDomain}>
          {ind.thematicDomain}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">{ind.address?.district || ind.address?.city || 'Ranchi'}, JH</div>
      </td>

      {}
      <td className="py-2.5 px-2.5">
        <div className="font-bold text-slate-900 text-xs leading-tight">{ind.spocName}</div>
        <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px]">{ind.officialEmail}</div>
        <div className="text-[10px] text-slate-400 font-mono">{ind.mobileNumber}</div>
      </td>

      {/* 4. Support Modes */}
      <td className="py-2.5 px-2.5">
        <div className="flex flex-wrap gap-1 max-w-[150px]">
          {Array.isArray(ind.supportModes) && ind.supportModes.slice(0, 2).map((mode) => (
            <span
              key={mode}
              className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded text-[10px] font-medium"
            >
              {mode}
            </span>
          ))}
          {Array.isArray(ind.supportModes) && ind.supportModes.length > 2 && (
            <span className="text-[10px] font-medium text-slate-400 self-center">
              +{ind.supportModes.length - 2}
            </span>
          )}
        </div>
      </td>

      {/* 5. Verification Status */}
      <td className="py-2.5 px-2.5 whitespace-nowrap">
        <div className="flex items-center space-x-1.5">
          <span
            className={`inline-flex items-center space-x-1.5 text-[11px] font-semibold ${
              ind.verificationStatus === 'Approved' || ind.verificationStatus === 'Verified'
                ? 'text-emerald-600'
                : ind.verificationStatus === 'Pending'
                ? 'text-amber-600'
                : 'text-red-600'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                ind.verificationStatus === 'Approved' || ind.verificationStatus === 'Verified'
                  ? 'bg-emerald-500'
                  : ind.verificationStatus === 'Pending'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-red-500'
              }`}
            />
            <span>{ind.verificationStatus || 'Approved'}</span>
          </span>

          {isPending && (
            <div className="flex items-center space-x-1 ml-1">
              <button
                type="button"
                onClick={() => onApprove(ind)}
                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                title="Approve & Send Credentials"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onReject(ind)}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                title="Reject Application"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </td>

      {/* 6. Account Status */}
      <td className="py-2.5 px-2.5 whitespace-nowrap">
        <span
          className={`inline-flex items-center space-x-1.5 text-[11px] font-semibold ${
            isActive ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span>{isActive ? 'Active' : 'Disabled'}</span>
        </span>
      </td>

      {/* 7. Actions */}
      <td className="py-2.5 px-3 text-right whitespace-nowrap">
        <div className="flex items-center justify-end space-x-1">
          <button
            type="button"
            onClick={() => onView(ind)}
            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onEdit(ind)}
            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            title="Edit Industry"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onResetPassword(ind)}
            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            title="Regenerate Credentials"
          >
            <Key className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onToggleStatus(ind)}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isActive
                ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
            title={isActive ? 'Disable Access' : 'Enable Access'}
          >
            {isActive ? <span className="w-3.5 h-3.5 block border-2 border-slate-400 rounded-full" /> : <Check className="w-4 h-4" />}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default IndustryTableRow;
