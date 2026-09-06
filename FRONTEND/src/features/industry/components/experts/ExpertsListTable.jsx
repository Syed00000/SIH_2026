import React from 'react';
import { Users, Mail, Phone, ArrowUpRight, CheckCircle2, UserCheck, Plus } from 'lucide-react';

export const ExpertsListTable = ({
  experts = [],
  onAssignProblem,
  onOpenAddExpert,
  search = '',
  domainFilter = 'All'
}) => {
  const filtered = experts.filter((exp) => {
    if (domainFilter !== 'All' && !exp.specialization?.toLowerCase().includes(domainFilter.toLowerCase())) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        exp.name?.toLowerCase().includes(q) ||
        exp.designation?.toLowerCase().includes(q) ||
        exp.specialization?.toLowerCase().includes(q) ||
        exp.expertId?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Expert / Engineer</th>
              <th className="py-3 px-4">Corporate Role & Exp</th>
              <th className="py-3 px-4">Technical Domain</th>
              <th className="py-3 px-4">Official Contact</th>
              <th className="py-3 px-4">Mentorship Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 px-4 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2.5 max-w-md mx-auto">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#007A61] flex items-center justify-center shadow-inner">
                      <Users className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      {experts.length === 0 ? 'No Industrial Experts Registered Yet' : 'No Matching Experts Found'}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {experts.length === 0
                        ? 'Register your technical directors, research scientists, and engineers to mentor university student squads.'
                        : 'Try adjusting your search or domain filter criteria.'}
                    </p>
                    {experts.length === 0 && (
                      <button
                        type="button"
                        onClick={onOpenAddExpert}
                        className="mt-2 px-4 py-2 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Register First Expert</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((expert) => {
                const assignedCount = expert.assignedProblems?.length || 0;
                const isAssigned = assignedCount > 0;

                return (
                  <tr key={expert.expertId || expert._id} className="hover:bg-emerald-50/20 transition-colors">
                    {/* 1. Expert Identity */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-[#007A61] font-black text-xs flex items-center justify-center shrink-0">
                          {expert.name?.charAt(0) || 'E'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-slate-900 truncate max-w-[170px] text-xs">
                            {expert.name}
                          </div>
                          <span className="font-mono text-[9px] text-slate-400 font-semibold block">
                            {expert.expertId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Designation & Exp */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-bold text-slate-800 text-xs truncate max-w-[180px]">
                        {expert.designation}
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {expert.experienceYears ? `${expert.experienceYears} Years Experience` : 'Senior Mentor'}
                      </span>
                    </td>

                    {/* 3. Specialization Domain */}
                    <td className="py-3.5 px-4 align-top max-w-[200px]">
                      <span className="px-2 py-0.5 bg-emerald-50 text-[#007A61] border border-emerald-200 rounded-md text-[10px] font-bold line-clamp-1">
                        {expert.specialization}
                      </span>
                      {expert.bio && (
                        <p className="text-[10px] text-slate-500 italic mt-0.5 line-clamp-1">
                          "{expert.bio}"
                        </p>
                      )}
                    </td>

                    {/* 4. Contact Details */}
                    <td className="py-3.5 px-4 align-top space-y-0.5">
                      <div className="flex items-center space-x-1.5 text-[11px] text-slate-600 font-medium">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{expert.email}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-[10px] text-slate-500">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{expert.phone}</span>
                      </div>
                    </td>

                    {/* 5. Status Badge */}
                    <td className="py-3.5 px-4 align-top">
                      {isAssigned ? (
                        <span className="px-2.5 py-1 text-[10px] font-extrabold border rounded-full bg-blue-50 text-blue-700 border-blue-200 flex items-center space-x-1 w-max">
                          <UserCheck className="w-3 h-3 text-blue-600" />
                          <span>Mentoring {assignedCount} Problem{assignedCount > 1 ? 's' : ''}</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-[10px] font-extrabold border rounded-full bg-emerald-50 text-emerald-800 border-emerald-200 flex items-center space-x-1 w-max">
                          <CheckCircle2 className="w-3 h-3 text-[#007A61]" />
                          <span>Available</span>
                        </span>
                      )}
                    </td>

                    {/* 6. Action Button */}
                    <td className="py-3.5 px-4 align-top text-right">
                      <button
                        type="button"
                        onClick={() => onAssignProblem(expert)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-1.5 shadow-2xs cursor-pointer ${
                          isAssigned
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                            : 'bg-[#007A61] hover:bg-[#00604c] text-white'
                        }`}
                      >
                        <span>{isAssigned ? 'Manage Mentorship' : 'Assign Problem'}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpertsListTable;
