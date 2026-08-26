import React, { useState } from 'react';
import {
  Cpu,
  FlaskConical,
  Building2,
  Sliders,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Search,
  RotateCcw,
  ShieldCheck,
  Award,
  Layers
} from 'lucide-react';

import { ProjectManageModal } from './ProjectManageModal.jsx';
import { INITIAL_ACTIVE_PROJECTS } from '../../data/projectsSolutionsData.js';

export const PrototypesEvaluationPanel = () => {
  const [projects, setProjects] = useState(INITIAL_ACTIVE_PROJECTS);
  const [selectedTrlFilter, setSelectedTrlFilter] = useState('All TRL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All Architectures');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hei.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hardwareSpecs?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTrl =
      selectedTrlFilter === 'All TRL' ||
      (selectedTrlFilter === 'High TRL (7-9)' && parseInt(p.trlLevel.replace('TRL-', ''), 10) >= 7) ||
      (selectedTrlFilter === 'Mid TRL (4-6)' &&
        parseInt(p.trlLevel.replace('TRL-', ''), 10) >= 4 &&
        parseInt(p.trlLevel.replace('TRL-', ''), 10) <= 6) ||
      (selectedTrlFilter === 'Early TRL (1-3)' && parseInt(p.trlLevel.replace('TRL-', ''), 10) <= 3);

    const matchesType =
      selectedTypeFilter === 'All Architectures' || p.prototypeType === selectedTypeFilter;

    return matchesSearch && matchesTrl && matchesType;
  });

  const handleUpgradeTrl = (projectId) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const currentNum = parseInt(p.trlLevel.replace('TRL-', ''), 10) || 4;
          const nextNum = Math.min(9, currentNum + 1);
          return {
            ...p,
            trlLevel: `TRL-${nextNum}`,
            trlDescription: `Advanced to TRL-${nextNum} validated through field testing and NABL verification.`
          };
        }
        return p;
      })
    );
    showToast(`Project ${projectId} upgraded to next TRL rating.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center space-x-2 bg-slate-900 text-white border-slate-800 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span className="flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <span>Projects & Solutions</span>
            </span>
            <span>•</span>
            <span className="text-slate-700">Technology Readiness Levels</span>
          </div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight">
            PROTOTYPES & TRL EVALUATION
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Hardware, software, and hybrid engineering specifications verified in university laboratories
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
          {projects.length} Verified Prototypes
        </span>
      </div>

      {/* TRL Scale Explanation Strip */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Technology Readiness Level (TRL) Scale Ladder</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">TRL-1 (Concept) ➔ TRL-9 (Proven)</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-center text-xs">
          {[
            { trl: 'TRL-1', name: 'Basic Principles' },
            { trl: 'TRL-2', name: 'Concept' },
            { trl: 'TRL-3', name: 'Proof of Concept' },
            { trl: 'TRL-4', name: 'Lab Validated' },
            { trl: 'TRL-5', name: 'Relevant Env' },
            { trl: 'TRL-6', name: 'Simulated Model' },
            { trl: 'TRL-7', name: 'Operational Demo' },
            { trl: 'TRL-8', name: 'System Qualified' },
            { trl: 'TRL-9', name: 'Proven in Mission' }
          ].map((item) => (
            <div key={item.trl} className="bg-white/10 rounded-xl p-2 border border-white/10">
              <span className="font-mono font-black text-xs block text-white">{item.trl}</span>
              <span className="text-[9px] text-slate-300 line-clamp-1 mt-0.5">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prototype specs, sensors, microcontrollers, university..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2">
          {['All TRL', 'High TRL (7-9)', 'Mid TRL (4-6)', 'Early TRL (1-3)'].map((trl) => (
            <button
              key={trl}
              type="button"
              onClick={() => setSelectedTrlFilter(trl)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                selectedTrlFilter === trl
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {trl}
            </button>
          ))}
        </div>

        <div className="w-full md:w-44">
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
          >
            <option value="All Architectures">All Architectures</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Prototypes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((prj) => (
          <div
            key={prj.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md font-mono text-[11px] font-black bg-slate-900 text-white">
                      {prj.trlLevel}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {prj.prototypeType}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-2">{prj.title}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">{prj.trlDescription}</p>
                </div>
                <span className="font-mono text-xs font-bold text-slate-400">({prj.id})</span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Hardware / Tech Stack Specifications:
                  </span>
                  <p className="text-slate-700 text-xs mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {prj.hardwareSpecs || 'Industrial Grade Microcontroller with Low-Power Sub-GHz Radios.'}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-1 text-[11px]">
                  <span className="text-slate-500">Facility & Lab:</span>
                  <span className="font-semibold text-slate-800">{prj.labsAndFacilities}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleUpgradeTrl(prj.id)}
                className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Upgrade TRL</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedProject(prj);
                  setIsManageModalOpen(true);
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
              >
                <FlaskConical className="w-3.5 h-3.5 text-slate-500" />
                <span>Inspect Specs</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Manage Modal */}
      <ProjectManageModal
        project={selectedProject}
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false);
          setSelectedProject(null);
        }}
        onUpdateMilestoneStatus={() => {}}
      />
    </div>
  );
};

export default PrototypesEvaluationPanel;
