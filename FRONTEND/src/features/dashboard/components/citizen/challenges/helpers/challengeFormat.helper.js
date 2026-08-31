import {
  Droplet,
  Wrench,
  BookOpen,
  Trash2,
  Sprout,
  HeartPulse,
  Lightbulb
} from 'lucide-react';

export const getDomainIconAndStyle = (domain = '') => {
  const d = String(domain).toLowerCase();
  if (d.includes('water')) {
    return { icon: Droplet, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' };
  }
  if (d.includes('infra') || d.includes('road') || d.includes('urban')) {
    return { icon: Wrench, iconColor: 'text-slate-600', iconBg: 'bg-slate-100' };
  }
  if (d.includes('edu') || d.includes('school')) {
    return { icon: BookOpen, iconColor: 'text-purple-600', iconBg: 'bg-purple-50' };
  }
  if (d.includes('sanitat') || d.includes('waste') || d.includes('garbage')) {
    return { icon: Trash2, iconColor: 'text-teal-600', iconBg: 'bg-teal-50' };
  }
  if (d.includes('agri') || d.includes('farm')) {
    return { icon: Sprout, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' };
  }
  if (d.includes('health') || d.includes('med')) {
    return { icon: HeartPulse, iconColor: 'text-rose-600', iconBg: 'bg-rose-50' };
  }
  return { icon: Lightbulb, iconColor: 'text-yellow-600', iconBg: 'bg-yellow-50' };
};

export const getStatusBadgeStyle = (status = '') => {
  const s = String(status).toLowerCase();
  if (s.includes('resolv') || s.includes('complet')) {
    return 'bg-emerald-50 text-emerald-800';
  }
  if (s.includes('evaluat') || s.includes('progress')) {
    return 'bg-purple-50 text-purple-800';
  }
  if (s.includes('review') || s.includes('pending')) {
    return 'bg-amber-50 text-amber-800';
  }
  return 'bg-blue-50 text-blue-800';
};

export const formatLiveChallenge = (ch) => {
  const domain = ch.domain || ch.category || 'General Problem';
  const { icon, iconColor, iconBg } = getDomainIconAndStyle(domain);
  const location = ch.locationDetails?.district
    ? `${ch.locationDetails.block || ''}${ch.locationDetails.block ? ', ' : ''}${ch.locationDetails.district}`
    : ch.district || ch.location || 'Jharkhand';

  const dateStr = ch.createdAt || ch.submittedAt || ch.submittedOn;
  const submittedOn = dateStr
    ? new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Recently';

  return {
    id: ch.challengeId || ch.id || 'JH-CHL',
    title: ch.title || 'Untitled Challenge',
    location,
    category: domain,
    icon,
    iconColor,
    iconBg,
    submittedOn,
    status: ch.status || 'Submitted',
    statusBg: getStatusBadgeStyle(ch.status)
  };
};
