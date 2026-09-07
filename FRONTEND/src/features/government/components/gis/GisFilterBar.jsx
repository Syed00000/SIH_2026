import React from 'react';
import { RotateCcw, ChevronDown, FileDown, ArrowRight } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../data/governmentConstants.js';
import { PROBLEM_CATEGORIES, SEVERITY_LEVELS } from '../../data/gisConstants.js';
import { DistrictSearchAutocomplete } from './DistrictSearchAutocomplete.jsx';

export const GisFilterBar = ({
  viewType,
  setViewType,
  selectedCategory,
  setSelectedCategory,
  selectedDistrict,
  setSelectedDistrict,
  selectedSeverity,
  setSelectedSeverity,
  searchQuery,
  setSearchQuery,
  onResetFilters,
  onOpenDetailedReport
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-2xs p-3.5 mb-3">
      <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            GIS Map – Problem Region Analysis
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Authorized spatial visualization & analytics for 24 Jharkhand administrative districts
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenDetailedReport}
          className="flex items-center gap-2 bg-[#007A61] hover:bg-[#00624e] text-white rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer group shrink-0"
        >
          <FileDown className="w-4 h-4" />
          <span>Generate Report</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-end">
        {/* View Type */}
        <div className="lg:col-span-2 space-y-1">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            View Type
          </label>
          <div className="relative">
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 pr-8 focus:outline-none focus:border-[#007A61] cursor-pointer"
            >
              <option value="heat_map">Problem Heat Map</option>
              <option value="markers">Problem Markers</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Problem Category */}
        <div className="lg:col-span-2 space-y-1">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Problem Category
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 pr-8 focus:outline-none focus:border-[#007A61] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {PROBLEM_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* District */}
        <div className="lg:col-span-2 space-y-1">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            District
          </label>
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSearchQuery(e.target.value === 'All Districts' ? '' : e.target.value);
              }}
              className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 pr-8 focus:outline-none focus:border-[#007A61] cursor-pointer"
            >
              <option value="All Districts">All Districts (Statewide)</option>
              {JHARKHAND_DISTRICTS_LIST.map((dist) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Severity Level */}
        <div className="lg:col-span-2 space-y-1">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Severity Level
          </label>
          <div className="relative">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 pr-8 focus:outline-none focus:border-[#007A61] cursor-pointer"
            >
              {SEVERITY_LEVELS.map((sev) => (
                <option key={sev.id} value={sev.id}>{sev.label}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Search District / Region Autocomplete */}
        <div className="lg:col-span-3">
          <DistrictSearchAutocomplete
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectDistrict={setSelectedDistrict}
          />
        </div>

        {/* Reset Filters */}
        <div className="lg:col-span-1">
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full flex items-center justify-center space-x-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl py-2 px-2 text-xs font-bold transition-all cursor-pointer"
            title="Reset All Filters"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GisFilterBar;
