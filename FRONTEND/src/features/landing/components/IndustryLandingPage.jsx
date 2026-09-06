import React from 'react';
import { LandingLayout } from './layout/LandingLayout';
import { 
  ArrowRight, Search, ChevronDown, Handshake, CheckCircle2, 
  TrendingUp, MapPin, Droplet, Sun, Heart, Recycle, FlaskConical,
  CircleDollarSign, Settings, Users, Factory, Rocket
} from 'lucide-react';
import bannerImage from '../assets/hero-banner-industry.jpg';

export const IndustryLandingPage = ({ onNavigate }) => {
  return (
    <LandingLayout onNavigate={onNavigate} currentPath="/industry">
      {/* Hero Section */}
      <section className="w-full relative min-h-[350px] md:min-h-[400px] flex items-center overflow-hidden bg-white border-b border-gray-200">
        <div className="absolute inset-0 z-0">
          <img 
            src={bannerImage} 
            alt="Industry Banner" 
            className="w-full h-full object-cover object-right"
          />
        </div>
        
        {/* White fade overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent w-[75%] md:w-[65%] lg:w-[55%] z-0"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="w-full md:w-[70%] lg:w-[60%]">
            <div className="text-[13px] font-bold text-gray-500 mb-2">
              Home <span className="mx-1">&gt;</span> Industry
            </div>
            
            <h1 className="text-4xl md:text-[42px] lg:text-[46px] font-bold text-[#1c3c78] mb-1.5 leading-[1.1]">
              Partner for a Better Jharkhand
            </h1>
            <h2 className="text-lg md:text-[19px] font-bold text-[#1c3c78] mb-3">
              Collaborate. Innovate. Create Impact.
            </h2>
            
            <p className="text-gray-700 text-[14px] md:text-[15px] leading-relaxed font-medium mb-6 max-w-[480px]">
              Join hands with universities, innovators and the Government of Jharkhand to transform real societal challenges into scalable solutions.
            </p>
            
            <div className="flex flex-wrap items-center gap-3">
              <button className="bg-[#0f4b3a] text-white px-5 py-2.5 rounded-none font-bold text-[13px] transition-all hover:bg-[#0c382b] flex items-center shadow-sm">
                Explore Challenges <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column - Main Content */}
          <div className="lg:w-[73%] flex flex-col gap-8">
            
            {/* How Industry Can Contribute */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Factory className="w-6 h-6 text-[#0f4b3a]" />
                  <h2 className="text-[20px] font-bold text-[#1c3c78]">How Industry Can Contribute</h2>
                </div>
                <button className="text-[#0f4b3a] text-[12px] font-bold flex items-center hover:underline cursor-pointer">
                  Be a Catalyst for Change <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {[
                  { icon: CircleDollarSign, title: 'Funding / CSR', desc: 'Support innovative solutions through funding and CSR initiatives' },
                  { icon: Settings, title: 'Technical Expertise', desc: 'Provide domain expertise and technology support' },
                  { icon: Users, title: 'Mentorship', desc: 'Guide and mentor student and faculty teams' },
                  { icon: FlaskConical, title: 'Labs & Testing', desc: 'Offer testing facilities and technical infrastructure' },
                  { icon: Factory, title: 'Manufacturing', desc: 'Help scale prototypes to production-ready solutions' },
                  { icon: Rocket, title: 'Deployment', desc: 'Support field deployment and market readiness' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border border-gray-100 rounded-none p-3 flex flex-row items-start gap-2 shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:border-[#0f4b3a]/30 transition-all cursor-pointer group">
                    <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-[#0f4b3a] transition-colors mt-0.5">
                      <item.icon className="w-3.5 h-3.5 text-[#0f4b3a] group-hover:text-white transition-colors" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-[#1c3c78] font-bold text-[10.5px] mb-1 leading-tight">{item.title}</h3>
                      <p className="text-gray-500 text-[8.5px] leading-[1.3]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explore Challenges & Projects */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 text-[#0f4b3a] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-5 h-5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  <h2 className="text-[20px] font-bold text-[#1c3c78]">Explore Challenges & Projects</h2>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 p-4 rounded-none shadow-[0_2px_8px_rgb(0,0,0,0.04)] mb-5">
                <div className="relative mb-3.5">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search by keyword (e.g., water, healthcare, agriculture...)"
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-none text-[13px] outline-none focus:border-[#0f4b3a]/50 placeholder-gray-400"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 h-10">
                  {['Problem Area', 'District / Region', 'Support Required', 'Project Stage'].map((filter, i) => (
                    <div key={i} className="relative h-full">
                      <select className="w-full h-full appearance-none border border-gray-200 rounded-none py-1 pl-3 pr-8 text-[11px] text-gray-500 outline-none focus:border-[#0f4b3a]/50 bg-white">
                        <option value="">{filter}</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  ))}
                  <button className="bg-[#0f4b3a] text-white rounded-none font-bold text-[13px] transition-all hover:bg-[#0c382b] w-full h-full flex items-center justify-center shadow-sm">
                    Search
                  </button>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { 
                    title: 'Smart Water Monitoring System', 
                    desc: 'Real-time monitoring of water availability in rural areas of Gumia district.',
                    stage: 'Prototype Stage', badgeColor: 'bg-blue-100 text-blue-700',
                    img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400&h=250',
                    domainIcon: Droplet, domain: 'Water & Sanitation', location: 'Gumia',
                    support: ['Technology', 'Testing', 'Deployment']
                  },
                  { 
                    title: 'Solar Cold Storage for Farmers', 
                    desc: 'Affordable solar-powered cold storage units for small farmers.',
                    stage: 'Solution Development', badgeColor: 'bg-green-100 text-green-700',
                    img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=400&h=250',
                    domainIcon: Sun, domain: 'Agriculture', location: 'Simdega',
                    support: ['Funding', 'Mentorship', 'Manufacturing']
                  },
                  { 
                    title: 'Telemedicine Access for Remote Areas', 
                    desc: 'Improving healthcare access in tribal and remote regions.',
                    stage: 'Idea Stage', badgeColor: 'bg-yellow-100 text-yellow-700',
                    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400&h=250',
                    domainIcon: Heart, domain: 'Healthcare', location: 'Lohardaga',
                    support: ['Technology', 'Mentorship', 'Deployment']
                  },
                  { 
                    title: 'Smart Waste Management', 
                    desc: 'IoT-based waste collection and segregation system for urban local bodies.',
                    stage: 'Pilot Testing', badgeColor: 'bg-purple-100 text-purple-700',
                    img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400&h=250',
                    domainIcon: Recycle, domain: 'Environment', location: 'Ranchi',
                    support: ['Testing', 'Manufacturing', 'Deployment']
                  },
                ].map((card, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-none overflow-hidden shadow-[0_2px_8px_rgb(0,0,0,0.04)] flex flex-col group hover:shadow-sm transition-all relative">
                    <div className="h-24 bg-gray-200 relative overflow-hidden shrink-0">
                      <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 right-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-none ${card.badgeColor}`}>{card.stage}</span>
                      </div>
                    </div>
                    
                    <div className="p-3.5 flex flex-col flex-grow">
                      <h3 className="font-bold text-[#1c3c78] text-[12px] leading-snug mb-1.5">{card.title}</h3>
                      <p className="text-gray-500 text-[10px] leading-[1.3] mb-3 flex-grow">{card.desc}</p>
                      
                      <div className="flex items-center gap-3 text-[#1c3c78] font-bold text-[9px] mb-3">
                        <div className="flex items-center gap-1">
                          <card.domainIcon className="w-3 h-3 text-[#0f4b3a]" /> {card.domain}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#0f4b3a]" /> {card.location}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-[9px] font-bold text-[#1c3c78] mb-1.5">Support Needed:</div>
                        <div className="flex flex-wrap gap-1">
                          {card.support.map((tag, i) => (
                            <span key={i} className="bg-gray-50 border border-gray-200 text-gray-600 text-[8.5px] font-bold px-1.5 py-0.5 rounded-none">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <button className="w-full text-center text-[#1c3c78] text-[10px] font-bold transition-colors flex items-center justify-center gap-1 group-hover:underline mt-auto">
                        View Details <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column - Sidebars */}
          <div className="lg:w-[27%] flex flex-col gap-5">
            
            {/* CTA Card */}
            <div className="bg-[#eaf5f4] border border-[#d2ebe8] p-5 rounded-none relative overflow-hidden flex flex-col items-center shadow-sm">
              <div className="flex flex-col items-center gap-2 mb-3 relative z-10 text-center">
                <div className="w-10 h-10 rounded-full bg-[#d2ebe8] flex items-center justify-center shrink-0">
                  <Handshake className="w-5 h-5 text-[#0f4b3a]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1c3c78] text-[15px] leading-tight mb-1">Partner With Johar Sethu</h3>
                  <p className="text-[10px] text-gray-600 font-medium leading-relaxed max-w-[200px]">
                    Be a part of a collaborative ecosystem to solve real-world challenges and create lasting impact in Jharkhand.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate && onNavigate('/register')}
                className="w-full bg-[#0f4b3a] text-white py-2.5 rounded-none font-bold text-[12px] mb-2 flex justify-center items-center relative z-10 hover:bg-[#0c382b] transition-colors shadow-sm"
              >
                Register as Industry Partner <ArrowRight className="w-3 h-3 ml-1" />
              </button>
              <div className="text-center text-[10px] font-medium text-gray-600 relative z-10 flex items-center justify-center gap-1">
                Already registered? <span onClick={() => onNavigate && onNavigate('/login')} className="font-bold text-[#0f4b3a] flex items-center hover:underline cursor-pointer">Login <ArrowRight className="w-2.5 h-2.5 ml-0.5" /></span>
              </div>
            </div>

            {/* Why Partner With Us */}
            <div className="bg-white border border-gray-200 p-5 rounded-none shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 text-[#0f4b3a]">
                  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <h3 className="font-bold text-[#1c3c78] text-[14.5px]">Why Partner With Us?</h3>
              </div>
              
              <ul className="space-y-3">
                {[
                  'Work on real societal challenges',
                  'Access to university innovations and talent',
                  'Collaborate with government and experts',
                  'Enhance your CSR impact',
                  'Build a stronger and inclusive Jharkhand'
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0f4b3a] shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-[11px] text-gray-700 font-medium leading-tight">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Impact Stats */}
            <div className="bg-white border border-gray-200 p-5 rounded-none shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-[#0f4b3a]" />
                <div>
                  <h3 className="font-bold text-[#1c3c78] text-[14.5px] leading-none">Impact by Industry Partners</h3>
                  <p className="text-[9px] text-gray-400 mt-0.5">(As on 2025)</p>
                </div>
              </div>
              
              <div className="flex justify-between items-start mt-6 mb-5 border-b border-gray-100 pb-4">
                <div className="text-center flex-1">
                  <div className="font-bold text-[#1c3c78] text-[19px] mb-0.5">48</div>
                  <div className="text-[9px] text-gray-500 font-medium leading-tight">Partner Organizations</div>
                </div>
                <div className="text-center flex-1 border-l border-gray-100">
                  <div className="font-bold text-[#1c3c78] text-[19px] mb-0.5">112</div>
                  <div className="text-[9px] text-gray-500 font-medium leading-tight">Projects Supported</div>
                </div>
                <div className="text-center flex-1 border-l border-gray-100">
                  <div className="font-bold text-[#1c3c78] text-[19px] mb-0.5">350+</div>
                  <div className="text-[9px] text-gray-500 font-medium leading-tight">Students Mentored</div>
                </div>
              </div>
              
              <div className="flex justify-between items-start mb-2">
                <div className="text-center flex-1">
                  <div className="font-bold text-[#0f4b3a] text-[19px] mb-0.5">₹ 12 Cr+</div>
                  <div className="text-[9px] text-gray-500 font-medium leading-tight">Support Committed</div>
                </div>
                <div className="text-center flex-1 border-l border-gray-100">
                  <div className="font-bold text-[#0f4b3a] text-[19px] mb-0.5">28</div>
                  <div className="text-[9px] text-gray-500 font-medium leading-tight">Prototypes Developed</div>
                </div>
                <div className="text-center flex-1 border-l border-gray-100">
                  <div className="font-bold text-[#0f4b3a] text-[19px] mb-0.5">14</div>
                  <div className="text-[9px] text-gray-500 font-medium leading-tight">Solutions Deployed</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export default IndustryLandingPage;
