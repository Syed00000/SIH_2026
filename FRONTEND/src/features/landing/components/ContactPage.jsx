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
            alt="Johar Sethu Contact Banner" 
            className="w-full h-full object-cover object-center opacity-85"
          />
          {/* Subtle gradient overlay from left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c382b]/95 via-[#0c382b]/75 to-transparent w-full md:w-[70%] z-0"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full px-4 md:px-8 lg:px-12 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            {/* Breadcrumb */}
            <div className="text-[12px] font-bold text-emerald-300 tracking-wider flex items-center gap-2 mb-3 uppercase">
              <span>Home</span>
              <span className="text-gray-300">&gt;</span>
              <span>Contact</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight leading-none drop-shadow-md">
              Contact Us
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-emerald-200 mb-4 leading-snug">
              We're Here to Help
            </h2>

            <p className="text-gray-100 text-[14px] md:text-[15px] leading-relaxed font-medium max-w-xl drop-shadow-xs">
              Have questions, suggestions, or partnership opportunities? Get in touch with the Johar Sethu team. Together, we can build a more innovative, inclusive and prosperous Jharkhand.
            </p>
          </div>

          {/* Leaf Badge Overlay Graphic */}
          <div className="hidden lg:flex items-center justify-center shrink-0 pr-8">
            <div className="bg-white/15 backdrop-blur-md border border-white/30 p-5 rounded-none shadow-xl text-center max-w-[210px] transform rotate-1 hover:rotate-0 transition-all duration-300">
              <img src={jharkhandLeaf} alt="Jharkhand Leaf" className="w-10 h-10 mx-auto mb-2 object-contain" />
              <p className="text-white font-black text-sm leading-tight tracking-tight">
                Your Voice<br />
                <span className="text-emerald-300">Stronger</span><br />
                Jharkhand
              </p>
            </div>
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
                <p className="font-extrabold text-[#0f4b3a] text-[13px] mt-2 leading-tight">+91 651 240 0123</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">(Mon – Fri, 9:00 AM – 6:00 PM)</p>
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
                <a href="mailto:support@joharsethu.in" className="font-bold text-[#0f4b3a] text-[12.5px] mt-2 block leading-tight hover:underline truncate">
                  support@joharsethu.in
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
                <p className="text-[11.5px] font-bold text-gray-800 mt-1 leading-tight">Jharkhand State Innovation Cell (JSIC)</p>
                <p className="text-[11px] text-gray-600 leading-tight mt-0.5">Ranchi, Jharkhand</p>
                <p className="text-[10px] font-semibold text-gray-500 mt-1 leading-tight">Pin – 834008</p>
              </div>
            </div>

          </div>

          {/* Main 3-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Column 1: Send Us a Message Form (5 cols on lg) */}
            <div className="lg:col-span-6 bg-white border border-gray-200/90 rounded-none p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-1">
                <Send className="w-5 h-5 text-[#0f4b3a]" />
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Send Us a Message</h3>
              </div>
              <p className="text-xs text-gray-500 mb-6 font-medium">
                Fill out the form below and our team will get back to you soon.
              </p>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 text-center rounded-none animate-fadeIn space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-gray-900 text-base">Thank You for Reaching Out!</h4>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
                    Your message has been received successfully. A representative from Johar Sethu will get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
                    }}
                    className="mt-2 bg-[#0f4b3a] text-white text-xs font-bold px-4 py-2 rounded-none hover:bg-[#0c382b] transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                      <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-[#0f4b3a] text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email address" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-[#0f4b3a] text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-[#0f4b3a] text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Subject *</label>
                    <select 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-[#0f4b3a] text-xs font-medium bg-white text-gray-700"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="University Partnership">University Partnership</option>
                      <option value="Industry Collaboration">Industry Collaboration</option>
                      <option value="Report a Problem">Report a Problem</option>
                      <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Your Message *</label>
                    <textarea 
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Write your message here..." 
                      className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-[#0f4b3a] text-xs font-medium resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="bg-[#0f4b3a] hover:bg-[#0c382b] text-white px-5 py-2.5 rounded-none font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                  >
                    <span>Send Message</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Column 2: Our Office (3 cols on lg) */}
            <div className="lg:col-span-3 bg-white border border-gray-200/90 rounded-none p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                  <Building className="w-4 h-4 text-[#0f4b3a]" />
                  <h3 className="font-bold text-gray-900 text-sm tracking-tight">Our Office</h3>
                </div>

                <div className="space-y-1 text-xs text-gray-700 mb-4 font-medium leading-relaxed">
                  <p className="font-extrabold text-[#0f4b3a]">Jharkhand State Innovation Cell (JSIC)</p>
                  <p className="text-gray-600">Department of Higher & Technical Education</p>
                  <p className="text-gray-600">Government of Jharkhand</p>
                  <p className="text-gray-600">Kanke Road, Ranchi – 834008</p>
                  <p className="text-gray-600 font-bold">Jharkhand, India</p>
                </div>

                {/* Building Photo */}
                <div className="w-full h-36 overflow-hidden rounded-none border border-gray-200 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" 
                    alt="Vikas Bhawan Ranchi Office Building" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <a 
                href="https://maps.google.com/?q=Ranchi+Jharkhand" 
                target="_blank" 
                rel="noreferrer"
                className="w-full py-2 px-3 bg-emerald-50 border border-emerald-200 text-[#0f4b3a] text-xs font-bold rounded-none hover:bg-[#0f4b3a] hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-2xs text-center"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View on Google Maps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Column 3: Key Contacts & Follow Us (3 cols on lg) */}
            <div className="lg:col-span-3 space-y-4">
              
              {/* Key Contacts */}
              <div className="bg-white border border-gray-200/90 rounded-none p-4 shadow-2xs">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                  <Headphones className="w-4 h-4 text-[#0f4b3a]" />
                  <h3 className="font-bold text-gray-900 text-sm tracking-tight">Key Contacts</h3>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* General Support */}
                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-[#0f4b3a] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">General Support</h4>
                      <a href="mailto:support@joharsethu.in" className="text-[11px] text-gray-600 hover:text-[#0f4b3a] block truncate">support@joharsethu.in</a>
                      <p className="text-[10.5px] font-semibold text-gray-500 mt-0.5">+91 651 240 0123</p>
                    </div>
                  </div>

                  {/* Partnership & Collaboration */}
                  <div className="flex items-start gap-2.5">
                    <Handshake className="w-4 h-4 text-[#0f4b3a] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">Partnership & Collaboration</h4>
                      <a href="mailto:partnership@joharsethu.in" className="text-[11px] text-gray-600 hover:text-[#0f4b3a] block truncate">partnership@joharsethu.in</a>
                      <p className="text-[10.5px] font-semibold text-gray-500 mt-0.5">+91 651 240 0124</p>
                    </div>
                  </div>

                  {/* Technical Assistance */}
                  <div className="flex items-start gap-2.5">
                    <Settings className="w-4 h-4 text-[#0f4b3a] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">Technical Assistance</h4>
                      <a href="mailto:techsupport@joharsethu.in" className="text-[11px] text-gray-600 hover:text-[#0f4b3a] block truncate">techsupport@joharsethu.in</a>
                      <p className="text-[10.5px] font-semibold text-gray-500 mt-0.5">+91 651 240 0125</p>
                    </div>
                  </div>

                  {/* Media & Outreach */}
                  <div className="flex items-start gap-2.5">
                    <Megaphone className="w-4 h-4 text-[#0f4b3a] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">Media & Outreach</h4>
                      <a href="mailto:media@joharsethu.in" className="text-[11px] text-gray-600 hover:text-[#0f4b3a] block truncate">media@joharsethu.in</a>
                      <p className="text-[10.5px] font-semibold text-gray-500 mt-0.5">+91 651 240 0126</p>
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
