import React from 'react';
import { Bell, Home, FileText, Plus, BarChart3, User, LogOut } from 'lucide-react';

export const CitizenHeader = ({
  activeTab = 'home',
  onChangeTab,
  onSubmitClick,
  unreadCount = 3,
  onNotificationsClick,
  user,
  onLogout
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'challenges', label: 'My Challenges', icon: FileText },
    { id: 'updates', label: 'Updates', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Left: Branding */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onChangeTab && onChangeTab('home')}>
          <div className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 shadow-2xs overflow-hidden">
            <img
              src="https://www.jharkhand.gov.in/images/jhlogo55.PNG"
              alt="Government of Jharkhand Emblem"
              className="w-9 h-9 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='46' fill='%23ecfdf5' stroke='%23047857' stroke-width='4'/%3E%3Ccircle cx='50' cy='50' r='38' fill='none' stroke='%23059669' stroke-width='2' stroke-dasharray='4,4'/%3E%3Cpath d='M50 20 L55 35 L70 35 L58 45 L62 60 L50 50 L38 60 L42 45 L30 35 L45 35 Z' fill='%23047857'/%3E%3Ctext x='50' y='76' font-size='10' font-weight='bold' fill='%23065f46' text-anchor='middle' font-family='sans-serif'%3EJHARKHAND%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-baseline space-x-2">
              <span className="text-base font-black text-emerald-900 tracking-tight">
                Government of Jharkhand
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Citizen Portal
              </span>
            </div>
            <span className="text-xs font-bold text-slate-600">
              Societal Innovation Hub
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab && onChangeTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Actions (Submit Challenge Button, Notifications, User Menu) */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onSubmitClick}
            className="px-4 py-2 bg-gradient-to-r from-emerald-800 to-emerald-600 hover:from-emerald-900 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center space-x-2 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Submit a Challenge</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onNotificationsClick}
            aria-label="View notifications"
            className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 bg-white"
          >
            <Bell className="w-5 h-5 text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-xs animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Logout Button if available */}
          {onLogout && (
            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer border border-slate-200 bg-white"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default CitizenHeader;
