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
      case 'Water Resources': return <Droplet className="w-3 h-3 text-blue-500 mr-1" />;
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Issue ID</TableHead>
            <TableHead>Problem Statement</TableHead>
            <TableHead>District</TableHead>
            <TableHead>AI Classified Sector</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Sub-Sector</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredIssues.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-bold text-slate-900 whitespace-nowrap">{row.id}</TableCell>
              <TableCell className="max-w-[220px] truncate font-medium text-slate-800">{row.title}</TableCell>
              <TableCell className="text-slate-600 whitespace-nowrap">{row.district}</TableCell>
              <TableCell className="whitespace-nowrap">
                <span className="inline-flex items-center text-slate-800 font-semibold text-xs">
                  {getDomainIcon(row.domain)}
                  {row.domain}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap">{getConfidenceBadge(row.confidence)}</TableCell>
              <TableCell className="text-slate-500 text-xs truncate max-w-[120px]">{row.subSector}</TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant={row.status === 'Auto-Routed' ? 'info' : 'default'} className="font-medium">
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right whitespace-nowrap">
                <Button size="sm" variant="ghost" onClick={() => onInspectIssue(row)} className="h-7 text-xs text-blue-600 hover:text-blue-800">
                  <Eye className="w-3.5 h-3.5 mr-1" /> Inspect
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ClassificationTable;
