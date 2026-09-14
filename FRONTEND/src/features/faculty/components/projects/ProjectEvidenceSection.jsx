import React from 'react';
import { Camera, ShieldCheck, MapPin, Navigation, User } from 'lucide-react';

export const ProjectEvidenceSection = ({ project }) => {
  if (!project) return null;

  const { mediaUrls = [], submitter, allocatedBy, location } = project;
  const fullAddress = location?.fullAddress || [location?.panchayatOrWard, location?.block, location?.district, location?.state].filter(Boolean).join(', ') || 'Address not provided';

  return (
    <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-4">
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <Camera className="w-4 h-4 text-[#007A61]" />
        <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-wide">
          Ground Level Evidence & Tracking
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tracking Details */}
        <div className="space-y-3">
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-2 text-xs">
            <h4 className="font-bold text-slate-700 pb-1 border-b border-slate-100 flex items-center space-x-1.5">
              <Navigation className="w-3.5 h-3.5 text-blue-500" />
              <span>Problem Source Tracking</span>
            </h4>
            
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-400 font-semibold whitespace-nowrap">Reported By:</span>
                <span className="font-medium text-right text-slate-800">{submitter?.name || submitter?.fullName || 'Anonymous Citizen'}</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-400 font-semibold whitespace-nowrap">Location:</span>
                <span className="font-medium text-right text-slate-800">{fullAddress}</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-400 font-semibold whitespace-nowrap">Verified By:</span>
                <span className="font-medium text-right text-emerald-700 flex items-center space-x-1 justify-end">
                  <ShieldCheck className="w-3 h-3 inline" />
                  <span>{allocatedBy?.name || 'Nodal Officer'}</span>
                </span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-400 font-semibold whitespace-nowrap">Forwarded To:</span>
                <span className="font-medium text-right text-slate-800">University R&D Cell</span>
              </div>
            </div>
          </div>
        </div>

        {/* Evidence Photos */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
           <h4 className="font-bold text-slate-700 pb-2 flex items-center space-x-1.5 text-xs">
              <Camera className="w-3.5 h-3.5 text-slate-400" />
              <span>Ground Level Photos</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {mediaUrls.length > 0 ? (
                mediaUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer" className="block aspect-square rounded-lg border border-slate-200 overflow-hidden hover:border-[#007A61] transition-colors relative group bg-slate-100">
                    <img src={url} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold tracking-wider uppercase">View</span>
                    </div>
                  </a>
                ))
              ) : (
                <div className="col-span-full p-4 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50 text-[10px] text-slate-400">
                  No photographic evidence attached.
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};
