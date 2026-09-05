import React from 'react';
import { Share2, ArrowRight, Briefcase, Rocket } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../../shared/components/ui/card.jsx';

export const Panel4_Collaboration = ({ data = {}, onViewRequest }) => (
  <Card className="col-span-full xl:col-span-8 border-slate-200/90 shadow-2xs">
    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
      <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center text-slate-800">
        <Share2 className="w-4 h-4 mr-2 text-[#007A61]" /> Collaboration Requests
      </CardTitle>
      <button className="text-[10px] font-bold text-blue-600 hover:underline flex items-center cursor-pointer">
        View All <ArrowRight className="w-3 h-3 ml-1" />
      </button>
    </CardHeader>
    <CardContent className="p-0">
      <div className="flex space-x-4 border-b border-slate-200 px-4 pt-3">
        <button className="text-[11px] font-bold text-[#007A61] border-b-2 border-[#007A61] pb-2 cursor-pointer">
          Received Requests ({data?.received?.length || 0})
        </button>
        <button className="text-[11px] font-bold text-slate-400 hover:text-slate-600 pb-2 cursor-pointer">
          Sent Requests
        </button>
        <button className="text-[11px] font-bold text-slate-400 hover:text-slate-600 pb-2 cursor-pointer">
          Matched Opportunities
        </button>
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
            {data?.received && data.received.length > 0 ? (
              data.received.map((req, i) => (
                <tr key={req.id || i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-slate-400">{i + 1}</td>
                  <td className="px-4 py-2.5">
                    <span className="font-bold text-slate-800 block">{req.title}</span>
                    {(req.status === 'Fee Declined' || req.quoteStatus === 'Declined') && req.declineReason && (
                      <span className="text-[10px] text-rose-600 font-semibold block line-clamp-1 italic">
                        Reason: {req.declineReason}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{req.university}</td>
                  <td className="px-4 py-2.5 text-slate-600">{req.required}</td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider ${
                      req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                      req.status === 'Rejected' || req.status === 'Fee Declined' || req.quoteStatus === 'Declined' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                      req.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>{req.status === 'Fee Declined' || req.quoteStatus === 'Declined' ? 'Fee Declined' : req.status}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button onClick={() => onViewRequest && onViewRequest(req)} className="text-blue-600 font-bold hover:underline cursor-pointer">
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-400 text-xs">
                  No incoming collaboration requests from universities at this moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

export const Panel5_Projects = ({ data = {}, onViewAll, onViewProject }) => (
  <Card className="col-span-full xl:col-span-6 border-slate-200/90 shadow-2xs h-full">
    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
      <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center text-slate-800">
        <Briefcase className="w-4 h-4 mr-2 text-[#007A61]" /> Active Projects
      </CardTitle>
      <button onClick={onViewAll} className="text-[10px] font-bold text-blue-600 hover:underline flex items-center cursor-pointer">
        View All <ArrowRight className="w-3 h-3 ml-1" />
      </button>
    </CardHeader>
    <CardContent className="p-0">
      <div className="flex space-x-4 border-b border-slate-200 px-4 pt-3">
        <button className="text-[11px] font-bold text-[#007A61] border-b-2 border-[#007A61] pb-2">
          Ongoing ({data?.ongoing?.length || 0})
        </button>
        <button className="text-[11px] font-bold text-slate-400 hover:text-slate-600 pb-2">
          Completed ({data?.completed?.length || 0})
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-100 uppercase tracking-wider text-[9px]">
            <tr>
              <th className="px-4 py-2">Project Name</th>
              <th className="px-4 py-2">University</th>
              <th className="px-4 py-2">Stage</th>
              <th className="px-4 py-2">Budget / Disbursed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data?.ongoing && data.ongoing.length > 0 ? (
              data.ongoing.map((proj, i) => (
                <tr key={proj.id || i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-slate-800 line-clamp-1">{proj.title}</td>
                  <td className="px-4 py-2.5 text-slate-600">{proj.university}</td>
                  <td className="px-4 py-2.5 text-slate-600">{proj.stage}</td>
                  <td className="px-4 py-2.5">
                    <span className="font-bold text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {proj.labChargesQuoted ? `${proj.labChargesQuoted} (Lab Fee)` : (proj.disbursed && proj.disbursed !== '₹ 0' ? proj.disbursed : (proj.budget || 'In Progress'))}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8 text-slate-400 text-xs">
                  No active university research projects linked yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

export const Panel6_Funding = ({ data = {}, onNavigateToFunding }) => {
  const committedText = data?.totalCommittedFormatted || '₹ 0.00 L';
  const distribution = data?.distribution || [];

  return (
    <Card className="col-span-full xl:col-span-6 border-slate-200/90 shadow-2xs h-full">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center text-slate-800">
          <Rocket className="w-4 h-4 mr-2 text-[#007A61]" /> Funding & Support
        </CardTitle>
        <button 
          onClick={onNavigateToFunding}
          className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center cursor-pointer hover:underline"
        >
          Manage & Fund <ArrowRight className="w-3 h-3 ml-1" />
        </button>
      </CardHeader>
      <CardContent className="p-4 flex flex-col sm:flex-row items-center">
        <div className="w-32 h-32 relative flex items-center justify-center shrink-0">
          <div className="w-full h-full rounded-full border-[12px] border-[#007A61] relative flex items-center justify-center">
            {distribution.length > 0 && (
              <>
                <div className="absolute inset-0 rounded-full border-[12px] border-blue-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%)'}}></div>
                <div className="absolute inset-0 rounded-full border-[12px] border-purple-500" style={{ clipPath: 'polygon(50% 50%, 0 100%, 0 50%)'}}></div>
              </>
            )}
            <div className="text-center">
              <span className="block text-sm font-black text-slate-900">{committedText}</span>
              <span className="block text-[8px] font-bold text-slate-500 uppercase">Committed</span>
            </div>
          </div>
        </div>
        <div className="ml-6 space-y-2.5 w-full mt-4 sm:mt-0">
          {distribution.length > 0 ? (
            distribution.map((item, idx) => (
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
            ))
          ) : (
            <div className="text-slate-400 text-xs py-2">
              <p className="font-bold text-slate-600">No Fund Pools Allocated</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click "Manage & Fund" above to allocate capital for university research grants.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
