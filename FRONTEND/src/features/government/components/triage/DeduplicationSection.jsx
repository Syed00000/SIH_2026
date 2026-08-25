import React, { useState } from 'react';
import { DeduplicationMetrics } from './DeduplicationMetrics.jsx';
import { ClusterListPanel } from './ClusterListPanel.jsx';
import { ClusterDiffViewer } from './ClusterDiffViewer.jsx';

export const DeduplicationSection = () => {
  const [selectedCluster, setSelectedCluster] = useState(null);

  return (
    <div className="space-y-3">
      <DeduplicationMetrics />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
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

export default DeduplicationSection;
