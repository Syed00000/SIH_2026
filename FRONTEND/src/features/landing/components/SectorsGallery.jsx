import React from 'react';
import sectorEducation from '../assets/sector_education.png';
import sectorHealthcare from '../assets/sector_healthcare.jpg';
import sectorAgriculture from '../assets/sector_agriculture.jpg';
import sectorWater from '../assets/sector_water.jpg';
import sectorEnvironment from '../assets/sector_environment.jpg';
import sectorRuralDev from '../assets/sector_rural_dev.jpg';
import sectorUrbanInfra from '../assets/sector_urban_infra.jpg';
import sectorRuralLivelihood from '../assets/sector_rural_livelihood.jpg';

const SECTORS = [
  { name: "Education", img: sectorEducation },
  { name: "Healthcare", img: sectorHealthcare },
  { name: "Agriculture", img: sectorAgriculture },
  { name: "Water & Sanitation", img: sectorWater },
  { name: "Environment", img: sectorEnvironment },
  { name: "Rural Development", img: sectorRuralDev },
  { name: "Urban Infrastructure", img: sectorUrbanInfra },
  { name: "Rural Livelihoods", img: sectorRuralLivelihood }
];

export const SectorsGallery = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
        {SECTORS.map((sector, idx) => (
          <div 
            key={idx} 
            className="bg-white border border-gray-200 shadow-2xs rounded-none overflow-hidden flex flex-col group cursor-pointer hover:border-emerald-600 hover:shadow-xs transition-all"
          >
            <div className="w-full aspect-[16/10] overflow-hidden bg-gray-100">
              <img 
                src={sector.img} 
                alt={sector.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
            </div>
            <div className="px-2 py-2 bg-white text-left">
              <span className="text-[11px] sm:text-[11.5px] font-bold text-gray-800 leading-tight group-hover:text-[#0f4b3a] transition-colors truncate block">
                {sector.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectorsGallery;
