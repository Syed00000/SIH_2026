import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Lightbulb, Layers, Database } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xs shadow-lg border border-slate-700">
        <div className="font-bold text-slate-200">{label || payload[0].payload.name}</div>
        <div className="text-emerald-400 font-bold mt-0.5">
          {payload[0].value} Initiative{payload[0].value !== 1 ? 's' : ''}
        </div>
      </div>
    );
  }
  return null;
};

export const ProjectTRLAnalyticsChart = ({ projects = [], sectors = [] }) => {
  const trlStages = useMemo(() => {
    let research = 0;
    let prototype = 0;
    let deployed = 0;

    if (Array.isArray(projects) && projects.length > 0) {
      projects.forEach((p) => {
        const trl = Number(p.trlLevel || (p.trl ? String(p.trl).replace(/[^\d]/g, '') : 0));
        if (trl >= 7 || p.status === 'Deployed' || p.isDeployed) {
          deployed++;
        } else if (trl >= 4 || p.stage?.includes('Prototype') || p.prototypeStatus === 'Approved') {
          prototype++;
        } else {
          research++;
        }
      });
    }

    return [
      { name: 'TRL 1-3: Research', count: research, desc: 'Concept & Validation', fill: '#475569' },
      { name: 'TRL 4-6: Prototype', count: prototype, desc: 'Lab & Working Model', fill: '#007A61' },
      { name: 'TRL 7-9: Deployment', count: deployed, desc: 'Field Testing & Deployed', fill: '#0f766e' }
    ];
  }, [projects]);

  const sectorData = useMemo(() => {
    if (!Array.isArray(sectors) || sectors.length === 0) return [];
    return sectors.map((s) => ({
      name: s.name || s._id || 'Unspecified',
      count: Number(s.count) || 0
    })).filter((s) => s.count > 0);
  }, [sectors]);

  const totalCount = Array.isArray(projects) ? projects.length : 0;
  const maxSectorCount = sectorData.length > 0 ? Math.max(...sectorData.map((d) => d.count || 1)) : 1;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-[#007A61]/10 text-[#007A61] rounded-lg">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Projects, Prototypes & TRL Maturity Pipeline</h3>
            <p className="text-[11px] text-slate-500">Live database telemetry of academic solutions moving through TRL 1-9 cohorts.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium">Pipeline Volume:</span>
          <span className="font-bold text-[#007A61] bg-[#007A61]/10 px-2 py-0.5 rounded font-mono">{totalCount} Innovations</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-center">
        {/* TRL Stage Bar Chart */}
        <div className="lg:col-span-6">
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block mb-2">Maturity by TRL Cohort</span>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trlStages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {trlStages.map((entry, index) => (
                    <Cell key={`trl-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real Sectoral Breakdown from MongoDB */}
        <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-5 pt-4 lg:pt-0">
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block mb-3">
            Active Domains in Database ({sectorData.length})
          </span>
          {sectorData.length > 0 ? (
            <div className="space-y-2.5">
              {sectorData.map((sec, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="truncate pr-2">{sec.name}</span>
                    <span className="text-slate-900 font-bold font-mono">{sec.count} record{sec.count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#007A61] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(10, (sec.count / maxSectorCount) * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-xs text-slate-400 text-center font-medium">
              No sector records logged in database yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectTRLAnalyticsChart;
