import React, { useState, useRef, useEffect } from 'react';
import { Bell, MessageSquare, ChevronRight, X, RotateCcw } from 'lucide-react';

export const FacultyHeader = ({
  universityName = 'Ranchi University',
  facultyName = 'Dr. Binod Kumar',
  facultyRole = 'Senior Research Scientist',
  department = 'Electrical & Electronics',
  notificationCount = 0,
  notifications = [],
  onSelectNotification
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const avatarInitials = (facultyName || 'FM')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const count = notificationCount || notifications.length;

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/90 px-4 md:px-6 py-2.5 flex items-center justify-between flex-shrink-0 shadow-xs select-none">
      {/* Left: Emblem & Department Typography */}
      <div className="flex items-center space-x-3">
        <img
          src="https://www.jharkhand.gov.in/images/jhlogo55.PNG"
          alt="Government of Jharkhand Logo"
          className="w-10 h-10 object-contain drop-shadow-2xs"
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

      {/* Center: JoharSetu Faculty Title */}
      <div className="hidden lg:flex flex-col items-center">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#007A61] animate-pulse" />
          <span className="font-extrabold text-[#007A61] text-base tracking-wider uppercase">
            JOHARSETU FACULTY
          </span>
        </div>
        <span className="text-[10px] font-semibold text-slate-500 tracking-normal">
          Research Mentorship & Prototyping Node
        </span>
      </div>

      {/* Right Controls: Notification Bell, Faculty Avatar */}
      <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`relative p-2 border rounded-xl transition-all shadow-2xs cursor-pointer ${
            isDropdownOpen
              ? 'bg-emerald-50 border-[#007A61] text-[#007A61]'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
          title="Notifications & Directives"
        >
          <Bell className="w-4 h-4" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-amber-500 text-white text-[9.5px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse shadow-2xs">
              {count}
            </span>
          )}
        </button>

        {/* Interactive Notifications Dropdown */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-4 py-3 bg-gradient-to-r from-emerald-50/80 to-amber-50/60 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  Notifications & Directives
                </span>
                {count > 0 && (
                  <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-black">
                    {count} New
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    onClick={() => {
                      if (onSelectNotification) onSelectNotification(item);
                      setIsDropdownOpen(false);
                    }}
                    className="p-3.5 hover:bg-amber-50/40 transition-colors cursor-pointer space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 min-w-0">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="text-[11px] font-black text-slate-900 truncate">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[9.5px] font-bold text-slate-400 shrink-0">
                        {item.date || 'Recently'}
                      </span>
                    </div>

                    <p className="text-xs text-amber-950 font-medium bg-amber-50/60 p-2 rounded-lg border border-amber-200/60 italic leading-snug line-clamp-3">
                      "{item.message}"
                    </p>

                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[10px] font-extrabold text-[#007A61] uppercase tracking-wider">
                        University Authority Review
                      </span>
                      <span className="text-[10.5px] font-bold text-[#007A61] flex items-center space-x-0.5 group-hover:translate-x-0.5 transition-transform">
                        <span>Open Workspace</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 font-semibold space-y-1">
                  <Bell className="w-6 h-6 text-slate-300 mx-auto" />
                  <p>No new directives or authority remarks.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Faculty Profile Badge */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-[#007A61] text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
            {avatarInitials}
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[140px]">
              {facultyName}
            </span>
            <span className="text-[10px] text-slate-500 font-medium leading-tight truncate max-w-[140px]">
              {facultyRole} • {universityName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default FacultyHeader;
