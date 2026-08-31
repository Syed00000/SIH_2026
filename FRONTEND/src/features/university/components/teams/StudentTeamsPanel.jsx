import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';
import { StudentTeamsKpis } from './StudentTeamsKpis.jsx';
import { StudentTeamsTable } from './StudentTeamsTable.jsx';

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
    <div className="space-y-3.5 max-w-7xl mx-auto select-none text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Student Innovation Directory & Teams</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional roster of students allocated by faculty mentors for grassroots innovation projects.
          </p>
        </div>
      </div>

      <StudentTeamsKpis
        totalStudents={totalStudents}
        totalTeams={totalTeams}
        nepCreditsCount={nepCreditsCount}
      />

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

        <StudentTeamsTable loading={loading} students={filtered} />
      </div>
    </div>
  );
};

export default StudentTeamsPanel;
