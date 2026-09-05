import React, { useState } from 'react';
import { Factory, ChevronLeft, ChevronRight, FlaskConical } from 'lucide-react';
import { PartnerPrototypeRow } from './PartnerPrototypeRow.jsx';

export const PartnersTable = ({
  partners = [],
  submittedPrototypes = [],
  requests = [],
  onSelectPartner,
  onOpenSendRequest,
  onApproveAmount,
  loading = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Real data only appears when student team has submitted their prototype!
  const items = [];
  if (submittedPrototypes && submittedPrototypes.length > 0) {
    partners.forEach((partner) => {
      submittedPrototypes.forEach((proto) => {
        const matchedReq = requests.find((r) => 
          (r.projectId === proto.id || r.projectId === proto.projectId || r.projectTitle?.toLowerCase() === proto.title?.toLowerCase()) &&
          (r.partnerId === partner.partnerId || r.partnerName?.toLowerCase() === (partner.name || partner.legalName)?.toLowerCase())
        );
        items.push({ partner, prototype: proto, request: matchedReq });
      });
    });
  }

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs select-none overflow-hidden flex flex-col justify-between">
      <div>
        {/* Table Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2">
            <Factory className="w-4 h-4 text-[#007A61]" />
            <h2 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase">
              Registered Industry Partners &amp; Submitted Prototypes ({items.length})
            </h2>
          </div>
          <span className="text-[11px] font-bold text-slate-400">
            Student Research Submissions &bull; CSR / R&amp;D Collaborations
          </span>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Partner Entity</th>
                <th className="py-3 px-4">Ground Problem Statement</th>
                <th className="py-3 px-4">Solution Prototype</th>
                <th className="py-3 px-4">Technical Blueprint (PDF)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="py-6 px-4">
                      <div className="h-5 bg-slate-100 rounded-lg w-full" />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 max-w-md mx-auto">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#007A61] flex items-center justify-center shadow-inner">
                        <FlaskConical className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        No Student Prototypes Submitted Yet
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Data will appear here only when a student research team uploads their technical blueprint PDF and submits their prototype to Ranchi University.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item, idx) => (
                  <PartnerPrototypeRow
                    key={`${item.partner.partnerId || item.partner._id}-${item.prototype.projectId || item.prototype.id || idx}`}
                    partner={item.partner}
                    prototype={item.prototype}
                    request={item.request}
                    onSelectPartner={onSelectPartner}
                    onOpenSendRequest={onOpenSendRequest}
                    onApproveAmount={onApproveAmount}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400">
            Page {activePage} of {totalPages}
          </span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={activePage === 1}
              className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={activePage === totalPages}
              className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnersTable;
