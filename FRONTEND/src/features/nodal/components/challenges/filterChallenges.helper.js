export const filterChallengesList = ({
  challenges = [],
  statusFilter = 'All Status',
  domainFilter = 'All Domains',
  districtFilter = 'All Districts',
  priorityFilter = 'All Priority',
  searchTerm = ''
}) => {
  const safeStatusFilter = typeof statusFilter === 'string' ? statusFilter : 'All Status';
  const safeDomainFilter = typeof domainFilter === 'string' ? domainFilter : 'All Domains';
  const safeDistrictFilter = typeof districtFilter === 'string' ? districtFilter : 'All Districts';
  const safePriorityFilter = typeof priorityFilter === 'string' ? priorityFilter : 'All Priority';

  return challenges.filter((chl) => {
    const status = String(chl.status || 'Under Review');
    const domain = String(chl.domain || 'Other');
    const district = String(chl.location?.district || chl.district || chl.assignedNodalOfficer?.district || 'Jharkhand');
    const priority = String(chl.priority || 'Medium');

    if (safeStatusFilter !== 'All Status' && status.toLowerCase() !== safeStatusFilter.toLowerCase()) return false;
    if (safeDomainFilter !== 'All Domains' && domain.toLowerCase() !== safeDomainFilter.toLowerCase()) return false;
    if (safeDistrictFilter !== 'All Districts' && district.toLowerCase() !== safeDistrictFilter.toLowerCase()) return false;
    if (safePriorityFilter !== 'All Priority' && priority.toLowerCase() !== safePriorityFilter.toLowerCase()) return false;

    if (typeof searchTerm === 'string' && searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        (chl.title || '').toLowerCase().includes(q) ||
        (chl.challengeId || chl.id || '').toLowerCase().includes(q) ||
        (chl.description || '').toLowerCase().includes(q) ||
        (chl.location?.district || chl.district || '').toLowerCase().includes(q) ||
        (chl.assignedUniversity?.name || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
};

export default filterChallengesList;
