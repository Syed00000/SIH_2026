import React, { useState } from 'react';
import { Server, RotateCw } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    requests: '1,248',
    users: '342',
    latency: '24 ms'
  });
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStats({
        requests: (1200 + Math.floor(Math.random() * 150)).toLocaleString(),
        users: (300 + Math.floor(Math.random() * 80)).toLocaleString(),
        latency: `${Math.floor(Math.random() * 20) + 15} ms`
      });
      setLoading(false);
    }, 600);
  };

  return (
    <section id="dashboard" className="dashboard-section">
      <div className="section-container">
        <div className="section-header">
          <h2>Live Dashboard</h2>
          <p>Sample interactive React component connected to local state.</p>
        </div>

        <div className="glass-card dashboard-preview">
          <div className="card-header">
            <div className="card-title">
              <Server size={20} /> System Status Overview
            </div>
            <span className="status-pill">
              <span className="status-dot"></span> Backend Ready
            </span>
          </div>
          
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Total Requests</div>
              <div className="stat-value">{stats.requests}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Active Users</div>
              <div className="stat-value">{stats.users}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Response Time</div>
              <div className="stat-value">{stats.latency}</div>
            </div>
          </div>
          
          <div className="card-footer">
            <button 
              className="btn btn-sm btn-secondary" 
              onClick={handleRefresh}
              disabled={loading}
            >
              <RotateCw size={14} className={loading ? 'spin' : ''} />
              {loading ? 'Updating...' : 'Refresh Metrics'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
