export const filterChallengesList = ({
  challenges = [],
  statusFilter = 'All Status',
  domainFilter = 'All Domains',
  districtFilter = 'All Districts',
  priorityFilter = 'All Priority',
  searchTerm = ''
}) => {
  const safeStatusStr = typeof statusFilter === 'string' ? statusFilter : (statusFilter?.status && typeof statusFilter.status === 'string' ? statusFilter.status : 'All Status');
  const safeDomainStr = typeof domainFilter === 'string' ? domainFilter : 'All Domains';
  const safeDistrictStr = typeof districtFilter === 'string' ? districtFilter : 'All Districts';
  const safePriorityStr = typeof priorityFilter === 'string' ? priorityFilter : 'All Priority';
  const safeSearchStr = typeof searchTerm === 'string' ? searchTerm : '';

  const safeList = Array.isArray(challenges) ? challenges : [];

  return safeList.filter((chl) => {
    if (!chl) return false;

    const status = (chl.status || 'Under Review').toString();
    const domain = (chl.domain || 'Other').toString();
    const district = (chl.location?.district || chl.district || chl.assignedNodalOfficer?.district || 'Jharkhand').toString();
    const priority = (chl.priority || 'Medium').toString();

    if (safeStatusStr !== 'All Status' && status.toLowerCase() !== safeStatusStr.toLowerCase()) return false;
    if (safeDomainStr !== 'All Domains' && domain.toLowerCase() !== safeDomainStr.toLowerCase()) return false;
    if (safeDistrictStr !== 'All Districts' && district.toLowerCase() !== safeDistrictStr.toLowerCase()) return false;
    if (safePriorityStr !== 'All Priority' && priority.toLowerCase() !== safePriorityStr.toLowerCase()) return false;

    if (safeSearchStr.trim()) {
      const q = safeSearchStr.toLowerCase();
      const match =
        (chl.title || '').toString().toLowerCase().includes(q) ||
        (chl.challengeId || chl.id || '').toString().toLowerCase().includes(q) ||
        (chl.description || '').toString().toLowerCase().includes(q) ||
        (chl.location?.district || chl.district || '').toString().toLowerCase().includes(q) ||
        (chl.assignedUniversity?.name || '').toString().toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
};

export default filterChallengesList;
