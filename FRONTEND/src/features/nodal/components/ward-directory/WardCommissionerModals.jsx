import React from 'react';
import { AddTechnicianModal } from '../../../department/components/AddTechnicianModal.jsx';
import { ViewTechnicianModal } from '../../../department/components/ViewTechnicianModal.jsx';
import { EditTechnicianModal } from '../../../department/components/EditTechnicianModal.jsx';
import { AssignToTechnicianModal } from '../../../department/components/AssignToTechnicianModal.jsx';

export const WardCommissionerModals = ({
  wardDept,
  isAddTechOpen,
  setIsAddTechOpen,
  onCreatedTech,
  viewingTech,
  setViewingTech,
  editingTech,
  setEditingTech,
  onUpdatedTech,
  assigningProblemTech,
  setAssigningProblemTech,
  technicians,
  onAssignedProblem
}) => {
  return (
    <>
      <AddTechnicianModal
        department={wardDept}
        isOpen={isAddTechOpen}
        onClose={() => setIsAddTechOpen(false)}
        onCreated={onCreatedTech}
      />
      <ViewTechnicianModal
        technician={viewingTech}
        isOpen={Boolean(viewingTech)}
        onClose={() => setViewingTech(null)}
      />
      <EditTechnicianModal
        technician={editingTech}
        isOpen={Boolean(editingTech)}
        onClose={() => setEditingTech(null)}
        onUpdated={onUpdatedTech}
      />
      <AssignToTechnicianModal
        challenge={assigningProblemTech}
        technicians={technicians}
        isOpen={Boolean(assigningProblemTech)}
        onClose={() => setAssigningProblemTech(null)}
        onAssigned={onAssignedProblem}
      />
    </>
  );
};

export default WardCommissionerModals;
