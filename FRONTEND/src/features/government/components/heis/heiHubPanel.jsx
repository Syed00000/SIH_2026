import React, { useState, useEffect } from 'react';
import { Building, AlertCircle, Check, Info } from 'lucide-react';
import { universityService } from '../../services/universityService.js';

// Sub-components import
import { AcademicStatsBanner } from './academicStatsBanner.jsx';
import { AllocationOverride } from './allocationOverride.jsx';
import { PerformanceLeaderboard } from './performanceLeaderboard.jsx';
import { MilestoneApprovals } from './milestoneApprovals.jsx';
import { OverrideModal } from './overrideModal.jsx';
import { MilestoneModal } from './milestoneModal.jsx';

export const HeiHubPanel = ({ selectedDistrict = 'All', onSelectDistrict }) => {
  const [subActiveTab, setSubActiveTab] = useState('1');
  const [stats, setStats] = useState({
    totalHeis: 0,
    activeTeams: 0,
    problemsAssigned: 0,
    solutionsSubmitted: 0,
    creditsEarned: 0
  });

  const [overrideData, setOverrideData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [milestoneTypeFilter, setMilestoneTypeFilter] = useState('All');
  const [recentApprovals, setRecentApprovals] = useState([]);

  const [milestoneSummary, setMilestoneSummary] = useState({
    submitted: 0,
    underReview: 0,
    changesRequested: 0,
    approved: 0,
    rejected: 0
  });

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [reviewType, setReviewType] = useState(null);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [suggestedHeiSelection, setSuggestedHeiSelection] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (selectedDistrict !== 'All') setDistrictFilter(selectedDistrict);
  }, [selectedDistrict]);

  useEffect(() => {
    const loadHeisData = async () => {
      try {
        const res = await universityService.fetchHeis({ page: 1, limit: 50 });
        const heisList = res?.records || res?.data?.heis || res?.data || [];
        const total = res?.total || heisList.length;
        if (Array.isArray(heisList)) {
          setStats({
            totalHeis: total,
            activeTeams: 0,
            problemsAssigned: 0,
            solutionsSubmitted: 0,
            creditsEarned: 0
          });
          const leaderboard = heisList.map((h, idx) => ({
            rank: idx + 1,
            name: h.name || h.universityName,
            assigned: 0,
            submitted: 0,
            active: 0,
            credits: 0
          }));
          setLeaderboardData(leaderboard);
        }
      } catch (err) {
        console.warn('Failed to load HEIs data:', err);
      }
    };
    loadHeisData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOverrideReview = (record) => {
    setSelectedRecord(record);
    setSuggestedHeiSelection(record.suggestedHei !== '—' ? record.suggestedHei : '');
    setAdminRemarks('');
    setReviewType('override');
  };

  const submitOverrideAction = (approved) => {
    if (!adminRemarks) {
      showToast('Remarks are required.', 'error');
      return;
    }
    setOverrideData((prev) =>
      prev.map((item) => {
        if (item.id === selectedRecord.id) {
          return {
            ...item,
            status: approved ? 'Reassigned' : 'Pending',
            currentHei: approved ? suggestedHeiSelection : item.currentHei,
            suggestedHei: '—'
          };
        }
        return item;
      })
    );
    showToast(`Reassignment request ${approved ? 'approved' : 'declined'}`);
    setSelectedRecord(null);
  };

  const handleMilestoneReview = (record) => {
    setSelectedRecord(record);
    setAdminRemarks('');
    setReviewType('milestone');
  };

  const submitMilestoneAction = (action) => {
    if (!adminRemarks) {
      showToast('Feedback remarks are required.', 'error');
      return;
    }
    setMilestones((prev) =>
      prev.map((item) => (item.id === selectedRecord.id ? { ...item, status: action } : item))
    );
    showToast(`Milestone marked: ${action}`);
    setSelectedRecord(null);
  };

  const filteredOverride = overrideData.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesSector = sectorFilter === 'All' || item.sector.toLowerCase() === sectorFilter.toLowerCase();
    const matchesDistrict = districtFilter === 'All' || item.district === districtFilter;
    return matchesSearch && matchesStatus && matchesSector && matchesDistrict;
  });

  const filteredMilestones = milestones.filter((item) => {
    const matchesType = milestoneTypeFilter === 'All' || item.type === milestoneTypeFilter;
    const matchesSearch =
      searchQuery === '' ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hei.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white font-medium text-xs shadow-lg flex items-center space-x-2 ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Academic Stats Banner */}
      <AcademicStatsBanner stats={stats} />

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-lg px-2">
        <button
          onClick={() => setSubActiveTab('1')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 -mb-px transition-colors ${
            subActiveTab === '1'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Allocation Override & Conflict Resolution
        </button>
        <button
          onClick={() => setSubActiveTab('2')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 -mb-px transition-colors ${
            subActiveTab === '2'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Institutional Performance Leaderboard
        </button>
        <button
          onClick={() => setSubActiveTab('3')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 -mb-px transition-colors ${
            subActiveTab === '3'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Milestone Approvals & Verification Queue
        </button>
      </div>

      {/* Tab Contents */}
      {subActiveTab === '1' && (
        <AllocationOverride
          overrideData={filteredOverride}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sectorFilter={sectorFilter}
          setSectorFilter={setSectorFilter}
          districtFilter={districtFilter}
          setDistrictFilter={setDistrictFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onReview={handleOverrideReview}
        />
      )}

      {subActiveTab === '2' && (
        <PerformanceLeaderboard
          leaderboardData={leaderboardData}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      {subActiveTab === '3' && (
        <MilestoneApprovals
          milestones={filteredMilestones}
          milestoneSummary={milestoneSummary}
          recentApprovals={recentApprovals}
          milestoneTypeFilter={milestoneTypeFilter}
          setMilestoneTypeFilter={setMilestoneTypeFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onReview={handleMilestoneReview}
        />
      )}

      {/* Override Modal */}
      {reviewType === 'override' && selectedRecord && (
        <OverrideModal
          selectedRecord={selectedRecord}
          suggestedHeiSelection={suggestedHeiSelection}
          setSuggestedHeiSelection={setSuggestedHeiSelection}
          adminRemarks={adminRemarks}
          setAdminRemarks={setAdminRemarks}
          onSubmit={submitOverrideAction}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      {/* Milestone Modal */}
      {reviewType === 'milestone' && selectedRecord && (
        <MilestoneModal
          selectedRecord={selectedRecord}
          adminRemarks={adminRemarks}
          setAdminRemarks={setAdminRemarks}
          onSubmit={submitMilestoneAction}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
};

export default HeiHubPanel;
