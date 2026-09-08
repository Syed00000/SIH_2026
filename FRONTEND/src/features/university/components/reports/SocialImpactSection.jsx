import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Home, Lightbulb, CheckCircle2 } from 'lucide-react';

const ImpactStat = ({ icon: Icon, value, label }) => (
  <div className="flex items-center space-x-3 p-4 bg-zinc-50 border border-zinc-200 rounded-none">
    <div className="w-10 h-10 flex items-center justify-center rounded-none bg-white border border-zinc-200 shadow-none text-zinc-900">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <div className="text-xl font-bold text-zinc-950 tracking-tight">{value}</div>
      <div className="text-xs font-medium text-zinc-500">{label}</div>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-zinc-200 p-3 rounded-none shadow-none">
        <p className="text-xs font-semibold text-zinc-500 mb-2">{label}</p>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 rounded-none bg-zinc-900" />
          <span className="font-medium text-zinc-700">Beneficiaries:</span>
          <span className="font-bold text-zinc-950">{payload[0].value.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const SocialImpactSection = ({ kpis = {}, impactTrend = [], impactStats = {} }) => {
  return (
    <div className="rounded-none border bg-card text-card-foreground shadow-none bg-white overflow-hidden w-full">
      <div className="flex flex-col space-y-1.5 p-6 border-b border-zinc-100">
        <h3 className="text-lg font-semibold leading-none tracking-tight text-zinc-950">Social Impact & Reach</h3>
        <p className="text-sm text-muted-foreground text-zinc-500">Real-time metrics on beneficiaries and deployed solutions.</p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Key Stats - Left Column */}
        <div className="col-span-1 md:col-span-4 flex flex-col justify-center space-y-4">
          <ImpactStat icon={Users} value={`${kpis.beneficiariesLakh || 0}L`} label="Total Beneficiaries" />
          <ImpactStat icon={Home} value={impactStats.villages || 0} label="Villages Impacted" />
          <ImpactStat icon={Lightbulb} value={impactStats.solutions || 0} label="Deployed Solutions" />
          <ImpactStat icon={CheckCircle2} value={impactStats.pilots || 0} label="Active Pilots" />
        </div>

        {/* Impact Over Time - Right Column */}
        <div className="col-span-1 md:col-span-8 flex flex-col min-h-[300px]">
           <p className="text-sm font-semibold text-zinc-900 mb-4">Beneficiaries Reached Over Time</p>
           <div className="flex-1">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={impactTrend} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#18181b" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#71717a' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 12, fill: '#71717a' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} cursor={{stroke: '#d4d4d8', strokeWidth: 1}} />
                  <Area type="monotone" dataKey="beneficiaries" stroke="#18181b" strokeWidth={2} fillOpacity={1} fill="url(#colorBen)" activeDot={{r:5, fill:'#18181b', stroke:'#fff', strokeWidth:2}} />
                </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SocialImpactSection;
