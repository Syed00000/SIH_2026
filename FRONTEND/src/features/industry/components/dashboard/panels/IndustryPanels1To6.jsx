import React from 'react';
import { 
  CheckCircle, MapPin, Globe, Mail, Phone, Building, Briefcase, Rocket,
  Users, ShieldCheck, Target, FlaskConical, Award, UserCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../../shared/components/ui/card.jsx';

export const Panel1_Overview = ({ user, industry, stats }) => {
  const orgName = industry?.legalName || user?.organizationName || user?.fullName || 'Industry Node';
  const initials = industry?.shortName || (orgName ? orgName.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase() : 'IND');
  const entityType = industry?.category || 'Research Lab';
  const domain = industry?.thematicDomain || (industry?.thematicDomains?.[0]) || 'R&D, Technology';
  const location = industry?.address?.district 
    ? `${industry.address.district}, ${industry.address.state || 'Jharkhand'}`
    : (industry?.address?.state || 'Jharkhand');
  const website = industry?.website || 'N/A';

  return (
    <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/90 overflow-hidden flex flex-col md:flex-row items-stretch col-span-full xl:col-span-8">
      <div className="bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200/80 p-6 md:w-1/3 flex flex-col justify-center relative overflow-hidden">
        <div className="relative z-10 flex items-center space-x-3.5 mb-2">
          <div className="w-13 h-13 bg-white border border-slate-200 text-slate-900 rounded-xl flex items-center justify-center font-black text-xl shadow-2xs">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">{orgName}</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center mt-0.5">
              <ShieldCheck className="w-3 h-3 mr-1" /> {industry?.verificationStatus || 'VERIFIED'}
            </span>
          </div>
        </div>
        <p className="text-slate-500 text-xs font-medium relative z-10">
          {industry?.thematicDomain ? `Focus Area: ${industry.thematicDomain}` : 'Industrial Innovation & Testing Partner'}
        </p>
      </div>
      
      <div className="p-6 md:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white items-center">
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Entity Type</p>
          <p className="font-semibold text-slate-900 text-sm">{entityType}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Industry Sector</p>
          <p className="font-semibold text-slate-900 text-sm">{domain}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Location</p>
          <p className="font-semibold text-slate-900 text-sm flex items-center"><MapPin className="w-3 h-3 mr-1 text-slate-400"/> {location}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Website</p>
          {website !== 'N/A' ? (
            <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noreferrer" className="font-semibold text-blue-600 text-sm hover:underline flex items-center">
              <Globe className="w-3 h-3 mr-1"/> {website.replace(/^https?:\/\//, '')}
            </a>
          ) : (
            <p className="font-semibold text-slate-400 text-sm">N/A</p>
          )}
        </div>
        
        {/* Metrics Row with Real Dynamic DB Counts */}
        <div className="col-span-full grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex flex-col items-center justify-center text-center">
            <Briefcase className="w-4 h-4 text-emerald-600 mb-1" />
            <p className="text-[10px] text-slate-500 font-bold">Active Projects</p>
            <p className="text-lg font-black text-slate-900">{stats?.activeProjectsCount ?? 0}</p>
          </div>
          <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center">
            <Users className="w-4 h-4 text-blue-600 mb-1" />
            <p className="text-[10px] text-slate-500 font-bold">Collaborations</p>
            <p className="text-lg font-black text-slate-900">{stats?.collaborationsCount ?? 0}</p>
          </div>
          <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 flex flex-col items-center justify-center text-center">
            <Rocket className="w-4 h-4 text-amber-600 mb-1" />
            <p className="text-[10px] text-slate-500 font-bold">Committed Capital</p>
            <p className="text-lg font-black text-slate-900">{stats?.totalCommittedFormatted ?? '₹ 0.00 L'}</p>
          </div>
          <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100 flex flex-col items-center justify-center text-center">
            <FlaskConical className="w-4 h-4 text-purple-600 mb-1" />
            <p className="text-[10px] text-slate-500 font-bold">Support Modes</p>
            <p className="text-xs font-black text-slate-800">{industry?.supportModes?.join(', ') || 'R&D Funding'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Panel2_Profile = ({ user, industry }) => {
  const spoc = industry?.spocName 
    ? `${industry.spocName}${industry.designation ? ` (${industry.designation})` : ''}`
    : (user?.fullName || 'SPOC Assigned');
  const email = industry?.officialEmail || user?.email || 'N/A';
  const phone = industry?.mobileNumber || user?.mobileNumber || 'N/A';
  const regId = industry?.registrationNumber || industry?.industryId || 'N/A';
  const status = industry?.verificationStatus || 'Verified';

  return (
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
            <CheckCircle className="w-3 h-3 mr-1" /> {status}
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-slate-500 font-bold">Primary Contact (SPOC)</p>
            <p className="text-xs font-semibold text-slate-900">{spoc}</p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700">{email}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700">{phone}</span>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold mt-2">Registration ID (CIN / Reg)</p>
            <p className="text-xs font-mono font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block mt-1 uppercase">{regId}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const Panel3_Capabilities = ({ data = {}, industry }) => {
  const domains = industry?.thematicDomains?.length 
    ? industry.thematicDomains 
    : (industry?.thematicDomain ? [industry.thematicDomain] : (data?.expertise || []));

  return (
    <Card className="col-span-full xl:col-span-4 border-slate-200/90 shadow-2xs h-full">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center text-slate-800">
          <Target className="w-4 h-4 mr-2 text-[#007A61]" /> Registered Capabilities
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex space-x-2 border-b border-slate-200 pb-3">
          <button className="text-[11px] font-bold text-[#007A61] border-b-2 border-[#007A61] pb-1 px-1">Areas of Expertise</button>
          <button className="text-[11px] font-bold text-slate-400 hover:text-slate-600 pb-1 px-1">Support Modes</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {domains.length > 0 ? (
            domains.map((item, idx) => (
              <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-md">
                {item}
              </span>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No domain capabilities registered yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { Panel4_Collaboration, Panel5_Projects, Panel6_Funding } from './IndustryPanels4To6.jsx';
