import React, { useState, useEffect } from 'react';
import { X, UserCheck, GraduationCap, Sparkles } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';
import { FacultyMentorList } from './FacultyMentorList.jsx';

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

        {/* Search Bar & Faculty List */}
        <FacultyMentorList
          loading={loading}
          errorMsg={errorMsg}
          filteredFaculty={filteredFaculty}
          selectedFaculty={selectedFaculty}
          setSelectedFaculty={setSelectedFaculty}
          currentMentorName={currentMentorName}
          search={search}
          setSearch={setSearch}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          departments={departments}
        />

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-[#f8fafc] flex items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs text-slate-600">
            {selectedFaculty ? (
              <span className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Selected Mentor: <strong className="text-slate-900">{selectedFaculty.name}</strong></span>
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
