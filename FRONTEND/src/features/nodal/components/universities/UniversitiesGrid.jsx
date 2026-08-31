import React from 'react';
import { Building } from 'lucide-react';
import { UniversityCard } from './UniversityCard.jsx';

export const UniversitiesGrid = ({
  loading,
  universities = [],
  getAssignedChallengesForUni,
  onSelectUniversity,
  onAllocateNew
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="h-44 bg-white border border-slate-200/90 rounded-lg p-5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (universities.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-lg p-12 text-center text-slate-500 space-y-2 shadow-2xs">
        <Building className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900">No institutions match your search</h3>
        <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {universities.map((uni) => (
        <UniversityCard
          key={uni.id || uni._id || uni.code}
          uni={uni}
          assignedChallenges={getAssignedChallengesForUni(uni)}
          onSelectUniversity={onSelectUniversity}
          onAllocateNew={onAllocateNew}
        />
      ))}
    </div>
  );
};

export default UniversitiesGrid;
