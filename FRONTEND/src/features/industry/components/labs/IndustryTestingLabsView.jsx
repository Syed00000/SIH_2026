import React, { useState } from 'react';
import { FlaskConical, Building2, Search, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { universityApiService } from '../../../university/services/universityApiService.js';
import { IndustryTestingDetailPanel } from './IndustryTestingDetailPanel.jsx';

export const IndustryTestingLabsView = ({ projects = {} }) => {
  const activeProjects = (projects?.ongoing || []).filter(
    (p) => (!p.labChargesQuoted || p.quoteStatus === 'Accepted') &&
      Boolean(p.labAccessRequested === true && p.collaborationPurpose !== 'Mentorship' && p.purpose !== 'Mentorship')
  );
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [stagesState, setStagesState] = useState({});
  const [savingStage, setSavingStage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const currentProject = activeProjects.find((p) => (p.id || p.projectId) === selectedProjectId);

  const defaultStages = [
    { stageNumber: 1, title: 'Sample Intake & Calibration', description: 'Sample intake validation and spectrometer baseline calibration.', expectedDays: '5 Days', status: 'In Progress', notes: '' },
    { stageNumber: 2, title: 'Material & Stress Testing', description: 'High-temperature variance, load bearing and sensor verification.', expectedDays: '10 Days', status: 'Pending', notes: '' },
    { stageNumber: 3, title: 'Certified Compliance & Report', description: 'Standardized testing certification and final analysis dossier.', expectedDays: '7 Days', status: 'Pending', notes: '' }
  ];

  const currentStages = currentProject ? (stagesState[currentProject.id] || (currentProject.testingStages?.length ? currentProject.testingStages : defaultStages)) : [];
  const allStagesCompleted = currentStages.length > 0 && currentStages.every((s) => s.status === 'Completed');

  const handleUpdateStage = async (stageIdx, newStatus, newNotes = null) => {
    if (!currentProject) return;
    const updated = currentStages.map((s, idx) => {
      if (idx === stageIdx) {
        return { ...s, status: newStatus, notes: newNotes !== null ? newNotes : (s.notes || ''), updatedAt: new Date() };
      }
      return s;
    });

    setStagesState((prev) => ({ ...prev, [currentProject.id]: updated }));
    setSavingStage(true);
    try {
      const targetId = currentProject.requestId || currentProject.id;
      const targetCode = currentProject.universityCode || 'RU001';
      await universityApiService.updateIndustryRequestStatus(targetId, 'Approved', targetCode, {
        testingStages: updated
      });
    } catch (err) {
      console.error('Failed to sync stage update:', err);
    } finally {
      setSavingStage(false);
    }
  };

  if (selectedProjectId && currentProject) {
    return (
      <IndustryTestingDetailPanel
        project={currentProject}
        stages={currentStages}
        onBack={() => setSelectedProjectId(null)}
        onUpdateStage={handleUpdateStage}
        savingStage={savingStage}
        allStagesCompleted={allStagesCompleted}
      />
    );
  }

  const filtered = activeProjects.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      (p.title || '').toLowerCase().includes(term) ||
      (p.problemStatement || '').toLowerCase().includes(term) ||
      (p.university || '').toLowerCase().includes(term) ||
      (p.district || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4 select-none text-left animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 flex items-center justify-center shrink-0">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Industry R&amp;D Facility
              </span>
              <span className="text-xs font-mono text-slate-500">{activeProjects.length} Active Testing Engagements</span>
            </div>
            <h2 className="text-base font-black text-slate-900 mt-0.5">Laboratory Testing &amp; Staged Validation</h2>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search problems, HEIs, districts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Problem Statements Listing */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Problem Statements &amp; Research Questions Undergoing Testing ({filtered.length})
          </h3>
          <span className="text-[11px] font-semibold text-slate-500">Click any problem statement to open detail panel</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs flex flex-col items-center justify-center space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div className="font-extrabold text-slate-800 text-sm">No Problems Undergoing Laboratory Testing</div>
            <p className="max-w-md text-slate-500 text-xs leading-relaxed">
              Mentorship-focused problems are routed to <strong>Experts &amp; Engineers</strong>. Only projects requiring laboratory apparatus testing appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((p, idx) => {
              const pId = p.id || p.projectId || p.requestId;
              const pStages = stagesState[pId] || (p.testingStages?.length ? p.testingStages : defaultStages);
              const pCompleted = pStages.filter((s) => s.status === 'Completed').length;
              const pPercent = Math.round((pCompleted / (pStages.length || 1)) * 100);

              return (
                <div
                  key={pId || idx}
                  onClick={() => setSelectedProjectId(pId)}
                  className="p-4 sm:p-5 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        {p.challengeId || pId}
                      </span>
                      <span className="text-xs font-bold text-slate-700 flex items-center">
                        <Building2 className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        {p.university || 'State University'}
                      </span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-xs font-medium text-slate-500">
                        {p.district || p.location?.district || 'Jharkhand'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Fee: {p.labChargesQuoted || '₹ 25,000'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                      {p.problemStatement || p.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-1 font-medium">
                      Project: {p.title} · Mentor: {p.leadMentor || 'Faculty Nodal Officer'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0 sm:self-center">
                    <div className="text-right space-y-1">
                      <span className="text-xs font-black text-slate-900 block font-mono">{pPercent}% Completed</span>
                      <span className="text-[10px] font-semibold text-slate-500 block">{pCompleted} of {pStages.length} Stages</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProjectId(pId);
                      }}
                      className="px-3.5 py-2 bg-slate-900 group-hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <span>Inspect Protocol</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustryTestingLabsView;
