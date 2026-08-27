import React, { useState } from 'react';
import { X, MapPin, Camera, CheckCircle2, ShieldCheck, Calendar, User, Upload, Check } from 'lucide-react';

export const GeoVerificationModal = ({ isOpen, onClose, onVerifySuccess }) => {
  const [inspectorName, setInspectorName] = useState('Er. Anand Tirkey (District Technical Officer)');
  const [inspectionDate, setInspectionDate] = useState('2026-08-27');
  const [gpsCoordinates, setGpsCoordinates] = useState('23.4123° N, 85.4398° E (BIT Mesra Innovation Lab)');
  const [physicalStatus, setPhysicalStatus] = useState('Verified');
  const [remarks, setRemarks] = useState('Physical lab equipment and prototype testing rig inspected on-site. Work execution aligns with 60% completion milestone.');
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDone(true);
    setTimeout(() => {
      onVerifySuccess?.({
        inspector: inspectorName,
        date: inspectionDate,
        coordinates: gpsCoordinates,
        status: physicalStatus,
        remarks: remarks
      });
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Physical Verification & Geo-Tagging</h3>
              <p className="text-[11px] text-slate-500 font-medium">On-site technical inspection & GPS telemetry validation for Tranche release</p>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">Geo-Tagged Location Coordinates</span>
              <span className="font-mono text-[10.5px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                GPS LOCKED
              </span>
            </div>
            <input
              type="text"
              value={gpsCoordinates}
              onChange={(e) => setGpsCoordinates(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Field Inspection Officer</label>
              <input
                type="text"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Inspection Date</label>
              <input
                type="date"
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Physical Verification Finding</label>
            <select
              value={physicalStatus}
              onChange={(e) => setPhysicalStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs"
            >
              <option value="Verified">Verified (Satisfactory Progress - Clear for Next Tranche)</option>
              <option value="Minor Discrepancy">Minor Discrepancy (Requires 7-Day Rectification)</option>
              <option value="Under Ongoing Inspection">Under Ongoing Inspection</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Field Inspection Notes & Observations</label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs resize-none"
            />
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start space-x-2 text-[11px] text-emerald-900 font-medium leading-relaxed">
            <Camera className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>4 High-Resolution Geo-Tagged Images with EXIF GPS timestamps verified and attached to the audit dossier.</span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs flex items-center space-x-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isDone ? 'Signing Off...' : 'Submit Physical Verification Sign-off'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeoVerificationModal;
