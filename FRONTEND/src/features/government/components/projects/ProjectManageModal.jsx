import React, { useState } from 'react';
import { X, Cpu, CheckCircle2, Printer } from 'lucide-react';
import ProjectCertificateModal from './ProjectCertificateModal.jsx';
import ProjectManageOverviewTab from './ProjectManageOverviewTab.jsx';
import ProjectManageMilestonesTab from './ProjectManageMilestonesTab.jsx';

export const ProjectManageModal = ({
  project,
  isOpen,
  onClose,
  onUpdateMilestoneStatus
}) => {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Top Header Bar */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/80">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black bg-slate-900 text-white">
                {project.id}
              </span>
              <span className="text-xs font-bold text-slate-500">{project.sector}</span>
              <span>•</span>
              <span className="font-semibold text-xs text-slate-700">{project.district} District</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  project.deploymentStatus?.includes('Validated')
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {project.deploymentStatus}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">{project.title}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 flex items-center space-x-6 bg-white overflow-x-auto">
          {[
            { id: 'overview', label: '1. Overview & Hardware Specs', icon: Cpu },
            { id: 'milestones', label: '2. Stage-Gate Milestones', icon: CheckCircle2 }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`py-3.5 border-b-2 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <TabIcon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body Canvas */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs bg-slate-50/40">
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

        {/* Modal Bottom Action Bar */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-white">
          <button
            type="button"
            onClick={() => setIsCertificateOpen(true)}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print State Certificate</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>

      <ProjectCertificateModal
        project={project}
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />
    </div>
  );
};

export default ProjectManageModal;
