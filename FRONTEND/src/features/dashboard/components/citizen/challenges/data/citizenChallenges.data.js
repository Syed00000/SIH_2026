import { Droplet, Wrench, BookOpen, Trash2, Lightbulb } from 'lucide-react';

export const initialCitizenChallenges = [
  {
    id: 'JH-2026-00124',
    title: 'Drinking Water Shortage in Rural Area',
    location: 'Ratu, Ranchi',
    category: 'Water Management',
    icon: Droplet,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    submittedOn: '12 May 2026',
    status: 'Under Review',
    statusBg: 'bg-amber-50 text-amber-800'
  },
  {
    id: 'JH-2026-00120',
    title: 'Broken Road Causing Travel Issues',
    location: 'Ratu, Ranchi',
    category: 'Infrastructure',
    icon: Wrench,
    iconColor: 'text-slate-600',
    iconBg: 'bg-slate-100',
    submittedOn: '10 May 2026',
    status: 'Submitted',
    statusBg: 'bg-blue-50 text-blue-800'
  },
  {
    id: 'JH-2026-00115',
    title: 'School Toilet Facility Issue',
    location: 'Ratu, Ranchi',
    category: 'Education',
    icon: BookOpen,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
    submittedOn: '05 May 2026',
    status: 'In Evaluation',
    statusBg: 'bg-purple-50 text-purple-800'
  },
  {
    id: 'JH-2026-00110',
    title: 'Garbage Disposal Problem',
    location: 'Ratu, Ranchi',
    category: 'Sanitation',
    icon: Trash2,
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-50',
    submittedOn: '02 May 2026',
    status: 'Under Review',
    statusBg: 'bg-amber-50 text-amber-800'
  },
  {
    id: 'JH-2026-00105',
    title: 'Street Light Not Working in Locality',
    location: 'Ratu, Ranchi',
    category: 'Infrastructure',
    icon: Lightbulb,
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-50',
    submittedOn: '28 Apr 2026',
    status: 'Resolved',
    statusBg: 'bg-emerald-50 text-emerald-800'
  }
];

export default initialCitizenChallenges;
