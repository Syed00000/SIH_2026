import React from 'react';
import { Eye, Edit3 } from 'lucide-react';

export const FacultyTableRow = ({
  f,
  globalIndex,
  isSelected,
  onSelectFaculty,
  onEditFaculty
}) => {
  const name = f.name || 'Faculty Mentor';
  const firstLetter = name.replace(/^Dr\.\s*|^Prof\.\s*/i, '').charAt(0).toUpperCase() || 'F';
  const specs = Array.isArray(f.specialization)
    ? f.specialization
    : typeof f.specialization === 'string'
    ? f.specialization.split(',').map((s) => s.trim())
    : ['Water Resources', 'IoT'];

  const avail = f.availabilityStatus || 'Available';
  const isActive = f.status !== 'Inactive';
  const isDeployed = f.status === 'Deployed' || Boolean(f.isDeployed) || Boolean(f.isLocked);
  // If the faculty's assigned project is deployed, override availability
  const displayAvail = isDeployed ? 'Deployed' : avail;

  return (
    <tr
      onClick={() => onSelectFaculty(f)}
      className={`hover:bg-emerald-50/30 transition-colors group select-none cursor-pointer text-left ${
        isSelected ? 'bg-emerald-50/60 border-l-4 border-l-[#007A61]' : ''
      }`}
    >
      <td className="py-3 px-3 text-center font-mono text-[11px] font-bold text-slate-400">
        {globalIndex}
      </td>

      <td className="py-3 px-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#007A61] font-black text-xs flex items-center justify-center shrink-0 border border-emerald-200 shadow-2xs">
            {firstLetter}
          </div>
          <div className="min-w-0 max-w-[210px]">
            <div
              className="font-extrabold text-slate-900 group-hover:text-[#007A61] text-xs truncate leading-tight transition-colors"
              title={name}
            >
              {name}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
              ID: {f.facultyId || f.id || 'FAC'} &bull; {f.designation || 'Professor'}
            </div>
          </div>
        </div>
      </td>

      <td className="py-3 px-3">
        <div className="font-bold text-slate-800 text-xs truncate max-w-[140px]" title={f.department}>
          {f.department}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">{f.experience || '10 Years'} Exp</div>
      </td>

      <td className="py-3 px-3">
        <div className="font-bold text-slate-900 text-xs leading-tight truncate max-w-[150px]">
          {f.email}
        </div>
        <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
          {f.phone || '+91 94311 22334'}
        </div>
      </td>

      <td className="py-3 px-3">
        <div className="flex flex-wrap gap-1 max-w-[150px]">
          {specs.slice(0, 2).map((spec, sIdx) => (
            <span
              key={sIdx}
              className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-[10px] font-semibold"
            >
              {spec}
            </span>
          ))}
          {specs.length > 2 && (
            <span className="text-[10px] font-bold text-[#007A61] self-center">
              +{specs.length - 2}
            </span>
          )}
        </div>
      </td>

      <td className="py-3 px-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center space-x-1.5 text-[11px] font-bold ${
            isDeployed ? 'text-teal-700' :
            displayAvail === 'Available' ? 'text-[#007A61]' :
            displayAvail === 'In Project' ? 'text-amber-600' : 'text-slate-600'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isDeployed ? 'bg-teal-500' :
              displayAvail === 'Available' ? 'bg-[#007A61]' :
              displayAvail === 'In Project' ? 'bg-amber-500' : 'bg-slate-400'
            }`}
          />
          <span>{isDeployed ? '🔒 Deployed' : displayAvail}</span>
        </span>
      </td>

      <td className="py-3 px-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center space-x-1.5 text-[11px] font-extrabold ${
            isDeployed ? 'text-teal-700' : isActive ? 'text-[#007A61]' : 'text-rose-600'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isDeployed ? 'bg-teal-500' : isActive ? 'bg-[#007A61]' : 'bg-rose-500'}`} />
          <span>{isDeployed ? 'Deployed' : (isActive ? 'Active' : 'Inactive')}</span>
        </span>
      </td>

      <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end space-x-1">
          <button
            type="button"
            onClick={() => onSelectFaculty(f)}
            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Inspect Faculty Mentor Profile"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {onEditFaculty && (
            <button
              type="button"
              onClick={() => onEditFaculty(f)}
              className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Edit Faculty Mentor Credentials"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default FacultyTableRow;
