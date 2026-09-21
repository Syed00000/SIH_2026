import React from 'react';
import bannerImage from '../../../landing/assets/report-banner.png';

export const LoginHeroBanner = () => {
  return (
    <section className="w-full relative h-[320px] sm:h-[380px] md:h-[430px] lg:h-[450px] bg-[#0c382b] overflow-hidden border-b border-gray-200">
      <img 
        src={bannerImage} 
        alt="Report a Problem Banner" 
        className="w-full h-full object-cover object-center" 
      />
      {/* Subtle dark overlay for text contrast if desired */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent flex items-center z-10 px-8 md:px-16 lg:px-24">
        <div className="max-w-xl text-white space-y-2">
          <div className="text-xs md:text-sm font-black text-emerald-300 tracking-widest uppercase">
            PEOPLE | IDEAS | INNOVATION
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight drop-shadow-md">
            JoharSetu Portal
          </h1>
          <p className="text-xs md:text-sm text-gray-100 font-medium leading-relaxed drop-shadow-sm">
            Connecting Community Challenges with Expert Solvers & Real Impact
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginHeroBanner;
