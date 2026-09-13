import React from 'react';
import { ViewWardModal } from './ViewWardModal.jsx';
import { EditWardModal } from './EditWardModal.jsx';
import { AddWardModal } from './AddWardModal.jsx';
import { AllocateProblemToSpecificWardModal } from './AllocateProblemToSpecificWardModal.jsx';

export const WardDirectoryModals = ({
  isAddWardOpen,
  setIsAddWardOpen,
  onWardCreated,
  districtName,
  editingWard,
  setEditingWard,
  onWardUpdated,
  viewWard,
  setViewWard,
  allocatingWard,
  setAllocatingWard,
  challenges,
  onProblemAllocated
}) => {
  return (
    <>
      <AddWardModal
        isOpen={isAddWardOpen}
        onClose={() => setIsAddWardOpen(false)}
        onWardCreated={onWardCreated}
        defaultDistrict={districtName}
      />
      <EditWardModal
        isOpen={Boolean(editingWard)}
        ward={editingWard}
        onClose={() => setEditingWard(null)}
        onWardUpdated={onWardUpdated}
      />
      <ViewWardModal isOpen={Boolean(viewWard)} ward={viewWard} onClose={() => setViewWard(null)} />
      <AllocateProblemToSpecificWardModal
        isOpen={Boolean(allocatingWard)}
        ward={allocatingWard}
        challenges={challenges}
        onClose={() => setAllocatingWard(null)}
        onProblemAllocated={onProblemAllocated}
      />
    </>
  );
};

export default WardDirectoryModals;
