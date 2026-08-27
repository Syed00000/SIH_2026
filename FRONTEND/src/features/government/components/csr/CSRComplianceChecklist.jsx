import React, { useState } from 'react';
import { CheckCircle2, Clock, RefreshCw, ChevronRight, ShieldCheck, MapPin } from 'lucide-react';
import { MOCK_COMPLIANCE_CHECKLIST } from '../../data/mockCsrLifecycleData.js';
import { GeoVerificationModal } from './GeoVerificationModal.jsx';

export const CSRComplianceChecklist = () => {
  const [checklist, setChecklist] = useState(MOCK_COMPLIANCE_CHECKLIST);
  const [isGeoModalOpen, setIsGeoModalOpen] = useState(false);

  const handleToggleItem = (item) => {
    if (item.id === 'c2') {
      // Physical Verification -> open Geo-tagging modal
      setIsGeoModalOpen(true);
      return;
    }

    // Toggle status
    setChecklist(
      checklist.map((c) => {
        if (c.id !== item.id) return c;
        if (c.statusType === 'checked') {
          return { ...c, status: 'In-progress', statusType: 'progress' };
        } else if (c.statusType === 'progress') {
          return { ...c, status: 'Checked', statusType: 'checked' };
        } else {
          return { ...c, status: 'Checked', statusType: 'checked' };
        }
      })
    );
  };

  const handleGeoSuccess = (geoData) => {
    setChecklist(
      checklist.map((c) =>
        c.id === 'c2'
          ? {
              ...c,
              status: 'Checked',
              statusType: 'checked',
              verifiedDate: geoData.date,
              officer: geoData.inspector,
              notes: `Physical verification completed. GPS: ${geoData.coordinates}. ${geoData.remarks}`
            }
          : c
      )
    );
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between h-full">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
              VERIFICATION & COMPLIANCE CHECKLIST
            </h3>
            <span className="text-[10px] font-bold text-slate-400">
              Click item to verify
            </span>
          </div>

          <div className="space-y-2.5">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleItem(item)}
                className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl flex items-center justify-between gap-2 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </span>
                    {item.id === 'c2' && (
                      <MapPin className="w-3 h-3 text-emerald-600 inline" />
                    )}
                  </div>
                  {item.subtitle && (
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {item.subtitle}
                    </span>
                  )}
                  {item.notes && (
                    <span className="text-[9.5px] text-slate-500 line-clamp-1 block mt-0.5">
                      {item.notes}
                    </span>
                  )}
                </div>

                <div className="shrink-0">
                  {item.statusType === 'checked' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Checked</span>
                    </span>
                  )}
                  {item.statusType === 'pending' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 group-hover:bg-amber-100 transition-colors">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Pending</span>
                    </span>
                  )}
                  {item.statusType === 'progress' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
                      <RefreshCw className="w-3 h-3 text-rose-600 animate-spin" />
                      <span>In-progress</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 italic leading-relaxed">
            NOTE: This Row is applicable for both CSR Funding and Government Grants; includes the flow of show, payment utilization, and making system note.
          </p>
        </div>
      </div>

      <GeoVerificationModal
        isOpen={isGeoModalOpen}
        onClose={() => setIsGeoModalOpen(false)}
        onVerifySuccess={handleGeoSuccess}
      />
    </>
  );
};

export default CSRComplianceChecklist;
