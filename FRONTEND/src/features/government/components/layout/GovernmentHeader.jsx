import React from 'react';
import { FileText, Bell, ChevronDown } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST, SECTORS_LIST } from '../../data/governmentConstants.js';

export const GovernmentHeader = ({
  selectedDistrict = 'Ranchi',
  setSelectedDistrict,
  selectedSector = 'All Sectors',
  setSelectedSector,
  onExportPdf,
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
        <span className="font-black text-[#0d1b3e] text-base tracking-wider uppercase leading-none">
          JOHARSETU ADMIN
        </span>
        <span className="text-xs text-slate-500 font-medium tracking-normal mt-1">
          Societal Innovation Hub
        </span>
      </div>

      {/* Right Controls: Filters, Export PDF, Notification Bell, User Avatar */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* District Filter Dropdown */}
        <div className="hidden sm:flex items-center space-x-1.5">
          <span className="text-xs font-semibold text-slate-600">
            District:
          </span>
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict && setSelectedDistrict(e.target.value)}
              className="text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-1.5 pr-7 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer appearance-none shadow-2xs min-w-[110px]"
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
        <div className="hidden md:flex items-center space-x-1.5">
          <span className="text-xs font-semibold text-slate-600">
            Sector:
          </span>
          <div className="relative">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector && setSelectedSector(e.target.value)}
              className="text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-1.5 pr-7 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer appearance-none shadow-2xs min-w-[130px]"
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
          <span>Export PDF</span>
        </button>

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
          <div className="w-9 h-9 rounded-full bg-[#0d1b3e] text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
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
