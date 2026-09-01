export const getDefaultMilestones = () => [
  {
    step: 1,
    title: 'Problem Submitted',
    description: 'Problem statement filed with location & citizen verification.',
    status: 'COMPLETED',
    updatedBy: 'Citizen',
    remarks: '',
    completedAt: new Date()
  },
  {
    step: 2,
    title: 'Under Review',
    description: 'Government nodal team evaluating problem scope and severity.',
    status: 'CURRENT',
    updatedBy: '',
    remarks: '',
    completedAt: null
  },
  {
    step: 3,
    title: 'University / HEI Assigned',
    description: 'Assigned to relevant university research lab & mentor.',
    status: 'PENDING',
    updatedBy: '',
    remarks: '',
    completedAt: null
  },
  {
    step: 4,
    title: 'Solution in Progress',
    description: 'Faculty mentor and student innovation team implementing pilot.',
    status: 'PENDING',
    updatedBy: '',
    remarks: '',
    completedAt: null
  },
  {
    step: 5,
    title: 'Resolved & Deployed',
    description: 'Action completed and verified on ground with citizen feedback.',
    status: 'PENDING',
    updatedBy: '',
    remarks: '',
    completedAt: null
  }
];

export default getDefaultMilestones;
