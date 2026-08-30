import React from 'react';
import { Bell, Menu, Shield } from 'lucide-react';

export const NodalHeader = ({
  institutionName = 'Jharkhand State Innovation Cell',
  nodalName = 'State Nodal Officer',
  notificationCount = 4,
  onToggleSidebar
}) => {
  const avatarInitials = (nodalName || 'Nodal Officer')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'NO';

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/90 px-3.5 sm:px-5 py-2 flex items-center justify-between flex-shrink-0 shadow-2xs select-none">
      {/* Left: Mobile Toggle + Emblem & Department Typography */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 md:hidden cursor-pointer"
          title="Toggle Navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Emblem_of_Jharkhand.svg/240px-Emblem_of_Jharkhand.svg.png"
          alt="Government of Jharkhand Logo"
          className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://www.jharkhand.gov.in/images/jhlogo55.PNG';
          }}
        />
        <div>
          <h1 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight tracking-tight">
            Government of Jharkhand
          </h1>
          <p className="text-[10.5px] sm:text-[11px] text-[#047857] font-bold leading-tight">
            State Nodal Cell &bull; Higher & Technical Education
          </p>
        </div>
      </div>

      {/* Center: JoharSetu Nodal Portal Indicator */}
      <div className="hidden lg:flex items-center space-x-2 bg-emerald-50/70 border border-emerald-200/80 px-3 py-1 rounded-full">
        <span className="w-2 h-2 rounded-full bg-[#047857] animate-pulse" />
        <span className="font-extrabold text-[#064e3b] text-xs tracking-wider uppercase">
          JoharSetu Nodal Authority
        </span>
        <span className="text-emerald-400">&bull;</span>
        <span className="text-[11px] font-semibold text-emerald-800">
          Grassroots Triage Console
        </span>
      </div>

      {/* Right Controls: Notification Bell & Officer Profile Pill */}
      <div className="flex items-center space-x-2.5">
        {/* Notification Bell */}
        <div className="relative">
          <button
            className="p-1.5 sm:p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors bg-white cursor-pointer shadow-2xs flex items-center justify-center"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#047857] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* Nodal Officer Avatar Pill */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#047857] text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-2xs">
            {avatarInitials}
          </div>
          <div className="hidden sm:flex flex-col text-left leading-none">
            <span className="text-xs font-extrabold text-slate-900 leading-tight">
              {nodalName}
            </span>
            <span className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
              {institutionName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NodalHeader;
