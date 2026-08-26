import React, { useState } from 'react';
import { Activity, Radio, Battery, Clock, TrendingUp, BarChart2, Droplets, Zap } from 'lucide-react';

export const ProjectTelemetryCharts = ({ project }) => {
  const [metricTab, setMetricTab] = useState('primary'); // 'primary' | 'battery' | 'uptime'

  const telemetryData = [
    { time: '06:00', val: 7.2, battery: 99, uptime: 100 },
    { time: '08:00', val: 7.4, battery: 98, uptime: 99.8 },
    { time: '10:00', val: 7.5, battery: 96, uptime: 99.6 },
    { time: '12:00', val: 7.8, battery: 100, uptime: 100 },
    { time: '14:00', val: 7.6, battery: 97, uptime: 99.7 },
    { time: '16:00', val: 7.3, battery: 95, uptime: 99.4 },
    { time: '18:00', val: 7.2, battery: 92, uptime: 99.5 }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-2xs select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>24-Hour Live IoT Sensor Telemetry & Health Graphs</span>
          </h4>
          <p className="text-[11px] text-slate-500 font-medium">
            Real-time broadcast from field sensor nodes in {project?.district || 'Jharkhand'}
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setMetricTab('primary')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
              metricTab === 'primary' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sensor Metric
          </button>
          <button
            type="button"
            onClick={() => setMetricTab('battery')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
              metricTab === 'battery' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Battery & Solar
          </button>
          <button
            type="button"
            onClick={() => setMetricTab('uptime')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
              metricTab === 'uptime' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Network Uptime
          </button>
        </div>
      </div>

      {/* Visual Chart Bars Container */}
      <div className="space-y-2">
        <div className="h-44 flex items-end justify-between gap-3 pt-6 px-4 bg-slate-50 rounded-xl border border-slate-100">
          {telemetryData.map((d, i) => {
            const heightPercent =
              metricTab === 'primary'
                ? (d.val / 10) * 100
                : metricTab === 'battery'
                ? d.battery
                : d.uptime;

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                  {metricTab === 'primary' ? d.val : `${Math.round(heightPercent)}%`}
                </div>
                <div className="w-full max-w-[28px] bg-slate-200 rounded-t-md h-full flex items-end overflow-hidden">
                  <div
                    className="w-full bg-slate-900 rounded-t-md transition-all duration-500 group-hover:bg-emerald-600"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-semibold">{d.time}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span className="flex items-center space-x-1">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>Broadcasting via LoRaWAN Sub-GHz Mesh Relay</span>
          </span>
          <span className="font-mono font-bold text-slate-700">Packet Loss: 0.02%</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectTelemetryCharts;
