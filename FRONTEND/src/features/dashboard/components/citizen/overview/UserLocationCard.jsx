import React from 'react';
import { MapPin, Pencil } from 'lucide-react';

export const UserLocationCard = ({ user, onEditProfile }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
        <h3 className="font-bold text-slate-900 text-xs md:text-sm">Your Location</h3>
        <button
          onClick={onEditProfile}
          className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center transition-colors cursor-pointer"
        >
          <Pencil className="w-2.5 h-2.5 mr-1" />
          Edit Profile
        </button>
      </div>

      <div className="flex-1 flex items-start space-x-3 bg-slate-50/70 p-3 rounded-md border border-slate-200/60">
        <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
          <MapPin className="w-4 h-4" />
        </div>
        <div className="space-y-2.5 flex-1 text-xs text-slate-700">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block leading-none">
              District
            </span>
            <span className="font-bold text-slate-900 block mt-0.5 leading-none">
              {user?.profile?.location?.district || user?.profile?.district || 'Ranchi'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block leading-none">
                Block / ULB
              </span>
              <span className="font-bold text-slate-900 block mt-0.5 leading-none">
                {user?.profile?.location?.blockOrULB || user?.profile?.blockOrULB || 'Ratu'}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block leading-none">
                Panchayat / Ward
              </span>
              <span className="font-bold text-slate-900 block mt-0.5 leading-none">
                {user?.profile?.location?.panchayatOrWard ||
                  user?.profile?.panchayatOrWard ||
                  'Gram'}
              </span>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block leading-none">
              Preferred Language
            </span>
            <span className="font-bold text-slate-900 block mt-0.5 leading-none">
              {user?.profile?.preferredLanguage || 'Hindi'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLocationCard;
