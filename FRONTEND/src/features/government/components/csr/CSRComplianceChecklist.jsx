import React, { useState } from 'react';
import { CheckCircle2, Clock, RefreshCw, MapPin } from 'lucide-react';
import { GeoVerificationModal } from './GeoVerificationModal.jsx';

const STATUTORY_CHECKLIST = [
  { id: 'c1', title: 'MCA CSR-1 Registration & PFMS Node', subtitle: 'Verified statutory registration with Ministry of Corporate Affairs', status: 'Checked', statusType: 'checked' },
  { id: 'c2', title: 'Physical & Field Pilot Verification', subtitle: 'District nodal officer geo-tagged field verification', status: 'In-progress', statusType: 'progress' },
  { id: 'c3', title: 'Schedule VII Thematic Allocation Audit', subtitle: '100% compliant with Schedule VII rural innovation mandate', status: 'Checked', statusType: 'checked' }
];

export const CSRComplianceChecklist = () => {
  const [checklist, setChecklist] = useState(STATUTORY_CHECKLIST);
  const [isGeoModalOpen, setIsGeoModalOpen] = useState(false);

  const handleToggleItem = (item) => {
    if (item.id === 'c2') {
      setIsGeoModalOpen(true);
      return;
    }

    setChecklist(
      checklist.map((c) => {
        if (c.id !== item.id) return c;
        if (c.statusType === 'checked') {
          return { ...c, status: 'In-progress', statusType: 'progress' };
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
              notes: `Physical verification completed. GPS: ${geoData.coordinates}. ${geoData.remarks}`
            }
          : c
      )
    );
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between h-full select-none">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
              VERIFICATION & COMPLIANCE CHECKLIST
            </h3>
            <span className="text-[10px] font-bold text-slate-400">Click item to verify</span>
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
                    {item.id === 'c2' && <MapPin className="w-3 h-3 text-emerald-600 inline" />}
                  </div>
                  {item.subtitle && <span className="text-[10px] text-slate-400 font-medium block">{item.subtitle}</span>}
                  {item.notes && <span className="text-[9.5px] text-slate-500 line-clamp-1 block mt-0.5">{item.notes}</span>}
                </div>

                <div className="shrink-0">
                  {item.statusType === 'checked' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Checked</span>
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
            Statutory compliance tracking for CSR funding and state grant governance.
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
