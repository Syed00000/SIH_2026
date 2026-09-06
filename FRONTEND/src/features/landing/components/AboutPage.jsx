import React, { useState } from 'react';
import { LandingLayout } from './layout/LandingLayout';
import { 
  Users, Search, GraduationCap, Building2, BarChart2, Settings, Target, 
  ArrowRight, Leaf, Handshake, Eye, ShieldCheck, BrainCircuit, BadgeCheck, TrendingUp, Factory, Building 
} from 'lucide-react';
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
            alt="About Johar Sethu Banner" 
            className="w-full h-full object-cover object-right"
          />
          {/* Fallback gradient in case the image's white fade isn't wide enough on very large screens */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent md:w-[40%]"></div>
        </div>

        {/* Left side text content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 flex">
          <div className="w-full md:w-[55%] lg:w-[45%] bg-white/90 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 md:p-0 rounded-2xl md:rounded-none">
            
            <div className="text-[13px] font-black text-[#0f4b3a] tracking-widest uppercase mb-2">
              ABOUT JOHAR SETHU
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
              {activeTab === 'What We Do' ? 'JoharSethu provides a structured pathway through which real-life societal challenges are collected, validated, connected with the right academic expertise and industry support, and taken forward for solution development and real-world impact.' : 
               activeTab === 'Who We Serve' ? 'JoharSethu brings together citizens, government, academic institutions and industry partners, enabling them to collaborate on real-world challenges and create innovative, practical solutions for a more inclusive and developed Jharkhand.' : 
               'JoharSethu is a digital innovation platform by the Government of Jharkhand that connects citizens, government, universities and industry to turn real-world challenges into practical solutions for a stronger, more inclusive Jharkhand.'}
            </p>
          </div>
        </div>
      </section>

      {/* Tabs and Content Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-6 md:gap-10 border-b border-gray-200 mb-10">
          {tabs.map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm md:text-base font-bold transition-all relative ${
                activeTab === tab 
                  ? 'text-[#0f4b3a]' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-[-1.5px] left-0 w-full h-[3px] bg-[#0f4b3a] rounded-t-full"></div>
              )}
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
                <p className="text-gray-600 text-[15px] leading-relaxed font-medium">
                  We collect, validate and connect real-world challenges with the right people, knowledge and resources, enabling collaborative solution development and supporting their journey from idea to impactful implementation for a stronger Jharkhand.
                </p>
              </div>

              {/* Right Column (Grid) */}
              <div className="lg:w-[65%]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  
                  {/* Card 1 */}
                  <div className="bg-[#f8fbf9] border border-green-50/50 rounded-xl p-5 lg:p-6 transition-all hover:shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#0f4b3a] font-black text-sm flex items-center justify-center shrink-0">01</div>
                      <Users className="w-7 h-7 text-[#0f4b3a]" />
                    </div>
                    <h3 className="text-[#0f4b3a] font-bold text-[15px] mb-2">Collect Societal Challenges</h3>
                    <p className="text-gray-600 text-[13px] leading-relaxed">
                      Enable citizens to submit real problems related to education, healthcare, agriculture, water, sanitation, environment and more.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-[#f8fbf9] border border-green-50/50 rounded-xl p-5 lg:p-6 transition-all hover:shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#0f4b3a] font-black text-sm flex items-center justify-center shrink-0">02</div>
                      <Search className="w-7 h-7 text-[#0f4b3a]" />
                    </div>
                    <h3 className="text-[#0f4b3a] font-bold text-[15px] mb-2">Review and Organize</h3>
                    <p className="text-gray-600 text-[13px] leading-relaxed">
                      Validate the received problems, categorize them, assess their priority and identify the right information for further action.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-[#f8fbf9] border border-green-50/50 rounded-xl p-5 lg:p-6 transition-all hover:shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#0f4b3a] font-black text-sm flex items-center justify-center shrink-0">03</div>
                      <GraduationCap className="w-7 h-7 text-[#0f4b3a]" />
                    </div>
                    <h3 className="text-[#0f4b3a] font-bold text-[15px] mb-2">Connect with Academic Expertise</h3>
                    <p className="text-gray-600 text-[13px] leading-relaxed">
                      Match problems with suitable universities, faculty members, researchers and students who can work on innovative solutions.
                    </p>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-[#f8fbf9] border border-green-50/50 rounded-xl p-5 lg:p-6 transition-all hover:shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#0f4b3a] font-black text-sm flex items-center justify-center shrink-0">04</div>
                      <Building2 className="w-7 h-7 text-[#0f4b3a]" />
                    </div>
                    <h3 className="text-[#0f4b3a] font-bold text-[15px] mb-2">Enable Industry Collaboration</h3>
                    <p className="text-gray-600 text-[13px] leading-relaxed">
                      Connect with industry partners, CSR initiatives and other organizations for funding, mentorship, technology support and resources.
                    </p>
                  </div>

                  {/* Card 5 */}
                  <div className="bg-[#f8fbf9] border border-green-50/50 rounded-xl p-5 lg:p-6 transition-all hover:shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#0f4b3a] font-black text-sm flex items-center justify-center shrink-0">05</div>
                      <BarChart2 className="w-7 h-7 text-[#0f4b3a]" />
                    </div>
                    <h3 className="text-[#0f4b3a] font-bold text-[15px] mb-2">Track Progress</h3>
                    <p className="text-gray-600 text-[13px] leading-relaxed">
                      Monitor the development journey — from research and prototype to testing, approvals and real-world deployment.
                    </p>
                  </div>

                  {/* Card 6 */}
                  <div className="bg-[#f8fbf9] border border-green-50/50 rounded-xl p-5 lg:p-6 transition-all hover:shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#0f4b3a] font-black text-sm flex items-center justify-center shrink-0">06</div>
                      <Settings className="w-7 h-7 text-[#0f4b3a]" />
                    </div>
                    <h3 className="text-[#0f4b3a] font-bold text-[15px] mb-2">Create Real Impact</h3>
                    <p className="text-gray-600 text-[13px] leading-relaxed">
                      Support successful solutions to be deployed on the ground and track their social, environmental and economic impact for the people of Jharkhand.
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* Bottom Goal Bar */}
            <div className="mt-6 bg-[#f8fbf9] border border-green-50/50 rounded-xl px-6 lg:px-8 py-5 flex flex-col lg:flex-row items-center gap-6 relative overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 shrink-0">
                <Target className="w-8 h-8 text-[#0f4b3a]" />
                <h3 className="text-[#0f4b3a] font-bold text-xl tracking-tight">Our Goal</h3>
              </div>
              
              <div className="hidden lg:block w-[1.5px] h-8 bg-[#0f4b3a] opacity-20"></div>

              <div className="flex-1 flex items-center">
                <span className="text-4xl font-serif text-[#0f4b3a] opacity-60 leading-[0] mr-3 mt-4">“</span>
                <p className="text-gray-600 text-[15px] font-medium italic">
                  "Empowering people's problems to become real solutions for a better and more inclusive Jharkhand."
                </p>
              </div>

              <div className="shrink-0 text-right">
                <div className="inline-block">
                  <span className="text-sm font-bold text-[#0f4b3a]">— JoharSethu</span>
                  <div className="w-full h-[3px] bg-green-600 mt-1.5 rounded-full"></div>
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
                <div className="w-8 h-[2px] bg-gray-400"></div>
                <div className="text-sm font-bold text-gray-600 tracking-widest uppercase">Our Vision</div>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#0f4b3a] leading-tight tracking-tight mb-6">
                A Stronger and More Inclusive Jharkhand
              </h2>
              <div className="w-16 h-1 bg-green-600 rounded-full mb-8"></div>
              
              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-10">
                We envision a Jharkhand where every citizen's problem finds the right people, knowledge and resources, leading to practical solutions, sustainable development and an inclusive society.
              </p>

              <div className="bg-[#f3f9f6] p-6 md:p-8 rounded-2xl relative border border-teal-100/50">
                <div className="text-5xl font-serif text-[#0f4b3a] opacity-30 absolute top-4 left-4 leading-none">“</div>
                <p className="relative z-10 text-lg md:text-xl font-medium text-gray-700 italic leading-relaxed pl-6 pt-2">
                  "Together, we can transform local challenges into opportunities for a brighter and more prosperous Jharkhand."
                </p>
                <div className="text-right mt-4 text-sm font-bold text-[#0f4b3a]">
                  — JoharSethu
                  <div className="w-12 h-1 bg-green-600 rounded-full ml-auto mt-1"></div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl relative bg-[#f8fbf9] flex items-center justify-center">
                <img 
                  src={visionImage} 
                  alt="Jharkhand Waterfall" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

          </div>
        )}

        {/* Tab Content (Mission) */}
        {activeTab === 'Our Mission' && (
          <div className="animate-in fade-in duration-500 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            
            <div className="lg:w-1/2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-[2px] bg-gray-400"></div>
                <div className="text-sm font-bold text-gray-600 tracking-widest uppercase">Our Mission</div>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#0f4b3a] leading-tight tracking-tight mb-6">
                Turning Challenges into<br />Real Solutions
              </h2>
              <div className="w-16 h-1 bg-green-600 rounded-full mb-8"></div>
              
              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-10">
                To connect citizens, government, universities and industry through a collaborative digital platform that transforms real-world societal challenges into practical, innovative and deployable solutions.
              </p>

              <div className="bg-[#f3f9f6] p-6 md:p-8 rounded-2xl relative border border-teal-100/50">
                <div className="text-5xl font-serif text-[#0f4b3a] opacity-30 absolute top-4 left-4 leading-none">“</div>
                <p className="relative z-10 text-lg md:text-xl font-medium text-gray-700 italic leading-relaxed pl-6 pt-2">
                  "We work to ensure that every genuine problem finds the right people, knowledge and resources — and becomes a solution that creates meaningful impact for Jharkhand."
                </p>
                <div className="text-right mt-4 text-sm font-bold text-[#0f4b3a]">
                  — JoharSethu
                  <div className="w-12 h-1 bg-green-600 rounded-full ml-auto mt-1"></div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl relative bg-[#f8fbf9] flex items-center justify-center">
                <img 
                  src={missionImage} 
                  alt="Johar Sethu Mission" 
                  className="w-full h-auto object-contain"
                />
              </div>
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
                <p className="text-gray-600 text-[15px] leading-relaxed font-medium">
                  JoharSethu serves a diverse ecosystem of people and organizations, working together to identify real challenges, leverage knowledge and resources, and create practical solutions for the development of Jharkhand.
                </p>
              </div>

              {/* Right Column (Grid of 4 Cards) */}
              <div className="lg:w-[65%]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  
                  {/* Card 1 */}
                  <div className="bg-[#f2f8fc] border border-blue-50/50 rounded-xl p-5 lg:p-6 transition-all hover:shadow-sm flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-8 h-8 rounded-full bg-[#e3eff8] text-[#1c64a3] font-black text-sm flex items-center justify-center">01</div>
                      <Users className="w-9 h-9 text-[#1c64a3]" />
                    </div>
                    <div className="text-center mb-4">
                      <h3 className="text-[#1c64a3] font-bold text-[17px] mb-1">Citizens</h3>
                      <p className="text-[#1c64a3] font-semibold text-[13px]">Voices that drive change</p>
                    </div>
                    <p className="text-gray-600 text-[13px] leading-relaxed text-center mb-6 flex-grow">
                      Enables citizens and communities to submit real local problems, track progress and ensure their concerns reach the right authorities for action.
                    </p>
                    <div className="flex items-center text-[#1c64a3] font-bold text-sm cursor-pointer hover:underline mt-auto">
                      Learn More <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-[#f0faf5] border border-green-50/50 rounded-xl p-5 lg:p-6 transition-all hover:shadow-sm flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-8 h-8 rounded-full bg-[#dcf3e7] text-[#0f4b3a] font-black text-sm flex items-center justify-center">02</div>
                      <Building className="w-9 h-9 text-[#0f4b3a]" />
                    </div>
                    <div className="text-center mb-4">
                      <h3 className="text-[#0f4b3a] font-bold text-[17px] mb-1">Government & Nodal Officers</h3>
                      <p className="text-[#0f4b3a] font-semibold text-[13px]">From insight to action</p>
                    </div>
                    <p className="text-gray-600 text-[13px] leading-relaxed text-center mb-6 flex-grow">
                      Helps government departments and nodal officers view, manage and coordinate real problems with the right academic and industry partners, and monitor progress towards solutions.
                    </p>
                    <div className="flex items-center text-[#0f4b3a] font-bold text-sm cursor-pointer hover:underline mt-auto">
                      Learn More <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-[#fff9f0] border border-orange-50/50 rounded-xl p-5 lg:p-6 transition-all hover:shadow-sm flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-8 h-8 rounded-full bg-[#ffeed1] text-[#9c5f08] font-black text-sm flex items-center justify-center">03</div>
                      <GraduationCap className="w-9 h-9 text-[#9c5f08]" />
                    </div>
                    <div className="text-center mb-4">
                      <h3 className="text-[#9c5f08] font-bold text-[17px] mb-1">Universities / HEIs</h3>
                      <p className="text-[#9c5f08] font-semibold text-[13px]">Knowledge for real impact</p>
                    </div>
                    <p className="text-gray-600 text-[13px] leading-relaxed text-center mb-6 flex-grow">
                      Connects universities, faculty, researchers and students with real-world problem statements, creating opportunities for research, innovation and hands-on learning.
                    </p>
                    <div className="flex items-center text-[#9c5f08] font-bold text-sm cursor-pointer hover:underline mt-auto">
                      Learn More <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-[#f6effb] border border-purple-50/50 rounded-xl p-5 lg:p-6 transition-all hover:shadow-sm flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-8 h-8 rounded-full bg-[#ede1f7] text-[#55278c] font-black text-sm flex items-center justify-center">04</div>
                      <Factory className="w-9 h-9 text-[#55278c]" />
                    </div>
                    <div className="text-center mb-4">
                      <h3 className="text-[#55278c] font-bold text-[17px] mb-1">Industry / CSR Partners</h3>
                      <p className="text-[#55278c] font-semibold text-[13px]">Innovation beyond campuses</p>
                    </div>
                    <p className="text-gray-600 text-[13px] leading-relaxed text-center mb-6 flex-grow">
                      Engages industries, startups, CSR organizations and technology partners to provide funding, mentorship, infrastructure and technical support for promising solutions.
                    </p>
                    <div className="flex items-center text-[#55278c] font-bold text-sm cursor-pointer hover:underline mt-auto">
                      Learn More <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Bottom Goal Bar */}
            <div className="mt-8 bg-[#f8fbf9] border border-green-50/50 rounded-xl px-6 lg:px-8 py-5 flex flex-col lg:flex-row items-center gap-6 relative overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 shrink-0">
                <Leaf className="w-8 h-8 text-[#0f4b3a]" />
                <h3 className="text-[#0f4b3a] font-bold text-[19px] tracking-tight">Greater Impact <br/>for Society</h3>
              </div>
              
              <div className="hidden lg:block w-[1.5px] h-10 bg-[#0f4b3a] opacity-20"></div>

              <div className="flex-1 flex items-center">
                <span className="text-4xl font-serif text-[#0f4b3a] opacity-60 leading-[0] mr-3 mt-4">“</span>
                <p className="text-gray-600 text-[15px] font-medium italic">
                  "When citizens, government, academia and industry come together, we create practical solutions and build a more inclusive, prosperous and resilient Jharkhand."
                </p>
              </div>

              <div className="shrink-0 text-right">
                <div className="inline-block">
                  <span className="text-sm font-bold text-[#0f4b3a]">— JoharSethu</span>
                  <div className="w-full h-[3px] bg-green-600 mt-1.5 rounded-full"></div>
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
                <p className="text-gray-600 text-[15px] leading-relaxed font-medium">
                  We follow a structured and inclusive approach that combines citizen insights, academic expertise, industry collaboration and data-driven decision making to develop solutions that are practical, scalable and beneficial for the people of Jharkhand.
                </p>
              </div>

              {/* Right Column (Grid of 6 Cards) */}
              <div className="lg:w-[65%]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  
                  {/* Card 1 */}
                  <div className="bg-[#f0f7fd] border border-blue-50/50 rounded-xl p-5 transition-all hover:shadow-sm">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#e3eff8] text-[#1c64a3] font-black text-sm flex items-center justify-center shrink-0">01</div>
                      <Users className="w-8 h-8 text-[#1c64a3]" />
                    </div>
                    <h3 className="text-[#1c64a3] font-bold text-[14px] mb-2 text-center">People-Centred</h3>
                    <p className="text-gray-600 text-[12px] leading-relaxed text-center">
                      We start with real needs of citizens and communities, ensuring that grassroots challenges remain at the core of our efforts.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-[#f0faf5] border border-green-50/50 rounded-xl p-5 transition-all hover:shadow-sm">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#dcf3e7] text-[#0f4b3a] font-black text-sm flex items-center justify-center shrink-0">02</div>
                      <Search className="w-8 h-8 text-[#0f4b3a]" />
                    </div>
                    <h3 className="text-[#0f4b3a] font-bold text-[14px] mb-2 text-center">Evidence-Based &<br/>AI-Assisted Validation</h3>
                    <p className="text-gray-600 text-[12px] leading-relaxed text-center">
                      We verify, categorize and prioritize problems using available data and AI-assisted tools, with human oversight to ensure accuracy and relevance.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-[#fff9eb] border border-yellow-50/50 rounded-xl p-5 transition-all hover:shadow-sm">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#ffeed1] text-[#9c5f08] font-black text-sm flex items-center justify-center shrink-0">03</div>
                      <GraduationCap className="w-8 h-8 text-[#9c5f08]" />
                    </div>
                    <h3 className="text-[#9c5f08] font-bold text-[14px] mb-2 text-center">Right Expertise Matching</h3>
                    <p className="text-gray-600 text-[12px] leading-relaxed text-center">
                      We connect each problem with relevant universities, faculty members, researchers and students based on their domain expertise and interest.
                    </p>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-[#f6effb] border border-purple-50/50 rounded-xl p-5 transition-all hover:shadow-sm">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#ede1f7] text-[#55278c] font-black text-sm flex items-center justify-center shrink-0">04</div>
                      <Handshake className="w-8 h-8 text-[#55278c]" />
                    </div>
                    <h3 className="text-[#55278c] font-bold text-[14px] mb-2 text-center">Collaborative Problem Solving</h3>
                    <p className="text-gray-600 text-[12px] leading-relaxed text-center">
                      We enable collaboration between government, academia, industry and CSR partners to bring together resources, knowledge and support to develop effective solutions.
                    </p>
                  </div>

                  {/* Card 5 */}
                  <div className="bg-[#fdf0f4] border border-pink-50/50 rounded-xl p-5 transition-all hover:shadow-sm">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#fae3ea] text-[#a62c4a] font-black text-sm flex items-center justify-center shrink-0">05</div>
                      <Settings className="w-8 h-8 text-[#a62c4a]" />
                    </div>
                    <h3 className="text-[#a62c4a] font-bold text-[14px] mb-2 text-center">Iterative Development</h3>
                    <p className="text-gray-600 text-[12px] leading-relaxed text-center">
                      We promote an iterative approach — from research to prototype, field testing and feedback — to refine solutions and ensure they are practical and scalable.
                    </p>
                  </div>

                  {/* Card 6 */}
                  <div className="bg-[#eff5fc] border border-blue-50/50 rounded-xl p-5 transition-all hover:shadow-sm">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#e3eef9] text-[#2c5f93] font-black text-sm flex items-center justify-center shrink-0">06</div>
                      <BarChart2 className="w-8 h-8 text-[#2c5f93]" />
                    </div>
                    <h3 className="text-[#2c5f93] font-bold text-[14px] mb-2 text-center">Transparent & Measurable Progress</h3>
                    <p className="text-gray-600 text-[12px] leading-relaxed text-center">
                      We track progress, milestones and outcomes at every stage, ensuring accountability, transparency and real impact for the people of Jharkhand.
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* Bottom Goal Bar */}
            <div className="mt-8 bg-[#f8fbf9] border border-green-50/50 rounded-xl px-6 lg:px-8 py-5 flex flex-col lg:flex-row items-center gap-6 relative overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 shrink-0">
                <Target className="w-8 h-8 text-[#0f4b3a]" />
                <h3 className="text-[#0f4b3a] font-bold text-[19px] tracking-tight">Our Guiding Principle</h3>
              </div>
              
              <div className="hidden lg:block w-[1.5px] h-8 bg-[#0f4b3a] opacity-20"></div>

              <div className="flex-1 flex items-center">
                <span className="text-4xl font-serif text-[#0f4b3a] opacity-60 leading-[0] mr-3 mt-4">“</span>
                <p className="text-gray-600 text-[15px] font-medium italic">
                  "Collaborative efforts, driven by real needs and shared knowledge, can turn local challenges into lasting solutions for a better Jharkhand."
                </p>
              </div>

              <div className="shrink-0 text-right">
                <div className="inline-block">
                  <span className="text-sm font-bold text-[#0f4b3a]">— JoharSethu</span>
                  <div className="w-full h-[3px] bg-green-600 mt-1.5 rounded-full"></div>
                </div>
              </div>
            </div>
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
                <p className="text-gray-600 text-[15px] leading-relaxed font-medium">
                  We are committed to upholding the highest standards of transparency, inclusion, privacy and impact, ensuring that JoharSethu remains a trusted platform for everyone working towards a better Jharkhand.
                </p>
              </div>

              {/* Right Column (Grid of 6 Cards) */}
              <div className="lg:w-[65%]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  
                  {/* Card 1 */}
                  <div className="bg-[#f0f7fd] border border-blue-50/50 rounded-xl p-5 transition-all hover:shadow-sm">
                    <div className="flex flex-col items-center gap-3 mb-3">
                      <div className="flex w-full justify-between items-start">
                        <div className="w-8 h-8 rounded-full bg-[#e3eff8] text-[#1c64a3] font-black text-sm flex items-center justify-center">01</div>
                      </div>
                      <Eye className="w-8 h-8 text-[#1c64a3]" />
                      <h3 className="text-[#1c64a3] font-bold text-[14px] text-center">Transparency & Accountability</h3>
                    </div>
                    <p className="text-gray-600 text-[12px] leading-relaxed text-center">
                      We ensure clear processes, visible progress and accountable decision-making, so citizens and stakeholders can track the journey from problem to solution.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-[#f0faf5] border border-green-50/50 rounded-xl p-5 transition-all hover:shadow-sm">
                    <div className="flex flex-col items-center gap-3 mb-3">
                      <div className="flex w-full justify-between items-start">
                        <div className="w-8 h-8 rounded-full bg-[#dcf3e7] text-[#0f4b3a] font-black text-sm flex items-center justify-center">02</div>
                      </div>
                      <ShieldCheck className="w-8 h-8 text-[#0f4b3a]" />
                      <h3 className="text-[#0f4b3a] font-bold text-[14px] text-center">Privacy & Data Protection</h3>
                    </div>
                    <p className="text-gray-600 text-[12px] leading-relaxed text-center">
                      We are committed to protecting the personal information of citizens and stakeholders through responsible data handling and in line with applicable laws and policies.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-[#fff9eb] border border-yellow-50/50 rounded-xl p-5 transition-all hover:shadow-sm">
                    <div className="flex flex-col items-center gap-3 mb-3">
                      <div className="flex w-full justify-between items-start">
                        <div className="w-8 h-8 rounded-full bg-[#ffeed1] text-[#9c5f08] font-black text-sm flex items-center justify-center">03</div>
                      </div>
                      <Users className="w-8 h-8 text-[#9c5f08]" />
                      <h3 className="text-[#9c5f08] font-bold text-[14px] text-center">Accessibility & Inclusion</h3>
                    </div>
                    <p className="text-gray-600 text-[12px] leading-relaxed text-center">
                      We strive to make JoharSethu easy to access and use for people across Jharkhand, including citizens from rural and remote areas, with simple language and inclusive design.
                    </p>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-[#fdf0f4] border border-pink-50/50 rounded-xl p-5 transition-all hover:shadow-sm">
                    <div className="flex flex-col items-center gap-3 mb-3">
                      <div className="flex w-full justify-between items-start">
                        <div className="w-8 h-8 rounded-full bg-[#fae3ea] text-[#a62c4a] font-black text-sm flex items-center justify-center">04</div>
                      </div>
                      <BrainCircuit className="w-8 h-8 text-[#a62c4a]" />
                      <h3 className="text-[#a62c4a] font-bold text-[14px] text-center">Fair & Responsible AI</h3>
                    </div>
                    <p className="text-gray-600 text-[12px] leading-relaxed text-center">
                      We use AI to assist in problem validation and matching, while ensuring human oversight in all important decisions to maintain fairness, accuracy and trust.
                    </p>
                  </div>

                  {/* Card 5 */}
                  <div className="bg-[#f6effb] border border-purple-50/50 rounded-xl p-5 transition-all hover:shadow-sm">
                    <div className="flex flex-col items-center gap-3 mb-3">
                      <div className="flex w-full justify-between items-start">
                        <div className="w-8 h-8 rounded-full bg-[#ede1f7] text-[#55278c] font-black text-sm flex items-center justify-center">05</div>
                      </div>
                      <BadgeCheck className="w-8 h-8 text-[#55278c]" />
                      <h3 className="text-[#55278c] font-bold text-[14px] text-center">Quality & Real-World Impact</h3>
                    </div>
                    <p className="text-gray-600 text-[12px] leading-relaxed text-center">
                      We focus on practical, reliable and scalable solutions that can be deployed on the ground and create meaningful social, environmental and economic impact for the people of Jharkhand.
                    </p>
                  </div>

                  {/* Card 6 */}
                  <div className="bg-[#eff5fc] border border-blue-50/50 rounded-xl p-5 transition-all hover:shadow-sm">
                    <div className="flex flex-col items-center gap-3 mb-3">
                      <div className="flex w-full justify-between items-start">
                        <div className="w-8 h-8 rounded-full bg-[#e3eef9] text-[#2c5f93] font-black text-sm flex items-center justify-center">06</div>
                      </div>
                      <TrendingUp className="w-8 h-8 text-[#2c5f93]" />
                      <h3 className="text-[#2c5f93] font-bold text-[14px] text-center">Continuous Improvement</h3>
                    </div>
                    <p className="text-gray-600 text-[12px] leading-relaxed text-center">
                      We continuously learn from feedback, monitor outcomes and evolve the platform to serve citizens and all stakeholders better, and to meet the changing needs of Jharkhand.
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* Bottom Goal Bar */}
            <div className="mt-8 bg-[#f8fbf9] border border-green-50/50 rounded-xl px-6 lg:px-8 py-5 flex flex-col lg:flex-row items-center gap-6 relative overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 shrink-0">
                <Handshake className="w-8 h-8 text-[#0f4b3a]" />
                <h3 className="text-[#0f4b3a] font-bold text-[19px] tracking-tight">Our Commitment</h3>
              </div>
              
              <div className="hidden lg:block w-[1.5px] h-8 bg-[#0f4b3a] opacity-20"></div>

              <div className="flex-1 flex items-center">
                <span className="text-4xl font-serif text-[#0f4b3a] opacity-60 leading-[0] mr-3 mt-4">“</span>
                <p className="text-gray-600 text-[15px] font-medium italic">
                  "Technology should serve people — with transparency, responsibility and measurable impact."
                </p>
              </div>

              <div className="shrink-0 text-right">
                <div className="inline-block">
                  <span className="text-sm font-bold text-[#0f4b3a]">— JoharSethu</span>
                  <div className="w-full h-[3px] bg-green-600 mt-1.5 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}

      </section>
    </LandingLayout>
  );
};

export default AboutPage;
