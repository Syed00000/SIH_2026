import React from 'react';
import { LogOut, RefreshCw, Menu } from 'lucide-react';

export const TechnicianHeader = ({ user, onLogout, onRefresh, refreshing, onMenuClick }) => {
  const techId = user?.technicianId || user?.id || 'TECH-01';
  const name = user?.fullName || user?.name || 'Field Technician';
  const deptName = user?.department || user?.departmentName || 'Department Operations';

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/90 border-t-2 border-t-emerald-600 px-3 sm:px-6 py-2 flex items-center justify-between flex-shrink-0 shadow-2xs select-none">
      {/* Left: Mobile Toggle + Emblem & Department */}
      <div className="flex items-center space-x-2 sm:space-x-3 text-left">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="md:hidden p-1.5 rounded-none border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="Open navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Emblem_of_Jharkhand.svg/240px-Emblem_of_Jharkhand.svg.png"
          alt="Government of Jharkhand"
          className="w-9 h-9 sm:w-10 sm:h-10 object-contain shrink-0"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://www.jharkhand.gov.in/images/jhlogo55.PNG';
          }}
        />
        <div className="leading-tight">
          <h1 className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight flex items-center gap-1.5">
            <span>Govt of Jharkhand</span>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#007A61]">
              Field Technician
            </span>
          </h1>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5 hidden sm:block">
            {deptName} • Field Remediation Wing
          </p>
        </div>
      </div>

      {/* Center: Branding */}
      <div className="hidden lg:flex flex-col items-center justify-center text-center">
        <span className="font-black text-[#0d1b3e] text-base tracking-wider uppercase leading-none">
          JOHARSETU TECHNICIAN PORTAL
        </span>
        <span className="text-xs text-emerald-700 font-semibold tracking-normal mt-1 flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse inline-block" />
          <span>On-Ground Field Operations & Issue Remediation</span>
        </span>
      </div>

      {/* Right: Refresh, Avatar & Sign Out */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-none border border-slate-200 transition cursor-pointer disabled:opacity-50"
          title="Refresh tasks"
        >
          <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${refreshing ? 'animate-spin text-emerald-700' : ''}`} />
        </button>

        <div className="flex items-center space-x-2 border-l border-slate-200 pl-2 sm:pl-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-none bg-emerald-800 text-white font-black text-xs flex items-center justify-center shadow-2xs shrink-0">
            {name ? name.charAt(0).toUpperCase() : 'T'}
          </div>
          <div className="hidden sm:flex flex-col text-left leading-none">
            <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
              {name}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold mt-0.5">
              Field Technician
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-none border border-rose-200 transition cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </header>
  );
};

export default TechnicianHeader;
