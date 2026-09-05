import React from 'react';
import { Rocket, FileText, ArrowUpRight, Users, CheckCircle2, FlaskConical } from 'lucide-react';

export const MentoredPrototypesIndustryCard = ({ prototypes = [], onConnectIndustry }) => {
  if (!prototypes || prototypes.length === 0) return null;

  return (
    <div className="bg-white border-2 border-emerald-200 rounded-2xl shadow-xs overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-b border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#007A61] text-white flex items-center justify-center shadow-2xs shrink-0">
            <Rocket className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 flex items-center space-x-2">
              <span>Mentored Research Prototypes Submitted to University</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full border border-emerald-200">
                {prototypes.length} Ready for Industry
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Prototypes developed by student teams under 1st Govt Grant, verified with Cloudinary Technical Report.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {prototypes.map((p) => {
          const pdfUrl = p.pdfUrl || p.prototypeData?.pdfUrl;
          const pdfName = p.pdfName || p.prototypeData?.pdfName || 'Prototype_Blueprint.pdf';
          const teamName = p.studentTeam || p.teamName || 'Student Research Team';
          const leadName = p.studentLead || p.leadMentor || 'Lead Student';

          return (
            <div key={p.projectId || p.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {p.projectId}
                  </span>
                  <h4 className="text-xs font-black text-slate-900">{p.title}</h4>
                  <span className="text-[9.5px] font-bold bg-emerald-50 text-[#007A61] border border-emerald-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-[#007A61]" />
                    <span>Received from Faculty</span>
                  </span>
                </div>

                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600">
                  <span className="flex items-center space-x-1 font-semibold text-slate-700">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{teamName} ({leadName})</span>
                  </span>
                  <span className="text-emerald-700 font-bold">
                    💰 1st Grant: {p.sanctionedBudget || p.disbursedAmount || '₹ 80,000'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-start lg:self-auto shrink-0">
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-2xs"
                    title={pdfName}
                  >
                    <FileText className="w-3.5 h-3.5 text-rose-600" />
                    <span>View Technical PDF</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => onConnectIndustry && onConnectIndustry(p)}
                  className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Request Industry Lab / CSR</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MentoredPrototypesIndustryCard;
