import React, { useState, useEffect } from 'react';
import { DepartmentHeader } from './components/DepartmentHeader.jsx';
import { DepartmentSidebar } from './components/DepartmentSidebar.jsx';
import { DepartmentOverview } from './components/DepartmentOverview.jsx';
import { DepartmentProblemsPanel } from './components/DepartmentProblemsPanel.jsx';
import { DepartmentProblemActionPanel } from './components/DepartmentProblemActionPanel.jsx';
import { DepartmentTechniciansPanel } from './components/DepartmentTechniciansPanel.jsx';
import { DepartmentDistrictsPanel } from './components/DepartmentDistrictsPanel.jsx';
import { DepartmentCsrGrantPanel } from './components/DepartmentCsrGrantPanel.jsx';
import { DepartmentPrototypesPanel } from './components/DepartmentPrototypesPanel.jsx';
import { AddTechnicianModal } from './components/AddTechnicianModal.jsx';
import { AddDistrictModal } from './components/AddDistrictModal.jsx';
import { ViewTechnicianModal } from './components/ViewTechnicianModal.jsx';
import { EditTechnicianModal } from './components/EditTechnicianModal.jsx';
import { AssignToTechnicianModal } from './components/AssignToTechnicianModal.jsx';
import { DepartmentBudgetOfficersPanel } from './components/DepartmentBudgetOfficersPanel.jsx';
import { DepartmentBudgetReviewPanel } from './components/DepartmentBudgetReviewPanel.jsx';
import { AddBudgetOfficerModal } from './components/AddBudgetOfficerModal.jsx';
import { ViewBudgetOfficerModal } from './components/ViewBudgetOfficerModal.jsx';
import { EditBudgetOfficerModal } from './components/EditBudgetOfficerModal.jsx';
import { AssignBudgetOfficerModal } from './components/AssignBudgetOfficerModal.jsx';
import { DepartmentMobileNav } from './components/DepartmentMobileNav.jsx';
import { GovernmentFooter } from '../government/components/layout/GovernmentFooter.jsx';
import { departmentService } from '../government/services/departmentService.js';
import { citizenService } from '../citizen/services/citizenService.js';
import technicianService from '../government/services/technicianService.js';
import { budgetOfficerService } from '../government/services/budgetOfficerService.js';
import { projectCsrSyncService } from '../government/services/projectCsrSyncService.js';

import { filterDepartmentChallenges } from './components/departmentChallengeFilter.helper.js';

export const DepartmentPortal = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [department, setDepartment] = useState(null);
  const [allDepartments, setAllDepartments] = useState([]);
  const [problems, setProblems] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [budgetOfficers, setBudgetOfficers] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals State
  const [isAddTechOpen, setIsAddTechOpen] = useState(false);
  const [showAddBudgetOfficerModal, setShowAddBudgetOfficerModal] = useState(false);
  const [isAddDistrictOpen, setIsAddDistrictOpen] = useState(false);
  const [viewingTech, setViewingTech] = useState(null);
  const [editingTech, setEditingTech] = useState(null);
  const [viewingBudgetOfficer, setViewingBudgetOfficer] = useState(null);
  const [editingBudgetOfficer, setEditingBudgetOfficer] = useState(null);
  const [assigningProblemTech, setAssigningProblemTech] = useState(null);
  const [assigningBudgetProblem, setAssigningBudgetProblem] = useState(null);

  const getDeptIdFromUrl = () => {
    if (typeof window === 'undefined') return null;
    const q = new URLSearchParams(window.location.search).get('deptId');
    if (q) return q;
    const m = window.location.pathname.match(/\/department\/([^/?#]+)/i);
    return m ? m[1] : null;
  };
  const queryDeptId = getDeptIdFromUrl();
  const isWardDept = department?.category === 'Ward Commissioner' || department?.category === 'Ward' || department?.category === 'Ward Office';

  const loadData = async () => {
    try {
      setLoading(true);
      const resDepts = await departmentService.getDepartments({ limit: 100 });
      const depts = resDepts?.data || (Array.isArray(resDepts) ? resDepts : []) || [];
      setAllDepartments(depts);

      let matched = null;
      if (queryDeptId) {
        matched = depts.find((d) =>
          d.deptId?.toLowerCase() === queryDeptId.toLowerCase() ||
          d.id === queryDeptId ||
          d._id?.toString() === queryDeptId ||
          d.code?.toLowerCase() === queryDeptId.toLowerCase()
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
      if (!matched && depts.length > 0) matched = depts[0];
      setDepartment(matched);

      const isDistrict = matched?.category === 'District Department';
      const isBlock = matched?.category === 'Block / Tehsil Office';
      const isWard = matched?.category === 'Ward Commissioner' || matched?.category === 'Ward' || matched?.category === 'Ward Office';
      const subDepts = isWard ? [] : depts.filter((d) => isBlock ? (d.category === 'Ward Commissioner' || d.category === 'Ward') : (isDistrict ? (d.category === 'Block / Tehsil Office' || d.category === 'Gram Panchayat') : d.category === 'District Department'));
      setDistricts(subDepts);

      const resChallenges = await citizenService.fetchChallenges({ limit: 200 });
      const allChls = resChallenges?.challenges || (Array.isArray(resChallenges) ? resChallenges : []) || [];
      setProblems(filterDepartmentChallenges(allChls, matched));

      let fetchedBOs = [];
      if (matched) {
        const techRes = await technicianService.getTechnicians({
          departmentId: matched.deptId || matched.id,
          departmentName: matched.name,
          block: matched.block,
          district: matched.district
        });
        setTechnicians(techRes?.data?.data || techRes?.data || []);

        const boRes = await budgetOfficerService.getOfficers({
          departmentName: matched?.name
        });
        fetchedBOs = boRes?.data?.data || boRes?.data || [];
        setBudgetOfficers(fetchedBOs);
      }

      // Sync projects from projectCsrSyncService
      await projectCsrSyncService.initializeFromBackend();
      const allProjects = projectCsrSyncService.getActiveProjects();
      // Combine with fetched citizen challenges (in a real app, backend handles this unification)
      // For now, we will merge any project that is assigned to this department
      setProblems(prev => {
        const merged = [...prev];
        allProjects.forEach(proj => {
          const idx = merged.findIndex(p => p.id === proj.id || p.challengeId === proj.challengeId || (proj.projectId && (p.id === proj.projectId || p.projectId === proj.projectId)));
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], ...proj };
          } else if (
            (proj.handoverDepartment && matched?.name && proj.handoverDepartment.toLowerCase().trim() === matched.name.toLowerCase().trim()) ||
            (proj.assignedBudgetOfficer && fetchedBOs.some(bo => String(bo.officerId || bo.id || bo._id) === String(proj.assignedBudgetOfficer.officerId)))
          ) {
            merged.push(proj);
          }
        });
        return merged;
      });

    } catch (err) {
      console.warn('Error loading department portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handlePopState = () => loadData();
    window.addEventListener('popstate', handlePopState);
    const unsub = projectCsrSyncService.subscribe((_, data) => {
      if (data?.updatedProjects) {
        setProblems(prev => {
          const merged = [...prev];
          data.updatedProjects.forEach(proj => {
            const idx = merged.findIndex(p => p.id === proj.id || p.challengeId === proj.challengeId || (proj.projectId && (p.id === proj.projectId || p.projectId === proj.projectId)));
            if (idx >= 0) {
              merged[idx] = { ...merged[idx], ...proj };
            } else if (
              (proj.handoverDepartment && department?.name && proj.handoverDepartment.toLowerCase().trim() === department.name.toLowerCase().trim()) ||
              (proj.assignedBudgetOfficer && budgetOfficers.some(bo => String(bo.officerId || bo.id || bo._id) === String(proj.assignedBudgetOfficer.officerId)))
            ) {
              merged.push(proj);
            }
          });
          return merged;
        });
      }
    });
    return () => {
      window.removeEventListener('popstate', handlePopState);
      unsub();
    };
  }, [queryDeptId]);

  const handleUpdateProblem = (updated) => {
    const targetId = updated.challengeId || updated.id || updated._id;
    setProblems((prev) => prev.map((p) => ((p.challengeId || p.id || p._id) === targetId ? updated : p)));

    // Only update the selected problem if we are already viewing it in the Action Panel
    if (selectedProblem && (selectedProblem.challengeId || selectedProblem.id || selectedProblem._id) === targetId) {
      setSelectedProblem(updated);
    }
  };

  const handleAssignBudgetOfficer = (problem, officer) => {
    projectCsrSyncService.assignToBudgetOfficer(problem.id || problem.challengeId || problem._id, officer);
    handleUpdateProblem({
      ...problem,
      assignedBudgetOfficer: {
        officerId: officer._id || officer.id || officer.officerId,
        name: officer.fullName || officer.name,
        status: 'Assigned',
        assignedAt: new Date().toISOString()
      }
    });
  };

  const handleSubmitBudgetToGovt = (problem) => {
    projectCsrSyncService.submitBudgetToGovernment(problem.id || problem.challengeId || problem._id);
    handleUpdateProblem({
      ...problem,
      assignedBudgetOfficer: {
        ...problem.assignedBudgetOfficer,
        status: 'Forwarded',
        forwardedAt: new Date().toISOString()
      }
    });
  };
  const handleCreatedTech = (tech) => setTechnicians((prev) => [tech, ...prev]);
  const handleUpdatedTech = (updated) => {
    const id = updated.technicianId || updated.id || updated._id;
    setTechnicians((prev) => prev.map((t) => ((t.technicianId || t.id || t._id) === id ? updated : t)));
  };
  const handleDeletedTech = (techId) => setTechnicians((prev) => prev.filter((t) => (t.technicianId || t.id || t._id) !== techId));

  const handleCreatedBudgetOfficer = (bo) => setBudgetOfficers((prev) => [bo, ...prev]);
  const handleUpdatedBudgetOfficer = (updated) => {
    setBudgetOfficers((prev) => prev.map((b) => ((b.officerId || b.id || b._id) === (updated.officerId || updated.id || updated._id) ? updated : b)));
  };
  const handleDeletedBudgetOfficer = (boId) => {
    setBudgetOfficers((prev) => prev.filter((b) => (b.officerId || b.id || b._id) !== boId));
  };

  const handleCreatedDistrict = (dist) => setDistricts((prev) => [dist, ...prev]);
  const handleDeletedDistrict = (distId) => setDistricts((prev) => prev.filter((d) => (d.id || d._id) !== distId));

  const renderContent = () => {
    if (selectedProblem) {
      return <DepartmentProblemActionPanel problem={selectedProblem} department={department} onClose={() => setSelectedProblem(null)} onUpdateProblem={handleUpdateProblem} onAssignTechnician={setAssigningProblemTech} />;
    }

    switch (activeTab) {
      case 'problems':
        return <DepartmentProblemsPanel problems={problems} onSelectProblem={(p) => setSelectedProblem(p)} onAssignToTech={setAssigningProblemTech} />;
      case 'prototypes':
        return <DepartmentPrototypesPanel problems={problems} onAssignToBudgetOfficer={setAssigningBudgetProblem} />;
      case 'technicians':
      case 'field-workers':
        return <DepartmentTechniciansPanel technicians={technicians} department={department} onAddTech={() => setIsAddTechOpen(true)} onViewTech={setViewingTech} onEditTech={setEditingTech} onDeletedTech={handleDeletedTech} />;
      case 'budget-officers':
        return (
          <DepartmentBudgetOfficersPanel
            officers={budgetOfficers}
            department={department}
            onAddOfficer={() => setShowAddBudgetOfficerModal(true)}
            onViewOfficer={setViewingBudgetOfficer}
            onEditOfficer={setEditingBudgetOfficer}
            onDeletedOfficer={handleDeletedBudgetOfficer}
          />
        );
      case 'budget-approvals':
        return <DepartmentBudgetReviewPanel problems={problems} onSubmitToGovernment={handleSubmitBudgetToGovt} />;
      case 'csr-grant':
        return <DepartmentCsrGrantPanel department={department} problems={problems} />;
      case 'districts':
        if (isWardDept) return <DepartmentOverview department={department} problems={problems} onSelectProblem={(p) => setSelectedProblem(p)} onNavigateProblems={() => setActiveTab('problems')} />;
        return <DepartmentDistrictsPanel districts={districts} isDistrictDept={department?.category === 'District Department'} isBlockDept={department?.category === 'Block / Tehsil Office'} onAddDistrict={() => setIsAddDistrictOpen(true)} onDeletedDistrict={handleDeletedDistrict} />;
      case 'overview':
      default:
        return <DepartmentOverview department={department} problems={problems} onSelectProblem={(p) => setSelectedProblem(p)} onNavigateProblems={() => setActiveTab('problems')} />;
    }
  };

  const handleSelectDepartment = (targetDept) => {
    setDepartment(targetDept);
    const url = new URL(window.location);
    url.searchParams.set('deptId', targetDept.deptId || targetDept.id || targetDept._id);
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden h-screen text-slate-800 antialiased select-none">
      <DepartmentHeader
        department={department}
        activeTab={activeTab}
        onNavigateTab={(t) => { setSelectedProblem(null); setActiveTab(t); setIsMobileMenuOpen(false); }}
        onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        allDepartments={allDepartments}
        onSelectDepartment={handleSelectDepartment}
      />

      <div className="flex-1 flex flex-row min-w-0 min-h-0 overflow-hidden bg-white">
        <DepartmentSidebar activeTab={activeTab} setActiveTab={(t) => { setSelectedProblem(null); setActiveTab(t); setIsMobileMenuOpen(false); }} isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} departmentName={department?.name || 'Department Authority'} departmentCategory={department?.category || 'State Ministry'} onLogout={onLogout} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
          <main className="flex-1 p-3 sm:p-4 overflow-y-auto min-h-0 custom-scrollbar pb-20 md:pb-4">
            <div className="max-w-7xl mx-auto w-full">
              {loading ? <div className="py-20 text-center text-slate-400 font-bold text-xs">Loading Department Dashboard...</div> : renderContent()}
            </div>
          </main>
          <GovernmentFooter />
        </div>
      </div>

      <DepartmentMobileNav activeTab={activeTab} onSelectTab={(t) => { setSelectedProblem(null); setActiveTab(t); setIsMobileMenuOpen(false); }} problemCount={problems.length} techCount={technicians.length} districtCount={districts.length} isWard={isWardDept} />

      {/* Modals */}
      <AddTechnicianModal department={department} isOpen={isAddTechOpen} onClose={() => setIsAddTechOpen(false)} onCreated={handleCreatedTech} />
      <AddBudgetOfficerModal
        isOpen={showAddBudgetOfficerModal}
        onClose={() => setShowAddBudgetOfficerModal(false)}
        department={department}
        onCreated={handleCreatedBudgetOfficer}
      />
      <ViewBudgetOfficerModal officer={viewingBudgetOfficer} isOpen={Boolean(viewingBudgetOfficer)} onClose={() => setViewingBudgetOfficer(null)} />
      <EditBudgetOfficerModal officer={editingBudgetOfficer} isOpen={Boolean(editingBudgetOfficer)} onClose={() => setEditingBudgetOfficer(null)} onUpdated={handleUpdatedBudgetOfficer} />

      {!isWardDept && <AddDistrictModal isOpen={isAddDistrictOpen} onClose={() => setIsAddDistrictOpen(false)} onCreated={handleCreatedDistrict} isDistrictDept={department?.category === 'District Department'} isBlockDept={department?.category === 'Block / Tehsil Office'} />}
      <ViewTechnicianModal technician={viewingTech} isOpen={Boolean(viewingTech)} onClose={() => setViewingTech(null)} />
      <EditTechnicianModal technician={editingTech} isOpen={Boolean(editingTech)} onClose={() => setEditingTech(null)} onUpdated={handleUpdatedTech} />
      <AssignToTechnicianModal challenge={assigningProblemTech} technicians={technicians} isOpen={Boolean(assigningProblemTech)} onClose={() => setAssigningProblemTech(null)} onAssigned={handleUpdateProblem} />
      <AssignBudgetOfficerModal problem={assigningBudgetProblem} officers={budgetOfficers} isOpen={Boolean(assigningBudgetProblem)} onClose={() => setAssigningBudgetProblem(null)} onAssign={handleAssignBudgetOfficer} />
    </div>
  );
};

export default DepartmentPortal;
