import React from 'react';
import { Wrench, Clock, CheckCircle2, Search } from 'lucide-react';

export const TechnicianToolbar = ({ counts, activeFilter, onFilterChange, searchQuery, onSearchChange, loading }) => {
  const metricCards = [
    { label: 'Assigned Tasks', val: counts.total, icon: Wrench, color: 'text-slate-900', bg: 'bg-white', border: 'border-slate-200' },
    { label: 'Pending Acceptance', val: counts.pending, icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50/40', border: 'border-amber-200' },
    { label: 'Active on Field', val: counts.active, icon: Wrench, color: 'text-blue-700', bg: 'bg-blue-50/40', border: 'border-blue-200' },
    { label: 'Completed & Done', val: counts.completed, icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50/40', border: 'border-emerald-200' },
  ];

  const filterTabs = [
    { key: 'all', label: 'All Tasks', count: counts.total },
    { key: 'pending', label: 'Action Needed', count: counts.pending },
    { key: 'active', label: 'Active on Field', count: counts.active },
    { key: 'completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="space-y-3 select-none">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metricCards.map((m) => (
          <div key={m.label} className={`p-4 rounded-2xl border ${m.border} ${m.bg} shadow-2xs text-left`}>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-bold text-slate-600">{m.label}</span>
              <m.icon className="w-4 h-4" />
            </div>
            <span className={`text-2xl font-black ${m.color}`}>{loading ? '...' : m.val}</span>
          </div>
        ))}
      </div>

      {/* Filter Controls & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onFilterChange(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === tab.key ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeFilter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search assigned tasks..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#007A61]"
          />
        </div>
      </div>
    </div>
  );
};
