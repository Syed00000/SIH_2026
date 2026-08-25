import React, { useState } from 'react';
import {
  Droplet,
  Sprout,
  Wrench,
  HeartPulse,
  Search,
  RotateCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export const DomainClassificationTable = ({
  issues,
  selectedIssue,
  onSelectIssue,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [selectedConfidence, setSelectedConfidence] = useState('All Confidence Levels');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDomain =
      selectedDomain === 'All Domains' || issue.domain === selectedDomain;

    const matchesDistrict =
      selectedDistrict === 'All Districts' || issue.district === selectedDistrict;

    const matchesConfidence =
      selectedConfidence === 'All Confidence Levels' ||
      (selectedConfidence === 'High (>90%)' && issue.confidence >= 90) ||
      (selectedConfidence === 'Medium (80-90%)' &&
        issue.confidence >= 80 &&
        issue.confidence < 90) ||
      (selectedConfidence === 'Low (<80%)' && issue.confidence < 80);

    return matchesSearch && matchesDomain && matchesDistrict && matchesConfidence;
  });

  const getDomainBadge = (domain) => {
    switch (domain) {
      case 'Water':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
            <Droplet className="w-3 h-3 mr-1" />
            Water
          </span>
        );
      case 'Agriculture':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
            <Sprout className="w-3 h-3 mr-1" />
            Agriculture
          </span>
        );
      case 'Infrastructure':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800">
            <Wrench className="w-3 h-3 mr-1" />
            Infrastructure
          </span>
        );
      case 'Health':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700">
            <HeartPulse className="w-3 h-3 mr-1" />
            Health
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
            {domain}
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
      {/* Title with Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center space-x-2.5">
          <h3 className="font-bold text-slate-900 text-sm md:text-base">
            1. Domain Auto-Classification Review
          </h3>
          <span className="bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Pending Review: 128
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 mb-3.5 bg-slate-50/70 p-2.5 rounded-md border border-slate-200/60">
        <div className="flex flex-wrap items-center gap-2">
          {/* Domain Dropdown */}
          <div className="relative">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="appearance-none border border-slate-200 rounded-md pl-2.5 pr-7 py-1.5 bg-white text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-slate-900 focus:border-slate-900 min-w-[110px]"
            >
              <option value="All Domains">All Domains</option>
              <option value="Water">Water</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Health">Health</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Confidence Dropdown */}
          <div className="relative">
            <select
              value={selectedConfidence}
              onChange={(e) => setSelectedConfidence(e.target.value)}
              className="appearance-none border border-slate-200 rounded-md pl-2.5 pr-7 py-1.5 bg-white text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-slate-900 focus:border-slate-900 min-w-[145px]"
            >
              <option value="All Confidence Levels">All Confidence Levels</option>
              <option value="High (>90%)">High (&gt;90%)</option>
              <option value="Medium (80-90%)">Medium (80-90%)</option>
              <option value="Low (<80%)">Low (&lt;80%)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>

          {/* District Dropdown */}
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="appearance-none border border-slate-200 rounded-md pl-2.5 pr-7 py-1.5 bg-white text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-slate-900 focus:border-slate-900 min-w-[115px]"
            >
              <option value="All Districts">All Districts</option>
              <option value="Dhanbad">Dhanbad</option>
              <option value="Godda">Godda</option>
              <option value="Ranchi">Ranchi</option>
              <option value="Jamshedpur">Jamshedpur</option>
              <option value="Gumla">Gumla</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 lg:flex-none">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Issue ID, Title or Location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-slate-200 rounded-md pl-8 pr-3 py-1.5 bg-white text-xs font-medium text-slate-700 outline-none w-full lg:w-64 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="flex items-center border border-slate-200 rounded-md px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Refresh Table"
          >
            <RotateCw className="w-3.5 h-3.5 mr-1 text-slate-500" />
            Refresh
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="text-slate-500 font-bold border-b border-slate-200 bg-slate-50/80">
              <th className="py-2.5 px-3">Issue ID</th>
              <th className="py-2.5 px-3">Title</th>
              <th className="py-2.5 px-3">Submitted By</th>
              <th className="py-2.5 px-3">District</th>
              <th className="py-2.5 px-3">AI Predicted Domain</th>
              <th className="py-2.5 px-3">Confidence Score</th>
              <th className="py-2.5 px-3">Submitted On</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => {
                const isSelected = selectedIssue?.id === issue.id;
                return (
                  <tr
                    key={issue.id}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-blue-50/60 font-medium'
                        : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {issue.id}
                    </td>
                    <td className="py-2.5 px-3 max-w-[200px] truncate font-medium text-slate-800">
                      {issue.title}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                      {issue.submittedBy}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                      {issue.district}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {getDomainBadge(issue.domain)}
                    </td>
                    <td className="py-2.5 px-3 font-extrabold text-emerald-700 whitespace-nowrap">
                      {issue.confidence}%
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      {issue.submittedOn}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => onSelectIssue(issue)}
                        className={`inline-flex items-center border rounded px-2 py-1 text-[10px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="py-8 text-center text-slate-400 font-medium">
                  No issues found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase">
          Showing 1 to {filteredIssues.length} of 128 issues
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
          <button className="w-6 h-6 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center">
            2
          </button>
          <button className="w-6 h-6 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center">
            3
          </button>
          <span className="px-1 text-slate-400 text-xs font-bold">...</span>
          <button className="w-6 h-6 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center">
            26
          </button>
          <button className="p-1 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-500 transition-colors">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DomainClassificationTable;
