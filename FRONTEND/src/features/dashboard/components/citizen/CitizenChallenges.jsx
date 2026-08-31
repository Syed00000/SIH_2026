import React, { useState, useEffect, useMemo } from 'react';
import { citizenService } from '../../../citizen/services/citizenService.js';
import { formatLiveChallenge } from './challenges/helpers/challengeFormat.helper.js';
import { ChallengesHeaderBanner } from './challenges/ChallengesHeaderBanner.jsx';
import { ChallengesStatCards } from './challenges/ChallengesStatCards.jsx';
import { ChallengesFilterBar } from './challenges/ChallengesFilterBar.jsx';
import { ChallengesTable } from './challenges/ChallengesTable.jsx';

export const CitizenChallenges = ({ user, setActiveTab }) => {
  const [rawChallenges, setRawChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    citizenService.fetchMyChallenges({ limit: 100 })
      .then((res) => {
        if (isMounted) {
          const list = Array.isArray(res) ? res : res.challenges || [];
          setRawChallenges(list.map(formatLiveChallenge));
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const stats = useMemo(() => {
    const total = rawChallenges.length;
    const underReview = rawChallenges.filter((c) => c.status.toLowerCase().includes('review')).length;
    const inProgress = rawChallenges.filter((c) => c.status.toLowerCase().includes('progress') || c.status.toLowerCase().includes('evaluation')).length;
    const resolved = rawChallenges.filter((c) => c.status.toLowerCase().includes('resolv') || c.status.toLowerCase().includes('complet')).length;
    return {
      total: String(total).padStart(2, '0'),
      underReview: String(underReview).padStart(2, '0'),
      inProgress: String(inProgress).padStart(2, '0'),
      resolved: String(resolved).padStart(2, '0')
    };
  }, [rawChallenges]);

  const filtered = useMemo(() => {
    return rawChallenges.filter((ch) => {
      const matchesSearch =
        ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All Status' || ch.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'All Categories' || ch.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [rawChallenges, searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <ChallengesHeaderBanner
        onOpenSubmitModal={() => setActiveTab('submit')}
      />

      {/* 4 Stat Cards */}
      <ChallengesStatCards
        totalCount={stats.total}
        underReviewCount={stats.underReview}
        inProgressCount={stats.inProgress}
        resolvedCount={stats.resolved}
      />

      {/* Filter and Search Bar */}
      <ChallengesFilterBar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Submitted Challenges Table */}
      <ChallengesTable
        loading={loading}
        filteredChallenges={filtered}
        onViewDetails={(id) => alert(`Opening details for challenge ${id}...`)}
      />
    </div>
  );
};

export default CitizenChallenges;
