import React from 'react';
import { User, Building2, GraduationCap, Eye, CheckCircle2 } from 'lucide-react';

export const ApprovalsTableRow = ({ item, onViewItem, onApproveItem }) => {
  const renderSubmitterIcon = (type) => {
    switch (type) {
      case 'citizen':
        return <User className="w-3.5 h-3.5 text-blue-500 mr-1.5 shrink-0" />;
      case 'industry':
        return <Building2 className="w-3.5 h-3.5 text-blue-500 mr-1.5 shrink-0" />;
      case 'university':
        return <GraduationCap className="w-3.5 h-3.5 text-blue-500 mr-1.5 shrink-0" />;
      default:
        return <User className="w-3.5 h-3.5 text-blue-500 mr-1.5 shrink-0" />;
    }
  };

  return (
    <tr className="hover:bg-slate-50/70 transition-colors group">
      <td className="py-3 px-3.5 font-mono text-[11px] font-bold text-slate-700 whitespace-nowrap">
        {item.id}
      </td>
      <td className="py-3 px-3.5">
        <p className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-slate-800">
          {item.title}
        </p>
      </td>
      <td className="py-3 px-3.5 whitespace-nowrap">
        <div className="flex items-center text-xs text-slate-600 font-medium">
          {renderSubmitterIcon(item.submitterType)}
          <span>{item.submittedBy}</span>
        </div>
      </td>
      <td className="py-3 px-3.5 whitespace-nowrap">
        <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${item.typeBadge || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
          {item.type}
        </span>
      </td>
      <td className="py-3 px-3.5 whitespace-nowrap">
        {item.priority ? (
          <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${item.priorityBadge || 'bg-amber-50 text-amber-700 border-amber-200'}`}>
            {item.priority}
          </span>
        ) : (
          <span className="text-[11px] text-slate-400">—</span>
        )}
      </td>
      <td className="py-3 px-3.5 text-xs text-slate-500 font-medium whitespace-nowrap">
        {item.submittedOn}
      </td>
      <td className="py-3 px-3.5 text-right whitespace-nowrap">
        <div className="flex items-center justify-end space-x-1.5">
          {onViewItem && (
            <button
              onClick={() => onViewItem(item)}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="View Details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
          {onApproveItem && (
            <button
              onClick={() => onApproveItem(item)}
              className="p-1.5 rounded-md hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
              title="Quick Approve"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ApprovalsTableRow;
