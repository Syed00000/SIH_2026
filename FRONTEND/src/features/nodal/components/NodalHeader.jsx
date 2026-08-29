import React from 'react';
import { FileText, Bell, ChevronDown } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST, SECTORS_LIST } from '../../government/data/governmentConstants.js';

export const NodalHeader = ({
  institutionName = 'Ranchi University',
  nodalName = 'Prof. Amit Kumar',
  nodalRole = 'Institutional Nodal Officer',
  selectedDistrict = 'All',
  setSelectedDistrict,
  selectedSector = 'All',
  setSelectedSector,
  onExportPdf,
  notificationCount = 7
}) => {
  const avatarInitials = (nodalName || 'Nodal Officer')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'NO';

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/90 px-4 md:px-6 py-2.5 flex items-center justify-between flex-shrink-0 shadow-xs select-none">
      {/* Left: Emblem & Department Typography */}
      <div className="flex items-center space-x-3">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Emblem_of_Jharkhand.svg/240px-Emblem_of_Jharkhand.svg.png"
          alt="Government of Jharkhand Logo"
          className="w-10 h-10 object-contain shrink-0"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://www.jharkhand.gov.in/images/jhlogo55.PNG';
          }}
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

      {/* Right Controls: Filters, Export PDF, Notification Bell, Nodal Avatar */}
      <div className="flex items-center space-x-3">
        {/* District Filter Dropdown */}
        <div className="hidden sm:flex items-center space-x-1.5">
          <span className="text-xs font-semibold text-slate-600">District:</span>
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict && setSelectedDistrict(e.target.value)}
              className="text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer appearance-none shadow-2xs min-w-[95px]"
            >
              <option value="All">All Districts</option>
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
          <span className="text-xs font-semibold text-slate-600">Sector:</span>
          <div className="relative">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector && setSelectedSector(e.target.value)}
              className="text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer appearance-none shadow-2xs min-w-[110px]"
            >
              <option value="All">All Sectors</option>
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

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors bg-white cursor-pointer shadow-2xs flex items-center justify-center"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* Nodal Officer Avatar Pill */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px] font-extrabold shrink-0 shadow-2xs">
            {avatarInitials}
          </div>
          <div className="hidden xl:flex flex-col text-left leading-none">
            <span className="text-xs font-bold text-slate-900 leading-tight">
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
