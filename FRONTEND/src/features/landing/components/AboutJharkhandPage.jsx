import React, { useState } from 'react';
import { LandingLayout } from './layout/LandingLayout.jsx';
import { Leaf, MapPin, Users, Map, Building2, TrendingUp, Handshake, Sun, ArrowRight, TreePine, MountainSnow, Factory } from 'lucide-react';
import imgNaturalResources from '../assets/jh_natural_resources.jpg';
import imgRichCulture from '../assets/jh_rich_culture.jpg';
import imgGrowingOpps from '../assets/jh_growing_opps.jpg';
import imgSustainableFuture from '../assets/jh_sustainable_future.jpg';
import imgHundruFalls from '../assets/jh_hundru_falls.jpg';
import imgDassamFalls from '../assets/jh_dassam_falls.jpg';
import imgBetla from '../assets/jh_betla.jpg';
import imgParasnath from '../assets/jh_parasnath.jpg';

export const AboutJharkhandPage = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = [
    'Overview', 'At a Glance', 'Geography', 'People & Culture', 'Economy', 'Key Attractions', 'Vision for the Future'
  ];

  const highlights = [
    {
      title: "Natural Resources",
      desc: "Abundant minerals, forests, water resources and biodiversity.",
      img: imgNaturalResources
    },
    {
      title: "Rich Culture",
      desc: "A blend of tribal heritage, festivals, art, music and traditions.",
      img: imgRichCulture
    },
    {
      title: "Growing Opportunities",
      desc: "Expanding scope in education, industry, infrastructure and innovation.",
      img: imgGrowingOpps
    },
    {
      title: "Sustainable Future",
      desc: "Committed to inclusive development and a better tomorrow.",
      img: imgSustainableFuture
    }
  ];

  const attractions = [
    { name: "Hundru Falls", location: "Ranchi", img: imgHundruFalls },
    { name: "Dassam Falls", location: "Ranchi", img: imgDassamFalls },
    { name: "Betla National Park", location: "Latehar", img: imgBetla },
    { name: "Parasnath Hill", location: "Giridih", img: imgParasnath }
  ];

  return (
    <LandingLayout onNavigate={onNavigate} currentPath="/about-jharkhand">
      {/* Hero Section */}
      <section className="w-full relative min-h-[450px] md:min-h-[500px] flex items-center overflow-hidden bg-[#0c382b]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80&w=1600" 
            alt="Jharkhand Waterfall" 
            className="w-full h-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c382b] via-[#0c382b]/80 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-3/5 text-white">
            <div className="flex items-center gap-4 mb-2 ml-1 md:ml-2">
              <Leaf className="w-10 h-10 md:w-12 md:h-12 text-green-400 shrink-0" strokeWidth={2.5} />
              <h1 className="text-4xl md:text-5xl lg:text-[60px] font-black tracking-tight leading-tight">
                Jharkhand
              </h1>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white/90">
              The Land of Opportunities
            </h2>
            <p className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed mb-8 font-medium">
              A state of rich natural resources, vibrant culture, skilled youth and emerging opportunities, Jharkhand is moving towards an innovative, inclusive and sustainable future.
            </p>
          </div>
        </div>
      </section>



      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
        
        {/* About & At a Glance */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mb-16">
          {/* Left: About */}
          <div className="w-full lg:w-1/2">
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="w-6 h-6 text-[#0f4b3a]" />
              <h2 className="text-2xl md:text-3xl font-black text-[#0f4b3a] tracking-tight">About Jharkhand</h2>
              <div className="h-px bg-gray-200 flex-1 ml-4"></div>
            </div>
            <p className="text-gray-600 text-[15px] leading-relaxed mb-6 font-medium text-justify">
              Jharkhand ("The land of forest") is a state in eastern India, created on 15 November 2000. It is known for its rich natural resources, diverse culture, waterfalls, hills and vibrant communities. With its people, potential and partnerships, Jharkhand is moving towards an innovative and inclusive future.
            </p>
            <blockquote className="border-l-4 border-[#0f4b3a] pl-4 py-1 italic text-gray-700 font-semibold text-[15px]">
              "A land of natural wealth, cultural heritage and limitless opportunities."
            </blockquote>
          </div>

          {/* Right: At a Glance Stats */}
          <div className="w-full lg:w-1/2 bg-[#f0f9f5] rounded-xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-[#0f4b3a] mb-6">Jharkhand at a Glance</h3>
            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-[#0f4b3a] shrink-0 mt-0.5" />
                <div>
                  <div className="text-lg font-bold text-gray-900 leading-none mb-1">25</div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Districts</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-[#0f4b3a] shrink-0 mt-0.5" />
                <div>
                  <div className="text-lg font-bold text-gray-900 leading-none mb-1">3.3+ Crore</div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Population</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Map className="w-6 h-6 text-[#0f4b3a] shrink-0 mt-0.5" />
                <div>
                  <div className="text-lg font-bold text-gray-900 leading-none mb-1">79,714 km²</div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Area</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MountainSnow className="w-6 h-6 text-[#0f4b3a] shrink-0 mt-0.5" />
                <div>
                  <div className="text-lg font-bold text-gray-900 leading-none mb-1">Rich</div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Mineral Resources</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-[#0f4b3a] shrink-0 mt-0.5" />
                <div>
                  <div className="text-lg font-bold text-gray-900 leading-none mb-1">Diverse</div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tribal Culture</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Factory className="w-6 h-6 text-[#0f4b3a] shrink-0 mt-0.5" />
                <div>
                  <div className="text-lg font-bold text-gray-900 leading-none mb-1">Growing</div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Industrial Base</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Highlights */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-6 h-6 text-[#0f4b3a]" />
            <h2 className="text-2xl md:text-3xl font-black text-[#0f4b3a] tracking-tight">Key Highlights</h2>
            <div className="h-px bg-gray-200 flex-1 ml-4"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden group hover:shadow-md transition-shadow">
                <div className="h-32 overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-bold text-[#0f4b3a] mb-1.5">{item.title}</h4>
                  <p className="text-[12px] text-gray-600 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Attractions */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <MapPin className="w-6 h-6 text-[#0f4b3a]" />
            <h2 className="text-2xl md:text-3xl font-black text-[#0f4b3a] tracking-tight">Popular Attractions</h2>
            <div className="h-px bg-gray-200 flex-1 ml-4"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {attractions.map((item, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="h-28 md:h-36 rounded-lg overflow-hidden mb-3 bg-gray-100 border border-gray-200 shadow-xs">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="text-center">
                  <h4 className="text-[13px] font-bold text-gray-900 group-hover:text-[#0f4b3a] transition-colors leading-tight">{item.name}</h4>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </LandingLayout>
  );
};
