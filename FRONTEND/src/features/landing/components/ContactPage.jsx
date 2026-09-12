import React, { useState } from 'react';
import { LandingLayout } from './layout/LandingLayout';
import { 
  Phone, Mail, Headphones, MapPin, Send, Building, 
  HelpCircle, ArrowRight, CheckCircle2, MessageSquare, 
  Handshake, Settings, Megaphone, Linkedin, Youtube, 
  Instagram, Twitter, ExternalLink, Globe
} from 'lucide-react';
import heroBanner from '../assets/hero-banner-2.jpg';
import jharkhandLeaf from '../assets/jharkhand_leaf.png';
import jsicOffice from '../assets/jsic-office.png';

export const ContactPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.subject || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <LandingLayout onNavigate={onNavigate} currentPath="/contact">
      {/* Hero Section */}
      <section className="w-full relative min-h-[340px] md:min-h-[380px] flex items-center overflow-hidden bg-[#0c382b] text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBanner} 
            alt="Johar Setu Contact Banner" 
            className="w-full h-full object-cover object-center opacity-85"
          />
          {/* Subtle gradient overlay from left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c382b]/95 via-[#0c382b]/75 to-transparent w-full md:w-[70%] z-0"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full px-4 md:px-8 lg:px-12 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight leading-none drop-shadow-md">
              Contact Us
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-emerald-200 mb-4 leading-snug">
              We're Here to Help
            </h2>

            <p className="text-gray-100 text-[14px] md:text-[15px] leading-relaxed font-medium max-w-xl drop-shadow-xs">
              Have questions, suggestions, or partnership opportunities? Get in touch with the Johar Setu team. Together, we can build a more innovative, inclusive and prosperous Jharkhand.
            </p>
          </div>
        </div>
      </section>

      {/* Main Body Section */}
      <div className="w-full bg-[#f8fafc] py-8 md:py-12">
        <div className="w-full px-4 md:px-8 lg:px-12 space-y-8">
          
          {/* Top 4 Quick Contact Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Call Us */}
            <div className="bg-white border border-gray-200/90 rounded-none p-4 shadow-2xs hover:shadow-xs transition-all flex items-start gap-3.5 group">
              <div className="w-10 h-10 bg-[#0f4b3a]/10 rounded-none flex items-center justify-center text-[#0f4b3a] shrink-0 group-hover:bg-[#0f4b3a] group-hover:text-white transition-all">
                <Phone className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-gray-900 leading-tight">Call Us</h3>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">For general inquiries and support</p>
                <p className="font-extrabold text-[#0f4b3a] text-[13px] mt-2 leading-tight">0651-2490070</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">(Mon – Fri, 10:00 AM – 5:00 PM)</p>
              </div>
            </div>

            {/* Email Us */}
            <div className="bg-white border border-gray-200/90 rounded-none p-4 shadow-2xs hover:shadow-xs transition-all flex items-start gap-3.5 group">
              <div className="w-10 h-10 bg-[#0f4b3a]/10 rounded-none flex items-center justify-center text-[#0f4b3a] shrink-0 group-hover:bg-[#0f4b3a] group-hover:text-white transition-all">
                <Mail className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-gray-900 leading-tight">Email Us</h3>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">Drop us an email anytime</p>
                <a href="mailto:secretary-dhte@jharkhandmail.gov.in" className="font-bold text-[#0f4b3a] text-[12.5px] mt-2 block leading-tight hover:underline truncate">
                  secretary-dhte@jharkhandmail.gov.in
                </a>
                <p className="text-[10px] text-gray-400 font-medium mt-1 leading-tight">We usually respond within 24–48 hours</p>
              </div>
            </div>

            {/* Help Center */}
            <div className="bg-white border border-gray-200/90 rounded-none p-4 shadow-2xs hover:shadow-xs transition-all flex items-start gap-3.5 group">
              <div className="w-10 h-10 bg-[#0f4b3a]/10 rounded-none flex items-center justify-center text-[#0f4b3a] shrink-0 group-hover:bg-[#0f4b3a] group-hover:text-white transition-all">
                <Headphones className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-gray-900 leading-tight">Help Center</h3>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">Find answers to common questions</p>
                <a href="#faqs" className="font-bold text-[#0f4b3a] text-[12.5px] mt-2 inline-flex items-center gap-1 leading-tight hover:underline">
                  <span>Visit Help Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <p className="text-[10px] text-gray-400 font-medium mt-1 leading-tight">FAQs, guides and resources</p>
              </div>
            </div>

            {/* Office Address */}
            <div className="bg-white border border-gray-200/90 rounded-none p-4 shadow-2xs hover:shadow-xs transition-all flex items-start gap-3.5 group">
              <div className="w-10 h-10 bg-[#0f4b3a]/10 rounded-none flex items-center justify-center text-[#0f4b3a] shrink-0 group-hover:bg-[#0f4b3a] group-hover:text-white transition-all">
                <MapPin className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-gray-900 leading-tight">Office Address</h3>
                <p className="text-[11.5px] font-bold text-gray-800 mt-1 leading-tight">Department of Higher, Technical Education & Skill Development</p>
                <p className="text-[11px] text-gray-600 leading-tight mt-0.5">3rd Floor, Yojana Bhawan, Nepal House, Doranda, Ranchi</p>
                <p className="text-[10px] font-semibold text-gray-500 mt-1 leading-tight">Jharkhand – 834002</p>
              </div>
            </div>

          </div>

          {/* Main 3-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Column 1: Our Office (6 cols on lg) */}
            <div className="lg:col-span-6 bg-white border border-gray-200/90 rounded-none p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                  <Building className="w-4 h-4 text-[#0f4b3a]" />
                  <h3 className="font-bold text-gray-900 text-sm tracking-tight">Our Office</h3>
                </div>

                <div className="space-y-1 text-xs text-gray-700 mb-4 font-medium leading-relaxed">
                  <p className="font-extrabold text-[#0f4b3a]">Department of Higher, Technical Education & Skill Development</p>
                  <p className="text-gray-600">Government of Jharkhand</p>
                  <p className="text-gray-600">3rd Floor, Yojana Bhawan</p>
                  <p className="text-gray-600">Nepal House, Doranda, Ranchi – 834002</p>
                  <p className="text-gray-600 font-bold">Jharkhand, India</p>
                </div>

                {/* Office Photo */}
                <div className="w-full overflow-hidden rounded-none border border-gray-200 mb-4 bg-gray-50">
                  <img 
                    src={jsicOffice} 
                    alt="Jharkhand State Innovation Cell Office" 
                    className="w-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <a 
                href="https://maps.google.com/?q=Yojana+Bhawan+Nepal+House+Doranda+Ranchi+Jharkhand" 
                target="_blank" 
                rel="noreferrer"
                className="w-full py-2 px-3 bg-emerald-50 border border-emerald-200 text-[#0f4b3a] text-xs font-bold rounded-none hover:bg-[#0f4b3a] hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-2xs text-center"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View on Google Maps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Column 2: Key Contacts & Follow Us (6 cols on lg) */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Key Contacts */}
              <div className="bg-white border border-gray-200/90 rounded-none p-4 shadow-2xs">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                  <Headphones className="w-4 h-4 text-[#0f4b3a]" />
                  <h3 className="font-bold text-gray-900 text-sm tracking-tight">Key Contacts</h3>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Secretary Office */}
                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-[#0f4b3a] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">Secretary, DHTE</h4>
                      <a href="mailto:secretary-dhte@jharkhandmail.gov.in" className="text-[11px] text-gray-600 hover:text-[#0f4b3a] block truncate">secretary-dhte@jharkhandmail.gov.in</a>
                      <p className="text-[10.5px] font-semibold text-gray-500 mt-0.5">0651-2490070</p>
                    </div>
                  </div>

                  {/* Partnership & Collaboration */}
                  <div className="flex items-start gap-2.5">
                    <Handshake className="w-4 h-4 text-[#0f4b3a] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">Partnership & Collaboration</h4>
                      <a href="mailto:secretary-dhte@jharkhandmail.gov.in" className="text-[11px] text-gray-600 hover:text-[#0f4b3a] block truncate">secretary-dhte@jharkhandmail.gov.in</a>
                      <p className="text-[10.5px] font-semibold text-gray-500 mt-0.5">0651-2490070</p>
                    </div>
                  </div>

                  {/* Technical Assistance */}
                  <div className="flex items-start gap-2.5">
                    <Settings className="w-4 h-4 text-[#0f4b3a] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">Technical Assistance</h4>
                      <a href="mailto:secretary-dhte@jharkhandmail.gov.in" className="text-[11px] text-gray-600 hover:text-[#0f4b3a] block truncate">secretary-dhte@jharkhandmail.gov.in</a>
                      <p className="text-[10.5px] font-semibold text-gray-500 mt-0.5">0651-2490070</p>
                    </div>
                  </div>

                  {/* Office Contact */}
                  <div className="flex items-start gap-2.5">
                    <Building className="w-4 h-4 text-[#0f4b3a] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">Office Address</h4>
                      <p className="text-[11px] text-gray-600">3rd Floor, Yojana Bhawan, Nepal House</p>
                      <p className="text-[10.5px] font-semibold text-gray-500 mt-0.5">Doranda, Ranchi – 834002</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Follow Us */}
              <div className="bg-white border border-gray-200/90 rounded-none p-4 shadow-2xs">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-[#0f4b3a]" />
                  <h3 className="font-bold text-gray-900 text-sm tracking-tight">Follow Us</h3>
                </div>
                <p className="text-[11px] text-gray-500 mb-3 leading-snug">
                  Stay connected for the latest updates, announcements and success stories.
                </p>

                <div className="flex items-center gap-2">
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-[#0077b5] text-white rounded-none flex items-center justify-center hover:opacity-90 transition-opacity">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-black text-white rounded-none flex items-center justify-center hover:opacity-90 transition-opacity">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-[#ff0000] text-white rounded-none flex items-center justify-center hover:opacity-90 transition-opacity">
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-[#e4405f] text-white rounded-none flex items-center justify-center hover:opacity-90 transition-opacity">
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Row: Frequently Asked Questions (FAQs) */}
          <div id="faqs" className="bg-white border border-gray-200/90 rounded-none p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#0f4b3a]" />
                <div>
                  <h3 className="text-base font-black text-gray-900 tracking-tight">Frequently Asked Questions</h3>
                  <p className="text-xs text-gray-500 font-medium">Find quick answers to common queries.</p>
                </div>
              </div>
              <a href="#faqs" className="text-xs font-bold text-[#0f4b3a] hover:underline flex items-center gap-1">
                <span>View All FAQs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* FAQ 1 */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-none flex items-start gap-3 hover:border-emerald-600 transition-colors">
                <MessageSquare className="w-5 h-5 text-[#0f4b3a] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-gray-900 leading-tight mb-1">How can I report a problem?</h4>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    You can report a problem through the "Report a Problem" section on our platform.
                  </p>
                </div>
              </div>

              {/* FAQ 2 */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-none flex items-start gap-3 hover:border-emerald-600 transition-colors">
                <Building className="w-5 h-5 text-[#0f4b3a] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-gray-900 leading-tight mb-1">How can my institution collaborate?</h4>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Universities and HEIs can register through the "Institutions" section.
                  </p>
                </div>
              </div>

              {/* FAQ 3 */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-none flex items-start gap-3 hover:border-emerald-600 transition-colors">
                <Handshake className="w-5 h-5 text-[#0f4b3a] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-gray-900 leading-tight mb-1">How can industry partners get involved?</h4>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Industry partners can connect with us through the "Industry" section or email us directly.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </LandingLayout>
  );
};

export default ContactPage;
