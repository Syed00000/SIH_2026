import React from 'react';
import { Rocket, Users, Star, Bell, CheckCircle2, Building2, ShieldCheck, HeartHandshake, Lock } from 'lucide-react';

export const PrototypePhase4DeploymentView = ({ project, isApproved, onOpenDeployTerms }) => {
  const pData = project.prototypeData || {};
  const fieldMetrics = pData.fieldMetrics || {
    citizenScore: '4.8 / 5.0 (320 Verified Citizens)'
  };
  const deployNotes = pData.phases?.publicDeploy || '';
  const targetDept = project.targetDepartment || project.domain || project.sector || 'Urban Development & Housing Department';

  return (
    <div className="space-y-4">
      {/* 1. Citizen Impact & Beneficiary Reach */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <HeartHandshake className="w-4 h-4 text-[#007A61]" />
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Citizen Welfare Impact & Beneficiary Reach</h3>
          </div>
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border flex items-center space-x-1 ${
            isApproved ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'
          }`}>
            {isApproved ? (
              <>
                <Lock className="w-3 h-3 text-emerald-700" />
                <span>✓ Operational in Public Domain · Locked</span>
              </>
            ) : (
              <span>Awaiting State Handover</span>
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center space-x-1"><Users className="w-3 h-3 text-slate-400" /><span>Target Beneficiary Population</span></span>
            <p className="font-black text-slate-900 text-sm">~12,500 Citizens</p>
            <span className="text-[10px] text-slate-500 block">{project.district || 'Ranchi'} District Cluster</span>
          </div>
          <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center space-x-1"><Star className="w-3 h-3 text-amber-500 fill-amber-500" /><span>Citizen Impact Score</span></span>
            <p className="font-black text-amber-700 text-sm">{fieldMetrics.citizenScore}</p>
            <span className="text-[10px] text-slate-500 block">Verified Community Adoption</span>
          </div>
          <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center space-x-1"><Building2 className="w-3 h-3 text-slate-400" /><span>Operating Line Agency</span></span>
            <p className="font-bold text-slate-900 truncate">{targetDept}</p>
            <span className="text-[10px] text-emerald-700 font-semibold block">Full Implementation Handover</span>
          </div>
        </div>
      </div>

      {/* 2. Automated Citizen Resolution & SMS Dispatch Alert */}
      <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-xs">
        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
          <Bell className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-emerald-950">Automated Citizen Resolution & SMS Notification</h4>
          <p className="text-emerald-800 text-[11.5px] leading-relaxed">
            Upon final deployment authorization, the reporting citizen for <strong>{project.challengeId || 'CHL-JH-2026-3857'}</strong> will receive an instant official SMS notice informing that their grievance has been resolved via an indigenously developed innovation. Problem status is permanently marked as <strong className="font-extrabold text-emerald-950">RESOLVED</strong>.
          </p>
        </div>
      </div>

      {/* 3. Final Deployment Action Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">State Authorization Action (TRL-9)</h4>
            <p className="text-[11px] text-slate-500">
              {isApproved
                ? 'Prototype is officially deployed and state certified. All further changes are locked.'
                : 'Execute final department transfer and grant official TRL-9 public deployment certification.'}
            </p>
          </div>
          {isApproved ? (
            <div className="px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center space-x-2 cursor-default select-none shadow-xs">
              <Lock className="w-4 h-4 text-emerald-800" />
              <span>✓ Deployed (TRL-9) · Changes Locked</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onOpenDeployTerms?.(project)}
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#007A61] hover:bg-[#00604c] text-white cursor-pointer shadow-md flex items-center space-x-2 transition-all"
            >
              <Rocket className="w-4 h-4 text-emerald-200" />
              <span>🚀 Deploy Prototype (TRL-9)</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Public Deployment Documentation Notes */}
      {deployNotes && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <h4 className="text-xs font-black uppercase text-slate-800 flex items-center space-x-1.5"><ShieldCheck className="w-3.5 h-3.5 text-slate-500" /><span>Public Deployment Governance Log</span></h4>
          <div className="text-xs text-slate-700 leading-relaxed prose max-w-none" dangerouslySetInnerHTML={{ __html: deployNotes }} />
        </div>
      )}
    </div>
  );
};

export default PrototypePhase4DeploymentView;
