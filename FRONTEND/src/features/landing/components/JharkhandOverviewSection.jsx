import React from 'react';
import { Building2, MapPin, Users, Map, ArrowRight } from 'lucide-react';
import jharkhandLeaf from '../assets/jharkhand_leaf.png';
import jharkhandMapTight from '../assets/jharkhand_map_tight.png';
import leaderRajesh from '../assets/leader-1.png';
import leaderAnil from '../assets/leader-2.png';
import leaderKavita from '../assets/leader-3.png';

export const JharkhandOverviewSection = ({ onNavigate, onOpenDistrictMap }) => {
  const handleNav = (path) => {
    if (onNavigate) onNavigate(path);
    else window.location.href = path;
  };

  const leaders = [
    { name: "Shri Santosh Kumar Gangwar", role: "Governor of Jharkhand", img: leaderRajesh },
    { name: "Shri Hemant Soren", role: "Chief Minister", img: leaderAnil },
    { name: "Shri Avinash Kumar", role: "Chief Secretary", img: leaderKavita }
  ];

  const glanceStats = [
    { label: "Area", value: "79,714 km²", icon: Building2 },
    { label: "Capital City", value: "Ranchi", icon: MapPin },
    { label: "Population", value: "3.29 Crore (Approx.)", icon: Users },
    { label: "Districts", value: "24", icon: Map }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 md:gap-4 mb-3.5 md:mb-4 items-stretch">
      {/* Col 1: Jharkhand The Land of Opportunities */}
      <div className="bg-white rounded-none border border-gray-200/90 shadow-xs p-4 md:p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <img src={jharkhandLeaf} alt="Jharkhand Leaf" className="w-8 h-8 object-contain shrink-0" />
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#1e3a8a] leading-tight tracking-tight">Jharkhand</h3>
              <p className="text-xs sm:text-[13px] font-bold text-[#0f4b3a] leading-tight mt-0.5">The Land of Opportunities</p>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed text-justify mt-2">
            Jharkhand ("The land of forest") is a State in eastern India, created on 15 November 2000. It is known for its rich natural resources, diverse culture, waterfalls, hills and vibrant communities. With its people, potential and partnerships, Jharkhand is moving towards an innovative and inclusive future.
          </p>
        </div>

        <div className="mt-4 pt-1">
          <button 
            onClick={() => handleNav('/about-jharkhand')}
            className="px-4 py-1.5 rounded-none border border-[#0f4b3a] text-[#0f4b3a] text-[11px] sm:text-xs font-bold hover:bg-[#0f4b3a] hover:text-white transition-colors inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            Know More About Jharkhand <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Col 2: Our Leadership */}
      <div className="bg-white rounded-none border border-gray-200/90 shadow-xs p-4 md:p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 mb-3">
          <div className="flex items-center gap-2">
            <div className="text-[#0f4b3a]">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M4 4v16h2V4H4zm4 0v16h2V4H8zm4 0v16h2V4h-2zm4 2v14h4V6h-4z" />
              </svg>
            </div>
            <h3 className="text-[15px] md:text-base font-bold text-[#0f4b3a] tracking-tight">Our Leadership</h3>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 md:gap-3 flex-grow items-stretch">
          {leaders.map((leader, idx) => (
            <div key={idx} className="flex flex-col items-center text-center h-full">
              <div className="w-full bg-[#f1f3f5] rounded-none overflow-hidden flex items-center justify-center p-1 h-20 md:h-24">
                <img src={leader.img} alt={leader.name} className="w-full h-full object-cover object-top" />
              </div>
              <h4 className="font-bold text-[11px] sm:text-xs text-gray-900 mt-2 leading-tight">{leader.name}</h4>
              <p className="text-[9px] sm:text-[10px] text-gray-500 leading-tight mt-0.5">{leader.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Col 3: Jharkhand at a Glance */}
      <div className="bg-white rounded-none border border-gray-200/90 shadow-xs p-4 md:p-5 flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div 
            onClick={onOpenDistrictMap}
            className="w-full sm:w-1/2 flex items-center justify-center cursor-pointer group relative"
            title="Click to open interactive GPS District Map"
          >
            <img 
              src={jharkhandMapTight} 
              alt="Jharkhand District Map" 
              className="max-h-[175px] w-auto max-w-full object-contain group-hover:scale-105 transition-transform duration-300" 
            />
            <span className="absolute bottom-1 bg-[#0f4b3a]/90 text-white text-[9.5px] font-extrabold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
              Click to Open Map 🗺️
            </span>
          </div>

          <div className="w-full sm:w-1/2 flex flex-col justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#1e3a8a] tracking-tight mb-3">
                Jharkhand at a Glance
              </h3>
              <div className="space-y-2 text-[11px] sm:text-[11.5px] text-gray-800">
                {glanceStats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[#0f4b3a] shrink-0" />
                      <span><strong className="font-semibold text-gray-900">{stat.label} :</strong> {stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-1">
          <button 
            onClick={onOpenDistrictMap}
            className="w-full py-1.5 px-3 rounded-none border border-[#0f4b3a] text-[#0f4b3a] text-[11px] sm:text-xs font-bold hover:bg-[#0f4b3a] hover:text-white transition-colors inline-flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            View District Map <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JharkhandOverviewSection;
