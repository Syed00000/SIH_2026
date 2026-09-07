import React from 'react';
import { BookOpen, Briefcase, CheckCircle2, AlertCircle, Search } from 'lucide-react';

export const FacultyMentorList = ({
  loading,
  errorMsg,
  filteredFaculty,
  selectedFaculty,
  setSelectedFaculty,
  currentMentorName,
  search,
  setSearch,
  selectedDept,
  setSelectedDept,
  departments
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Search & Filter Bar */}
      <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-center gap-2.5 flex-shrink-0">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search faculty by name, specialization, department..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white transition-all shadow-2xs"
          />
        </div>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#007A61] shadow-2xs"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept === 'All' ? 'All Departments' : dept}
            </option>
          ))}
        </select>
      </div>

      {/* List Container */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-slate-50/40">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2 mb-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <div className="w-7 h-7 border-2 border-[#007A61] border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-xs font-semibold text-slate-600">Loading university faculty directory...</div>
          </div>
        ) : filteredFaculty.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="text-xs font-bold text-slate-700">No faculty members found</div>
            <p className="text-[11px] text-slate-500">Try changing your search terms or department filter.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredFaculty.map((f) => {
              const isSelected = selectedFaculty?.email === f.email || selectedFaculty?.name === f.name;
              const isCurrent = currentMentorName && f.name.toLowerCase() === currentMentorName.toLowerCase();
              const specializations = Array.isArray(f.specialization)
                ? f.specialization
                : typeof f.specialization === 'string'
                ? f.specialization.split(',').map((s) => s.trim()).filter(Boolean)
                : [];

              return (
                <div
                  key={f._id || f.email || f.name}
                  onClick={() => setSelectedFaculty(f)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/80 border-[#007A61] ring-2 ring-[#007A61]/30 shadow-xs'
                      : 'bg-white border-slate-200/90 hover:border-emerald-300 hover:bg-slate-50/70 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#007A61] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {f.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-slate-900 text-xs leading-tight">
                          {f.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[9.5px] font-black text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                            Current
                          </span>
                        )}
                        <span
                          className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded ${
                            f.availabilityStatus === 'Available'
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {f.availabilityStatus || 'Available'}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 font-medium">
                        {f.designation || 'Professor'} &bull; <span className="text-slate-800">{f.department}</span>
                      </div>

                      {specializations.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {specializations.slice(0, 3).map((spec, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono"
                            >
                              {spec}
                            </span>
                          ))}
                          {specializations.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-bold self-center">
                              +{specializations.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between shrink-0 space-y-2">
                    <div className="text-[10.5px] font-bold text-slate-500 flex items-center space-x-1">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      <span>{f.activeProjects || f.currentLoad || 0} Projects</span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-[#007A61] bg-[#007A61] text-white shadow-2xs'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyMentorList;
