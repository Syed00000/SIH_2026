import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  RotateCcw,
  ChevronDown,
  Layers,
  Check,
  AlertTriangle,
  FileDown,
  ArrowRight
} from 'lucide-react';
import {
  JHARKHAND_DISTRICTS_LIST,
  PROBLEM_CATEGORIES,
  SEVERITY_LEVELS
} from '../../data/jharkhandGisData.js';

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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  // Filter districts based on search query for autocomplete suggestions
  const searchSuggestions = searchQuery.trim()
    ? JHARKHAND_DISTRICTS_LIST.filter(
        (d) =>
          d !== 'All Districts' &&
          d.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (distName) => {
    setSelectedDistrict(distName);
    setSearchQuery(distName);
    setIsSearchFocused(false);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 mb-3">
      {/* Top Title & Subtitle + Report Button */}
      <div className="mb-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            GIS Map – Problem Region Analysis
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Visualize and analyze problem regions across Jharkhand
          </p>
        </div>

        {/* Generate / Download Report — professional CTA */}
        <button
          type="button"
          onClick={onOpenDetailedReport}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl px-4 py-2.5 text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer group shrink-0 select-none"
          title="Open detailed district report (printable / downloadable)"
        >
          <FileDown className="w-4 h-4" />
          <span>Generate Report</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Filter Row with 5 Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-end">
        {/* 1. View Type Select */}
        <div className="lg:col-span-2 space-y-1">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            View Type
          </label>
          <div className="relative">
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer shadow-2xs"
            >
              <option value="heat_map">Problem Heat Map</option>
              <option value="choropleth">Severity Choropleth</option>
              <option value="hotspots_only">Problem Hotspots Only</option>
              <option value="density">Density Cluster View</option>
              <option value="satellite">Satellite Hybrid</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 2. Problem Category Select */}
        <div className="lg:col-span-2 space-y-1">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Problem Category
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer shadow-2xs"
            >
              <option value="all">All Categories</option>
              {PROBLEM_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 3. District Select */}
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
              className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer shadow-2xs"
            >
              {JHARKHAND_DISTRICTS_LIST.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 4. Severity Level Select */}
        <div className="lg:col-span-2 space-y-1">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Severity Level
          </label>
          <div className="relative">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer shadow-2xs"
            >
              {SEVERITY_LEVELS.map((sev) => (
                <option key={sev.id} value={sev.id}>
                  {sev.label} {sev.range ? `(${sev.range})` : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 5. Search District / Region Input with Autocomplete */}
        <div className="lg:col-span-3 relative space-y-1" ref={searchContainerRef}>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Search District / Region
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchSuggestions.length > 0) {
                  handleSelectSuggestion(searchSuggestions[0]);
                }
              }}
              placeholder="Search District / Region..."
              className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {isSearchFocused && searchSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-48 overflow-y-auto">
              {searchSuggestions.map((dist) => (
                <button
                  key={dist}
                  type="button"
                  onClick={() => handleSelectSuggestion(dist)}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>{dist}</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-bold">
                    Select
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 6. Reset Filters Button */}
        <div className="lg:col-span-1">
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full flex items-center justify-center space-x-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl py-2 px-2 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
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
