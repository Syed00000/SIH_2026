import React from 'react';
import {
  X,
  Printer,
  Download,
  MapPin,
  Building,
  Users,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { PROBLEM_CATEGORIES, getSeverityByScore } from '../../data/gisConstants.js';

export const GisDetailedReportModal = ({
  isOpen,
  onClose,
  districtData
}) => {
  if (!isOpen || !districtData) return null;

  const severity = getSeverityByScore(districtData.overallScore);
  const resolutionRate = Math.round(
    (districtData.resolvedProblems / (districtData.totalProblems || 1)) * 100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-xl font-black text-slate-900">
                  {districtData.name} District Analysis
                </h2>
                <span
                  className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                    districtData.overallScore >= 81
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : districtData.overallScore >= 61
                      ? 'bg-orange-50 text-orange-700 border-orange-200'
                      : districtData.overallScore >= 41
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {districtData.riskLevel}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Division: {districtData.division} | Headquarters: {districtData.headquarters}
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
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 1. Quick KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Overall Problem Score
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-black text-slate-900">
                  {districtData.overallScore}
                </span>
                <span className="text-xs font-bold text-slate-400">/ 100</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 block">
                Composite Vulnerability
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Grievances
              </span>
              <span className="text-2xl font-black text-slate-900 block">
                {districtData.totalProblems?.toLocaleString()}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 block">
                Reported from citizens & departments
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Resolved Rate
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-black text-emerald-600">
                  {resolutionRate}%
                </span>
                <span className="text-xs font-bold text-slate-400">
                  ({districtData.resolvedProblems?.toLocaleString()})
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 block">
                Pending: {districtData.pendingProblems?.toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Active HEI Partners
              </span>
              <span className="text-2xl font-black text-blue-600 block">
                {districtData.activeHeis || 8}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 block">
                Universities & Institutes assigned
              </span>
            </div>
          </div>

          {/* 2. Demographics & Administration */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>Administrative & Demographic Profile</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium block text-[10px]">Population</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {districtData.demographics?.population || 'N/A'}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium block text-[10px]">Literacy Rate</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {districtData.demographics?.literacyRate || 'N/A'}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium block text-[10px]">Geographic Area</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {districtData.demographics?.areaSqKm || 'N/A'}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium block text-[10px]">Blocks</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {districtData.demographics?.blocks || 'N/A'}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium block text-[10px]">Gram Panchayats</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {districtData.demographics?.gramPanchayats || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Category-Wise Problem Breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-slate-500" />
              <span>Category-Wise Vulnerability & Severity Index</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {PROBLEM_CATEGORIES.map((cat) => {
                const score = districtData.categoryScores?.[cat.id] || 45;
                return (
                  <div key={cat.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700 flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                      </span>
                      <span className="text-slate-900">{score} / 100</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${score}%`,
                          backgroundColor:
                            score >= 80 ? '#dc2626' : score >= 60 ? '#ea580c' : score >= 40 ? '#eab308' : '#22c55e'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Critical Problem Hotspots */}
          {districtData.criticalHotspots && districtData.criticalHotspots.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Identified Critical Hotspots in {districtData.name}</span>
              </h4>
              <div className="space-y-2">
                {districtData.criticalHotspots.map((hs, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{hs.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {hs.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {hs.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-slate-400 block">
                        Coordinates: {hs.lat}, {hs.lng}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold ${
                          hs.severity === 'Very High'
                            ? 'text-red-600'
                            : hs.severity === 'High'
                            ? 'text-orange-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {hs.severity} Severity
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. AI Strategic Recommendations */}
          {districtData.aiRecommendations && (
            <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/70 border border-blue-200/80 rounded-2xl p-4 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI Strategic Interventions & Action Items</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                {districtData.aiRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs text-slate-400 font-medium">
            Source: Department Records & Geo-Spatial Satellite Feed (2026)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default GisDetailedReportModal;
