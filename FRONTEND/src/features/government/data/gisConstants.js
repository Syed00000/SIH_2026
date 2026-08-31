export const PROBLEM_CATEGORIES = [
  { id: 'infrastructure', name: 'Infrastructure Issues', icon: 'Hammer', color: '#f97316', bgLight: 'bg-orange-50', textCol: 'text-orange-600', borderCol: 'border-orange-200', desc: 'Roads, bridges, electricity grid, public building conditions' },
  { id: 'healthcare', name: 'Healthcare Access', icon: 'HeartPulse', color: '#06b6d4', bgLight: 'bg-cyan-50', textCol: 'text-cyan-600', borderCol: 'border-cyan-200', desc: 'Primary health centers, doctor availability, ambulances, maternal care' },
  { id: 'education', name: 'Education Gaps', icon: 'GraduationCap', color: '#a855f7', bgLight: 'bg-purple-50', textCol: 'text-purple-600', borderCol: 'border-purple-200', desc: 'School infrastructure, digital classrooms, teacher-student ratio' },
  { id: 'unemployment', name: 'Unemployment', icon: 'Briefcase', color: '#0d9488', bgLight: 'bg-teal-50', textCol: 'text-teal-600', borderCol: 'border-teal-200', desc: 'Youth job placement, vocational training, skill centers' },
  { id: 'poverty', name: 'Poverty', icon: 'Coins', color: '#eab308', bgLight: 'bg-amber-50', textCol: 'text-amber-600', borderCol: 'border-amber-200', desc: 'BPL family welfare, rationing distribution, livelihood schemes' },
  { id: 'connectivity', name: 'Connectivity Issues', icon: 'Radio', color: '#b45309', bgLight: 'bg-amber-100', textCol: 'text-amber-800', borderCol: 'border-amber-300', desc: 'Rural roads, telecom mobile tower coverage, broadband internet' },
  { id: 'water', name: 'Water Scarcity', icon: 'Droplets', color: '#3b82f6', bgLight: 'bg-blue-50', textCol: 'text-blue-600', borderCol: 'border-blue-200', desc: 'Groundwater depletion, irrigation canals, safe drinking water' },
  { id: 'others', name: 'Others', icon: 'Layers', color: '#64748b', bgLight: 'bg-slate-100', textCol: 'text-slate-600', borderCol: 'border-slate-200', desc: 'Mining rehabilitation, forest conservation, municipal waste' }
];

export const SEVERITY_LEVELS = [
  { id: 'all', label: 'All Levels', min: 0, max: 100, color: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-700' },
  { id: 'very_high', label: 'Very High', range: '81 - 100', min: 81, max: 100, color: '#dc2626', bg: 'bg-red-500', text: 'text-red-600', badgeClass: 'bg-red-50 text-red-700 border-red-200' },
  { id: 'high', label: 'High', range: '61 - 80', min: 61, max: 80, color: '#ea580c', bg: 'bg-orange-500', text: 'text-orange-600', badgeClass: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'moderate', label: 'Moderate', range: '41 - 60', min: 41, max: 60, color: '#eab308', bg: 'bg-amber-400', text: 'text-amber-600', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'low', label: 'Low', range: '21 - 40', min: 21, max: 40, color: '#84cc16', bg: 'bg-lime-500', text: 'text-lime-700', badgeClass: 'bg-lime-50 text-lime-700 border-lime-200' },
  { id: 'very_low', label: 'Very Low', range: '0 - 20', min: 0, max: 20, color: '#16a34a', bg: 'bg-green-500', text: 'text-green-700', badgeClass: 'bg-green-50 text-green-700 border-green-200' }
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
