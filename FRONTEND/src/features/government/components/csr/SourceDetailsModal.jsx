import React from 'react';
import { X, Building2, Landmark, Handshake, CheckCircle2, DollarSign, Award, ExternalLink, Zap } from 'lucide-react';

export const SourceDetailsModal = ({ isOpen, onClose, sourceData, displayUnit = 'dual' }) => {
  if (!isOpen || !sourceData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn select-none">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl border ${sourceData.iconColor}`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{sourceData.title}</h3>
              <p className="text-[11px] text-slate-500 font-medium">Real-Time Allocation Portfolio & Live Disbursed Breakdown</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Pool</span>
              <span className="text-sm sm:text-base font-extrabold text-slate-900 block mt-0.5">
                {sourceData.poolAmount}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">{sourceData.poolAmountLakhs}</span>
            </div>
            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3">
              <span className="text-[10px] uppercase font-bold text-blue-500 block tracking-wider">Committed</span>
              <span className="text-sm sm:text-base font-extrabold text-blue-900 block mt-0.5">
                {sourceData.committedAmount || '₹54.2 Cr'}
              </span>
              <span className="text-[10px] text-blue-700 font-medium">₹ {(sourceData.totalCommittedLakhs || 5420).toFixed(2)} Lakhs</span>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block tracking-wider">Disbursed</span>
              <span className="text-sm sm:text-base font-extrabold text-emerald-900 block mt-0.5">
                {sourceData.disbursedAmount || '₹22.8 Cr'}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">{sourceData.disbursedAmountLakhs}</span>
            </div>
          </div>

          {/* Live Projects under this Scheme */}
          {sourceData.matchingProjects && sourceData.matchingProjects.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Live Active Projects Funded via This Pool</span>
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {sourceData.matchingProjects.length} Active
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {sourceData.matchingProjects.map((prj) => (
                  <div key={prj.id} className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between text-xs transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-[10px] text-blue-600">{prj.id}</span>
                        <span className="font-bold text-slate-900">{prj.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{prj.hei} ({prj.district})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900 block">{prj.disbursedAmount}</span>
                      <span className="text-[10px] font-bold text-emerald-700">
                        {prj.paymentPercentage || 0}% Disbursed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Corporate Donors Roster */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Primary Corporate Donors & Schemes
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {sourceData.topDonors?.map((donor, idx) => (
                <div key={idx} className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between text-xs transition-colors">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">{donor.name}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{donor.sector}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 block">{donor.committed}</span>
                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>{donor.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory Framework */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
            <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">Statutory Governance Framework</h5>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              All contributions are governed under Section 135 of the Companies Act 2013 and Schedule VII Item (ii) Higher Education, Scientific Research & Innovation. Vetted through MCA portal e-form CSR-1.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

export default SourceDetailsModal;
