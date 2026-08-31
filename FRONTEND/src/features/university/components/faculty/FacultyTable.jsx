import React, { useState } from 'react';
import { UserCheck } from 'lucide-react';
import { FacultyTableHeader } from './table/FacultyTableHeader.jsx';
import { FacultyTableRow } from './table/FacultyTableRow.jsx';
import { FacultyTablePagination } from './table/FacultyTablePagination.jsx';

export const FacultyTable = ({
  facultyList = [],
  selectedFacultyId,
  onSelectFaculty,
  onEditFaculty,
  loading = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalRecords = facultyList.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedItems = facultyList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col w-full shadow-xs select-none bg-white">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <FacultyTableHeader />
          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400">
                  <div className="font-bold text-slate-600">Loading faculty mentors from database...</div>
                </td>
              </tr>
            ) : paginatedItems.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400">
                  <UserCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <div className="font-bold text-slate-600">No faculty members found</div>
                </td>
              </tr>
            ) : (
              paginatedItems.map((f, index) => (
                <FacultyTableRow
                  key={f._id || f.id || index}
                  f={f}
                  globalIndex={startIndex + index + 1}
                  isSelected={selectedFacultyId === (f._id || f.id || f.name)}
                  onSelectFaculty={onSelectFaculty}
                  onEditFaculty={onEditFaculty}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <FacultyTablePagination
        filteredCount={facultyList.length}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        activePage={activePage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default FacultyTable;
