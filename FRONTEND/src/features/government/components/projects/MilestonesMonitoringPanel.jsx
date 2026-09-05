import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldCheck, Search, Info, PlayCircle } from 'lucide-react';
import { ProjectManageModal } from './ProjectManageModal.jsx';
import { MilestoneDeliveryTracker } from './MilestoneDeliveryTracker.jsx';
import { ProjectDeploymentTermsModal } from './ProjectDeploymentTermsModal.jsx';
import { ProjectDeployedSuccessModal } from './ProjectDeployedSuccessModal.jsx';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';
import { apiClient } from '../../../../infrastructure/api/client.js';

export const MilestonesMonitoringPanel = () => {
  const [projects, setProjects] = useState(() => projectCsrSyncService.getActiveProjects());
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState('All Stages');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [notification, setNotification] = useState(null);

  const [selectedProject, setSelectedProject] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const [deployTermsProject, setDeployTermsProject] = useState(null);
  const [isDeployTermsOpen, setIsDeployTermsOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedSuccessProject, setDeployedSuccessProject] = useState(null);

  useEffect(() => {
    const unsubscribe = projectCsrSyncService.subscribe((eventType, data) => {
      if (data?.updatedProjects) setProjects(data.updatedProjects);
    });
    return unsubscribe;
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleVerifyMilestone = (projectId, milestoneId) => {
    setProjects((prev) =>
      prev.map((prj) => {
        if (prj.id === projectId) {
          const updated = (prj.milestones || []).map((m) =>
            m.id === milestoneId ? { ...m, status: 'Completed', progress: 100 } : m
          );
          const completedCount = updated.filter((m) => m.status === 'Completed').length;
          const newProgress = Math.round((completedCount / updated.length) * 100);
          return { ...prj, milestones: updated, progress: newProgress, status: newProgress >= 100 ? 'Completed' : 'In Progress' };
        }
        return prj;
      })
    );
    showToast(`Milestone verified & approved for ${projectId}.`);
  };

  const handleConfirmDeploy = async (prj) => {
    if (!prj) return;
    setIsDeploying(true);
    try {
      const targetId = prj.projectId || prj.id;
      await apiClient.post(`university/projects/${encodeURIComponent(targetId)}/deploy`, {
        pdfUrl: prj.testingReportPdfUrl || prj.pdfUrl,
        pdfName: prj.testingReportPdfName || prj.pdfName || 'Certified_Lab_Report.pdf',
        remarks: 'Publicly deployed by State Government (DHTE) with certified prototype dossier.'
      });

      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === prj.id || p.projectId === targetId) {
            return { ...p, isDeployed: true, status: 'Deployed', stage: 'Deployed to Citizen Registry', progress: 100 };
          }
          return p;
        })
      );
      setIsDeployTermsOpen(false);
      setDeployedSuccessProject(prj);
      showToast(`Project "${prj.title}" officially deployed to Citizen Registry!`);
    } catch (err) {
      showToast('Deployment error: ' + (err.message || 'Failed to deploy'));
    } finally {
      setIsDeploying(false);
    }
  };

  const filteredProjects = (projects || []).filter((p) => {
    const matchQ = !searchQuery.trim() ||
      (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.hei || '').toLowerCase().includes(searchQuery.toLowerCase());
    const isCompleted = p.status === 'Completed' || p.status === 'Deployed' || (p.progress || 0) >= 100;
    if (selectedPhaseFilter === 'Completed' && !isCompleted) return false;
    if (selectedPhaseFilter === 'In Progress' && isCompleted) return false;
    return matchQ;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center space-x-2 bg-slate-900 text-white border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-[#007A61]" />
            <span>State Innovation Governance • Compliance Audit</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">Milestones &amp; Stage Gate Compliance</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time milestone tracking, validation gates, and state deployment authorization</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search active project, HEI, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#007A61] outline-none"
          />
        </div>
        <div className="flex items-center space-x-1.5 self-start sm:self-auto">
          {['All Stages', 'In Progress', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedPhaseFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedPhaseFilter === tab ? 'bg-slate-900 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
          <Info className="w-6 h-6 text-slate-300 mb-2" />
          <span className="font-bold text-slate-700 text-sm">No projects found</span>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <MilestoneDeliveryTracker
              key={project.id}
              project={project}
              isExpanded={expandedProjectId === project.id}
              onToggleExpand={(id) => setExpandedProjectId(expandedProjectId === id ? null : id)}
              onVerifyMilestone={handleVerifyMilestone}
              onOpenDeployTerms={(prj) => { setDeployTermsProject(prj); setIsDeployTermsOpen(true); }}
              onViewDeployedSuccess={(prj) => setDeployedSuccessProject(prj)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ProjectDeploymentTermsModal
        project={deployTermsProject}
        isOpen={isDeployTermsOpen}
        onClose={() => { setIsDeployTermsOpen(false); setDeployTermsProject(null); }}
        onAcceptAndDeploy={handleConfirmDeploy}
        deploying={isDeploying}
      />

      <ProjectDeployedSuccessModal
        project={deployedSuccessProject}
        isOpen={Boolean(deployedSuccessProject)}
        onClose={() => setDeployedSuccessProject(null)}
        onViewCitizenPortal={() => window.open('/citizen', '_blank')}
      />

      <ProjectManageModal
        project={selectedProject}
        isOpen={isManageModalOpen}
        onClose={() => { setIsManageModalOpen(false); setSelectedProject(null); }}
        onUpdateMilestoneStatus={(prjId, mId) => handleVerifyMilestone(prjId, mId)}
      />
    </div>
  );
};

export default MilestonesMonitoringPanel;
