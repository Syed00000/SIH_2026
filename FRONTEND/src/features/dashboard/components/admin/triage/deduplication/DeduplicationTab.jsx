import React, { useState } from 'react';
import { DeduplicationMetrics } from './DeduplicationMetrics.jsx';
import { ClusterListPanel } from './ClusterListPanel.jsx';
import { ClusterDiffViewer } from './ClusterDiffViewer.jsx';

export const DeduplicationTab = () => {
  const [selectedCluster, setSelectedCluster] = useState({
    id: 'CL-2026-0045',
    title: 'Water Shortage & Pipe Leakage',
    district: 'Dumka',
    count: 3,
    similarity: '92%',
    masterId: 'IS-2026-00401'
  });

  return (
    <div className="space-y-3.5">
      {/* Metric Cards */}
      <DeduplicationMetrics />

      {/* Main Dual-Column Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        <div className="lg:col-span-1">
          <ClusterListPanel
            selectedCluster={selectedCluster}
            onSelectCluster={(c) => setSelectedCluster(c)}
          />
        </div>

        <div className="lg:col-span-2">
          <ClusterDiffViewer cluster={selectedCluster} />
        </div>
      </div>
    </div>
  );
};

export default DeduplicationTab;
