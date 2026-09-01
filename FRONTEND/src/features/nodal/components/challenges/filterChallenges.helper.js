export const filterChallengesList = ({
  challenges = [],
  statusFilter,
  domainFilter,
  districtFilter,
  priorityFilter,
  searchTerm
}) => {
  return challenges.filter((chl) => {
    const status = chl.status || 'Under Review';
    const domain = chl.domain || 'Other';
    const district = chl.location?.district || chl.district || chl.assignedNodalOfficer?.district || 'Jharkhand';
    const priority = chl.priority || 'Medium';

    if (statusFilter !== 'All Status' && status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (domainFilter !== 'All Domains' && domain.toLowerCase() !== domainFilter.toLowerCase()) return false;
    if (districtFilter !== 'All Districts' && district.toLowerCase() !== districtFilter.toLowerCase()) return false;
    if (priorityFilter !== 'All Priority' && priority.toLowerCase() !== priorityFilter.toLowerCase()) return false;

    if (searchTerm?.trim()) {
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
