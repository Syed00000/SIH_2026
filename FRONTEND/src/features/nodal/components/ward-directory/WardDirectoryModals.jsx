import React from 'react';
import { ViewWardModal } from './ViewWardModal.jsx';
import { EditWardModal } from './EditWardModal.jsx';
import { AllocateProblemToSpecificWardModal } from './AllocateProblemToSpecificWardModal.jsx';

export const WardDirectoryModals = ({
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
