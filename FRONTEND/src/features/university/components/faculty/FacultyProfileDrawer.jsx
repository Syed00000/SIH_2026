import React, { useState } from 'react';
import { DrawerHeaderTabs } from './drawer/DrawerHeaderTabs.jsx';
import { DrawerTabBody } from './drawer/DrawerTabBody.jsx';
import { DrawerFooterActions } from './drawer/DrawerFooterActions.jsx';

export const FacultyProfileDrawer = ({
  faculty,
  projects = [],
  challenges = [],
  onClose,
  onAssignChallenge,
  onDeleteFaculty,
  onUnassignProject
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove ${faculty.name} from the faculty directory?`)) {
      setIsDeleting(true);
      await onDeleteFaculty(faculty._id || faculty.name);
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <div className="bg-white rounded-xl flex flex-col justify-between h-full overflow-hidden select-none text-left">
      <DrawerHeaderTabs
        faculty={faculty}
        initials={initials}
        facultyProjects={facultyProjects}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onClose={onClose}
      />

      <DrawerTabBody
        activeTab={activeTab}
        faculty={faculty}
        specs={specs}
        facultyProjects={facultyProjects}
        onUnassignProject={onUnassignProject}
      />

      <DrawerFooterActions
        isAvailable={isAvailable}
        onAssignChallenge={onAssignChallenge}
        faculty={faculty}
        isDeleting={isDeleting}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default FacultyProfileDrawer;
