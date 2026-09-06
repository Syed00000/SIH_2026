import React from 'react';
import { Building2, MapPin, FlaskConical, FileText, ExternalLink, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { FullPageDetailPanel } from '../../../../shared/components/layout/FullPageDetailPanel.jsx';
import { getPdfViewUrl } from '../../../../shared/utils/openPdf.js';
import { IndustryTestingReportUploadCard } from './IndustryTestingReportUploadCard.jsx';
import { IndustryTestingWorkflowSteps } from './IndustryTestingWorkflowSteps.jsx';

export const IndustryTestingDetailPanel = ({
  project,
  stages = [],
  onBack,
  onUpdateStage,
  savingStage = false,
  allStagesCompleted = false,
  onDossierSubmitted
}) => {
  if (!project) return null;

  const projectId = project.id || project.projectId || project.requestId || 'PRJ-TEST-001';
  const district = project.district || project.location?.district || 'Jharkhand';
  const university = project.university || project.institutionName || 'State University';
  const labCharges = project.labChargesQuoted || project.testingLabFee || '₹ 25,000';

  const isDeployed = Boolean(project.isDeployed || project.governmentStatus === 'Approved' || project.trlLevel === 'TRL-9' || project.status === 'Completed');
  const completedStages = stages.filter((s) => s.status === 'Completed').length;
  const progressPercent = Math.round((completedStages / (stages.length || 1)) * 100);
  const overallStatus = isDeployed ? '✓ Deployed by Government (TRL-9) · Locked' : allStagesCompleted ? 'Testing Certified' : completedStages > 0 ? 'In Progress' : 'Pending Intake';

  return (
    <FullPageDetailPanel
      onBack={onBack}
      backLabel="Back to Testing & Labs Listing"
      breadcrumbs={['Industry Portal', 'Testing & Research Labs', projectId]}
      idBadge={projectId}
      statusBadge={
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border flex items-center space-x-1 ${
          isDeployed || allStagesCompleted
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
            : 'bg-blue-50 text-blue-800 border-blue-200'
        }`}>
          {isDeployed && <Lock className="w-3 h-3 text-emerald-700" />}
          <span>{overallStatus}</span>
        </span>
      }
      title={project.title}
      subtitle={`University: ${university} · District: ${district} · Testing Facility: State Accredited Industry R&D Lab`}
      stickyFooter={
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            ← Back to Testing &amp; Labs Queue
          </button>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
            <span className="text-slate-500 font-medium">Overall Progress:</span>
            <span className="font-mono text-slate-900 font-black">{progressPercent}%</span>
            <span className="text-slate-400">•</span>
            <span className="text-emerald-700 font-bold">{completedStages} of {stages.length} Stages Passed</span>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT / MAIN AREA (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* 1. Problem Statement / Question Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Selected Problem Statement &amp; Scope
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                Ref: {project.challengeId || projectId}
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-900 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
              "{project.problemStatement || project.title}"
            </p>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase block">University / HEI</span>
                <span className="font-bold text-slate-800 mt-0.5 flex items-center truncate">
                  <Building2 className="w-3.5 h-3.5 mr-1 text-slate-600 shrink-0" />
                  {university}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase block">District</span>
                <span className="font-bold text-slate-800 mt-0.5 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-600 shrink-0" />
                  {district}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Testing Lab Commitment</span>
                <span className="font-black text-emerald-800 mt-0.5 block truncate">
                  {labCharges}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Overall Testing Progress & Summary */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                <FlaskConical className="w-4 h-4 text-slate-700" />
                <span>Overall Testing Progress &amp; Status</span>
              </h4>
              <span className="text-sm font-black text-slate-900 font-mono">{progressPercent}%</span>
            </div>

            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-900 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium">
                {completedStages} of {stages.length} validation milestones completed
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                allStagesCompleted
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {overallStatus}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600 leading-relaxed font-medium">
              <strong>Testing Summary:</strong> {allStagesCompleted
                ? 'All testing stages passed. Certified laboratory analysis report is ready for final submission and validation.'
                : 'Prototype is undergoing sequential physical stress testing, sensor verification, and chemical analysis at the industrial laboratory facility.'}
            </div>
          </div>

          {/* 3. PDF / Testing Reports & Technical Documents */}
          <div className="space-y-3">
            {project.pdfUrl && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{project.pdfName || 'Verified_Blueprint.pdf'}</h5>
                    <p className="text-[10px] text-emerald-700 font-semibold">✓ Verified Technical Prototype Specification</p>
                  </div>
                </div>
                <a
                  href={getPdfViewUrl(project.pdfUrl, project.pdfName || 'Verified_Blueprint.pdf')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors"
                >
                  <span>View PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Existing Certified Lab Report Upload Card */}
            <IndustryTestingReportUploadCard
              project={project}
              stages={stages}
              allStagesCompleted={allStagesCompleted}
              onDossierSubmitted={onDossierSubmitted}
            />
          </div>
        </div>

        {/* RIGHT AREA: Complete Testing Workflow / Steps (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <IndustryTestingWorkflowSteps
            stages={stages}
            onUpdateStage={onUpdateStage}
            savingStage={savingStage}
          />
        </div>
      </div>
    </FullPageDetailPanel>
  );
};

export default IndustryTestingDetailPanel;
