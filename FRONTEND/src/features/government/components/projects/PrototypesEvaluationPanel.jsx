import React, { useState, useEffect, useMemo } from 'react';
import { Cpu, Search, Sparkles, LayoutList, LayoutGrid } from 'lucide-react';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';
import { InspectPrototypeDetailPanel } from './InspectPrototypeDetailPanel.jsx';
import { PrototypeInteractiveCard } from './PrototypeInteractiveCard.jsx';
import { PrototypeListingTable } from './PrototypeListingTable.jsx';
import { PrototypeDeploymentTermsModal } from './PrototypeDeploymentTermsModal.jsx';
import { universityApiService } from '../../../university/services/universityApiService.js';

export const PrototypesEvaluationPanel = () => {
  const [projects, setProjects] = useState(() => projectCsrSyncService.getActiveProjects());
  const [selectedTrlFilter, setSelectedTrlFilter] = useState('All Stages');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [selectedProjectForModal, setSelectedProjectForModal] = useState(null);
  const [selectedProjectForTermsModal, setSelectedProjectForTermsModal] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    projectCsrSyncService.initializeFromBackend().then(() => setProjects(projectCsrSyncService.getActiveProjects()));
    return projectCsrSyncService.subscribe((_, data) => { if (data?.updatedProjects) setProjects(data.updatedProjects); });
  }, []);

  const prototypeProjects = useMemo(() => projects.filter((p) => {
    const isProtoSent = Boolean(p.prototypeSentToGovernment || p.isPrototypeSentToGov);
    const isProtoApproved = (p.prototypeStatus === 'Approved' || p.prototypeStatus === 'Ready for Deployment') && isProtoSent;
    const isDeployed = p.status === 'Deployed' || Boolean(p.isDeployed);
    return isProtoSent || isProtoApproved || isDeployed;
  }), [projects]);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAdvanceTrl = async (projectId) => {
    const proj = projects.find((p) => p.id === projectId || p.projectId === projectId);
    const curNum = parseInt(String(proj?.trlLevel || '4').replace('TRL-', ''), 10) || 4;
    const nextTrl = `TRL-${Math.min(9, curNum + 1)}`;
    try {
      await universityApiService.updateGovernmentPrototypeStatus(projectId, 'Approved', nextTrl, 'Prototype approved & advanced by State Innovation Committee.');
    } catch (e) { console.warn('Backend prototype update sync error:', e); }
    const updated = projectCsrSyncService.advancePrototypeTrl(projectId);
    setProjects(updated);
    showToast(`Prototype verified & advanced to ${nextTrl} successfully!`);
  };

  const filteredProjects = prototypeProjects.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const match = !q || p.title?.toLowerCase().includes(q) || p.id?.toLowerCase().includes(q) || p.hei?.toLowerCase().includes(q) || p.district?.toLowerCase().includes(q);
    const n = parseInt(String(p.trlLevel || 'TRL-4').replace('TRL-', ''), 10) || 4;
    const matchTrl = selectedTrlFilter === 'All Stages' ||
      (selectedTrlFilter === 'Stage 1: Lab Concept' && n <= 3) ||
      (selectedTrlFilter === 'Stage 2: Field Tested' && n >= 4 && n <= 6) ||
      (selectedTrlFilter === 'Stage 3: Deployment Ready' && n >= 7 && n <= 8) ||
      (selectedTrlFilter === 'Stage 4: Public Deployed' && n >= 9);
    return match && matchTrl;
  });

  const stages = [
    { key: 'Stage 1: Lab Concept', label: '1. Lab Concept', range: 'TRL 1-3', count: prototypeProjects.filter(p => (parseInt(String(p.trlLevel || '4').replace('TRL-', ''), 10) || 4) <= 3).length },
    { key: 'Stage 2: Field Tested', label: '2. Field Tested', range: 'TRL 4-6', count: prototypeProjects.filter(p => { const n = parseInt(String(p.trlLevel || '4').replace('TRL-', ''), 10) || 4; return n >= 4 && n <= 6; }).length },
    { key: 'Stage 3: Deployment Ready', label: '3. State Certified', range: 'TRL 7-8', count: prototypeProjects.filter(p => { const n = parseInt(String(p.trlLevel || '4').replace('TRL-', ''), 10) || 4; return n >= 7 && n <= 8; }).length },
    { key: 'Stage 4: Public Deployed', label: '4. Public Deployed', range: 'TRL 9', count: prototypeProjects.filter(p => (parseInt(String(p.trlLevel || '4').replace('TRL-', ''), 10) || 4) >= 9).length }
  ];

  if (selectedProjectForModal) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
        <InspectPrototypeDetailPanel
          project={selectedProjectForModal}
          onClose={() => setSelectedProjectForModal(null)}
          onOpenDeployTerms={(p) => setSelectedProjectForTermsModal(p)}
          onAdvanceStage={handleAdvanceTrl}
        />
        <PrototypeDeploymentTermsModal
          isOpen={Boolean(selectedProjectForTermsModal)}
          onClose={() => setSelectedProjectForTermsModal(null)}
          project={selectedProjectForTermsModal}
          onDeploySuccess={(pId) => {
            const updated = projectCsrSyncService.deployPrototype(pId);
            setProjects(updated);
            const found = updated.find(x => x.id === pId || x.projectId === pId || x.challengeId === pId);
            if (found) setSelectedProjectForModal(found);
            showToast('Prototype Deployed & Citizen Alert Dispatched!');
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-bold flex items-center space-x-2 bg-slate-900 text-white border-slate-800 animate-slideUp">
          <Sparkles className="w-4 h-4 text-emerald-400" /><span>{notification.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Live State Prototype Registry</span>
              <span className="text-xs text-slate-400">· Department of Higher & Technical Education</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center space-x-2">
              <Cpu className="w-6 h-6 text-emerald-400" /><span>PROTOTYPES & LAB-TO-FIELD TESTING (TRL)</span>
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">State-level engineering verification tracking prototypes through 4 TRL phases: College Lab ➔ Ground Field ➔ State Certified ➔ Public Deployment.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center shrink-0">
            <span className="text-2xl font-black text-emerald-400 font-mono block">{prototypeProjects.length}</span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Active Prototypes</span>
          </div>
        </div>
      </div>

      {/* 4 Stage Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stages.map((st) => (
          <div key={st.key} onClick={() => setSelectedTrlFilter(selectedTrlFilter === st.key ? 'All Stages' : st.key)}
            className={`bg-white border rounded-xl p-3.5 shadow-2xs space-y-1.5 transition-all cursor-pointer hover:shadow-xs ${selectedTrlFilter === st.key ? 'ring-2 ring-slate-900 border-transparent bg-slate-50' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-600">{st.range}</span>
              <span className="text-xs font-black font-mono text-slate-900">{st.count} Units</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">{st.label}</h4>
          </div>
        ))}
      </div>

      {/* Filter & View Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prototype by name, university, or district..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all" />
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          {['All Stages', 'Stage 1: Lab Concept', 'Stage 2: Field Tested', 'Stage 3: Deployment Ready', 'Stage 4: Public Deployed'].map((s) => (
            <button key={s} type="button" onClick={() => setSelectedTrlFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all ${selectedTrlFilter === s ? 'bg-slate-900 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {s.replace('Stage ', 'S').replace(': ', ' - ')}
            </button>
          ))}
          <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-100 ml-1">
            <button type="button" onClick={() => setViewMode('list')} title="Table Listing View" className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'list' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}><LayoutList className="w-4 h-4" /></button>
            <button type="button" onClick={() => setViewMode('grid')} title="Card Grid View" className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}><LayoutGrid className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Main Content: Listing Table or Card Grid */}
      {viewMode === 'list' ? (
        <PrototypeListingTable projects={filteredProjects} onInspect={(p) => setSelectedProjectForModal(p)} onAdvanceTrl={handleAdvanceTrl} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.length === 0 ? (
            <div className="col-span-2 bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">No prototypes match the selected filter.</div>
          ) : (
            filteredProjects.map((prj) => (
              <PrototypeInteractiveCard key={prj.id} project={prj} onInspect={(p) => setSelectedProjectForModal(p)} onAdvanceTrl={handleAdvanceTrl} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PrototypesEvaluationPanel;
