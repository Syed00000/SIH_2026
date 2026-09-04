import React, { useState } from 'react';
import { Factory, ChevronLeft, ChevronRight, ShieldCheck, MapPin, Lock, Clock } from 'lucide-react';
import { PartnerActionCell } from './PartnerActionCell.jsx';

export const PartnersTable = ({
  partners = [], requests = [], selectedPartnerId, onSelectPartner, onOpenSendRequest, loading = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(partners.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const paginatedItems = partners.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs select-none overflow-hidden flex flex-col justify-between">
      <div>
        {/* Table Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2">
            <Factory className="w-4 h-4 text-[#007A61]" />
            <h2 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase">
              Registered Industry Partners ({partners.length})
            </h2>
          </div>
          <span className="text-[11px] font-bold text-slate-400">
            Official CSR / R&D Collaborators
          </span>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Partner Entity</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Thematic Domains</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="py-4 px-4">
                      <div className="h-4 bg-slate-100 rounded-lg w-full" />
                    </td>
                  </tr>
                ))
              ) : paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold text-xs">
                    No corporate partners match the selected criteria.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((p) => {
                  const partnerName = p.name || p.legalName || 'Industry Partner';
                  const category = p.industryType || p.type || p.category || 'Private Industry';
                  const location = p.location || (p.address?.city ? `${p.address.city}, JH` : 'Jharkhand');
                  const domains = Array.isArray(p.domains) && p.domains.length > 0
                    ? p.domains
                    : [p.focusArea || p.thematicDomain || 'Technology'];

                  const matchedReq = requests.find((r) => 
                    (r.partnerId && p.partnerId && r.partnerId === p.partnerId) ||
                    (r.partnerId && p._id && String(r.partnerId) === String(p._id)) ||
                    (r.partnerName && p.name && r.partnerName.toLowerCase() === p.name.toLowerCase()) ||
                    (r.partnerName && p.legalName && r.partnerName.toLowerCase() === p.legalName.toLowerCase())
                  );
                  const isApproved = matchedReq?.status === 'Approved';
                  const isPending = matchedReq?.status === 'Pending';

                  return (
                    <tr
                      key={p.partnerId || p._id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectPartner(p)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 font-black text-[11px] text-[#007A61] flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#007A61] group-hover:text-white transition-colors">
                            {p.logoText || partnerName.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-extrabold text-slate-900 truncate max-w-[200px] text-xs">
                              {partnerName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {p.partnerId || 'IND-JH-2026'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-semibold">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10.5px] font-bold border border-slate-200/60">
                          {category}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                          {domains.slice(0, 2).map((d, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-[10px] font-bold border rounded-md bg-emerald-50 text-[#007A61] border-emerald-200">
                              {d}
                            </span>
                          ))}
                          {domains.length > 2 && (
                            <span className="text-[10px] text-slate-400 font-bold">
                              +{domains.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-500 font-medium">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[130px]">{location}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {isApproved ? (
                          <span className="px-2.5 py-1 text-[10px] font-extrabold border rounded-full bg-emerald-50 text-emerald-800 border-emerald-300 flex items-center space-x-1 w-max">
                            <Lock className="w-3 h-3 text-[#007A61]" />
                            <span>Approved from University</span>
                          </span>
                        ) : isPending ? (
                          <span className="px-2.5 py-1 text-[10px] font-extrabold border rounded-full bg-amber-50 text-amber-800 border-amber-200 flex items-center space-x-1 w-max">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Request Pending</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-[10px] font-extrabold border rounded-full bg-emerald-50 text-emerald-800 border-emerald-200 flex items-center space-x-1 w-max">
                            <ShieldCheck className="w-3 h-3 text-[#007A61]" />
                            <span>Active MoU</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <PartnerActionCell
                          partner={p}
                          request={matchedReq}
                          onSelectPartner={onSelectPartner}
                          onOpenSendRequest={onOpenSendRequest}
                        />
                      </td>
                    </tr>
                  );
                })
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
