import React from 'react';
import { History, ArrowRight, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../shared/components/ui/card.jsx';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../../../shared/components/ui/table.jsx';
import { Badge } from '../../../../shared/components/ui/badge.jsx';

export const OverrideHistoryTable = ({ history = [] }) => {
  return (
    <Card className="bg-white border-slate-200 shadow-2xs">
      <CardHeader className="p-3 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <History className="w-3.5 h-3.5 text-slate-700" />
          <CardTitle className="text-xs md:text-sm font-bold text-slate-900">
            Recent Override & Reclassification Audit Log
          </CardTitle>
        </div>
        <Badge variant="info" className="text-[10px] font-bold">
          Immutable Audit Trail
        </Badge>
      </CardHeader>

      {history.length === 0 ? (
        <CardContent className="p-6 text-center text-slate-500 text-xs">
          <Info className="w-5 h-5 mx-auto text-slate-400 mb-1" />
          No manual override history recorded yet.
        </CardContent>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Issue ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Previous Sector</TableHead>
              <TableHead></TableHead>
              <TableHead>New Reclassified Sector</TableHead>
              <TableHead>Modified By</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>AI Retrained</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-bold text-slate-900 whitespace-nowrap">{row.id}</TableCell>
                <TableCell className="max-w-[200px] truncate font-medium">{row.title}</TableCell>
                <TableCell className="text-slate-500 whitespace-nowrap">{row.prevDomain}</TableCell>
                <TableCell><ArrowRight className="w-3 h-3 text-slate-400" /></TableCell>
                <TableCell className="font-bold text-slate-900 whitespace-nowrap">{row.newDomain}</TableCell>
                <TableCell className="text-slate-600 whitespace-nowrap">{row.officer}</TableCell>
                <TableCell className="text-slate-500 whitespace-nowrap">{row.date}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge variant="success" className="text-[10px] font-bold">✓ Model Queued</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

export default OverrideHistoryTable;
