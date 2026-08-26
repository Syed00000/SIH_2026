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
  Search,
  RotateCcw,
  ShieldCheck,
  Award,
  Layers,
  MapPin,
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';

import { INITIAL_ACTIVE_PROJECTS } from '../../data/projectsSolutionsData.js';

export const PrototypesEvaluationPanel = () => {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('joharsetu_active_projects');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ACTIVE_PROJECTS;
  });

  const [selectedTrlFilter, setSelectedTrlFilter] = useState('All Stages');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All Types');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const saveProjects = (updated) => {
    setProjects(updated);
    try {
      localStorage.setItem('joharsetu_active_projects', JSON.stringify(updated));
    } catch {}
  };

  // Human friendly TRL Stage classification
  const getTrlStageInfo = (trlStr) => {
    const num = parseInt(trlStr?.replace('TRL-', '') || '4', 10);
    if (num <= 3) {
      return {
        stage: 'Stage 1: Lab Concept & Design',
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        desc: 'Initial lab model under fabrication and testing'
      };
    }
    if (num <= 6) {
      return {
        stage: 'Stage 2: Working Field Prototype',
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        desc: 'Working physical device tested in real ground conditions'
      };
    }
    if (num <= 8) {
      return {
        stage: 'Stage 3: State Deployment Ready',
        color: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
        desc: 'Proven & certified for district-wide rollout'
      };
    }
    return {
      stage: 'Stage 4: Public Operation',
      color: 'bg-slate-900 text-white border-slate-900',
      desc: 'Scaled across Jharkhand districts'
    };
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hei.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hardwareSpecs?.toLowerCase().includes(searchQuery.toLowerCase());

    const num = parseInt(p.trlLevel?.replace('TRL-', '') || '4', 10);

    const matchesTrl =
      selectedTrlFilter === 'All Stages' ||
      (selectedTrlFilter === 'Stage 1: Lab Concept' && num <= 3) ||
      (selectedTrlFilter === 'Stage 2: Field Tested' && num >= 4 && num <= 6) ||
      (selectedTrlFilter === 'Stage 3: Deployment Ready' && num >= 7);

    const matchesType =
      selectedTypeFilter === 'All Types' || p.prototypeType === selectedTypeFilter;

    return matchesSearch && matchesTrl && matchesType;
  });

  const handleUpgradeTrl = (projectId) => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const currentNum = parseInt(p.trlLevel?.replace('TRL-', '') || '4', 10);
        const nextNum = Math.min(9, currentNum + 1);
        return {
          ...p,
          trlLevel: `TRL-${nextNum}`,
          trlDescription: `Advanced to TRL-${nextNum} validated through field testing and NABL verification.`
        };
      }
      return p;
    });

    saveProjects(updated);
    showToast(`Prototype for ${projectId} upgraded to next readiness stage.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-bold flex items-center space-x-2 bg-slate-900 text-white border-slate-800 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span className="flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <span>Projects & Solutions</span>
            </span>
            <span>•</span>
            <span className="text-slate-700">Prototype Testing & Readiness</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            PROTOTYPES & TESTING EVALUATION
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Monitor physical device hardware, software apps, and field testing progress across Jharkhand
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
          {projects.length} Working Prototypes in Pipeline
        </span>
      </div>

      {/* Meaningful 4-Stage Readiness Ladder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Stage 1 (TRL 1-3)
            </span>
            <span className="text-xs font-bold text-slate-900">
              {projects.filter((p) => parseInt(p.trlLevel?.replace('TRL-', '') || '4', 10) <= 3).length} Units
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 pt-1">Lab Concept & Fabrication</h4>
          <p className="text-[11px] text-slate-500">Initial design and prototype construction in university labs</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Stage 2 (TRL 4-6)
            </span>
            <span className="text-xs font-bold text-slate-900">
              {projects.filter((p) => {
                const n = parseInt(p.trlLevel?.replace('TRL-', '') || '4', 10);
                return n >= 4 && n <= 6;
              }).length} Units
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 pt-1">Field Tested in Ground</h4>
          <p className="text-[11px] text-slate-500">Physical machines tested in real villages, mines, and rivers</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
              Stage 3 (TRL 7-8)
            </span>
            <span className="text-xs font-bold text-slate-900">
              {projects.filter((p) => {
                const n = parseInt(p.trlLevel?.replace('TRL-', '') || '4', 10);
                return n >= 7 && n <= 8;
              }).length} Units
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 pt-1">Ready for State Rollout</h4>
          <p className="text-[11px] text-slate-500">Certified by NABL labs, ready for district administration handover</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
              Stage 4 (TRL 9)
            </span>
            <span className="text-xs font-bold text-slate-900">
              {projects.filter((p) => parseInt(p.trlLevel?.replace('TRL-', '') || '4', 10) >= 9).length} Units
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 pt-1">Fully Scaled & Operational</h4>
          <p className="text-[11px] text-slate-500">Operating publicly across Jharkhand with citizen impact</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prototype name, specifications, university..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:outline-hidden"
          />
        </div>

        <div className="w-full md:w-56">
          <select
            value={selectedTrlFilter}
            onChange={(e) => setSelectedTrlFilter(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
          >
            <option value="All Stages">All Readiness Stages</option>
            <option value="Stage 1: Lab Concept">Stage 1: Lab Concept (TRL 1-3)</option>
            <option value="Stage 2: Field Tested">Stage 2: Field Tested (TRL 4-6)</option>
            <option value="Stage 3: Deployment Ready">Stage 3: Deployment Ready (TRL 7+)</option>
          </select>
        </div>

        <div className="w-full md:w-48">
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
          >
            <option value="All Types">All Device Types</option>
            <option value="Hardware">Physical Hardware Device</option>
            <option value="Software">Software & Cloud App</option>
            <option value="Hybrid">Hybrid (Hardware + AI)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setSearchQuery('');
            setSelectedTrlFilter('All Stages');
            setSelectedTypeFilter('All Types');
          }}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
          title="Reset Filters"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Prototype Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((p) => {
          const stageInfo = getTrlStageInfo(p.trlLevel);

          return (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Card Top Strip */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-black bg-slate-900 text-white">
                        {p.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {p.prototypeType}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${stageInfo.color}`}>
                        {p.trlLevel} ({stageInfo.stage.split(':')[0]})
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-2">{p.title}</h3>
                  </div>
                </div>

                {/* Location Mapping Mini-Box */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span><strong>Problem Area:</strong> {p.problemOrigin || `${p.district} Ground Area`}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span><strong>Testing Site:</strong> {p.activeWorkSite || `${p.hei} Campus Lab`}</span>
                  </div>
                </div>

                {/* System Specs in Simple Words */}
                <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">What this device does:</span>
                  <p className="leading-relaxed font-medium text-slate-800">
                    {p.hardwareSpecs || 'Integrated embedded microcontroller with local processing and emergency alert display.'}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium">{p.teamLead}</span>

                <button
                  type="button"
                  onClick={() => handleUpgradeTrl(p.id)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
                >
                  <span>Advance Readiness (+1 TRL)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrototypesEvaluationPanel;
