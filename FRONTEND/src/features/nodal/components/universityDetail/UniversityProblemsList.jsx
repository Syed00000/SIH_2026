import React from 'react';
import { Layers } from 'lucide-react';
import { UniversityProblemCard } from './UniversityProblemCard.jsx';
import { SkeletonGridCards } from '../common/NodalSkeletonLoaders.jsx';

export const UniversityProblemsList = ({
  loading,
  challenges = [],
  deletingId,
  onOpenDossier,
  onOpenChat,
  onQuickReject,
  onQuickDelete,
  onOpenEditOrReassign
}) => {
  if (loading) {
    return <SkeletonGridCards count={6} />;
  }

  if (challenges.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-none p-12 text-center text-slate-500 space-y-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]">
        <Layers className="w-10 h-10 text-[#007A61] mx-auto" />
        <h3 className="text-sm font-bold text-slate-900">No allocated problems match filter</h3>
        <p className="text-xs text-slate-400">Allocate new problems from the button above or change filter options.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {challenges.map((chl) => (
        <UniversityProblemCard
          key={chl.challengeId || chl.id || chl._id}
          chl={chl}
          deletingId={deletingId}
          onOpenDossier={onOpenDossier}
          onOpenChat={onOpenChat}
          onQuickReject={onQuickReject}
          onQuickDelete={onQuickDelete}
          onOpenEditOrReassign={onOpenEditOrReassign}
        />
      ))}
    </div>
  );
};

export default UniversityProblemsList;
