import React from 'react';
import { Bell } from 'lucide-react';

export const UniversityHeader = ({
  universityName = 'Ranchi University',
  adminName = 'Dr. Ankit Verma',
  adminRole = 'University Nodal Officer',
  notificationCount = 7
}) => {
  const avatarInitials = adminName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AV';

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/90 px-4 md:px-6 py-2.5 flex items-center justify-between flex-shrink-0 shadow-xs select-none">
      {/* Left: Emblem & Department Typography */}
      <div className="flex items-center space-x-3">
        <img
          src="https://www.jharkhand.gov.in/images/jhlogo55.PNG"
          alt="Government of Jharkhand Logo"
          className="w-10 h-10 object-contain"
        />
        <div>
          <h1 className="font-bold text-slate-900 text-xs md:text-sm leading-tight tracking-tight">
            Government of Jharkhand
          </h1>
          <p className="text-[10px] md:text-[11px] text-slate-500 font-medium leading-tight">
            Department of Higher and Technical Education
          </p>
        </div>
      </div>

      {/* Center: JoharSetu Admin Title */}
      <div className="hidden lg:flex flex-col items-center">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#007A61] animate-pulse"></span>
          <span className="font-extrabold text-[#007A61] text-base tracking-wider uppercase">
            JOHARSETU HEI
          </span>
        </div>
        <span className="text-[10px] font-semibold text-slate-500 tracking-normal">
          University Innovation & R&D Portal
        </span>
      </div>

      {/* Right Controls: Notification Bell, University & Admin Avatar */}
      <div className="flex items-center space-x-3">
        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#007A61] hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors cursor-pointer shadow-2xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-700 text-white font-extrabold text-[9px] rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white">
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* University Name & Admin Profile on Header Right */}
        <div className="flex items-center space-x-2 pl-1 pr-2 py-0.5">
          <div className="w-8 h-8 rounded-xl bg-[#007A61] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            {avatarInitials}
          </div>
          <div className="text-left leading-tight hidden md:block">
            <div className="text-xs font-extrabold text-slate-900 flex items-center space-x-1">
              <span>{adminName}</span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium truncate max-w-[170px]">
              {universityName} • {adminRole}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UniversityHeader;
