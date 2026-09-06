import React, { useState, useEffect } from 'react';
import { UniversityHeader } from './UniversityHeader.jsx';
import { UniversitySidebar } from './UniversitySidebar.jsx';
import { UniversityFooter } from './UniversityFooter.jsx';
import { UniversityTabContent } from './UniversityTabContent.jsx';
import { useUniversityActiveTab } from './useUniversityActiveTab.js';
import { universityApiService } from '../../services/universityApiService.js';

export const UniversityLayout = ({ user, onLogout }) => {
  const [activeTab, handleSetActiveTab] = useUniversityActiveTab('dashboard');

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedFacultyForDetail, setSelectedFacultyForDetail] = useState(null);
  const [selectedFacultyForEdit, setSelectedFacultyForEdit] = useState(null);
  const [facultyDetailContext, setFacultyDetailContext] = useState({ projects: [], challenges: [] });

  const rawCode = user?.profile?.aisheCode || user?.profile?.code || user?.code || user?.universityCode || user?.email || 'RU001';
  const universityCode = rawCode;
  const [dashboardData, setDashboardData] = useState(null);
  const [approvalsList, setApprovalsList] = useState([]);
  const [industryRequestsList, setIndustryRequestsList] = useState([]);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const [data, approvalsData, indReqsData] = await Promise.all([
        universityApiService.getDashboardSummary(universityCode),
        universityApiService.getApprovals(universityCode),
        universityApiService.getIndustryRequests(universityCode)
      ]);
      setDashboardData(data);
      const appList = Array.isArray(approvalsData) ? approvalsData : [];
      setApprovalsList(appList);
      setPendingApprovalsCount(appList.filter(a => a.status === 'Pending').length);
      const indList = Array.isArray(indReqsData) ? indReqsData : (Array.isArray(indReqsData?.data) ? indReqsData.data : []);
      setIndustryRequestsList(indList);
    } catch (err) {
      console.error('Failed to load university dashboard layout data:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(true), 4000);
    return () => clearInterval(interval);
  }, [universityCode]);

  const handleUpdateChallenge = async (payload) => {
    await universityApiService.assignFaculty(payload.challengeId, universityCode, {
      name: payload.name || payload.facultyName,
      department: payload.department,
      email: payload.email || payload.facultyEmail || ''
    });
    const data = await universityApiService.getDashboardSummary(universityCode);
    setDashboardData(data);
  };

  const handleUpdateChallengeStatus = async (challengeId, status, actionLabel) => {
    await universityApiService.updateChallengeStatus(challengeId, universityCode, status, actionLabel);
    const data = await universityApiService.getDashboardSummary(universityCode);
    setDashboardData(data);
  };

  const adminName = user?.fullName || dashboardData?.adminUser?.name || dashboardData?.university?.nodalOfficer?.name || 'Dr. Ankit Verma';
  const uniName = dashboardData?.name || dashboardData?.university?.name || 'Ranchi University';

  const pendingIndustryAmountCount = industryRequestsList.filter(
    (r) => r.labChargesQuoted && r.quoteStatus !== 'Accepted' && r.quoteStatus !== 'Declined'
  ).length;

  // Build real-time institutional notifications from live database records
  const notificationsList = [
    ...industryRequestsList.filter(r => r.labChargesQuoted && r.quoteStatus !== 'Accepted' && r.quoteStatus !== 'Declined').map(r => ({
      id: `quote-${r.requestId || r._id}`,
      type: 'INDUSTRY',
      category: 'Fee Approval Required',
      title: `${r.partnerName || 'Industry'} Quoted Lab Fee: ${r.labChargesQuoted}`,
      message: `Industry partner requested ${r.labChargesQuoted} for testing access on "${r.projectTitle}". Approve or decline amount.`,
      time: r.updatedAt ? new Date(r.updatedAt).toLocaleDateString('en-GB') : 'Recent',
      actionLabel: 'Approve Amount in Partners',
      targetTab: 'partners'
    })),
    ...industryRequestsList.filter(r => r.status === 'Approved').map(r => ({
      id: `ind-${r.requestId || r._id}`,
      type: 'INDUSTRY',
      category: 'Industry Approved',
      title: `${r.partnerName || 'Industry Partner'} Approved Proposal`,
      message: `Industry Partner "${r.partnerName}" approved collaboration for "${r.projectTitle}" (${r.estimatedBudget || 'CSR Grant'}). Lab testing & R&D facilities unlocked.`,
      time: r.updatedAt ? new Date(r.updatedAt).toLocaleDateString('en-GB') : 'Recent',
      actionLabel: 'View in Industry Partners',
      targetTab: 'partners'
    })),
    ...approvalsList.filter(a => a.status === 'Pending').map(a => ({
      id: `app-${a.approvalId || a._id}`,
      type: 'APPROVAL',
      category: 'Pending Review',
      title: a.project || `Project Proposal ${a.projectId}`,
      message: `${a.type || 'R&D Proposal'} • Budget: ${a.estimatedBudget || a.proposedBudget || '₹ 80,000'} submitted by ${a.submittedBy || 'Faculty Mentor'}.`,
      time: a.date || 'Recent',
      actionLabel: 'Review in Approvals',
      targetTab: 'approvals'
    })),
    ...(dashboardData?.recentActivities || []).slice(0, 10).map((act, idx) => ({
      id: `act-${act._id || idx}`,
      type: 'ACTIVITY',
      category: 'Audit Notice',
      title: act.type === 'INDUSTRY_APPROVED' || act.type === 'INDUSTRY_REQUEST' ? 'Industry Approved' : (act.type || 'SYSTEM LOG'),
      message: act.text,
      time: act.relativeTime || 'Recently',
      actionLabel: act.type?.includes('INDUSTRY') ? 'View Partners' : 'Open Dashboard',
      targetTab: act.type?.includes('INDUSTRY') ? 'partners' : 'dashboard'
    }))
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col h-screen overflow-hidden text-slate-900 font-sans select-none">
      <UniversityHeader
        universityName={uniName}
        adminName={adminName}
        adminRole={user?.profile?.nodalOfficerDesignation || 'University Nodal Officer'}
        notificationCount={notificationsList.length}
        notifications={notificationsList}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onClearNotifications={() => loadData(false)}
        universityCode={universityCode}
        onProfileClick={() => setActiveTab('profile')}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        <UniversitySidebar
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onLogout={onLogout}
          universityName={uniName}
          approvalCount={pendingApprovalsCount}
          partnerNotificationCount={pendingIndustryAmountCount}
        />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
          <main className="flex-1 p-3.5 md:p-5 overflow-y-auto min-h-0">
            {loading ? (
              <div className="flex items-center justify-center h-64 text-xs font-bold text-slate-600">
                Loading University Innovation Portal...
              </div>
            ) : (
              <UniversityTabContent
                activeTab={activeTab}
                setActiveTab={handleSetActiveTab}
                dashboardData={dashboardData}
                adminName={adminName}
                uniName={uniName}
                universityCode={universityCode}
                handleUpdateChallenge={handleUpdateChallenge}
                handleUpdateChallengeStatus={handleUpdateChallengeStatus}
                selectedFacultyForDetail={selectedFacultyForDetail}
                setSelectedFacultyForDetail={setSelectedFacultyForDetail}
                selectedFacultyForEdit={selectedFacultyForEdit}
                setSelectedFacultyForEdit={setSelectedFacultyForEdit}
                facultyDetailContext={facultyDetailContext}
                setFacultyDetailContext={setFacultyDetailContext}
                onClearNotifications={() => loadData(false)}
              />
            )}
          </main>

          <UniversityFooter />
        </div>
      </div>
    </div>
  );
};

export default UniversityLayout;
