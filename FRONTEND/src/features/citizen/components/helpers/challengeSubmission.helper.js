export const validateChallengeForm = (formData, finalDomain) => {
  if (!formData.title?.trim()) return 'Please enter a problem title / heading';
  if (!finalDomain) return 'Please select or specify a challenge domain';
  if (!formData.description?.trim() || formData.description.trim().length < 5) {
    return 'Please provide a problem statement description (at least 5 characters)';
  }
  if (!formData.district) return 'Please select a district in Jharkhand';
  return null;
};

export const buildChallengePayload = (formData, finalDomain, user) => {
  return {
    title: formData.title.trim(),
    domain: finalDomain,
    description: formData.description.trim(),
    district: formData.district,
    block: formData.block || '',
    panchayatOrWard: formData.panchayatOrWard || '',
    landmark: formData.landmark || '',
    pincode: formData.pincode || '',
    fullAddress:
      formData.fullAddress ||
      `${formData.landmark ? formData.landmark + ', ' : ''}${formData.panchayatOrWard ? formData.panchayatOrWard + ', ' : ''}${formData.block ? formData.block + ', ' : ''}${formData.district}, Jharkhand - ${formData.pincode || '834001'}`,
    submitterName: formData.submitterName || user?.fullName || 'Concerned Citizen',
    submitterPhone: formData.submitterPhone || user?.mobileNumber || '9876543210',
    submitterEmail: formData.submitterEmail || user?.email || '',
    submitterRole: formData.submitterRole || 'Citizen',
    designation: formData.designation || '',
    organization: formData.organization || '',
    priority: formData.priority || 'Medium',
    affectedPopulation: formData.affectedPopulation || '500 - 2,000 people (Village / Ward)',
    media: formData.media || [],
    mediaUrls: (formData.media || []).map((m) => (typeof m === 'string' ? m : m.url)).filter(Boolean)
  };
};

export default {
  validateChallengeForm,
  buildChallengePayload
};
