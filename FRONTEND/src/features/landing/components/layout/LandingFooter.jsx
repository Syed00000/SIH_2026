import React from 'react';
import { Youtube, Linkedin, Instagram, ChevronUp, ArrowUp } from 'lucide-react';
import footerSunsetBg from '../../assets/footer_sunset_bg.png';
import jharkhandDeptLogo from '../../assets/jharkhand_dept_logo.png';
import jharkhandSeal from '../../assets/jharkhand_seal_transparent.png';
import satyamevaJayate from '../../assets/satyameva_jayate_transparent.png';

export const LandingFooter = ({ onNavigate }) => {
  const handleNav = (path) => {
    if (onNavigate) onNavigate(path);
    else window.location.href = path;
  };

  return (
    <footer className="relative bg-[#04281e] text-gray-200 overflow-hidden text-xs">
      {/* Panoramic Sunset Mountain Background with Deep Emerald Green Atmospheric Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={footerSunsetBg} 
          alt="Sunset Landscape Background" 
          className="w-full h-full object-cover object-center brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#03231a]/95 via-[#043325]/85 to-[#03231a]/95" />
      </div>

      <div className="relative z-10 w-full px-4 md:px-6 lg:px-8 pt-7 pb-5">
        {/* Main Grid: Left Emblem/Govt + 3 Link Columns + Right Portals & Slogan */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 xl:gap-8 pb-5 border-b border-white/10">
          
          {/* 1. Left Column: National Emblem + Ministry of Education + Social Icons */}
          <div className="shrink-0 flex flex-col justify-between max-w-sm">
            <div className="flex items-center gap-3.5">
              {/* Jharkhand Department Logo */}
              <div className="shrink-0 flex flex-col items-center">
                <img src={jharkhandDeptLogo} alt="Jharkhand Govt Logo" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
              </div>
              <div>
                <p className="text-[11px] font-normal text-gray-200 leading-tight">Government of Jharkhand</p>
                <h3 className="text-[14px] sm:text-[15px] font-bold text-white tracking-tight leading-tight mt-0.5">
                  Department of Higher and Technical Education
                </h3>
              </div>
            </div>


          </div>

          {/* 2. Middle Columns: Quick Links, Resources, Support (with thin vertical separator) */}
          <div className="grid grid-cols-3 gap-6 sm:gap-8 lg:gap-10 border-l border-white/20 pl-6 lg:pl-8">
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white text-[12px] tracking-wide mb-2">Quick Links</h4>
              <ul className="space-y-1 text-[11px] text-gray-200">
                <li><a onClick={() => handleNav('/')} className="cursor-pointer hover:text-white hover:underline transition-colors">Home</a></li>
                <li><a onClick={() => handleNav('/about')} className="cursor-pointer hover:text-white hover:underline transition-colors">About Us</a></li>
                <li><a onClick={() => handleNav('/login')} className="cursor-pointer hover:text-white hover:underline transition-colors">Report a Problem</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="cursor-default text-gray-400">Explore Challenges</a></li>
              </ul>
            </div>

            {/* Important Links */}
            <div>
              <h4 className="font-bold text-white text-[12px] tracking-wide mb-2">Important Links</h4>
              <ul className="space-y-1 text-[11px] text-gray-200">
                <li><a onClick={() => handleNav('/institutions')} className="cursor-pointer hover:text-white hover:underline transition-colors">Institutions</a></li>
                <li><a onClick={() => handleNav('/industry')} className="cursor-pointer hover:text-white hover:underline transition-colors">Industry</a></li>
                <li><a onClick={() => handleNav('/impact')} className="cursor-pointer hover:text-white hover:underline transition-colors">Impact</a></li>
                <li><a onClick={() => handleNav('/about-jharkhand')} className="cursor-pointer hover:text-white hover:underline transition-colors">About Jharkhand</a></li>
                <li><a onClick={() => handleNav('/contact')} className="cursor-pointer hover:text-white hover:underline transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-white text-[12px] tracking-wide mb-2">Support</h4>
              <ul className="space-y-1 text-[11px] text-gray-200">
                <li><a href="#help" className="hover:text-white hover:underline transition-colors">Help Center</a></li>
                <li><a href="#faqs" className="hover:text-white hover:underline transition-colors">FAQs</a></li>
                <li><a href="#grievance" className="hover:text-white hover:underline transition-colors">Grievance Redressal</a></li>
                <li><a href="#terms" className="hover:text-white hover:underline transition-colors">Terms of Use</a></li>
                <li><a href="#privacy" className="hover:text-white hover:underline transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          {/* 3. Right Side: Logos */}
          <div className="flex flex-wrap items-center gap-6 border-l border-white/20 pl-6 lg:pl-8">
            <div className="flex items-center justify-center h-14 w-14">
              <img src={jharkhandSeal} alt="Government of Jharkhand" className="h-full w-full object-contain" />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Sub-footer Bar */}
      <div className="relative z-10 w-full bg-[#021811]/95 border-t border-white/10 px-4 md:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-gray-300">
        <div>
          © 2026 JoharSetu. All rights reserved.
        </div>
        
        <div>
          Government of Jharkhand
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right leading-tight">
            <span className="block text-gray-400">सबका झारखंड, समृद्ध झारखंड</span>
          </div>


        </div>
      </div>
    </footer>
  );
};
