import React, { useState, useEffect } from 'react';
import { ProjectsKpis } from './ProjectsKpis.jsx';
import { ProjectsFilterBar } from './ProjectsFilterBar.jsx';
import { ProjectsTable } from './ProjectsTable.jsx';
import { ProjectDrawer } from './ProjectDrawer.jsx';
import { ProjectCreateModal } from './ProjectCreateModal.jsx';
import { ProjectEditModal } from './ProjectEditModal.jsx';
import { AssignFacultyMentorModal } from './AssignFacultyMentorModal.jsx';
import { universityApiService } from '../../services/universityApiService.js';

export const ProjectsPanel = ({ onNavigateTab }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [assignModalProject, setAssignModalProject] = useState(null);
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [facultyFilter, setFacultyFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    const data = await universityApiService.getProjects('RU001');
    const list = Array.isArray(data) ? data : [];
    setProjects(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const totalCount = projects.length;
  const inProgressCount = projects.filter((p) => p.status === 'In Progress' || p.status === 'Active R&D').length;
  const planningCount = projects.filter((p) => p.status === 'Proposal Stage' || p.status === 'Planning' || p.status === 'Pending Proposal' || !p.status).length;
  const completedCount = projects.filter((p) => p.status === 'Completed').length;

  const facultyOptions = Array.from(
    new Set(projects.map((p) => p.facultyMentor?.name || p.leadMentor).filter(Boolean))
  );

  const handleResetFilters = () => {
    setSearch('');
    setDomainFilter('All');
    setStatusFilter('All');
    setFacultyFilter('All');
  };

  const handleCreateProject = async (newProj) => {
    await universityApiService.createProject({
      ...newProj,
      projectId: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Proposal Stage',
      progressPercentage: 14
    });
    await fetchProjects();
  };

  const handleUpdateProject = async (updatedProj) => {
    await universityApiService.updateProject(updatedProj.projectId || updatedProj._id, updatedProj);
    setProjects(projects.map((p) => (p.projectId === updatedProj.projectId ? updatedProj : p)));
    if (selectedProject?.projectId === updatedProj.projectId) {
      setSelectedProject(updatedProj);
    }
  };

  const handleMarkAsCompleted = async (proj) => {
    if (window.confirm(`Mark project "${proj.title}" as Completed (100% Verified)?`)) {
      const updated = {
        ...proj,
        status: 'Completed',
        progressPercentage: 100,
        milestonesCompleted: proj.milestonesTotal || 7,
        daysLeft: 'Completed'
      };
      await handleUpdateProject(updated);
    }
  };

  const handleSoftDeleteProject = async (proj) => {
    if (window.confirm(`Archive project "${proj.title}" from active view?`)) {
      await universityApiService.deleteProject(proj.projectId || proj._id);
      await fetchProjects();
      if (selectedProject?.projectId === proj.projectId) {
        setSelectedProject(null);
      }
    }
  };

  const filtered = projects.filter((p) => {
    if (domainFilter !== 'All' && p.domain !== domainFilter) return false;
    if (statusFilter !== 'All') {
      if (statusFilter === 'Planning' || statusFilter === 'Proposal Stage') {
        if (p.status !== 'Proposal Stage' && p.status !== 'Planning' && p.status !== 'Pending Proposal') return false;
      } else if (p.status !== statusFilter) {
        return false;
      }
    }
    if (facultyFilter !== 'All') {
      const mentor = p.facultyMentor?.name || p.leadMentor;
      if (mentor !== facultyFilter) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (p.title || '').toLowerCase().includes(q) ||
        (p.projectId || '').toLowerCase().includes(q) ||
        (p.challengeId || '').toLowerCase().includes(q) ||
        (p.domain || '').toLowerCase().includes(q) ||
        (p.facultyMentor?.name || p.leadMentor || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-3 max-w-7xl mx-auto select-none">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Projects</h1>
        <p className="text-xs text-slate-600 mt-0.5">Track and monitor all university projects from planning to completion.</p>
      </div>

      <ProjectsKpis
        total={totalCount}
        inProgress={inProgressCount}
        planning={planningCount}
        completed={completedCount}
        loading={loading}
      />

      <ProjectsFilterBar
        search={search}
        setSearch={setSearch}
        domainFilter={domainFilter}
        setDomainFilter={setDomainFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        facultyFilter={facultyFilter}
        setFacultyFilter={setFacultyFilter}
        facultyOptions={facultyOptions}
        onResetFilters={handleResetFilters}
        onOpenCreateModal={() => {
          if (onNavigateTab) onNavigateTab('create-project');
          else setIsCreateModalOpen(true);
        }}
      />

      <div className="w-full">
        <ProjectsTable
          projects={filtered}
          selectedProjectId={selectedProject?.projectId}
          onSelectProject={(p) => setSelectedProject(p)}
          onAssignMentor={(p) => setAssignModalProject(p)}
          onSoftDeleteProject={handleSoftDeleteProject}
          loading={loading}
        />
      </div>

      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white border border-slate-200/90 rounded-xl shadow-2xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <ProjectDrawer
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
              onEdit={(p) => {
                setEditingProject(p);
                setIsEditModalOpen(true);
              }}
              onAssignMentor={(p) => setAssignModalProject(p)}
              onEndProject={handleSoftDeleteProject}
              onMarkCompleted={handleMarkAsCompleted}
            />
          </div>
        </div>
      )}

      {/* Assign Lead Faculty Mentor Modal */}
      {assignModalProject && (
        <AssignFacultyMentorModal
          isOpen={Boolean(assignModalProject)}
          project={assignModalProject}
          onClose={() => setAssignModalProject(null)}
          onSuccess={async (updated) => {
            setProjects((prev) =>
              prev.map((p) =>
                p.projectId === updated.projectId || p._id === updated._id
                  ? { ...p, ...updated }
                  : p
              )
            );
            if (
              selectedProject?.projectId === updated.projectId ||
              selectedProject?._id === updated._id
            ) {
              setSelectedProject((prev) => ({ ...prev, ...updated }));
            }
            await fetchProjects();
          }}
        />
      )}

      <ProjectCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateProject}
      />

      <ProjectEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProject(null);
        }}
        project={editingProject}
        onUpdate={handleUpdateProject}
      />
    </div>
  );
};

export default ProjectsPanel;
