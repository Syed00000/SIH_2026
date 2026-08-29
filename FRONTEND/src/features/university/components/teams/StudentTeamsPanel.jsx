import React, { useState, useEffect } from 'react';
import { Search, Loader2, Users, Award, ShieldCheck, GraduationCap, Info } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';

export const StudentTeamsPanel = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await universityApiService.getTeams();
      setTeams(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    load();
  }, []);

  const allStudents = teams.flatMap((t) =>
    (t.members?.length ? t.members : []).map((m) => ({
      ...m,
      teamName: t.name,
      teamCode: t.teamCode,
      project: t.project,
      mentor: t.mentor,
      nepCredits: t.nepCredits || '4 Credits',
      status: 'Allocated'
    }))
  );

  const totalStudents = allStudents.length;
  const totalTeams = teams.length;
  const nepCreditsCount = allStudents.filter((s) => s.nepCredits?.includes('4')).length;

  const filtered = allStudents.filter((s) => {
    if (deptFilter !== 'All' && s.department !== deptFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (s.name || '').toLowerCase().includes(q) ||
        (s.rollNo || '').toLowerCase().includes(q) ||
        (s.teamName || '').toLowerCase().includes(q) ||
        (s.project || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Student Innovation Directory & Teams</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional roster of students allocated by faculty mentors for grassroots innovation projects.
          </p>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Total Innovators</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">{totalStudents}</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Allocated Project Teams</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">{totalTeams}</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">NEP Credit Beneficiaries</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">{nepCreditsCount}</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student, roll number, team or project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none font-medium text-slate-700 cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Biotechnology">Biotechnology</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-400 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span>Loading student roster...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
            <Info className="w-6 h-6 text-slate-300 mb-1.5" />
            <span className="font-bold text-slate-700">No student innovators registered yet</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Student teams allocated by mentors will appear in this directory.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50 text-[10.5px] uppercase font-bold text-slate-500 select-none">
                  <th className="py-2.5 px-3.5">Student Name & Roll No</th>
                  <th className="py-2.5 px-3">Department & Year</th>
                  <th className="py-2.5 px-3">Assigned Team</th>
                  <th className="py-2.5 px-3">Innovation Challenge</th>
                  <th className="py-2.5 px-3">Faculty Mentor</th>
                  <th className="py-2.5 px-3 text-right">NEP Credits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="font-mono text-[10.5px] text-slate-400">{s.rollNo}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <div>{s.department}</div>
                      <div className="text-[10px] text-slate-400">{s.year}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                        {s.teamName}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900 max-w-[200px] truncate">
                      {s.project}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {s.mentor}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {s.nepCredits}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTeamsPanel;
