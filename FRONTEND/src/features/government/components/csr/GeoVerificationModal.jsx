import React, { useState } from 'react';
import { X, MapPin, Camera, CheckCircle2, Check } from 'lucide-react';

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
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="bg-white rounded-lg max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <MapPin className="w-5 h-5 text-slate-900 shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Physical Verification & Geo-Tagging</h3>
              <p className="text-xs text-slate-500 font-normal">On-site technical inspection & GPS telemetry validation for Tranche release</p>
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
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs flex-1 bg-white">
          <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">Geo-Tagged Location Coordinates</span>
              <span className="font-mono text-[10.5px] font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                GPS LOCKED
              </span>
            </div>
            <input
              type="text"
              value={gpsCoordinates}
              onChange={(e) => setGpsCoordinates(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md font-mono text-xs text-slate-900 outline-none focus:border-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Field Inspection Officer</label>
              <input
                type="text"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-900 outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Inspection Date</label>
              <input
                type="date"
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-mono text-slate-900 outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Physical Verification Finding</label>
            <select
              value={physicalStatus}
              onChange={(e) => setPhysicalStatus(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md font-semibold text-slate-900 text-xs outline-none focus:border-slate-900"
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
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-900 outline-none focus:border-slate-900 resize-none"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-start space-x-2 text-[11px] text-slate-700 leading-relaxed">
            <Camera className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
            <span>4 High-Resolution Geo-Tagged Images with EXIF GPS timestamps verified and attached to the audit dossier.</span>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-xs flex items-center space-x-1.5"
            >
              <Check className="w-3.5 h-3.5 text-white" />
              <span>{isDone ? 'Signing Off...' : 'Submit Physical Sign-off'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeoVerificationModal;
