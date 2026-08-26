import React from 'react';
import { User, Award, ExternalLink } from 'lucide-react';

export const UniversityInfoSection = ({ university = {} }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 select-none">
      {/* Nodal Officer & Contact Details */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/90 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-1.5">
          <User className="w-3.5 h-3.5 text-blue-600" />
          <span>Nodal Officer & Contacts</span>
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-400">Nodal Officer Name:</span>
            <span className="font-bold text-slate-900">{university.nodalOfficer?.name || 'N/A'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-400">Designation:</span>
            <span className="font-medium text-slate-800">{university.nodalOfficer?.designation || 'Registrar'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-400">Nodal Email:</span>
            <span className="font-medium text-slate-800 select-all">{university.nodalOfficer?.email}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-400">Nodal Mobile:</span>
            <span className="font-medium text-slate-800">{university.nodalOfficer?.phone}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-400">General Email:</span>
            <span className="font-medium text-slate-800 select-all">{university.universityEmail}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Landline / Phone:</span>
            <span className="font-medium text-slate-800">{university.universityPhone || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Accreditation & Institutional Metadata */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/90 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-1.5">
          <Award className="w-3.5 h-3.5 text-blue-600" />
          <span>Accreditation & Institutional Info</span>
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-400">NAAC Grade:</span>
            <span className="font-bold text-slate-800">
              {university.accreditation?.naacGrade || 'A'}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-400">Accreditation Validity:</span>
            <span className="font-medium text-slate-800">{university.accreditation?.validity || '2028-12-31'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-400">NIRF Ranking:</span>
            <span className="font-bold text-slate-900">
              {university.accreditation?.nirfRanking ? `#${university.accreditation.nirfRanking}` : 'State Tier / Unranked'}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-400">Institution Category:</span>
            <span className="font-medium text-slate-800">{university.institutionCategory || 'University'}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Official Website:</span>
            {university.website ? (
              <a
                href={university.website}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-slate-900 hover:underline flex items-center space-x-1"
              >
                <span>{university.website}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-slate-400">N/A</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityInfoSection;
