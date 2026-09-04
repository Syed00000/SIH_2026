import React from 'react';
import { MessageSquare, Activity, Settings, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../../shared/components/ui/card.jsx';

export const Panel12_Communication = () => (
  <Card className="col-span-full xl:col-span-4 border-slate-200/90 shadow-2xs h-full">
    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
      <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center text-slate-800">
        <MessageSquare className="w-4 h-4 mr-2 text-[#007A61]" /> Communication Hub
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 space-y-3">
      <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center space-x-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <p className="text-xs font-bold text-emerald-800">Direct University Messaging Active</p>
      </div>
      <div className="py-6 text-center text-slate-400 text-xs">
        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
        <p className="font-semibold text-slate-600">No Unread University Messages</p>
        <p className="text-[10px] text-slate-400 mt-0.5">When universities submit questions or revisions on proposals, alerts will appear here.</p>
      </div>
    </CardContent>
  </Card>
);

export const Panel14_Impact = ({ stats = {}, fundingData = {} }) => {
  const activeProjects = stats?.activeProjectsCount || 0;
  const fundingFormatted = stats?.totalCommittedFormatted || fundingData?.totalCommittedFormatted || '₹ 0.00 L';
  const collaborations = stats?.collaborationsCount || 0;

  return (
    <Card className="col-span-full xl:col-span-6 border-slate-200/90 shadow-2xs h-full">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center text-slate-800">
          <Activity className="w-4 h-4 mr-2 text-[#007A61]" /> Impact & Contributions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="text-center">
            <p className="text-xl font-black text-slate-900">{activeProjects}</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Active Projects</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-[#007A61]">{fundingFormatted}</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Committed Capital</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-blue-600">{collaborations}</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Collaborations</p>
          </div>
        </div>
        <div className="w-full h-24 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-xs text-slate-400 p-3 text-center">
          <Activity className="w-5 h-5 text-emerald-600 mb-1 opacity-60" />
          <span className="font-bold text-slate-600">State Research & Innovation Impact</span>
          <span className="text-[10px] text-slate-400">Tracking live deliverables across partner universities in Jharkhand</span>
        </div>
      </CardContent>
    </Card>
  );
};

export const Panel15_Settings = () => (
  <Card className="col-span-full xl:col-span-3 border-slate-200/90 shadow-2xs h-full">
    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
      <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center text-slate-800">
        <Settings className="w-4 h-4 mr-2 text-[#007A61]" /> Settings
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 space-y-3">
       <button className="w-full text-left text-xs font-semibold text-slate-700 hover:text-[#007A61] flex items-center justify-between cursor-pointer">
         <span>Profile Settings</span>
         <span className="text-[10px] text-slate-400">&gt;</span>
       </button>
       <button className="w-full text-left text-xs font-semibold text-slate-700 hover:text-[#007A61] flex items-center justify-between cursor-pointer">
         <span>Notifications</span>
         <span className="text-[10px] text-slate-400">&gt;</span>
       </button>
       <button className="w-full text-left text-xs font-semibold text-slate-700 hover:text-[#007A61] flex items-center justify-between cursor-pointer">
         <span>Security & RBAC</span>
         <span className="text-[10px] text-slate-400">&gt;</span>
       </button>
    </CardContent>
  </Card>
);

export const Panel16_QuickActions = ({ onNavigate }) => (
  <Card className="col-span-full xl:col-span-3 border-slate-200/90 shadow-2xs h-full bg-[#007A61] text-white">
    <CardHeader className="pb-3 border-b border-white/10">
      <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center text-white">
        <Zap className="w-4 h-4 mr-2" fill="currentColor" /> Quick Actions
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 space-y-3">
       <button 
         onClick={() => onNavigate && onNavigate('funding')}
         className="w-full bg-white/10 hover:bg-white/20 transition-colors rounded-xl p-2.5 text-xs font-bold flex items-center justify-center cursor-pointer"
       >
         Allocate / Disburse Funds
       </button>
       <button 
         onClick={() => onNavigate && onNavigate('collaboration')}
         className="w-full bg-white/10 hover:bg-white/20 transition-colors rounded-xl p-2.5 text-xs font-bold flex items-center justify-center cursor-pointer"
       >
         Review University Proposals
       </button>
       <div className="mt-4 pt-4 border-t border-white/10 text-center">
         <p className="text-[10px] opacity-80 mb-2">Empowering University-Industry Research</p>
         <button 
           onClick={() => onNavigate && onNavigate('funding')}
           className="w-full bg-white text-[#007A61] hover:bg-slate-100 transition-colors rounded-xl p-2 text-xs font-black cursor-pointer shadow-xs"
         >
           Corporate Grant Portal
         </button>
       </div>
    </CardContent>
  </Card>
);
