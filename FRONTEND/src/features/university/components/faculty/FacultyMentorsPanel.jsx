import React, { useState, useEffect } from 'react';
import { FacultyKpis } from './FacultyKpis.jsx';
import { FacultyFilterBar } from './FacultyFilterBar.jsx';
import { FacultyTable } from './FacultyTable.jsx';
import { FacultyProfileDrawer } from './FacultyProfileDrawer.jsx';
import { FacultyAddModal } from './FacultyAddModal.jsx';
import { FacultyAssignChallengeModal } from './FacultyAssignChallengeModal.jsx';
import { universityApiService } from '../../services/universityApiService.js';

export const FacultyMentorsPanel = () => {
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
    setFacultyList(fList);
    setProjectsList(pList);
    setChallengesList(cList);
    setSelectedFaculty((prev) => {
      if (prev && fList.some((f) => (f._id && f._id === prev._id) || f.email === prev.email)) {
        return fList.find((f) => (f._id && f._id === prev._id) || f.email === prev.email);
      }
      return fList.length > 0 ? fList[0] : null;
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

  const handleConfirmAssign = async ({ faculty, challengeId }) => {
    await universityApiService.assignFaculty(challengeId, 'RU001', {
      name: faculty.name,
      department: faculty.department,
      email: faculty.email
    });
    await fetchFacultyAndProjects();
  };

  const filtered = facultyList.filter((f) => {
    if (deptFilter !== 'All' && f.department !== deptFilter) return false;
    if (availabilityFilter !== 'All' && f.availabilityStatus !== availabilityFilter) return false;
    if (statusFilter !== 'All' && f.status !== statusFilter) return false;
    if (domainFilter !== 'All') {
      const specs = f.specialization || [];
      if (!specs.some((s) => s.toLowerCase().includes(domainFilter.toLowerCase()))) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return f.name.toLowerCase().includes(q) || f.department.toLowerCase().includes(q) || (f.email && f.email.toLowerCase().includes(q));
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
        active={facultyList.filter((f) => f.status === 'Active').length}
        available={facultyList.filter((f) => f.availabilityStatus === 'Available').length}
        onLeave={facultyList.filter((f) => f.availabilityStatus === 'On Leave').length}
        inProjects={facultyList.filter((f) => f.availabilityStatus === 'In Project').length}
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
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        <div className={`${selectedFaculty ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all`}>
          <FacultyTable
            facultyList={filtered}
            selectedFacultyId={selectedFaculty?._id || selectedFaculty?.name}
            onSelectFaculty={(f) => setSelectedFaculty(f)}
            loading={loading}
          />
        </div>

        {selectedFaculty && (
          <div className="lg:col-span-5 sticky top-20">
            <FacultyProfileDrawer
              faculty={selectedFaculty}
              projects={projectsList}
              onClose={() => setSelectedFaculty(null)}
              onAssignChallenge={() => setIsAssignModalOpen(true)}
              onDeleteFaculty={handleDeleteFaculty}
              onUnassignProject={handleUnassignProject}
            />
          </div>
        )}
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
