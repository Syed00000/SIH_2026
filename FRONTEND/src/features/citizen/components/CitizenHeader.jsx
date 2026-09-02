import React from 'react';
import { CitizenNotificationPopover } from './CitizenNotificationPopover.jsx';

export const CitizenHeader = ({
  user,
  onLogout,
  onSelectNotification
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/90 border-t-2 border-t-emerald-600 px-4 md:px-6 py-2 flex items-center justify-between flex-shrink-0 shadow-2xs">
      {/* Left: Official Emblem & Department Typography */}
      <div className="flex items-center space-x-3">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Emblem_of_Jharkhand.svg/240px-Emblem_of_Jharkhand.svg.png"
          alt="Government of Jharkhand Emblem"
          className="w-10 h-10 object-contain shrink-0"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://www.jharkhand.gov.in/images/jhlogo55.PNG';
          }}
        />
        <div className="leading-tight text-left">
          <h1 className="font-extrabold text-slate-900 text-sm tracking-tight">
            Government of Jharkhand
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5 hidden sm:block">
            Department of Higher and Technical Education
          </p>
        </div>
      </div>

      {/* Center: JOHARSETU CITIZEN PORTAL Branding */}
      <div className="hidden lg:flex flex-col items-center justify-center text-center">
        <span className="font-black text-[#0d1b3e] text-base tracking-wider uppercase leading-none">
          JOHARSETU CITIZEN PORTAL
        </span>
        <span className="text-xs text-emerald-700 font-semibold tracking-normal mt-1 flex items-center space-x-1">
          <span>Societal Innovation Hub</span>
        </span>
      </div>

      {/* Right Controls: Notification Bell, User Avatar & Logout */}
      <div className="flex items-center space-x-3">
        {/* Notification Bell with Badge */}
        <CitizenNotificationPopover user={user} onSelectNotification={onSelectNotification} />

        {/* User Profile Avatar Pill */}
        <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
          <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center shadow-2xs shrink-0">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'C'}
          </div>
          <div className="hidden sm:flex flex-col text-left leading-none">
            <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
              {user?.fullName || 'Citizen User'}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold mt-0.5">
              Citizen
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CitizenHeader;
