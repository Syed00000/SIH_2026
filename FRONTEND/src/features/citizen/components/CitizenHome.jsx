import React from 'react';
import { CitizenHeroBanner } from './CitizenHeroBanner.jsx';
import { PopularChallengeAreas } from './PopularChallengeAreas.jsx';
import { MyActivitiesTracker } from './MyActivitiesTracker.jsx';
import { RecentChallengesCard } from './RecentChallengesCard.jsx';
import { ImpactStatsBanner } from './ImpactStatsBanner.jsx';
import { StayUpdatedSection } from './StayUpdatedSection.jsx';

export const CitizenHome = ({
  stats,
  recentChallenge,
  onSubmitClick,
  onSelectArea,
  onSelectStatus,
  onViewAllChallenges,
  onSelectChallenge,
  onSelectStayUpdatedTile
}) => {
  return (
    <div className="space-y-4 pb-20 text-left">
      {/* 1. Hero Innovation Banner */}
      <CitizenHeroBanner onSubmitClick={onSubmitClick} />

      {/* 2. Popular Challenge Areas (10 categories) */}
      <PopularChallengeAreas onSelectArea={onSelectArea} />

      {/* 3. My Activities (4 metric cards) */}
      <MyActivitiesTracker
        activities={stats?.activities}
        onStatusClick={onSelectStatus}
        onViewAllClick={onViewAllChallenges}
      />

      {/* 4. Recent Challenges Card */}
      <RecentChallengesCard
        challenge={recentChallenge}
        onClick={onSelectChallenge}
        onViewAllClick={onViewAllChallenges}
      />

      {/* 5. Together for Impact Banner */}
      <ImpactStatsBanner stats={stats?.overallImpact} />

      {/* 6. Stay Updated Section */}
      <StayUpdatedSection onSelectTile={onSelectStayUpdatedTile} />
    </div>
  );
};

export default CitizenHome;
