import React, { useState, useEffect } from 'react';
import { UniversityHeader } from './UniversityHeader.jsx';
import { UniversitySidebar } from './UniversitySidebar.jsx';
import { UniversityFooter } from './UniversityFooter.jsx';
import { UniversityDashboard } from '../dashboard/UniversityDashboard.jsx';
import { AssignedChallengesPanel } from '../challenges/AssignedChallengesPanel.jsx';
import { FacultyMentorsPanel } from '../faculty/FacultyMentorsPanel.jsx';
import { FacultyDetailPanel } from '../faculty/FacultyDetailPanel.jsx';
import { EditFacultyPanel } from '../faculty/EditFacultyPanel.jsx';
import { OnboardFacultyPanel } from '../faculty/OnboardFacultyPanel.jsx';
import { ProjectsPanel } from '../projects/ProjectsPanel.jsx';
import { CreateProjectPanel } from '../projects/CreateProjectPanel.jsx';
import { IndustryPartnersPanel } from '../partners/IndustryPartnersPanel.jsx';
import { ApprovalsPanel } from '../approvals/ApprovalsPanel.jsx';
import { ReportsPanel } from '../reports/ReportsPanel.jsx';
import { UniversityNotificationsPanel } from '../notifications/UniversityNotificationsPanel.jsx';
import { UniversityProfilePanel } from '../profile/UniversityProfilePanel.jsx';
import { UniversitySettingsPanel } from '../settings/UniversitySettingsPanel.jsx';
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
      name: payload.facultyName,
      department: payload.department
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
            ) : activeTab === 'dashboard' ? (
              <UniversityDashboard
                data={dashboardData}
                adminName={adminName}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onUpdateChallenge={handleUpdateChallenge}
              />
            ) : activeTab === 'challenges' ? (
              <AssignedChallengesPanel
                challenges={dashboardData?.challenges || []}
                universityCode={universityCode}
                onUpdateChallengeStatus={handleUpdateChallengeStatus}
                onAssignFaculty={handleUpdateChallenge}
              />
            ) : activeTab === 'faculty' ? (
              <FacultyMentorsPanel
                onNavigateTab={(tab) => setActiveTab(tab)}
                onSelectFacultyDetail={(faculty, projects, challenges) => {
                  setSelectedFacultyForDetail(faculty);
                  setSelectedFacultyForEdit(faculty);
                  setFacultyDetailContext({ projects: projects || [], challenges: challenges || [] });
                }}
                onSelectFacultyEdit={(faculty) => {
                  setSelectedFacultyForEdit(faculty);
                  setSelectedFacultyForDetail(faculty);
                }}
              />
            ) : activeTab === 'faculty-detail' && selectedFacultyForDetail ? (
              <FacultyDetailPanel
                faculty={selectedFacultyForDetail}
                projects={facultyDetailContext.projects}
                challenges={facultyDetailContext.challenges}
                onBack={() => setActiveTab('faculty')}
                onEdit={(faculty) => {
                  setSelectedFacultyForEdit(faculty);
                  setActiveTab('edit-faculty');
                }}
                onDeleteFaculty={async (id) => {
                  const { universityApiService } = await import('../../services/universityApiService.js');
                  await universityApiService.deleteFaculty(id);
                  setActiveTab('faculty');
                }}
                onUnassignProject={async (projectId, facultyName) => {
                  if (window.confirm(`Unassign ${facultyName} from this project?`)) {
                    const { universityApiService } = await import('../../services/universityApiService.js');
                    await universityApiService.updateProject(projectId, { leadMentor: 'Unassigned Mentor', facultyMentor: null }, 'RU001');
                    setActiveTab('faculty');
                  }
                }}
                onAssignChallenge={() => {}}
              />
            ) : activeTab === 'edit-faculty' && (selectedFacultyForEdit || selectedFacultyForDetail) ? (
              <EditFacultyPanel
                faculty={selectedFacultyForEdit || selectedFacultyForDetail}
                onBack={() => setActiveTab(selectedFacultyForDetail ? 'faculty-detail' : 'faculty')}
                onSuccess={(updated) => {
                  if (updated) {
                    setSelectedFacultyForDetail(updated);
                    setSelectedFacultyForEdit(updated);
                  }
                  setActiveTab('faculty');
                }}
              />
            ) : activeTab === 'onboard-faculty' ? (
              <OnboardFacultyPanel
                onBack={() => setActiveTab('faculty')}
                onSuccess={() => setActiveTab('faculty')}
              />
            ) : activeTab === 'projects' ? (
              <ProjectsPanel onNavigateTab={(tab) => setActiveTab(tab)} />
            ) : activeTab === 'create-project' ? (
              <CreateProjectPanel
                onBack={() => setActiveTab('projects')}
                onSuccess={() => setActiveTab('projects')}
              />
            ) : activeTab === 'partners' ? (
              <IndustryPartnersPanel />
            ) : activeTab === 'approvals' ? (
              <ApprovalsPanel />
            ) : activeTab === 'reports' ? (
              <ReportsPanel />
            ) : activeTab === 'notifications' ? (
              <UniversityNotificationsPanel />
            ) : activeTab === 'profile' ? (
              <UniversityProfilePanel universityData={dashboardData?.university} />
            ) : activeTab === 'settings' ? (
              <UniversitySettingsPanel />
            ) : (
              <UniversityDashboard
                data={dashboardData}
                adminName={adminName}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onUpdateChallenge={handleUpdateChallenge}
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
