import React from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export const EditFacultyHeader = ({ onBack, loading }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 text-left">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <button
            type="button"
            onClick={onBack}
            className="hover:text-slate-900 flex items-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Faculty Mentors</span>
          </button>
          <span>/</span>
          <span className="text-slate-800 font-bold">Edit Profile</span>
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Modify Faculty Mentor Credentials & Allocation
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Update department affiliation, research domains, student project mentorship capacity, and login credentials.
        </p>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="edit-faculty-form"
          disabled={loading}
          className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>{loading ? 'Saving Changes...' : 'Save Updates'}</span>
        </button>
      </div>
    </div>
  );
};

export default EditFacultyHeader;
