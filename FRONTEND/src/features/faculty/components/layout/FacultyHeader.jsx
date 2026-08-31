import React from 'react';
import { FileText, Bell, ChevronDown, Sparkles, Building2 } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST, SECTORS_LIST } from '../../../government/data/governmentConstants.js';

export const FacultyHeader = ({
  universityName = 'Ranchi University',
  facultyName = 'Dr. Binod Kumar',
  facultyRole = 'Senior Research Scientist',
  department = 'Electrical & Electronics',
  selectedDistrict = 'All',
  setSelectedDistrict,
  selectedSector = 'All',
  setSelectedSector,
  onExportPdf,
  notificationCount = 3
}) => {
  const avatarInitials = (facultyName || 'FM')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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

      {/* Right Controls: Filters, Export PDF, Notification Bell, Faculty Avatar */}
      <div className="flex items-center space-x-3">
        {/* District Filter Dropdown */}
        <div className="hidden sm:flex items-center space-x-1.5">
          <span className="text-xs font-semibold text-slate-600">District:</span>
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict && setSelectedDistrict(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 pr-7 hover:border-[#007A61] focus:outline-none focus:ring-1 focus:ring-[#007A61] cursor-pointer appearance-none shadow-2xs"
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
          <span className="text-xs font-semibold text-slate-600">Sector:</span>
          <div className="relative">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector && setSelectedSector(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 pr-7 hover:border-[#007A61] focus:outline-none focus:ring-1 focus:ring-[#007A61] cursor-pointer appearance-none shadow-2xs"
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
          type="button"
          onClick={onExportPdf || (() => window.print())}
          className="flex items-center space-x-1.5 bg-white hover:bg-emerald-50/60 hover:text-[#007A61] hover:border-emerald-300 text-slate-700 font-bold px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-2xs transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-[#007A61]" />
          <span className="hidden sm:inline">Export PDF</span>
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              {notificationCount}
            </span>
          )}
        </button>

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
