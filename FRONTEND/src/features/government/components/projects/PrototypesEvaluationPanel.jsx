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
      <div className="space-y-4 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
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
    <div className="space-y-4 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xs shadow-xl border text-xs font-bold flex items-center space-x-2 bg-slate-900 text-white border-slate-800 animate-slideUp">
          <Sparkles className="w-4 h-4 text-emerald-400" /><span>{notification.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xs p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span className="flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-[#007A61]" />
              <span>Projects &amp; Solutions</span>
            </span>
            <span>•</span>
            <span className="text-slate-700">Department of Higher &amp; Technical Education</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            PROTOTYPES &amp; LAB-TO-FIELD TESTING (TRL)
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            State-level engineering verification tracking institutional innovations through 4 TRL phases: Lab Concept ➔ Ground Field ➔ State Certified ➔ Public Deployment.
          </p>
        </div>

        <div className="bg-slate-50 px-4 py-2.5 rounded-xs border border-slate-200 text-center shrink-0">
          <span className="text-2xl font-black text-[#007A61] font-mono block">{prototypeProjects.length}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Prototypes</span>
        </div>
      </div>

      {/* 4 Stage Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stages.map((st) => (
          <div key={st.key} onClick={() => setSelectedTrlFilter(selectedTrlFilter === st.key ? 'All Stages' : st.key)}
            className={`bg-white border rounded-xs p-3.5 shadow-xs space-y-1.5 transition-all cursor-pointer hover:border-slate-300 ${selectedTrlFilter === st.key ? 'ring-2 ring-[#007A61] border-transparent bg-slate-50' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-600">{st.range}</span>
              <span className="text-xs font-bold font-mono text-slate-900">{st.count} Units</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">{st.label}</h4>
          </div>
        ))}
      </div>

      {/* Filter & View Bar */}
      <div className="bg-white p-3.5 rounded-xs border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prototype by name, university, or district..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xs text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#007A61] transition-all" />
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          {['All Stages', 'Stage 1: Lab Concept', 'Stage 2: Field Tested', 'Stage 3: Deployment Ready', 'Stage 4: Public Deployed'].map((s) => (
            <button key={s} type="button" onClick={() => setSelectedTrlFilter(s)}
              className={`px-3 py-1.5 rounded-xs text-[11px] font-bold cursor-pointer transition-all border ${selectedTrlFilter === s ? 'bg-[#007A61] text-white border-[#007A61] shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
              {s.replace('Stage ', 'S').replace(': ', ' - ')}
            </button>
          ))}
          <div className="flex items-center border border-slate-200 rounded-xs p-0.5 bg-slate-100 ml-1">
            <button type="button" onClick={() => setViewMode('list')} title="Table View" className={`p-1.5 rounded-xs transition-all cursor-pointer ${viewMode === 'list' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}><LayoutList className="w-4 h-4" /></button>
            <button type="button" onClick={() => setViewMode('grid')} title="Card View" className={`p-1.5 rounded-xs transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}><LayoutGrid className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'list' ? (
        <PrototypeListingTable projects={filteredProjects} onInspect={(p) => setSelectedProjectForModal(p)} onAdvanceTrl={handleAdvanceTrl} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredProjects.length === 0 ? (
            <div className="col-span-2 bg-white rounded-xs p-12 text-center border border-slate-200 text-slate-400 shadow-xs">No prototypes match the selected filter.</div>
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
