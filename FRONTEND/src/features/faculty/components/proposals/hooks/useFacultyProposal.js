import { useState, useEffect } from 'react';
import { ROADMAP_PRESETS } from '../presets/proposalPresets.js';
import { saveProposalDraft, submitProposalFinal } from '../services/proposalSubmit.helper.js';

export const useFacultyProposal = ({ projects = [], onRefresh, initialProjectId = null }) => {
  const [selectedProjectId, setSelectedProjectId] = useState(
    initialProjectId || projects[0]?.projectId || projects[0]?.challengeId || ''
  );

  const currentProject = projects.find(
    (p) => p.projectId === selectedProjectId || p.challengeId === selectedProjectId
  ) || projects[0];

  const [methodology, setMethodology] = useState(
    currentProject?.methodology ||
      'Multi-stage sensor calibration and low-power telemetry rig utilizing solar energy harvesting and real-time cloud data push to JoharSetu state server.'
  );

  const [milestoneStages, setMilestoneStages] = useState(
    Array.isArray(currentProject?.milestoneRoadmap) && currentProject.milestoneRoadmap.length > 0
      ? currentProject.milestoneRoadmap
      : ROADMAP_PRESETS[0].stages
  );

  const [budgetItems, setBudgetItems] = useState([
    { id: 'item-1', title: 'Field Telemetry Sensors & Hardware Modules', amount: 35000 },
    { id: 'item-2', title: 'Lab Fabrication, 3D Casing & PCB Prototyping', amount: 20000 },
    { id: 'item-3', title: 'District Field Trials & On-Ground Calibration', amount: 15000 },
    { id: 'item-4', title: 'Student Research Fellowship & Institutional Overhead', amount: 10000 }
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftSavedSuccess, setDraftSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentProject) {
      if (currentProject.methodology) setMethodology(currentProject.methodology);
      if (Array.isArray(currentProject.milestoneRoadmap) && currentProject.milestoneRoadmap.length > 0) {
        setMilestoneStages(currentProject.milestoneRoadmap);
      }
      if (Array.isArray(currentProject.budgetBreakdown) && currentProject.budgetBreakdown.length > 0) {
        setBudgetItems(
          currentProject.budgetBreakdown.map((b, idx) => ({
            id: `item-${idx}-${Date.now()}`,
            title: b.category || b.title || 'Budget Item',
            amount: typeof b.amount === 'number' ? b.amount : Number((b.amount || '').replace(/[^0-9]/g, '')) || 10000
          }))
        );
      }
    }
  }, [currentProject?.projectId, currentProject?.budgetStatus, currentProject?.adminRemarks, currentProject?.governmentRemarks]);

  const totalCalculatedBudget = budgetItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const handleSaveDraft = async () => {
    if (!currentProject) return;
    setSavingDraft(true);
    try {
      await saveProposalDraft({ currentProject, totalCalculatedBudget, budgetItems, methodology, milestoneStages });
      setDraftSavedSuccess(true);
      if (onRefresh) await onRefresh();
      setTimeout(() => setDraftSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Draft save failed:', err);
    } finally {
      setSavingDraft(false);
    }
  };

  const handleAddItem = () => setBudgetItems([...budgetItems, { id: `item-${Date.now()}`, title: '', amount: 5000 }]);
  const handleQuickAdd = (preset) => setBudgetItems([...budgetItems, { id: `item-${Date.now()}`, title: preset.title, amount: preset.amount }]);
  const handleRemoveItem = (id) => budgetItems.length > 1 && setBudgetItems(budgetItems.filter((i) => i.id !== id));
  const handleUpdateItem = (id, field, value) => {
    setBudgetItems(budgetItems.map((i) => (i.id === id ? { ...i, [field]: field === 'amount' ? Number(value) || 0 : value } : i)));
  };
  const handleUpdateStage = (idx, field, value) => {
    const updated = [...milestoneStages];
    updated[idx] = { ...updated[idx], [field]: value };
    setMilestoneStages(updated);
  };

  const handleSubmitProposal = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!currentProject) return;
    setSubmitting(true);
    try {
      await submitProposalFinal({ currentProject, totalCalculatedBudget, budgetItems, methodology, milestoneStages });
      setSubmittedSuccess(true);
      if (onRefresh) await onRefresh();
      setTimeout(() => setSubmittedSuccess(false), 3500);
    } catch (err) {
      console.error('Proposal submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return {
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
  };
};

export default useFacultyProposal;
