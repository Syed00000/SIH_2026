import React, { useState, useEffect } from 'react';
import { FacultyKpis } from './FacultyKpis.jsx';
import { FacultyFilterBar } from './FacultyFilterBar.jsx';
import { FacultyTable } from './FacultyTable.jsx';
import { FacultyAddModal } from './FacultyAddModal.jsx';
import { FacultyAssignChallengeModal } from './FacultyAssignChallengeModal.jsx';
import { universityApiService } from '../../services/universityApiService.js';
import { enrichFacultyList, filterFacultyList } from './facultyHelper.js';

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

    const enriched = enrichFacultyList(fList, pList, cList);
    setFacultyList(enriched);
    setProjectsList(pList);
    setChallengesList(cList);
    setSelectedFaculty((prev) => {
      if (prev && enriched.some((f) => (f._id && f._id === prev._id) || f.email === prev.email)) {
        return enriched.find((f) => (f._id && f._id === prev._id) || f.email === prev.email);
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

  const handleDeleteFaculty = async (faculty) => {
    const id = faculty._id || faculty.id || faculty.facultyId || faculty.name;
    const name = faculty.name || 'Faculty Member';
    if (window.confirm(`Are you sure you want to remove faculty mentor "${name}"? This will deactivate their portal access.`)) {
      try {
        await universityApiService.deleteFaculty(id);
        setFacultyList((prev) =>
          prev.filter((item) => (item._id || item.id || item.name) !== (faculty._id || faculty.id || faculty.name))
        );
        await fetchFacultyAndProjects();
      } catch (err) {
        alert('Failed to delete faculty: ' + err.message);
      }
    }
  };

  const handleConfirmAssign = async ({ faculty, challengeId, role }) => {
    const targetId = faculty.id || faculty._id || faculty.facultyId;
    const targetEmail = faculty.email;
    const targetName = faculty.name;

    setFacultyList((prev) =>
      prev.map((f) => {
        const isMatch = (targetId && (f.id === targetId || f._id === targetId || f.facultyId === targetId)) ||
                        (targetEmail && f.email === targetEmail) ||
                        (targetName && f.name === targetName);
        if (isMatch) {
          return {
            ...f,
            availabilityStatus: 'In Project',
            hasActiveOngoing: true,
            activeProjects: (Number(f.activeProjects) || 0) + 1,
            assignedChallengeId: challengeId
          };
        }
        return f;
      })
    );

    await universityApiService.assignFaculty(challengeId, 'RU001', {
      name: faculty.name,
      department: faculty.department,
      email: faculty.email,
      role: role || 'Primary Mentor'
    });
    await fetchFacultyAndProjects();
  };

  const filtered = filterFacultyList(facultyList, {
    deptFilter,
    domainFilter,
    availabilityFilter,
    statusFilter,
    search
  });

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto select-none">
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-4">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Faculty Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage faculty profiles, expertise, mentorship capacity, and departmental allocations.</p>
      </div>

      <FacultyKpis
        loading={loading}
        total={facultyList.length}
        active={facultyList.filter((f) => f.status === 'Active').length}
        available={facultyList.filter((f) => f.availabilityStatus === 'Available').length}
        onLeave={facultyList.filter((f) => f.availabilityStatus === 'On Leave' || f.status === 'On Leave').length}
        inProjects={facultyList.filter((f) => f.availabilityStatus === 'In Project' || f.hasActiveOngoing).length}
        deliveredSolutions={facultyList.reduce((sum, f) => sum + (f.deliveredSolutionsCount || 0), 0)}
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
          onDeleteFaculty={handleDeleteFaculty}
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
