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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const data = await universityApiService.getDashboardSummary(universityCode);
      if (isMounted) {
        setDashboardData(data);
        setLoading(false);
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

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col h-screen overflow-hidden text-slate-900 font-sans select-none">
      <UniversityHeader
        universityName={uniName}
        adminName={adminName}
        adminRole={user?.profile?.nodalOfficerDesignation || 'University Nodal Officer'}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        onExportPdf={() => window.print()}
        notificationCount={dashboardData?.unreadNotificationCount || 7}
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
