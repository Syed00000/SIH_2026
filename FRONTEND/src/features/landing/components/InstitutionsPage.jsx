import React, { useState } from 'react';
import { LandingLayout } from './layout/LandingLayout';
import {
  Search, ArrowRight, Microscope, Users, GraduationCap, FlaskConical,
  Settings, Handshake, MapPin, Building2, ChevronDown, CheckCircle2,
  TrendingUp, Leaf, LogIn, Trophy, Landmark
} from 'lucide-react';
import bannerImage from '../assets/hero-banner-institutions.jpg';
import dummyImage from '../assets/mission-image.jpg'; // For success story

export const InstitutionsPage = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [districtFilter, setDistrictFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [expertFilter, setExpertFilter] = useState('');

  const allInstitutions = [
    { name: 'Birla Institute of Technology Mesra', type: 'Deemed University', location: 'Ranchi', expert: 'Sustainable Technology', active: 24, teams: 12, color: 'text-red-600', bg: 'bg-red-50', logo: 'B' },
    { name: 'Ranchi University', type: 'State University', location: 'Ranchi', expert: 'Social Sciences, Rural Development, Environment', active: 18, teams: 10, color: 'text-blue-600', bg: 'bg-blue-50', logo: 'R' },
    { name: 'National Institute of Technology Jamshedpur', type: 'Central University', location: 'Jamshedpur', expert: 'Engineering, Manufacturing, Clean Energy', active: 20, teams: 15, color: 'text-[#0f4b3a]', bg: 'bg-green-50', logo: 'N' },
    { name: 'Indian Institute of Management Ranchi', type: 'Central Institute', location: 'Ranchi', expert: 'Management, Policy, Social Innovation', active: 10, teams: 8, color: 'text-orange-600', bg: 'bg-orange-50', logo: 'I' },
    { name: 'Indian Institute of Technology (ISM) Dhanbad', type: 'Central University', location: 'Dhanbad', expert: 'Mining, Earth Sciences, Engineering', active: 30, teams: 25, color: 'text-purple-600', bg: 'bg-purple-50', logo: 'IIT' },
    { name: 'XLRI - Xavier School of Management', type: 'Private Institute', location: 'Jamshedpur', expert: 'Business Management, HR', active: 12, teams: 6, color: 'text-pink-600', bg: 'bg-pink-50', logo: 'X' },
  ];

  const filteredInstitutions = allInstitutions.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inst.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = districtFilter ? inst.location === districtFilter : true;
    const matchesType = typeFilter ? inst.type === typeFilter : true;
    const matchesExpert = expertFilter ? inst.expert.includes(expertFilter) : true;
    
    return matchesSearch && matchesDistrict && matchesType && matchesExpert;
  });

  const isFiltering = searchQuery || districtFilter || typeFilter || expertFilter;
  const displayedInstitutions = showAll || isFiltering 
    ? filteredInstitutions 
    : filteredInstitutions.slice(0, 4);

  return (
    <LandingLayout onNavigate={onNavigate} currentPath="/institutions">
      {/* Hero Section */}
      <section className="w-full relative min-h-[350px] md:min-h-[450px] flex items-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <img 
            src={bannerImage} 
            alt="Institutions Banner" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        {/* White fade overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent w-[60%] md:w-[45%] z-0"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
          <div className="w-full md:w-[60%] lg:w-[50%]">
            <div className="text-[13px] font-bold text-[#0f4b3a] tracking-widest flex items-center gap-2 mb-2 uppercase">
              Home <span className="text-gray-400">&gt;</span> Institutions
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1c3c78] mb-2 tracking-tight leading-[1.1]">
              Institutions
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-[#1c3c78] mb-5 leading-snug">
              Knowledge for a Stronger Jharkhand
            </h2>
            
            <p className="text-gray-700 text-[15px] md:text-base leading-relaxed font-medium mb-8 max-w-xl">
              Connect with universities and higher education institutions working on real-world challenges across Jharkhand. Leveraging research, innovation and student talent to create scalable solutions for a better tomorrow.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">


            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 relative z-10">
        
        {/* How Institutions Contribute */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Landmark className="w-6 h-6 text-[#0f4b3a]" />
            <h2 className="text-[20px] font-black text-[#1c3c78]">How Institutions Contribute</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { icon: Microscope, title: 'Research & Innovation', desc: 'Address real-world societal challenges' },
              { icon: Users, title: 'Faculty Expertise', desc: 'Domain experts guide solution development' },
              { icon: GraduationCap, title: 'Student Engagement', desc: 'Hands-on learning through live projects' },
              { icon: FlaskConical, title: 'Labs & Infrastructure', desc: 'Access to advanced research facilities' },
              { icon: Settings, title: 'Prototype & Testing', desc: 'Develop and test solutions for field use' },
              { icon: Handshake, title: 'Collaboration', desc: 'Work with government, industry and communities' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-blue-50 rounded-lg p-3 flex flex-row items-center gap-3 shadow-sm hover:border-[#0f4b3a]/30 transition-all cursor-pointer">
                <item.icon className="w-7 h-7 text-[#0f4b3a] shrink-0" strokeWidth={2} />
                <div>
                  <h3 className="text-[#1c3c78] font-bold text-[11px] mb-0.5 leading-tight">{item.title}</h3>
                  <p className="text-gray-500 text-[9px] leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column - Main Content (Search + Featured) */}
          <div className="lg:w-[70%] flex flex-col gap-8">
            
            {/* Find Institutions Search */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-5 h-5 text-[#0f4b3a]" />
                <h2 className="text-[20px] font-black text-[#1c3c78]">Find Institutions</h2>
              </div>
              
              <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                <div className="relative mb-3">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search by institution name (e.g., BIT Mesra, Ranchi University...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-100 rounded-md text-[13px] outline-none focus:border-[#0f4b3a]/50"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-10">
                  <div className="relative h-full">
                    <select 
                      value={districtFilter}
                      onChange={(e) => setDistrictFilter(e.target.value)}
                      className="w-full h-full appearance-none border border-gray-100 rounded-md py-1 pl-3 pr-8 text-[11px] text-gray-500 outline-none focus:border-[#0f4b3a]/50 bg-white"
                    >
                      <option value="">District / Region</option>
                      <option value="Ranchi">Ranchi</option>
                      <option value="Jamshedpur">Jamshedpur</option>
                      <option value="Dhanbad">Dhanbad</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  
                  <div className="relative h-full">
                    <select 
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full h-full appearance-none border border-gray-100 rounded-md py-1 pl-3 pr-8 text-[11px] text-gray-500 outline-none focus:border-[#0f4b3a]/50 bg-white"
                    >
                      <option value="">Institution Type</option>
                      <option value="Central University">Central University</option>
                      <option value="State University">State University</option>
                      <option value="Deemed University">Deemed University</option>
                      <option value="Central Institute">Central Institute</option>
                      <option value="Private Institute">Private Institute</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  
                  <div className="relative h-full">
                    <select 
                      value={expertFilter}
                      onChange={(e) => setExpertFilter(e.target.value)}
                      className="w-full h-full appearance-none border border-gray-100 rounded-md py-1 pl-3 pr-8 text-[11px] text-gray-500 outline-none focus:border-[#0f4b3a]/50 bg-white"
                    >
                      <option value="">Areas of Expertise</option>
                      <option value="Sustainable Technology">Sustainable Technology</option>
                      <option value="Social Sciences">Social Sciences</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Management">Management</option>
                      <option value="Mining">Mining</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  
                  <button 
                    onClick={() => {}} // Filtering is reactive, but button can be left for UX
                    className="bg-[#0f4b3a] text-white rounded-md font-bold text-[13px] transition-all hover:bg-[#0c382b] w-full h-full flex items-center justify-center"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Institutions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 text-[#0f4b3a]">
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  <h2 className="text-[20px] font-black text-[#1c3c78]">Featured Institutions</h2>
                </div>
              </div>

              {filteredInstitutions.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-gray-500 font-medium">No institutions found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {displayedInstitutions.map((inst, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all">
                    {/* Placeholder for building image */}
                    <div className="h-28 bg-gray-200 relative overflow-hidden">
                      <img src={`https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600&h=400`} alt={inst.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {/* Logo placeholder */}
                      <div className="absolute -bottom-6 left-3 w-12 h-12 bg-white rounded-full p-1 shadow-sm flex items-center justify-center">
                        <div className={`w-full h-full rounded-full border border-gray-100 flex items-center justify-center ${inst.bg} ${inst.color} font-bold text-xl`}>{inst.logo}</div>
                      </div>
                    </div>
                    
                    <div className="p-4 pt-7 flex flex-col flex-grow">
                      <h3 className="font-bold text-[#1c3c78] text-[14px] leading-snug mb-3">{inst.name}</h3>
                      <div className="mb-4">
                         <span className="bg-[#eff6ff] border border-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-md">{inst.type}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-[#1c3c78] font-bold text-[11px] mb-2">
                        <MapPin className="w-3.5 h-3.5" /> {inst.location}
                      </div>
                      
                      <p className="text-gray-600 text-[11px] leading-tight mb-4 flex-grow">
                        <span className="font-bold text-[#1c3c78]">Key Expertise:</span> {inst.expert}
                      </p>
                      
                      <div className="flex justify-between items-end mb-2 pt-2 px-1">
                        <div className="text-center">
                          <div className="font-black text-[#0f4b3a] text-xl leading-none mb-1">{inst.active}</div>
                          <div className="text-[9px] text-gray-500 font-medium tracking-wide">Active Projects</div>
                        </div>
                        <div className="text-center">
                          <div className="font-black text-[#0f4b3a] text-xl leading-none mb-1">{inst.teams}</div>
                          <div className="text-[9px] text-gray-500 font-medium tracking-wide">Student Teams</div>
                        </div>
                      </div>
                      
                      <button className="w-full text-center py-2 mt-1 text-[#0f4b3a] text-[12px] font-bold transition-colors flex items-center justify-center gap-1 group-hover:underline">
                        View Institution <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>

          </div>

          {/* Right Column - Sidebars */}
          <div className="lg:w-[30%] flex flex-col gap-6">
            
            {/* CTA Card */}
            <div className="bg-[#f0f9f8] border border-[#e2eff0] p-6 rounded-xl relative overflow-hidden flex flex-col items-center shadow-sm">
              <div className="flex flex-col items-center gap-2 mb-3 relative z-10 text-center">
                <div className="w-12 h-12 rounded-full bg-[#e2eff0] flex items-center justify-center shrink-0">
                  <Landmark className="w-6 h-6 text-[#0f4b3a]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1c3c78] text-[16px] leading-tight">Are You an Institution?</h3>
                  <p className="text-[11px] text-gray-600 font-medium leading-relaxed mt-1.5 max-w-[220px]">
                    Join Johar Sethu to contribute your expertise, engage students and work on meaningful societal challenges.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('/register')}
                className="w-full bg-[#0f4b3a] text-white py-2.5 rounded-md font-bold text-[13px] mb-3 flex justify-center items-center relative z-10 hover:bg-[#0c382b] transition-colors shadow-sm cursor-pointer"
              >
                Register Your Institution <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </button>
              <div className="text-center text-[11px] font-medium text-gray-600 relative z-10 flex items-center justify-center gap-1">
                Already registered? <span onClick={() => onNavigate('/login')} className="font-bold text-[#0f4b3a] flex items-center hover:underline cursor-pointer">Login <ArrowRight className="w-3 h-3 ml-0.5" /></span>
              </div>
            </div>

            {/* Impact Stats */}
            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-6 h-6 text-[#0f4b3a]" />
                <div>
                  <h3 className="font-bold text-[#1c3c78] text-[15px] leading-none">Institutional Impact</h3>
                  <p className="text-[9px] text-gray-400 mt-0.5">(as on 2025)</p>
                </div>
              </div>
              
              <div className="flex justify-between items-start mt-6 mb-5 border-b border-gray-100 pb-4">
                <div className="text-center flex-1">
                  <div className="font-black text-[#1c3c78] text-2xl mb-1">32</div>
                  <div className="text-[9px] text-gray-500 font-medium leading-tight">Participating<br/>Institutions</div>
                </div>
                <div className="text-center flex-1 border-l border-gray-100">
                  <div className="font-black text-[#1c3c78] text-2xl mb-1">420+</div>
                  <div className="text-[9px] text-gray-500 font-medium leading-tight">Faculty<br/>Members</div>
                </div>
                <div className="text-center flex-1 border-l border-gray-100">
                  <div className="font-black text-[#1c3c78] text-2xl mb-1">2,500+</div>
                  <div className="text-[9px] text-gray-500 font-medium leading-tight">Students<br/>Engaged</div>
                </div>
              </div>
              
              <div className="flex justify-between items-start mb-2">
                <div className="text-center flex-1">
                  <div className="font-black text-[#0f4b3a] text-[22px] mb-1">120</div>
                  <div className="text-[9px] text-gray-500 font-medium leading-tight">Projects in<br/>Progress</div>
                </div>
                <div className="text-center flex-1 border-l border-gray-100">
                  <div className="font-black text-[#0f4b3a] text-[22px] mb-1">45</div>
                  <div className="text-[9px] text-gray-500 font-medium leading-tight">Prototypes<br/>Developed</div>
                </div>
                <div className="text-center flex-1 border-l border-gray-100">
                  <div className="font-black text-[#0f4b3a] text-[22px] mb-1">28</div>
                  <div className="text-[9px] text-gray-500 font-medium leading-tight">Solutions<br/>Deployed</div>
                </div>
              </div>
            </div>

            {/* Success Story */}
            <div className="bg-white border border-blue-50 p-5 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-[#0f4b3a]" />
                <h3 className="font-bold text-[#1c3c78] text-[15px]">Success Story</h3>
              </div>
              
              <div className="flex gap-3 mb-4">
                <div className="w-[85px] h-[65px] rounded-lg overflow-hidden shrink-0 border border-gray-100">
                  <img src={dummyImage} alt="Story" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-between py-0.5">
                  <h4 className="text-[12px] font-bold text-[#1c3c78] leading-tight mb-1">Low-Cost Water Purification Model</h4>
                  <p className="text-[9px] text-gray-500 leading-snug mb-1 flex-grow">
                    Developed by Ranchi University in collaboration with community partners. Now under field testing in rural areas.
                  </p>
                  <button className="text-[10px] font-bold text-[#0f4b3a] hover:underline flex items-center">
                    View Story <ArrowRight className="w-3 h-3 ml-0.5" />
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50/70 p-3 pb-2 rounded-lg relative border border-gray-100">
                <div className="text-3xl font-serif text-[#0f4b3a]/30 absolute -top-1 left-1 leading-none">“</div>
                <p className="text-[10px] font-medium text-gray-600 italic leading-relaxed relative z-10 pl-3">
                  Our students get real-world exposure while contributing to the development of Jharkhand. Johar Sethu bridges knowledge and impact."
                </p>
                <div className="text-right text-[9px] font-bold text-[#1c3c78] mt-1">— Vice Chancellor, Ranchi University</div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export default InstitutionsPage;
