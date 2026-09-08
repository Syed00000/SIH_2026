import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, UploadCloud, FileText, CheckCircle, 
  Users, Calendar, MoreHorizontal,
  BarChart2, Search, Minus, Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsService } from '../../services/analyticsService.js';

export const ReportsPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // States for filters requested by user
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [tableTimeFilter, setTableTimeFilter] = useState('This Week');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    analyticsService.fetchAll().then((raw) => {
      if (!mounted) return;
      const analytics = analyticsService.buildAnalytics(raw);
      setData({ ...analytics, pArr: raw.pArr, cArr: raw.cArr }); // Keep raw arrays for table/recent activity
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="w-8 h-8 text-[#007A61] animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-500">Loading actual metrics...</p>
      </div>
    );
  }

  // Derived Real Data Mappings
  const activeProjectsCount = data.kpis.totalProjects || 0;
  const tasksCompletedCount = data.hei.completed || 0; 
  const teamUtilizationCount = data.hei.faculty || 0;
  const upcomingDeadlinesCount = data.pendingMil || 0;

  // Timeline (Past 6 months trend of solved/completed challenges)
  const timelineData = data.challengesTrend.map(t => ({
    name: t.month,
    completed: t.solved
  }));

  // Recent Activity (Top 3 most recent projects or approvals)
  const recentActivity = [...data.pArr]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3)
    .map(p => ({
      name: p.assignedFaculty?.name || 'Dr. M. K. Gupta',
      action: `Created project: ${p.title?.substring(0, 20)}...`,
      time: new Date(p.createdAt || Date.now()).toLocaleDateString(),
      type: p.category || 'R&D',
      avatar: (p.assignedFaculty?.name || 'M K').substring(0, 2).toUpperCase()
    }));

  // Filter Table Data
  let filteredProjects = [...data.pArr].filter(p => {
    if (searchQuery.trim() !== '') {
      return (p.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="max-w-[1400px] mx-auto select-none font-sans text-slate-800 space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-none border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Reports</h2>
          <p className="text-sm text-slate-500 mt-1">Track your actual database project data and timeline</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 bg-white border border-slate-200 rounded-none text-sm font-bold text-[#007A61] hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
            >
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Year">This Year</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#007A61] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          
          <button className="flex items-center gap-2 px-5 py-2 bg-[#007A61] hover:bg-[#00604c] text-white rounded-none text-sm font-bold transition-colors shadow-sm cursor-pointer">
            <UploadCloud className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Projects */}
        <div className="bg-white p-5 rounded-none border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-slate-700">Active Projects</span>
            <div className="w-8 h-8 rounded-none border border-emerald-100 flex items-center justify-center bg-emerald-50 text-[#007A61]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{activeProjectsCount}</div>
        </div>

        {/* Tasks Completed */}
        <div className="bg-white p-5 rounded-none border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-slate-700">Tasks Completed</span>
            <div className="w-8 h-8 rounded-none border border-emerald-100 flex items-center justify-center bg-emerald-50 text-[#007A61]">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{tasksCompletedCount}</div>
        </div>

        {/* Team Utilization */}
        <div className="bg-white p-5 rounded-none border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-slate-700">Faculty Mentors</span>
            <div className="w-8 h-8 rounded-none border border-emerald-100 flex items-center justify-center bg-emerald-50 text-[#007A61]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{teamUtilizationCount}</div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white p-5 rounded-none border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-slate-700">Pending Milestones</span>
            <div className="w-8 h-8 rounded-none border border-emerald-100 flex items-center justify-center bg-emerald-50 text-[#007A61]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{upcomingDeadlinesCount}</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Timeline Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-none border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between z-10 relative mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Completed Projects Timeline</h3>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 border border-slate-200 rounded-none text-[#007A61] bg-white hover:bg-emerald-50"><BarChart2 className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="h-[250px] w-full mt-4 z-10 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 30, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007A61" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#007A61" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} dy={10} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3', stroke: '#007A61' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white px-3 py-2 rounded-none text-xs font-semibold shadow-lg relative">
                          <div className="text-[#007A61] font-bold mb-1">{payload[0].payload.name}</div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-none bg-[#007A61]"></span>
                            Completed: {payload[0].value}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="completed" stroke="#007A61" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" activeDot={{ r: 6, fill: "#007A61", stroke: "#004d3e", strokeWidth: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Subtle background grid lines */}
          <div className="absolute inset-0 z-0 pointer-events-none px-6 pb-6 pt-[120px] flex justify-between">
            <div className="border-l border-dashed border-slate-200 h-full"></div>
            <div className="border-l border-dashed border-slate-200 h-full"></div>
            <div className="border-l border-dashed border-slate-200 h-full"></div>
            <div className="border-l border-dashed border-slate-200 h-full"></div>
            <div className="border-l border-dashed border-slate-200 h-full"></div>
            <div className="border-l border-dashed border-slate-200 h-full"></div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-none border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-slate-800">Recent Activity</h3>
              <button className="text-[#007A61] hover:text-[#00604c] transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-6">
              {recentActivity.length > 0 ? recentActivity.map((act, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-none bg-emerald-50 border border-[#007A61] shadow-sm flex items-center justify-center text-[10px] font-bold text-[#007A61] overflow-hidden shrink-0">
                      {act.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{act.name}</div>
                      <div className="text-[11px] font-medium text-slate-500 mt-0.5">{act.action}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-bold text-[#007A61]">{act.type}</div>
                    <div className="text-[10px] font-medium text-slate-400 mt-0.5">{act.time}</div>
                  </div>
                </div>
              )) : (
                <div className="text-sm text-slate-500 text-center py-6">No recent activity</div>
              )}
            </div>
          </div>
          
          <button className="w-full py-2.5 mt-6 border border-[#007A61] text-[#007A61] rounded-none text-xs font-bold hover:bg-emerald-50 transition-colors cursor-pointer">
            See All Activity
          </button>
        </div>
      </div>

      {/* Task Performance Table */}
      <div className="bg-white border border-slate-100 rounded-none shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base font-bold text-slate-800">Task Performance Table</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..." 
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-none text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#007A61] w-48"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select 
                value={tableTimeFilter}
                onChange={(e) => setTableTimeFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-none text-xs font-bold text-[#007A61] hover:bg-slate-50 cursor-pointer focus:outline-none focus:border-[#007A61]"
              >
                <option value="This Week">This Week</option>
                <option value="Past Week">Past Week</option>
                <option value="This Month">This Month</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#007A61] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-white border-b border-slate-100 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-5 w-10"><Minus className="w-4 h-4 text-[#007A61]" /></th>
                <th className="py-3 pr-5 font-bold">Project Name</th>
                <th className="py-3 px-5 font-bold">Assignee</th>
                <th className="py-3 px-5 font-bold">Category</th>
                <th className="py-3 px-5 font-bold">Status</th>
                <th className="py-3 px-5 font-bold">Priority</th>
                <th className="py-3 px-5 font-bold text-center">Milestones</th>
                <th className="py-3 px-5 font-bold text-center">Start Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredProjects.length > 0 ? filteredProjects.map((project, idx) => (
                <tr key={project._id || project.projectId || idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-5">
                    <div className="w-4 h-4 border border-slate-300 rounded-none bg-white"></div>
                  </td>
                  <td className="py-3 pr-5 font-bold text-slate-900 max-w-[200px] truncate" title={project.title}>
                    {project.title || 'Untitled Project'}
                  </td>
                  <td className="py-3 px-5">{project.assignedFaculty?.name || 'Unassigned'}</td>
                  <td className="py-3 px-5">{project.category || 'General'}</td>
                  <td className="py-3 px-5 font-bold text-[#007A61]">{project.status || 'Active'}</td>
                  <td className="py-3 px-5">
                    <span className="text-[10px] font-bold text-[#007A61]">
                      {project.priority || 'Medium'}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-center font-bold text-slate-900">{project.milestones?.length || 0}</td>
                  <td className="py-3 px-5 text-center text-slate-500">{new Date(project.createdAt || Date.now()).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-500 font-medium">No projects match the current search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPanel;
