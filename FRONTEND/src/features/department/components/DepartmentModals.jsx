import React from 'react';
import { AddTechnicianModal } from './AddTechnicianModal.jsx';
import { AddDistrictModal } from './AddDistrictModal.jsx';
import { ViewTechnicianModal } from './ViewTechnicianModal.jsx';
import { EditTechnicianModal } from './EditTechnicianModal.jsx';
import { AssignToTechnicianModal } from './AssignToTechnicianModal.jsx';
import { AddBudgetOfficerModal } from './AddBudgetOfficerModal.jsx';
import { ViewBudgetOfficerModal } from './ViewBudgetOfficerModal.jsx';
import { EditBudgetOfficerModal } from './EditBudgetOfficerModal.jsx';
import { AssignBudgetOfficerModal } from './AssignBudgetOfficerModal.jsx';

export const DepartmentModals = ({
  department,
  technicians,
  budgetOfficers,
  isWardDept,
  isAddTechOpen,
  setIsAddTechOpen,
  handleCreatedTech,
  showAddBudgetOfficerModal,
  setShowAddBudgetOfficerModal,
  handleCreatedBudgetOfficer,
  viewingBudgetOfficer,
  setViewingBudgetOfficer,
  editingBudgetOfficer,
  setEditingBudgetOfficer,
  handleUpdatedBudgetOfficer,
  isAddDistrictOpen,
  setIsAddDistrictOpen,
  handleCreatedDistrict,
  viewingTech,
  setViewingTech,
  editingTech,
  setEditingTech,
  handleUpdatedTech,
  assigningProblemTech,
  setAssigningProblemTech,
  handleUpdateProblem,
  assigningBudgetProblem,
  setAssigningBudgetProblem,
  handleAssignBudgetOfficer
}) => {
  return (
    <>
      <AddTechnicianModal
        department={department}
        isOpen={isAddTechOpen}
        onClose={() => setIsAddTechOpen(false)}
        onCreated={handleCreatedTech}
      />
      <AddBudgetOfficerModal
        isOpen={showAddBudgetOfficerModal}
        onClose={() => setShowAddBudgetOfficerModal(false)}
        department={department}
        onCreated={handleCreatedBudgetOfficer}
      />
      <ViewBudgetOfficerModal
        officer={viewingBudgetOfficer}
        isOpen={Boolean(viewingBudgetOfficer)}
        onClose={() => setViewingBudgetOfficer(null)}
      />
      <EditBudgetOfficerModal
        officer={editingBudgetOfficer}
        isOpen={Boolean(editingBudgetOfficer)}
        onClose={() => setEditingBudgetOfficer(null)}
        onUpdated={handleUpdatedBudgetOfficer}
      />

      {!isWardDept && (
        <AddDistrictModal
          isOpen={isAddDistrictOpen}
          onClose={() => setIsAddDistrictOpen(false)}
          onCreated={handleCreatedDistrict}
          isDistrictDept={department?.category === 'District Department'}
          isBlockDept={department?.category === 'Block / Tehsil Office'}
        />
      )}
      <ViewTechnicianModal
        technician={viewingTech}
        isOpen={Boolean(viewingTech)}
        onClose={() => setViewingTech(null)}
      />
      <EditTechnicianModal
        technician={editingTech}
        isOpen={Boolean(editingTech)}
        onClose={() => setEditingTech(null)}
        onUpdated={handleUpdatedTech}
      />
      <AssignToTechnicianModal
        challenge={assigningProblemTech}
        technicians={technicians}
        isOpen={Boolean(assigningProblemTech)}
        onClose={() => setAssigningProblemTech(null)}
        onAssigned={handleUpdateProblem}
      />
      <AssignBudgetOfficerModal
        problem={assigningBudgetProblem}
        officers={budgetOfficers}
        isOpen={Boolean(assigningBudgetProblem)}
        onClose={() => setAssigningBudgetProblem(null)}
        onAssign={handleAssignBudgetOfficer}
      />
    </>
  );
};

export default DepartmentModals;
