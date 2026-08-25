import React from 'react';

export const GovernmentFooter = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200/90 px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px] flex-shrink-0 z-20 shadow-xs">
      <div className="font-medium text-slate-500">
        © 2026 Government of Jharkhand. All rights reserved.
      </div>

      <div className="flex items-center space-x-6 text-slate-600 font-medium">
        <a href="#privacy" className="hover:text-slate-900 transition-colors">
          Privacy Policy
        </a>
        <a href="#terms" className="hover:text-slate-900 transition-colors">
          Terms & Conditions
        </a>
        <a href="#accessibility" className="hover:text-slate-900 transition-colors">
          Accessibility
        </a>
        <a href="#contact" className="hover:text-slate-900 transition-colors">
          Contact Us
        </a>
      </div>
    </footer>
  );
};

export default GovernmentFooter;
