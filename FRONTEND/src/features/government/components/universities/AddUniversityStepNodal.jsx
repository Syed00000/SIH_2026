import React from 'react';
import { User } from 'lucide-react';

export const AddUniversityStepNodal = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/90 shadow-2xs space-y-4 select-none">
      <div className="border-b border-slate-100 pb-2 flex items-center space-x-2">
        <User className="w-4 h-4 text-blue-600" />
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Step 2: Nodal Officer & Contact Details</h2>
          <p className="text-[10px] text-slate-400 font-medium">Designate the administrative lead responsible for university communications.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
            Nodal Officer Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.nodalOfficerName}
            onChange={(e) => onInputChange('nodalOfficerName', e.target.value)}
            placeholder="e.g. Dr. Ramesh Kumar"
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 shadow-2xs"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Designation</label>
          <input
            type="text"
            value={formData.nodalOfficerDesignation}
            onChange={(e) => onInputChange('nodalOfficerDesignation', e.target.value)}
            placeholder="e.g. Registrar / Dean R&D"
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
            Nodal Officer Official Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.nodalOfficerEmail}
            onChange={(e) => onInputChange('nodalOfficerEmail', e.target.value)}
            placeholder="nodal@university.ac.in"
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Nodal Contact Number</label>
          <input
            type="text"
            value={formData.nodalOfficerPhone}
            onChange={(e) => onInputChange('nodalOfficerPhone', e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">University General Email</label>
          <input
            type="email"
            value={formData.universityEmail}
            onChange={(e) => onInputChange('universityEmail', e.target.value)}
            placeholder="info@university.ac.in"
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">University Landline / Phone</label>
          <input
            type="text"
            value={formData.universityPhone}
            onChange={(e) => onInputChange('universityPhone', e.target.value)}
            placeholder="0651-2233445"
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
};

export default AddUniversityStepNodal;
