import React from 'react';
import { Youtube, Linkedin, Instagram, ChevronUp, ArrowUp } from 'lucide-react';
import footerSunsetBg from '../../assets/footer_sunset_bg.png';
import jharkhandDeptLogo from '../../assets/jharkhand_dept_logo.png';
import indiaGovLogo from '../../assets/india_gov_logo.png';
import digitalIndiaLogo from '../../assets/digital_india_logo.png';

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
              <div className="shrink-0 flex flex-col items-center bg-white p-1.5 rounded-sm shadow-md">
                <img src={jharkhandDeptLogo} alt="Jharkhand Govt Logo" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
              </div>
              <div>
                <p className="text-[11px] font-normal text-gray-200 leading-tight">Government of Jharkhand</p>
                <h3 className="text-[14px] sm:text-[15px] font-bold text-white tracking-tight leading-tight mt-0.5">
                  Department of Higher and Technical Education
                </h3>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3.5 mt-3.5 pl-1">
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-white hover:text-red-400 transition-colors">
                <Youtube className="w-5 h-5 fill-current" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-white hover:text-blue-400 transition-colors">
                <Linkedin className="w-4 h-4 fill-current" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-white hover:text-gray-300 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white hover:text-pink-400 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
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
                <li><a href="#programs" className="hover:text-white hover:underline transition-colors">Report a Problem</a></li>
                <li><a onClick={() => handleNav('/industry')} className="cursor-pointer hover:text-white hover:underline transition-colors">Explore Challenges</a></li>
              </ul>
            </div>

            {/* Important Links */}
            <div>
              <h4 className="font-bold text-white text-[12px] tracking-wide mb-2">Important Links</h4>
              <ul className="space-y-1 text-[11px] text-gray-200">
                <li><a href="#institutions" className="hover:text-white hover:underline transition-colors">Institutions</a></li>
                <li><a onClick={() => handleNav('/industry')} className="cursor-pointer hover:text-white hover:underline transition-colors">Industry</a></li>
                <li><a onClick={() => handleNav('/impact')} className="cursor-pointer hover:text-white hover:underline transition-colors">Impact</a></li>
                <li><a href="#gallery" className="hover:text-white hover:underline transition-colors">Gallery</a></li>
                <li><a href="#contact" className="hover:text-white hover:underline transition-colors">Contact</a></li>
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

          {/* 3. Right Side: India.gov.in + Digital India + Sabka Saath Slogan */}
          <div className="flex flex-wrap items-center gap-6 lg:gap-8 border-l border-white/20 pl-6 lg:pl-8">
            
            {/* India.gov.in Portal */}
            <div className="flex items-center gap-2.5">
              <div className="bg-white px-2 py-1 rounded-sm shadow-sm flex items-center justify-center h-11 md:h-12">
                <img src={indiaGovLogo} alt="India.gov.in" className="h-full w-auto object-contain mix-blend-multiply" />
              </div>
            </div>

            {/* Digital India Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-white px-2 py-1 rounded-sm shadow-sm flex items-center justify-center h-11 md:h-12">
                <img src={digitalIndiaLogo} alt="Digital India" className="h-full w-auto object-contain mix-blend-multiply" />
              </div>
            </div>

            {/* Slogan with Indian Flag Ribbon */}
            <div className="flex flex-col items-start pl-2">
              <div className="font-serif italic font-bold text-white text-[14px] sm:text-[15px] leading-[1.15] tracking-wide select-none drop-shadow-sm">
                <p>Sabka Saath</p>
                <p>Sabka Vikas</p>
                <p>Sabka Vishwas</p>
                <p>Sabka Prayas</p>
              </div>
              {/* Tricolor underline ribbon */}
              <div className="w-20 h-1 mt-1.5 flex rounded-full overflow-hidden shadow-xs">
                <div className="w-1/3 bg-[#FF9933]"></div>
                <div className="w-1/3 bg-white"></div>
                <div className="w-1/3 bg-[#138808]"></div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Sub-footer Bar */}
      <div className="relative z-10 w-full bg-[#021811]/95 border-t border-white/10 px-4 md:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-gray-300">
        <div>
          © 2026 JoharSethu. All rights reserved.
        </div>
        
        <div>
          Government of Jharkhand
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right leading-tight">
            <span className="block text-gray-400">सबका झारखंड, समृद्ध झारखंड</span>
          </div>

          <span className="text-gray-500">|</span>

          {/* Scroll to Top button */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
            className="flex flex-col items-center justify-center text-teal-200 hover:text-white transition-all cursor-pointer"
          >
            <ArrowUp className="w-4 h-4 mb-0.5" />
            <span className="text-[8px] uppercase tracking-wider font-bold">Back to Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
