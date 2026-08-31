export function buildIndustryFilter({
  search,
  category,
  thematicDomain,
  status,
  accessStatus,
  verificationStatus,
  district
}) {
  const query = {};

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { industryId: searchRegex },
      { legalName: searchRegex },
      { shortName: searchRegex },
      { category: searchRegex },
      { thematicDomain: searchRegex },
      { officialEmail: searchRegex },
      { spocName: searchRegex },
      { registrationNumber: searchRegex }
    ];
  }

  if (category && category !== 'All' && category !== 'All Categories') {
    query.category = category;
  }

  if (thematicDomain && thematicDomain !== 'All' && thematicDomain !== 'All Domains') {
    query.thematicDomain = new RegExp(thematicDomain, 'i');
  }

  if (status && status !== 'All' && status !== 'All Status') {
    query.status = status;
  }

  if (accessStatus && accessStatus !== 'All') {
    query.accessStatus = accessStatus;
  }

  if (verificationStatus && verificationStatus !== 'All') {
    query.verificationStatus = verificationStatus;
  }

  if (district && district !== 'All' && district !== 'All Districts') {
    query['address.district'] = new RegExp(`^${district}$`, 'i');
  }

  return query;
}

export default buildIndustryFilter;
