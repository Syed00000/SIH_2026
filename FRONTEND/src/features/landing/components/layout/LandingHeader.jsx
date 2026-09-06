import React from 'react';
import { LogIn, Trophy, UserPlus } from 'lucide-react';

export const LandingHeader = ({ onNavigate, currentPath = '/' }) => {
  const handleNav = (path) => {
    if (onNavigate) onNavigate(path);
    else window.location.href = path;
  };

  const isCurrent = (path) => currentPath === path;

  const handleZoom = (level) => {
    if (level === 'sm') {
      document.documentElement.style.fontSize = '90%';
    } else if (level === 'md') {
      document.documentElement.style.fontSize = '100%';
    } else if (level === 'lg') {
      document.documentElement.style.fontSize = '110%';
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#1a1a1a] text-white text-[10px] md:text-[11px] py-1.5 z-50 relative border-b border-black">
        <div className="w-full px-4 md:px-8 lg:px-12 flex flex-row justify-between items-center font-medium">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              <span className="tracking-wide font-bold">GOVERNMENT OF JHARKHAND</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-wrap justify-end">
             <div className="flex items-center space-x-2">
               <button onClick={() => handleZoom('sm')} className="hover:text-gray-300 transition-colors font-bold px-1 cursor-pointer">A-</button>
               <button onClick={() => handleZoom('md')} className="hover:text-gray-300 transition-colors font-bold px-1 cursor-pointer">A</button>
               <button onClick={() => handleZoom('lg')} className="hover:text-gray-300 transition-colors font-bold px-1 cursor-pointer">A+</button>
             </div>
             <span className="text-gray-600">|</span>
             <button onClick={() => handleNav('/register')} className="flex items-center space-x-1.5 hover:text-gray-300 transition-colors cursor-pointer">
               <UserPlus className="w-3.5 h-3.5 text-gray-300" /> <span>Register</span>
             </button>
             <span className="text-gray-600">|</span>
             <button onClick={() => handleNav('/login')} className="flex items-center space-x-1.5 hover:text-gray-300 transition-colors cursor-pointer">
               <LogIn className="w-3.5 h-3.5 text-gray-300" /> <span>Login</span>
             </button>
             <span className="text-gray-600">|</span>
             <button onClick={() => handleNav('/apply-industry')} className="flex items-center space-x-1.5 hover:text-gray-300 transition-colors cursor-pointer">
               <Trophy className="w-3.5 h-3.5 text-gray-300" /> <span>Industry Login</span>
             </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-gray-200">
        <div className="w-full px-4 md:px-8 lg:px-12 py-1 flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNav('/')}>
             <img src="https://www.jharkhand.gov.in/images/jhlogo55.PNG" alt="Johar Sethu" className="h-[46px] w-[46px] object-contain" />
             <div className="ml-2 flex flex-col justify-center">
               <h1 className="text-[20px] font-black text-gray-800 tracking-tight leading-none mb-1">JOHAR SETHU</h1>
               <p className="text-[10px] font-bold text-[#0f4b3a] leading-none mb-0.5">People • Ideas • Innovation • A Stronger Jharkhand</p>
               <p className="text-[9px] font-medium text-gray-500 leading-none">A Government of Jharkhand Initiative</p>
             </div>
          </div>

          <div className="flex items-center ml-auto">
            <nav className="hidden xl:flex items-center space-x-7 font-bold text-[12px] text-gray-600">
              <a onClick={() => handleNav('/')} className={`cursor-pointer transition-colors border-b-[3px] pb-1.5 ${isCurrent('/') ? 'text-[#0f4b3a] border-[#0f4b3a]' : 'border-transparent hover:border-[#0f4b3a] hover:text-[#0f4b3a]'}`}>HOME</a>
              <a onClick={() => handleNav('/about')} className={`cursor-pointer transition-colors border-b-[3px] pb-1.5 ${isCurrent('/about') ? 'text-[#0f4b3a] border-[#0f4b3a]' : 'border-transparent hover:border-[#0f4b3a] hover:text-[#0f4b3a]'}`}>ABOUT</a>
              <a onClick={() => handleNav('/login')} className="cursor-pointer hover:text-[#0f4b3a] transition-colors border-b-[3px] border-transparent hover:border-[#0f4b3a] pb-1.5">REPORT A PROBLEM</a>
              <a onClick={() => handleNav('/institutions')} className={`cursor-pointer transition-colors border-b-[3px] pb-1.5 ${isCurrent('/institutions') ? 'text-[#0f4b3a] border-[#0f4b3a]' : 'border-transparent hover:border-[#0f4b3a] hover:text-[#0f4b3a]'}`}>INSTITUTIONS</a>
              <a onClick={() => handleNav('/industry')} className={`cursor-pointer transition-colors border-b-[3px] pb-1.5 ${isCurrent('/industry') ? 'text-[#0f4b3a] border-[#0f4b3a]' : 'border-transparent hover:border-[#0f4b3a] hover:text-[#0f4b3a]'}`}>INDUSTRY</a>
              <a onClick={() => handleNav('/impact')} className={`cursor-pointer transition-colors border-b-[3px] pb-1.5 ${isCurrent('/impact') ? 'text-[#0f4b3a] border-[#0f4b3a]' : 'border-transparent hover:border-[#0f4b3a] hover:text-[#0f4b3a]'}`}>IMPACT</a>
              <a href="#contact" className="hover:text-[#0f4b3a] transition-colors border-b-[3px] border-transparent hover:border-[#0f4b3a] pb-1.5">CONTACT</a>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default LandingHeader;
