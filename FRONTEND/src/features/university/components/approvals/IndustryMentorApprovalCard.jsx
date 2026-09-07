import React from 'react';
import { UserCheck, Building2, Mail, Phone, Sparkles, Award } from 'lucide-react';

export const IndustryMentorApprovalCard = ({ approval }) => {
  const mentor = approval?.assignedMentor || approval?.industryMentor || null;
  if (!mentor) return null;

  return (
    <div className="bg-white border border-emerald-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-emerald-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#007A61] shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Industry Corporate Guide &amp; Technical Mentorship Allocation
              </h4>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-black flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#007A61]" />
                <span>Mentor Assigned</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Assigned by Industry Partner: <strong className="text-slate-800 font-bold">{mentor.company || approval?.partnerName || 'Corporate Innovation Partner'}</strong>
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-black text-emerald-900 self-start sm:self-auto shrink-0 shadow-2xs">
          Mentorship Active
        </span>
      </div>

      <div className="p-4 bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-white rounded-xl border border-emerald-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Corporate Mentor</span>
          <p className="text-xs font-black text-slate-900 mt-0.5">{mentor.name}</p>
          <p className="text-[11px] text-slate-600 font-medium">{mentor.designation || 'Domain Specialist'}</p>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Specialization / Domain</span>
          <p className="text-xs font-black text-emerald-800 mt-0.5">{mentor.specialization || 'Engineering & Technology'}</p>
          <p className="text-[11px] text-slate-500 font-medium">{mentor.company || 'Industry Partner'}</p>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Direct Contact</span>
          {mentor.email && (
            <p className="text-xs font-medium text-slate-700 flex items-center space-x-1 mt-0.5 truncate">
              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{mentor.email}</span>
            </p>
          )}
          {mentor.phone && (
            <p className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{mentor.phone}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndustryMentorApprovalCard;
