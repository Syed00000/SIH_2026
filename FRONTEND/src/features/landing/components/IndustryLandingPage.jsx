import React from 'react';
import { LandingLayout } from './layout/LandingLayout';
import { ArrowRight, IndianRupee, Target, Users, Cpu, Search, Filter, MapPin, Tag, Activity } from 'lucide-react';
import heroBanner from '../assets/landing-banner.png'; // Using as background

export const IndustryLandingPage = ({ onNavigate }) => {
  return (
    <LandingLayout onNavigate={onNavigate} currentPath="/industry">
      {/* Hero Section */}
      <section className="bg-slate-50 relative border-b border-gray-200">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
           <img src={heroBanner} className="w-full h-full object-cover mix-blend-multiply" alt="bg" />
           <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 relative z-10">
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            <div className="lg:w-[55%]">
              <div className="text-sm text-gray-500 mb-2 font-medium">Home &gt; Industry</div>
              <h1 className="text-4xl md:text-5xl font-black text-[#0f4b3a] tracking-tight leading-tight mb-4">
                Partner for a Better Jharkhand
              </h1>
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                Industry Collaboration for Social Impact
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-8 max-w-2xl font-medium">
                Leverage your CSR funds, technical expertise, and resources to solve real challenges. Drive measurable impact alongside the Government and innovators.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button className="bg-[#0f4b3a] text-white px-6 py-3 rounded-md font-bold text-sm flex items-center gap-2 hover:bg-teal-900 transition-colors shadow-md">
                  Explore Challenges <ArrowRight className="w-4 h-4" />
                </button>
                <button className="bg-white text-[#0f4b3a] border-2 border-[#0f4b3a] px-6 py-3 rounded-md font-bold text-sm hover:bg-[#0f4b3a] hover:text-white transition-colors">
                  Partner With Us
                </button>
              </div>
            </div>

            <div className="lg:w-[45%] flex justify-center">
               {/* Custom Diagram matching the screenshot */}
               <div className="relative w-72 h-72">
                  <div className="absolute inset-0 border-[4px] border-dashed border-teal-200 rounded-full animate-[spin_60s_linear_infinite]"></div>
                  
                  {/* Center Node */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-[#0f4b3a] rounded-full flex flex-col items-center justify-center text-white shadow-xl z-10">
                     <svg className="w-10 h-10 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                       <path d="M11 17l-5.6-5.6a2.83 2.83 0 014-4L11 9l2-2 1.6 1.6M14 6l3.6-3.6a2.83 2.83 0 014 4L16 12M5.4 21.6a2.83 2.83 0 01-4-4L7 12l2 2-3.6 3.6zM13 21v-4l-3-3" />
                     </svg>
                     <span className="text-[11px] font-bold text-center leading-tight">Industry<br/>Partnership</span>
                  </div>

                  {/* Satellite Nodes */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 flex flex-col items-center">
                     <div className="w-16 h-16 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center mb-1 relative group hover:scale-110 transition-transform">
                        <IndianRupee className="w-6 h-6 text-emerald-600" />
                        <div className="absolute h-10 w-0.5 bg-emerald-200 top-full left-1/2 -translate-x-1/2 -z-10 group-hover:bg-emerald-400"></div>
                     </div>
                     <span className="text-[10px] font-bold text-gray-700 bg-white/80 px-2 rounded">Funding</span>
                  </div>

                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 flex flex-col items-center">
                     <div className="w-16 h-16 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center mb-1 relative group hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 text-blue-600" />
                        <div className="absolute h-10 w-0.5 bg-blue-200 bottom-full left-1/2 -translate-x-1/2 -z-10 group-hover:bg-blue-400"></div>
                     </div>
                     <span className="text-[10px] font-bold text-gray-700 bg-white/80 px-2 rounded">Mentorship</span>
                  </div>

                  <div className="absolute top-1/2 left-0 -translate-x-1/4 -translate-y-1/2 flex flex-col items-center">
                     <div className="w-16 h-16 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center mb-1 relative group hover:scale-110 transition-transform">
                        <div className="font-bold text-sm text-purple-600">CSR</div>
                        <div className="absolute w-10 h-0.5 bg-purple-200 left-full top-1/2 -translate-y-1/2 -z-10 group-hover:bg-purple-400"></div>
                     </div>
                     <span className="text-[10px] font-bold text-gray-700 text-center leading-tight bg-white/80 px-1 rounded">Corporate Social<br/>Responsibility</span>
                  </div>

                  <div className="absolute top-1/2 right-0 translate-x-1/4 -translate-y-1/2 flex flex-col items-center">
                     <div className="w-16 h-16 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center mb-1 relative group hover:scale-110 transition-transform">
                        <Cpu className="w-6 h-6 text-orange-500" />
                        <div className="absolute w-10 h-0.5 bg-orange-200 right-full top-1/2 -translate-y-1/2 -z-10 group-hover:bg-orange-400"></div>
                     </div>
                     <span className="text-[10px] font-bold text-gray-700 bg-white/80 px-2 rounded">Technology</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Industry Can Contribute */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
           <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-100 pb-4">
              <div>
                 <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">How Industry Can Contribute</h2>
                 <p className="text-gray-500 font-medium mt-1">Four ways to make a tangible difference in Jharkhand.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-xl border border-gray-100 bg-slate-50 hover:shadow-lg transition-all group">
                 <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
                    <IndianRupee className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 mb-2">Fund Projects (CSR)</h3>
                 <p className="text-sm text-gray-600 leading-relaxed">Invest in high-impact projects through transparent channels to meet your Corporate Social Responsibility goals efficiently.</p>
              </div>

              <div className="p-6 rounded-xl border border-gray-100 bg-slate-50 hover:shadow-lg transition-all group">
                 <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                    <Target className="w-6 h-6 text-blue-600 group-hover:text-white" />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 mb-2">Adopt a Challenge</h3>
                 <p className="text-sm text-gray-600 leading-relaxed">Take ownership of specific district-level problems and provide end-to-end solutions using your organizational expertise.</p>
              </div>

              <div className="p-6 rounded-xl border border-gray-100 bg-slate-50 hover:shadow-lg transition-all group">
                 <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                    <Users className="w-6 h-6 text-purple-600 group-hover:text-white" />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 mb-2">Provide Mentorship</h3>
                 <p className="text-sm text-gray-600 leading-relaxed">Guide student innovators and early-stage startups with your industry knowledge, experience, and critical market access.</p>
              </div>

              <div className="p-6 rounded-xl border border-gray-100 bg-slate-50 hover:shadow-lg transition-all group">
                 <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
                    <Cpu className="w-6 h-6 text-orange-600 group-hover:text-white" />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 mb-2">Technology Transfer</h3>
                 <p className="text-sm text-gray-600 leading-relaxed">Share proprietary technology, data sets, or infrastructure to help scale grassroots innovations and speed up deployment.</p>
              </div>
           </div>
        </div>
      </section>

      {/* Explore Challenges & Projects */}
      <section className="bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
           
           <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Explore Challenges & Projects</h2>
              <div className="relative w-full sm:w-72">
                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input type="text" placeholder="Search by keywords..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#0f4b3a]" />
              </div>
           </div>

           <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Sidebar Filters */}
              <div className="lg:w-1/4">
                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24">
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                       <Filter className="w-4 h-4 text-gray-500" />
                       <h3 className="font-bold text-gray-800">Filters</h3>
                    </div>

                    <div className="mb-6">
                       <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Domain</h4>
                       <div className="space-y-2">
                          {['Education', 'Healthcare', 'Agriculture', 'Environment', 'Smart Cities', 'Water & Sanitation'].map(domain => (
                             <label key={domain} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input type="checkbox" className="rounded text-[#0f4b3a] focus:ring-[#0f4b3a] cursor-pointer" />
                                {domain}
                             </label>
                          ))}
                       </div>
                    </div>

                    <div className="mb-6">
                       <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">District</h4>
                       <select className="w-full border border-gray-300 rounded text-sm p-1.5 focus:outline-none focus:ring-1 focus:ring-[#0f4b3a]">
                          <option>All Districts</option>
                          <option>Ranchi</option>
                          <option>Palamu</option>
                          <option>Gumla</option>
                          <option>Dhanbad</option>
                       </select>
                    </div>

                    <div>
                       <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Project Stage</h4>
                       <div className="space-y-2">
                          {['Ideation', 'Prototype', 'Implementation', 'Scaling'].map(stage => (
                             <label key={stage} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input type="checkbox" className="rounded text-[#0f4b3a] focus:ring-[#0f4b3a] cursor-pointer" />
                                {stage}
                             </label>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Main List */}
              <div className="lg:w-3/4 flex flex-col gap-4">
                 
                 {/* Card 1 */}
                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3 gap-4">
                       <h3 className="text-lg font-bold text-[#0f4b3a] leading-tight">Smart Agriculture Solutions for Drought-Prone Areas (Palamu)</h3>
                       <span className="shrink-0 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Prototype</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                       Seeking industry partners to deploy IoT-based soil moisture sensors and automated drip irrigation systems in 50 pilot farms in Palamu district to optimize water usage.
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 bg-slate-50 p-3 rounded-lg border border-gray-100">
                       <div className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-gray-400" /> <span className="font-medium">Focus:</span> Agritech</div>
                       <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> <span className="font-medium">District:</span> Palamu</div>
                       <div className="flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5 text-gray-400" /> <span className="font-medium">Need:</span> Funding & Tech</div>
                    </div>
                    <div className="mt-4 flex justify-end">
                       <button className="text-sm font-bold text-[#0f4b3a] hover:underline flex items-center gap-1">View Details <ArrowRight className="w-3.5 h-3.5" /></button>
                    </div>
                 </div>

                 {/* Card 2 */}
                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3 gap-4">
                       <h3 className="text-lg font-bold text-[#0f4b3a] leading-tight">Rural Healthcare Telemedicine Kiosks (Gumla)</h3>
                       <span className="shrink-0 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Implementation</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                       Scaling a successful pilot that connects remote tribal populations with specialist doctors in Ranchi. We need CSR funding to deploy 20 more kiosks across Gumla block.
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 bg-slate-50 p-3 rounded-lg border border-gray-100">
                       <div className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-gray-400" /> <span className="font-medium">Focus:</span> Healthcare</div>
                       <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> <span className="font-medium">District:</span> Gumla</div>
                       <div className="flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5 text-gray-400" /> <span className="font-medium">Need:</span> CSR Funding</div>
                    </div>
                    <div className="mt-4 flex justify-end">
                       <button className="text-sm font-bold text-[#0f4b3a] hover:underline flex items-center gap-1">View Details <ArrowRight className="w-3.5 h-3.5" /></button>
                    </div>
                 </div>

                 {/* Card 3 */}
                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3 gap-4">
                       <h3 className="text-lg font-bold text-[#0f4b3a] leading-tight">Industrial Waste Management System (Dhanbad)</h3>
                       <span className="shrink-0 bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Ideation</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                       Looking for expertise in heavy industry by-product recycling. The goal is to create a circular economy model for coal ash and other industrial waste in the Dhanbad region.
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 bg-slate-50 p-3 rounded-lg border border-gray-100">
                       <div className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-gray-400" /> <span className="font-medium">Focus:</span> Environment</div>
                       <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> <span className="font-medium">District:</span> Dhanbad</div>
                       <div className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-gray-400" /> <span className="font-medium">Need:</span> Tech Transfer</div>
                    </div>
                    <div className="mt-4 flex justify-end">
                       <button className="text-sm font-bold text-[#0f4b3a] hover:underline flex items-center gap-1">View Details <ArrowRight className="w-3.5 h-3.5" /></button>
                    </div>
                 </div>

                 {/* Pagination */}
                 <div className="mt-6 flex justify-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50">&lt;</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded bg-[#0f4b3a] text-white font-bold">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">2</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">3</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50">&gt;</button>
                 </div>

              </div>

           </div>
        </div>
      </section>

    </LandingLayout>
  );
};

export default IndustryLandingPage;
