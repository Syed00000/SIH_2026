import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, Layers, Clock, X, ChevronRight, AlertCircle, FileText, Trash2, Building2 } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';
export const UniversityHeader = ({
  universityName = 'Ranchi University', adminName = 'Dr. Ankit Verma', adminRole = 'University Nodal Officer',
  notificationCount = 0, notifications = [], onNavigateTab, onClearNotifications, universityCode = 'RU001', onProfileClick
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const avatarInitials = adminName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AV';
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
  const handleClearAll = async () => {
    setIsDropdownOpen(false);
    await universityApiService.clearActivities(universityCode).catch(() => {});
    if (onClearNotifications) onClearNotifications();
  };
  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/90 px-4 md:px-6 py-2.5 flex items-center justify-between flex-shrink-0 shadow-xs select-none">
      <div className="flex items-center space-x-3">
        <img src="https://www.jharkhand.gov.in/images/jhlogo55.PNG" alt="Logo" className="w-10 h-10 object-contain" />
        <div>
          <h1 className="font-bold text-slate-900 text-xs md:text-sm leading-tight tracking-tight">Government of Jharkhand</h1>
          <p className="text-[10px] md:text-[11px] text-slate-500 font-medium leading-tight">Department of Higher and Technical Education</p>
        </div>
      </div>
      <div className="hidden lg:flex flex-col items-center">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#007A61] animate-pulse" />
          <span className="font-extrabold text-[#007A61] text-base tracking-wider uppercase">JOHARSETU HEI</span>
        </div>
        <span className="text-[10px] font-semibold text-slate-500 tracking-normal">University Innovation & R&D Portal</span>
      </div>
      <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
        {/* Notification Bell with Dynamic Badge */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`relative w-8 h-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer shadow-2xs ${
            isDropdownOpen
              ? 'bg-emerald-50 border-[#007A61] text-[#007A61]'
              : 'border-slate-200 text-slate-600 hover:text-[#007A61] hover:border-emerald-200 hover:bg-emerald-50/50'
          }`}
          title="Institutional Notifications & Alerts"
        >
          <Bell className="w-4 h-4" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-amber-500 text-white font-extrabold text-[9px] rounded-full flex items-center justify-center ring-2 ring-white animate-pulse shadow-2xs">
              {count}
            </span>
          )}
        </button>
        {/* Interactive Notifications Details Dropdown */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-11 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden text-left">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  Institutional Notifications
                </span>
                {count > 0 && (
                  <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-black">
                    {count} Active
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
                      if (item.targetTab && onNavigateTab) {
                        onNavigateTab(item.targetTab);
                      }
                      setIsDropdownOpen(false);
                    }}
                    className="p-3.5 hover:bg-emerald-50/30 transition-colors cursor-pointer space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 min-w-0">
                        {item.type === 'APPROVAL' ? (
                          <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        ) : item.type === 'INDUSTRY' ? (
                          <Building2 className="w-3.5 h-3.5 text-[#007A61] shrink-0" />
                        ) : item.type === 'CHALLENGE' ? (
                          <Layers className="w-3.5 h-3.5 text-[#007A61] shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                        <span className="text-[11px] font-black text-slate-900 truncate">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[9.5px] font-bold text-slate-400 shrink-0">
                        {item.time || 'Recent'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-snug line-clamp-2">
                      {item.message}
                    </p>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[9.5px] font-extrabold text-[#007A61] uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                        {item.category || item.type || 'SYSTEM'}
                      </span>
                      <span className="text-[10.5px] font-bold text-[#007A61] flex items-center space-x-0.5 group-hover:translate-x-0.5 transition-transform">
                        <span>{item.actionLabel || 'View Details'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 font-semibold space-y-1">
                  <Bell className="w-6 h-6 text-slate-300 mx-auto" />
                  <p>No active institutional notifications at this time.</p>
                </div>
              )}
            </div>
            <div className="border-t border-slate-100 px-4 py-2.5 bg-slate-50/50 flex items-center justify-between text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setIsDropdownOpen(false); onNavigateTab?.('notifications'); }}
                className="text-[#007A61] hover:text-emerald-800 py-1 px-2 rounded-lg hover:bg-emerald-50 cursor-pointer transition-colors"
              >
                View all &gt;
              </button>
              {count > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="flex items-center gap-1 text-slate-400 hover:text-rose-500 py-1 px-2 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear all
                </button>
              )}
            </div>
          </div>
        )}
        <div 
          onClick={(e) => { e.stopPropagation(); if(onProfileClick) onProfileClick(); else if(onNavigateTab) onNavigateTab('profile'); }}
          className="flex items-center space-x-2 pl-1 pr-2 py-0.5 cursor-pointer hover:opacity-80 transition-opacity"
          title="View Profile"
        >
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
