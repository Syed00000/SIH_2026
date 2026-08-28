import React from 'react';
import { FileText, Bell, ChevronDown } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST, SECTORS_LIST } from '../../data/governmentConstants.js';

export const GovernmentHeader = ({
  selectedDistrict = 'All',
  setSelectedDistrict,
  selectedSector = 'All',
  setSelectedSector,
  onExportPdf,
  notificationCount = 12
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/90 px-4 md:px-6 py-2.5 flex items-center justify-between flex-shrink-0 shadow-xs">
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
        <span className="font-extrabold text-[#0d1b3e] text-base tracking-wider uppercase">
          JOHARSETU ADMIN
        </span>
        <span className="text-[10px] font-semibold text-slate-500 tracking-normal">
          Societal Innovation Hub
        </span>
      </div>

      {/* Right Controls: Filters, Export PDF, Notification Bell, User Avatar */}
      <div className="flex items-center space-x-3">
        {/* District Filter Dropdown */}
        <div className="hidden sm:flex items-center space-x-1.5">
          <span className="text-xs font-semibold text-slate-600">
            District:
          </span>
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict && setSelectedDistrict(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer appearance-none shadow-2xs"
            >
              {JHARKHAND_DISTRICTS_LIST.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Sector Filter Dropdown */}
        <div className="hidden sm:flex items-center space-x-1.5">
          <span className="text-xs font-semibold text-slate-600">
            Sector:
          </span>
          <div className="relative">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector && setSelectedSector(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer appearance-none shadow-2xs"
            >
              {SECTORS_LIST.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Export PDF Button */}
        <button
          onClick={onExportPdf}
          className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-xs shadow-2xs transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Export PDF</span>
        </button>

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white font-extrabold text-[9px] rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white">
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* Admin User Profile Pill */}
        <div className="flex items-center space-x-2 pl-1 pr-2 py-0.5">
          <div className="w-8 h-8 rounded-full bg-[#0d1b3e] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
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
