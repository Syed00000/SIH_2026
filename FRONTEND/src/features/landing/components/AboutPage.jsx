import React, { useState } from 'react';
import { LandingLayout } from './layout/LandingLayout';
import { 
  Users, Search, GraduationCap, Building2, BarChart2, Settings, Target, 
  ArrowRight, Leaf, Handshake, Eye, ShieldCheck, BrainCircuit, BadgeCheck, TrendingUp, Factory, Building 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/card.jsx';
import aboutBanner from '../assets/river-banner.png'; // Using this as the hero background
import visionImage from '../assets/vision-waterfall.jpg';
import missionImage from '../assets/mission-image.jpg';

export const AboutPage = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('What We Do');

  const tabs = [
    'Our Vision', 'Our Mission', 'What We Do', 'Who We Serve', 'Our Approach', 'Our Commitment'
  ];

  return (
    <LandingLayout onNavigate={onNavigate} currentPath="/about">
      {/* Hero Section */}
      <section className="w-full bg-white relative min-h-[350px] md:min-h-[450px] flex items-center overflow-hidden">
        {/* Right side background image */}
        <div className="absolute top-0 right-0 w-full md:w-[75%] h-full z-0">
          <img 
            src={aboutBanner || "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=1600"} 
            alt="About Johar Setu Banner" 
            className="w-full h-full object-cover object-right"
          />
          {/* Fallback gradient in case the image's white fade isn't wide enough on very large screens */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent md:w-[40%]"></div>
        </div>

        {/* Left side text content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 flex">
          <div className="w-full md:w-[55%] lg:w-[45%] bg-white/90 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 md:p-0 rounded-none md:rounded-none">
            
            <div className="text-[13px] font-black text-[#0f4b3a] tracking-widest uppercase mb-2">
              ABOUT JOHAR SETU
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black text-[#0c382b] mb-3 tracking-tight">
              {activeTab}
            </h1>
            
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 leading-snug">
              {activeTab === 'What We Do' ? 'From community challenges to practical solutions.' : 
               activeTab === 'Who We Serve' ? 'A collaborative platform for a stronger Jharkhand.' : 
               activeTab === 'Our Vision' ? 'A Stronger and More Inclusive Jharkhand.' :
               activeTab === 'Our Mission' ? 'Connecting problems with the right solvers.' :
               activeTab === 'Our Approach' ? 'Innovation through collaboration.' :
               'Dedicated to the progress of Jharkhand.'}
            </h2>
            
            <p className="text-gray-600 text-[15px] md:text-[16px] leading-relaxed font-medium">
              {activeTab === 'What We Do' ? 'JoharSetu provides a structured pathway through which real-life societal challenges are collected, validated, connected with the right academic expertise and industry support, and taken forward for solution development and real-world impact.' : 
               activeTab === 'Who We Serve' ? 'JoharSetu brings together citizens, government, academic institutions and industry partners, enabling them to collaborate on real-world challenges and create innovative, practical solutions for a more inclusive and developed Jharkhand.' : 
               'JoharSetu is a digital innovation platform by the Government of Jharkhand that connects citizens, government, universities and industry to turn real-world challenges into practical solutions for a stronger, more inclusive Jharkhand.'}
            </p>
          </div>
        </div>
      </section>

      {/* Tabs and Content Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-4 md:gap-8 border-b border-gray-200 mb-10 pb-3">
          {tabs.map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm md:text-base font-bold transition-all ${
                activeTab === tab 
                  ? 'text-[#0f4b3a] border-2 border-[#0f4b3a] rounded-none' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content (What We Do) */}
        {activeTab === 'What We Do' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
              
              {/* Left Column */}
              <div className="lg:w-[35%] flex flex-col pt-2 border-r border-gray-100 pr-4 lg:pr-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-[2.5px] bg-[#0f4b3a]"></div>
                  <div className="text-[13px] font-bold text-[#0f4b3a] tracking-widest uppercase">Our Work in Action</div>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-[#0f4b3a] leading-[1.1] tracking-tight mb-8">
                  Turning<br />Real Problems into<br />Real Solutions
                </h2>
                <p className="text-slate-600 text-[15px] leading-relaxed font-medium">
                  We collect, validate and connect real-world challenges with the right people, knowledge and resources, enabling collaborative solution development and supporting their journey from idea to impactful implementation for a stronger Jharkhand.
                </p>
              </div>

              {/* Right Column (Grid) */}
              <div className="lg:w-[65%]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                  
                  {/* Card 1 */}
                  <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-none overflow-hidden group">
                    <CardHeader className="bg-[#f8fbf9] p-5 pb-4 flex-row items-center gap-4 space-y-0 border-b border-green-50/50 group-hover:bg-[#f0f8f3] transition-colors">
                      <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#0f4b3a] font-black text-sm flex items-center justify-center shrink-0">01</div>
                      <Users className="w-6 h-6 text-[#0f4b3a]" />
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <CardTitle className="text-[#0f4b3a] font-bold text-[16px] mb-2.5">Collect Societal Challenges</CardTitle>
                      <p className="text-slate-600 text-[13.5px] font-medium leading-relaxed">
                        Enable citizens to submit real problems related to education, healthcare, agriculture, water, sanitation, environment and more.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Card 2 */}
                  <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-none overflow-hidden group">
                    <CardHeader className="bg-[#f8fbf9] p-5 pb-4 flex-row items-center gap-4 space-y-0 border-b border-green-50/50 group-hover:bg-[#f0f8f3] transition-colors">
                      <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#0f4b3a] font-black text-sm flex items-center justify-center shrink-0">02</div>
                      <Search className="w-6 h-6 text-[#0f4b3a]" />
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <CardTitle className="text-[#0f4b3a] font-bold text-[16px] mb-2.5">Review and Organize</CardTitle>
                      <p className="text-slate-600 text-[13.5px] font-medium leading-relaxed">
                        Validate the received problems, categorize them, assess their priority and identify the right information for further action.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Card 3 */}
                  <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-none overflow-hidden group">
                    <CardHeader className="bg-[#f8fbf9] p-5 pb-4 flex-row items-center gap-4 space-y-0 border-b border-green-50/50 group-hover:bg-[#f0f8f3] transition-colors">
                      <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#0f4b3a] font-black text-sm flex items-center justify-center shrink-0">03</div>
                      <GraduationCap className="w-6 h-6 text-[#0f4b3a]" />
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <CardTitle className="text-[#0f4b3a] font-bold text-[16px] mb-2.5">Connect with Academic Expertise</CardTitle>
                      <p className="text-slate-600 text-[13.5px] font-medium leading-relaxed">
                        Match problems with suitable universities, faculty members, researchers and students who can work on innovative solutions.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Card 4 */}
                  <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-none overflow-hidden group">
                    <CardHeader className="bg-[#f8fbf9] p-5 pb-4 flex-row items-center gap-4 space-y-0 border-b border-green-50/50 group-hover:bg-[#f0f8f3] transition-colors">
                      <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#0f4b3a] font-black text-sm flex items-center justify-center shrink-0">04</div>
                      <Building2 className="w-6 h-6 text-[#0f4b3a]" />
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <CardTitle className="text-[#0f4b3a] font-bold text-[16px] mb-2.5">Enable Industry Collaboration</CardTitle>
                      <p className="text-slate-600 text-[13.5px] font-medium leading-relaxed">
                        Connect with industry partners, CSR initiatives and other organizations for funding, mentorship, technology support and resources.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Card 5 */}
                  <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-none overflow-hidden group">
                    <CardHeader className="bg-[#f8fbf9] p-5 pb-4 flex-row items-center gap-4 space-y-0 border-b border-green-50/50 group-hover:bg-[#f0f8f3] transition-colors">
                      <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#0f4b3a] font-black text-sm flex items-center justify-center shrink-0">05</div>
                      <BarChart2 className="w-6 h-6 text-[#0f4b3a]" />
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <CardTitle className="text-[#0f4b3a] font-bold text-[16px] mb-2.5">Track Progress</CardTitle>
                      <p className="text-slate-600 text-[13.5px] font-medium leading-relaxed">
                        Monitor the development journey — from research and prototype to testing, approvals and real-world deployment.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Card 6 */}
                  <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-none overflow-hidden group">
                    <CardHeader className="bg-[#f8fbf9] p-5 pb-4 flex-row items-center gap-4 space-y-0 border-b border-green-50/50 group-hover:bg-[#f0f8f3] transition-colors">
                      <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#0f4b3a] font-black text-sm flex items-center justify-center shrink-0">06</div>
                      <Settings className="w-6 h-6 text-[#0f4b3a]" />
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <CardTitle className="text-[#0f4b3a] font-bold text-[16px] mb-2.5">Create Real Impact</CardTitle>
                      <p className="text-slate-600 text-[13.5px] font-medium leading-relaxed">
                        Support successful solutions to be deployed on the ground and track their social, environmental and economic impact for the people of Jharkhand.
                      </p>
                    </CardContent>
                  </Card>

                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab Content (Vision) */}
        {activeTab === 'Our Vision' && (
          <div className="animate-in fade-in duration-500 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            
            <div className="lg:w-1/2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-[2.5px] bg-gray-400"></div>
                <div className="text-[13px] font-bold text-gray-600 tracking-widest uppercase">Our Vision</div>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-[42px] font-black text-[#0f4b3a] leading-[1.15] tracking-tight mb-6">
                A Stronger and More Inclusive Jharkhand
              </h2>
              <div className="w-16 h-[3px] bg-[#0f4b3a] rounded-full mb-8"></div>
              
              <p className="text-[16px] font-medium text-slate-600 leading-relaxed mb-10">
                We envision a Jharkhand where every citizen's problem finds the right people, knowledge and resources, leading to practical solutions, sustainable development and an inclusive society.
              </p>

              <Card className="bg-[#f3f9f6] border border-[#d6ecde] shadow-sm rounded-none overflow-hidden relative">
                <CardContent className="p-6 md:p-8">
                  <div className="text-6xl font-serif text-[#0f4b3a] opacity-20 absolute top-2 left-4 leading-none">“</div>
                  <p className="relative z-10 text-[17px] font-bold text-slate-700 italic leading-relaxed pl-6 pt-2">
                    "Together, we can transform local challenges into opportunities for a brighter and more prosperous Jharkhand."
                  </p>
                  <div className="text-right mt-6">
                    <span className="text-[12px] font-black text-[#0f4b3a] tracking-widest uppercase">— JoharSetu</span>
                    <div className="w-16 h-[3px] bg-[#0f4b3a] rounded-full ml-auto mt-1.5"></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:w-1/2 relative">
              <Card className="rounded-none overflow-hidden shadow-xl relative bg-[#f8fbf9] border-0">
                <img 
                  src={visionImage} 
                  alt="Jharkhand Waterfall" 
                  className="w-full h-auto object-cover"
                />
              </Card>
            </div>

          </div>
        )}

        {/* Tab Content (Mission) */}
        {activeTab === 'Our Mission' && (
          <div className="animate-in fade-in duration-500 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            
            <div className="lg:w-1/2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-[2.5px] bg-gray-400"></div>
                <div className="text-[13px] font-bold text-gray-600 tracking-widest uppercase">Our Mission</div>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-[42px] font-black text-[#0f4b3a] leading-[1.15] tracking-tight mb-6">
                Turning Challenges into<br />Real Solutions
              </h2>
              <div className="w-16 h-[3px] bg-[#0f4b3a] rounded-full mb-8"></div>
              
              <p className="text-[16px] font-medium text-slate-600 leading-relaxed mb-10">
                To connect citizens, government, universities and industry through a collaborative digital platform that transforms real-world societal challenges into practical, innovative and deployable solutions.
              </p>

              <Card className="bg-[#f3f9f6] border border-[#d6ecde] shadow-sm rounded-none overflow-hidden relative">
                <CardContent className="p-6 md:p-8">
                  <div className="text-6xl font-serif text-[#0f4b3a] opacity-20 absolute top-2 left-4 leading-none">“</div>
                  <p className="relative z-10 text-[17px] font-bold text-slate-700 italic leading-relaxed pl-6 pt-2">
                    "We work to ensure that every genuine problem finds the right people, knowledge and resources — and becomes a solution that creates meaningful impact for Jharkhand."
                  </p>
                  <div className="text-right mt-6">
                    <span className="text-[12px] font-black text-[#0f4b3a] tracking-widest uppercase">— JoharSetu</span>
                    <div className="w-16 h-[3px] bg-[#0f4b3a] rounded-full ml-auto mt-1.5"></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:w-1/2 relative">
              <Card className="rounded-none overflow-hidden shadow-xl relative bg-[#f8fbf9] border-0">
                <img 
                  src={missionImage} 
                  alt="Johar Setu Mission" 
                  className="w-full h-auto object-cover"
                />
              </Card>
            </div>

          </div>
        )}

        {/* Tab Content (Who We Serve) */}
        {activeTab === 'Who We Serve' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
              
              {/* Left Column */}
              <div className="lg:w-[35%] flex flex-col pt-2 border-r border-gray-100 pr-4 lg:pr-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-[2.5px] bg-[#0f4b3a]"></div>
                  <div className="text-[13px] font-bold text-[#0f4b3a] tracking-widest uppercase">Our Stakeholders</div>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-[#0f4b3a] leading-[1.1] tracking-tight mb-8">
                  Stronger Together<br />for a Better Jharkhand
                </h2>
                <p className="text-slate-600 text-[15px] leading-relaxed font-medium">
                  JoharSetu serves a diverse ecosystem of people and organizations, working together to identify real challenges, leverage knowledge and resources, and create practical solutions for the development of Jharkhand.
                </p>
              </div>

              {/* Right Column (Grid of 4 Cards) */}
              <div className="lg:w-[65%]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                  
                  {/* Card 1 */}
                  <Card className="bg-white border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-none flex flex-col h-full overflow-hidden group">
                    <CardHeader className="bg-[#f2f8fc] p-5 pb-4 flex-row justify-between items-start space-y-0 border-b border-blue-50/50 group-hover:bg-[#ebf4fa] transition-colors">
                      <div className="w-9 h-9 rounded-full bg-[#e3eff8] text-[#1c64a3] font-black text-[13px] flex items-center justify-center shrink-0">01</div>
                      <Users className="w-8 h-8 text-[#1c64a3]" />
                    </CardHeader>
                    <CardContent className="p-5 pt-5 flex-grow flex flex-col items-center text-center">
                      <CardTitle className="text-[#1c64a3] font-black text-[18px] mb-1.5">Citizens</CardTitle>
                      <p className="text-[#1c64a3]/80 font-bold text-[11px] uppercase tracking-widest mb-4">Voices that drive change</p>
                      <p className="text-slate-600 text-[13.5px] font-medium leading-relaxed mb-6 flex-grow">
                        Enables citizens and communities to submit real local problems, track progress and ensure their concerns reach the right authorities for action.
                      </p>
                      <div className="flex items-center justify-center w-full mt-auto pt-4 border-t border-slate-100">
                        <span className="text-[#1c64a3] font-bold text-[13px] flex items-center cursor-pointer hover:underline">
                          Learn More <ArrowRight className="w-4 h-4 ml-1.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 2 */}
                  <Card className="bg-white border border-green-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-none flex flex-col h-full overflow-hidden group">
                    <CardHeader className="bg-[#f0faf5] p-5 pb-4 flex-row justify-between items-start space-y-0 border-b border-green-50/50 group-hover:bg-[#e8f6f0] transition-colors">
                      <div className="w-9 h-9 rounded-full bg-[#dcf3e7] text-[#0f4b3a] font-black text-[13px] flex items-center justify-center shrink-0">02</div>
                      <Building className="w-8 h-8 text-[#0f4b3a]" />
                    </CardHeader>
                    <CardContent className="p-5 pt-5 flex-grow flex flex-col items-center text-center">
                      <CardTitle className="text-[#0f4b3a] font-black text-[18px] mb-1.5">Government & Nodal Officers</CardTitle>
                      <p className="text-[#0f4b3a]/80 font-bold text-[11px] uppercase tracking-widest mb-4">From insight to action</p>
                      <p className="text-slate-600 text-[13.5px] font-medium leading-relaxed mb-6 flex-grow">
                        Helps government departments and nodal officers view, manage and coordinate real problems with the right academic and industry partners, and monitor progress towards solutions.
                      </p>
                      <div className="flex items-center justify-center w-full mt-auto pt-4 border-t border-slate-100">
                        <span className="text-[#0f4b3a] font-bold text-[13px] flex items-center cursor-pointer hover:underline">
                          Learn More <ArrowRight className="w-4 h-4 ml-1.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 3 */}
                  <Card className="bg-white border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-none flex flex-col h-full overflow-hidden group">
                    <CardHeader className="bg-[#fff9f0] p-5 pb-4 flex-row justify-between items-start space-y-0 border-b border-orange-50/50 group-hover:bg-[#fef4e3] transition-colors">
                      <div className="w-9 h-9 rounded-full bg-[#ffeed1] text-[#9c5f08] font-black text-[13px] flex items-center justify-center shrink-0">03</div>
                      <GraduationCap className="w-8 h-8 text-[#9c5f08]" />
                    </CardHeader>
                    <CardContent className="p-5 pt-5 flex-grow flex flex-col items-center text-center">
                      <CardTitle className="text-[#9c5f08] font-black text-[18px] mb-1.5">Universities / HEIs</CardTitle>
                      <p className="text-[#9c5f08]/80 font-bold text-[11px] uppercase tracking-widest mb-4">Knowledge for real impact</p>
                      <p className="text-slate-600 text-[13.5px] font-medium leading-relaxed mb-6 flex-grow">
                        Connects universities, faculty, researchers and students with real-world problem statements, creating opportunities for research, innovation and hands-on learning.
                      </p>
                      <div className="flex items-center justify-center w-full mt-auto pt-4 border-t border-slate-100">
                        <span className="text-[#9c5f08] font-bold text-[13px] flex items-center cursor-pointer hover:underline">
                          Learn More <ArrowRight className="w-4 h-4 ml-1.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 4 */}
                  <Card className="bg-white border border-purple-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-none flex flex-col h-full overflow-hidden group">
                    <CardHeader className="bg-[#f6effb] p-5 pb-4 flex-row justify-between items-start space-y-0 border-b border-purple-50/50 group-hover:bg-[#f0e6f7] transition-colors">
                      <div className="w-9 h-9 rounded-full bg-[#ede1f7] text-[#55278c] font-black text-[13px] flex items-center justify-center shrink-0">04</div>
                      <Factory className="w-8 h-8 text-[#55278c]" />
                    </CardHeader>
                    <CardContent className="p-5 pt-5 flex-grow flex flex-col items-center text-center">
                      <CardTitle className="text-[#55278c] font-black text-[18px] mb-1.5">Industry / CSR Partners</CardTitle>
                      <p className="text-[#55278c]/80 font-bold text-[11px] uppercase tracking-widest mb-4">Innovation beyond campuses</p>
                      <p className="text-slate-600 text-[13.5px] font-medium leading-relaxed mb-6 flex-grow">
                        Engages industries, startups, CSR organizations and technology partners to provide funding, mentorship, infrastructure and technical support for promising solutions.
                      </p>
                      <div className="flex items-center justify-center w-full mt-auto pt-4 border-t border-slate-100">
                        <span className="text-[#55278c] font-bold text-[13px] flex items-center cursor-pointer hover:underline">
                          Learn More <ArrowRight className="w-4 h-4 ml-1.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab Content (Our Approach) */}
        {activeTab === 'Our Approach' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
              
              {/* Left Column */}
              <div className="lg:w-[35%] flex flex-col pt-2 border-r border-gray-100 pr-4 lg:pr-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-[2.5px] bg-[#0f4b3a]"></div>
                  <div className="text-[13px] font-bold text-[#0f4b3a] tracking-widest uppercase">Our Approach In Action</div>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-[#0f4b3a] leading-[1.1] tracking-tight mb-8">
                  From Real Needs<br />to Lasting Impact
                </h2>
                <p className="text-slate-600 text-[15px] leading-relaxed font-medium">
                  We follow a structured and inclusive approach that combines citizen insights, academic expertise, industry collaboration and data-driven decision making to develop solutions that are practical, scalable and beneficial for the people of Jharkhand.
                </p>
              </div>

              {/* Right Column (Grid of 6 Cards) */}
              <div className="lg:w-[65%]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                  
                  {/* Card 1 */}
                  <Card className="bg-white border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-none overflow-hidden group">
                    <CardHeader className="bg-[#f0f7fd] p-5 pb-4 items-center border-b border-blue-50 group-hover:bg-[#e9f3fb] transition-colors">
                      <div className="flex w-full justify-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#e3eff8] text-[#1c64a3] font-black text-[12px] flex items-center justify-center shrink-0">01</div>
                      </div>
                      <Users className="w-8 h-8 text-[#1c64a3]" />
                      <CardTitle className="text-[#1c64a3] font-bold text-[15px] mt-3 text-center">People-Centred</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <p className="text-slate-600 text-[13px] font-medium leading-relaxed text-center">
                        We start with real needs of citizens and communities, ensuring that grassroots challenges remain at the core of our efforts.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Card 2 */}
                  <Card className="bg-white border border-green-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-none overflow-hidden group">
                    <CardHeader className="bg-[#f0faf5] p-5 pb-4 items-center border-b border-green-50 group-hover:bg-[#e6f7ef] transition-colors">
                      <div className="flex w-full justify-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#dcf3e7] text-[#0f4b3a] font-black text-[12px] flex items-center justify-center shrink-0">02</div>
                      </div>
                      <Search className="w-8 h-8 text-[#0f4b3a]" />
                      <CardTitle className="text-[#0f4b3a] font-bold text-[15px] mt-3 text-center">Evidence-Based &<br/>AI-Assisted Validation</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <p className="text-slate-600 text-[13px] font-medium leading-relaxed text-center">
                        We verify, categorize and prioritize problems using available data and AI-assisted tools, with human oversight to ensure accuracy and relevance.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Card 3 */}
                  <Card className="bg-white border border-yellow-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-none overflow-hidden group">
                    <CardHeader className="bg-[#fff9eb] p-5 pb-4 items-center border-b border-yellow-50 group-hover:bg-[#fef4d8] transition-colors">
                      <div className="flex w-full justify-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#ffeed1] text-[#9c5f08] font-black text-[12px] flex items-center justify-center shrink-0">03</div>
                      </div>
                      <GraduationCap className="w-8 h-8 text-[#9c5f08]" />
                      <CardTitle className="text-[#9c5f08] font-bold text-[15px] mt-3 text-center">Right Expertise Matching</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <p className="text-slate-600 text-[13px] font-medium leading-relaxed text-center">
                        We connect each problem with relevant universities, faculty members, researchers and students based on their domain expertise and interest.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Card 4 */}
                  <Card className="bg-white border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-none overflow-hidden group">
                    <CardHeader className="bg-[#f6effb] p-5 pb-4 items-center border-b border-purple-50 group-hover:bg-[#f1e5f8] transition-colors">
                      <div className="flex w-full justify-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#ede1f7] text-[#55278c] font-black text-[12px] flex items-center justify-center shrink-0">04</div>
                      </div>
                      <Handshake className="w-8 h-8 text-[#55278c]" />
                      <CardTitle className="text-[#55278c] font-bold text-[15px] mt-3 text-center">Collaborative Problem Solving</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <p className="text-slate-600 text-[13px] font-medium leading-relaxed text-center">
                        We enable collaboration between government, academia, industry and CSR partners to bring together resources, knowledge and support to develop effective solutions.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Card 5 */}
                  <Card className="bg-white border border-pink-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-none overflow-hidden group">
                    <CardHeader className="bg-[#fdf0f4] p-5 pb-4 items-center border-b border-pink-50 group-hover:bg-[#fbe5eb] transition-colors">
                      <div className="flex w-full justify-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#fae3ea] text-[#a62c4a] font-black text-[12px] flex items-center justify-center shrink-0">05</div>
                      </div>
                      <Settings className="w-8 h-8 text-[#a62c4a]" />
                      <CardTitle className="text-[#a62c4a] font-bold text-[15px] mt-3 text-center">Iterative Development</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <p className="text-slate-600 text-[13px] font-medium leading-relaxed text-center">
                        We promote an iterative approach — from research to prototype, field testing and feedback — to refine solutions and ensure they are practical and scalable.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Card 6 */}
                  <Card className="bg-white border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-none overflow-hidden group">
                    <CardHeader className="bg-[#eff5fc] p-5 pb-4 items-center border-b border-blue-50 group-hover:bg-[#e4eff9] transition-colors">
                      <div className="flex w-full justify-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#e3eef9] text-[#2c5f93] font-black text-[12px] flex items-center justify-center shrink-0">06</div>
                      </div>
                      <BarChart2 className="w-8 h-8 text-[#2c5f93]" />
                      <CardTitle className="text-[#2c5f93] font-bold text-[15px] mt-3 text-center">Transparent & Measurable Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <p className="text-slate-600 text-[13px] font-medium leading-relaxed text-center">
                        We track progress, milestones and outcomes at every stage, ensuring accountability, transparency and real impact for the people of Jharkhand.
                      </p>
                    </CardContent>
                  </Card>

                </div>
              </div>
            </div>

            {/* Bottom Goal Bar */}
            <Card className="mt-8 bg-gradient-to-br from-[#f8fbf9] to-white border border-[#d6ecde] shadow-sm rounded-none overflow-hidden">
              <CardContent className="p-6 lg:p-8 flex flex-col lg:flex-row items-center gap-6 relative">
                <div className="flex items-center gap-3 shrink-0">
                  <Target className="w-8 h-8 text-[#0f4b3a]" />
                  <h3 className="text-[#0f4b3a] font-black text-[20px] tracking-tight">Our Guiding Principle</h3>
                </div>
                
                <div className="hidden lg:block w-[1.5px] h-10 bg-[#0f4b3a] opacity-10 rounded-full"></div>

                <div className="flex-1 flex items-center">
                  <span className="text-5xl font-serif text-[#0f4b3a] opacity-40 leading-[0] mr-3 mt-6">“</span>
                  <p className="text-slate-700 text-[16px] font-bold italic leading-relaxed">
                    "Collaborative efforts, driven by real needs and shared knowledge, can turn local challenges into lasting solutions for a better Jharkhand."
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <div className="inline-block">
                    <span className="text-[13px] font-black text-[#0f4b3a] tracking-widest uppercase">— JoharSetu</span>
                    <div className="w-full h-[3px] bg-[#0f4b3a] mt-1.5 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab Content (Our Commitment) */}
        {activeTab === 'Our Commitment' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
              
              {/* Left Column */}
              <div className="lg:w-[35%] flex flex-col pt-2 border-r border-gray-100 pr-4 lg:pr-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-[2.5px] bg-[#0f4b3a]"></div>
                  <div className="text-[13px] font-bold text-[#0f4b3a] tracking-widest uppercase">Our Promise</div>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-[#0f4b3a] leading-[1.1] tracking-tight mb-8">
                  Responsible<br />Innovation for<br />Lasting Change
                </h2>
                <p className="text-slate-600 text-[15px] leading-relaxed font-medium">
                  We are committed to upholding the highest standards of transparency, inclusion, privacy and impact, ensuring that JoharSetu remains a trusted platform for everyone working towards a better Jharkhand.
                </p>
              </div>

              {/* Right Column (Grid of 6 Cards) */}
              <div className="lg:w-[65%]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                  
                  {/* Card 1 */}
                  <Card className="bg-white border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-none overflow-hidden group">
                    <CardHeader className="bg-[#f0f7fd] p-5 pb-4 items-center border-b border-blue-50 group-hover:bg-[#e9f3fb] transition-colors">
                      <div className="flex w-full justify-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#e3eff8] text-[#1c64a3] font-black text-[12px] flex items-center justify-center shrink-0">01</div>
                      </div>
                      <Eye className="w-8 h-8 text-[#1c64a3]" />
                      <CardTitle className="text-[#1c64a3] font-bold text-[15px] mt-3 text-center">Transparency & Accountability</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <p className="text-slate-600 text-[13px] font-medium leading-relaxed text-center">
                        We ensure clear processes, visible progress and accountable decision-making, so citizens and stakeholders can track the journey from problem to solution.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Card 2 */}
                  <Card className="bg-white border border-green-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-none overflow-hidden group">
                    <CardHeader className="bg-[#f0faf5] p-5 pb-4 items-center border-b border-green-50 group-hover:bg-[#e6f7ef] transition-colors">
                      <div className="flex w-full justify-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#dcf3e7] text-[#0f4b3a] font-black text-[12px] flex items-center justify-center shrink-0">02</div>
                      </div>
                      <ShieldCheck className="w-8 h-8 text-[#0f4b3a]" />
                      <CardTitle className="text-[#0f4b3a] font-bold text-[15px] mt-3 text-center">Privacy & Data Protection</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <p className="text-slate-600 text-[13px] font-medium leading-relaxed text-center">
                        We are committed to protecting the personal information of citizens and stakeholders through responsible data handling and in line with applicable laws and policies.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Card 3 */}
                  <Card className="bg-white border border-yellow-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-none overflow-hidden group">
                    <CardHeader className="bg-[#fff9eb] p-5 pb-4 items-center border-b border-yellow-50 group-hover:bg-[#fef4d8] transition-colors">
                      <div className="flex w-full justify-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#ffeed1] text-[#9c5f08] font-black text-[12px] flex items-center justify-center shrink-0">03</div>
                      </div>
                      <Users className="w-8 h-8 text-[#9c5f08]" />
                      <CardTitle className="text-[#9c5f08] font-bold text-[15px] mt-3 text-center">Accessibility & Inclusion</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <p className="text-slate-600 text-[13px] font-medium leading-relaxed text-center">
                        We strive to make JoharSetu easy to access and use for people across Jharkhand, including citizens from rural and remote areas, with simple language and inclusive design.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Card 4 */}
                  <Card className="bg-white border border-pink-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-none overflow-hidden group">
                    <CardHeader className="bg-[#fdf0f4] p-5 pb-4 items-center border-b border-pink-50 group-hover:bg-[#fbe5eb] transition-colors">
                      <div className="flex w-full justify-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#fae3ea] text-[#a62c4a] font-black text-[12px] flex items-center justify-center shrink-0">04</div>
                      </div>
                      <BrainCircuit className="w-8 h-8 text-[#a62c4a]" />
                      <CardTitle className="text-[#a62c4a] font-bold text-[15px] mt-3 text-center">Fair & Responsible AI</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <p className="text-slate-600 text-[13px] font-medium leading-relaxed text-center">
                        We use AI to assist in problem validation and matching, while ensuring human oversight in all important decisions to maintain fairness, accuracy and trust.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Card 5 */}
                  <Card className="bg-white border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-none overflow-hidden group">
                    <CardHeader className="bg-[#f6effb] p-5 pb-4 items-center border-b border-purple-50 group-hover:bg-[#f1e5f8] transition-colors">
                      <div className="flex w-full justify-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#ede1f7] text-[#55278c] font-black text-[12px] flex items-center justify-center shrink-0">05</div>
                      </div>
                      <BadgeCheck className="w-8 h-8 text-[#55278c]" />
                      <CardTitle className="text-[#55278c] font-bold text-[15px] mt-3 text-center">Quality & Real-World Impact</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <p className="text-slate-600 text-[13px] font-medium leading-relaxed text-center">
                        We focus on practical, reliable and scalable solutions that can be deployed on the ground and create meaningful social, environmental and economic impact for the people of Jharkhand.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Card 6 */}
                  <Card className="bg-white border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-none overflow-hidden group">
                    <CardHeader className="bg-[#eff5fc] p-5 pb-4 items-center border-b border-blue-50 group-hover:bg-[#e4eff9] transition-colors">
                      <div className="flex w-full justify-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#e3eef9] text-[#2c5f93] font-black text-[12px] flex items-center justify-center shrink-0">06</div>
                      </div>
                      <TrendingUp className="w-8 h-8 text-[#2c5f93]" />
                      <CardTitle className="text-[#2c5f93] font-bold text-[15px] mt-3 text-center">Continuous Improvement</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <p className="text-slate-600 text-[13px] font-medium leading-relaxed text-center">
                        We continuously learn from feedback, monitor outcomes and evolve the platform to serve citizens and all stakeholders better, and to meet the changing needs of Jharkhand.
                      </p>
                    </CardContent>
                  </Card>

                </div>
              </div>
            </div>

            {/* Bottom Goal Bar */}
            <Card className="mt-8 bg-gradient-to-br from-[#f8fbf9] to-white border border-[#d6ecde] shadow-sm rounded-none overflow-hidden">
              <CardContent className="p-6 lg:p-8 flex flex-col lg:flex-row items-center gap-6 relative">
                <div className="flex items-center gap-3 shrink-0">
                  <Handshake className="w-8 h-8 text-[#0f4b3a]" />
                  <h3 className="text-[#0f4b3a] font-black text-[20px] tracking-tight">Our Commitment</h3>
                </div>
                
                <div className="hidden lg:block w-[1.5px] h-10 bg-[#0f4b3a] opacity-10 rounded-full"></div>

                <div className="flex-1 flex items-center">
                  <span className="text-5xl font-serif text-[#0f4b3a] opacity-40 leading-[0] mr-3 mt-6">“</span>
                  <p className="text-slate-700 text-[16px] font-bold italic leading-relaxed">
                    "Technology should serve people — with transparency, responsibility and measurable impact."
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <div className="inline-block">
                    <span className="text-[13px] font-black text-[#0f4b3a] tracking-widest uppercase">— JoharSetu</span>
                    <div className="w-full h-[3px] bg-[#0f4b3a] mt-1.5 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </section>
    </LandingLayout>
  );
};

export default AboutPage;
