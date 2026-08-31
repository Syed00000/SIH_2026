import React from 'react';
import { MapPin, Droplet, Wrench, BookOpen, Trash2 } from 'lucide-react';

const defaultRecentChallenges = [
  {
    id: 'JH-2026-00124',
    title: 'Drinking Water Shortage in Rural Area',
    location: 'Ratu, Ranchi',
    category: 'Water',
    icon: Droplet,
    iconColor: 'text-blue-700',
    iconBg: 'bg-blue-50',
    status: 'Under Review',
    statusBg: 'bg-amber-50 text-amber-800',
    updated: '2 days ago'
  },
  {
    id: 'JH-2026-00120',
    title: 'Broken Road Causing Travel Issues',
    location: 'Ratu, Ranchi',
    category: 'Infrastructure',
    icon: Wrench,
    iconColor: 'text-slate-700',
    iconBg: 'bg-slate-100',
    status: 'Submitted',
    statusBg: 'bg-blue-50 text-blue-700',
    updated: '4 days ago'
  },
  {
    id: 'JH-2026-00115',
    title: 'School Toilet Facility Issue',
    location: 'Ratu, Ranchi',
    category: 'Education',
    icon: BookOpen,
    iconColor: 'text-purple-700',
    iconBg: 'bg-purple-50',
    status: 'In Evaluation',
    statusBg: 'bg-purple-50 text-purple-700',
    updated: '1 week ago'
  },
  {
    id: 'JH-2026-00110',
    title: 'Garbage Disposal Problem',
    location: 'Ratu, Ranchi',
    category: 'Sanitation',
    icon: Trash2,
    iconColor: 'text-teal-700',
    iconBg: 'bg-teal-50',
    status: 'Under Review',
    statusBg: 'bg-amber-50 text-amber-800',
    updated: '1 week ago'
  }
];

export const RecentChallengesTable = ({
  challenges = defaultRecentChallenges,
  onViewAll
}) => {
  return (
    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
          <h3 className="font-bold text-slate-900 text-sm">My Recent Challenges</h3>
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="text-slate-400 font-bold border-b border-slate-100 bg-slate-50/60">
                <th className="py-2 px-2.5">Challenge ID</th>
                <th className="py-2 px-2.5">Title</th>
                <th className="py-2 px-2.5">Location</th>
                <th className="py-2 px-2.5">Category</th>
                <th className="py-2 px-2.5">Status</th>
                <th className="py-2 px-2.5">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {challenges.map((ch) => {
                const IconComponent = ch.icon;
                return (
                  <tr key={ch.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-2.5 font-semibold text-slate-900">{ch.id}</td>
                    <td className="py-2.5 px-2.5 max-w-[180px] truncate font-medium text-slate-800">
                      {ch.title}
                    </td>
                    <td className="py-2.5 px-2.5 text-slate-500 whitespace-nowrap">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 text-slate-400 mr-1 flex-shrink-0" />
                        {ch.location}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${ch.iconBg} ${ch.iconColor}`}>
                        <IconComponent className="w-3 h-3 mr-1" />
                        {ch.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${ch.statusBg}`}>
                        {ch.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 text-slate-400 whitespace-nowrap">{ch.updated}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentChallengesTable;
