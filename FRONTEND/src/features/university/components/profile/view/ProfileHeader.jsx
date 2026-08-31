import React from 'react';
import { Building2, Edit3, Award, Globe, Phone, MapPin } from 'lucide-react';

export const ProfileHeader = ({ profile, onOpenEdit }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#007A61] font-black text-xl flex items-center justify-center shrink-0 shadow-2xs">
            {profile.shortName || 'RU'}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {profile.name}
              </h1>
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {profile.code}
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {profile.accreditation?.naacGrade || 'NAAC A+'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium line-clamp-2">
              {profile.tagline || profile.about}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenEdit}
          className="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
        <div className="flex items-center space-x-1.5">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <a href={`https://${profile.website}`} target="_blank" rel="noreferrer" className="text-slate-900 font-bold hover:underline">
            {profile.website}
          </a>
        </div>
        <div className="flex items-center space-x-1.5">
          <Phone className="w-3.5 h-3.5 text-slate-400" />
          <span>{profile.universityPhone}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{profile.address?.district || 'Ranchi'}, Jharkhand</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
