import React from 'react';
import { Building, Globe, CheckCircle2, Mail, MapPin } from 'lucide-react';

export const ApproveIndustryDetailsSection = ({ industry = {} }) => {
  const supportModes = Array.isArray(industry.supportModes)
    ? industry.supportModes
    : [industry.supportModes || 'Funding'];

  return (
    <div className="space-y-4 select-none text-xs text-slate-700">
      {/* Section 1: Organization Details */}
      <div>
        <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
          <Building className="w-3.5 h-3.5 text-blue-600" />
          <span>Organization Details</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50/70 p-3.5 rounded-md border border-slate-200/80">
          <div>
            <span className="text-slate-400 font-medium block text-[10px]">Category</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{industry.category}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block text-[10px]">Short Name</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{industry.shortName || '—'}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block text-[10px]">CIN / Reg Number</span>
            <span className="font-mono font-bold text-slate-800 mt-0.5 block">{industry.registrationNumber || '—'}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block text-[10px]">Thematic Domain</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{industry.thematicDomain}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block text-[10px]">Location</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{industry.address?.city || industry.address?.district}, Jharkhand</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block text-[10px]">Website</span>
            {industry.website ? (
              <a
                href={industry.website}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-slate-900 hover:underline mt-0.5 flex items-center space-x-1 truncate"
              >
                <Globe className="w-3 h-3 shrink-0" />
                <span className="truncate">{industry.website.replace(/^https?:\/\//, '')}</span>
              </a>
            ) : (
              <span className="text-slate-400 mt-0.5 block">—</span>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Modes of Support */}
      <div>
        <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Modes of Support Offered</span>
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {supportModes.map((mode) => (
            <span
              key={mode}
              className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-md font-semibold text-[11px]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>{mode}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Section 3: Contact Person Details */}
      <div>
        <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
          <Mail className="w-3.5 h-3.5 text-blue-600" />
          <span>Contact Person Details</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50/70 p-3.5 rounded-md border border-slate-200/80">
          <div>
            <span className="text-slate-400 font-medium block text-[10px]">Contact Person Name</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{industry.spocName}</span>
            <span className="text-[11px] text-slate-500 font-medium block">{industry.designation}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block text-[10px]">Official Email</span>
            <span className="font-mono font-bold text-slate-800 mt-0.5 block">{industry.officialEmail}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block text-[10px]">Mobile Number</span>
            <span className="font-mono font-semibold text-slate-800 mt-0.5 block">{industry.mobileNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block text-[10px]">Alternate Phone</span>
            <span className="text-slate-600 mt-0.5 block">{industry.alternateContact || '—'}</span>
          </div>
        </div>
      </div>

      {/* Section 4: Address */}
      <div>
        <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Office Address</span>
        </h4>
        <div className="bg-slate-50/70 p-3.5 rounded-md border border-slate-200/80 space-y-1">
          <p className="font-semibold text-slate-800">{industry.address?.addressLine1 || '—'}</p>
          {industry.address?.addressLine2 && <p className="text-slate-600">{industry.address.addressLine2}</p>}
          <p className="text-slate-600 font-medium">
            {industry.address?.city}, {industry.address?.district}, {industry.address?.state} -{' '}
            <span className="font-mono font-bold text-slate-800">{industry.address?.pincode}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApproveIndustryDetailsSection;
