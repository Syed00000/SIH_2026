import React, { useState, useEffect } from 'react';
import { UniversityHeader } from './UniversityHeader.jsx';
import { UniversitySidebar } from './UniversitySidebar.jsx';
import { UniversityFooter } from './UniversityFooter.jsx';
import { UniversityTabContent } from './UniversityTabContent.jsx';
import { universityApiService } from '../../services/universityApiService.js';

export const UniversityLayout = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
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
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [data, approvalsData] = await Promise.all([
          universityApiService.getDashboardSummary(universityCode),
          universityApiService.getApprovals(universityCode)
        ]);
        if (isMounted) {
          setDashboardData(data);
          const appList = Array.isArray(approvalsData) ? approvalsData : [];
          setApprovalsList(appList);
          const pendingCount = appList.filter(a => a.status === 'Pending').length;
          setPendingApprovalsCount(pendingCount);
        }
      } catch (err) {
        console.error('Failed to load university dashboard layout data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
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

  // Build real-time institutional notifications from live database records
  const notificationsList = [
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
    ...(dashboardData?.challenges || []).filter(c => c.status === 'Pending' || c.status === 'Review').map(c => ({
      id: `chl-${c.challengeId || c.id}`,
      type: 'CHALLENGE',
      category: 'Action Needed',
      title: c.title || `Grassroots Challenge ${c.challengeId}`,
      message: `${c.domain || 'State Issue'} • ${c.district || 'Jharkhand'} (${c.affectedPopulation || 'Community Impact'})`,
      time: c.assignedOn || 'New',
      actionLabel: 'Review Challenge',
      targetTab: 'challenges'
    })),
    ...(dashboardData?.recentActivities || []).slice(0, 5).map((act, idx) => ({
      id: `act-${act._id || idx}`,
      type: 'ACTIVITY',
      category: 'Audit Notice',
      title: act.type || 'SYSTEM LOG',
      message: act.text,
      time: act.relativeTime || 'Recently',
      actionLabel: 'Open Dashboard',
      targetTab: 'dashboard'
    }))
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col h-screen overflow-hidden text-slate-900 font-sans select-none">
      <UniversityHeader
        universityName={uniName}
        adminName={adminName}
        adminRole={user?.profile?.nodalOfficerDesignation || 'University Nodal Officer'}
        notificationCount={notificationsList.length}
        notifications={notificationsList}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        <UniversitySidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onLogout={onLogout}
          universityName={uniName}
          approvalCount={pendingApprovalsCount}
        />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#f8fafc]">
          <main className="flex-1 p-3.5 md:p-5 overflow-y-auto min-h-0">
            {loading ? (
              <div className="flex items-center justify-center h-64 text-xs font-bold text-slate-600">
                Loading University Innovation Portal...
              </div>
            ) : (
              <UniversityTabContent
                activeTab={activeTab}
                setActiveTab={setActiveTab}
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
