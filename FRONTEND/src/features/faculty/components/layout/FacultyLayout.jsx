import React, { useState, useEffect } from 'react';
import { FacultyHeader } from './FacultyHeader.jsx';
import { FacultySidebar } from './FacultySidebar.jsx';
import { FacultyTabContent } from './FacultyTabContent.jsx';
import { useFacultyNotifications } from '../../hooks/useFacultyNotifications.js';
import { facultyApiService } from '../../services/facultyApiService.js';

const VALID_TABS = ['dashboard', 'challenges', 'projects', 'revisions', 'teams', 'profile', 'project-workspace', 'notifications'];

export const FacultyLayout = ({ user, onLogout }) => {
  const getInitialTab = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab');
      if (urlTab && VALID_TABS.includes(urlTab)) return urlTab;
      const stored = localStorage.getItem('joharsetu_faculty_active_tab');
      if (stored && VALID_TABS.includes(stored)) return stored;
    } catch {}
    return 'dashboard';
  };

  const getInitialProjectId = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlId = params.get('projectId');
      if (urlId) return urlId;
      const stored = localStorage.getItem('joharsetu_faculty_project_id');
      if (stored) return stored;
    } catch {}
    return null;
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [selectedProjectId, setSelectedProjectId] = useState(getInitialProjectId);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ faculty: null, challenges: [], projects: [], approvals: [], revisions: [] });

  const { totalRevisionCount, notificationsList, totalNotificationCount } = useFacultyNotifications(data);

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
    } catch {}
  };

  useEffect(() => {
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlTab = params.get('tab');
        const urlProjectId = params.get('projectId');
        if (urlTab && VALID_TABS.includes(urlTab)) setActiveTab(urlTab);
        if (urlProjectId) setSelectedProjectId(urlProjectId);
      } catch {}
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const facultyEmail = user?.email || 'binod@ru.ac.in';
  const universityCode = user?.profile?.universityCode || user?.profile?.aisheCode || user?.profile?.code || 'RU001';

  const loadData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await facultyApiService.getFacultyData(facultyEmail, universityCode);
      if (res && res.projects) setData(res);
    } catch (err) {
      console.error('Failed to load faculty workspace:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(true), 4000);
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
          if (n.projectId) handleSetActiveTab('project-workspace', n.projectId);
        }}
        onProfileClick={() => handleSetActiveTab('profile')}
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
            <FacultyTabContent
              loading={loading}
              activeTab={activeTab}
              selectedProjectId={selectedProjectId}
              data={data}
              universityCode={universityCode}
              notificationsList={notificationsList}
              handleSetActiveTab={handleSetActiveTab}
              setSelectedProjectId={setSelectedProjectId}
              loadData={loadData}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default FacultyLayout;
