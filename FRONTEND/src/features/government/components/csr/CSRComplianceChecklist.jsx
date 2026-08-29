import React, { useState } from 'react';
import { CheckCircle2, Clock, RefreshCw, MapPin } from 'lucide-react';
import { MOCK_COMPLIANCE_CHECKLIST } from '../../data/mockCsrLifecycleData.js';
import { GeoVerificationModal } from './GeoVerificationModal.jsx';

export const CSRComplianceChecklist = () => {
  const [checklist, setChecklist] = useState(MOCK_COMPLIANCE_CHECKLIST);
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
      <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between h-full">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
              Verification Checklist
            </h3>
            <span className="text-[11px] text-slate-500 font-normal">
              Click item to verify
            </span>
          </div>

          <div className="space-y-3.5">
            {checklist.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white border border-slate-200/90 rounded-lg flex flex-col justify-start gap-1"
              >
                <span className="text-xs font-bold text-slate-950">
                  {item.title}
                </span>
                <span className="text-[11.5px] text-slate-500 font-medium leading-relaxed">
                  {item.notes}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Applicable for both CSR Funding and Government Grants for statutory audit readiness.
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
