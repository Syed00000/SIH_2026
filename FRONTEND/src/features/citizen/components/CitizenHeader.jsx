import React from 'react';
import { Bell } from 'lucide-react';

export const CitizenHeader = ({ unreadCount = 3, onNotificationsClick }) => {
  return (
    <header className="w-full bg-white px-4 pt-3 pb-2 flex items-center justify-between border-b border-emerald-50/80 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center space-x-2.5">
        {/* Jharkhand Emblem Logo */}
        <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-emerald-50 border border-emerald-200/80 shadow-2xs overflow-hidden">
          <img
            src="https://www.jharkhand.gov.in/images/jhlogo55.PNG"
            alt="Government of Jharkhand Emblem"
            className="w-10 h-10 object-contain"
            onError={(e) => {
              // Fallback clean government emblem SVG if image fails to load
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='46' fill='%23ecfdf5' stroke='%23047857' stroke-width='4'/%3E%3Ccircle cx='50' cy='50' r='38' fill='none' stroke='%23059669' stroke-width='2' stroke-dasharray='4,4'/%3E%3Cpath d='M50 20 L55 35 L70 35 L58 45 L62 60 L50 50 L38 60 L42 45 L30 35 L45 35 Z' fill='%23047857'/%3E%3Ctext x='50' y='76' font-size='10' font-weight='bold' fill='%23065f46' text-anchor='middle' font-family='sans-serif'%3EJHARKHAND%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>

        {/* Portal Title & Subtitles */}
        <div className="flex flex-col text-left">
          <div className="flex items-baseline space-x-1.5 leading-tight">
            <span className="text-[17px] font-black text-emerald-900 tracking-tight">
              Jharkhand
            </span>
          </div>
          <span className="text-[12px] font-bold text-emerald-950/80 leading-tight">
            Societal Innovation Portal
          </span>
          <span className="text-[11px] font-extrabold text-emerald-600 tracking-wide leading-tight mt-0.5">
            Citizen Portal
          </span>
        </div>
      </div>

      {/* Notification Bell with Red Badge */}
      <button
        onClick={onNotificationsClick}
        aria-label="View notifications"
        className="relative p-2 rounded-full text-emerald-900 hover:bg-emerald-50 transition-colors cursor-pointer"
      >
        <Bell className="w-6 h-6 text-emerald-900 stroke-[2.2]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-xs animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>
    </header>
  );
};

export default CitizenHeader;
