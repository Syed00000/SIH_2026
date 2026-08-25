import React, { useState } from 'react';
import { Bell, ChevronDown, Globe, Menu, FileDown, Download } from 'lucide-react';

export const DashboardHeader = ({
  user,
  role,
  activeTab,
  selectedLanguage,
  setSelectedLanguage,
  fontSize,
  setFontSize,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onNavigateTab
}) => {
  const isAdmin = role === 'ADMIN' || activeTab === 'ai-triage';
  const [headerDistrict, setHeaderDistrict] = useState('All');
  const [headerSector, setHeaderSector] = useState('All');

  const initials = isAdmin
    ? 'AD'
    : user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'TW';

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 px-4 md:px-6 py-2 flex items-center justify-between flex-shrink-0 shadow-xs">
      {/* Brand & Emblem */}
      <div className="flex items-center space-x-3">
        <img
          src="https://www.jharkhand.gov.in/images/jhlogo55.PNG"
          alt="Government of Jharkhand Logo"
          className="w-9 h-9 object-contain"
        />
        <div>
          <h1 className="font-bold text-slate-900 text-xs md:text-sm leading-tight tracking-tight">
            Government of Jharkhand
          </h1>
          <p className="text-[10px] text-slate-500 font-medium leading-tight">
            Department of Higher and Technical Education
          </p>
        </div>
      </div>

      {/* Center Portal Identifier */}
      <div className="hidden lg:flex flex-col items-center">
        <span className="font-extrabold text-slate-900 text-base tracking-wider uppercase">
          {isAdmin ? 'JOHARSETU ADMIN' : 'JOHARSETU'}
        </span>
        <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase">
          {isAdmin ? 'Societal Innovation Hub' : role === 'CITIZEN' ? 'Citizen Portal' : `${role} Portal`}
        </span>
      </div>

      {/* Header Right Utility Controls */}
      <div className="flex items-center space-x-3">
        {isAdmin ? (
          /* Admin Filter & Action Tools */
          <div className="hidden md:flex items-center space-x-2.5">
            {/* District Filter */}
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-slate-500 font-medium">District:</span>
              <div className="relative">
                <select
                  value={headerDistrict}
                  onChange={(e) => setHeaderDistrict(e.target.value)}
                  className="appearance-none border border-slate-200 rounded-md pl-2 pr-6 py-1 bg-white text-xs font-bold text-slate-800 outline-none cursor-pointer focus:ring-1 focus:ring-slate-900"
                >
                  <option value="All">All</option>
                  <option value="Ranchi">Ranchi</option>
                  <option value="Dhanbad">Dhanbad</option>
                  <option value="Dumka">Dumka</option>
                  <option value="Jamshedpur">Jamshedpur</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Sector Filter */}
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-slate-500 font-medium">Sector:</span>
              <div className="relative">
                <select
                  value={headerSector}
                  onChange={(e) => setHeaderSector(e.target.value)}
                  className="appearance-none border border-slate-200 rounded-md pl-2 pr-6 py-1 bg-white text-xs font-bold text-slate-800 outline-none cursor-pointer focus:ring-1 focus:ring-slate-900"
                >
                  <option value="All">All</option>
                  <option value="Water">Water</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Health">Health</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Export PDF Button */}
            <button
              onClick={() => alert('Generating official JoharSetu AI Triage PDF Report...')}
              className="flex items-center space-x-1.5 border border-slate-200 rounded-md px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-600" />
              <span>Export PDF</span>
            </button>
          </div>
        ) : (
          /* Standard Citizen Controls */
          <>
            {/* Language Selection */}
            <div className="hidden md:flex items-center border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 bg-white shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="outline-none bg-transparent pr-1 font-medium text-xs cursor-pointer text-slate-800"
              >
                <option value="English">English</option>
                <option value="Hindi">हिंदी</option>
              </select>
            </div>

            {/* Accessibility Font Resizer (A-, A, A+) */}
            <div className="hidden sm:flex items-center border border-slate-200 rounded-md p-0.5 bg-slate-50">
              <button
                onClick={() => setFontSize('small')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                  fontSize === 'small'
                    ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Small Font"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                  fontSize === 'normal'
                    ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Normal Font"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                  fontSize === 'large'
                    ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Large Font"
              >
                A+
              </button>
            </div>
          </>
        )}

        {/* Notifications Icon with Badge */}
        <button
          onClick={() => onNavigateTab('notifications')}
          className="relative p-1.5 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all bg-white"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
            {isAdmin ? 12 : 3}
          </span>
        </button>

        {/* User Account / Role Badge */}
        <div
          onClick={() => onNavigateTab('profile')}
          className="flex items-center space-x-2 border border-slate-200 rounded-md px-2.5 py-1 cursor-pointer hover:bg-slate-50 transition-all bg-white shadow-2xs"
        >
          <div className="w-6 h-6 rounded bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
            {initials}
          </div>
          <div className="hidden md:block text-left truncate max-w-[110px]">
            <span className="text-xs font-bold text-slate-900 block leading-tight truncate">
              {isAdmin ? 'Admin' : user?.fullName || 'Tauqueer wasi'}
            </span>
            <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block">
              {isAdmin ? 'Super Admin' : role}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
        </div>

        {/* Mobile menu hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-1.5 border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
