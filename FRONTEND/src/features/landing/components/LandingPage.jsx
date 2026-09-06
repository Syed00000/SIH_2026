import React from 'react';
import { 
  Search, MapPin, Building2, Users, Lightbulb, Trophy, 
  FileText, ChevronRight, ChevronUp, Download, Map, Cloud, Brain, 
  MessagesSquare, LineChart, Heart, Youtube, Linkedin, 
  Twitter, Instagram, User, LogIn, ArrowRight, ArrowUp, PieChart, Factory,
  Megaphone, Pause, Monitor, Star, BarChart3, GraduationCap, Settings,
  Droplet, Bus, Pin, Recycle, Sprout
} from 'lucide-react';
import heroBanner from '../assets/landing-banner.png';
import footerSunsetBg from '../assets/footer_sunset_bg.png';
import leaderRajesh from '../assets/leader-1.png';
import leaderAnil from '../assets/leader-2.png';
import leaderKavita from '../assets/leader-3.png';
import quoteCardBg from '../assets/quote_card_bg.png';
import indiaMapGraphic from '../assets/india_map_graphic.png';
import jharkhandLeaf from '../assets/jharkhand_leaf.png';
import jharkhandMapTight from '../assets/jharkhand_map_tight.png';

// New Logos
import jharkhandDeptLogo from '../assets/jharkhand_dept_logo.png';
import indiaGovLogo from '../assets/india_gov_logo.png';
import digitalIndiaLogo from '../assets/digital_india_logo.png';

import { LandingLayout } from './layout/LandingLayout';

// Update thumbnails
import updateMeet from '../assets/update_meet.png';
import updateStories from '../assets/update_stories.png';
import updateYouth from '../assets/update_youth.png';
import updateCollab from '../assets/update_collab.png';

// Sector images
import sectorEducation from '../assets/sector_education.png';
import sectorHealthcare from '../assets/sector_healthcare.png';
import sectorAgriculture from '../assets/sector_agriculture.png';
import sectorWater from '../assets/sector_water.png';
import sectorEnvironment from '../assets/sector_environment.png';
import sectorRuralDev from '../assets/sector_rural_dev.png';
import sectorUrbanInfra from '../assets/sector_urban_infra.png';
import sectorRuralLivelihood from '../assets/sector_rural_livelihood.png';

export const LandingPage = ({ onNavigate }) => {
  const handleNav = (path) => {
    if (onNavigate) onNavigate(path);
    else window.location.href = path;
  };

  const challengesList = [
    {
      icon: Droplet,
      iconBg: "bg-blue-600",
      title: "Drinking Water Supply Issue",
      location: "Ranchi District",
      date: "02 Sep 2026",
      isNew: true
    },
    {
      icon: Recycle,
      iconBg: "bg-emerald-600",
      title: "Improved Waste Management System",
      location: "Dhanbad District",
      date: "28 Aug 2026",
      isNew: false
    },
    {
      icon: Sprout,
      iconBg: "bg-green-600",
      title: "Smart Agriculture Solutions",
      location: "Hazaribagh District",
      date: "25 Aug 2026",
      isNew: false
    },
    {
      icon: Bus,
      iconBg: "bg-amber-500",
      title: "Accessible Public Transport",
      location: "Jamshedpur",
      date: "21 Aug 2026",
      isNew: false
    },
    {
      icon: GraduationCap,
      iconBg: "bg-[#1e3a8a]",
      title: "Quality Education in Rural Areas",
      location: "Palamu District",
      date: "18 Aug 2026",
      isNew: false
    },
    {
      icon: Lightbulb,
      iconBg: "bg-teal-600",
      title: "Solar Micro-Grids for Forest Belts",
      location: "Giridih District",
      date: "14 Aug 2026",
      isNew: false
    }
  ];

  const announcementsList = [
    {
      title: "Launch of Johar Sethu Portal",
      isNew: true,
      date: "01 Sep 2026"
    },
    {
      title: "Guidelines for University Participation",
      isNew: false,
      date: "25 Aug 2026"
    },
    {
      title: "Invitation for Industry Partners",
      isNew: false,
      date: "20 Aug 2026"
    },
    {
      title: "District Innovation Workshops",
      isNew: false,
      date: "14 Aug 2026"
    },
    {
      title: "Model Problem Statement Formats",
      isNew: false,
      date: "10 Aug 2026"
    },
    {
      title: "State Youth Innovation Challenge 2026",
      isNew: true,
      date: "04 Sep 2026"
    }
  ];

  const documentsList = [
    { title: "Johar Sethu - Concept Note", size: "(PDF, 1.2 MB)", isNew: true },
    { title: "Citizen User Manual", size: "(PDF, 1.8 MB)", isNew: false },
    { title: "University Participation Guidelines", size: "(PDF, 2.1 MB)", isNew: false },
    { title: "Industry Partnership Framework", size: "(PDF, 1.5 MB)", isNew: false },
    { title: "Frequently Asked Questions (FAQ)", size: "(PDF, 1.0 MB)", isNew: false },
    { title: "Higher Education Policy Framework 2026", size: "(PDF, 3.1 MB)", isNew: false }
  ];

  const updatesList = [
    {
      img: updateMeet,
      title: "State Innovation Meet 2026",
      sub: "Bringing stakeholders together",
      isNew: true
    },
    {
      img: updateStories,
      title: "Success Stories from Jharkhand",
      sub: "Ideas creating real impact",
      isNew: false
    },
    {
      img: updateYouth,
      title: "Youth Innovations for Viksit Jharkhand",
      sub: "Students driving change",
      isNew: false
    },
    {
      img: updateCollab,
      title: "Collaboration with Industries",
      sub: "Stronger partnerships",
      isNew: false
    },
    {
      img: updateMeet,
      title: "Annual Tech Expo Ranchi 2026",
      sub: "Grassroot solutions showcase",
      isNew: false
    }
  ];

  return (
    <LandingLayout onNavigate={onNavigate} currentPath="/">
      {/* Hero Section */}
      <section className="w-full relative bg-[#f8fafc] overflow-hidden">
        <img src={heroBanner} alt="Johar Sethu Hero Banner" className="w-full h-auto object-cover object-center" />
        
        {/* TEXT OVERLAY */}
        <div className="absolute top-[50%] left-[23.5%] -translate-y-1/2 flex flex-col items-start z-10 w-[20%]">
          <p className="text-white text-[0.55vw] font-medium tracking-[0.2em] mb-[0.8vw] opacity-95">
            EDUCATION <span className="mx-[0.3vw] opacity-70">|</span> INNOVATION <span className="mx-[0.3vw] opacity-70">|</span> OPPORTUNITY
          </p>
          
          <h1 className="text-white text-[2vw] font-bold leading-[1.15] mb-[0.8vw] tracking-tight drop-shadow-sm">
            Building a Knowledge<br />Driven New India
          </h1>
          
          <p className="text-white text-[0.65vw] font-medium mb-[1.2vw] opacity-95">
            Accessible Education <span className="mx-[0.3vw] opacity-70">|</span> Inclusive Growth <span className="mx-[0.3vw] opacity-70">|</span> A Brighter Tomorrow
          </p>
          
          <button className="bg-white text-[#0f4b3a] px-[1vw] py-[0.4vw] rounded-none text-[0.6vw] font-black flex items-center hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-md">
            READ MORE <ArrowRight className="ml-[0.3vw] w-[0.8vw] h-[0.8vw]" strokeWidth={3} />
          </button>
        </div>


      </section>

      {/* Latest Announcements Ticker */}
      <section className="w-full bg-[#f8fafc] border-y border-gray-200 h-8 flex items-center relative overflow-hidden z-20">
        
        {/* Left Badge (Fixed) */}
        <div className="absolute left-0 top-0 h-full flex items-center bg-[#f8fafc] z-20 px-4 lg:px-6">
          <div className="bg-[#0f4b3a] text-white px-3 py-1 rounded-none flex items-center gap-1.5 font-bold text-[11px] shadow-sm">
            <Megaphone className="w-3 h-3" />
            Latest Announcements
          </div>
        </div>

        {/* Scrolling Content */}
        <div className="flex-1 h-full flex items-center relative overflow-hidden pl-[210px] pr-[140px]">
          <div className="animate-marquee whitespace-nowrap text-[11px] font-semibold text-gray-800">
            <span>Applications open for National Research Fellowship 2024-25</span>
            <span className="text-gray-400 mx-4">|</span>
            <span>Guidelines for Institution Innovation Council (IIC)</span>
            <span className="text-gray-400 mx-4">|</span>
            <span>Webinar on Future Skills for Young India</span>
            <span className="text-gray-400 mx-4">|</span>
            <span>Academic Calendar 2024-25 Released</span>
            {/* Duplicate for seamless scrolling */}
            <span className="text-gray-400 mx-4">|</span>
            <span>Applications open for National Research Fellowship 2024-25</span>
            <span className="text-gray-400 mx-4">|</span>
            <span>Guidelines for Institution Innovation Council (IIC)</span>
            <span className="text-gray-400 mx-4">|</span>
            <span>Webinar on Future Skills for Young India</span>
            <span className="text-gray-400 mx-4">|</span>
            <span>Academic Calendar 2024-25 Released</span>
          </div>
        </div>

        {/* Right Actions (Fixed) */}
        <div className="absolute right-0 top-0 h-full flex items-center bg-gradient-to-l from-[#f8fafc] via-[#f8fafc] via-80% to-transparent z-20 px-4 lg:px-6 pl-16">
          <button className="text-[#0f4b3a] font-bold text-[11px] flex items-center hover:underline">
            View All <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="w-full relative z-20 bg-white py-2 md:py-3 px-4 lg:px-6">
        <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full">
          
          {/* Report a Problem */}
          <div onClick={() => handleNav('/citizen')} className="flex-1 bg-white border border-gray-200 shadow-xs rounded-none px-4 py-2.5 md:py-3 flex items-center justify-between cursor-pointer hover:bg-[#0f4b3a] hover:border-[#0f4b3a] transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-[#0f4b3a] group-hover:text-white transition-all" />
              <div className="text-left">
                <h3 className="text-[#0f4b3a] group-hover:text-white text-[13px] md:text-[14px] font-bold tracking-tight transition-all">Report a Problem</h3>
                <p className="text-gray-500 group-hover:text-emerald-100/90 text-[9px] md:text-[10px] font-medium mt-0.5 transition-all">Be the Change</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>

          {/* For Universities */}
          <div onClick={() => handleNav('/university')} className="flex-1 bg-white border border-gray-200 shadow-xs rounded-none px-4 py-2.5 md:py-3 flex items-center justify-between cursor-pointer hover:bg-[#0f4b3a] hover:border-[#0f4b3a] transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 md:w-6 md:h-6 text-[#0f4b3a] group-hover:text-white transition-all" />
              <div className="text-left">
                <h3 className="text-[#0f4b3a] group-hover:text-white text-[13px] md:text-[14px] font-bold tracking-tight transition-all">For Universities</h3>
                <p className="text-gray-500 group-hover:text-emerald-100/90 text-[9px] md:text-[10px] font-medium mt-0.5 transition-all">Collaborate <span className="mx-1 opacity-50">|</span> Solve <span className="mx-1 opacity-50">|</span> Grow</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>

          {/* For Industry & Startups */}
          <div onClick={() => handleNav('/login')} className="flex-1 bg-white border border-gray-200 shadow-xs rounded-none px-4 py-2.5 md:py-3 flex items-center justify-between cursor-pointer hover:bg-[#0f4b3a] hover:border-[#0f4b3a] transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-[#0f4b3a] group-hover:text-white transition-all" />
              <div className="text-left">
                <h3 className="text-[#0f4b3a] group-hover:text-white text-[13px] md:text-[14px] font-bold tracking-tight transition-all">For Industry & Startups</h3>
                <p className="text-gray-500 group-hover:text-emerald-100/90 text-[9px] md:text-[10px] font-medium mt-0.5 transition-all">Innovate <span className="mx-1 opacity-50">|</span> Partner <span className="mx-1 opacity-50">|</span> Create Impact</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>

        </div>
      </section>

      {/* 3-Column Main Portal Section */}
      <section className="py-2.5 md:py-3.5 bg-[#fbfcfb] border-b border-gray-100">
        <div className="w-full px-4 lg:px-6">
          
          {/* TOP ROW: 3 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 md:gap-4 mb-3.5 md:mb-4 items-stretch">
            
            {/* Col 1 Top: Jharkhand The Land of Opportunities */}
            <div className="bg-white rounded-none border border-gray-200/90 shadow-xs p-4 md:p-5 flex flex-col justify-between">
              <div>
                {/* Header with Leaf Icon and Title */}
                <div className="flex items-center gap-2.5 mb-2.5">
                  <img src={jharkhandLeaf} alt="Jharkhand Leaf" className="w-8 h-8 object-contain shrink-0" />
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#1e3a8a] leading-tight tracking-tight">Jharkhand</h3>
                    <p className="text-xs sm:text-[13px] font-bold text-[#0f4b3a] leading-tight mt-0.5">The Land of Opportunities</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed text-justify mt-2">
                  Jharkhand ("The land of forest") is a State in eastern India, created on 15 November 2000. It is known for its rich natural resources, diverse culture, waterfalls, hills and vibrant communities. With its people, potential and partnerships, Jharkhand is moving towards an innovative and inclusive future.
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-1">
                <button 
                  onClick={() => handleNav('/about')}
                  className="px-4 py-1.5 rounded-none border border-[#0f4b3a] text-[#0f4b3a] text-[11px] sm:text-xs font-bold hover:bg-[#0f4b3a] hover:text-white transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                >
                  Know More About Jharkhand <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Col 2 Top: Our Leadership */}
            <div className="bg-white rounded-none border border-gray-200/90 shadow-xs p-4 md:p-5 flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 mb-3">
                <div className="flex items-center gap-2">
                  <div className="text-[#0f4b3a]">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M4 4v16h2V4H4zm4 0v16h2V4H8zm4 0v16h2V4h-2zm4 2v14h4V6h-4z" />
                    </svg>
                  </div>
                  <h3 className="text-[15px] md:text-base font-bold text-[#0f4b3a] tracking-tight">Our Leadership</h3>
                </div>
                <a href="#leadership" className="text-xs font-semibold text-[#0f4b3a] hover:underline flex items-center gap-1">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* 3 Leaders Grid */}
              <div className="grid grid-cols-3 gap-2.5 md:gap-3 flex-grow items-stretch">
                {/* Leader 1 */}
                <div className="flex flex-col items-center text-center h-full">
                  <div className="w-full bg-[#f1f3f5] rounded-none overflow-hidden flex items-center justify-center p-1 h-20 md:h-24">
                    <img src={leaderRajesh} alt="Shri Rajesh Kumar" className="w-full h-full object-cover object-top" />
                  </div>
                  <h4 className="font-bold text-[11px] sm:text-xs text-gray-900 mt-2 leading-tight">Shri Rajesh Kumar</h4>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 leading-tight mt-0.5">Hon'ble Minister</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 leading-tight">Ministry of Education</p>
                </div>

                {/* Leader 2 */}
                <div className="flex flex-col items-center text-center h-full">
                  <div className="w-full bg-[#f1f3f5] rounded-none overflow-hidden flex items-center justify-center p-1 h-20 md:h-24">
                    <img src={leaderAnil} alt="Dr. Anil Verma" className="w-full h-full object-cover object-top" />
                  </div>
                  <h4 className="font-bold text-[11px] sm:text-xs text-gray-900 mt-2 leading-tight">Dr. Anil Verma</h4>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 leading-tight mt-0.5">Minister of State</p>
                </div>

                {/* Leader 3 */}
                <div className="flex flex-col items-center text-center h-full">
                  <div className="w-full bg-[#f1f3f5] rounded-none overflow-hidden flex items-center justify-center p-1 h-20 md:h-24">
                    <img src={leaderKavita} alt="Smt. Kavita Sharma" className="w-full h-full object-cover object-top" />
                  </div>
                  <h4 className="font-bold text-[11px] sm:text-xs text-gray-900 mt-2 leading-tight">Smt. Kavita Sharma</h4>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 leading-tight mt-0.5">Secretary</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 leading-tight">Ministry of Education</p>
                </div>
              </div>
            </div>

            {/* Col 3 Top: Jharkhand at a Glance (Map & Stats) */}
            <div className="bg-white rounded-none border border-gray-200/90 shadow-xs p-4 md:p-5 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Left: District Map */}
                <div className="w-full sm:w-1/2 flex items-center justify-center">
                  <img 
                    src={jharkhandMapTight} 
                    alt="Jharkhand District Map" 
                    className="max-h-[175px] w-auto max-w-full object-contain" 
                  />
                </div>

                {/* Right: Info list */}
                <div className="w-full sm:w-1/2 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#1e3a8a] tracking-tight mb-3">
                      Jharkhand at a Glance
                    </h3>
                    <div className="space-y-2 text-[11px] sm:text-[11.5px] text-gray-800">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#0f4b3a] shrink-0" />
                        <span><strong className="font-semibold text-gray-900">Area :</strong> 79,714 km²</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#0f4b3a] shrink-0" />
                        <span><strong className="font-semibold text-gray-900">Capital City :</strong> Ranchi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#0f4b3a] shrink-0" />
                        <span><strong className="font-semibold text-gray-900">Population :</strong> 3.29 Crore (Approx.)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Map className="w-4 h-4 text-[#0f4b3a] shrink-0" />
                        <span><strong className="font-semibold text-gray-900">Districts :</strong> 24</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Button */}
              <div className="mt-4 pt-1">
                <button 
                  onClick={() => handleNav('/about')}
                  className="w-full py-1.5 px-3 rounded-none border border-[#0f4b3a] text-[#0f4b3a] text-[11px] sm:text-xs font-bold hover:bg-[#0f4b3a] hover:text-white transition-colors inline-flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  View District Map <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* 3-COLUMN CARDS SECTION (Auto-Scrolling with Hover Pause) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4 items-stretch mb-4 md:mb-5">
            
            {/* Col 1: Latest Challenges */}
            <div className="bg-white rounded-none border border-gray-200/90 shadow-xs flex flex-col overflow-hidden">
              {/* Card Header */}
              <div className="bg-[#0f4b3a] text-white px-3.5 py-2 flex items-center justify-between shrink-0">
                <h3 className="text-[13px] font-bold tracking-tight">Latest Challenges</h3>

              </div>

              {/* Auto-scrolling Ticker */}
              <div className="h-[195px] overflow-hidden relative marquee-container cursor-pointer px-2.5 py-1 bg-white">
                <div className="animate-marquee-vertical flex flex-col divide-y divide-gray-100/90">
                  {[...challengesList, ...challengesList].map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center gap-2.5 group cursor-pointer hover:bg-slate-50/90 px-1 rounded-none transition-colors">
                      <div className={`w-7 h-7 ${item.iconBg} rounded-full flex items-center justify-center text-white shrink-0 shadow-2xs`}>
                        <item.icon className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-[11.5px] font-bold text-gray-900 leading-tight group-hover:text-[#0f4b3a] transition-colors truncate">
                            {item.title}
                          </h4>
                          {item.isNew && (
                            <span className="bg-red-600 text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded-none uppercase tracking-wide leading-tight shadow-2xs">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-[9.5px] text-gray-500 mt-0.5 leading-tight truncate">
                          {item.location} <span className="mx-1 text-gray-300">|</span> {item.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>



            {/* Col 3: Key Documents */}
            <div className="bg-white rounded-none border border-gray-200/90 shadow-xs flex flex-col overflow-hidden">
              {/* Card Header */}
              <div className="bg-[#0f4b3a] text-white px-3.5 py-2 flex items-center justify-between shrink-0">
                <h3 className="text-[13px] font-bold tracking-tight">Key Documents</h3>

              </div>

              {/* Auto-scrolling Ticker */}
              <div className="h-[195px] overflow-hidden relative marquee-container cursor-pointer px-2.5 py-1 bg-white">
                <div className="animate-marquee-vertical flex flex-col divide-y divide-gray-100/90">
                  {[...documentsList, ...documentsList].map((item, idx) => (
                    <div key={idx} className="py-2 flex items-start gap-2.5 group cursor-pointer hover:bg-slate-50/90 px-1 rounded-none transition-colors">
                      <div className="w-5 h-5 bg-red-600 rounded-none flex items-center justify-center text-white shrink-0 font-bold text-[8px] tracking-tight shadow-2xs mt-0.5">
                        PDF
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-[11.5px] font-bold text-gray-900 leading-tight group-hover:text-[#0f4b3a] transition-colors truncate">
                            {item.title}
                          </h4>
                          {item.isNew && (
                            <span className="bg-red-600 text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded-none uppercase tracking-wide leading-tight shadow-2xs">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-[9.5px] text-gray-500 mt-0.5 leading-tight">
                          {item.size}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Col 4: Important Updates */}
            <div className="bg-white rounded-none border border-gray-200/90 shadow-xs flex flex-col overflow-hidden">
              {/* Card Header */}
              <div className="bg-[#0f4b3a] text-white px-3.5 py-2 flex items-center justify-between shrink-0">
                <h3 className="text-[13px] font-bold tracking-tight">Important Updates</h3>

              </div>

              {/* Auto-scrolling Ticker */}
              <div className="h-[195px] overflow-hidden relative marquee-container cursor-pointer px-2.5 py-1 bg-white">
                <div className="animate-marquee-vertical flex flex-col divide-y divide-gray-100/90">
                  {[...updatesList, ...updatesList].map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center gap-2.5 group cursor-pointer hover:bg-slate-50/90 px-1 rounded-none transition-colors">
                      <img 
                        src={item.img} 
                        alt={item.title} 
                        className="w-13 h-8 sm:w-14 sm:h-9 object-cover rounded-none shrink-0 border border-gray-200 shadow-2xs" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-[11.5px] font-bold text-gray-900 leading-tight group-hover:text-[#0f4b3a] transition-colors truncate">
                            {item.title}
                          </h4>
                          {item.isNew && (
                            <span className="bg-red-600 text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded-none uppercase tracking-wide leading-tight shadow-2xs">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-[9.5px] text-gray-500 mt-0.5 leading-tight truncate">
                          {item.sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* 8-SECTOR HORIZONTAL IMAGE GALLERY (Clean, No bottom colored line) */}
          <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
              {[
                { name: "Education", img: sectorEducation },
                { name: "Healthcare", img: sectorHealthcare },
                { name: "Agriculture", img: sectorAgriculture },
                { name: "Water & Sanitation", img: sectorWater },
                { name: "Environment", img: sectorEnvironment },
                { name: "Rural Development", img: sectorRuralDev },
                { name: "Urban Infrastructure", img: sectorUrbanInfra },
                { name: "Rural Livelihoods", img: sectorRuralLivelihood }
              ].map((sector, idx) => (
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

        </div>
      </section>

    </LandingLayout>
  );
};

export default LandingPage;
