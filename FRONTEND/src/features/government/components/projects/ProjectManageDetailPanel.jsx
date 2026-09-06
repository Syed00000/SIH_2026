import React, { useState } from 'react';
import { Cpu, CheckCircle2, Printer } from 'lucide-react';
import { FullPageDetailPanel } from '../../../../shared/components/layout/FullPageDetailPanel.jsx';
import ProjectCertificateModal from './ProjectCertificateModal.jsx';
import ProjectManageOverviewTab from './ProjectManageOverviewTab.jsx';
import ProjectManageMilestonesTab from './ProjectManageMilestonesTab.jsx';

const PROJECT_MANAGE_TABS = [
  { id: 'overview', label: '1. Overview & Technical Specs', icon: Cpu },
  { id: 'milestones', label: '2. Stage-Gate Milestones', icon: CheckCircle2 }
];

export const ProjectManageDetailPanel = ({
  project,
  onClose,
  onUpdateMilestoneStatus
}) => {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  if (!project) return null;

  const prjId = project.id || 'PRJ-2026';

  return (
    <FullPageDetailPanel
      onBack={onClose}
      backLabel="Back to Milestones Monitoring Queue"
      breadcrumbs={['Government Portal', 'Milestones & Delivery', prjId]}
      idBadge={prjId}
      statusBadge={
        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
            project.deploymentStatus?.includes('Validated')
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-slate-100 text-slate-800 border-slate-300'
          }`}
        >
          {project.deploymentStatus || 'Under Review'}
        </span>
      }
      title={project.title}
      subtitle={`${project.sector || 'State Innovation'} · ${project.district || 'Jharkhand'} District · Institutional Project Tracking`}
      headerActions={
        <button
          type="button"
          onClick={() => setIsCertificateOpen(true)}
          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <Printer className="w-3.5 h-3.5 text-emerald-300" />
          <span>Print State Certificate</span>
        </button>
      }
      tabs={PROJECT_MANAGE_TABS}
      activeTab={activeSubTab}
      onTabChange={(id) => setActiveSubTab(id)}
      stickyFooter={
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            ← Back to Milestones Queue
          </button>
          <button
            type="button"
            onClick={() => setIsCertificateOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-300" />
            <span>Generate &amp; Print Certificate</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {activeSubTab === 'overview' && (
          <ProjectManageOverviewTab
            project={project}
            onOpenCertificate={() => setIsCertificateOpen(true)}
          />
        )}

        {activeSubTab === 'milestones' && (
          <ProjectManageMilestonesTab
            project={project}
            onUpdateMilestoneStatus={onUpdateMilestoneStatus}
          />
        )}
      </div>

      <ProjectCertificateModal
        project={project}
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />
    </FullPageDetailPanel>
  );
};

export default ProjectManageDetailPanel;
