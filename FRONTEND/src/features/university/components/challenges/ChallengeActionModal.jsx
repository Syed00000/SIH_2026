import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';
import { ActionClarifyBody } from './actions/ActionClarifyBody.jsx';
import { ActionAssignBody } from './actions/ActionAssignBody.jsx';

export const ChallengeActionModal = ({
  isOpen,
  type = 'accept',
  challenge,
  facultyList: initialFacultyList,
  universityCode = 'RU001',
  onClose,
  onSubmit
}) => {
  const [remarks, setRemarks] = useState('');
  const [facultyList, setFacultyList] = useState(initialFacultyList || []);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [declineReason, setDeclineReason] = useState('Laboratory instrumentation outside institute scope');

  useEffect(() => {
    if (isOpen) {
      const loadFaculty = async () => {
        if (initialFacultyList && initialFacultyList.length > 0) {
          setFacultyList(initialFacultyList);
          setSelectedFaculty(initialFacultyList[0].name);
        } else {
          try {
            const list = await universityApiService.getFaculty(universityCode);
            const resolved = Array.isArray(list) ? list : [];
            setFacultyList(resolved);
            if (resolved.length > 0) {
              setSelectedFaculty(resolved[0].name);
            } else {
              setSelectedFaculty('');
            }
          } catch (err) {
            console.warn('Error loading faculty list:', err);
            setFacultyList([]);
          }
        }
      };
      loadFaculty();
    }
  }, [isOpen, universityCode, initialFacultyList]);

  if (!isOpen || !challenge) return null;

  const loc = challenge.location || challenge.locationDetails || {};
  const district = loc.district || challenge.district || 'Ranchi';

  const handleSubmit = (e) => {
    e.preventDefault();
    const cid = challenge.id || challenge.challengeId;
    if (type === 'accept') onSubmit({ type: 'accept', challengeId: cid });
    else if (type === 'clarify') onSubmit({ type: 'clarify', challengeId: cid, query: remarks });
    else if (type === 'decline') onSubmit({ type: 'decline', challengeId: cid, reason: declineReason, remarks });
    else if (type === 'assign') {
      const fac = facultyList.find((f) => f.name === selectedFaculty) || facultyList[0] || { name: selectedFaculty, department: 'Applied Sciences' };
      onSubmit({ type: 'assign', challengeId: cid, facultyName: fac.name, department: fac.department || 'Applied Sciences', facultyEmail: fac.email || '' });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200/90 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-left">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-emerald-50/60 to-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-extrabold text-xs text-[#007A61] bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">
              {challenge.id || challenge.challengeId}
            </span>
            <span className="text-xs font-extrabold text-slate-800">
              {type === 'accept' && '• Accept Challenge'}
              {type === 'clarify' && '• Request Clarification'}
              {type === 'decline' && '• Decline Allocation'}
              {type === 'assign' && '• Assign Faculty Mentor'}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs text-slate-700">
          <div>
            <h3 className="font-black text-slate-900 text-sm leading-snug">{challenge.title}</h3>
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-medium mt-1">
              <MapPin className="w-3 h-3 text-[#007A61]" />
              <span>{district}, Jharkhand</span>
              <span>&bull;</span>
              <span>Domain: <strong className="text-slate-700">{challenge.domain}</strong></span>
            </div>
          </div>

          {type === 'accept' && (
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
              <p className="text-xs text-emerald-900 leading-relaxed font-semibold">
                By accepting this challenge, the university agrees to allocate faculty mentor guidance and student innovation resources.
              </p>
            </div>
          )}

          {type === 'clarify' && <ActionClarifyBody challenge={challenge} remarks={remarks} setRemarks={setRemarks} />}

          {type === 'decline' && (
            <div className="space-y-2.5">
              <div>
                <label className="font-extrabold text-slate-900 block text-xs mb-1">Reason for Decline:</label>
                <select
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#007A61]"
                >
                  <option value="Laboratory instrumentation outside institute scope">Laboratory instrumentation outside institute scope</option>
                  <option value="Faculty mentoring capacity currently saturated">Faculty mentoring capacity currently saturated</option>
                  <option value="Request re-routing to agricultural university (BAU)">Request re-routing to agricultural university (BAU)</option>
                  <option value="Duplicate problem already addressed in district">Duplicate problem already addressed in district</option>
                </select>
              </div>
              <div>
                <label className="font-extrabold text-slate-900 block text-xs mb-1">Remarks for Nodal Officer *:</label>
                <textarea
                  required
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Provide detailed justification for State Nodal Cell..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#007A61] focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {type === 'assign' && <ActionAssignBody facultyList={facultyList} selectedFaculty={selectedFaculty} setSelectedFaculty={setSelectedFaculty} />}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-3.5 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={(type === 'decline' && !remarks.trim()) || (type === 'clarify' && !remarks.trim()) || (type === 'assign' && (!facultyList || facultyList.length === 0))}
              className={`px-4 py-2 text-xs font-extrabold rounded-xl shadow-2xs transition-colors cursor-pointer ${
                (type === 'decline' && !remarks.trim()) || (type === 'clarify' && !remarks.trim()) || (type === 'assign' && (!facultyList || facultyList.length === 0))
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  : 'bg-[#007A61] hover:bg-[#006650] text-white'
              }`}
            >
              {type === 'accept' && 'Confirm Acceptance'}
              {type === 'clarify' && 'Send Clarification'}
              {type === 'decline' && 'Confirm Decline'}
              {type === 'assign' && 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChallengeActionModal;
