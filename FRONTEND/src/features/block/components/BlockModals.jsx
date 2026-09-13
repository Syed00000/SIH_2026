import React from 'react';
import { BlockIssueDetailModal } from './BlockIssueDetailModal.jsx';
import { BlockAssignToDeptModal } from './BlockAssignToDeptModal.jsx';
import { AddBlockDepartmentModal } from './AddBlockDepartmentModal.jsx';
import { ViewBlockDepartmentModal } from './ViewBlockDepartmentModal.jsx';
import { EditBlockDepartmentModal } from './EditBlockDepartmentModal.jsx';
import { BlockAddWardModal } from './BlockAddWardModal.jsx';
import { WardCredentialsSuccessModal } from './WardCredentialsSuccessModal.jsx';
import { AddTechnicianModal } from '../../department/components/AddTechnicianModal.jsx';
import { ViewTechnicianModal } from '../../department/components/ViewTechnicianModal.jsx';
import { EditTechnicianModal } from '../../department/components/EditTechnicianModal.jsx';

export const BlockModals = ({
  block,
  departments,
  selectedProblem,
  setSelectedProblem,
  handleUpdateProblem,
  assigningProblem,
  setAssigningProblem,
  isAddDeptOpen,
  setIsAddDeptOpen,
  handleCreatedDept,
  viewingDept,
  setViewingDept,
  editingDept,
  setEditingDept,
  handleUpdatedDept,
  isAddWardOpen,
  setIsAddWardOpen,
  handleWardCreated,
  createdWardCreds,
  setCreatedWardCreds,
  isAddTechOpen,
  setIsAddTechOpen,
  handleCreatedTech,
  viewingTech,
  setViewingTech,
  editingTech,
  setEditingTech,
  handleUpdatedTech
}) => {
  return (
    <>
      <BlockIssueDetailModal problem={selectedProblem} onClose={() => setSelectedProblem(null)} onUpdateProblem={handleUpdateProblem} onAssignToDept={setAssigningProblem} />
      <BlockAssignToDeptModal challenge={assigningProblem} departments={departments} isOpen={Boolean(assigningProblem)} onClose={() => setAssigningProblem(null)} onAssigned={handleUpdateProblem} />
      <AddBlockDepartmentModal block={block} isOpen={isAddDeptOpen} onClose={() => setIsAddDeptOpen(false)} onCreated={handleCreatedDept} />
      <ViewBlockDepartmentModal department={viewingDept} isOpen={Boolean(viewingDept)} onClose={() => setViewingDept(null)} />
      <EditBlockDepartmentModal department={editingDept} isOpen={Boolean(editingDept)} onClose={() => setEditingDept(null)} onUpdated={handleUpdatedDept} />
      <BlockAddWardModal isOpen={isAddWardOpen} onClose={() => setIsAddWardOpen(false)} onCreated={handleWardCreated} block={block} />
      <WardCredentialsSuccessModal isOpen={Boolean(createdWardCreds)} onClose={() => setCreatedWardCreds(null)} wardData={createdWardCreds} />
      <AddTechnicianModal department={{ ...block, deptId: block?.blockId, name: block?.name }} isOpen={isAddTechOpen} onClose={() => setIsAddTechOpen(false)} onCreated={handleCreatedTech} />
      <ViewTechnicianModal technician={viewingTech} isOpen={Boolean(viewingTech)} onClose={() => setViewingTech(null)} />
      <EditTechnicianModal technician={editingTech} isOpen={Boolean(editingTech)} onClose={() => setEditingTech(null)} onUpdated={handleUpdatedTech} />
    </>
  );
};

export default BlockModals;
