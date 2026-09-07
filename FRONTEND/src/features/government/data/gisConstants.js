export const PROBLEM_CATEGORIES = [
  { id: 'Urban Development', name: 'Urban Development' },
  { id: 'Water Resources', name: 'Water Resources' },
  { id: 'Healthcare', name: 'Healthcare' },
  { id: 'Education', name: 'Education' }
];

export const SEVERITY_LEVELS = [
  { id: 'all', label: 'All Levels' },
  { id: 'high', label: 'High Priority' },
  { id: 'normal', label: 'Normal Priority' }
];

export const getSeverityByScore = (score = 0) => {
  if (score >= 81) return SEVERITY_LEVELS[1];
  if (score >= 61) return SEVERITY_LEVELS[2];
  if (score >= 41) return SEVERITY_LEVELS[3];
  if (score >= 21) return SEVERITY_LEVELS[4];
  return SEVERITY_LEVELS[5];
};

export default {
  PROBLEM_CATEGORIES,
  SEVERITY_LEVELS,
  getSeverityByScore
};
