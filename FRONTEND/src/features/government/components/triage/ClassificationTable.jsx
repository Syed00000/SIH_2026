import React, { useState } from 'react';
import { Droplet, Sprout, Wrench, HeartPulse, Search, RotateCw, Eye } from 'lucide-react';
import { Card } from '../../../../shared/components/ui/card.jsx';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../../../shared/components/ui/table.jsx';
import { Button } from '../../../../shared/components/ui/button.jsx';
import { Input } from '../../../../shared/components/ui/input.jsx';
import { Badge } from '../../../../shared/components/ui/badge.jsx';

export const ClassificationTable = ({ issues, onInspectIssue, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('All');

  const filteredIssues = issues.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomainFilter === 'All' || item.domain === selectedDomainFilter;
    return matchesSearch && matchesDomain;
  });

  const getDomainIcon = (domain) => {
    switch (domain) {
      case 'Water Resources': return <Droplet className="w-3 h-3 text-[#007A61] mr-1" />;
      case 'Agriculture': return <Sprout className="w-3 h-3 text-emerald-500 mr-1" />;
      case 'Public Infrastructure': return <Wrench className="w-3 h-3 text-amber-500 mr-1" />;
      case 'Healthcare': return <HeartPulse className="w-3 h-3 text-rose-500 mr-1" />;
      default: return <Droplet className="w-3 h-3 text-slate-500 mr-1" />;
    }
  };

  const getConfidenceBadge = (score) => {
    if (score >= 85) return <Badge variant="success" className="font-bold">{score}%</Badge>;
    if (score >= 70) return <Badge variant="warning" className="font-bold">{score}%</Badge>;
    return <Badge variant="danger" className="font-bold">{score}%</Badge>;
  };

  return (
    <Card className="bg-white border-slate-200 shadow-2xs overflow-hidden">
      <div className="p-3 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search by ID, title, keyword or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-72 h-8 text-xs"
          />
          <select
            value={selectedDomainFilter}
            onChange={(e) => setSelectedDomainFilter(e.target.value)}
            className="h-8 text-xs border border-slate-200 rounded px-2 bg-white text-slate-700 font-medium"
          >
            <option value="All">All Domains</option>
            <option value="Water Resources">Water Resources</option>
            <option value="Public Infrastructure">Public Infrastructure</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Agriculture">Agriculture</option>
          </select>
        </div>

        <div className="flex items-center space-x-1.5 self-end md:self-auto">
          <Button size="sm" variant="outline" onClick={onRefresh} className="h-8 text-xs font-semibold">
            <RotateCw className="w-3 h-3 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <table className="w-full text-left text-xs border-collapse table-fixed">
          <thead className="border-b border-slate-100 bg-slate-50/70 text-[10px] uppercase font-bold text-slate-400">
            <tr>
              <th className="py-2.5 px-3 w-[13%]">Issue ID</th>
              <th className="py-2.5 px-2.5 w-[27%]">Problem Statement</th>
              <th className="py-2.5 px-2 w-[10%]">District</th>
              <th className="py-2.5 px-2 w-[16%]">Classified Sector</th>
              <th className="py-2.5 px-1.5 w-[8%] text-center">Confidence</th>
              <th className="py-2.5 px-2 w-[10%]">Sub-Sector</th>
              <th className="py-2.5 px-1.5 w-[8%]">Status</th>
              <th className="py-2.5 px-2 w-[8%] text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredIssues.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-3 font-mono font-bold text-slate-900 text-[11px] truncate">
                  {row.id}
                </td>
                <td className="py-3 px-2.5 font-medium text-slate-800 text-[11px] truncate" title={row.title}>
                  {row.title}
                </td>
                <td className="py-3 px-2 text-slate-600 text-[10.5px] truncate">
                  {row.district}
                </td>
                <td className="py-3 px-2 truncate">
                  <span className="inline-flex items-center text-slate-800 font-semibold text-[10.5px] truncate">
                    {getDomainIcon(row.domain)}
                    <span className="truncate">{row.domain}</span>
                  </span>
                </td>
                <td className="py-3 px-1.5 text-center">
                  <span className="font-mono text-[11px] font-bold text-slate-800">
                    {row.confidence}%
                  </span>
                </td>
                <td className="py-3 px-2 text-slate-500 text-[10px] truncate" title={row.subSector}>
                  {row.subSector}
                </td>
                <td className="py-3 px-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        row.status === 'Auto-Routed' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span className="text-[10.5px] font-medium text-slate-700 whitespace-nowrap">
                      {row.status === 'Auto-Routed' ? 'Auto-Routed' : 'Review'}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2 text-center">
                  <button
                    onClick={() => onInspectIssue(row)}
                    className="inline-block px-2.5 py-1 text-[10.5px] font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-md transition-colors cursor-pointer"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ClassificationTable;
