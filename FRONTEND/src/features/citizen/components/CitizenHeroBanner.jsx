import React from 'react';
import { Plus } from 'lucide-react';
import heroBannerImg from '../assets/hero_banner.jpg';

export const CitizenHeroBanner = ({ onSubmitClick }) => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#065f46] text-white p-5 md:p-6 shadow-xs border border-emerald-700/30">
      {/* Background illustration / watermark */}
      <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-30 md:opacity-40 pointer-events-none mix-blend-screen overflow-hidden">
        <img
          src={heroBannerImg}
          alt="Innovation illustration"
          className="w-full h-full object-cover object-center transform scale-110"
        />
      </div>

      <div className="relative z-10 max-w-[65%] sm:max-w-[70%] space-y-2.5">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight leading-snug">
            Your Challenge <br />
            <span className="text-emerald-100">Innovation for a Better Jharkhand</span>
          </h2>
          <p className="text-xs md:text-sm text-emerald-100/90 font-medium mt-1 leading-relaxed">
            Submit problems. Inspire solutions. Create impact.
          </p>
        </div>

        <div className="pt-1">
          <button
            onClick={onSubmitClick}
            className="inline-flex items-center space-x-1.5 bg-[#059669] hover:bg-[#047857] active:scale-95 text-white text-xs md:text-sm font-bold px-4 py-2 rounded-lg shadow-2xs transition-all duration-200 cursor-pointer border border-emerald-400/40"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Submit a Challenge</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitizenHeroBanner;
