import React from 'react';

export const DashboardFooter = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 px-4 md:px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px] flex-shrink-0 z-20 shadow-xs">
      {/* Govt Identity */}
      <div className="flex items-center space-x-2">
        <img
          src="https://www.jharkhand.gov.in/images/jhlogo55.PNG"
          alt="Government of Jharkhand Logo"
          className="w-4.5 h-4.5 object-contain"
        />
        <div className="flex items-center space-x-1.5 flex-wrap">
          <span className="font-bold text-slate-800">Government of Jharkhand</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600">Department of Higher and Technical Education</span>
        </div>
      </div>

      {/* Copyright */}
      <div className="font-semibold text-slate-600">
        &copy; 2026 JOHARSETU. All rights reserved.
      </div>

      {/* Legal Links */}
      <div className="flex items-center space-x-3 text-slate-600 font-medium">
        <a href="#privacy" className="hover:text-slate-900 transition-colors">
          Privacy Policy
        </a>
        <span className="text-slate-300">|</span>
        <a href="#terms" className="hover:text-slate-900 transition-colors">
          Terms & Conditions
        </a>
        <span className="text-slate-300">|</span>
        <a href="#accessibility" className="hover:text-slate-900 transition-colors">
          Accessibility
        </a>
        <span className="text-slate-300">|</span>
        <a href="#contact" className="hover:text-slate-900 transition-colors">
          Contact Us
        </a>
      </div>
    </footer>
  );
};

export default DashboardFooter;
