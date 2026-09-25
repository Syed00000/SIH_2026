import React from 'react';
import { Package, MapPin, Target, AlertCircle, Eye, Beaker } from 'lucide-react';
import { openPdf } from '../../../shared/utils/openPdf.js';

export const DepartmentPrototypesPanel = ({ problems = [], onAssignToBudgetOfficer }) => {
  // Only show deployed prototypes handed over to this department
  const prototypes = problems.filter(p => 
    p.isDeployed || 
    p.status === 'Deployed' || 
    p.prototypeStatus === 'Deployed' ||
    p.prototypeStatus === 'Approved' ||
    (p.governmentStatus === 'Approved' && (p.trlLevel === 'TRL-9' || p.trlLevel === 'TRL-8' || p.trlLevel === 'TRL-7'))
  );

  if (prototypes.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center flex flex-col items-center justify-center animate-fadeIn shadow-xs min-h-[400px]">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-black text-slate-800 mb-2 tracking-tight">No Deployed Solutions Yet</h3>
        <p className="text-sm text-slate-500 font-medium max-w-md">
          There are currently no engineered prototypes handed over to your department by the State Government.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Beaker className="w-6 h-6 text-[#007A61]" />
            DEPLOYED SOLUTIONS & PROTOTYPES
          </h2>
          <p className="text-[13px] text-slate-500 font-medium mt-1">
            Engineered solutions and tested prototypes handed over by the Government for public deployment.
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg text-center min-w-[120px]">
          <span className="block text-2xl font-black text-emerald-700 font-mono leading-none">
            {prototypes.length}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 mt-1 block">
            Handed Over
          </span>
        </div>
      </div>

      {/* Grid of Prototypes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {prototypes.map((proto) => {
          const protoUrl = proto.prototypePdfUrl || proto.resolutionDossier?.prototypePdfUrl || proto.pdfUrl || proto.testingReportPdfUrl;
          const deployedDeptName = proto.resolutionDossier?.department || proto.handoverDepartment || 'State Government';
          const deployedDateVal = proto.resolutionDossier?.deployedAt || proto.deployedAt || proto.stateCertifiedAt;
          
          return (
            <div key={proto.id || proto._id || proto.challengeId || proto.projectId} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#007A61]/40 transition-all overflow-hidden flex flex-col group">
              
              <div className="p-5 border-b border-slate-100/80 bg-gradient-to-r from-slate-50 to-white flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-black uppercase tracking-wider rounded-md shadow-sm">
                      {proto.trlLevel || 'TRL-9 Certified'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md shadow-sm">
                      {proto.domain || proto.sector || 'Innovation'}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-[15px] leading-tight line-clamp-1 group-hover:text-[#007A61] transition-colors" title={proto.title}>
                    {proto.title}
                  </h3>
                </div>
                {deployedDateVal && (
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Deployed</span>
                    <span className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm whitespace-nowrap">
                      {new Date(deployedDateVal).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-5 bg-white">
                <div className="space-y-4">
                  <p className="text-[13px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
                    {proto.description || proto.problemStatement || proto.resolutionDossier?.notificationText}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 group-hover:bg-slate-50 transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                        <Target className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Handed Over To</span>
                        <span className="block text-[12px] font-bold text-slate-800 line-clamp-1 truncate mt-0.5" title={deployedDeptName}>
                          {deployedDeptName}
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 group-hover:bg-slate-50 transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Location</span>
                        <span className="block text-[12px] font-bold text-slate-800 line-clamp-1 truncate mt-0.5">
                          {proto.location?.district || proto.district || 'Statewide'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center text-[11px] font-black text-emerald-700 bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-200/60 shadow-sm shrink-0">
                    <span>Active & Operational</span>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {onAssignToBudgetOfficer && (
                      proto.assignedBudgetOfficer?.name ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                            Assigned to: <span className="text-slate-900 font-extrabold">{proto.assignedBudgetOfficer.name}</span>
                          </span>
                          <button
                            onClick={() => onAssignToBudgetOfficer(proto)}
                            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                          >
                            Reassign
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAssignToBudgetOfficer(proto)}
                          className="px-4 py-2 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
                        >
                          <span>Assign Budget</span>
                        </button>
                      )
                    )}
                    
                    {protoUrl ? (
                      <button
                        onClick={() => openPdf(protoUrl)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-300" />
                        <span>View Blueprint</span>
                      </button>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                        <AlertCircle className="w-3 h-3" />
                        <span>No Document</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentPrototypesPanel;
