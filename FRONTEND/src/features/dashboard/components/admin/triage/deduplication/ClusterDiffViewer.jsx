import React, { useState } from 'react';
import { Check, X, ShieldCheck, Layers } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../../../shared/components/ui/card.jsx';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../../../../../shared/components/ui/table.jsx';
import { Badge } from '../../../../../../shared/components/ui/badge.jsx';
import { Button } from '../../../../../../shared/components/ui/button.jsx';

export const ClusterDiffViewer = ({ cluster }) => {
  const [feedback, setFeedback] = useState(null);

  const clusterItems = [
    {
      id: 'IS-2026-00401',
      title: 'Water pipe leak in Main Ward 4',
      submittedBy: 'Suresh Yadav',
      location: 'Dumka',
      submittedOn: '20 May 2026',
      similarity: '100% (Master)',
      isMaster: true
    },
    {
      id: 'IS-2026-00411',
      title: 'No drinking water supply ward 4 leakage',
      submittedBy: 'Pinki Kumari',
      location: 'Dumka',
      submittedOn: '20 May 2026',
      similarity: '96%',
      isMaster: false
    },
    {
      id: 'IS-2026-00423',
      title: 'Broken pipeline near community hall Dumka',
      submittedBy: 'Vikash Mahto',
      location: 'Dumka',
      submittedOn: '21 May 2026',
      similarity: '86%',
      isMaster: false
    }
  ];

  const handleApprove = () => {
    setFeedback({ type: 'success', text: `Cluster ${cluster?.id || 'CL-2026-0045'} successfully merged into Master ticket!` });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleReject = () => {
    setFeedback({ type: 'error', text: 'Merge rejected. Tickets retained as distinct issues.' });
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <Card className="bg-white border-slate-200 p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <span className="font-extrabold text-slate-900 text-sm">
            Resolution Matrix: {cluster?.id || 'CL-2026-0045'}
          </span>
          <p className="text-[11px] text-slate-500 font-medium">
            AI Semantic Similarity Confidence: <strong className="text-emerald-700">{cluster?.similarity || '92%'}</strong>
          </p>
        </div>
        <Badge variant="success" className="text-[10px] font-bold flex items-center">
          <ShieldCheck className="w-3 h-3 mr-1" />
          High Confidence Duplicate
        </Badge>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Issue ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Similarity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clusterItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-bold text-slate-900 whitespace-nowrap">{item.id}</TableCell>
              <TableCell className="max-w-[200px] truncate font-medium">{item.title}</TableCell>
              <TableCell className="text-slate-600 whitespace-nowrap">{item.submittedBy}</TableCell>
              <TableCell className="text-slate-500 whitespace-nowrap">{item.location}</TableCell>
              <TableCell className="text-slate-400 whitespace-nowrap">{item.submittedOn}</TableCell>
              <TableCell className="text-right font-bold whitespace-nowrap">
                <Badge variant={item.isMaster ? 'success' : 'default'} className="text-[10px]">
                  {item.similarity}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {feedback && (
        <div className={`p-2 rounded text-xs font-semibold flex items-center border ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {feedback.type === 'success' ? <Check className="w-3.5 h-3.5 mr-1" /> : <X className="w-3.5 h-3.5 mr-1" />}
          {feedback.text}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <Button
          variant="outline"
          size="sm"
          onClick={() => alert('Inspecting full cluster CL-2026-0045 telemetry...')}
          className="flex items-center gap-1"
        >
          <Layers className="w-3.5 h-3.5 mr-1 text-slate-500" />
          View Cluster Details
        </Button>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReject}
            className="text-red-600 border-red-200 hover:bg-red-50 font-bold"
          >
            Reject Merge
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleApprove}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            Approve & Merge
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ClusterDiffViewer;
