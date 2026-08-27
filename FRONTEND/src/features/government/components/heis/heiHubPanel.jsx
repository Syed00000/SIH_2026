import React, { useState, useEffect } from 'react';
import { Building, AlertCircle, Check, Info } from 'lucide-react';
import { governmentDataService } from '../../services/governmentDataService.js';

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
    totalHeis: 58,
    activeTeams: 186,
    problemsAssigned: 342,
    solutionsSubmitted: 128,
    creditsEarned: 7850
  });

  const [overrideData, setOverrideData] = useState([
    { id: 'FR-2026-00421', title: 'Water Contamination in Village', currentHei: 'BIT Mesra', suggestedHei: 'NIT Jamshedpur', sector: 'Water', priority: 'High', status: 'Reassignment Requested', district: 'Ranchi' },
    { id: 'FR-2026-00418', title: 'Smart Irrigation System', currentHei: 'Ranchi University', suggestedHei: 'BIT Mesra', sector: 'Agriculture', priority: 'Medium', status: 'Pending', district: 'Khunti' },
    { id: 'FR-2026-00415', title: 'Low Cost Water Purifier', currentHei: 'Polytechnic Dhanbad', suggestedHei: 'NIT Jamshedpur', sector: 'Health', priority: 'High', status: 'Pending', district: 'Dhanbad' },
    { id: 'FR-2026-00411', title: 'Rural Road Safety Solution', currentHei: 'NIT Jamshedpur', suggestedHei: 'Ranchi University', sector: 'Infrastructure', priority: 'Medium', status: 'Reassigned', district: 'East Singhbhum' },
    { id: 'FR-2026-00407', title: 'Waste Segregation Model', currentHei: 'BIT Mesra', suggestedHei: '—', sector: 'Sanitation', priority: 'Low', status: 'Completed', district: 'Ranchi' }
  ]);

  const [statusFilter, setStatusFilter] = useState('All');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [leaderboardData, setLeaderboardData] = useState([
    { rank: 1, name: 'BIT Mesra', assigned: 68, submitted: 28, active: 42, credits: 1920 },
    { rank: 2, name: 'NIT Jamshedpur', assigned: 56, submitted: 24, active: 36, credits: 1650 },
    { rank: 3, name: 'Ranchi University', assigned: 48, submitted: 18, active: 28, credits: 1120 },
    { rank: 4, name: 'Kolhan University', assigned: 34, submitted: 12, active: 18, credits: 720 },
    { rank: 5, name: 'Polytechnic Dhanbad', assigned: 28, submitted: 10, active: 14, credits: 480 }
  ]);

  const [milestones, setMilestones] = useState([
    { id: 'PJ-2026-00031', title: 'Low Cost Water Purifier', hei: 'NIT Jamshedpur', type: 'Proposal Approval', date: '22 May 2026', status: 'Submitted' },
    { id: 'PJ-2026-00027', title: 'Smart Irrigation System', hei: 'BIT Mesra', type: 'Lab Test Results', date: '21 May 2026', status: 'Submitted' },
    { id: 'PJ-2026-00022', title: 'Rural Road Safety Solution', hei: 'Ranchi University', type: 'Prototype', date: '20 May 2026', status: 'Under Review' },
    { id: 'PJ-2026-00018', title: 'Waste Segregation Model', hei: 'Polytechnic Dhanbad', type: 'Lab Test Results', date: '19 May 2026', status: 'Changes Requested' },
    { id: 'PJ-2026-00015', title: 'Water Contamination Study', hei: 'BIT Mesra', type: 'Proposal Approval', date: '18 May 2026', status: 'Approved' }
  ]);

  const [milestoneTypeFilter, setMilestoneTypeFilter] = useState('All');
  const [recentApprovals, setRecentApprovals] = useState([
    { id: 'PJ-2026-00015', title: 'Water Contamination Study', hei: 'BIT Mesra', date: '18 May 2026' },
    { id: 'PJ-2026-00014', title: 'Solar Powered Street Light', hei: 'NIT Jamshedpur', date: '17 May 2026' },
    { id: 'PJ-2026-00012', title: 'Affordable Housing Model', hei: 'Ranchi University', date: '16 May 2026' },
    { id: 'PJ-2026-00008', title: 'Flood Early Warning System', hei: 'BIT Mesra', date: '15 May 2026' }
  ]);

  const [milestoneSummary, setMilestoneSummary] = useState({
    submitted: 8,
    underReview: 6,
    changesRequested: 4,
    approved: 4,
    rejected: 2
  });

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [reviewType, setReviewType] = useState(null);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [suggestedHeiSelection, setSuggestedHeiSelection] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (selectedDistrict !== 'All') setDistrictFilter(selectedDistrict);
  }, [selectedDistrict]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOverrideReview = (record) => {
    setSelectedRecord(record);
    setSuggestedHeiSelection(record.suggestedHei !== '—' ? record.suggestedHei : 'BIT Mesra');
    setAdminRemarks('');
    setReviewType('override');
  };

  const submitOverrideAction = (approved) => {
    if (!adminRemarks) {
      showToast('Remarks are required.', 'error');
      return;
    }
    setOverrideData(prev => prev.map(item => {
      if (item.id === selectedRecord.id) {
        return { ...item, status: approved ? 'Reassigned' : 'Pending', currentHei: approved ? suggestedHeiSelection : item.currentHei, suggestedHei: '—' };
      }
      return item;
    }));
    governmentDataService.addAuditLog(`${approved ? 'Approved' : 'Rejected'} reassignment of ${selectedRecord.id}. Remarks: ${adminRemarks}`);
    if (approved) {
      setStats(prev => ({ ...prev, activeTeams: prev.activeTeams + 1, problemsAssigned: prev.problemsAssigned + 1 }));
      setLeaderboardData(prev => prev.map(uni => uni.name === suggestedHeiSelection ? { ...uni, assigned: uni.assigned + 1, active: uni.active + 1 } : uni));
    }
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
    setMilestones(prev => prev.map(item => item.id === selectedRecord.id ? { ...item, status: action } : item));
    if (action === 'Approved') {
      setStats(prev => ({ ...prev, solutionsSubmitted: prev.solutionsSubmitted + 1, creditsEarned: prev.creditsEarned + 120 }));
      setRecentApprovals(prev => [{ id: selectedRecord.id, title: selectedRecord.title, hei: selectedRecord.hei, date: 'Today' }, ...prev.slice(0, 3)]);
      setLeaderboardData(prev => prev.map(uni => uni.name === selectedRecord.hei ? { ...uni, submitted: uni.submitted + 1, credits: uni.credits + 120 } : uni));
      setMilestoneSummary(prev => ({ ...prev, approved: prev.approved + 1, submitted: Math.max(0, prev.submitted - 1) }));
    } else {
      const field = action === 'Changes Requested' ? 'changesRequested' : 'rejected';
      setMilestoneSummary(prev => ({ ...prev, [field]: prev[field] + 1, submitted: Math.max(0, prev.submitted - 1) }));
    }
    governmentDataService.addAuditLog(`Milestone [${selectedRecord.type}] for ${selectedRecord.id}: ${action}. Remarks: ${adminRemarks}`);
    showToast(`Milestone marked: ${action}`);
    setSelectedRecord(null);
  };

  const filteredOverride = overrideData.filter(item => {
    const matchesSearch = searchQuery === '' || item.id.toLowerCase().includes(searchQuery.toLowerCase()) || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesSector = sectorFilter === 'All' || item.sector.toLowerCase() === sectorFilter.toLowerCase();
    const matchesDistrict = districtFilter === 'All' || item.district === districtFilter;
    return matchesSearch && matchesStatus && matchesSector && matchesDistrict;
  });

  const filteredMilestones = milestones.filter(item => {
    if (milestoneTypeFilter === 'All') return true;
    if (milestoneTypeFilter === 'Proposal') return item.type === 'Proposal Approval';
    if (milestoneTypeFilter === 'Lab Testing') return item.type === 'Lab Test Results';
    return item.type === 'Prototype';
  });

  const donutTotal = milestoneSummary.submitted + milestoneSummary.underReview + milestoneSummary.changesRequested + milestoneSummary.approved + milestoneSummary.rejected;
  const strokeDash = 2 * Math.PI * 25;

  return (
    <div className="w-full space-y-4 pb-6 animate-fade-in text-xs select-none">
      <AcademicStatsBanner stats={stats} />

      {/* Navigation Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-slate-100/70 border border-slate-200/80 p-1 rounded-xl">
        {['1', '2', '3'].map((num) => {
          const title = num === '1' ? 'Allocation Override' : num === '2' ? 'Performance Leaderboard' : 'Milestone Review & Approvals';
          const sub = num === '1' ? 'Re-route / Re-assign problems' : num === '2' ? 'Track HEI performance' : 'Review and approve project progress';
          const isActive = subActiveTab === num;
          return (
            <button
              key={num}
              onClick={() => setSubActiveTab(num)}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg font-bold transition-all text-left cursor-pointer ${
                isActive ? 'bg-white text-slate-900 shadow-xs border border-slate-200/90' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className={`text-base font-black ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{num}</span>
              <div>
                <div className="text-xs leading-none">{title}</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {subActiveTab === '1' && (
        <AllocationOverride
          overrideData={overrideData}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          sectorFilter={sectorFilter} setSectorFilter={setSectorFilter}
          districtFilter={districtFilter} setDistrictFilter={setDistrictFilter}
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          filteredOverride={filteredOverride}
          handleOverrideReview={handleOverrideReview}
          setSelectedRecord={setSelectedRecord} setReviewType={setReviewType}
        />
      )}

      {subActiveTab === '2' && <PerformanceLeaderboard leaderboardData={leaderboardData} />}

      {subActiveTab === '3' && (
        <MilestoneApprovals
          filteredMilestones={filteredMilestones}
          milestoneTypeFilter={milestoneTypeFilter} setMilestoneTypeFilter={setMilestoneTypeFilter}
          handleMilestoneReview={handleMilestoneReview}
          setSelectedRecord={setSelectedRecord} setReviewType={setReviewType}
          milestoneSummary={milestoneSummary} recentApprovals={recentApprovals}
          donutTotal={donutTotal} strokeDash={strokeDash}
        />
      )}

      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-center space-x-2">
        <Info className="w-4 h-4 text-slate-500 shrink-0" />
        <span className="text-[10.5px] text-slate-600 font-medium">All reassignments, approvals, and rejections are logged in Audit Trail.</span>
      </div>

      <OverrideModal
        selectedRecord={selectedRecord} reviewType={reviewType} setSelectedRecord={setSelectedRecord}
        suggestedHeiSelection={suggestedHeiSelection} setSuggestedHeiSelection={setSuggestedHeiSelection}
        adminRemarks={adminRemarks} setAdminRemarks={setAdminRemarks}
        submitOverrideAction={submitOverrideAction}
      />

      <MilestoneModal
        selectedRecord={selectedRecord} reviewType={reviewType} setSelectedRecord={setSelectedRecord}
        adminRemarks={adminRemarks} setAdminRemarks={setAdminRemarks}
        submitMilestoneAction={submitMilestoneAction}
      />

      {toast && (
        <div className="fixed bottom-4 right-4 z-500 animate-slide-in">
          <div className={`px-4 py-3 rounded-xl shadow-lg text-white font-bold flex items-center space-x-2.5 ${toast.type === 'error' ? 'bg-red-600' : 'bg-slate-900'}`}>
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-white" /> : <Check className="w-4 h-4 text-emerald-400" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeiHubPanel;
