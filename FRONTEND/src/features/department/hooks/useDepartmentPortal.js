import { useState, useEffect, useRef } from 'react';
import { departmentService } from '../../government/services/departmentService.js';
import { citizenService } from '../../citizen/services/citizenService.js';
import technicianService from '../../government/services/technicianService.js';
import { budgetOfficerService } from '../../government/services/budgetOfficerService.js';
import { projectCsrSyncService } from '../../government/services/projectCsrSyncService.js';
import { filterDepartmentChallenges } from '../components/departmentChallengeFilter.helper.js';
import apiClient from '../../../infrastructure/api/client.js';

export const useDepartmentPortal = ({ user }) => {
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

  // Refs for stale closures
  const departmentRef = useRef(department);
  const budgetOfficersRef = useRef(budgetOfficers);

  useEffect(() => {
    departmentRef.current = department;
  }, [department]);

  useEffect(() => {
    budgetOfficersRef.current = budgetOfficers;
  }, [budgetOfficers]);

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
      const uEmail = (user?.email || '').toLowerCase().trim();
      const uDeptId = (user?.deptId || user?.profile?.deptId || '').toLowerCase().trim();
      const uCode = (user?.code || user?.profile?.code || '').toLowerCase().trim();
      const uCategory = (user?.category || user?.profile?.category || '').toLowerCase().trim();
      const uDistrict = (user?.district || user?.profile?.district || '').toLowerCase().trim();

      // 1. If queryDeptId is present in URL and matches a real department:
      if (queryDeptId) {
        const qLower = queryDeptId.toLowerCase().trim();
        matched = depts.find((d) =>
          d.deptId?.toLowerCase() === qLower ||
          d.id?.toLowerCase() === qLower ||
          d._id?.toString().toLowerCase() === qLower ||
          d.code?.toLowerCase() === qLower ||
          d.credentials?.loginEmail?.toLowerCase() === qLower ||
          d.headEmail?.toLowerCase() === qLower
        );
      }

      // 2. Match by logged-in user credentials (MOST ACCURATE for direct department login)
      if (!matched && uEmail) {
        matched = depts.find((d) =>
          d.credentials?.loginEmail?.toLowerCase() === uEmail ||
          d.headEmail?.toLowerCase() === uEmail ||
          d.email?.toLowerCase() === uEmail ||
          d.credentials?.loginId?.toLowerCase() === uEmail
        );
      }

      // 3. Match by user deptId or code
      if (!matched && (uDeptId || uCode)) {
        matched = depts.find((d) =>
          (uDeptId && (d.deptId?.toLowerCase() === uDeptId || d.id?.toLowerCase() === uDeptId || d._id?.toString().toLowerCase() === uDeptId)) ||
          (uCode && d.code?.toLowerCase() === uCode)
        );
      }

      // 4. Match by userId
      if (!matched && user?.id) {
        matched = depts.find((d) => d.userId?.toString() === user.id.toString());
      }

      // 5. Match by department name + district + category
      if (!matched && (user?.department || user?.profile?.department || user?.fullName)) {
        const uDeptName = (user?.department || user?.profile?.department || user?.fullName || '').toLowerCase().trim();
        matched = depts.find((d) => {
          const nameMatches = d.name?.toLowerCase().includes(uDeptName) || uDeptName.includes(d.name?.toLowerCase());
          const catMatches = !uCategory || d.category?.toLowerCase() === uCategory;
          const distMatches = !uDistrict || d.district?.toLowerCase() === uDistrict;
          return nameMatches && catMatches && distMatches;
        });
        if (!matched) {
          matched = depts.find((d) => {
            const nameMatches = d.name?.toLowerCase().includes(uDeptName) || uDeptName.includes(d.name?.toLowerCase());
            const distMatches = !uDistrict || d.district?.toLowerCase() === uDistrict;
            return nameMatches && distMatches;
          });
        }
        if (!matched) {
          matched = depts.find((d) => d.name?.toLowerCase().includes(uDeptName));
        }
      }

      // 6. Fallback if still not matched
      if (!matched && depts.length > 0) matched = depts[0];

      // Sync URL parameter to the resolved department ID
      if (matched?.deptId && typeof window !== 'undefined') {
        const currentUrlDept = new URLSearchParams(window.location.search).get('deptId');
        if (currentUrlDept !== matched.deptId) {
          const url = new URL(window.location);
          url.searchParams.set('deptId', matched.deptId);
          window.history.replaceState({}, '', url.toString());
        }
      }

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
      const checkDeptMatch = (proj, deptObj, boList = []) => {
        if (!deptObj || !proj) return false;
        const targetName = (deptObj.name || '').toLowerCase();
        const hDept = (proj.handoverDepartment || proj.resolutionDossier?.department || '').toLowerCase();
        if (hDept) {
          if (hDept === targetName || hDept.includes(targetName) || targetName.includes(hDept)) return true;
          const clean1 = hDept.replace(/\([^)]*\)/g, '').replace(/department/g, '').trim();
          const clean2 = targetName.replace(/\([^)]*\)/g, '').replace(/department/g, '').trim();
          if (clean1 && clean2 && (clean1.includes(clean2) || clean2.includes(clean1))) return true;
        }
        if (proj.assignedBudgetOfficer && boList.some(bo => String(bo.officerId || bo.id || bo._id) === String(proj.assignedBudgetOfficer.officerId))) {
          return true;
        }
        return false;
      };

      // Combine with fetched citizen challenges
      setProblems(prev => {
        const merged = [...prev];
        allProjects.forEach(proj => {
          const idx = merged.findIndex(p => p.id === proj.id || p.challengeId === proj.challengeId || (proj.projectId && (p.id === proj.projectId || p.projectId === proj.projectId)));
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], ...proj };
          } else if (matched && checkDeptMatch(proj, matched, fetchedBOs)) {
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

    const checkDeptMatch = (proj, deptObj, boList = []) => {
      if (!deptObj || !proj) return false;
      const targetName = (deptObj.name || '').toLowerCase();
      const hDept = (proj.handoverDepartment || proj.resolutionDossier?.department || '').toLowerCase();
      if (hDept) {
        if (hDept === targetName || hDept.includes(targetName) || targetName.includes(hDept)) return true;
        const clean1 = hDept.replace(/\([^)]*\)/g, '').replace(/department/g, '').trim();
        const clean2 = targetName.replace(/\([^)]*\)/g, '').replace(/department/g, '').trim();
        if (clean1 && clean2 && (clean1.includes(clean2) || clean2.includes(clean1))) return true;
      }
      if (proj.assignedBudgetOfficer && boList.some(bo => String(bo.officerId || bo.id || bo._id) === String(proj.assignedBudgetOfficer.officerId))) {
        return true;
      }
      return false;
    };

    const unsub = projectCsrSyncService.subscribe((_, data) => {
      if (data?.updatedProjects) {
        setProblems(prev => {
          const merged = [...prev];
          const currDept = departmentRef.current;
          const currBOs = budgetOfficersRef.current;
          data.updatedProjects.forEach(proj => {
            const idx = merged.findIndex(p => p.id === proj.id || p.challengeId === proj.challengeId || (proj.projectId && (p.id === proj.projectId || p.projectId === proj.projectId)));
            if (idx >= 0) {
              merged[idx] = { ...merged[idx], ...proj };
            } else if (currDept && checkDeptMatch(proj, currDept, currBOs)) {
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

  const handleSubmitBudgetToGovt = async (problem) => {
    const targetId = problem.id || problem.challengeId || problem._id;
    const cleanId = String(targetId).replace('PROP-', '');
    const updatedOfficer = {
      ...(problem.assignedBudgetOfficer || {}),
      status: 'Forwarded',
      forwardedAt: new Date().toISOString()
    };
    try {
      await apiClient.put(`university/projects/${cleanId}?universityCode=ALL`, {
        assignedBudgetOfficer: updatedOfficer
      });
    } catch {}
    projectCsrSyncService.submitBudgetToGovernment(targetId);
    handleUpdateProblem({
      ...problem,
      assignedBudgetOfficer: updatedOfficer
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

  const handleSelectDepartment = (targetDept) => {
    setDepartment(targetDept);
    const url = new URL(window.location);
    url.searchParams.set('deptId', targetDept.deptId || targetDept.id || targetDept._id);
    window.history.replaceState({}, '', url.toString());
  };

  return {
    activeTab,
    setActiveTab,
    isSidebarExpanded,
    setIsSidebarExpanded,
    department,
    setDepartment,
    allDepartments,
    problems,
    technicians,
    budgetOfficers,
    districts,
    loading,
    selectedProblem,
    setSelectedProblem,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isWardDept,
    isAddTechOpen,
    setIsAddTechOpen,
    showAddBudgetOfficerModal,
    setShowAddBudgetOfficerModal,
    isAddDistrictOpen,
    setIsAddDistrictOpen,
    viewingTech,
    setViewingTech,
    editingTech,
    setEditingTech,
    viewingBudgetOfficer,
    setViewingBudgetOfficer,
    editingBudgetOfficer,
    setEditingBudgetOfficer,
    assigningProblemTech,
    setAssigningProblemTech,
    assigningBudgetProblem,
    setAssigningBudgetProblem,
    handleUpdateProblem,
    handleAssignBudgetOfficer,
    handleSubmitBudgetToGovt,
    handleCreatedTech,
    handleUpdatedTech,
    handleDeletedTech,
    handleCreatedBudgetOfficer,
    handleUpdatedBudgetOfficer,
    handleDeletedBudgetOfficer,
    handleCreatedDistrict,
    handleDeletedDistrict,
    handleSelectDepartment
  };
};

export default useDepartmentPortal;
