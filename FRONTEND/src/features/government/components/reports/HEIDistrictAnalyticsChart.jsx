import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GraduationCap, MapPin, Award } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xs shadow-lg border border-slate-700">
        <div className="font-bold text-slate-200">{label || payload[0].payload.district}</div>
        <div className="text-emerald-400 font-bold mt-0.5">
          {payload[0].value} Verified Institution{payload[0].value !== 1 ? 's' : ''}
        </div>
      </div>
    );
  }
  return null;
};

export const HEIDistrictAnalyticsChart = ({ heisByDistrict = [], topHeis = [], totalHeis = 0 }) => {
  const chartData = useMemo(() => {
    if (!Array.isArray(heisByDistrict) || heisByDistrict.length === 0) return [];
    return heisByDistrict
      .filter((d) => Boolean(d && (d._id || d.district)))
      .map((d) => ({
        district: d._id || d.district || 'Unassigned',
        count: Number(d.count) || 0
      }))
      .sort((a, b) => b.count - a.count);
  }, [heisByDistrict]);

  const verifiedPartners = useMemo(() => {
    if (!Array.isArray(topHeis)) return [];
    return topHeis.filter(Boolean);
  }, [topHeis]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-[#007A61]/10 text-[#007A61] rounded-lg">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Academic Innovation & HEI Hub Coverage</h3>
            <p className="text-[11px] text-slate-500">Live database geographic footprint of verified universities and technical institutes.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium">Total HEIs:</span>
          <span className="font-bold text-[#007A61] bg-[#007A61]/10 px-2 py-0.5 rounded font-mono">{totalHeis} Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-start">
        {/* District Distribution Bar Chart */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Districts by Registered Academic Centers</span>
            <span className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-[#007A61]" />
              <span>{chartData.length} District{chartData.length !== 1 ? 's' : ''} Represented</span>
            </span>
          </div>
          {chartData.length > 0 ? (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                  <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="district" stroke="#64748b" fontSize={11} tickLine={false} width={90} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#007A61" radius={[0, 4, 4, 0]}>
                    {chartData.map((_, idx) => (
                      <Cell key={`hei-bar-${idx}`} fill={idx === 0 ? '#007A61' : '#334155'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-lg text-xs text-slate-400 font-medium">
              No academic institutions recorded in current filter.
            </div>
          )}
        </div>

        {/* Real Registered Academic Centers List */}
        <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-5 pt-4 lg:pt-0">
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block mb-3">Registered Academic Partners ({verifiedPartners.length})</span>
          {verifiedPartners.length > 0 ? (
            <div className="space-y-2.5">
              {verifiedPartners.map((h, i) => (
                <div key={h.id || h._id || i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-[#007A61] shrink-0" />
                      <span className="text-xs font-bold text-slate-800 truncate">{h.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block pl-5">{h.code || 'N/A'} • {h.district || 'Jharkhand'}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shrink-0">
                    {h.activeProjects || h.projects || 0} Projects
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-xs text-slate-400 text-center font-medium">
              No academic partners registered yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HEIDistrictAnalyticsChart;
