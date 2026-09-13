import React from 'react';
import { Bell } from 'lucide-react';

export const GovernmentHeader = ({
  notificationCount = 7
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 px-4 md:px-6 py-2 flex items-center justify-between flex-shrink-0 shadow-2xs">
      {/* Left: Official Emblem & Department Typography */}
      <div className="flex items-center space-x-3">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Emblem_of_Jharkhand.svg/240px-Emblem_of_Jharkhand.svg.png"
          alt="Government of Jharkhand"
          className="w-10 h-10 object-contain shrink-0"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://www.jharkhand.gov.in/images/jhlogo55.PNG';
          }}
        />
        <div className="leading-tight">
          <h1 className="font-extrabold text-slate-900 text-sm tracking-tight">
            Government of Jharkhand
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Department of Higher and Technical Education
          </p>
        </div>
      </div>

      {/* Center: JOHARSETU ADMIN Branding */}
      <div className="hidden lg:flex flex-col items-center justify-center text-center">
        <span className="font-black text-[#007A61] text-base tracking-wider uppercase leading-none">
          JOHARSETU ADMIN
        </span>
        <span className="text-xs text-slate-500 font-medium tracking-normal mt-1">
          Societal Innovation Hub
        </span>
      </div>

      {/* Right Controls: Notification Bell, User Avatar */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white font-extrabold text-[10px] rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white shadow-xs">
              {notificationCount}
            </span>
          </button>
        </div>

        {/* Admin User Profile Pill */}
        <div className="flex items-center space-x-2.5 pl-1">
          <div className="w-9 h-9 rounded-full bg-[#007A61] text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
            AD
          </div>
          <div className="text-left leading-tight hidden md:block">
            <div className="text-xs font-bold text-slate-900">Admin</div>
            <div className="text-[10px] text-slate-400 font-medium">Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GovernmentHeader;
