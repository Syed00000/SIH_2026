import React, { useState } from 'react';
import { Check, X, ShieldCheck, Layers } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../shared/components/ui/card.jsx';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../../../shared/components/ui/table.jsx';
import { Badge } from '../../../../shared/components/ui/badge.jsx';
import { Button } from '../../../../shared/components/ui/button.jsx';

export const ClusterDiffViewer = ({ cluster }) => {
  const [feedback, setFeedback] = useState(null);

  const clusterItems = [
    {
      id: 'IS-2026-00482',
      title: 'Heavy soil erosion endangering paddy terraces along Swarnarekha',
      submittedBy: 'Kisan Samiti Namkum',
      date: '24 Aug 2026',
      isPrimary: true,
      similarity: '100% (Master)'
    },
    {
      id: 'IS-2026-00484',
      title: 'River embankment erosion breaking field boundaries in Namkum Block',
      submittedBy: 'Rameshwar Mahto',
      date: '24 Aug 2026',
      isPrimary: false,
      similarity: '96.2%'
    },
    {
      id: 'IS-2026-00489',
      title: 'Swarnarekha flood embankment broken near lower Namkum village',
      submittedBy: 'Gram Panchayat Vikas',
      date: '23 Aug 2026',
      isPrimary: false,
      similarity: '93.4%'
    }
  ];

  const handleMerge = () => {
    setFeedback('merged');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleReject = () => {
    setFeedback('split');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <Card className="bg-white border-slate-200 shadow-2xs">
      <CardHeader className="p-3.5 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-purple-600" />
          <div>
            <CardTitle className="text-xs md:text-sm font-bold text-slate-900">
              Cluster Comparison & Merging Studio
            </CardTitle>
            <span className="text-[10px] text-slate-400 font-medium">
              Target Cluster: {cluster?.id || 'CL-0912'} (3 Submissions)
            </span>
          </div>
        </div>
        <Badge variant="ai" className="text-[10px] font-bold">
          Avg Similarity: 94.8%
        </Badge>
      </CardHeader>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Issue ID</TableHead>
            <TableHead>Problem Statement</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Similarity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clusterItems.map((item) => (
            <TableRow key={item.id} className={item.isPrimary ? 'bg-purple-50/30' : ''}>
              <TableCell>
                {item.isPrimary ? (
                  <Badge variant="info" className="font-extrabold">Master Issue</Badge>
                ) : (
                  <Badge variant="default" className="font-semibold text-slate-600">Duplicate</Badge>
                )}
              </TableCell>
              <TableCell className="font-bold text-slate-900">{item.id}</TableCell>
              <TableCell className="max-w-[260px] font-medium truncate">{item.title}</TableCell>
              <TableCell className="text-slate-600">{item.submittedBy}</TableCell>
              <TableCell className="text-slate-500">{item.date}</TableCell>
              <TableCell className="font-bold text-purple-700">{item.similarity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="text-[11px] text-slate-500 font-medium">
          Merging links duplicate tickets to Master ticket <strong className="text-slate-800">IS-2026-00482</strong> and notifies citizen authors.
        </span>

        {feedback === 'merged' && (
          <span className="text-emerald-700 text-xs font-bold flex items-center">
            <Check className="w-3.5 h-3.5 mr-1" /> Duplicate issues successfully merged into Master!
          </span>
        )}

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <Button size="sm" variant="outline" onClick={handleReject} className="text-rose-600 hover:text-rose-700 font-bold">
            <X className="w-3 h-3 mr-1" /> Keep Separate
          </Button>
          <Button size="sm" variant="primary" onClick={handleMerge} className="bg-purple-600 hover:bg-purple-700 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Approve & Merge Cluster
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ClusterDiffViewer;
