import React, { useState, useMemo } from 'react';
import { initialCitizenChallenges } from './challenges/data/citizenChallenges.data.js';
import { ChallengesHeaderBanner } from './challenges/ChallengesHeaderBanner.jsx';
import { ChallengesStatCards } from './challenges/ChallengesStatCards.jsx';
import { ChallengesFilterBar } from './challenges/ChallengesFilterBar.jsx';
import { ChallengesTable } from './challenges/ChallengesTable.jsx';

export const CitizenChallenges = ({ user, setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  const filtered = useMemo(() => {
    return initialCitizenChallenges.filter((ch) => {
      const matchesSearch =
        ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All Status' || ch.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'All Categories' || ch.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <ChallengesHeaderBanner
        onOpenSubmitModal={() => alert('New challenge submission wizard opening...')}
      />

      {/* 4 Stat Cards */}
      <ChallengesStatCards
        totalCount="05"
        underReviewCount="02"
        inProgressCount="01"
        resolvedCount="02"
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
        filteredChallenges={filtered}
        onViewDetails={(id) => alert(`Opening details for ${id}...`)}
      />
    </div>
  );
};

export default CitizenChallenges;
