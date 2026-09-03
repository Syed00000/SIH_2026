import React from 'react';
import { 
  CheckCircle, ArrowRight, Award, MapPin, Globe, Mail, Phone, Building, Briefcase, Rocket, FlaskConical, 
  Users, FileText, Lock, FileKey, GraduationCap, MessageSquare, BarChart2, Activity, Settings, 
  PieChart, LineChart, ShieldCheck, Download, Eye, ExternalLink, Calendar,
  UserCheck, Target, Share2
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

export const Panel4_Collaboration = ({ data, onViewRequest }) => (
  <Card className="col-span-full xl:col-span-8 border-slate-200/90 shadow-2xs">
    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
      <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center text-slate-800">
        <Share2 className="w-4 h-4 mr-2 text-[#007A61]" /> Collaboration Requests
      </CardTitle>
      <button className="text-[10px] font-bold text-blue-600 hover:underline flex items-center cursor-pointer">View All <ArrowRight className="w-3 h-3 ml-1" /></button>
    </CardHeader>
    <CardContent className="p-0">
      <div className="flex space-x-4 border-b border-slate-200 px-4 pt-3">
        <button className="text-[11px] font-bold text-[#007A61] border-b-2 border-[#007A61] pb-2 cursor-pointer">Received Requests ({data.received?.length || 0})</button>
        <button className="text-[11px] font-bold text-slate-400 hover:text-slate-600 pb-2 cursor-pointer">Sent Requests</button>
        <button className="text-[11px] font-bold text-slate-400 hover:text-slate-600 pb-2 cursor-pointer">Matched Opportunities</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-100 uppercase tracking-wider text-[9px]">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Project Title</th>
              <th className="px-4 py-2">University</th>
              <th className="px-4 py-2">Required Support</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.received?.map((req, i) => (
              <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2.5 font-mono text-slate-400">{i + 1}</td>
                <td className="px-4 py-2.5 font-bold text-slate-800">{req.title}</td>
                <td className="px-4 py-2.5 text-slate-600">{req.university}</td>
                <td className="px-4 py-2.5 text-slate-600">{req.required}</td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider ${
                    req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                    req.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                    req.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}>{req.status}</span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button onClick={() => onViewRequest && onViewRequest(req)} className="text-blue-600 font-bold hover:underline cursor-pointer">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

export const Panel5_Projects = ({ data }) => (
  <Card className="col-span-full xl:col-span-6 border-slate-200/90 shadow-2xs h-full">
    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
      <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center text-slate-800">
        <Briefcase className="w-4 h-4 mr-2 text-[#007A61]" /> Active Projects
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="flex space-x-4 border-b border-slate-200 px-4 pt-3">
        <button className="text-[11px] font-bold text-[#007A61] border-b-2 border-[#007A61] pb-2">Ongoing (7)</button>
        <button className="text-[11px] font-bold text-slate-400 hover:text-slate-600 pb-2">Completed (3)</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-100 uppercase tracking-wider text-[9px]">
            <tr>
              <th className="px-4 py-2">Project Name</th>
              <th className="px-4 py-2">University</th>
              <th className="px-4 py-2">Stage</th>
              <th className="px-4 py-2">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.ongoing.map((proj, i) => (
              <tr key={proj.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2.5 font-bold text-slate-800 line-clamp-1">{proj.title}</td>
                <td className="px-4 py-2.5 text-slate-600">{proj.university}</td>
                <td className="px-4 py-2.5 text-slate-600">{proj.stage}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${proj.status === 'Delayed' ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${proj.progress}%` }}></div>
                    </div>
                    <span className="font-bold text-[9px] text-slate-500">{proj.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

export const Panel6_Funding = ({ data }) => (
  <Card className="col-span-full xl:col-span-6 border-slate-200/90 shadow-2xs h-full">
    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
      <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center text-slate-800">
        <Rocket className="w-4 h-4 mr-2 text-[#007A61]" /> Funding & Support
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 flex flex-col sm:flex-row items-center">
      <div className="w-32 h-32 relative flex items-center justify-center shrink-0">
        {/* Mocking a donut chart using borders, in a real app use recharts */}
        <div className="w-full h-full rounded-full border-[12px] border-[#007A61] relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[12px] border-blue-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%)'}}></div>
          <div className="absolute inset-0 rounded-full border-[12px] border-purple-500" style={{ clipPath: 'polygon(50% 50%, 0 100%, 0 50%)'}}></div>
          <div className="text-center">
            <span className="block text-sm font-black text-slate-900">{data.totalCommitted}</span>
            <span className="block text-[8px] font-bold text-slate-500 uppercase">Committed</span>
          </div>
        </div>
      </div>
      <div className="ml-6 space-y-2.5 w-full mt-4 sm:mt-0">
        {data.distribution.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
              <span className="font-medium text-slate-700">{item.name}</span>
            </div>
            <div className="flex space-x-2">
              <span className="font-bold text-slate-900">₹{item.value}.00 L</span>
              <span className="text-slate-400 font-mono text-[10px]">({item.percentage})</span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
