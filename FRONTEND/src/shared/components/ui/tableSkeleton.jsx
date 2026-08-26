import React from 'react';
import { cn } from '../../utils/cn.js';

/**
 * Reusable Tabular Skeleton Loader Component
 * Renders smooth animated placeholder table rows matching standard government portal tables.
 *
 * @param {number} rows - Number of skeleton rows to render (default: 5)
 * @param {number} columns - Number of columns in each row (default: 7)
 * @param {string} className - Additional CSS classes
 * @param {Array<string>} columnWidths - Custom widths for columns
 * @param {boolean} hasAvatar - Whether column 2 renders an avatar + 2 lines of text (default: true)
 * @param {boolean} hasActions - Whether last column renders action button boxes (default: true)
 */
export const TableSkeleton = ({
  rows = 5,
  columns = 7,
  className = '',
  columnWidths = [],
  hasAvatar = true,
  hasActions = true
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr
          key={`table-skel-row-${rowIdx}`}
          className={cn(
            'border-b border-slate-100 hover:bg-transparent transition-none animate-pulse',
            className
          )}
        >
          {Array.from({ length: columns }).map((_, colIdx) => {
            const isAvatarCol = hasAvatar && colIdx === 1;
            const isActionCol = hasActions && colIdx === columns - 1;
            const isStatusCol = colIdx === columns - 2;
            const customWidth = columnWidths[colIdx];

            return (
              <td key={`table-skel-col-${rowIdx}-${colIdx}`} className="py-3.5 px-4 align-middle">
                {isAvatarCol ? (
                  // Organization / Name column with avatar circle and text lines
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                    <div className="space-y-1.5 flex-1 min-w-[120px] max-w-[200px]">
                      <div className="h-3.5 bg-slate-200 rounded-sm w-full" />
                      <div className="h-2.5 bg-slate-100 rounded-sm w-2/3" />
                    </div>
                  </div>
                ) : isActionCol ? (
                  // Action buttons on the right
                  <div className="flex items-center justify-end space-x-1.5">
                    <div className="w-7 h-7 bg-slate-100 rounded border border-slate-200/60" />
                    <div className="w-7 h-7 bg-slate-100 rounded border border-slate-200/60" />
                    <div className="w-7 h-7 bg-slate-100 rounded border border-slate-200/60" />
                  </div>
                ) : isStatusCol ? (
                  // Status badge pill
                  <div className="h-5 w-18 bg-slate-200 rounded-full" />
                ) : (
                  // Standard text cell
                  <div
                    className={cn(
                      'h-3.5 bg-slate-200 rounded-sm',
                      customWidth || (colIdx === 0 ? 'w-20' : 'w-28')
                    )}
                  />
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
