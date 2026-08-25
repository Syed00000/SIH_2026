import React from 'react';
import { Layers, MapPin } from 'lucide-react';
import { Card } from '../../../../shared/components/ui/card.jsx';
import { Badge } from '../../../../shared/components/ui/badge.jsx';

export const ClusterListPanel = ({ selectedCluster, onSelectCluster }) => {
  const clusters = [
    {
      id: 'CL-0912',
      primaryTitle: 'Swarnarekha Riverbed Soil Erosion near Namkum Bridge',
      district: 'Ranchi',
      duplicateCount: 3,
      similarityScore: 94.8,
      status: 'Ready for Merge'
    },
    {
      id: 'CL-0887',
      primaryTitle: 'Primary Health Centre Doctor Absenteeism & Medicine Shortage',
      district: 'Garhwa',
      duplicateCount: 4,
      similarityScore: 92.1,
      status: 'Ready for Merge'
    },
    {
      id: 'CL-0845',
      primaryTitle: 'Broken High-Tension Wire in Paddy Field after Storm',
      district: 'Giridih',
      duplicateCount: 2,
      similarityScore: 96.4,
      status: 'Ready for Merge'
    }
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center">
          <Layers className="w-3.5 h-3.5 mr-1 text-purple-600" />
          Detected Duplicate Clusters ({clusters.length})
        </h4>
        <span className="text-[10px] text-slate-400 font-medium">Auto-Clustered</span>
      </div>

      <div className="space-y-1.5">
        {clusters.map((c) => {
          const isSelected = (selectedCluster?.id || clusters[0].id) === c.id;
          return (
            <Card
              key={c.id}
              onClick={() => onSelectCluster(c)}
              className={`p-2.5 rounded-md border text-left cursor-pointer transition-all ${
                isSelected
                  ? 'border-purple-600 bg-purple-50/40 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-slate-900 text-xs">{c.id}</span>
                  <Badge variant="ai" className="text-[9.5px] font-bold">
                    {c.similarityScore}% Match
                  </Badge>
                </div>
                <Badge variant="warning" className="text-[10px] font-bold">
                  {c.duplicateCount} Issues
                </Badge>
              </div>

              <h5 className="font-bold text-slate-900 text-xs mt-1.5 truncate">{c.primaryTitle}</h5>

              <div className="flex items-center justify-between text-[10.5px] text-slate-500 mt-1">
                <span className="flex items-center"><MapPin className="w-3 h-3 mr-0.5 text-slate-400" />{c.district}</span>
                <span className="text-purple-700 font-bold">{c.status}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ClusterListPanel;
