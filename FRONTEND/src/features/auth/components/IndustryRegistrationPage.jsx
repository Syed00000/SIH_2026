import React, { useState } from 'react';
import {
  Building,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Send,
  User,
  MapPin,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/card.jsx';
import { Button } from '../../../shared/components/ui/button.jsx';
import { Input } from '../../../shared/components/ui/input.jsx';
import { industryService } from '../../government/services/industryService.js';

export const INDUSTRY_CATEGORIES = [
  'Private Industry',
  'MSME',
  'Govt Dept',
  'Research Lab',
  'Startup',
  'CSR',
  'PSU',
  'Industry Association',
  'Other'
];

export const THEMATIC_DOMAINS = [
  'Agriculture, Livelihoods',
  'Agriculture, Agri-tech',
  'AI / ML, Education',
  'AI / ML, IoT',
  'Healthcare, MedTech',
  'Healthcare, Mental Health',
  'Water Management',
  'Rural Livelihoods',
  'Education, Skill Dev.',
  'Innovation Ecosystem',
  'Clean Energy, Environment',
  'Infrastructure, Smart Cities',
  'Mining, Heavy Industry'
];

export const SUPPORT_MODES_LIST = [
  'Funding',
  'Mentorship',
  'Prototyping',
  'Tech Transfer',
  'Research',
  'Incubation',
  'CSR Support',
  'Skill Development'
];

export const JHARKHAND_DISTRICTS = [
  'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum',
  'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara',
  'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu',
  'Ramgarh', 'Ranchi', 'Sahibganj', 'Seraikela Kharsawan', 'Simdega', 'West Singhbhum'
];

export const IndustryRegistrationPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    category: 'Private Industry',
    legalName: '',
    shortName: '',
    registrationNumber: '',
    thematicDomain: 'Agriculture, Livelihoods',
    website: '',
    spocName: '',
    designation: 'Nodal Officer / Manager',
    officialEmail: '',
    mobileNumber: '',
    alternateContact: '',
    addressLine1: '',
    addressLine2: '',
    state: 'Jharkhand',
    district: 'Ranchi',
    city: 'Ranchi',
    pincode: '834001',
    supportModes: ['Funding', 'Mentorship']
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSupportModeToggle = (mode) => {
    setFormData((prev) => {
      const exists = prev.supportModes.includes(mode);
      return {
        ...prev,
        supportModes: exists
          ? prev.supportModes.filter((m) => m !== mode)
          : [...prev.supportModes, mode]
      };
    });
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.legalName.trim()) {
      errs.legalName = 'Organization Legal Name is required';
    }
    if (!formData.category) {
      errs.category = 'Category is required';
    }
    if (!formData.thematicDomain) {
      errs.thematicDomain = 'Primary domain is required';
    }
    if (!formData.spocName.trim()) {
      errs.spocName = 'Contact Person Name is required';
    }
    if (!formData.officialEmail.trim() || !formData.officialEmail.includes('@')) {
      errs.officialEmail = 'Valid official email address is required';
    }
    const cleanMobile = formData.mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      errs.mobileNumber = '10-digit mobile number is required';
    }
    if (!formData.addressLine1.trim()) {
      errs.addressLine1 = 'Address is required';
    }
    if (!formData.district) {
      errs.district = 'District is required';
    }
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) {
      errs.pincode = 'Valid 6-digit PIN Code is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      const firstError = Object.values(errors)[0] || 'Please fill in all required fields marked with *';
      setSubmitError(firstError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        category: formData.category,
        legalName: formData.legalName.trim(),
        shortName: formData.shortName.trim(),
        registrationNumber: formData.registrationNumber.trim(),
        thematicDomain: formData.thematicDomain,
        thematicDomains: [formData.thematicDomain],
        supportModes: formData.supportModes,
        website: formData.website.trim(),
        spocName: formData.spocName.trim(),
        designation: formData.designation.trim(),
        officialEmail: formData.officialEmail.trim().toLowerCase(),
        mobileNumber: formData.mobileNumber.trim(),
        alternateContact: formData.alternateContact.trim(),
        address: {
          addressLine1: formData.addressLine1.trim(),
          addressLine2: formData.addressLine2.trim(),
          state: formData.state,
          district: formData.district,
          city: formData.city.trim(),
          pincode: formData.pincode.trim()
        }
      };

      const res = await industryService.applyIndustry(payload);
      setApplicationSuccess(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit application. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (applicationSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
        <Card className="max-w-lg w-full bg-white border border-slate-300 shadow-md rounded-xl p-6 sm:p-8 text-center animate-fadeIn text-black">
          
          <div className="flex justify-center mb-4">
            <img
              src="https://www.jharkhand.gov.in/images/jhlogo55.PNG"
              alt="Government of Jharkhand"
              className="w-14 h-14 object-contain"
            />
          </div>

          <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-300">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-black tracking-tight">
            Application Submitted Successfully
          </h2>
          <p className="text-black text-xs mt-1.5 leading-relaxed font-medium">
            Your application for <strong>{applicationSuccess.legalName}</strong> has been received by the Government of Jharkhand.
          </p>

          <div className="my-5 p-4 bg-slate-50 border border-slate-300 rounded-lg text-left space-y-2.5 text-xs text-black">
            <div className="flex justify-between items-center">
              <span className="text-black font-semibold">Application Reference ID:</span>
              <span className="font-mono font-bold text-black bg-white px-2 py-0.5 rounded border border-slate-300">
                {applicationSuccess.industryId}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black font-semibold">Official Email:</span>
              <span className="font-bold text-black">{applicationSuccess.officialEmail}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black font-semibold">Status:</span>
              <span className="inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-950 font-bold rounded border border-amber-300 text-[11px]">
                Pending Government Review
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50 border border-blue-300 rounded-lg text-left text-xs text-black space-y-1 mb-6">
            <div className="flex items-center font-bold text-black">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-blue-700 shrink-0" />
              <span>What happens next?</span>
            </div>
            <p className="text-[12px] leading-relaxed text-black font-medium">
              Government officials will review your organization details. Once approved, your portal login email and password will be sent directly to <strong>{applicationSuccess.officialEmail}</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => onNavigate ? onNavigate('/login') : (window.location.href = '/login')}
              className="flex-1 bg-black hover:bg-slate-900 text-white font-bold py-2 rounded-md text-xs"
            >
              Go to Portal Login
            </Button>
            <Button
              onClick={() => {
                setApplicationSuccess(null);
                setFormData({
                  category: 'Private Industry',
                  legalName: '',
                  shortName: '',
                  registrationNumber: '',
                  thematicDomain: 'Agriculture, Livelihoods',
                  website: '',
                  spocName: '',
                  designation: 'Nodal Officer / Manager',
                  officialEmail: '',
                  mobileNumber: '',
                  alternateContact: '',
                  addressLine1: '',
                  addressLine2: '',
                  state: 'Jharkhand',
                  district: 'Ranchi',
                  city: 'Ranchi',
                  pincode: '834001',
                  supportModes: ['Funding', 'Mentorship']
                });
              }}
              variant="outline"
              className="flex-1 border-slate-400 text-black hover:bg-slate-100 font-bold py-2 rounded-md text-xs"
            >
              Submit Another Form
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 text-black">
      <div className="max-w-3xl mx-auto space-y-5">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate ? onNavigate('/login') : (window.location.href = '/login')}
            className="inline-flex items-center text-xs font-bold text-black hover:text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded-md shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5 text-black" />
            <span>Back to Login</span>
          </button>
          
          <span className="text-xs font-bold text-black">
            Government of Jharkhand &bull; JoharSetu
          </span>
        </div>

        {/* Portal Header Card */}
        <Card className="bg-white border border-slate-300 shadow-sm rounded-xl p-6 text-center text-black">
          <div className="flex justify-center mb-3">
            <img
              src="https://www.jharkhand.gov.in/images/jhlogo55.PNG"
              alt="Government of Jharkhand"
              className="w-14 h-14 object-contain"
            />
          </div>
          <h1 className="text-xl font-extrabold text-black tracking-tight">
            Industry & Partner Registration Form
          </h1>
          <p className="text-black font-semibold text-xs mt-1">
            Department of Higher & Technical Education, Government of Jharkhand
          </p>
          <p className="text-black font-medium text-xs mt-2 max-w-xl mx-auto leading-relaxed">
            Fill out the form below to apply for industry partnership. Your application will be verified by the department, and login credentials will be emailed to your official contact.
          </p>
        </Card>

        {/* Government Policy Notice */}
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-3.5 text-xs text-black flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-extrabold text-black">Important Notice:</span>
            <p className="text-black font-medium leading-relaxed text-[12px]">
              You do not need to create a password right now. After government verification, official login credentials will be generated and emailed to your Contact Person’s official email.
            </p>
          </div>
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-3.5 text-xs font-bold text-red-900 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* 1. ORGANIZATION DETAILS */}
          <Card className="bg-white border border-slate-300 shadow-sm rounded-xl overflow-hidden text-black">
            <CardHeader className="bg-slate-100 border-b border-slate-300 py-3 px-5">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-black" />
                <CardTitle className="text-sm font-extrabold text-black">1. Organization Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Legal Name */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-black block">
                    Organization / Company Name <span className="text-red-600 font-bold">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Tata Steel Foundation / Ranchi Smart Tech Pvt. Ltd."
                    value={formData.legalName}
                    onChange={(e) => handleInputChange('legalName', e.target.value)}
                    className={`h-9 text-xs font-medium text-black placeholder:text-slate-400 bg-white border-slate-300 ${errors.legalName ? 'border-red-600' : ''}`}
                    required
                  />
                  {errors.legalName && <p className="text-[11px] font-bold text-red-600">{errors.legalName}</p>}
                </div>

                {/* Short Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black block">Short Name / Acronym</label>
                  <Input
                    type="text"
                    placeholder="e.g. TSF, RSTECH"
                    value={formData.shortName}
                    onChange={(e) => handleInputChange('shortName', e.target.value.toUpperCase())}
                    className="h-9 text-xs font-medium text-black placeholder:text-slate-400 bg-white border-slate-300"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black block">
                    Organization Category <span className="text-red-600 font-bold">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full h-9 px-3 border border-slate-300 rounded-md text-xs bg-white text-black font-semibold focus:ring-1 focus:ring-black focus:border-black"
                    required
                  >
                    {INDUSTRY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="text-black">{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Registration / CIN Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black block">CIN / Registration / Udyam Number</label>
                  <Input
                    type="text"
                    placeholder="e.g. U85300JH2016NPL009028"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    className="h-9 text-xs font-medium text-black placeholder:text-slate-400 bg-white border-slate-300"
                  />
                </div>

                {/* Website */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black block">Website</label>
                  <Input
                    type="url"
                    placeholder="https://www.example.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="h-9 text-xs font-medium text-black placeholder:text-slate-400 bg-white border-slate-300"
                  />
                </div>

              </div>
            </CardContent>
          </Card>

          {/* 2. WORK DOMAIN & SUPPORT */}
          <Card className="bg-white border border-slate-300 shadow-sm rounded-xl overflow-hidden text-black">
            <CardHeader className="bg-slate-100 border-b border-slate-300 py-3 px-5">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-black" />
                <CardTitle className="text-sm font-extrabold text-black">2. Domain & Support Type</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              
              {/* Thematic Domain */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-black block">
                  Primary Domain of Work <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  value={formData.thematicDomain}
                  onChange={(e) => handleInputChange('thematicDomain', e.target.value)}
                  className="w-full h-9 px-3 border border-slate-300 rounded-md text-xs bg-white text-black font-semibold focus:ring-1 focus:ring-black focus:border-black"
                  required
                >
                  {THEMATIC_DOMAINS.map((domain) => (
                    <option key={domain} value={domain} className="text-black">{domain}</option>
                  ))}
                </select>
              </div>

              {/* Modes of Support */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black block">
                  How can your organization support Jharkhand students & colleges?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SUPPORT_MODES_LIST.map((mode) => {
                    const isSelected = formData.supportModes.includes(mode);
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => handleSupportModeToggle(mode)}
                        className={`p-2 rounded-md border text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-100 border-emerald-600 text-black font-extrabold'
                            : 'bg-white border-slate-300 text-black hover:border-slate-400'
                        }`}
                      >
                        <span>{mode}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* 3. CONTACT PERSON DETAILS */}
          <Card className="bg-white border border-slate-300 shadow-sm rounded-xl overflow-hidden text-black">
            <CardHeader className="bg-slate-100 border-b border-slate-300 py-3 px-5">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-black" />
                <CardTitle className="text-sm font-extrabold text-black">3. Contact Person Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* SPOC Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black block">
                    Full Name <span className="text-red-600 font-bold">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Sourav Roy / Rajesh Verma"
                    value={formData.spocName}
                    onChange={(e) => handleInputChange('spocName', e.target.value)}
                    className={`h-9 text-xs font-medium text-black placeholder:text-slate-400 bg-white border-slate-300 ${errors.spocName ? 'border-red-600' : ''}`}
                    required
                  />
                  {errors.spocName && <p className="text-[11px] font-bold text-red-600">{errors.spocName}</p>}
                </div>

                {/* Designation */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black block">Designation</label>
                  <Input
                    type="text"
                    placeholder="e.g. CSR Head / Director / Manager"
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    className="h-9 text-xs font-medium text-black placeholder:text-slate-400 bg-white border-slate-300"
                  />
                </div>

                {/* Official Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black block">
                    Official Email Address <span className="text-red-600 font-bold">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="contact@company.com"
                    value={formData.officialEmail}
                    onChange={(e) => handleInputChange('officialEmail', e.target.value)}
                    className={`h-9 text-xs font-medium text-black placeholder:text-slate-400 bg-white border-slate-300 ${errors.officialEmail ? 'border-red-600' : ''}`}
                    required
                  />
                  <p className="text-[11px] font-semibold text-black">Portal credentials will be sent to this email address.</p>
                  {errors.officialEmail && <p className="text-[11px] font-bold text-red-600">{errors.officialEmail}</p>}
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black block">
                    Mobile Number <span className="text-red-600 font-bold">*</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="9835012345"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                    maxLength={10}
                    className={`h-9 text-xs font-medium text-black placeholder:text-slate-400 bg-white border-slate-300 ${errors.mobileNumber ? 'border-red-600' : ''}`}
                    required
                  />
                  {errors.mobileNumber && <p className="text-[11px] font-bold text-red-600">{errors.mobileNumber}</p>}
                </div>

                {/* Alternate Contact */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-black block">Alternate Phone / Landline (Optional)</label>
                  <Input
                    type="text"
                    placeholder="e.g. 0651-2299881"
                    value={formData.alternateContact}
                    onChange={(e) => handleInputChange('alternateContact', e.target.value)}
                    className="h-9 text-xs font-medium text-black placeholder:text-slate-400 bg-white border-slate-300"
                  />
                </div>

              </div>
            </CardContent>
          </Card>

          {/* 4. ADDRESS */}
          <Card className="bg-white border border-slate-300 shadow-sm rounded-xl overflow-hidden text-black">
            <CardHeader className="bg-slate-100 border-b border-slate-300 py-3 px-5">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-black" />
                <CardTitle className="text-sm font-extrabold text-black">4. Office Address in Jharkhand</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Address Line 1 */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-black block">
                    Address Line 1 <span className="text-red-600 font-bold">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Plot / Street / Industrial Area"
                    value={formData.addressLine1}
                    onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                    className={`h-9 text-xs font-medium text-black placeholder:text-slate-400 bg-white border-slate-300 ${errors.addressLine1 ? 'border-red-600' : ''}`}
                    required
                  />
                </div>

                {/* Address Line 2 */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-black block">Address Line 2 (Optional)</label>
                  <Input
                    type="text"
                    placeholder="Landmark / Area"
                    value={formData.addressLine2}
                    onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                    className="h-9 text-xs font-medium text-black placeholder:text-slate-400 bg-white border-slate-300"
                  />
                </div>

                {/* District */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black block">
                    District <span className="text-red-600 font-bold">*</span>
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="w-full h-9 px-3 border border-slate-300 rounded-md text-xs bg-white text-black font-semibold focus:ring-1 focus:ring-black focus:border-black"
                    required
                  >
                    {JHARKHAND_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist} className="text-black">{dist}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black block">City</label>
                  <Input
                    type="text"
                    placeholder="Ranchi / Jamshedpur"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="h-9 text-xs font-medium text-black placeholder:text-slate-400 bg-white border-slate-300"
                  />
                </div>

                {/* State */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black block">State</label>
                  <Input
                    type="text"
                    value={formData.state}
                    disabled
                    className="h-9 text-xs bg-slate-200 text-black font-bold cursor-not-allowed border-slate-300"
                  />
                </div>

                {/* PIN Code */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black block">
                    PIN Code <span className="text-red-600 font-bold">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="834001"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    maxLength={6}
                    className={`h-9 text-xs font-medium text-black placeholder:text-slate-400 bg-white border-slate-300 ${errors.pincode ? 'border-red-600' : ''}`}
                    required
                  />
                  {errors.pincode && <p className="text-[11px] font-bold text-red-600">{errors.pincode}</p>}
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Action Bar */}
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-black">
            <p className="text-xs text-black font-medium">
              Please double-check your official email and phone number before submitting.
            </p>
            
            <div className="flex items-center space-x-2.5 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigate ? onNavigate('/login') : (window.location.href = '/login')}
                className="flex-1 sm:flex-none border-slate-400 text-black hover:bg-slate-100 text-xs font-bold py-2 px-4 rounded-md"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none bg-black hover:bg-slate-900 text-white text-xs font-bold py-2 px-5 rounded-md flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Application</span>
                  </>
                )}
              </Button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default IndustryRegistrationPage;
