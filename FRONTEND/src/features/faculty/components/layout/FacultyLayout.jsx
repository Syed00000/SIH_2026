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
  const getInitialTab = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab');
      const validTabs = ['dashboard', 'challenges', 'projects', 'revisions', 'teams', 'profile', 'project-workspace'];
      if (urlTab && validTabs.includes(urlTab)) return urlTab;
      const stored = localStorage.getItem('joharsetu_faculty_active_tab');
      if (stored && validTabs.includes(stored)) return stored;
    } catch {
      // fallback
    }
    return 'dashboard';
  };

  const getInitialProjectId = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlId = params.get('projectId');
      if (urlId) return urlId;
      const stored = localStorage.getItem('joharsetu_faculty_project_id');
      if (stored) return stored;
    } catch {
      // fallback
    }
    return null;
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [selectedProjectId, setSelectedProjectId] = useState(getInitialProjectId);
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

  const handleSetActiveTab = (tab, projectId = null) => {
    setActiveTab(tab);
    if (projectId) {
      setSelectedProjectId(projectId);
    } else if (tab !== 'project-workspace') {
      setSelectedProjectId(null);
    }

    try {
      localStorage.setItem('joharsetu_faculty_active_tab', tab);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);

      const targetProjectId = projectId || (tab === 'project-workspace' ? selectedProjectId : null);
      if (tab === 'project-workspace' && targetProjectId) {
        url.searchParams.set('projectId', targetProjectId);
        localStorage.setItem('joharsetu_faculty_project_id', targetProjectId);
      } else if (tab !== 'project-workspace') {
        url.searchParams.delete('projectId');
        localStorage.removeItem('joharsetu_faculty_project_id');
      }

      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlTab = params.get('tab');
        const urlProjectId = params.get('projectId');
        const validTabs = ['dashboard', 'challenges', 'projects', 'revisions', 'teams', 'profile', 'project-workspace'];
        if (urlTab && validTabs.includes(urlTab)) {
          setActiveTab(urlTab);
        }
        if (urlProjectId) {
          setSelectedProjectId(urlProjectId);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
      ...(data.projects || []).filter((p) => p.prototypeWorkRequested).map((p) => ({
        id: `proto-dir-${p.projectId || p.challengeId}`,
        title: `🚀 Directive: Start Prototype Work (${p.title || p.projectId})`,
        message: '1st Grant Installment received from State Escrow. Ranchi University Authority has officially authorized your team to start prototype development!',
        type: 'directive',
        projectId: p.projectId || p.challengeId,
        date: p.prototypeWorkRequestedAt || p.updatedAt || new Date().toISOString()
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
    <div className="min-h-screen bg-white flex flex-col h-screen overflow-hidden text-slate-900 font-sans select-none">
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
        onViewAllNotifications={() => handleSetActiveTab('notifications')}
        onClearNotifications={() => loadData(false)}
        onSelectNotification={(n) => {
          if (n.projectId) {
            handleSetActiveTab('project-workspace', n.projectId);
          }
        }}
        onProfileClick={() => setActiveTab('profile')}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        <FacultySidebar
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onLogout={onLogout}
          universityName={uniName}
          facultyName={facultyName}
          revisionCount={totalRevisionCount}
        />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
          <main className="flex-1 p-3.5 md:p-5 overflow-y-auto min-h-0">
            {loading ? (
              <div className="flex items-center justify-center h-64 text-xs font-bold text-slate-600">
                Loading Faculty Mentorship Workspace...
              </div>
            ) : activeTab === 'notifications' ? (
              <FacultyNotificationsPanel
                onBack={() => handleSetActiveTab('dashboard')}
                universityCode={universityCode}
                notifications={notificationsList}
                onNavigateProject={(id) => { setSelectedProjectId(id); handleSetActiveTab('project-workspace', id); }}
                onClearNotifications={() => loadData(false)}
              />
            ) : activeTab === 'dashboard' ? (
              <FacultyDashboard
                faculty={data.faculty}
                challenges={data.challenges}
                projects={data.projects}
                onNavigateTab={(tab, id = null) => {
                  handleSetActiveTab(tab, id);
                }}
              />
            ) : activeTab === 'challenges' ? (
              <FacultyAssignedChallenges
                challenges={data.challenges || []}
                allChallenges={data.allChallenges || []}
                faculty={data.faculty}
                onRefresh={loadData}
                onDraftProposal={() => handleSetActiveTab('dashboard')}
              />
            ) : activeTab === 'revisions' ? (
              <FacultyRevisionsPanel
                revisions={data.revisions || []}
                projects={data.projects || []}
                faculty={data.faculty}
                onRefresh={loadData}
                onNavigateTab={(tab, id = null) => {
                  handleSetActiveTab(tab, id);
                }}
              />
            ) : activeTab === 'project-workspace' ? (
              data.projects.find(p => p.projectId === selectedProjectId || p.challengeId === selectedProjectId) ? (
                <FacultyProjectWorkspace
                  project={data.projects.find(p => p.projectId === selectedProjectId || p.challengeId === selectedProjectId)}
                  projects={data.projects}
                  teams={data.teams || []}
                  faculty={data.faculty}
                  onRefresh={loadData}
                  onBack={() => handleSetActiveTab('dashboard')}
                />
              ) : (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-slate-500 space-y-3">
                  <p className="text-xs font-bold text-slate-700">Project workspace could not locate selected project or is loading.</p>
                  <button
                    onClick={() => handleSetActiveTab('dashboard')}
                    className="px-4 py-2 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
                  >
                    Back to Dashboard
                  </button>
                </div>
              )
            ) : activeTab === 'projects' ? (
              <FacultyProjectsPanel
                projects={data.projects}
                faculty={data.faculty}
                onRefresh={loadData}
                onNavigateTab={(tab, id = null) => handleSetActiveTab(tab, id)}
              />
            ) : activeTab === 'teams' ? (
              <FacultyTeamsPanel
                projects={data.projects || []}
                challenges={data.challenges || data.allChallenges || []}
                teams={data.teams || []}
                faculty={data.faculty}
                onRefresh={loadData}
              />
            ) : activeTab === 'profile' ? (
              <FacultyProfilePanel faculty={data.faculty} onRefresh={loadData} />
            ) : (
              <FacultyDashboard
                faculty={data.faculty}
                challenges={data.challenges}
                projects={data.projects}
                onNavigateTab={(tab, id = null) => {
                  handleSetActiveTab(tab, id);
                }}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default FacultyLayout;
