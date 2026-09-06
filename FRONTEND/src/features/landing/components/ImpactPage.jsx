import React from 'react';
import { LandingLayout } from './layout/LandingLayout';
import { ArrowRight, TrendingUp, Heart, Cpu, Briefcase, MapPin, Plus, Minus, FileText, Leaf, Trophy } from 'lucide-react';
import heroBanner from '../../../assets/impact-banner.png';
import mapImage from '../../../assets/impact-map.png';

export const ImpactPage = ({ onNavigate }) => {
  return (
    <LandingLayout onNavigate={onNavigate} currentPath="/impact">
      {/* Hero Section */}
      <section className="bg-white relative border-b border-gray-200 w-full overflow-hidden">
        {/* Banner Image Container - using object-fill and min/max heights to ensure it's never cut off */}
        <div className="relative w-full">
           <img src={heroBanner} className="w-full h-[380px] md:h-[400px] lg:h-[420px] object-fill" alt="Impact Banner" />
        </div>
        
        {/* Absolute positioned content overlaid on the banner */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
            <div className="w-full md:w-[60%] lg:w-[48%] bg-white/30 md:bg-transparent p-4 md:p-0 rounded-none">
              <h1 className="text-3xl md:text-[38px] lg:text-[42px] font-bold text-[#1c3c78] leading-[1.15] mb-2.5">
                Measurable Impact for a<br className="hidden md:block" />Stronger Jharkhand
              </h1>
              <h2 className="text-[15px] md:text-[17px] font-bold text-gray-900 mb-2 leading-snug">
                Track Our Progress. Celebrating Solutions and Their Real-World Impact.
              </h2>
              <p className="text-[13px] md:text-[14px] text-gray-800 font-medium mb-6 leading-relaxed max-w-lg">
                Join us in viewing the results of collaboration between industry, institutions, and the Government of Jharkhand in resolving societal challenges.
              </p>
              

            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 bg-slate-50/50">
        
        {/* KPI Section */}
        <div className="flex justify-between items-end mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-700" />
            <h3 className="text-[20px] font-bold text-gray-900">Key Performance Indicators</h3>
          </div>

        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <div className="bg-white p-3.5 rounded-none shadow-sm border border-gray-200 flex flex-col relative overflow-hidden">
             <div className="flex justify-between items-start mb-2">
               <span className="text-[11.5px] font-bold text-gray-700 leading-tight">Total Challenges Resolved</span>
               <TrendingUp className="w-4 h-4 text-green-700" />
             </div>
             <div className="text-[28px] font-bold text-[#0f4b3a] mb-0.5">620+</div>
             <div className="text-[10px] text-gray-500 font-medium leading-tight">Challenges<br/>to date</div>
             <div className="absolute bottom-2 right-2 w-12 h-6">
                <svg viewBox="0 0 100 30" className="w-full h-full stroke-green-500 stroke-[3] fill-none"><path d="M0 30 L20 15 L40 25 L60 10 L80 15 L100 0"/></svg>
             </div>
          </div>
          
          <div className="bg-white p-3.5 rounded-none shadow-sm border border-gray-200 flex flex-col relative">
             <div className="flex justify-between items-start mb-2">
               <span className="text-[11.5px] font-bold text-gray-700 leading-tight">Lives Impacted</span>
               <Heart className="w-4 h-4 text-green-700" />
             </div>
             <div className="text-[28px] font-bold text-[#0f4b3a] mb-0.5">1.8L+</div>
             <div className="text-[10px] text-gray-500 font-medium leading-tight">Citizens with improved<br/>services</div>
          </div>

          <div className="bg-white p-3.5 rounded-none shadow-sm border border-gray-200 flex flex-col relative">
             <div className="flex justify-between items-start mb-2">
               <span className="text-[11.5px] font-bold text-gray-700 leading-tight">New Technologies Deployed</span>
               <Cpu className="w-4 h-4 text-green-700" />
             </div>
             <div className="text-[28px] font-bold text-[#0f4b3a] mb-0.5">85+</div>
             <div className="text-[10px] text-gray-500 font-medium leading-tight">Patent-pending<br/>Solutions</div>
          </div>

          <div className="bg-white p-3.5 rounded-none shadow-sm border border-gray-200 flex flex-col relative">
             <div className="flex justify-between items-start mb-2">
               <span className="text-[11.5px] font-bold text-gray-700 leading-tight">Job Creation (through Startups)</span>
               <Briefcase className="w-4 h-4 text-green-700" />
             </div>
             <div className="text-[28px] font-bold text-[#0f4b3a] mb-0.5">4,500+</div>
             <div className="text-[10px] text-gray-500 font-medium leading-tight">Jobs created via innovation<br/>ecosystem</div>
          </div>

          <div className="bg-white p-3.5 rounded-none shadow-sm border border-gray-200 flex flex-col relative">
             <div className="flex justify-between items-start mb-2">
               <span className="text-[11.5px] font-bold text-gray-700 leading-tight">District Coverage</span>
               <MapPin className="w-4 h-4 text-green-700" />
             </div>
             <div className="text-[28px] font-bold text-[#0f4b3a] mb-0.5">24</div>
             <div className="text-[10px] text-gray-500 font-medium leading-tight">Districts with<br/>ongoing projects</div>
          </div>
        </div>

        {/* Lower Grid: Map, Success Stories, Sidebar */}
        <div className="max-w-5xl mx-auto w-full">
          
          {/* Middle: Success Stories */}
          <div className="bg-white rounded-none shadow-sm border border-gray-200 p-4 flex flex-col">
            <div className="flex justify-between items-end mb-3 border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-green-700" />
                <h3 className="text-[16px] font-bold text-gray-900">Highlighting Success Stories</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1">
               {/* Card 1 */}
               <div className="border border-gray-200 rounded-none overflow-hidden flex flex-col hover:shadow-sm transition-shadow group bg-white">
                 <div className="aspect-video relative overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Solar" />
                   <div className="absolute bottom-0 right-0 bg-[#0f4b3a] text-white text-[9px] font-bold px-2.5 py-1 rounded-tl-lg flex flex-col items-center shadow-sm">
                     <span className="text-[13px] font-bold leading-none mb-0.5">30,000</span>households powered
                   </div>
                 </div>
                 <div className="p-2.5 flex-1 flex flex-col">
                   <h4 className="text-[11.5px] font-bold text-gray-900 leading-tight mb-1">Rural Solar Electrification (Gumla)</h4>
                   <p className="text-[9.5px] text-[#0f4b3a] font-bold flex items-center gap-1 mt-auto"><Leaf className="w-3 h-3"/> 30,000 households powered</p>
                 </div>
               </div>

               {/* Card 2 */}
               <div className="border border-gray-200 rounded-none overflow-hidden flex flex-col hover:shadow-sm transition-shadow group bg-white">
                 <div className="aspect-video relative overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Med" />
                   <div className="absolute bottom-0 right-0 bg-[#0f4b3a] text-white text-[9px] font-bold px-2.5 py-1 rounded-tl-lg flex flex-col items-center shadow-sm">
                     <span className="text-[13px] font-bold leading-none mb-0.5">20+</span>health sub-centers connected
                   </div>
                 </div>
                 <div className="p-2.5 flex-1 flex flex-col">
                   <h4 className="text-[11.5px] font-bold text-gray-900 leading-tight mb-1">Telemedicine in Tribal Areas (Lohardaga)</h4>
                   <p className="text-[9.5px] text-[#0f4b3a] font-bold flex items-center gap-1 mt-auto"><Leaf className="w-3 h-3"/> 20+ health sub-centers connected</p>
                 </div>
               </div>

               {/* Card 3 */}
               <div className="border border-gray-200 rounded-none overflow-hidden flex flex-col hover:shadow-sm transition-shadow group bg-white">
                 <div className="aspect-video relative overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Waste" />
                   <div className="absolute bottom-0 right-0 bg-[#0f4b3a] text-white text-[9px] font-bold px-2.5 py-1 rounded-tl-lg flex flex-col items-center shadow-sm">
                     <span className="text-[13px] font-bold leading-none mb-0.5">1.25+</span>Patent pending solutions
                   </div>
                 </div>
                 <div className="p-2.5 flex-1 flex flex-col">
                   <h4 className="text-[11.5px] font-bold text-gray-900 leading-tight mb-1">Waste-to-Energy Project (Dhanbad)</h4>
                   <p className="text-[9.5px] text-gray-600 font-medium leading-tight line-clamp-2 mt-1">"Stakeholder testimonial is connecting to emerging tech enabling for waste energy... Jamshedpur network..."</p>
                 </div>
               </div>

               {/* Card 4 */}
               <div className="border border-gray-200 rounded-none overflow-hidden flex flex-col hover:shadow-sm transition-shadow group bg-white">
                 <div className="aspect-video relative overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Water" />
                   <div className="absolute bottom-0 right-0 bg-[#0f4b3a] text-white text-[9px] font-bold px-2.5 py-1 rounded-tl-lg flex flex-col items-center shadow-sm">
                     <span className="text-[13px] font-bold leading-none mb-0.5">48+</span>Jobs created via ecosystem
                   </div>
                 </div>
                 <div className="p-2.5 flex-1 flex flex-col">
                   <h4 className="text-[11.5px] font-bold text-gray-900 leading-tight mb-1">Smart Water Monitoring (Hazaribagh)</h4>
                   <p className="text-[9.5px] text-gray-600 font-medium leading-tight line-clamp-2 mt-1">"Stakeholder testimonial: Smart a water positioning of our region in total has seen... Hazaribagh"</p>
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
