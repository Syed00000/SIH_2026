import React from 'react';
import { X, Building2, Landmark, Handshake, CheckCircle2, ShieldCheck, FileText, ArrowUpRight } from 'lucide-react';

const ICONS = {
  corporate_csr: Building2,
  govt_grants: Landmark,
  joint_funding: Handshake
};

export const SourceDetailsModal = ({ isOpen, onClose, sourceData }) => {
  if (!isOpen || !sourceData) return null;

  const IconComponent = ICONS[sourceData.id] || Building2;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn select-none">
      <div className="bg-white rounded-lg max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Pure Text & Monochrome Icon */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <IconComponent className="w-5 h-5 text-slate-900 shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">{sourceData.title}</h3>
              <p className="text-xs text-slate-500 font-normal">
                {sourceData.statutoryRef || 'Fund Inflow Portfolio & Escrow Disbursal Breakdown'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-900 cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-900" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1 bg-white">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Total Pool</span>
              <span className="text-base font-bold text-slate-900 block mt-1">
                {sourceData.poolAmount}
              </span>
              <span className="text-[10.5px] text-slate-500 font-normal">Approved State Corpus</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Committed Funds</span>
              <span className="text-base font-bold text-slate-900 block mt-1">
                {sourceData.committedAmount || '₹54.2 Cr'}
              </span>
              <span className="text-[10.5px] text-slate-500 font-normal">Bound under MoA / Sanctions</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
              <span className="text-[10.5px] uppercase font-bold text-slate-500 block tracking-wider">Disbursed to HEIs</span>
              <span className="text-base font-bold text-slate-900 block mt-1">
                {sourceData.disbursedAmount || '₹22.8 Cr'}
              </span>
              <span className="text-[10.5px] text-slate-500 font-normal">Transferred to Project Escrows</span>
            </div>
          </div>

          {/* Primary Inflows & Contributors Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Contributor & Scheme Inflows
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                {sourceData.activeCount}
              </span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Donor / Scheme Name</th>
                  <th className="py-2.5 px-3">Focus Sector</th>
                  <th className="py-2.5 px-3">Sanction / Ref No.</th>
                  <th className="py-2.5 px-3">Committed</th>
                  <th className="py-2.5 px-3 text-right">Inflow Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sourceData.topDonors?.map((donor, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{donor.name}</td>
                    <td className="py-2.5 px-3 text-slate-600 font-normal">{donor.sector}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700">{donor.refNo || 'MCA-REG'}</td>
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-900">{donor.committed}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{donor.received || donor.committed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Live Projects Funded Under This Pool */}
          {sourceData.matchingProjects && sourceData.matchingProjects.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
              <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Active Projects Funded via This Pool
                </h4>
                <span className="text-[11px] text-slate-500 font-medium">
                  {sourceData.matchingProjects.length} Active Deployments
                </span>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Project ID & Title</th>
                    <th className="py-2.5 px-3">Implementing Institution</th>
                    <th className="py-2.5 px-3">Sanctioned Share</th>
                    <th className="py-2.5 px-3 text-right">Disbursed Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sourceData.matchingProjects.map((prj) => (
                    <tr key={prj.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold text-slate-900 block">{prj.id}</span>
                        <span className="text-slate-600 font-normal line-clamp-1">{prj.title}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 font-medium">
                        {prj.hei} ({prj.district})
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-900 font-medium">{prj.sanctionedGrant || '₹ 25.0 L'}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{prj.disbursedAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Statutory Governance Note */}
          <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-1 shadow-xs">
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Statutory Audit Framework</h5>
            <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
              All fund flows are routed strictly through public-sector escrow accounts under Schedule VII Section 135 norms and audited by independent Chartered Accountants with GFR 12-A certification.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-white flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-xs"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default SourceDetailsModal;
