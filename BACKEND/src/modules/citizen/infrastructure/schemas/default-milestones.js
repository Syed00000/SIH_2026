export const getDefaultMilestones = () => [
  {
    step: 1,
    title: 'Problem Submitted',
    description: 'Problem statement filed with location & citizen verification.',
    status: 'COMPLETED',
    updatedBy: 'Citizen Submission Portal',
    remarks: 'Citizen submission acknowledged.',
    completedAt: new Date()
  },
  {
    step: 2,
    title: 'Under Review',
    description: 'Government nodal team evaluating problem scope and severity.',
    status: 'CURRENT',
    updatedBy: 'Jharkhand State Innovation Cell',
    remarks: 'Initial screening underway.',
    completedAt: null
  },
  {
    step: 3,
    title: 'University / HEI Assigned',
    description: 'Assigned to relevant university research lab & mentor.',
    status: 'PENDING',
    updatedBy: 'Department of Higher & Technical Education',
    remarks: '',
    completedAt: null
  },
  {
    step: 4,
    title: 'Solution in Progress',
    description: 'Faculty mentor and student innovation team implementing pilot.',
    status: 'PENDING',
    updatedBy: 'University Faculty Lead',
    remarks: '',
    completedAt: null
  },
  {
    step: 5,
    title: 'Resolved & Deployed',
    description: 'Action completed and verified on ground with citizen feedback.',
    status: 'PENDING',
    updatedBy: 'District Administration',
    remarks: '',
    completedAt: null
  }
];

export default getDefaultMilestones;
