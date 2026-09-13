import React from 'react';
import { Landmark, Eye, Trash2, Mail, Phone, MapPin, Send, Edit2, Building2, Key, ExternalLink } from 'lucide-react';

export const WardCard = ({
  ward,
  assignedCount = 0,
  onViewWard,
  onEditWard,
  onDeleteWard,
  onAllocateProblem,
  onOpenDashboard
}) => {
  const wardId = ward.deptId || ward.code || ward.wardId || ward.id || ward._id;
  const loginEmail = ward.credentials?.loginEmail || ward.credentials?.loginId || ward.headEmail || ward.councillorEmail;
  const password = ward.credentials?.password || ward.credentials?.generatedPassword;

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#007A61]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0 mt-0.5 font-bold">
          <Landmark className="w-5 h-5" />
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm font-black text-slate-900 leading-tight capitalize">
              {ward.name}
            </h2>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200 font-mono">
              {ward.code || ward.deptId || ward.wardId}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
              {ward.category || (ward.wardNumber ? `Ward #${ward.wardNumber}` : 'Ward Commissioner')}
            </span>
            {(ward.blockName || ward.blockId || ward.block) && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-blue-600" />
                {ward.blockName || ward.blockId || ward.block}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {ward.district || 'Jharkhand'} District
            </span>
            {(ward.headName || ward.councillorName) && (
              <span className="font-semibold text-slate-700">
                Lead: {ward.headName || ward.councillorName} {ward.headRole ? `(${ward.headRole})` : ''}
              </span>
            )}
            {(ward.headEmail || ward.councillorEmail) && (
              <span className="flex items-center gap-1 text-slate-500">
                <Mail className="w-3 h-3 text-slate-400" />
                {ward.headEmail || ward.councillorEmail}
              </span>
            )}
            {(ward.headPhone || ward.councillorPhone) && (
              <span className="flex items-center gap-1 text-slate-500">
                <Phone className="w-3 h-3 text-slate-400" />
                {ward.headPhone || ward.councillorPhone}
              </span>
            )}
          </div>

          {/* Credentials Display for Nodal Officer */}
          {loginEmail && (
            <div className="flex items-center gap-2 mt-1.5 px-2.5 py-1 rounded-lg bg-amber-50/90 border border-amber-200/90 text-[11px] text-amber-900 flex-wrap">
              <span className="font-bold flex items-center gap-1 text-amber-800">
                <Key className="w-3 h-3 text-amber-600" />
                <span>Login:</span>
              </span>
              <span className="font-mono font-bold text-slate-800 select-all">{loginEmail}</span>
              {password && (
                <>
                  <span className="text-amber-300">•</span>
                  <span className="font-bold text-amber-800">Password:</span>
                  <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-amber-200 text-slate-800 select-all">
                    {password}
                  </span>
                </>
              )}
            </div>
          )}

          {ward.localities && ward.localities.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {ward.localities.slice(0, 4).map((loc, i) => (
                <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{loc}</span>
              ))}
              {ward.localities.length > 4 && (
                <span className="text-[10px] text-slate-400 font-semibold">+{ward.localities.length - 4} more</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-center shrink-0 flex-wrap">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {assignedCount} Assigned
        </span>

        {onOpenDashboard && (
          <button
            type="button"
            onClick={() => onOpenDashboard(ward)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-emerald-50 text-[#007A61] hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer border border-emerald-200 shadow-2xs"
            title="Open Ward Commissioner Dashboard"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Dashboard</span>
          </button>
        )}

        {onAllocateProblem && (
          <button
            type="button"
            onClick={() => onAllocateProblem(ward)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-[#007A61] hover:bg-[#006651] text-white rounded-lg transition-colors cursor-pointer shadow-2xs"
            title="Allocate Problem to this Ward"
          >
            <Send className="w-3 h-3" />
            <span>Allocate</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onViewWard(ward)}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="View Ward Details"
        >
          <Eye className="w-4 h-4" />
        </button>
        {onEditWard && (
          <button
            type="button"
            onClick={() => onEditWard(ward)}
            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Ward Details"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onDeleteWard(ward)}
          className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          title="Delete Ward"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default WardCard;
