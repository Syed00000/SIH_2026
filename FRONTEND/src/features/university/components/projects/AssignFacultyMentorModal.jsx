import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  Search,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  BookOpen,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';

export const AssignFacultyMentorModal = ({
  isOpen,
  project,
  onClose,
  onSuccess
}) => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const fetchFaculty = async () => {
      setLoading(true);
      try {
        const data = await universityApiService.getFaculty();
        const list = Array.isArray(data) ? data : [];
        setFacultyList(list);

        // Preselect current project mentor if matching
        if (project?.facultyMentor?.name || project?.leadMentor) {
          const currentName = project.facultyMentor?.name || project.leadMentor;
          const matched = list.find((f) => f.name.toLowerCase() === currentName.toLowerCase());
          if (matched) setSelectedFaculty(matched);
        }
      } catch (err) {
        console.error('Failed to load faculty:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, [isOpen, project]);

  if (!isOpen || !project) return null;

  const departments = ['All', ...Array.from(new Set(facultyList.map((f) => f.department).filter(Boolean)))];

  const filteredFaculty = facultyList.filter((f) => {
    if (selectedDept !== 'All' && f.department !== selectedDept) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const spec = Array.isArray(f.specialization) ? f.specialization.join(' ') : (f.specialization || '');
      return (
        f.name.toLowerCase().includes(q) ||
        f.department.toLowerCase().includes(q) ||
        spec.toLowerCase().includes(q) ||
        (f.designation || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedFaculty) {
      setErrorMsg('Please select a faculty mentor from the directory.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        name: selectedFaculty.name,
        department: selectedFaculty.department,
        email: selectedFaculty.email,
        designation: selectedFaculty.designation || 'Lead Faculty Mentor'
      };

      const projId = project.projectId || project.id || project._id;
      const res = await universityApiService.assignFacultyToProject(projId, payload);

      if (onSuccess) {
        onSuccess(res?.data || res || { ...project, facultyMentor: payload, leadMentor: payload.name });
      }
      onClose();
    } catch (err) {
      console.error('Assign mentor error:', err);
      setErrorMsg(err.message || 'Failed to assign faculty mentor.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentMentorName = project.facultyMentor?.name || project.leadMentor;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200/90 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-[#f8fafc] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#007A61] flex items-center justify-center border border-emerald-200 shadow-2xs">
              <UserCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight flex items-center space-x-2">
                <span>Assign Lead Faculty Mentor</span>
                <span className="bg-emerald-100 text-emerald-900 text-[10.5px] font-black px-2 py-0.5 rounded border border-emerald-200">
                  {project.projectId || 'PRJ'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-md">
                {project.title} &bull; <span className="font-semibold text-slate-700">{project.domain}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Mentor Status Alert */}
        <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-xs flex-shrink-0">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-[#007A61]" />
            <span className="text-slate-600">Current Lead Mentor:</span>
            <span className="font-extrabold text-slate-900">
              {currentMentorName || 'Unassigned / Needs Mentor'}
            </span>
          </div>
          {currentMentorName && (
            <span className="text-[10.5px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold">
              Active Lead
            </span>
          )}
        </div>

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

        {/* Faculty List (Scrollable Area) */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2.5 custom-scrollbar bg-slate-50/40">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
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
            filteredFaculty.map((f) => {
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
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-[#f8fafc] flex items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs text-slate-600">
            {selectedFaculty ? (
              <span className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Selected Mentor: <strong className="text-slate-900">{selectedFaculty.name}</strong>
                </span>
              </span>
            ) : (
              <span className="text-slate-400">Select a faculty member from the directory above.</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedFaculty || submitting}
              onClick={handleAssign}
              className="px-5 py-2 bg-[#007A61] hover:bg-[#006650] disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center space-x-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>{submitting ? 'Assigning Mentor...' : 'Confirm Assignment'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignFacultyMentorModal;
