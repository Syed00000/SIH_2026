import React, { useState } from 'react';
import { Radio, Building2, Activity, ChevronRight } from 'lucide-react';

export const ProjectTelemetryMap = ({ onSelectDistrict, onSelectProject }) => {
  const districtMapNodes = [
    { id: 'DHN', name: 'Dhanbad', x: 74, y: 48, activeProjects: 7, totalSensors: 48, status: 'Active Sync', leadHei: 'IIT ISM & BIT Sindri', liveMetric: 'CH4: 0.12% | Normal' },
    { id: 'RNC', name: 'Ranchi', x: 48, y: 56, activeProjects: 6, totalSensors: 42, status: 'Active Sync', leadHei: 'BIT Mesra & BAU', liveMetric: 'Storage Temp: 4.2°C' },
    { id: 'EAS', name: 'East Singhbhum', x: 72, y: 76, activeProjects: 5, totalSensors: 35, status: 'Active Sync', leadHei: 'NIT Jamshedpur', liveMetric: 'DO: 7.8 mg/L | Pure' },
    { id: 'BOK', name: 'Bokaro', x: 68, y: 44, activeProjects: 3, totalSensors: 22, status: 'Active Sync', leadHei: 'Bokaro Tech Hub', liveMetric: 'Displacement: 0.4mm' },
    { id: 'DEO', name: 'Deoghar', x: 78, y: 24, activeProjects: 2, totalSensors: 14, status: 'Warning Sync', leadHei: 'AIIMS Deoghar', liveMetric: 'Battery Low: 14%' },
    { id: 'HAZ', name: 'Hazaribagh', x: 50, y: 38, activeProjects: 2, totalSensors: 16, status: 'Active Sync', leadHei: 'Vinoba Bhave Univ', liveMetric: 'Fluoride: 0.42 mg/L' },
    { id: 'DUM', name: 'Dumka', x: 88, y: 28, activeProjects: 2, totalSensors: 12, status: 'Active Sync', leadHei: 'SKM University', liveMetric: 'NFC Nodes: 12 Active' }
  ];

  const [selectedNode, setSelectedNode] = useState(districtMapNodes[0]);
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredNodes = districtMapNodes.filter((n) => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Active') return n.status === 'Active Sync';
    if (filterStatus === 'Warning') return n.status === 'Warning Sync';
    return true;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden select-none">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Jharkhand Geospatial Telemetry & Sensor Network Map
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Live broadcast from 140+ deployed IoT nodes across monitoring zones
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {['All', 'Active', 'Warning'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {st} Nodes
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-8 p-6 bg-radial from-slate-900 to-slate-950 text-white relative min-h-[380px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
          <svg className="w-full h-full max-h-[340px] max-w-[620px] relative z-10" viewBox="0 0 100 100">
            <g stroke="#334155" strokeWidth="0.4" strokeDasharray="1,1">
              <line x1="48" y1="56" x2="74" y2="48" /><line x1="48" y1="56" x2="72" y2="76" /><line x1="74" y1="48" x2="78" y2="24" />
            </g>
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isWarning = node.status === 'Warning Sync';
              return (
                <g
                  key={node.id}
                  onClick={() => {
                    setSelectedNode(node);
                    if (onSelectDistrict) onSelectDistrict(node.name);
                  }}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  {isSelected && (
                    <circle cx={node.x} cy={node.y} r="5" fill="none" stroke={isWarning ? '#f87171' : '#34d399'} strokeWidth="0.6" className="animate-ping opacity-75" />
                  )}
                  <circle cx={node.x} cy={node.y} r={isSelected ? '3.2' : '2.4'} fill={isSelected ? '#ffffff' : isWarning ? '#ef4444' : '#10b981'} stroke={isSelected ? '#0f172a' : '#1e293b'} strokeWidth="0.8" />
                  <text x={node.x} y={node.y + 4.5} textAnchor="middle" fontSize="2.8" fill={isSelected ? '#ffffff' : '#94a3b8'} fontWeight={isSelected ? 'bold' : 'normal'} className="select-none pointer-events-none">
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="lg:col-span-4 p-5 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between space-y-4">
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Zone Telemetry Inspector</span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">{selectedNode.name} District</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${selectedNode.status === 'Active Sync' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                    {selectedNode.status}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Node ID: {selectedNode.id}-GW-01</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Projects</span>
                  <span className="text-sm font-black text-slate-900">{selectedNode.activeProjects}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Sensors</span>
                  <span className="text-sm font-black text-slate-900">{selectedNode.totalSensors} Nodes</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Live Telemetry Metric:</span>
                  <div className="font-mono font-bold text-slate-900 flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedNode.liveMetric}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Lead University:</span>
                  <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedNode.leadHei}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">Select a district pin on the map to inspect live IoT telemetry.</div>
          )}

          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onSelectProject && onSelectProject(selectedNode)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
            >
              <span>View All Projects in {selectedNode?.name}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTelemetryMap;
