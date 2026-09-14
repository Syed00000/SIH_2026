import React from 'react';
import { User, Shield, MapPin, Building, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

export const DossierTrackingTab = ({ challenge }) => {
  const timeline = [];

  // Helper to check if object exists and isn't just an empty dummy
  const isValidObj = (obj) => obj && (obj.name || obj.id || obj.assignedAt || Object.keys(obj).length > 0);

  // 1. Submission
  timeline.push({
    id: 'submitted',
    title: 'Problem Reported',
    description: `Submitted by ${challenge.submitter?.name || 'Citizen'} from ${challenge.location?.district || challenge.district || 'Jharkhand'}`,
    date: challenge.submittedAt || challenge.createdAt,
    icon: User,
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  });

  const isCurrentlyDistrict = challenge.assignedDepartment && !challenge.assignedDepartment.category?.includes('State') && !challenge.assignedDepartment.level?.includes('State');
  const isCurrentlyState = challenge.assignedDepartment && (challenge.assignedDepartment.level === 'State Department' || challenge.assignedDepartment.category === 'State Department');
  const isCurrentlyMinistry = challenge.assignedDepartment && (challenge.assignedDepartment.level === 'State Ministry' || challenge.assignedDepartment.category === 'State Ministry' || challenge.assignedDepartment.category === 'Apex Government');

  const TIERS = [
    { key: 'WARD', name: 'Ward Commissioner', label: 'Ward', obj: challenge.assignedWard, ev: challenge.escalationEvidence?.find(e => e.level === 'WARD'), color: 'bg-amber-100 text-amber-700 border-amber-200', icon: MapPin },
    { key: 'BLOCK', name: 'Block Office', label: 'Block', obj: challenge.assignedBlock, ev: challenge.escalationEvidence?.find(e => e.level === 'BLOCK'), color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Building },
    { key: 'DISTRICT', name: 'District Department', label: 'District', obj: isCurrentlyDistrict ? challenge.assignedDepartment : null, ev: challenge.escalationEvidence?.find(e => e.level === 'DISTRICT'), color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Building },
    { key: 'STATE', name: 'State Department', label: 'State', obj: isCurrentlyState ? challenge.assignedDepartment : null, ev: challenge.escalationEvidence?.find(e => e.level === 'STATE'), color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Building },
    { key: 'MINISTRY', name: 'State Ministry / Apex', label: 'Ministry', obj: isCurrentlyMinistry ? challenge.assignedDepartment : null, ev: challenge.escalationEvidence?.find(e => e.level === 'MINISTRY'), color: 'bg-rose-100 text-rose-700 border-rose-200', icon: Building }
  ];

  TIERS.forEach(({ key, name, label, obj, ev, color, icon }) => {
    if (isValidObj(obj) || ev) {
      timeline.push({
        id: `${key.toLowerCase()}-assigned`,
        title: key === 'WARD' ? `Assigned to ${name}` : `Escalated to ${name}`,
        description: `Routed to ${obj?.name || name}`,
        date: obj?.assignedAt || null,
        icon,
        color
      });
    }
    if (ev) {
      timeline.push({
        id: `${key.toLowerCase()}-ev`,
        title: `${label} Level Verification`,
        description: `Verified by ${ev.technicianName || 'Authority'}. Remarks: ${ev.remarks}`,
        date: ev.date,
        icon: Shield,
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        media: ev.mediaUrls
      });
    }
  });

  // Current Technician (if completed but not escalated)
  if (challenge.assignedTechnician && challenge.assignedTechnician.status === 'Completed') {
    let currentLevelName = 'Current Level';
    if (isCurrentlyMinistry) currentLevelName = 'Ministry Level';
    else if (isCurrentlyState) currentLevelName = 'State Level';
    else if (isCurrentlyDistrict) currentLevelName = 'District Level';
    else if (isValidObj(challenge.assignedBlock)) currentLevelName = 'Block Level';
    else if (isValidObj(challenge.assignedWard)) currentLevelName = 'Ward Level';

    const escalatedUrls = (challenge.escalationEvidence || []).flatMap(e => e.mediaUrls || []);
    const techUrls = (challenge.mediaUrls || []).filter(url => !escalatedUrls.includes(url) && !(challenge.media || []).map(m => m.url || m).includes(url));

    timeline.push({
      id: 'curr-tech',
      title: `${currentLevelName} Verification`,
      description: `Work completed by ${challenge.assignedTechnician.name}. Remarks: ${challenge.assignedTechnician.completionRemarks}`,
      date: challenge.assignedTechnician.completedAt,
      icon: Shield,
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      media: techUrls
    });
  }

  if (challenge.status === 'Resolved' || challenge.status === 'Deployed') {
    timeline.push({
      id: 'resolved',
      title: 'Problem Resolved & Deployed',
      description: 'The problem has been completely resolved and marked as deployed.',
      date: challenge.resolvedAt || challenge.updatedAt,
      icon: CheckCircle2,
      color: 'bg-emerald-600 text-white border-emerald-700'
    });
  } else if (challenge.status === 'Not Solved' || challenge.status === 'Rejected') {
    timeline.push({
      id: 'rejected',
      title: 'Problem Rejected / Not Solved',
      description: 'The current authority marked this problem as not solved.',
      date: challenge.updatedAt,
      icon: AlertCircle,
      color: 'bg-rose-600 text-white border-rose-700'
    });
  }

  // Sort timeline by date
  timeline.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1; // Put null dates at the end if we can't sort them
    if (!b.date) return -1;
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
      <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-wide flex items-center gap-2">
        <Activity className="w-4 h-4 text-[#007A61]" />
        Problem Statement Tracking
      </h3>
      
      <div className="relative border-l-2 border-slate-100 ml-4 space-y-6">
        {timeline.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={item.id + idx} className="relative pl-6">
              <div className={`absolute -left-[17px] top-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center ${item.color} bg-white`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                  <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                  {item.date && (
                    <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-xs">
                      {new Date(item.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                {item.media && item.media.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {item.media.map((m, i) => (
                      <a key={i} href={m} target="_blank" rel="noreferrer" className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-slate-200 hover:border-[#007A61] block bg-white">
                        <img src={m} alt="Evidence" className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
