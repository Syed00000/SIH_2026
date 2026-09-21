import React from 'react';
import { Building } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../shared/components/ui/card.jsx';
import { Input } from '../../../../shared/components/ui/input.jsx';
import { INDUSTRY_CATEGORIES } from './industryRegistrationConstants.js';

export const IndustryOrgDetailsSection = ({ formData, errors, handleInputChange }) => {
  return (
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
  );
};

export default IndustryOrgDetailsSection;
