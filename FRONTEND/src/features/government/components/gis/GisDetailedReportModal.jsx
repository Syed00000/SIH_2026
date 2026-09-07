import React from 'react';
import { X, Printer, MapPin } from 'lucide-react';
import { GisReportContent } from './GisReportContent.jsx';

export const GisDetailedReportModal = ({
  isOpen,
  onClose,
  districtData,
  problems = [],
  stats = {}
}) => {
  if (!isOpen) return null;

  const districtName = districtData?.name || 'Jharkhand State';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#007A61] text-white shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-xl font-black text-slate-900">
                  {districtName} Spatial Analysis Report
                </h2>
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                  Official Record
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                JoharSetu Government GIS Intelligence & Spatial Telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Print Report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <GisReportContent
          districtData={districtData}
          problems={problems}
          stats={stats}
        />
      </div>
    </div>
  );
};

export default GisDetailedReportModal;
