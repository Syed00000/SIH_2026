import React, { useState, useEffect } from 'react';
import { DepartmentHeader } from './components/DepartmentHeader.jsx';
import { DepartmentSidebar } from './components/DepartmentSidebar.jsx';
import { DepartmentOverview } from './components/DepartmentOverview.jsx';
import { DepartmentProblemsPanel } from './components/DepartmentProblemsPanel.jsx';
import { DepartmentProblemActionPanel } from './components/DepartmentProblemActionPanel.jsx';
import { DepartmentProfilePanel } from './components/DepartmentProfilePanel.jsx';
import { GovernmentFooter } from '../government/components/layout/GovernmentFooter.jsx';
import { departmentService } from '../government/services/departmentService.js';
import { citizenService } from '../citizen/services/citizenService.js';

export const DepartmentPortal = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [department, setDepartment] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null);

  const queryDeptId = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('deptId')
    : null;

  const loadData = async () => {
    try {
      setLoading(true);
      const resDepts = await departmentService.getDepartments({ limit: 100 });
      const depts = resDepts?.data || (Array.isArray(resDepts) ? resDepts : []) || [];
      
      let matched = null;
      if (queryDeptId) {
        matched = depts.find(
          (d) => d.deptId === queryDeptId || d.id === queryDeptId || d._id?.toString() === queryDeptId
        );
      }
      if (!matched && (user?.deptId || user?.profile?.deptId)) {
        const uId = user.deptId || user.profile?.deptId;
        matched = depts.find((d) => d.deptId === uId || d.id === uId || d._id?.toString() === uId);
      }
      if (!matched && (user?.department || user?.profile?.department)) {
        const uDeptName = (user.department || user.profile?.department || '').toLowerCase();
        matched = depts.find((d) => d.name?.toLowerCase().includes(uDeptName));
      }
      if (!matched && depts.length > 0) {
        matched = depts[0];
      }

      setDepartment(matched);

      // Load live challenges assigned to this department
      const resChallenges = await citizenService.fetchChallenges({ limit: 200 });
      const allChls = resChallenges?.challenges || (Array.isArray(resChallenges) ? resChallenges : []) || [];
      
      if (matched) {
        const targetId = (matched.deptId || matched.id || '').toUpperCase();
        const targetName = (matched.name || '').toLowerCase();
        const deptChls = allChls.filter((c) => {
          const aId = (c.assignedDepartment?.deptId || c.assignedDepartment?.id || '').toUpperCase();
          if (aId && (aId === targetId || aId === matched._id?.toString().toUpperCase())) return true;
          const aName = (c.assignedDepartment?.name || '').toLowerCase();
          if (aName && (aName === targetName || targetName.includes(aName) || aName.includes(targetName))) return true;
          const resDept = (c.resolutionDossier?.department || '').toLowerCase();
          if (resDept && (resDept === targetName || targetName.includes(resDept) || resDept.includes(targetName))) return true;
          return false;
        });
        setProblems(deptChls);
      }
    } catch (err) {
      console.warn('Error loading department portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [queryDeptId]);

  const handleUpdateProblem = (updated) => {
    const targetId = updated.challengeId || updated.id || updated._id;
    setProblems((prev) =>
      prev.map((p) => ((p.challengeId || p.id || p._id) === targetId ? updated : p))
    );
    setSelectedProblem(updated);
  };

  const handleBackToNodal = () => {
    window.location.href = '/nodal';
  };

  const renderContent = () => {
    if (selectedProblem) {
      return (
        <DepartmentProblemActionPanel
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onUpdateProblem={handleUpdateProblem}
        />
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <DepartmentOverview
            department={department}
            problems={problems}
            onSelectProblem={(p) => setSelectedProblem(p)}
            onNavigateProblems={() => setActiveTab('problems')}
          />
        );
      case 'problems':
        return (
          <DepartmentProblemsPanel
            problems={problems}
            onSelectProblem={(p) => setSelectedProblem(p)}
          />
        );
      case 'profile':
        return <DepartmentProfilePanel department={department} />;
      default:
        return (
          <DepartmentOverview
            department={department}
            problems={problems}
            onSelectProblem={(p) => setSelectedProblem(p)}
            onNavigateProblems={() => setActiveTab('problems')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden h-screen text-slate-800 antialiased select-none">
      <DepartmentHeader
        department={department}
        activeTab={activeTab}
        onNavigateTab={(t) => { setSelectedProblem(null); setActiveTab(t); }}
        onBackToNodal={handleBackToNodal}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-row min-w-0 min-h-0 overflow-hidden bg-white">
        <DepartmentSidebar
          activeTab={activeTab}
          setActiveTab={(t) => { setSelectedProblem(null); setActiveTab(t); }}
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
          departmentName={department?.name || 'Department Authority'}
          onLogout={onLogout}
        />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
          <main className="flex-1 p-3 sm:p-4 overflow-y-auto min-h-0 custom-scrollbar">
            <div className="max-w-7xl mx-auto w-full">
              {loading ? (
                <div className="py-20 text-center text-slate-400 font-bold text-xs">
                  Loading Department Dashboard...
                </div>
              ) : (
                renderContent()
              )}
            </div>
          </main>
          <GovernmentFooter />
        </div>
      </div>
    </div>
  );
};

export default DepartmentPortal;
