import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

const SUGGESTED_SKILLS = [
  'Water Quality Analysis',
  'IoT Sensors',
  'GIS & Remote Sensing',
  'Smart Grid',
  'Bioremediation',
  'Deep Learning',
  'Soil Chemistry',
  'Renewable Energy'
];

export const EditFacultyAcademicCard = ({
  formData,
  setFormData,
  specsList,
  handleQuickAddSkill,
  handleRemoveSkill
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4 text-left">
      <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
        <BookOpen className="w-4 h-4 text-slate-700" />
        <h3 className="text-sm font-extrabold text-slate-900">Academic Specialization & Background</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Highest Academic Qualification
          </label>
          <input
            type="text"
            value={formData.qualification}
            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
            placeholder="e.g. Ph.D. in Hydrogeology"
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Total Academic & Research Experience
          </label>
          <input
            type="text"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            placeholder="e.g. 10 Years"
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="sm:col-span-2 space-y-2">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Technical Research Domains (Comma Separated)
          </label>
          <input
            type="text"
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            placeholder="e.g. Water Quality, IoT Sensors, Data Analysis"
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            {specsList.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-bold"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-emerald-700 hover:text-rose-600 cursor-pointer ml-1"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-1.5 pt-1">
            <Sparkles className="w-3 h-3 text-slate-400" />
            <span className="text-[10.5px] font-bold text-slate-400">Quick Add:</span>
            <div className="flex flex-wrap gap-1">
              {SUGGESTED_SKILLS.map((sk) => (
                <button
                  key={sk}
                  type="button"
                  onClick={() => handleQuickAddSkill(sk)}
                  className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  + {sk}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Brief Professional Bio & Field Achievements
          </label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Outline lead research publications, patented innovations, and grassroots focus..."
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-900 leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};

export default EditFacultyAcademicCard;
