import React from 'react';
import { CheckCircle2, Clock, Eye, ArrowUpRight, Trash2, XCircle } from 'lucide-react';

export const CSRProposalTableRow = ({
  item,
  serialNumber,
  onSelectProposal,
  onDeleteProposal
}) => {
  const isFailed =
    item.dueDiligenceStatus === 'failed' ||
    item.dueDiligence?.includes('Failed') ||
    item.dueDiligence?.includes('Disqualified') ||
    item.dueDiligence?.includes('Rejected') ||
    item.boardApproval?.includes('Rejected');

  return (
    <tr
      key={item.id}
      onClick={() => onSelectProposal && onSelectProposal(item)}
      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
    >
      <td className="py-3 px-2.5 text-center font-mono text-[11px] font-bold text-slate-900 whitespace-nowrap">
        #{serialNumber}
      </td>

      <td className="py-3 px-3 font-mono text-[11px] font-bold text-slate-900 whitespace-nowrap">
        <span className="group-hover:underline flex items-center space-x-1">
          <span>{item.id}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" />
        </span>
      </td>

      <td className="py-3 px-3 font-bold text-slate-900">
        <div className="line-clamp-1">{item.institutionName}</div>
        <div className="text-[11px] text-slate-500 font-normal line-clamp-1">
          {item.projectTitle || 'Societal Innovation & Tech Transfer'}
        </div>
        {item.district && (
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">{item.district} District</div>
        )}
      </td>

      <td className="py-3 px-3 whitespace-nowrap">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-900 border border-slate-200">
          {item.sourceScheme}
        </span>
      </td>

      <td className="py-3 px-3 whitespace-nowrap">
        {isFailed ? (
          <span className="inline-flex items-center space-x-1.5 text-slate-900 font-semibold text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
            <XCircle className="w-3.5 h-3.5 text-slate-900" />
            <span>{item.dueDiligence || 'Failed / Disqualified'}</span>
          </span>
        ) : item.dueDiligenceStatus === 'passed' ? (
          <span className="inline-flex items-center space-x-1.5 text-slate-900 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
            <span>{item.dueDiligence}</span>
          </span>
        ) : (
          <span className="inline-flex items-center space-x-1.5 text-slate-900 font-semibold text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-900" />
            <span>{item.dueDiligence}</span>
          </span>
        )}
      </td>

      <td className="py-3 px-3 text-[11px] whitespace-nowrap">
        <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {item.boardApproval}
        </span>
      </td>

      <td className="py-3 px-3 text-[11px] whitespace-nowrap font-medium text-slate-900">
        {item.mouExecution}
      </td>

      <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end space-x-1">
          <button
            onClick={() => onSelectProposal && onSelectProposal(item)}
            className="px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-900 font-semibold flex items-center space-x-1 text-[11px] cursor-pointer"
            title="View Full Proposal Dossier & Payments"
          >
            <Eye className="w-3 h-3 text-slate-900" />
            <span>View Dossier</span>
          </button>
          {onDeleteProposal && (
            <button
              onClick={() => {
                if (window.confirm(`Delete proposal ${item.id}?`)) {
                  onDeleteProposal(item.id);
                }
              }}
              className="p-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-900 cursor-pointer"
              title="Delete Proposal"
            >
              <Trash2 className="w-3 h-3 text-slate-900" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default CSRProposalTableRow;
