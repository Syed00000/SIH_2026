import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../shared/components/ui/card.jsx';
import { THEMATIC_DOMAINS, SUPPORT_MODES_LIST } from './industryRegistrationConstants.js';

export const IndustryDomainSupportSection = ({ formData, handleInputChange, handleSupportModeToggle }) => {
  return (
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
  );
};

export default IndustryDomainSupportSection;
