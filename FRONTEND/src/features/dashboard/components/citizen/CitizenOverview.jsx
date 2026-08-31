import React, { useState, useEffect } from 'react';
import { citizenService } from '../../../citizen/services/citizenService.js';
import { formatLiveChallenge } from './challenges/helpers/challengeFormat.helper.js';
import { WelcomeBanner } from './overview/WelcomeBanner.jsx';
import { OverviewStatCards } from './overview/OverviewStatCards.jsx';
import { RecentChallengesTable } from './overview/RecentChallengesTable.jsx';
import { ChallengeJourneyTimeline } from './overview/ChallengeJourneyTimeline.jsx';
import { CategoryExplorerCard } from './overview/CategoryExplorerCard.jsx';
import { CommunityChallengesCard } from './overview/CommunityChallengesCard.jsx';
import { UserLocationCard } from './overview/UserLocationCard.jsx';

export const CitizenOverview = ({ user, role, setActiveTab }) => {
  const [stats, setStats] = useState({
    totalSubmitted: '00',
    underReview: '00',
    inEvaluation: '00',
    solvedAndDeployed: '00'
  });
  const [recentChallenges, setRecentChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      citizenService.fetchStats().catch(() => null),
      citizenService.fetchMyChallenges({ limit: 4 }).catch(() => ({ challenges: [] }))
    ]).then(([statsRes, chRes]) => {
      if (isMounted) {
        const list = Array.isArray(chRes) ? chRes : chRes?.challenges || [];
        const formatted = list.slice(0, 4).map(formatLiveChallenge);
        setRecentChallenges(formatted);

        const activities = statsRes?.activities || {};
        const total = activities.total || list.length || 0;
        const review = activities.underReview || list.filter((c) => c.status?.toLowerCase().includes('review')).length || 0;
        const inEval = activities.inProgress || list.filter((c) => c.status?.toLowerCase().includes('progress') || c.status?.toLowerCase().includes('evaluat')).length || 0;
        const solved = activities.resolved || list.filter((c) => c.status?.toLowerCase().includes('resolv') || c.status?.toLowerCase().includes('complet')).length || 0;

        setStats({
          totalSubmitted: String(total).padStart(2, '0'),
          underReview: String(review).padStart(2, '0'),
          inEvaluation: String(inEval).padStart(2, '0'),
          solvedAndDeployed: String(solved).padStart(2, '0')
        });
        setLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, []);

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
        totalSubmitted={stats.totalSubmitted}
        underReview={stats.underReview}
        inEvaluation={stats.inEvaluation}
        solvedAndDeployed={stats.solvedAndDeployed}
      />

      {/* Middle Section: Recent Challenges Table + Timeline Journey */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        <RecentChallengesTable
          loading={loading}
          challenges={recentChallenges}
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
