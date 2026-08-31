import React, { useState } from 'react';
import { FacultyDetailHeader } from './detail/FacultyDetailHeader.jsx';
import { FacultyDetailProfileCard } from './detail/FacultyDetailProfileCard.jsx';
import { FacultyDetailProjectsCard } from './detail/FacultyDetailProjectsCard.jsx';
import { FacultyDetailCredentialsCard } from './detail/FacultyDetailCredentialsCard.jsx';

export const FacultyDetailPanel = ({
  faculty,
  projects = [],
  challenges = [],
  onBack,
  onEdit,
  onAssignChallenge,
  onDeleteFaculty,
  onUnassignProject
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  if (!faculty) return null;

  const specs = Array.isArray(faculty.specialization)
    ? faculty.specialization
    : typeof faculty.specialization === 'string'
    ? faculty.specialization.split(',').map((s) => s.trim()).filter(Boolean)
    : ['Applied Research', 'Innovation'];

  const initials = (faculty.name || 'Faculty').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const facultyProjects = projects.filter(
    (p) => p.leadMentor === faculty.name || (p.facultyMentor && p.facultyMentor.name === faculty.name)
  );

  const isAvailable = faculty.availabilityStatus === 'Available';
  const isAssigned = !isAvailable && (faculty.availabilityStatus === 'In Project' || facultyProjects.length > 0);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove ${faculty.name} from the faculty directory?`)) {
      setIsDeleting(true);
      await onDeleteFaculty(faculty._id || faculty.name);
      setIsDeleting(false);
      if (onBack) onBack();
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12 text-left">
      <FacultyDetailHeader
        faculty={faculty}
        onBack={onBack}
        onEdit={onEdit}
        isDeleting={isDeleting}
        handleDelete={handleDelete}
      />

      <FacultyDetailProfileCard
        faculty={faculty}
        initials={initials}
        isAvailable={isAvailable}
        isAssigned={isAssigned}
        specs={specs}
      />

      <FacultyDetailProjectsCard
        faculty={faculty}
        facultyProjects={facultyProjects}
        onUnassignProject={onUnassignProject}
      />

      <FacultyDetailCredentialsCard
        faculty={faculty}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        copiedField={copiedField}
        setCopiedField={setCopiedField}
      />
    </div>
  );
};

export default FacultyDetailPanel;
