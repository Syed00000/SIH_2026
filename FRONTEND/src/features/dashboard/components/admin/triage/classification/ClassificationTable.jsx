import React, { useState } from 'react';
import { Droplet, Sprout, Wrench, HeartPulse, Search, RotateCw, Eye, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Card } from '../../../../../../shared/components/ui/card.jsx';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../../../../../shared/components/ui/table.jsx';
import { Button } from '../../../../../../shared/components/ui/button.jsx';
import { Input } from '../../../../../../shared/components/ui/input.jsx';
import { Badge } from '../../../../../../shared/components/ui/badge.jsx';

export const ClassificationTable = ({ issues, onInspectIssue, onRefresh }) => {
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
    const matchesDomain = selectedDomain === 'All Domains' || issue.domain === selectedDomain;
    const matchesDistrict = selectedDistrict === 'All Districts' || issue.district === selectedDistrict;
    const matchesConfidence =
      selectedConfidence === 'All Confidence Levels' ||
      (selectedConfidence === 'High (>90%)' && issue.confidence >= 90) ||
      (selectedConfidence === 'Medium (80-90%)' && issue.confidence >= 80 && issue.confidence < 90) ||
      (selectedConfidence === 'Low (<80%)' && issue.confidence < 80);
    return matchesSearch && matchesDomain && matchesDistrict && matchesConfidence;
  });

  const getDomainBadge = (domain) => {
    switch (domain) {
      case 'Water':
        return <Badge variant="info" className="text-[10px] font-bold"><Droplet className="w-3 h-3 mr-1" />Water</Badge>;
      case 'Agriculture':
        return <Badge variant="success" className="text-[10px] font-bold"><Sprout className="w-3 h-3 mr-1" />Agriculture</Badge>;
      case 'Infrastructure':
        return <Badge variant="warning" className="text-[10px] font-bold"><Wrench className="w-3 h-3 mr-1" />Infrastructure</Badge>;
      case 'Health':
        return <Badge variant="danger" className="text-[10px] font-bold"><HeartPulse className="w-3 h-3 mr-1" />Health</Badge>;
      default:
        return <Badge variant="default" className="text-[10px] font-bold">{domain}</Badge>;
    }
  };

  return (
    <Card className="bg-white border-slate-200 p-3.5 shadow-2xs">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 mb-3 bg-slate-50/70 p-2.5 rounded-md border border-slate-200/60">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)} className="appearance-none border border-slate-200 rounded-md pl-2.5 pr-7 py-1.5 bg-white text-xs font-semibold text-slate-700 outline-none cursor-pointer">
              <option value="All Domains">All Domains</option>
              <option value="Water">Water</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Health">Health</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={selectedConfidence} onChange={(e) => setSelectedConfidence(e.target.value)} className="appearance-none border border-slate-200 rounded-md pl-2.5 pr-7 py-1.5 bg-white text-xs font-semibold text-slate-700 outline-none cursor-pointer">
              <option value="All Confidence Levels">All Confidence Levels</option>
              <option value="High (>90%)">High (&gt;90%)</option>
              <option value="Medium (80-90%)">Medium (80-90%)</option>
              <option value="Low (<80%)">Low (&lt;80%)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="appearance-none border border-slate-200 rounded-md pl-2.5 pr-7 py-1.5 bg-white text-xs font-semibold text-slate-700 outline-none cursor-pointer">
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
          <div className="relative flex-1 lg:flex-none">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
            <input type="text" placeholder="Search by Issue ID, Title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border border-slate-200 rounded-md pl-8 pr-3 py-1.5 bg-white text-xs font-medium text-slate-700 outline-none w-full lg:w-56" />
          </div>
          <Button variant="outline" size="sm" onClick={onRefresh} className="flex items-center gap-1">
            <RotateCw className="w-3.5 h-3.5 text-slate-500" /> Refresh
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Issue ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>District</TableHead>
            <TableHead>AI Domain</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Submitted On</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell className="font-bold text-slate-900 whitespace-nowrap">{issue.id}</TableCell>
                <TableCell className="max-w-[200px] truncate font-medium text-slate-800">{issue.title}</TableCell>
                <TableCell className="text-slate-600 whitespace-nowrap">{issue.submittedBy}</TableCell>
                <TableCell className="text-slate-600 whitespace-nowrap">{issue.district}</TableCell>
                <TableCell className="whitespace-nowrap">{getDomainBadge(issue.domain)}</TableCell>
                <TableCell className="font-extrabold text-emerald-700 whitespace-nowrap">{issue.confidence}%</TableCell>
                <TableCell className="text-slate-500 whitespace-nowrap">{issue.submittedOn}</TableCell>
                <TableCell className="text-center whitespace-nowrap">
                  <Button variant="outline" size="sm" onClick={() => onInspectIssue(issue)} className="py-1 px-2 text-[10px] font-bold">
                    <Eye className="w-3 h-3 mr-1" /> Review
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan="8" className="py-6 text-center text-slate-400 font-medium">No issues found matching your filters.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3 text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase">Showing 1 to {filteredIssues.length} of 128 issues</span>
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="sm" className="p-1 h-6 w-6" disabled><ChevronLeft className="w-3.5 h-3.5" /></Button>
          <Button variant="primary" size="sm" className="h-6 w-6 p-0 font-extrabold text-xs">1</Button>
          <Button variant="outline" size="sm" className="h-6 w-6 p-0 font-semibold text-xs">2</Button>
          <span className="px-1 text-slate-400 text-xs font-bold">...</span>
          <Button variant="outline" size="sm" className="h-6 w-6 p-0 font-semibold text-xs">26</Button>
          <Button variant="outline" size="sm" className="p-1 h-6 w-6"><ChevronRight className="w-3.5 h-3.5" /></Button>
        </div>
      </div>
    </Card>
  );
};

export default ClassificationTable;
