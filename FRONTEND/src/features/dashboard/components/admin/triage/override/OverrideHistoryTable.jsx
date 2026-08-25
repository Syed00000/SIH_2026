import React from 'react';
import { History, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../../../shared/components/ui/card.jsx';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../../../../../shared/components/ui/table.jsx';
import { Badge } from '../../../../../../shared/components/ui/badge.jsx';

export const OverrideHistoryTable = () => {
  const history = [
    {
      id: 'IS-2026-00492',
      prevDomain: 'Water Resources',
      newDomain: 'Public Infrastructure',
      changedBy: 'Admin (Super Admin)',
      timestamp: '24 May 2026 04:15 PM',
      reason: 'Drainage culvert collapse'
    },
    {
      id: 'IS-2026-00481',
      prevDomain: 'Health',
      newDomain: 'Sanitation & Waste',
      changedBy: 'Admin (Super Admin)',
      timestamp: '23 May 2026 11:30 AM',
      reason: 'Garbage dump near school'
    },
    {
      id: 'IS-2026-00465',
      prevDomain: 'Agriculture',
      newDomain: 'Water Resources',
      changedBy: 'Admin (Super Admin)',
      timestamp: '22 May 2026 02:45 PM',
      reason: 'Canal lift irrigation malfunction'
    }
  ];

  return (
    <Card className="bg-white border-slate-200 p-3.5 shadow-2xs">
      <div className="flex items-center space-x-1.5 pb-2 border-b border-slate-100 mb-2.5">
        <History className="w-3.5 h-3.5 text-slate-500" />
        <h4 className="font-bold text-slate-900 text-xs md:text-sm">
          Manual Override Audit Trail
        </h4>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Issue ID</TableHead>
            <TableHead>Previous Domain</TableHead>
            <TableHead></TableHead>
            <TableHead>Updated Domain</TableHead>
            <TableHead>Overridden By</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-bold text-slate-900 whitespace-nowrap">{row.id}</TableCell>
              <TableCell className="text-slate-500 whitespace-nowrap">{row.prevDomain}</TableCell>
              <TableCell className="text-slate-400 p-1"><ArrowRight className="w-3 h-3" /></TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant="info" className="font-bold">{row.newDomain}</Badge>
              </TableCell>
              <TableCell className="text-slate-600 whitespace-nowrap">{row.changedBy}</TableCell>
              <TableCell className="text-slate-400 whitespace-nowrap">{row.timestamp}</TableCell>
              <TableCell className="text-slate-600 max-w-[200px] truncate">{row.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default OverrideHistoryTable;
