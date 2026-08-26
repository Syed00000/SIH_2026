import React from 'react';
import { User } from 'lucide-react';

export const EditUniversityNodalSection = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/90 shadow-2xs space-y-3.5 select-none">
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-1.5">
        <User className="w-3.5 h-3.5 text-blue-600" />
        <span>2. Nodal Officer & Contact Information</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Nodal Officer Name *</label>
          <input
            type="text"
            value={formData.nodalOfficerName}
            onChange={(e) => onInputChange('nodalOfficerName', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Nodal Officer Designation</label>
          <input
            type="text"
            value={formData.nodalOfficerDesignation}
            onChange={(e) => onInputChange('nodalOfficerDesignation', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Nodal Officer Email *</label>
          <input
            type="email"
            value={formData.nodalOfficerEmail}
            onChange={(e) => onInputChange('nodalOfficerEmail', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Nodal Officer Phone *</label>
          <input
            type="text"
            value={formData.nodalOfficerPhone}
            onChange={(e) => onInputChange('nodalOfficerPhone', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">University General Email</label>
          <input
            type="email"
            value={formData.universityEmail}
            onChange={(e) => onInputChange('universityEmail', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">University Landline / Phone</label>
          <input
            type="text"
            value={formData.universityPhone}
            onChange={(e) => onInputChange('universityPhone', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
};

export default EditUniversityNodalSection;
