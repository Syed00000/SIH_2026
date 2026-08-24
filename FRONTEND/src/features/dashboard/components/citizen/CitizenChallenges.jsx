import React, { useState } from 'react';
import {
  Plus,
  FileText,
  Hourglass,
  Activity,
  CheckCircle2,
  MapPin,
  Droplet,
  Wrench,
  BookOpen,
  Trash2,
  Lightbulb,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical
} from 'lucide-react';

export const CitizenChallenges = ({ user, setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  const challengesList = [
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

  const filtered = challengesList.filter((ch) => {
    const matchesSearch =
      ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || ch.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'All Categories' || ch.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs">
        <div>
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
            My Challenges
          </h2>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Track and manage the challenges you have submitted to JOHARSETU.
          </p>
        </div>

        <button
          onClick={() => alert('New challenge submission wizard opening...')}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-md shadow-xs flex items-center transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Submit New Challenge
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Challenges */}
        <div className="bg-white border border-slate-200 p-3.5 rounded-md shadow-2xs hover:border-slate-300 transition-all flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
              Total Challenges
            </span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block leading-tight">
              05
            </span>
            <span className="text-[10px] font-medium text-slate-400 block">All Challenges</span>
          </div>
        </div>

        {/* Under Review */}
        <div className="bg-white border border-slate-200 p-3.5 rounded-md shadow-2xs hover:border-slate-300 transition-all flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-md bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
            <Hourglass className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
              Under Review
            </span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block leading-tight">
              02
            </span>
            <span className="text-[10px] font-medium text-slate-400 block">Challenges</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white border border-slate-200 p-3.5 rounded-md shadow-2xs hover:border-slate-300 transition-all flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-md bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
              In Progress
            </span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block leading-tight">
              01
            </span>
            <span className="text-[10px] font-medium text-slate-400 block">Challenges</span>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white border border-slate-200 p-3.5 rounded-md shadow-2xs hover:border-slate-300 transition-all flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
              Resolved
            </span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block leading-tight">
              02
            </span>
            <span className="text-[10px] font-medium text-slate-400 block">Challenges</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-md shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none border border-slate-200 rounded-md pl-3 pr-7 py-1.5 bg-white text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-slate-900 focus:border-slate-900 min-w-[105px]"
            >
              <option value="All Status">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="In Evaluation">In Evaluation</option>
              <option value="Resolved">Resolved</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none border border-slate-200 rounded-md pl-3 pr-7 py-1.5 bg-white text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-slate-900 focus:border-slate-900 min-w-[125px]"
            >
              <option value="All Categories">All Categories</option>
              <option value="Water Management">Water Management</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Education">Education</option>
              <option value="Sanitation">Sanitation</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Time Filter */}
          <div className="relative">
            <select className="appearance-none border border-slate-200 rounded-md pl-3 pr-7 py-1.5 bg-white text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-slate-900 focus:border-slate-900 min-w-[90px]">
              <option value="All Time">All Time</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 6 Months">Last 6 Months</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by challenge title or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-slate-200 rounded-md pl-8 pr-3 py-1.5 bg-white text-xs font-medium text-slate-700 outline-none w-full md:w-72 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
          />
        </div>
      </div>

      {/* Submitted Challenges Table */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
        <h3 className="font-bold text-slate-900 text-sm pb-2.5 border-b border-slate-100 mb-3">
          My Submitted Challenges
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="text-slate-400 font-bold border-b border-slate-100 bg-slate-50/60">
                <th className="py-2.5 px-3">Challenge ID</th>
                <th className="py-2.5 px-3">Challenge Title</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Submitted On</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length > 0 ? (
                filtered.map((ch) => {
                  const IconC = ch.icon;
                  return (
                    <tr key={ch.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{ch.id}</td>
                      <td className="py-2.5 px-3 max-w-[220px] truncate font-medium text-slate-800">
                        {ch.title}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 text-slate-400 mr-1 flex-shrink-0" />
                          {ch.location}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${ch.iconBg} ${ch.iconColor}`}
                        >
                          <IconC className="w-3 h-3 mr-1" />
                          {ch.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                        {ch.submittedOn}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${ch.statusBg}`}
                        >
                          {ch.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-center">
                        <div className="inline-flex items-center space-x-1.5">
                          <button
                            onClick={() => alert(`Opening details for ${ch.id}...`)}
                            className="inline-flex items-center border border-slate-200 rounded px-2 py-0.5 bg-white text-[10px] font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </button>
                          <button
                            className="p-1 border border-transparent rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                            title="More options"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-slate-400 font-medium">
                    No challenges found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Showing 1 to {filtered.length} of {filtered.length} challenges
          </span>

          <div className="flex items-center space-x-1">
            <button
              className="p-1 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-40 transition-colors"
              disabled
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-6 h-6 rounded bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shadow-2xs">
              1
            </button>
            <button
              className="p-1 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-40 transition-colors"
              disabled
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CitizenChallenges;
