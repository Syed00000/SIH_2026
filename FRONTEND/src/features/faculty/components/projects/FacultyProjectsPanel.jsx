import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Trash2,
  Search,
  MapPin,
  ArrowUpRight,
  ArrowLeft,
  Users,
  Coins,
  LayoutGrid,
  LayoutList,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { universityApiService } from '../../../university/services/universityApiService.js';
import { ProjectFundingBreakdown } from './ProjectFundingBreakdown.jsx';
import { ProjectEvidenceSection } from './ProjectEvidenceSection.jsx';
import { ProjectMilestonesList } from './ProjectMilestonesList.jsx';
import { computeDynamicMilestones } from '../../../../shared/utils/milestonesHelper.js';

export const FacultyProjectsPanel = ({
  projects = [],
  faculty,
  onRefresh,
  onNavigateTab,
  initialProjectId = null,
  hideHeader = false
}) => {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // If hideHeader is true (inside FacultyProjectWorkspace), select the project immediately
  // If hideHeader is false, show problem list first unless initialProjectId is explicitly provided
  const [selectedProject, setSelectedProject] = useState(() => {
    if (initialProjectId) {
      return (
        projects.find(
          (p) => p.projectId === initialProjectId || p.challengeId === initialProjectId || p._id === initialProjectId
        ) || null
      );
    }
    return hideHeader ? projects[0] || null : null;
  });

  useEffect(() => {
    if (initialProjectId) {
      const match = projects.find(
        (p) => p.projectId === initialProjectId || p.challengeId === initialProjectId || p._id === initialProjectId
      );
      if (match) setSelectedProject(match);
    } else if (hideHeader && !selectedProject && projects.length > 0) {
      setSelectedProject(projects[0]);
    }
  }, [initialProjectId, projects, hideHeader]);

  const handleDeleteProject = async (proj) => {
    const pid = proj?.projectId || proj?._id;
    if (!pid) return;
    if (window.confirm(`Are you sure you want to delete/withdraw project "${proj.title || pid}"?`)) {
      try {
        await universityApiService.deleteProject(pid, faculty?.universityCode || 'RU001');
        if (selectedProject?.projectId === pid || selectedProject?._id === pid) {
          setSelectedProject(null);
        }
        if (onRefresh) await onRefresh();
      } catch (err) {
        alert('Failed to delete project: ' + err.message);
      }
    }
  };

  const handleOpenWorkspace = (p) => {
    const targetId = p.projectId || p.challengeId || p._id;
    if (onNavigateTab) {
      onNavigateTab('project-workspace', targetId);
    }
  };

  // ----------------------------------------------------
  // Detail & Milestones View (Used inside Workspace or when user clicks a project)
  // ----------------------------------------------------
  const renderDetailView = (proj, isInsideWorkspace = false) => {
    if (!proj) return null;
    const dynamicM = computeDynamicMilestones(proj);
    const selDone = dynamicM.filter((m) => m.status === 'Completed').length;
    const selPending = dynamicM.length - selDone;
    const domain = proj.domain || proj.category || 'Innovation';
    const loc = proj.location?.district || proj.district || 'Ranchi, Jharkhand';
    const isDeployed = proj.governmentStatus === 'Approved' || proj.status === 'Completed' || proj.status === 'Deployed';

    return (
      <div className="space-y-4 text-left select-none">
        {/* Navigation & Action Bar (when opened from problem list) */}
        {!isInsideWorkspace && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>← Back to Problem List</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleOpenWorkspace(proj)}
                className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Full Workspace (Teams &amp; Prototype)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleDeleteProject(proj)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200 flex items-center space-x-1 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-[11px] font-bold text-rose-600">Delete</span>
              </button>
            </div>
          </div>
        )}

        {/* Project Header Info Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="space-y-2 pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                  {proj.projectId}
                </span>
                <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {domain}
                </span>
                <span className="flex items-center space-x-1 text-xs text-slate-500">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{loc}</span>
                </span>
                {isDeployed ? (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 whitespace-nowrap shadow-2xs">
                    ✓ Deployed (TRL-9)
                  </span>
                ) : proj.prototypeStatus === 'Approved' ? (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap shadow-2xs">
                    ✓ Prototype Done
                  </span>
                ) : (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap shadow-2xs">
                    {proj.status || 'Proposal Stage'}
                  </span>
                )}
              </div>

              {isInsideWorkspace && (
                <button
                  type="button"
                  onClick={() => handleDeleteProject(proj)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200 flex items-center space-x-1 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-[11px] font-bold text-rose-600">Delete Project</span>
                </button>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-black text-slate-900">{proj.title}</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {proj.problemStatement || proj.description || 'No detailed problem statement provided.'}
            </p>
          </div>

          {/* 4 KPI Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Sanctioned Grant</span>
              <span className="font-extrabold text-slate-900 text-xs mt-0.5 block truncate">
                {proj.sanctionedBudget || (proj.budget && proj.budget !== 'N/A' ? proj.budget : '₹ 15,000')}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Student Team</span>
              <span className="font-extrabold text-slate-900 text-xs mt-0.5 block truncate">
                {proj.teamMembers?.length ? `${proj.teamMembers.length} Researchers` : 'Formation in Progress'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Prototype ETA</span>
              <span className="font-extrabold text-slate-900 text-xs mt-0.5 block truncate">
                {proj.prototypeData?.timeline || 'Not Specified'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Tasks Status</span>
              <span className="font-extrabold text-slate-900 text-xs mt-0.5 block">
                <span className="text-[#007A61]">{selDone} Completed</span>
                {' • '}
                <span className="text-amber-600">{selPending} Pending</span>
              </span>
            </div>
          </div>

          {/* Ground Level Evidence & Tracking */}
          <ProjectEvidenceSection project={proj} />

          {/* Funding & Disbursal Breakdown */}
          <ProjectFundingBreakdown project={proj} />

          {/* Project Milestones List */}
          <ProjectMilestonesList project={proj} />
        </div>
      </div>
    );
  };

  // If hideHeader is true, render inside FacultyProjectWorkspace
  if (hideHeader) {
    return renderDetailView(selectedProject, true);
  }

  // If user clicked a project from the problem list, render that project's detail and milestone view
  if (selectedProject) {
    return (
      <div className="space-y-4 max-w-7xl mx-auto select-none pb-12 text-left">
        {renderDetailView(selectedProject, false)}
      </div>
    );
  }

  // ----------------------------------------------------
  // Main Problem List View (Full page listing like Assigned Challenges)
  // ----------------------------------------------------
  const filtered = projects.filter((p) => {
    if (domainFilter !== 'All' && p.domain !== domainFilter && p.category !== domainFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (p.title || '').toLowerCase().includes(q) ||
        (p.projectId || '').toLowerCase().includes(q) ||
        (p.domain || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12 text-left">
      {/* Top Banner Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Faculty Research Node</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">R&amp;D Projects &amp; Prototypes</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <FolderGit2 className="w-5 h-5 text-[#007A61]" />
            <span>Problem List &amp; Active R&amp;D Projects</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Select any problem statement to view its complete milestones, grant disbursal, and engineering progress.
          </p>
        </div>
      </div>

      {/* Search, Domain Filter & Grid/List View Switcher */}
      <div className="bg-white border border-slate-200/90 p-3 rounded-2xl shadow-2xs flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problem list by title, domain, ID, location..."
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white transition-all shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs min-w-[170px]"
          >
            <option value="All">All Thematic Domains</option>
            <option value="Water">Water &amp; Sanitation</option>
            <option value="Urban Development">Urban Development</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Environment">Environment</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Energy">Energy</option>
            <option value="Agriculture">Agriculture</option>
          </select>

          {/* List & Grid View Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              title="List View"
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Problem List Content */}
      {projects.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-slate-400 space-y-2">
          <ClipboardList className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-700 text-sm">No Active Problems</h3>
          <p className="text-xs max-w-md mx-auto">
            When problem statements are allocated to you, your active R&amp;D projects will appear in this list.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-slate-400 space-y-2">
          <FolderGit2 className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-700 text-sm">No Projects Match Criteria</h3>
          <p className="text-xs max-w-md mx-auto">
            Try adjusting your search query or thematic domain filter.
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-3.5' : 'space-y-2.5'}>
          {filtered.map((p, idx) => {
            const dynamicM = computeDynamicMilestones(p);
            const doneM = dynamicM.filter((m) => m.status === 'Completed').length;
            const pct = Math.round((doneM / 7) * 100);
            const loc = p.location?.district || p.district || 'Ranchi, Jharkhand';
            const domain = p.domain || p.category || 'Urban Development';
            const isDeployed =
              p.governmentStatus === 'Approved' ||
              p.status === 'Completed' ||
              p.status === 'Deployed';

            if (viewMode === 'list') {
              return (
                <div
                  key={p.projectId || idx}
                  onClick={() => setSelectedProject(p)}
                  className="bg-white border border-slate-200/90 hover:border-[#007A61] rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-left cursor-pointer group"
                >
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                        {p.projectId}
                      </span>
                      <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {domain}
                      </span>
                      {isDeployed ? (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 whitespace-nowrap shadow-2xs">
                          ✓ Deployed (TRL-9)
                        </span>
                      ) : p.prototypeStatus === 'Approved' ? (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap shadow-2xs">
                          ✓ Prototype Done
                        </span>
                      ) : p.prototypeStatus === 'In Review' ? (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 whitespace-nowrap shadow-2xs">
                          ⏳ Under Review
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap shadow-2xs">
                          {p.status || 'Proposal Stage'}
                        </span>
                      )}
                      <span className="flex items-center space-x-1 text-[11px] text-slate-500 ml-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{loc}</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug truncate group-hover:text-[#007A61] transition-colors">
                      {p.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-1 leading-relaxed">
                      {p.problemStatement || p.description || 'No detailed problem statement provided.'}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Coins className="w-3.5 h-3.5 text-[#007A61]" />
                        <span>Grant: {p.sanctionedBudget || p.budget || '₹ 15,000'}</span>
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Users className="w-3.5 h-3.5 text-purple-600" />
                        <span>Team: {p.teamMembers?.length ? `${p.teamMembers.length} Researchers` : 'Formation in Progress'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right Progress & Action */}
                  <div className="flex items-center space-x-4 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 flex-wrap">
                    <div className="flex flex-col items-end min-w-[120px]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Lifecycle Progress
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-[#007A61] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[11px] font-extrabold font-mono text-[#007A61] min-w-[30px] text-right">
                          {pct}%
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(p);
                      }}
                      className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
                    >
                      <span>View Milestones &amp; Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            }

            // Grid View Card
            return (
              <div
                key={p.projectId || idx}
                onClick={() => setSelectedProject(p)}
                className="bg-white border border-slate-200/90 hover:border-[#007A61] rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3.5 text-left cursor-pointer group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                        {p.projectId}
                      </span>
                      <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {domain}
                      </span>
                    </div>

                    {isDeployed ? (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 whitespace-nowrap shadow-2xs">
                        ✓ Deployed (TRL-9)
                      </span>
                    ) : p.prototypeStatus === 'Approved' ? (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap shadow-2xs">
                        ✓ Prototype Done
                      </span>
                    ) : p.prototypeStatus === 'In Review' ? (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 whitespace-nowrap shadow-2xs">
                        ⏳ Under Review
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap shadow-2xs">
                        {p.status || 'Proposal Stage'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug group-hover:text-[#007A61] transition-colors">
                    {p.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {p.problemStatement || p.description || 'No detailed problem statement provided.'}
                  </p>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-0.5">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{loc}</span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-600">
                      <span>Lifecycle Progress</span>
                      <span className="font-mono text-[#007A61] font-bold">{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#007A61] h-1.5 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>

                {/* Card Actions & Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Grant:</span>
                    <span className="font-bold text-slate-800 text-xs">
                      {p.sanctionedBudget || p.budget || '₹ 15,000'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(p);
                    }}
                    className="px-3 py-1.5 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View Milestones</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FacultyProjectsPanel;
