import React, { useState, useEffect } from 'react';
import { LandingLayout } from './layout/LandingLayout';
import { 
  ArrowRight, Search, ChevronDown, Handshake, CheckCircle2, 
  TrendingUp, MapPin, Droplet, Sun, Heart, Recycle, FlaskConical,
  CircleDollarSign, Settings, Users, Factory, Rocket
} from 'lucide-react';
import bannerImage from '../assets/hero-banner-industry.jpg';
import { industryService } from '../../government/services/industryService';
import { citizenService } from '../../citizen/services/citizenService';
import { governmentDataService } from '../../government/services/governmentDataService';

// Map domain names to icons
const domainIconMap = {
  'Water Resources': Droplet,
  'Energy': Sun,
  'Healthcare': Heart,
  'Environment': Recycle,
  'Agriculture': Sun,
  'Education': FlaskConical,
  'Urban Development': Factory,
  'Rural Livelihoods': Users,
  'Accessibility': Users,
  'Public Administration': Settings,
};

// Map status to badge styles
const statusBadgeMap = {
  'Under Review': { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700' },
  'In Progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  'Resolved': { label: 'Resolved', color: 'bg-green-100 text-green-700' },
  'Deployed': { label: 'Deployed', color: 'bg-purple-100 text-purple-700' },
  'Submitted': { label: 'Submitted', color: 'bg-gray-100 text-gray-700' },
  'Accepted': { label: 'Accepted', color: 'bg-green-100 text-green-700' },
};

export const IndustryLandingPage = ({ onNavigate }) => {
  const [challenges, setChallenges] = useState([]);
  const [impactStats, setImpactStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch real citizen challenges
        const challengeRes = await citizenService.fetchChallenges({ limit: 8 });
        if (challengeRes && challengeRes.challenges && challengeRes.challenges.length > 0) {
          setChallenges(challengeRes.challenges);
        }

        // Fetch real overview stats for the impact section
        const stats = await governmentDataService.fetchLiveDatabaseStats();
        if (stats) {
          setImpactStats({
            partnerOrgs: stats.industries?.active || stats.industries?.total || 0,
            projectsSupported: stats.financials?.totalProjects || 0,
            citizensEngaged: stats.citizens?.total || 0,
            csrFundsCr: stats.financials?.totalCsrFundsCr || 0,
            labs: stats.financials?.verifiedLabs || 0,
            problemsSolved: stats.problems?.total || 0
          });
        }
      } catch(err) {
        console.error('IndustryLandingPage fetch error:', err);
      }
    };
    fetchData();
  }, []);

  const filteredChallenges = challenges.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (c.title || '').toLowerCase().includes(q) ||
           (c.domain || '').toLowerCase().includes(q) ||
           (c.district || '').toLowerCase().includes(q) ||
           (c.description || '').toLowerCase().includes(q);
  });

  const displayedChallenges = filteredChallenges.slice(0, 4);

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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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

              {/* Cards Grid - Dynamic from API */}
              {displayedChallenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {displayedChallenges.map((challenge, idx) => {
                    const DomainIcon = domainIconMap[challenge.domain] || FlaskConical;
                    const badge = statusBadgeMap[challenge.status] || { label: challenge.status, color: 'bg-gray-100 text-gray-700' };
                    const district = challenge.district || challenge.location?.district || 'Jharkhand';
                    
                    return (
                      <div key={challenge._id || idx} className="bg-white border border-gray-200 rounded-none overflow-hidden shadow-[0_2px_8px_rgb(0,0,0,0.04)] flex flex-col group hover:shadow-sm transition-all relative">
                        <div className="h-24 bg-gradient-to-br from-[#0f4b3a]/10 to-[#1c3c78]/10 relative overflow-hidden shrink-0 flex items-center justify-center">
                          <DomainIcon className="w-10 h-10 text-[#0f4b3a]/30" />
                          <div className="absolute top-2 right-2">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-none ${badge.color}`}>{badge.label}</span>
                          </div>
                        </div>
                        
                        <div className="p-3.5 flex flex-col flex-grow">
                          <h3 className="font-bold text-[#1c3c78] text-[12px] leading-snug mb-1.5">{challenge.title}</h3>
                          <p className="text-gray-500 text-[10px] leading-[1.3] mb-3 flex-grow line-clamp-2">{challenge.description}</p>
                          
                          <div className="flex items-center gap-3 text-[#1c3c78] font-bold text-[9px] mb-3">
                            <div className="flex items-center gap-1">
                              <DomainIcon className="w-3 h-3 text-[#0f4b3a]" /> {challenge.domain || 'General'}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#0f4b3a]" /> {district}
                            </div>
                          </div>
                          
                          {challenge.priority && (
                            <div className="mb-3">
                              <div className="text-[9px] font-bold text-[#1c3c78] mb-1.5">Priority:</div>
                              <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-none border ${
                                challenge.priority === 'Critical' ? 'bg-red-50 border-red-200 text-red-700' :
                                challenge.priority === 'High' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                                challenge.priority === 'Medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                                'bg-gray-50 border-gray-200 text-gray-600'
                              }`}>
                                {challenge.priority}
                              </span>
                            </div>
                          )}
                          
                          <button className="w-full text-center text-[#1c3c78] text-[10px] font-bold transition-colors flex items-center justify-center gap-1 group-hover:underline mt-auto">
                            View Details <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-gray-500 font-medium text-sm">No challenges found.</p>
                </div>
              )}
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
                  <h3 className="font-bold text-[#1c3c78] text-[15px] leading-tight mb-1">Partner With Johar Setu</h3>
                  <p className="text-[10px] text-gray-600 font-medium leading-relaxed max-w-[200px]">
                    Be a part of a collaborative ecosystem to solve real-world challenges and create lasting impact in Jharkhand.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate && onNavigate('/apply-industry')}
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

            {/* Impact Stats - Dynamic from API */}
            {impactStats && (
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
                  <div className="font-bold text-[#1c3c78] text-[19px] mb-0.5">{impactStats.partnerOrgs}</div>
                  <div className="text-[9px] text-gray-500 font-medium leading-tight">Partner Organizations</div>
                </div>
                <div className="text-center flex-1 border-l border-gray-100">
                  <div className="font-bold text-[#1c3c78] text-[19px] mb-0.5">{impactStats.projectsSupported}</div>
                  <div className="text-[9px] text-gray-500 font-medium leading-tight">Projects Supported</div>
                </div>
                <div className="text-center flex-1 border-l border-gray-100">
                  <div className="font-bold text-[#1c3c78] text-[19px] mb-0.5">{impactStats.citizensEngaged}+</div>
                  <div className="text-[9px] text-gray-500 font-medium leading-tight">Citizens Engaged</div>
                </div>
              </div>
              
              <div className="flex justify-between items-start mb-2">
                <div className="text-center flex-1">
                  <div className="font-bold text-[#0f4b3a] text-[19px] mb-0.5">₹ {impactStats.csrFundsCr} Cr</div>
                  <div className="text-[9px] text-gray-500 font-medium leading-tight">CSR Committed</div>
                </div>
                <div className="text-center flex-1 border-l border-gray-100">
                  <div className="font-bold text-[#0f4b3a] text-[19px] mb-0.5">{impactStats.labs}</div>
                  <div className="text-[9px] text-gray-500 font-medium leading-tight">Labs Available</div>
                </div>
                <div className="text-center flex-1 border-l border-gray-100">
                  <div className="font-bold text-[#0f4b3a] text-[19px] mb-0.5">{impactStats.problemsSolved}</div>
                  <div className="text-[9px] text-gray-500 font-medium leading-tight">Challenges Received</div>
                </div>
              </div>
            </div>
            )}

          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export default IndustryLandingPage;
