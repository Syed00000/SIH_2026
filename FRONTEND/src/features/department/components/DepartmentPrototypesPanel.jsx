import React from 'react';
import { Package, MapPin, Target, Sparkles, AlertCircle, Eye, Beaker } from 'lucide-react';
import { openPdf } from '../../../shared/utils/openPdf.js';

export const DepartmentPrototypesPanel = ({ problems = [], onAssignToBudgetOfficer }) => {
  // Only show deployed prototypes handed over to this department
  const prototypes = problems.filter(p => p.isDeployed || p.status === 'Deployed');

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
          const protoUrl = proto.prototypePdfUrl || proto.resolutionDossier?.prototypePdfUrl;
          
          return (
            <div key={proto.id || proto._id || proto.challengeId} className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-[#007A61]/30 transition-all overflow-hidden flex flex-col">
              
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="px-2 py-0.5 bg-[#007A61]/10 text-[#007A61] border border-[#007A61]/20 text-[10px] font-bold uppercase tracking-wider rounded-md">
                      TRL-9 Certified
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-xs">
                      {proto.domain || 'Innovation'}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1" title={proto.title}>
                    {proto.title}
                  </h3>
                </div>
                {proto.resolutionDossier?.deployedAt && (
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200 whitespace-nowrap">
                    {new Date(proto.resolutionDossier.deployedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 font-medium line-clamp-2">
                    {proto.description || proto.problemStatement || proto.resolutionDossier?.notificationText}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-start space-x-2">
                      <Target className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase">Deployed By</span>
                        <span className="block text-[11px] font-bold text-slate-800 line-clamp-1" title={proto.resolutionDossier?.department || 'Government'}>
                          {proto.resolutionDossier?.department || 'Government'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase">Location</span>
                        <span className="block text-[11px] font-bold text-slate-800 line-clamp-1">
                          {proto.location?.district || proto.district || 'Statewide'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Active & Operational</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {onAssignToBudgetOfficer && (
                      proto.assignedBudgetOfficer?.name ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
                            Assigned to: <span className="text-slate-800">{proto.assignedBudgetOfficer.name}</span>
                          </span>
                          <button
                            onClick={() => onAssignToBudgetOfficer(proto)}
                            className="px-2 py-1.5 bg-[#007A61]/5 hover:bg-[#007A61]/15 text-[#007A61] text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Reassign
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAssignToBudgetOfficer(proto)}
                          className="px-3 py-1.5 bg-[#007A61]/10 hover:bg-[#007A61]/20 text-[#007A61] text-[11px] font-bold rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs border border-[#007A61]/20"
                        >
                          <span>Assign Budget</span>
                        </button>
                      )
                    )}
                    
                    {protoUrl ? (
                      <button
                        onClick={() => openPdf(protoUrl)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-300" />
                        <span>View Blueprint</span>
                      </button>
                    ) : (
                      <span className="flex items-center space-x-1 text-[10px] font-bold text-slate-400 px-2">
                        <AlertCircle className="w-3.5 h-3.5" />
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
