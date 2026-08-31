import React from 'react';
import { ArrowLeft, Edit3, Trash2, Loader2 } from 'lucide-react';

export const FacultyDetailHeader = ({
  faculty,
  onBack,
  onEdit,
  isDeleting,
  handleDelete
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 text-left">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <span className="cursor-pointer hover:text-slate-900" onClick={onBack}>Faculty Mentors</span>
          <span>&gt;</span>
          <span className="text-slate-900 font-bold">{faculty.name}</span>
        </div>
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{faculty.name}</h1>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-bold font-mono uppercase">
            {faculty.facultyId || faculty._id?.slice(-8) || 'FAC-0001'}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 self-start sm:self-auto">
        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-2 border border-slate-200 hover:bg-white text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={() => onEdit && onEdit(faculty)}
          className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
        <button
          disabled={isDeleting}
          onClick={handleDelete}
          className="px-3.5 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
        >
          {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          <span>{isDeleting ? 'Removing...' : 'Remove'}</span>
        </button>
      </div>
    </div>
  );
};

export default FacultyDetailHeader;
