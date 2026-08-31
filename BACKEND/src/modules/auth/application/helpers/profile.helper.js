/**
 * Helper to build embedded profile sub-document from profile object or top-level role fields
 */
export function buildEmbeddedProfile(profile = {}, restBody = {}) {
  return {
    // Citizen fields
    preferredLanguage: profile.preferredLanguage || restBody.preferredLanguage || 'HINDI',
    location: profile.location || restBody.location || null,

    // University fields
    institutionName: profile.institutionName || restBody.institutionName || null,
    aisheCode: profile.aisheCode || restBody.aisheCode || null,
    registrationNumber: profile.registrationNumber || restBody.registrationNumber || null,
    institutionType: profile.institutionType || restBody.institutionType || null,
    nodalOfficerDesignation: profile.nodalOfficerDesignation || restBody.nodalOfficerDesignation || null,
    academicFocusDomains: profile.academicFocusDomains || restBody.academicFocusDomains || [],

    // Industry fields
    organizationName: profile.organizationName || restBody.organizationName || null,
    entityType: profile.entityType || restBody.entityType || null,
    cin: profile.cin || restBody.cin || null,
    gstin: profile.gstin || restBody.gstin || null,
    ngoDarpanId: profile.ngoDarpanId || restBody.ngoDarpanId || null,
    primaryContactDesignation: profile.primaryContactDesignation || restBody.primaryContactDesignation || null,
    supportSectors: profile.supportSectors || restBody.supportSectors || []
  };
}

export default buildEmbeddedProfile;
