import React from 'react';
import { Layers, MapPin, Info } from 'lucide-react';
import { Card } from '../../../../shared/components/ui/card.jsx';
import { Badge } from '../../../../shared/components/ui/badge.jsx';

export const ClusterListPanel = ({ clusters = [], selectedCluster, onSelectCluster }) => {
  const safeClusters = Array.isArray(clusters) ? clusters : [];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center">
          <Layers className="w-3.5 h-3.5 mr-1 text-purple-600" />
          Detected Duplicate Clusters ({safeClusters.length})
        </h4>
        <span className="text-[10px] text-slate-400 font-medium">Semantic Clusters</span>
      </div>

      <div className="space-y-1.5">
        {safeClusters.length === 0 ? (
          <div className="p-6 bg-white border border-slate-200 rounded-lg text-center text-slate-400 text-xs">
            <Info className="w-4 h-4 mx-auto text-slate-300 mb-1" />
            No duplicate issue clusters detected.
          </div>
        ) : (
          safeClusters.map((c) => {
            const isSelected = selectedCluster?.id === c.id;
            return (
              <Card
                key={c.id}
                onClick={() => onSelectCluster && onSelectCluster(c)}
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
                      {c.similarityScore || 90}% Match
                    </Badge>
                  </div>
                  <Badge variant="warning" className="text-[10px] font-bold">
                    {c.duplicateCount || c.items?.length || 1} Issues
                  </Badge>
                </div>

                <h5 className="font-bold text-slate-900 text-xs mt-1.5 truncate">{c.primaryTitle || c.title}</h5>

                <div className="flex items-center justify-between text-[10.5px] text-slate-500 mt-1">
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 mr-0.5 text-slate-400" />
                    {c.district || 'Jharkhand'}
                  </span>
                  <span className="text-purple-700 font-bold">{c.status || 'Ready for Merge'}</span>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ClusterListPanel;
