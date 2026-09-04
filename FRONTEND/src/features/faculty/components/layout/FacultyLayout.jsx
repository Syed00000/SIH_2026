import React, { useState, useEffect, useMemo } from 'react';
import { FacultyHeader } from './FacultyHeader.jsx';
import { FacultySidebar } from './FacultySidebar.jsx';
import { FacultyDashboard } from '../dashboard/FacultyDashboard.jsx';
import { FacultyAssignedChallenges } from '../challenges/FacultyAssignedChallenges.jsx';
import { FacultyProposalsPanel } from '../proposals/FacultyProposalsPanel.jsx';
import { FacultyTeamsPanel } from '../teams/FacultyTeamsPanel.jsx';
import { FacultyProjectsPanel } from '../projects/FacultyProjectsPanel.jsx';
import { FacultyProjectWorkspace } from '../projects/FacultyProjectWorkspace.jsx';
import { FacultyProfilePanel } from '../profile/FacultyProfilePanel.jsx';
import { FacultyRevisionsPanel } from '../revisions/FacultyRevisionsPanel.jsx';
import { FacultyNotificationsPanel } from './FacultyNotificationsPanel.jsx';
import { facultyApiService } from '../../services/facultyApiService.js';

export const FacultyLayout = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    faculty: null,
    challenges: [],
    projects: [],
    approvals: [],
    revisions: []
  });

  const facultyEmail = user?.email || 'binod@ru.ac.in';
  const rawCode = user?.profile?.universityCode || user?.profile?.aisheCode || user?.profile?.code || 'RU001';
  const universityCode = rawCode;

  const loadData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await facultyApiService.getFacultyData(facultyEmail, universityCode);
      if (res && res.projects) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load faculty workspace:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Auto-sync every 4 seconds so university authority reviews show up live
    const interval = setInterval(() => {
      loadData(true);
    }, 4000);

    const onFocus = () => loadData(true);
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [facultyEmail, universityCode]);

  const facultyName = data.faculty?.name || user?.fullName || 'Dr. Binod Kumar';
  const facultyRole = data.faculty?.designation || user?.profile?.designation || 'Senior Research Scientist';
  const facultyDept = data.faculty?.department || user?.profile?.department || 'Electrical & Electronics';
  const uniName = data.faculty?.universityName || 'Ranchi University';

  const projectRevisionsCount = (data.projects || []).filter((p) => {
    const s = `${p.budgetStatus} ${p.prototypeStatus} ${p.governmentStatus} ${p.status}`.toLowerCase();
    return s.includes('changes required') || Boolean(p.adminRemarks && s.includes('changes'));
  }).length;
  const totalRevisionCount = Math.max(projectRevisionsCount, (data.revisions || []).length);

  // Dynamic notifications list: preserves ALL revision messages & database activities
  const notificationsList = useMemo(() => {
    const list = [
      ...(data.activities || []).map((a) => ({
        id: `act-${a.id || a._id}`,
        title: a.title || (a.type === 'directive' ? 'University Revision Directive' : 'Institutional Notification'),
        message: a.description || a.text,
        type: a.type || 'directive',
        projectId: a.projectId,
        challengeId: a.challengeId,
        date: a.time || a.timestamp || new Date().toISOString()
      })),
      ...(data.projects || []).filter((p) => p.adminRemarks || p.universityRemarks).map((p) => ({
        id: `notif-${p.projectId || p.challengeId}`,
        title: `University Directive: ${p.title || p.projectId}`,
        message: p.adminRemarks || p.universityRemarks,
        type: 'directive',
        projectId: p.projectId || p.challengeId,
        date: p.updatedAt || new Date().toISOString()
      })),
      ...(data.approvals || []).flatMap((app) =>
        (app.history || [])
          .filter((h) => h.action === 'Changes Requested' || h.action?.includes('Revision'))
          .map((h, idx) => ({
            id: `rev-hist-${app.approvalId || app.projectId}-${idx}`,
            title: `Revision Feedback #${idx + 1}: ${app.project || app.title || 'Proposal'}`,
            message: h.note || 'Revision requested by University Authority.',
            type: 'directive',
            projectId: app.projectId || app.approvalId?.replace('APP-', ''),
            challengeId: app.challengeId,
            date: h.timestamp || app.date || new Date().toISOString()
          }))
      )
    ];
    const seen = new Set();
    return list.filter((i) => {
      const k = `${i.projectId || ''}_${(i.message || '').trim().toLowerCase()}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [data.activities, data.projects, data.approvals]);

  const totalNotificationCount = notificationsList.length;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col h-screen overflow-hidden text-slate-900 font-sans select-none">
      <FacultyHeader
        universityName={uniName}
        facultyName={facultyName}
        facultyRole={facultyRole}
        department={facultyDept}
        universityCode={universityCode}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        onExportPdf={() => window.print()}
        notificationCount={totalNotificationCount}
        notifications={notificationsList}
        onViewAllNotifications={() => setActiveTab('notifications')}
        onClearNotifications={() => loadData(false)}
        onSelectNotification={(n) => {
          if (n.projectId) {
            setSelectedProjectId(n.projectId);
            setActiveTab('project-workspace');
          }
        }}
        onProfileClick={() => setActiveTab('profile')}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        <FacultySidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onLogout={onLogout}
          universityName={uniName}
          facultyName={facultyName}
          revisionCount={totalRevisionCount}
        />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#f8fafc]">
          <main className="flex-1 p-3.5 md:p-5 overflow-y-auto min-h-0">
            {loading ? (
              <div className="flex items-center justify-center h-64 text-xs font-bold text-slate-600">
                Loading Faculty Mentorship Workspace...
              </div>
            ) : activeTab === 'notifications' ? (
              <FacultyNotificationsPanel
                onBack={() => setActiveTab('dashboard')}
                universityCode={universityCode}
                notifications={notificationsList}
                onNavigateProject={(id) => { setSelectedProjectId(id); setActiveTab('project-workspace'); }}
                onClearNotifications={() => loadData(false)}
              />
            ) : activeTab === 'challenges' ? (
              <FacultyAssignedChallenges challenges={data.challenges} faculty={data.faculty} onDraftProposal={() => setActiveTab('dashboard')} />
            ) : activeTab === 'revisions' ? (
              <FacultyRevisionsPanel revisions={data.revisions || []} projects={data.projects || []} faculty={data.faculty} onRefresh={loadData} onNavigateTab={(t, id) => { if (id) setSelectedProjectId(id); setActiveTab(t); }} />
            ) : activeTab === 'project-workspace' ? (
              <FacultyProjectWorkspace project={data.projects.find(p => p.projectId === selectedProjectId || p.challengeId === selectedProjectId)} projects={data.projects} faculty={data.faculty} onRefresh={loadData} onBack={() => setActiveTab('dashboard')} />
            ) : activeTab === 'projects' ? (
              <FacultyProjectsPanel projects={data.projects} faculty={data.faculty} onRefresh={loadData} onNavigateTab={setActiveTab} />
            ) : activeTab === 'teams' ? (
              <FacultyTeamsPanel projects={data.projects} faculty={data.faculty} onRefresh={loadData} />
            ) : activeTab === 'profile' ? (
              <FacultyProfilePanel faculty={data.faculty} onRefresh={loadData} />
            ) : (
              <FacultyDashboard faculty={data.faculty} challenges={data.challenges} projects={data.projects} onNavigateTab={(t, id) => { if (id) setSelectedProjectId(id); setActiveTab(t); }} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default FacultyLayout;
