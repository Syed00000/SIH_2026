import React from 'react';
import { WelcomeBanner } from './overview/WelcomeBanner.jsx';
import { OverviewStatCards } from './overview/OverviewStatCards.jsx';
import { RecentChallengesTable } from './overview/RecentChallengesTable.jsx';
import { ChallengeJourneyTimeline } from './overview/ChallengeJourneyTimeline.jsx';
import { CategoryExplorerCard } from './overview/CategoryExplorerCard.jsx';
import { CommunityChallengesCard } from './overview/CommunityChallengesCard.jsx';
import { UserLocationCard } from './overview/UserLocationCard.jsx';

export const CitizenOverview = ({ user, role, setActiveTab }) => {
  return (
    <div className="space-y-4">
      {/* Top Banner Row */}
      <WelcomeBanner
        user={user}
        role={role}
        onOpenSubmitChallenge={() => setActiveTab('challenges')}
      />

      {/* 4 Stat Cards */}
      <OverviewStatCards
        totalSubmitted="05"
        underReview="02"
        inEvaluation="01"
        solvedAndDeployed="02"
      />

      {/* Middle Section: Recent Challenges Table + Timeline Journey */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        <RecentChallengesTable
          onViewAll={() => setActiveTab('challenges')}
        />
        <ChallengeJourneyTimeline />
      </div>

      {/* Bottom Section: Explore by Category + Community Challenges + Your Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <CategoryExplorerCard
          onCategoryClick={() => setActiveTab('challenges')}
        />
        <CommunityChallengesCard
          onExploreCommunity={() => setActiveTab('challenges')}
        />
        <UserLocationCard
          user={user}
          onEditProfile={() => setActiveTab('profile')}
        />
      </div>
    </div>
  );
};

export default CitizenOverview;
