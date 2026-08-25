import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../../../shared/components/ui/card.jsx';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../../../../../shared/components/ui/table.jsx';
import { Badge } from '../../../../../../shared/components/ui/badge.jsx';

export const EscalationQueueTable = () => {
  const escalatedIssues = [
    {
      id: 'IS-2026-00521',
      title: 'Contaminated Drinking Water in Village',
      district: 'Dhanbad',
      priority: 'Critical',
      department: 'Drinking Water & Sanitation',
      slaRemaining: '18h 40m',
      status: 'Action In Progress'
    },
    {
      id: 'IS-2026-00499',
      title: 'Primary Health Centre Doctor Absent for 15 Days',
      district: 'Garhwa',
      priority: 'Urgent',
      department: 'Health, Medical Education & Family Welfare',
      slaRemaining: '34h 10m',
      status: 'Assigned to CMO'
    },
    {
      id: 'IS-2026-00472',
      title: 'Bridge Culvert Collapsed on School Route',
      district: 'Latehar',
      priority: 'High',
      department: 'Road Construction Department',
      slaRemaining: '48h 00m',
      status: 'Site Survey Ordered'
    }
  ];

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'Critical':
        return <Badge variant="danger" className="font-bold">Critical</Badge>;
      case 'Urgent':
        return <Badge variant="warning" className="font-bold">Urgent</Badge>;
      case 'High':
        return <Badge variant="warning" className="font-bold bg-amber-50 text-amber-800">High</Badge>;
      default:
        return <Badge variant="info" className="font-bold">Normal</Badge>;
    }
  };

  return (
    <Card className="bg-white border-slate-200 p-3.5 shadow-2xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
        <div className="flex items-center space-x-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-red-600" />
          <h4 className="font-bold text-slate-900 text-xs md:text-sm">
            Active Escalation Queue & SLA Monitor
          </h4>
        </div>
        <Badge variant="danger" className="text-[10px] font-bold">
          3 Urgent Incidents
        </Badge>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Issue ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>District</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assigned Department</TableHead>
            <TableHead>SLA Time Remaining</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {escalatedIssues.map((iss) => (
            <TableRow key={iss.id}>
              <TableCell className="font-bold text-slate-900 whitespace-nowrap">{iss.id}</TableCell>
              <TableCell className="max-w-[200px] truncate font-medium">{iss.title}</TableCell>
              <TableCell className="text-slate-600 whitespace-nowrap">{iss.district}</TableCell>
              <TableCell className="whitespace-nowrap">{getPriorityBadge(iss.priority)}</TableCell>
              <TableCell className="text-slate-600 truncate max-w-[160px]">{iss.department}</TableCell>
              <TableCell className="font-bold text-red-600 whitespace-nowrap">
                <span className="inline-flex items-center"><Clock className="w-3 h-3 mr-1" />{iss.slaRemaining}</span>
              </TableCell>
              <TableCell className="font-semibold text-slate-800 whitespace-nowrap">{iss.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default EscalationQueueTable;
