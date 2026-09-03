import React from 'react';
import { 
  CheckCircle, MapPin, Globe, Mail, Phone, Building, Briefcase, Rocket,
  Users, ShieldCheck, Target
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../../shared/components/ui/card.jsx';

export const Panel1_Overview = ({ user }) => (
  <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/90 overflow-hidden flex flex-col md:flex-row items-stretch col-span-full xl:col-span-8">
    <div className="bg-slate-900 text-white p-6 md:w-1/3 flex flex-col justify-center relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10"><Building className="w-32 h-32" /></div>
      <div className="relative z-10 flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-white text-slate-900 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg">
          ARL
        </div>
        <div>
          <h2 className="text-xl font-black">{user?.organizationName || 'Ariba Research Labs'}</h2>
          <p className="text-emerald-400 text-xs font-bold flex items-center mt-1">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> VERIFIED
          </p>
        </div>
      </div>
      <p className="text-slate-300 text-sm italic font-medium relative z-10">Innovating Today, Impacting Tomorrow</p>
    </div>
    
    <div className="p-6 md:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white items-center">
      <div className="space-y-1">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Entity Type</p>
        <p className="font-semibold text-slate-900 text-sm">Research Lab</p>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Industry Sector</p>
        <p className="font-semibold text-slate-900 text-sm">R&D, Technology</p>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Location</p>
        <p className="font-semibold text-slate-900 text-sm flex items-center"><MapPin className="w-3 h-3 mr-1 text-slate-400"/> Ranchi, Jharkhand</p>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Website</p>
        <a href="#" className="font-semibold text-blue-600 text-sm hover:underline flex items-center"><Globe className="w-3 h-3 mr-1"/> aribalabs.com</a>
      </div>
      
      {/* Metrics Row */}
      <div className="col-span-full grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 pt-4 border-t border-slate-100">
        <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex flex-col items-center justify-center text-center">
          <Briefcase className="w-4 h-4 text-emerald-600 mb-1" />
          <p className="text-[10px] text-slate-500 font-bold">Active Projects</p>
          <p className="text-lg font-black text-slate-900">12</p>
        </div>
        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center">
          <Users className="w-4 h-4 text-blue-600 mb-1" />
          <p className="text-[10px] text-slate-500 font-bold">Collaborations</p>
          <p className="text-lg font-black text-slate-900">8</p>
        </div>
        <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 flex flex-col items-center justify-center text-center">
          <Rocket className="w-4 h-4 text-amber-600 mb-1" />
          <p className="text-[10px] text-slate-500 font-bold">Funding</p>
          <p className="text-lg font-black text-slate-900">₹2.45 Cr</p>
        </div>
        <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100 flex flex-col items-center justify-center text-center">
          <FlaskConical className="w-4 h-4 text-purple-600 mb-1" />
          <p className="text-[10px] text-slate-500 font-bold">Tests Done</p>
          <p className="text-lg font-black text-slate-900">34</p>
        </div>
        <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100 flex flex-col items-center justify-center text-center">
          <Award className="w-4 h-4 text-rose-600 mb-1" />
          <p className="text-[10px] text-slate-500 font-bold">Impact Score</p>
          <p className="text-lg font-black text-slate-900">87/100</p>
        </div>
      </div>
    </div>
  </div>
);

export const Panel2_Profile = () => (
  <Card className="col-span-full xl:col-span-4 border-slate-200/90 shadow-2xs h-full">
    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
      <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center text-slate-800">
        <UserCheck className="w-4 h-4 mr-2 text-[#007A61]" /> Profile & Verification
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 space-y-4">
      <div className="flex space-x-2 border-b border-slate-200 pb-3">
        <button className="text-[11px] font-bold text-[#007A61] border-b-2 border-[#007A61] pb-1 px-1">Basic Information</button>
        <button className="text-[11px] font-bold text-slate-400 hover:text-slate-600 pb-1 px-1">Additional Details</button>
      </div>
      
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex justify-between items-center">
        <span className="text-xs font-bold text-emerald-800">Account Status</span>
        <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center">
          <CheckCircle className="w-3 h-3 mr-1" /> Verified
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-[10px] text-slate-500 font-bold">Primary Contact</p>
          <p className="text-xs font-semibold text-slate-900">Ariba Hasan (CEO)</p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <Mail className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-700">ariba@aribalabs.com</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <Phone className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-700">+91 8765456789</span>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 font-bold mt-2">Registration ID (CIN)</p>
          <p className="text-xs font-mono font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block mt-1">U934832234872</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const Panel3_Capabilities = ({ data }) => (
  <Card className="col-span-full xl:col-span-4 border-slate-200/90 shadow-2xs h-full">
    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
      <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center text-slate-800">
        <Target className="w-4 h-4 mr-2 text-[#007A61]" /> Capabilities
      </CardTitle>
      <button className="text-[10px] font-bold text-blue-600 hover:underline">Edit</button>
    </CardHeader>
    <CardContent className="p-4 space-y-4">
      <div className="flex space-x-2 border-b border-slate-200 pb-3">
        <button className="text-[11px] font-bold text-[#007A61] border-b-2 border-[#007A61] pb-1 px-1">Areas of Expertise</button>
        <button className="text-[11px] font-bold text-slate-400 hover:text-slate-600 pb-1 px-1">Resources</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.expertise.map((item, idx) => (
          <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-md">
            {item}
          </span>
        ))}
      </div>
    </CardContent>
  </Card>
);

export { Panel4_Collaboration, Panel5_Projects, Panel6_Funding } from './IndustryPanels4To6.jsx';
