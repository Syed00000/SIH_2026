import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../data/governmentConstants.js';

export const DistrictSearchAutocomplete = ({ searchQuery, setSearchQuery, onSelectDistrict }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const containerRef = useRef(null);

  const suggestions = searchQuery.trim()
    ? JHARKHAND_DISTRICTS_LIST.filter(
        (d) => d !== 'All Districts' && d.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (dist) => {
    onSelectDistrict(dist);
    setSearchQuery(dist);
    setIsSearchFocused(false);
  };

  return (
    <div className="relative space-y-1" ref={containerRef}>
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
            if (e.key === 'Enter' && suggestions.length > 0) {
              handleSelect(suggestions[0]);
            }
          }}
          placeholder="Search 24 Districts..."
          className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#007A61]"
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {isSearchFocused && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-48 overflow-y-auto">
          {suggestions.map((dist) => (
            <button
              key={dist}
              type="button"
              onClick={() => handleSelect(dist)}
              className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
            >
              <span>{dist}</span>
              <span className="text-[10px] text-[#007A61] bg-[#007A61]/10 px-1.5 py-0.5 rounded font-bold">Select</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DistrictSearchAutocomplete;
