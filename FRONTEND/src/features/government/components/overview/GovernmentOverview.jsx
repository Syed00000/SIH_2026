import React from 'react';
import { KpiSummaryCards } from './KpiSummaryCards.jsx';
import { ProblemsBySectorChart } from './ProblemsBySectorChart.jsx';
import { ProblemsTrendChart } from './ProblemsTrendChart.jsx';
import { TopActiveHeisTable } from './TopActiveHeisTable.jsx';

export const GovernmentOverview = ({
  kpis,
  sectors = [],
  sectorTimeframe = 'This Month',
  onChangeSectorTimeframe,
  trendData,
  trendInterval = 'Monthly',
  onChangeTrendInterval,
  heis = [],
  onSelectSector,
  onNavigateTab,
  onViewAllTriage,
  onViewAllHeis
}) => {
  const handleGoToTriage = () => {
    if (onViewAllTriage) {
      onViewAllTriage();
    } else if (onNavigateTab) {
      onNavigateTab('triage');
    }
  };

  const handleGoToHeis = () => {
    if (onViewAllHeis) {
      onViewAllHeis();
    } else if (onNavigateTab) {
      onNavigateTab('heis');
    }
  };

  return (
    <div className="w-full space-y-4 pb-3">
      {/* 1. Top KPI Stat Cards - Dynamically calculated */}
      <KpiSummaryCards kpis={kpis} />

      {/* 2. Analytics Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
        <ProblemsBySectorChart
          sectors={sectors}
          selectedTimeframe={sectorTimeframe}
          onChangeTimeframe={onChangeSectorTimeframe}
          onSelectSector={onSelectSector}
        />
        <ProblemsTrendChart
          trendData={trendData}
          currentInterval={trendInterval}
          onIntervalChange={onChangeTrendInterval}
          onViewReport={handleGoToTriage}
        />
        <TopActiveHeisTable
          heis={heis}
          onViewAll={handleGoToHeis}
        />
      </div>
    </div>
  );
};

export default GovernmentOverview;
