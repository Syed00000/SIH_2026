import React, { useState, useEffect } from 'react';
import { FacultyKpis } from './FacultyKpis.jsx';
import { FacultyFilterBar } from './FacultyFilterBar.jsx';
import { FacultyTable } from './FacultyTable.jsx';
import { FacultyProfileDrawer } from './FacultyProfileDrawer.jsx';
import { FacultyAddModal } from './FacultyAddModal.jsx';
import { FacultyAssignChallengeModal } from './FacultyAssignChallengeModal.jsx';
import { universityApiService } from '../../services/universityApiService.js';

export const FacultyMentorsPanel = ({ onNavigateTab, onSelectFacultyDetail, onSelectFacultyEdit }) => {
  const [facultyList, setFacultyList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [challengesList, setChallengesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [domainFilter, setDomainFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const fetchFacultyAndProjects = async () => {
    setLoading(true);
    const [facData, projData, chlData] = await Promise.all([
      universityApiService.getFaculty(),
      universityApiService.getProjects('RU001'),
      universityApiService.getAssignedChallenges('RU001')
    ]);
    const fList = Array.isArray(facData) ? facData : [];
    const pList = Array.isArray(projData) ? projData : [];
    const cList = chlData?.challenges || (Array.isArray(chlData) ? chlData : []);

    const enrichedFaculty = fList.map((f) => {
      const facProjects = pList.filter((p) =>
        p.leadMentor === f.name ||
        (p.facultyMentor && (p.facultyMentor.name === f.name || p.facultyMentor.email === f.email)) ||
        (f.assignedChallenges && f.assignedChallenges.some((ac) => ac.challengeId === p.challengeId || ac.challengeId === p.projectId))
      );
      const facChallenges = cList.filter((c) =>
        (c.assignedFaculty && (c.assignedFaculty.name === f.name || c.assignedFaculty.email === f.email)) ||
        (f.assignedChallenges && f.assignedChallenges.some((ac) => ac.challengeId === c.challengeId || ac.challengeId === c.id))
      );

      const hasDeployedProject = facProjects.some((p) => p.status === 'Deployed' || Boolean(p.isDeployed) || Boolean(p.isLocked));
      const hasDeployedChallenge = facChallenges.some((c) => c.status === 'Deployed' || c.status === 'Resolved' || Boolean(c.isDeployed) || Boolean(c.isLocked));
      const hasActiveOngoing = facProjects.some((p) => !p.isDeployed && !p.isLocked && p.status !== 'Deployed' && p.status !== 'Resolved');

      const isDeployed = Boolean(f.isDeployed || f.status === 'Deployed' || hasDeployedProject || hasDeployedChallenge);
      const availabilityStatus = (isDeployed && !hasActiveOngoing) ? 'Available' : (f.availabilityStatus || 'Available');

      return {
        ...f,
        isDeployed,
        availabilityStatus,
        hasActiveOngoing,
        status: isDeployed ? 'Deployed' : f.status
      };
    });

    setFacultyList(enrichedFaculty);
    setProjectsList(pList);
    setChallengesList(cList);
    setSelectedFaculty((prev) => {
      if (prev && enrichedFaculty.some((f) => (f._id && f._id === prev._id) || f.email === prev.email)) {
        return enrichedFaculty.find((f) => (f._id && f._id === prev._id) || f.email === prev.email);
      }
      return null;
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchFacultyAndProjects();
  }, []);

  const handleResetFilters = () => {
    setSearch('');
    setDeptFilter('All');
    setDomainFilter('All');
    setAvailabilityFilter('All');
    setStatusFilter('All');
  };

  const handleAddFaculty = async (newFaculty) => {
    await universityApiService.createFaculty(newFaculty);
    await fetchFacultyAndProjects();
  };

  const handleDeleteFaculty = async (facultyId) => {
    await universityApiService.deleteFaculty(facultyId);
    await fetchFacultyAndProjects();
  };

  const handleUnassignProject = async (projectId, facultyName) => {
    if (window.confirm(`Are you sure you want to unassign ${facultyName} from this project?`)) {
      await universityApiService.updateProject(projectId, {
        leadMentor: 'Unassigned Mentor',
        facultyMentor: null
      }, 'RU001');
      await fetchFacultyAndProjects();
    }
  };

  const handleConfirmAssign = async ({ faculty, challengeId, role }) => {
    const targetEmail = faculty.email;
    const targetName = faculty.name;
    const targetId = faculty.id || faculty._id || faculty.facultyId;

    // Immediately update local UI state for instant responsiveness
    setFacultyList((prev) =>
      prev.map((f) => {
        const isMatch = (targetId && (f.id === targetId || f._id === targetId || f.facultyId === targetId)) ||
                        (targetEmail && f.email === targetEmail) ||
                        (targetName && f.name === targetName);
        if (isMatch) {
          return {
            ...f,
            availabilityStatus: 'In Project',
            activeProjects: (Number(f.activeProjects) || 0) + 1,
            assignedChallengeId: challengeId
          };
        }
        return f;
      })
    );

    setSelectedFaculty((prev) => {
      if (!prev) return prev;
      const isMatch = (targetId && (prev.id === targetId || prev._id === targetId || prev.facultyId === targetId)) ||
                      (targetEmail && prev.email === targetEmail) ||
                      (targetName && prev.name === targetName);
      if (isMatch) {
        return {
          ...prev,
          availabilityStatus: 'In Project',
          activeProjects: (Number(prev.activeProjects) || 0) + 1,
          assignedChallengeId: challengeId
        };
      }
      return prev;
    });

    setChallengesList((prev) =>
      prev.map((c) => (c.id === challengeId || c.challengeId === challengeId ? { ...c, assignedFaculty: { name: faculty.name, email: faculty.email, department: faculty.department } } : c))
    );

    await universityApiService.assignFaculty(challengeId, 'RU001', {
      name: faculty.name,
      department: faculty.department,
      email: faculty.email,
      role: role || 'Primary Mentor'
    });
    await fetchFacultyAndProjects();
  };

  const filtered = facultyList.filter((f) => {
    if (deptFilter !== 'All' && f.department !== deptFilter) return false;
    if (availabilityFilter !== 'All') {
      if (availabilityFilter === 'Deployed' && !f.isDeployed) return false;
      if (availabilityFilter === 'Available' && !f.isDeployed && f.availabilityStatus !== 'Available') return false;
      if (availabilityFilter === 'In Project' && (f.isDeployed || f.availabilityStatus !== 'In Project')) return false;
      if (availabilityFilter === 'On Leave' && f.availabilityStatus !== 'On Leave') return false;
    }
    if (statusFilter !== 'All') {
      if (statusFilter === 'Deployed' && !f.isDeployed) return false;
      if (statusFilter === 'Active' && f.status !== 'Active' && !f.isDeployed) return false;
      if (statusFilter === 'Inactive' && f.status !== 'Inactive') return false;
    }
    if (domainFilter !== 'All') {
      const specs = Array.isArray(f.specialization)
        ? f.specialization
        : typeof f.specialization === 'string'
        ? f.specialization.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      if (!specs.some((s) => s.toLowerCase().includes(domainFilter.toLowerCase()))) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (f.name && f.name.toLowerCase().includes(q)) ||
        (f.department && f.department.toLowerCase().includes(q)) ||
        (f.email && f.email.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto select-none">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Faculty Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage faculty profiles, expertise and assign or remove them from challenges/projects.</p>
      </div>

      <FacultyKpis
        loading={loading}
        total={facultyList.length}
        active={facultyList.filter((f) => f.status === 'Active' || f.isDeployed).length}
        available={facultyList.filter((f) => f.availabilityStatus === 'Available' || f.isDeployed).length}
        onLeave={facultyList.filter((f) => f.availabilityStatus === 'On Leave').length}
        inProjects={facultyList.filter((f) => f.hasActiveOngoing).length}
        deployed={facultyList.filter((f) => f.isDeployed).length}
      />

      <FacultyFilterBar
        search={search}
        setSearch={setSearch}
        deptFilter={deptFilter}
        setDeptFilter={setDeptFilter}
        domainFilter={domainFilter}
        setDomainFilter={setDomainFilter}
        availabilityFilter={availabilityFilter}
        setAvailabilityFilter={setAvailabilityFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onResetFilters={handleResetFilters}
        onOpenAddModal={() => {
          if (onNavigateTab) onNavigateTab('onboard-faculty');
          else setIsAddModalOpen(true);
        }}
      />

      <div className="w-full">
        <FacultyTable
          facultyList={filtered}
          selectedFacultyId={null}
          onSelectFaculty={(f) => {
            setSelectedFaculty(f);
            if (onSelectFacultyDetail) onSelectFacultyDetail(f, projectsList, challengesList);
            if (onNavigateTab) onNavigateTab('faculty-detail');
          }}
          onEditFaculty={(f) => {
            setSelectedFaculty(f);
            if (onSelectFacultyEdit) onSelectFacultyEdit(f);
            else if (onSelectFacultyDetail) onSelectFacultyDetail(f, projectsList, challengesList);
            if (onNavigateTab) onNavigateTab('edit-faculty');
          }}
          loading={loading}
        />
      </div>

      <FacultyAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddFaculty={handleAddFaculty}
      />

      <FacultyAssignChallengeModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        faculty={selectedFaculty}
        openChallenges={challengesList}
        onConfirmAssign={handleConfirmAssign}
      />
    </div>
  );
};

export default FacultyMentorsPanel;
