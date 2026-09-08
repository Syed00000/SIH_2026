import React, { useState, useMemo } from 'react';
import { BlockDepartmentNav } from './BlockDepartmentNav.jsx';
import { BlockIssuesTable } from './BlockIssuesTable.jsx';

export const BlockChallengesPanel = ({
  challenges = [],
  panchayats = [],
  onSelectProblem,
  onAssignToDept
}) => {
  const [activeDept, setActiveDept] = useState('ALL');

  const deptFilteredChallenges = useMemo(() => {
    if (activeDept === 'ALL') return challenges;
    const deptMap = {
      WATER: 'water',
      ROADS: 'road',
      POWER: 'electric',
      WASTE: 'sanitation',
      HEALTH: 'health'
    };
    const key = deptMap[activeDept] || '';
    return challenges.filter((c) => {
      const aName = (c.assignedDepartment?.name || '').toLowerCase();
      const domain = (c.domain || '').toLowerCase();
      const title = (c.title || '').toLowerCase();
      const desc = (c.description || '').toLowerCase();
      return aName.includes(key) || domain.includes(key) || title.includes(key) || desc.includes(key);
    });
  }, [challenges, activeDept]);

  return (
    <div className="space-y-4 text-left select-none">
      {/* Department Filter Tabs */}
      <BlockDepartmentNav
        activeDept={activeDept}
        onSelectDept={setActiveDept}
        challenges={challenges}
      />

      {/* Issues Table */}
      <BlockIssuesTable
        challenges={deptFilteredChallenges}
        panchayats={panchayats}
        onSelectProblem={onSelectProblem}
        onAssign={onAssignToDept}
      />
    </div>
  );
};

export default BlockChallengesPanel;
