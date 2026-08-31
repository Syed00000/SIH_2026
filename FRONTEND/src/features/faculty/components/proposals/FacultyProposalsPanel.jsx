import React from 'react';
import { useFacultyProposal } from './hooks/useFacultyProposal.js';
import { ProposalHeader } from './components/ProposalHeader.jsx';
import { ProblemBriefAndFeedback } from './components/ProblemBriefAndFeedback.jsx';
import { MilestoneRoadmapBuilder } from './components/MilestoneRoadmapBuilder.jsx';
import { LineItemBudgetSection } from './components/LineItemBudgetSection.jsx';
import { ProposalGovernanceSidebar } from './components/ProposalGovernanceSidebar.jsx';
import { ProposalFormActions } from './components/ProposalFormActions.jsx';

export const FacultyProposalsPanel = ({
  faculty = {},
  projects = [],
  onRefresh,
  initialProjectId = null,
  hideHeader = false
}) => {
  const {
    selectedProjectId,
    setSelectedProjectId,
    currentProject,
    methodology,
    setMethodology,
    milestoneStages,
    setMilestoneStages,
    budgetItems,
    totalCalculatedBudget,
    submitting,
    submittedSuccess,
    savingDraft,
    draftSavedSuccess,
    handleSaveDraft,
    handleAddItem,
    handleQuickAdd,
    handleRemoveItem,
    handleUpdateItem,
    handleUpdateStage,
    handleSubmitProposal
  } = useFacultyProposal({ projects, onRefresh, initialProjectId });

  return (
    <div className={`space-y-4 max-w-7xl mx-auto select-none ${hideHeader ? '' : 'pb-12'}`}>
      {!hideHeader && <ProposalHeader faculty={faculty} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className={hideHeader ? 'lg:col-span-3 space-y-4' : 'lg:col-span-2 space-y-4'}>
          <form onSubmit={handleSubmitProposal} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <ProblemBriefAndFeedback
              projects={projects}
              currentProject={currentProject}
              selectedProjectId={selectedProjectId}
              onProjectSelect={setSelectedProjectId}
              hideHeader={hideHeader}
            />

            <div>
              <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                Technical Methodology & Research Plan *
              </label>
              <textarea
                rows={4}
                required
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                placeholder="Detail scientific approach, sensor architecture, lab prototyping phases, and field testing protocol..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white transition-all shadow-2xs leading-relaxed"
              />
            </div>

            <MilestoneRoadmapBuilder
              milestoneStages={milestoneStages}
              onUpdateStage={handleUpdateStage}
              onApplyPreset={setMilestoneStages}
            />

            <LineItemBudgetSection
              budgetItems={budgetItems}
              totalCalculatedBudget={totalCalculatedBudget}
              onAddItem={handleAddItem}
              onQuickAdd={handleQuickAdd}
              onRemoveItem={handleRemoveItem}
              onUpdateItem={handleUpdateItem}
            />

            <ProposalFormActions
              faculty={faculty}
              currentProject={currentProject}
              savingDraft={savingDraft}
              draftSavedSuccess={draftSavedSuccess}
              submitting={submitting}
              submittedSuccess={submittedSuccess}
              onSaveDraft={handleSaveDraft}
            />
          </form>
        </div>

        {!hideHeader && (
          <ProposalGovernanceSidebar
            currentProject={currentProject}
            totalCalculatedBudget={totalCalculatedBudget}
          />
        )}
      </div>
    </div>
  );
};

export default FacultyProposalsPanel;
