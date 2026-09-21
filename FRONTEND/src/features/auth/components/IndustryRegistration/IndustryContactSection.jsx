import React from 'react';
import { User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../shared/components/ui/card.jsx';
import { Input } from '../../../../shared/components/ui/input.jsx';

export const IndustryContactSection = ({ formData, errors, handleInputChange }) => {
  return (
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
  );
};

export default IndustryContactSection;
