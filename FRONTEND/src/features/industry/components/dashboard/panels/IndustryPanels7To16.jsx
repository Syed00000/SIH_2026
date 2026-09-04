import React from 'react';
import { FlaskConical, Users, FileText, FileKey, GraduationCap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../../shared/components/ui/card.jsx';

export const Panel7_Labs = ({ data = [] }) => (
  <Card className="col-span-full xl:col-span-4 border-slate-200/90 shadow-2xs h-full">
    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
      <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center text-slate-800">
        <FlaskConical className="w-4 h-4 mr-2 text-[#007A61]" /> Testing & Labs
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-100 uppercase tracking-wider text-[9px]">
            <tr>
              <th className="px-3 py-2">Facility Name</th>
              <th className="px-3 py-2">Location</th>
              <th className="px-3 py-2">Availability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data && data.length > 0 ? (
              data.map((lab, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-2.5 font-bold text-slate-800">{lab.name}</td>
                  <td className="px-3 py-2.5 text-slate-600">{lab.location}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider ${
                      lab.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>{lab.status}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-6 text-slate-400 text-xs">
                  No shared testing facilities or labs listed.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

export const Panel8_Experts = ({ data = [] }) => (
  <Card className="col-span-full xl:col-span-6 border-slate-200/90 shadow-2xs h-full">
    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
      <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center text-slate-800">
        <Users className="w-4 h-4 mr-2 text-[#007A61]" /> Experts & Engineers
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-100 uppercase tracking-wider text-[9px]">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Role & Specialization</th>
              <th className="px-4 py-2">Availability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data && data.length > 0 ? (
              data.map((expert, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-slate-800 flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600">{expert.name?.charAt(0)}</div>
                    <span>{expert.name}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="block text-slate-800 font-medium">{expert.role}</span>
                    <span className="block text-[9px] text-slate-500">{expert.spec}</span>
                  </td>
                  <td className="px-4 py-2.5 text-emerald-600 font-bold text-[10px]">{expert.availability}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-6 text-slate-400 text-xs">
                  No registered technical mentors or experts listed.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

export const Panel9_Documents = ({ data = [] }) => (
  <Card className="col-span-full xl:col-span-6 border-slate-200/90 shadow-2xs h-full">
    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
      <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center text-slate-800">
        <FileText className="w-4 h-4 mr-2 text-[#007A61]" /> Documents & Agreements
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-100 uppercase tracking-wider text-[9px]">
            <tr>
              <th className="px-4 py-2">Document Name</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data && data.length > 0 ? (
              data.map((doc, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-slate-800">
                    <span className="block">{doc.name}</span>
                    <span className="text-[9px] text-slate-400 font-medium">{doc.type}</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 font-mono text-[10px]">{doc.date}</td>
                  <td className="px-4 py-2.5">
                    <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider ${
                      doc.status === 'Signed' ? 'bg-emerald-50 text-emerald-600' : 
                      doc.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>{doc.status}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-6 text-slate-400 text-xs">
                  No MoUs or legal agreements uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

export const Panel10_IP = () => (
  <Card className="col-span-full xl:col-span-4 border-slate-200/90 shadow-2xs h-full">
    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
      <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center text-slate-800">
        <FileKey className="w-4 h-4 mr-2 text-[#007A61]" /> IP & Tech Transfer
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 space-y-3">
       <div className="space-y-2">
         <div className="flex justify-between text-xs border-b border-slate-100 pb-2">
           <span className="text-slate-500 font-medium">Background IP</span>
           <span className="font-bold text-slate-800">University Owned</span>
         </div>
         <div className="flex justify-between text-xs border-b border-slate-100 pb-2">
           <span className="text-slate-500 font-medium">Foreground IP</span>
           <span className="font-bold text-slate-800">Jointly Developed</span>
         </div>
         <div className="flex justify-between text-xs border-b border-slate-100 pb-2">
           <span className="text-slate-500 font-medium">Patent Status</span>
           <span className="font-bold text-slate-400">Not Filed</span>
         </div>
         <div className="flex justify-between text-xs pt-1">
           <span className="text-slate-500 font-medium">Commercialization</span>
           <span className="font-bold text-blue-600">Open for Licensing</span>
         </div>
       </div>
    </CardContent>
  </Card>
);

export const Panel11_Internships = ({ data = [] }) => (
  <Card className="col-span-full xl:col-span-6 border-slate-200/90 shadow-2xs h-full">
    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
      <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center text-slate-800">
        <GraduationCap className="w-4 h-4 mr-2 text-[#007A61]" /> Internships & Ops
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-100 uppercase tracking-wider text-[9px]">
            <tr>
              <th className="px-4 py-2">Program Name</th>
              <th className="px-4 py-2">Duration</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data && data.length > 0 ? (
              data.map((prog, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-slate-800">
                    <span className="block">{prog.name}</span>
                    <span className="text-[9px] text-slate-400 font-medium">{prog.type}</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{prog.duration}</td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider border ${
                      prog.status === 'Open' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>{prog.status}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-6 text-slate-400 text-xs">
                  No active student internship drives posted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

export { Panel12_Communication, Panel14_Impact, Panel15_Settings, Panel16_QuickActions } from './IndustryPanels12To16.jsx';
