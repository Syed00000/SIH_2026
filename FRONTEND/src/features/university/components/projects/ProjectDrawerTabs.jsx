import React, { useState, useEffect } from 'react';
import { ProjectOverviewTab } from './tabs/ProjectOverviewTab.jsx';
import { ProjectMilestonesTab } from './tabs/ProjectMilestonesTab.jsx';
import { ProjectTeamTab } from './tabs/ProjectTeamTab.jsx';
import { ProjectDocumentsTab } from './tabs/ProjectDocumentsTab.jsx';

export const ProjectDrawerTabs = ({
  project,
  activeTab,
  onEdit,
  onAssignMentor,
  onEndProject,
  onMarkCompleted
}) => {
  const [trancheRequested, setTrancheRequested] = useState(
    Boolean(project.trancheRequest?.status === 'Pending')
  );
  const [isRequestingTranche, setIsRequestingTranche] = useState(false);

  useEffect(() => {
    setTrancheRequested(Boolean(project.trancheRequest?.status === 'Pending'));
  }, [project.trancheRequest?.status, project.id, project.projectId]);

  const hasMentor = Boolean(
    project.facultyMentor?.name || (project.leadMentor && project.leadMentor !== 'Unassigned')
  );
  const facultyName = hasMentor ? (project.facultyMentor?.name || project.leadMentor) : 'Unassigned';
  const facultyDept = hasMentor
    ? (project.facultyMentor?.department || 'Department of Engineering')
    : 'No Department Assigned';
  const initials = hasMentor
    ? facultyName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'NA';

  const activities = Array.isArray(project.recentActivity) ? project.recentActivity : [];
  const documents = Array.isArray(project.documents) ? project.documents : [];

  const isFunded = Boolean(project.disbursedAmount && project.disbursedAmount !== '0' && project.disbursedAmount !== '₹ 0');
  const isGovApproved = project.governmentStatus === 'Approved' || project.status === 'Completed';
  const isDeployed = project.status === 'Deployed' || Boolean(project.isDeployed) || Boolean(project.isLocked);
  const isProtoApproved = project.prototypeStatus === 'Approved' || isGovApproved;
  const isProtoInReview = project.prototypeStatus === 'In Review';
  const isProtoStarted = Boolean(project.prototypeData);

  const defaultMilestones = [
    { id: 1, title: 'Problem Statement Allocated & Scoped', status: 'Completed', dueDate: 'N/A' },
    {
      id: 2,
      title: hasMentor ? `Lead Faculty Mentor Assigned (${facultyName})` : 'Lead Faculty Mentor Assignment',
      status: hasMentor ? 'Completed' : 'In Progress',
      dueDate: 'N/A'
    },
    {
      id: 3,
      title: 'Faculty Solution Analysis & Budget Proposal',
      status: hasMentor ? 'Completed' : 'Pending',
      dueDate: 'N/A'
    },
    { 
      id: 4, 
      title: 'University Review & Submission to Government', 
      status: isFunded || isGovApproved ? 'Completed' : 'In Progress', 
      dueDate: 'N/A' 
    },
    { 
      id: 5, 
      title: 'Government Budget Sanction & Grant Disbursal', 
      status: isFunded || isGovApproved ? 'Completed' : 'Pending', 
      dueDate: 'N/A' 
    },
    { 
      id: 6, 
      title: isGovApproved
        ? 'Prototype Validated & State Certified (TRL-9)'
        : isProtoApproved 
        ? 'Prototype Blueprint Verified & Approved' 
        : isProtoInReview 
        ? 'Prototype Blueprint Submitted for Review' 
        : 'Prototype Development & Field Testing', 
      status: isProtoApproved || isGovApproved ? 'Completed' : (isProtoInReview || isProtoStarted ? 'In Progress' : 'Pending'), 
      dueDate: project.prototypeData?.timeline || 'N/A' 
    },
    { 
      id: 7, 
      title: isGovApproved 
        ? 'State Deployment & Citizen Problem Resolved' 
        : isProtoApproved 
        ? 'Ready for Industry CSR Matching & Handover' 
        : 'Government Handover & Final Audit', 
      status: isGovApproved || project.status === 'Completed' ? 'Completed' : (isProtoApproved ? 'In Progress' : 'Pending'), 
      dueDate: 'N/A' 
    }
  ];

  const milestonesList = isGovApproved 
    ? defaultMilestones.map(m => ({ ...m, status: 'Completed' }))
    : (project.milestones?.length ? project.milestones : defaultMilestones);
  const totalMilestones = milestonesList.length || 7;
  const completedMilestones = isGovApproved ? 7 : milestonesList.filter(
    (m) => m.status === 'Completed' || m.status === 'COMPLETED'
  ).length;
  const calculatedPercentage =
    isGovApproved || project.status === 'Completed'
      ? 100
      : Math.round((completedMilestones / totalMilestones) * 100);

  const displayTimeline = project.prototypeData?.timeline ? `${project.prototypeData.timeline} (Prototype Target)` : (project.timeline || project.deadline || 'N/A');

  if (activeTab === 'overview') {
    return (
      <ProjectOverviewTab
        project={project}
        hasMentor={hasMentor}
        facultyName={facultyName}
        facultyDept={facultyDept}
        initials={initials}
        displayTimeline={displayTimeline}
        calculatedPercentage={calculatedPercentage}
        completedMilestones={completedMilestones}
        totalMilestones={totalMilestones}
        isDeployed={isDeployed}
        activities={activities}
        trancheRequested={trancheRequested}
        setTrancheRequested={setTrancheRequested}
        isRequestingTranche={isRequestingTranche}
        setIsRequestingTranche={setIsRequestingTranche}
        onEdit={onEdit}
        onMarkCompleted={onMarkCompleted}
        onEndProject={onEndProject}
      />
    );
  }

  if (activeTab === 'milestones') {
    return (
      <ProjectMilestonesTab
        milestonesList={milestonesList}
        completedMilestones={completedMilestones}
        totalMilestones={totalMilestones}
        calculatedPercentage={calculatedPercentage}
      />
    );
  }

  if (activeTab === 'team') {
    return (
      <ProjectTeamTab
        project={project}
        hasMentor={hasMentor}
        facultyName={facultyName}
        facultyDept={facultyDept}
        initials={initials}
        onAssignMentor={onAssignMentor}
      />
    );
  }

  return <ProjectDocumentsTab documents={documents} />;
};

export default ProjectDrawerTabs;
