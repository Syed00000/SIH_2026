import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const CitizenThemedSelect = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = (optVal) => {
    onChange(optVal);
    setIsOpen(false);
  };

  const displayLabel = value || placeholder;

  return (
    <div ref={dropdownRef} className={`relative w-full text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-xl text-xs font-medium transition-all shadow-2xs cursor-pointer ${
          isOpen
            ? 'border-[#064e3b] ring-1 ring-[#064e3b] text-slate-900'
            : 'border-slate-200/90 text-slate-900 hover:border-slate-300'
        }`}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ml-2 shrink-0 ${
            isOpen ? 'transform rotate-180 text-emerald-800' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-200/90 rounded-xl shadow-xl p-1.5 max-h-56 overflow-y-auto space-y-0.5 custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            const isSelected = value === optVal;

            return (
              <button
                type="button"
                key={optVal}
                onClick={() => handleSelect(optVal)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#064e3b] text-white font-bold shadow-2xs'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950'
                }`}
              >
                <span className="truncate">{optLabel}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CitizenThemedSelect;
