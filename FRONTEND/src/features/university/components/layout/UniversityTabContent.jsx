import React from 'react';
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

export const UniversityTabContent = ({
  activeTab,
  setActiveTab,
  dashboardData,
  adminName,
  uniName,
  universityCode,
  handleUpdateChallenge,
  handleUpdateChallengeStatus,
  selectedFacultyForDetail,
  setSelectedFacultyForDetail,
  selectedFacultyForEdit,
  setSelectedFacultyForEdit,
  facultyDetailContext,
  setFacultyDetailContext,
  onClearNotifications
}) => {
  if (activeTab === 'dashboard') {
    return (
      <UniversityDashboard
        data={dashboardData}
        adminName={adminName}
        universityName={uniName}
        universityCode={universityCode}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onUpdateChallenge={handleUpdateChallenge}
      />
    );
  }

  if (activeTab === 'challenges') {
    return (
      <AssignedChallengesPanel
        challenges={dashboardData?.challenges || []}
        universityCode={universityCode}
        onUpdateChallengeStatus={handleUpdateChallengeStatus}
        onAssignFaculty={handleUpdateChallenge}
      />
    );
  }

  if (activeTab === 'faculty') {
    return (
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
    );
  }

  if (activeTab === 'faculty-detail' && selectedFacultyForDetail) {
    return (
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
          await universityApiService.deleteFaculty(id);
          setActiveTab('faculty');
        }}
        onUnassignProject={async (projectId, facultyName) => {
          if (window.confirm(`Unassign ${facultyName} from this project?`)) {
            await universityApiService.updateProject(projectId, { leadMentor: 'Unassigned Mentor', facultyMentor: null }, 'RU001');
            setActiveTab('faculty');
          }
        }}
        onAssignChallenge={() => {}}
      />
    );
  }

  if (activeTab === 'edit-faculty' && (selectedFacultyForEdit || selectedFacultyForDetail)) {
    return (
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
    );
  }

  if (activeTab === 'onboard-faculty') {
    return (
      <OnboardFacultyPanel
        onBack={() => setActiveTab('faculty')}
        onSuccess={() => setActiveTab('faculty')}
      />
    );
  }

  if (activeTab === 'projects') return <ProjectsPanel onNavigateTab={(tab) => setActiveTab(tab)} />;
  if (activeTab === 'create-project') return <CreateProjectPanel onBack={() => setActiveTab('projects')} onSuccess={() => setActiveTab('projects')} />;
  if (activeTab === 'partners') return <IndustryPartnersPanel />;
  if (activeTab === 'approvals') return <ApprovalsPanel />;
  if (activeTab === 'reports') return <ReportsPanel />;
  if (activeTab === 'notifications') {
    return (
      <UniversityNotificationsPanel
        universityCode={universityCode}
        onBack={() => setActiveTab('dashboard')}
        onClearNotifications={onClearNotifications}
        onNavigateTab={setActiveTab}
      />
    );
  }
  if (activeTab === 'profile') return <UniversityProfilePanel universityData={dashboardData?.university} />;
  if (activeTab === 'settings') return <UniversitySettingsPanel />;

  return (
    <UniversityDashboard
      data={dashboardData}
      adminName={adminName}
      onNavigateTab={(tab) => setActiveTab(tab)}
      onUpdateChallenge={handleUpdateChallenge}
    />
  );
};

export default UniversityTabContent;
