import React from 'react';
import { Eye, Edit2, Trash2, Phone, ShieldCheck, Wrench, KeyRound, Mail } from 'lucide-react';

export const DepartmentTechnicianCard = ({
  tech,
  onView,
  onEdit,
  onDelete,
  isDeleting
}) => {
  const targetId = tech.technicianId || tech.id || tech._id;
  const loginEmail = tech.credentials?.loginEmail || tech.email || 'tech@jharkhand.gov.in';
  const password = tech.credentials?.password || tech.credentials?.generatedPassword || '••••••••';
  const status = tech.status || 'Active';

  return (
    <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-2.5 text-left">
      {/* Header: Name, ID, Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-extrabold text-sm text-slate-900 truncate">{tech.name}</h3>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span className="font-mono text-[10px] font-bold text-[#007A61] bg-[#007A61]/10 px-1.5 py-0.2 rounded border border-[#007A61]/20">
              {tech.technicianId}
            </span>
            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 truncate">
              <Wrench className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{tech.specialization || 'Field Operations'}</span>
            </span>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
          status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
          status === 'On Field' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
        }`}>
          {status}
        </span>
      </div>

      {/* Phone & Credentials */}
      <div className="p-2.5 bg-slate-50 rounded-lg space-y-1.5 text-[11px] border border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Phone className="w-3 h-3 text-[#007A61]" /> Contact:
          </span>
          <a href={`tel:${tech.phone || '9431100000'}`} className="font-mono font-bold text-slate-800 hover:text-[#007A61]">
            {tech.phone || '9431100000'}
          </a>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Mail className="w-3 h-3 text-slate-400" /> Login ID:
          </span>
          <span className="font-mono text-[10px] text-slate-700 truncate max-w-[180px]">
            {loginEmail}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <KeyRound className="w-3 h-3 text-amber-500" /> Password:
          </span>
          <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-800">
            {password}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onView && onView(tech)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View</span>
        </button>
        <button
          type="button"
          onClick={() => onEdit && onEdit(tech)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
        <button
          type="button"
          disabled={isDeleting}
          onClick={() => onDelete && onDelete(tech)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{isDeleting ? '...' : 'Remove'}</span>
        </button>
      </div>
    </div>
  );
};

export default DepartmentTechnicianCard;
