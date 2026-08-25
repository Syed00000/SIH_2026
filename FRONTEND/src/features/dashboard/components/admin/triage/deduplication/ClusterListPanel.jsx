import React from 'react';
import { Layers, MapPin } from 'lucide-react';
import { Card } from '../../../../../../shared/components/ui/card.jsx';
import { Badge } from '../../../../../../shared/components/ui/badge.jsx';

export const ClusterListPanel = ({ selectedCluster, onSelectCluster }) => {
  const clusters = [
    {
      id: 'CL-2026-0045',
      title: 'Water Shortage & Pipe Leakage',
      district: 'Dumka',
      count: 3,
      similarity: '92%',
      masterId: 'IS-2026-00401'
    },
    {
      id: 'CL-2026-0046',
      title: 'NH-33 Broken Road & Potholes',
      district: 'Ranchi',
      count: 4,
      similarity: '95%',
      masterId: 'IS-2026-00519'
    },
    {
      id: 'CL-2026-0047',
      title: 'Mining Dust Pollution Near Primary School',
      district: 'Dhanbad',
      count: 2,
      similarity: '89%',
      masterId: 'IS-2026-00388'
    }
  ];

  return (
    <Card className="bg-white border-slate-200 p-3.5 shadow-2xs space-y-2.5">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-purple-600" />
          <h4 className="font-bold text-slate-900 text-xs md:text-sm">Pending Cluster Queue</h4>
        </div>
        <Badge variant="ai" className="text-[10px] font-bold">
          3 Ready
        </Badge>
      </div>

      <div className="space-y-2">
        {clusters.map((c) => {
          const isSelected = selectedCluster?.id === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelectCluster(c)}
              className={`w-full text-left p-2.5 rounded-md border transition-all cursor-pointer ${
                isSelected
                  ? 'border-purple-500 bg-purple-50/50 shadow-2xs'
                  : 'border-slate-200/80 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-xs">{c.id}</span>
                <span className="font-extrabold text-emerald-700 text-[11px]">{c.similarity} match</span>
              </div>
              <p className="font-semibold text-slate-800 text-xs mt-0.5 truncate">{c.title}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                <span className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                  {c.district}
                </span>
                <Badge variant="default" className="font-bold">
                  {c.count} Duplicates
                </Badge>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default ClusterListPanel;
