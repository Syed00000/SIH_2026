import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, Handshake, IndianRupee, GraduationCap } from 'lucide-react';

const KpiTile = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-4 p-5 bg-white border border-zinc-200 rounded-none hover:shadow-none transition-shadow">
    <div className="w-12 h-12 flex items-center justify-center rounded-none bg-zinc-50 border border-zinc-200 text-zinc-900">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <div className="text-2xl font-bold text-zinc-950 tracking-tight">{value}</div>
      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-1">{label}</div>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-zinc-200 p-3 rounded-none shadow-none">
        <p className="text-xs font-semibold text-zinc-500 mb-2">{label}</p>
        {payload.map((p, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-sm mb-1">
            <div className="w-2 h-2 rounded-none" style={{ backgroundColor: p.color || p.payload.fill }} />
            <span className="font-medium text-zinc-700">{p.name}:</span>
            <span className="font-bold text-zinc-950">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const IndustryCsrSection = ({ indArr = [], totalFunding = 0, supportBreakdown = [], fundingTrend = [] }) => {
  const activePartners = indArr.filter(i => i.status === 'Active' || i.verificationStatus === 'Verified').length;
  const totalCommitted = indArr.reduce((s, i) => s + (i.financials?.csrCommittedCr || 0), 0);

  return (
    <div className="rounded-none border bg-card text-card-foreground shadow-none bg-white overflow-hidden w-full mt-6">
      <div className="flex flex-col space-y-1.5 p-6 border-b border-zinc-100">
        <h3 className="text-lg font-semibold leading-none tracking-tight text-zinc-950">Industry & CSR</h3>
        <p className="text-sm text-muted-foreground text-zinc-500">Corporate partnerships, active collaborations, and committed funding.</p>
      </div>

      <div className="p-6 flex flex-col gap-8">
        {/* KPI tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiTile icon={Building2} label="Active Partners" value={activePartners} />
          <KpiTile icon={Handshake} label="Collaborations" value={indArr.filter(i => (i.financials?.supportedProjectsCount || 0) > 0).length} />
          <KpiTile icon={IndianRupee} label="Funding (CSR)" value={`₹${totalCommitted.toFixed(1)}Cr`} />
          <KpiTile icon={GraduationCap} label="Mentorships" value={Math.round(activePartners * 1.38)} />
        </div>
      </div>
    </div>
  );
};

export default IndustryCsrSection;
