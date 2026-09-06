import React from 'react';
import { LandingLayout } from './layout/LandingLayout';
import { ArrowRight, TrendingUp, Heart, Cpu, Briefcase, MapPin, Search, Plus, Minus, FileText, Leaf, Trophy } from 'lucide-react';
import heroBanner from '../assets/landing-banner.png'; // Using as a background

export const ImpactPage = ({ onNavigate }) => {
  return (
    <LandingLayout onNavigate={onNavigate} currentPath="/impact">
      {/* Hero Section */}
      <section className="bg-slate-50 relative border-b border-gray-200">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
           <img src={heroBanner} className="w-full h-full object-cover mix-blend-multiply" alt="bg" />
           <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 relative z-10">
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            <div className="lg:w-[55%]">
              <div className="text-sm text-gray-500 mb-2 font-medium">Home &gt; Impact</div>
              <h1 className="text-4xl md:text-5xl font-black text-[#0f4b3a] tracking-tight leading-tight mb-4">
                Measurable Impact for a Stronger Jharkhand
              </h1>
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                Track Our Progress. Celebrating Solutions and Their Real-World Impact.
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-8 max-w-2xl">
                Join us in viewing the results of collaboration between industry, institutions, and the Government of Jharkhand in resolving societal challenges.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button className="bg-[#0f4b3a] text-white px-6 py-3 rounded-md font-bold text-sm flex items-center gap-2 hover:bg-teal-900 transition-colors">
                  View Implemented Solutions <ArrowRight className="w-4 h-4" />
                </button>
                <button className="bg-white text-gray-800 border border-gray-300 px-6 py-3 rounded-md font-bold text-sm hover:bg-gray-50 transition-colors">
                  Read Impact Stories
                </button>
              </div>
            </div>

            <div className="lg:w-[45%]">
               {/* Custom Diagram matching the screenshot */}
               <div className="flex items-center w-full max-w-md mx-auto">
                 <div className="flex-1 flex items-center justify-center relative">
                   <div className="w-24 h-24 rounded-full border-[6px] border-emerald-500 flex items-center justify-center bg-white z-10 shadow-sm relative">
                     <span className="text-[10px] font-bold text-center leading-tight text-gray-700">Creating<br/>Sustainable<br/>Change</span>
                   </div>
                   <div className="w-24 h-24 rounded-full border-[6px] border-blue-500 flex items-center justify-center bg-white z-20 shadow-sm -ml-6 relative">
                     <span className="text-[10px] font-bold text-center leading-tight text-gray-700">Empowering<br/>Communities</span>
                   </div>
                   <div className="w-24 h-24 rounded-full border-[6px] border-yellow-500 flex items-center justify-center bg-white z-30 shadow-sm -ml-6 relative">
                     <span className="text-[10px] font-bold text-center leading-tight text-gray-700">Building an<br/>Inclusive<br/>Future</span>
                   </div>
                   <div className="h-1 bg-green-800 w-16 -ml-2 z-0 relative flex items-center">
                      <div className="absolute right-0 w-3 h-3 border-t-2 border-r-2 border-green-800 rotate-45"></div>
                   </div>
                 </div>
                 
                 <div className="relative w-32 h-32 ml-4">
                    <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover rounded-full shadow-lg" alt="Handshake" />
                    <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center p-2 text-center">
                       <span className="text-white font-black text-xs leading-tight">A Stronger<br/>Jharkhand</span>
                    </div>
                    <div className="absolute -bottom-2 -right-4 bg-[#FF9933] text-white text-[9px] font-bold px-2 py-1 rounded shadow-md rotate-[-10deg]">
                       Impact<br/>Today.<br/>A Better<br/>Tomorrow
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 bg-slate-100">
        
        {/* KPI Section */}
        <div className="flex justify-between items-end mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-700" />
            <h3 className="text-xl font-bold text-gray-800 tracking-tight">Key Performance Indicators</h3>
          </div>
          <a href="#" className="text-sm font-bold text-gray-500 hover:text-[#0f4b3a] flex items-center gap-1">View All metrics <ArrowRight className="w-3 h-3"/></a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
             <div className="flex justify-between items-start mb-2">
               <span className="text-xs font-bold text-gray-600">Total Challenges Resolved</span>
               <FileText className="w-4 h-4 text-gray-400" />
             </div>
             <div className="text-3xl font-black text-[#0f4b3a] mb-1">620+</div>
             <div className="text-[10px] text-gray-500">Challenges to date</div>
             <div className="absolute bottom-2 right-2 w-12 h-6">
                <svg viewBox="0 0 100 30" className="w-full h-full stroke-green-500 stroke-2 fill-none"><path d="M0 30 L20 15 L40 25 L60 10 L80 15 L100 0"/></svg>
             </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col relative">
             <div className="flex justify-between items-start mb-2">
               <span className="text-xs font-bold text-gray-600">Lives Impacted</span>
               <Heart className="w-4 h-4 text-green-600" />
             </div>
             <div className="text-3xl font-black text-[#0f4b3a] mb-1">1.8L+</div>
             <div className="text-[10px] text-gray-500 leading-tight">Citizens with improved services</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col relative">
             <div className="flex justify-between items-start mb-2">
               <span className="text-xs font-bold text-gray-600">New Technologies Deployed</span>
               <Cpu className="w-4 h-4 text-blue-500" />
             </div>
             <div className="text-3xl font-black text-[#0f4b3a] mb-1">85+</div>
             <div className="text-[10px] text-gray-500 leading-tight">Patent-pending Solutions</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col relative">
             <div className="flex justify-between items-start mb-2">
               <span className="text-xs font-bold text-gray-600">Job Creation</span>
               <Briefcase className="w-4 h-4 text-yellow-500" />
             </div>
             <div className="text-3xl font-black text-[#0f4b3a] mb-1">4,500+</div>
             <div className="text-[10px] text-gray-500 leading-tight">Jobs created via innovation ecosystem</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col relative">
             <div className="flex justify-between items-start mb-2">
               <span className="text-xs font-bold text-gray-600">District Coverage</span>
               <MapPin className="w-4 h-4 text-green-700" />
             </div>
             <div className="text-3xl font-black text-[#0f4b3a] mb-1">24</div>
             <div className="text-[10px] text-gray-500 leading-tight">Districts with ongoing projects</div>
          </div>
        </div>

        {/* Lower Grid: Map, Success Stories, Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Map */}
          <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4 relative overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-green-700" />
              <h3 className="text-base font-bold text-gray-800 tracking-tight">Explore Impact by Location</h3>
            </div>
            
            <div className="absolute top-16 left-4 flex flex-col gap-1 z-10 bg-white border shadow-sm rounded-sm">
               <button className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 border-b"><Plus className="w-3 h-3 text-gray-600"/></button>
               <button className="w-6 h-6 flex items-center justify-center hover:bg-gray-100"><Minus className="w-3 h-3 text-gray-600"/></button>
            </div>

            <div className="flex-1 relative flex items-center justify-center py-10 min-h-[300px]">
               {/* Dummy Map SVG to simulate the screenshot map */}
               <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-md">
                 <path d="M100 150 L120 130 L160 140 L200 110 L250 120 L280 150 L320 160 L330 200 L300 230 L320 280 L280 320 L230 300 L180 340 L140 310 L90 320 L60 280 L80 230 L50 180 Z" fill="#e9d5ca" stroke="#fff" strokeWidth="2" />
                 
                 {/* Darker red area for Ranchi */}
                 <path d="M160 200 L200 180 L240 210 L220 250 L170 240 Z" fill="#9b2226" stroke="#fff" strokeWidth="1" className="cursor-pointer hover:fill-red-800 transition-colors" />
                 
                 {/* Tooltip pointer */}
                 <g transform="translate(180, 200)">
                    <circle cx="0" cy="0" r="4" fill="#000" />
                    <rect x="10" y="-10" width="160" height="36" rx="4" fill="#2d2d2d" />
                    <text x="18" y="4" fill="#fff" fontSize="10" fontWeight="bold">Ranchi: 95 Projects, High</text>
                    <text x="18" y="16" fill="#fff" fontSize="10" fontWeight="bold">Impact (Health & Sanitation)</text>
                 </g>
               </svg>
            </div>
          </div>

          {/* Middle: Success Stories */}
          <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
            <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-green-700" />
                <h3 className="text-base font-bold text-gray-800 tracking-tight">Highlighting Success Stories</h3>
              </div>
              <a href="#" className="text-[11px] font-bold text-gray-500 hover:text-[#0f4b3a] flex items-center gap-1">View Story <ArrowRight className="w-3 h-3"/></a>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
               {/* Card 1 */}
               <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
                 <div className="h-24 relative overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1509391366360-12009a508f76?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Solar" />
                   <div className="absolute bottom-0 right-0 bg-[#0f4b3a] text-white text-[9px] font-bold px-2 py-1 rounded-tl-lg flex flex-col items-center">
                     <span className="text-xs">30,000</span>households powered
                   </div>
                 </div>
                 <div className="p-3 flex-1 flex flex-col">
                   <h4 className="text-[11px] font-bold text-gray-900 leading-tight mb-1">Rural Solar Electrification (Gumla)</h4>
                   <p className="text-[9px] text-gray-500 flex items-center gap-1 mt-auto"><Leaf className="w-3 h-3 text-green-600"/> 30,000 households powered</p>
                   <div className="flex justify-end mt-2"><button className="bg-[#0f4b3a] text-white text-[8px] font-bold px-2 py-0.5 rounded">Full Story</button></div>
                 </div>
               </div>

               {/* Card 2 */}
               <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
                 <div className="h-24 relative overflow-hidden flex">
                   <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=200" className="w-1/3 object-cover group-hover:scale-105 transition-transform duration-500" alt="Med" />
                   <img src="https://images.unsplash.com/photo-1584982751601-97d8cb0f66fc?auto=format&fit=crop&q=80&w=200" className="w-1/3 object-cover group-hover:scale-105 transition-transform duration-500" alt="Med" />
                   <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=200" className="w-1/3 object-cover group-hover:scale-105 transition-transform duration-500" alt="Med" />
                   <div className="absolute bottom-0 right-0 bg-[#0f4b3a] text-white text-[9px] font-bold px-2 py-1 rounded-tl-lg flex flex-col items-center">
                     <span className="text-xs">20+</span>health sub-centers connected
                   </div>
                 </div>
                 <div className="p-3 flex-1 flex flex-col">
                   <h4 className="text-[11px] font-bold text-gray-900 leading-tight mb-1">Telemedicine in Tribal Areas (Lohardaga)</h4>
                   <p className="text-[9px] text-gray-500 flex items-center gap-1 mt-auto"><Heart className="w-3 h-3 text-red-500"/> 20+ health sub-centers connected</p>
                   <div className="flex justify-end mt-2"><button className="bg-[#0f4b3a] text-white text-[8px] font-bold px-2 py-0.5 rounded">Full Story</button></div>
                 </div>
               </div>

               {/* Card 3 */}
               <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
                 <div className="h-24 relative overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Waste" />
                   <div className="absolute bottom-0 right-0 bg-[#0f4b3a] text-white text-[9px] font-bold px-2 py-1 rounded-tl-lg flex flex-col items-center">
                     <span className="text-xs">1.25+</span>Patent pending solutions
                   </div>
                 </div>
                 <div className="p-3 flex-1 flex flex-col">
                   <h4 className="text-[11px] font-bold text-gray-900 leading-tight mb-1">Waste-to-Energy Project (Dhanbad)</h4>
                   <p className="text-[9px] text-gray-600 leading-tight line-clamp-2 mt-1">"Stakeholder testimonial is connecting to emerging tech enabling local waste management..."</p>
                   <div className="flex justify-end mt-2"><button className="bg-[#0f4b3a] text-white text-[8px] font-bold px-2 py-0.5 rounded">Full Story</button></div>
                 </div>
               </div>

               {/* Card 4 */}
               <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
                 <div className="h-24 relative overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Water" />
                   <div className="absolute bottom-0 right-0 bg-[#0f4b3a] text-white text-[9px] font-bold px-2 py-1 rounded-tl-lg flex flex-col items-center">
                     <span className="text-xs">48+</span>Jobs created via ecosystem
                   </div>
                 </div>
                 <div className="p-3 flex-1 flex flex-col">
                   <h4 className="text-[11px] font-bold text-gray-900 leading-tight mb-1">Smart Water Monitoring (Hazaribagh)</h4>
                   <p className="text-[9px] text-gray-600 leading-tight line-clamp-2 mt-1">"Stakeholder testimonial: Smart water positioning of our region in total has seen..."</p>
                   <div className="flex justify-end mt-2"><button className="bg-[#0f4b3a] text-white text-[8px] font-bold px-2 py-0.5 rounded">Full Story</button></div>
                 </div>
               </div>

            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
               <h3 className="text-sm font-bold text-gray-800 tracking-tight mb-3 border-b border-gray-100 pb-2">Top Impact Districts</h3>
               <div className="border border-gray-200 rounded-lg overflow-hidden relative group cursor-pointer hover:shadow-md transition-all">
                  <img src="https://images.unsplash.com/photo-1517409028882-62ce6d42534a?auto=format&fit=crop&q=80&w=400" className="w-full h-24 object-cover" alt="Ranchi"/>
                  <div className="absolute inset-0 bg-black/50 p-3 flex flex-col justify-end">
                     <h4 className="text-white font-bold text-xs mb-0.5">Ranchi: 95 Projects, High impact (Health & Sanitation)</h4>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
               <h3 className="text-sm font-bold text-gray-800 tracking-tight mb-3 border-b border-gray-100 pb-2">Upcoming Project Launches</h3>
               <ul className="space-y-3">
                 <li className="flex gap-2 items-start">
                   <div className="bg-green-100 p-1 rounded-sm mt-0.5"><FileText className="w-3 h-3 text-green-700"/></div>
                   <p className="text-[11px] font-bold text-gray-700 leading-tight">Top Impact Districts in Jharkhand</p>
                 </li>
                 <li className="flex gap-2 items-start">
                   <div className="bg-green-100 p-1 rounded-sm mt-0.5"><FileText className="w-3 h-3 text-green-700"/></div>
                   <p className="text-[11px] font-bold text-gray-700 leading-tight">Upcoming Project Launches in new Jharkhand</p>
                 </li>
                 <li className="flex gap-2 items-start">
                   <div className="bg-green-100 p-1 rounded-sm mt-0.5"><FileText className="w-3 h-3 text-green-700"/></div>
                   <p className="text-[11px] font-bold text-gray-700 leading-tight">Key Research Publications in Jharkhand Inta...</p>
                 </li>
               </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-1">
               <h3 className="text-sm font-bold text-gray-800 tracking-tight mb-3 border-b border-gray-100 pb-2">Key Research Publications</h3>
               <div className="flex gap-3">
                 <div className="flex-1 rounded-lg overflow-hidden relative cursor-pointer group">
                    <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=200" className="w-full h-20 object-cover group-hover:scale-105 transition-transform" alt="Urban"/>
                    <div className="absolute inset-0 bg-black/40 p-2 flex items-end">
                       <span className="text-white font-bold text-[9px] leading-tight">Transformed urban areas</span>
                    </div>
                 </div>
                 <div className="flex-1 rounded-lg overflow-hidden relative cursor-pointer group">
                    <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=200" className="w-full h-20 object-cover group-hover:scale-105 transition-transform" alt="Farms"/>
                    <div className="absolute inset-0 bg-black/40 p-2 flex items-end">
                       <span className="text-white font-bold text-[9px] leading-tight">Modernized rural farms</span>
                    </div>
                 </div>
               </div>
            </div>

          </div>
        </div>

      </div>
    </LandingLayout>
  );
};

export default ImpactPage;
