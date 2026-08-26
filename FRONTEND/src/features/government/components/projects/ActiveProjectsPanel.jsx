import React, { useState, useMemo } from 'react';
import {
  PlayCircle,
  Search,
  RotateCcw,
  Plus,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Cpu,
  ChevronRight,
  SlidersHorizontal,
  Table,
  Grid,
  ShieldCheck,
  Zap,
  IndianRupee,
  Layers,
  Award
} from 'lucide-react';

import { ProjectManageModal } from './ProjectManageModal.jsx';
import { AddProjectModal } from './AddProjectModal.jsx';
import { SECTOR_OPTIONS, DISTRICT_OPTIONS, INITIAL_ACTIVE_PROJECTS } from '../../data/projectsSolutionsData.js';

export const ActiveProjectsPanel = () => {
  const [projects, setProjects] = useState(INITIAL_ACTIVE_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedTrl, setSelectedTrl] = useState('All TRL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  const [selectedProject, setSelectedProject] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hei.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.teamLead.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSector =
        selectedSector === 'All Sectors' || item.sector === selectedSector;

      const matchesDistrict =
        selectedDistrict === 'All Districts' || item.district === selectedDistrict;

      const matchesTrl =
        selectedTrl === 'All TRL' || item.trlLevel === selectedTrl;

      return matchesSearch && matchesSector && matchesDistrict && matchesTrl;
    });
  }, [projects, searchQuery, selectedSector, selectedDistrict, selectedTrl]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSector('All Sectors');
    setSelectedDistrict('All Districts');
    setSelectedTrl('All TRL');
  };

  // Update Milestone Status
  const handleUpdateMilestoneStatus = (projectId, milestoneId, nextStatus) => {
    setProjects((prev) =>
      prev.map((prj) => {
        if (prj.id === projectId) {
          const updatedMilestones = (prj.milestones || []).map((m) =>
            m.id === milestoneId ? { ...m, status: nextStatus, progress: 100 } : m
          );
          const completedCount = updatedMilestones.filter((m) => m.status === 'Completed').length;
          const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);

          return {
            ...prj,
            milestones: updatedMilestones,
            milestoneProgress: newProgress
          };
        }
        return prj;
      })
    );
    showToast(`Milestone ${milestoneId} updated to "${nextStatus}".`);
  };

  // Advance Milestone Phase
  const handleAdvancePhase = (projectId) => {
    setProjects((prev) =>
      prev.map((prj) => {
        if (prj.id === projectId) {
          const newProgress = Math.min(100, (prj.milestoneProgress || 50) + 20);
          return {
            ...prj,
            milestoneProgress: newProgress,
            deploymentStatus: newProgress >= 90 ? 'Validated ✓' : prj.deploymentStatus
          };
        }
        return prj;
      })
    );
    showToast(`Project ${projectId} advanced to next milestone stage.`);
  };

  // Add New Project
  const handleAddNewProject = (newPrj) => {
    setProjects((prev) => [newPrj, ...prev]);
    showToast(`New innovation project "${newPrj.title}" sanctioned successfully.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center space-x-2 animate-slideUp ${
            notification.type === 'error'
              ? 'bg-red-900 text-white border-red-800'
              : 'bg-slate-900 text-white border-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span className="flex items-center space-x-1">
              <PlayCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Projects & Solutions</span>
            </span>
            <span>•</span>
            <span className="text-slate-700">Active R&D Innovations</span>
          </div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight">
            ACTIVE PROJECTS IN PROGRESS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Real-time stage gates, milestone compliance, and TRL monitoring across funded innovations
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Sanction New Project</span>
          </button>
        </div>
      </div>

      {/* Top Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Active Projects
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">{projects.length}</div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 mt-1 inline-block">
            In Pipeline
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            On Schedule
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">24</div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 mt-1 inline-block">
            85.7% On Track
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Delayed Milestones
          </span>
          <div className="text-2xl font-black text-rose-700 mt-1">4</div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 mt-1 inline-block">
            Audit Required
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Avg TRL Level
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">TRL-6.2</div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 mt-1 inline-block">
            System Validated
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Sanctioned Grants
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">₹ 2.5 Cr</div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 mt-1 inline-block">
            Allocated Pool
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Disbursed
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">₹ 1.8 Cr</div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 mt-1 inline-block">
            72% Disbursed
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search project title, ID, team lead, or university..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:outline-hidden"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
          >
            {SECTOR_OPTIONS.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-44">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
          >
            {DISTRICT_OPTIONS.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={handleResetFilters}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="border border-slate-200 rounded-xl p-0.5 bg-slate-50 flex items-center">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Project Title & ID</th>
                  <th className="py-3 px-4">Milestone Phase & Progress</th>
                  <th className="py-3 px-4">Prototype & TRL</th>
                  <th className="py-3 px-4">Deployment Status</th>
                  <th className="py-3 px-4">Grant Disbursal</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProjects.map((prj) => (
                  <tr key={prj.id} className="hover:bg-slate-50/60 transition-colors group cursor-default">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-black">
                        {prj.title}{' '}
                        <span className="font-mono text-slate-500 font-semibold text-[11px]">
                          ({prj.id})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                        <span className="font-medium text-slate-700 flex items-center space-x-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{prj.hei}</span>
                        </span>
                        <span>•</span>
                        <span>{prj.sector}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-800">{prj.district}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{prj.milestonePhase}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-slate-900 h-full rounded-full transition-all duration-300"
                            style={{ width: `${prj.milestoneProgress || 50}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">
                          {prj.milestoneProgress || 50}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200 inline-flex items-center space-x-1">
                        <span>{prj.prototypeType}</span>
                        <span className="text-slate-400">|</span>
                        <span className="font-black text-slate-900">{prj.trlLevel}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          prj.deploymentStatus?.includes('Validated') || prj.deploymentStatus?.includes('Active')
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : prj.deploymentStatus === 'In Progress'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {prj.deploymentStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">{prj.disbursedAmount}</div>
                      <div className="text-[10px] text-slate-500 font-medium">of {prj.sanctionedGrant}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProject(prj);
                            setIsManageModalOpen(true);
                          }}
                          className="px-3 py-1 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                        >
                          Manage
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdvancePhase(prj.id)}
                          className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Advance Milestone Stage"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((prj) => (
            <div
              key={prj.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-900 text-white">
                      {prj.id}
                    </span>
                    <span className="text-xs font-bold text-slate-500 ml-2">{prj.sector}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-2">{prj.title}</h3>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">Institution:</span>
                    <span className="font-semibold text-slate-800">{prj.hei}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">Milestone Stage:</span>
                    <span className="font-semibold text-slate-900">{prj.milestonePhase}</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                      <span>Progress</span>
                      <span>{prj.milestoneProgress || 50}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-slate-900 h-full rounded-full" style={{ width: `${prj.milestoneProgress || 50}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-800">{prj.disbursedAmount}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProject(prj);
                    setIsManageModalOpen(true);
                  }}
                  className="px-3.5 py-1 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                >
                  Manage Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <ProjectManageModal
        project={selectedProject}
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false);
          setSelectedProject(null);
        }}
        onUpdateMilestoneStatus={(prjId, mId, status) => handleUpdateMilestoneStatus(prjId, mId, status)}
        onValidateDeployment={(prjId) => {
          setProjects((prev) =>
            prev.map((p) => (p.id === prjId ? { ...p, deploymentStatus: 'Validated ✓' } : p))
          );
          showToast(`State deployment certificate issued for project ${prjId}.`);
        }}
      />

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(newPrj) => handleAddNewProject(newPrj)}
      />
    </div>
  );
};

export default ActiveProjectsPanel;
