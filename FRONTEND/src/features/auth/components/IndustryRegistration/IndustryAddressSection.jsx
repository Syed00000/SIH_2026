import React from 'react';
import { MapPin, Send } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../shared/components/ui/card.jsx';
import { Button } from '../../../../shared/components/ui/button.jsx';
import { Input } from '../../../../shared/components/ui/input.jsx';
import { JHARKHAND_DISTRICTS } from './industryRegistrationConstants.js';

export const IndustryAddressSection = ({ formData, errors, isSubmitting, handleInputChange, onNavigate }) => {
  return (
    <>
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
    </>
  );
};

export default IndustryAddressSection;
