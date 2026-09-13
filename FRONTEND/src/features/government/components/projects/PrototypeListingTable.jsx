import React from 'react';
import { Eye, Rocket, FlaskConical, FileCheck2, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { openPdf } from '../../../../shared/utils/openPdf.js';

export const PrototypeListingTable = ({
  projects = [],
  onInspect,
  onOpenDeployWizard,
  onAdvanceTrl
}) => {
  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
        No prototypes match the selected criteria.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 shadow-xs overflow-hidden rounded-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4">Problem &amp; Prototype</th>
              <th className="py-3.5 px-4">University &amp; District</th>
              <th className="py-3.5 px-4">TRL &amp; Stage</th>
              <th className="py-3.5 px-4">Industrial Lab Testing</th>
              <th className="py-3.5 px-4">Evaluation Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((p) => {
              const trlNum = parseInt(String(p.trlLevel || '4').replace('TRL-', ''), 10) || 4;
              const isDeployed = Boolean(p.isDeployed || trlNum >= 9 || p.status === 'Deployed');
              const reportUrl = p.testingReportPdfUrl || p.reportPdfUrl;

              return (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Problem & Prototype Title */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded-xs">
                        {p.id}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-xs">
                        {p.prototypeType || 'Hardware'}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs mt-1 truncate" title={p.title}>
                      {p.title}
                    </h4>
                    <p className="text-[10.5px] text-slate-500 font-medium truncate" title={p.problemStatement}>
                      {p.problemStatement || 'Target citizen problem statement'}
                    </p>
                  </td>

                  {/* University & District */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-800 block text-xs truncate max-w-[180px]">
                      {p.hei || 'Nodal University'}
                    </span>
                    <span className="text-[10.5px] text-slate-500 font-medium">
                      {p.district || 'Ranchi'} District
                    </span>
                  </td>

                  {/* TRL & Stage */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5">
                      <span className={`px-2 py-0.5 rounded-xs font-mono text-[10px] font-bold ${
                        isDeployed ? 'bg-slate-900 text-white' :
                        trlNum >= 7 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        trlNum >= 4 ? 'bg-[#007A61]/10 text-[#007A61] border border-[#007A61]/30' :
                        'bg-slate-100 text-slate-800 border border-slate-300'
                      }`}>
                        {p.trlLevel || 'TRL-7'}
                      </span>
                      <span className="text-[10.5px] font-bold text-slate-600">
                        {isDeployed ? 'Stage 4: Deployed' : trlNum >= 7 ? 'Stage 3: State Certified' : trlNum >= 4 ? 'Stage 2: Field Tested' : 'Stage 1: Lab Concept'}
                      </span>
                    </div>
                  </td>

                  {/* Industrial Lab Testing */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1 text-emerald-800 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{p.testingPartner || p.partnerName || 'Ariba Research Labs'}</span>
                      </div>
                      {reportUrl ? (
                        <button
                          type="button"
                          onClick={() => openPdf(reportUrl)}
                          className="text-[10px] font-bold text-[#007A61] hover:underline flex items-center space-x-0.5 cursor-pointer"
                        >
                          <FileCheck2 className="w-3 h-3 text-emerald-600" />
                          <span>Lab Report ({p.testingReportPdfName || 'napkin.pdf'})</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400">NABL Calibrated</span>
                      )}
                    </div>
                  </td>

                  {/* Evaluation Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {isDeployed ? (
                      <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-bold bg-slate-900 text-white border border-slate-800 inline-flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Publicly Deployed</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-bold bg-[#007A61]/10 text-[#007A61] border border-[#007A61]/30 inline-flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3 text-[#007A61]" />
                        <span>Under Evaluation</span>
                      </span>
                    )}
                  </td>

                  {/* Actions: Single View Details button */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onInspect(p)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xs transition-all cursor-pointer inline-flex items-center space-x-1.5 shadow-xs hover:border-[#007A61] hover:text-[#007A61]"
                      title="Open Full Details &amp; Evaluation Panel"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                      {isDeployed && (
                        <span className="ml-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-xs border border-emerald-200">
                          ✓ Deployed
                        </span>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrototypeListingTable;
