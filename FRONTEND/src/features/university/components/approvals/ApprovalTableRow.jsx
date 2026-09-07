import React from 'react';
import { Eye, FlaskConical, Lock, CheckCircle2 } from 'lucide-react';

export const getTypePill = (type = '') => {
  if (type.includes('Project')) return 'bg-blue-50 text-blue-800 border-blue-200';
  if (type.includes('Prototype')) return 'bg-purple-50 text-purple-800 border-purple-200';
  if (type.includes('Proposal')) return 'bg-emerald-50 text-[#007A61] border-emerald-200';
  if (type.includes('Partnership')) return 'bg-amber-50 text-amber-800 border-amber-200';
  return 'bg-slate-100 text-slate-800 border-slate-200';
};

export const getStatusBadge = (apr) => {
  const isDeployed = Boolean(
    apr.isDeployed ||
    apr.isLocked ||
    apr.status === 'Deployed' ||
    apr.governmentStatus === 'Approved & Deployed'
  );
  if (isDeployed) {
    return (
      <span className="px-2 py-0.5 text-[10px] font-black border rounded-md bg-teal-50 text-teal-800 border-teal-300 inline-flex items-center space-x-1">
        <Lock className="w-2.5 h-2.5 text-teal-700" />
        <span>🔒 Deployed</span>
      </span>
    );
  }

  const isForwarded = Boolean(
    apr.sentToGovernment ||
    apr.governmentStatus === 'Under State Evaluation' ||
    apr.governmentStatus === 'Approved'
  );
  if (isForwarded) {
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold border rounded-md bg-blue-50 text-blue-800 border-blue-300 inline-flex items-center space-x-1">
        <CheckCircle2 className="w-2.5 h-2.5 text-blue-600" />
        <span>✓ Forwarded to Govt</span>
      </span>
    );
  }

  if (apr.status === 'Approved') {
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold border rounded-md bg-emerald-50 text-emerald-800 border-emerald-300">
        Approved
      </span>
    );
  }
  if (apr.status === 'Rejected') {
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold border rounded-md bg-rose-50 text-rose-800 border-rose-300">
        Rejected
      </span>
    );
  }
  if (apr.status === 'Changes Required') {
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold border rounded-md bg-orange-50 text-orange-800 border-orange-300">
        Revisions Directed
      </span>
    );
  }

  return (
    <span className="px-2 py-0.5 text-[10px] font-bold border rounded-md bg-amber-50 text-amber-800 border-amber-300">
      Pending Review
    </span>
  );
};

export const ApprovalTableRow = ({ apr, isSelected, onSelect }) => {
  const isProto = apr.type?.includes('Prototype');

  return (
    <tr
      onClick={() => onSelect(apr)}
      className={`hover:bg-emerald-50/30 transition-colors cursor-pointer ${
        isSelected ? 'bg-emerald-50/60 border-l-3 border-l-[#007A61]' : ''
      }`}
    >
      <td className="py-3 px-3.5 font-mono font-bold text-slate-900 text-xs">{apr.approvalId}</td>
      <td className="py-3 px-3.5">
        <div className="font-bold text-slate-900 truncate max-w-[180px]">{apr.project}</div>
        {apr.challengeId && <div className="text-[10px] text-slate-400 font-mono">{apr.challengeId}</div>}
      </td>
      <td className="py-3 px-3.5">
        <div className="flex items-center space-x-1.5">
          {isProto && <FlaskConical className="w-3.5 h-3.5 text-purple-600" />}
          <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-full ${getTypePill(apr.type)}`}>
            {apr.type}
          </span>
        </div>
      </td>
      <td className="py-3 px-3.5">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-[9px] font-black flex items-center justify-center shrink-0 border border-slate-200">
            {(apr.partnerName || apr.requestedBy || 'IN').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-slate-900 text-xs leading-none">{apr.partnerName || apr.requestedBy}</div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">{apr.requestedByDept || 'Industry Partner'}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-3.5 text-slate-700">
        <div className="font-semibold text-xs">{apr.date}</div>
        <div className="text-[10px] text-slate-400">{apr.dateTime}</div>
      </td>
      <td className="py-3 px-3.5">
        {getStatusBadge(apr)}
      </td>
      <td className="py-3 px-3.5 text-right">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onSelect(apr); }}
          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold inline-flex items-center space-x-1 shadow-2xs"
        >
          <Eye className="w-3 h-3 text-[#007A61]" />
          <span>View</span>
        </button>
      </td>
    </tr>
  );
};

export default ApprovalTableRow;
