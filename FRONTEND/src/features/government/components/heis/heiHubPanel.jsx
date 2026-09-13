import React, { useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { useHeiHubData } from './useHeiHubData.js';
import { HeiHubHeader } from './HeiHubHeader.jsx';
import { AcademicStatsBanner } from './academicStatsBanner.jsx';
import { PerformanceLeaderboard } from './performanceLeaderboard.jsx';
import { MilestoneApprovals } from './milestoneApprovals.jsx';
import { MilestoneModal } from './milestoneModal.jsx';

export const HeiHubPanel = () => {
  const [subActiveTab, setSubActiveTab] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [milestoneTypeFilter, setMilestoneTypeFilter] = useState('All');

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [reviewType, setReviewType] = useState(null);
  const [adminRemarks, setAdminRemarks] = useState('');

  const {
    milestones,
    stats,
    leaderboardData,
    recentApprovals,
    toast,
    submitMilestoneAction
  } = useHeiHubData();

  const handleMilestoneReview = (record) => {
    setSelectedRecord(record);
    setAdminRemarks('');
    setReviewType('milestone');
  };

  const onConfirmMilestone = async (action) => {
    const success = await submitMilestoneAction(selectedRecord, action, adminRemarks);
    if (success) setSelectedRecord(null);
  };

  const filteredMilestones = milestones.filter((item) => {
    const matchesType = milestoneTypeFilter === 'All' || item.type === milestoneTypeFilter;
    const matchesSearch = !searchQuery || [item.id, item.title, item.hei].some(
      (f) => f && f.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesType && matchesSearch;
  });

  const milestoneSummary = {
    submitted: milestones.filter((m) => m.status === 'Submitted' || m.status === 'Pending').length,
    underReview: milestones.filter((m) => m.status === 'Under Review').length,
    changesRequested: milestones.filter((m) => m.status === 'Changes Requested').length,
    approved: milestones.filter((m) => m.status === 'Approved' || m.status === 'Completed').length
  };

  return (
    <div className="space-y-4 pb-4">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white font-medium text-xs shadow-lg flex items-center space-x-2 ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Official HEI Hub Page Header */}
      <HeiHubHeader totalHeis={stats.totalHeis} />

      <AcademicStatsBanner stats={stats} />

      <div className="flex border-b border-slate-200 bg-white rounded-t-lg px-2">
        <button
          type="button"
          onClick={() => setSubActiveTab('1')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
            subActiveTab === '1' ? 'border-[#007A61] text-[#007A61]' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Institutional Performance Leaderboard
        </button>
        <button
          type="button"
          onClick={() => setSubActiveTab('2')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
            subActiveTab === '2' ? 'border-[#007A61] text-[#007A61]' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Milestone Approvals & Verification Queue
        </button>
      </div>

      {subActiveTab === '1' && (
        <PerformanceLeaderboard
          leaderboardData={leaderboardData}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      {subActiveTab === '2' && (
        <MilestoneApprovals
          milestones={filteredMilestones}
          milestoneSummary={milestoneSummary}
          milestoneTypeFilter={milestoneTypeFilter}
          setMilestoneTypeFilter={setMilestoneTypeFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onReview={handleMilestoneReview}
          recentApprovals={recentApprovals}
        />
      )}

      {reviewType === 'milestone' && selectedRecord && (
        <MilestoneModal
          selectedRecord={selectedRecord}
          reviewType={reviewType}
          setSelectedRecord={setSelectedRecord}
          adminRemarks={adminRemarks}
          setAdminRemarks={setAdminRemarks}
          submitMilestoneAction={onConfirmMilestone}
        />
      )}
    </div>
  );
};

export default HeiHubPanel;
