import React, { useState, useEffect } from 'react';
import { FacultyHeader } from './FacultyHeader.jsx';
import { FacultySidebar } from './FacultySidebar.jsx';
import { FacultyDashboard } from '../dashboard/FacultyDashboard.jsx';
import { FacultyAssignedChallenges } from '../challenges/FacultyAssignedChallenges.jsx';
import { FacultyProposalsPanel } from '../proposals/FacultyProposalsPanel.jsx';
import { FacultyTeamsPanel } from '../teams/FacultyTeamsPanel.jsx';
import { FacultyProjectsPanel } from '../projects/FacultyProjectsPanel.jsx';
import { FacultyProjectWorkspace } from '../projects/FacultyProjectWorkspace.jsx';
import { FacultyProfilePanel } from '../profile/FacultyProfilePanel.jsx';
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
    projects: []
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

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col h-screen overflow-hidden text-slate-900 font-sans select-none">
      {/* Top Header */}
      <FacultyHeader
        universityName={uniName}
        facultyName={facultyName}
        facultyRole={facultyRole}
        department={facultyDept}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        onExportPdf={() => window.print()}
        notificationCount={3}
      />

      {/* Main Workspace Layout with Sidebar and Content Container */}
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
        />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#f8fafc]">
          <main className="flex-1 p-3.5 md:p-5 overflow-y-auto min-h-0">
            {loading ? (
              <div className="flex items-center justify-center h-64 text-xs font-bold text-slate-600">
                Loading Faculty Mentorship Workspace...
              </div>
            ) : activeTab === 'dashboard' ? (
              <FacultyDashboard
                faculty={data.faculty}
                challenges={data.challenges}
                projects={data.projects}
                onNavigateTab={(tab, id = null) => {
                  if (id) setSelectedProjectId(id);
                  setActiveTab(tab);
                }}
              />
            ) : activeTab === 'challenges' ? (
              <FacultyAssignedChallenges
                challenges={data.challenges}
                faculty={data.faculty}
                onDraftProposal={() => setActiveTab('dashboard')} // redirect since global proposal tab is removed
              />
            ) : activeTab === 'project-workspace' ? (
              <FacultyProjectWorkspace
                project={data.projects.find(p => p.projectId === selectedProjectId || p.challengeId === selectedProjectId)}
                projects={data.projects}
                faculty={data.faculty}
                onRefresh={loadData}
                onBack={() => setActiveTab('dashboard')}
              />
            ) : activeTab === 'projects' ? (
              <FacultyProjectsPanel
                projects={data.projects}
                faculty={data.faculty}
                onRefresh={loadData}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            ) : activeTab === 'teams' ? (
              <FacultyTeamsPanel
                projects={data.projects}
                faculty={data.faculty}
                onRefresh={loadData}
              />
            ) : activeTab === 'profile' ? (
              <FacultyProfilePanel
                faculty={data.faculty}
                onRefresh={loadData}
              />
            ) : (
              <FacultyDashboard
                faculty={data.faculty}
                challenges={data.challenges}
                projects={data.projects}
                onNavigateTab={(tab, id = null) => {
                  if (id) setSelectedProjectId(id);
                  setActiveTab(tab);
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
