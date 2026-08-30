import React, { useState, useEffect } from 'react';
import { X, Check, HelpCircle, AlertOctagon, UserPlus, GraduationCap, MapPin } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';

export const ChallengeActionModal = ({
  isOpen,
  type = 'accept', // 'accept' | 'clarify' | 'decline' | 'assign'
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
            if (Array.isArray(list) && list.length > 0) {
              setFacultyList(list);
              setSelectedFaculty(list[0].name);
            } else {
              const fallback = [{
                name: 'Prof. Rajesh Chandra',
                department: 'Civil & Environmental Engineering',
                designation: 'Professor & HOD',
                email: 'rajesh.chandra@university.ac.in'
              }];
              setFacultyList(fallback);
              setSelectedFaculty(fallback[0].name);
            }
          } catch (err) {
            console.warn('Error loading faculty list:', err);
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
    if (type === 'accept') {
      onSubmit({ type: 'accept', challengeId: challenge.id || challenge.challengeId });
    } else if (type === 'clarify') {
      onSubmit({ type: 'clarify', challengeId: challenge.id || challenge.challengeId, query: remarks });
    } else if (type === 'decline') {
      onSubmit({ type: 'decline', challengeId: challenge.id || challenge.challengeId, reason: declineReason, remarks });
    } else if (type === 'assign') {
      const fac = facultyList.find((f) => f.name === selectedFaculty) || facultyList[0] || { name: selectedFaculty, department: 'Applied Sciences' };
      onSubmit({
        type: 'assign',
        challengeId: challenge.id || challenge.challengeId,
        facultyName: fac.name,
        department: fac.department || 'Applied Sciences'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200/90 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
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
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
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
                By accepting this challenge, the university agrees to allocate faculty mentor guidance and student innovation prototyping resources.
              </p>
            </div>
          )}

          {type === 'clarify' && (() => {
            const nodalOfficer = challenge?.allocatedBy || challenge?.nodalOfficer || {};
            const nodalName = nodalOfficer.name || 'Ritu Verma';
            const nodalDesignation = nodalOfficer.designation || 'State Nodal Officer';
            const nodalPhone = nodalOfficer.phone || nodalOfficer.mobileNumber || '+91 9123456789';
            const nodalEmail = nodalOfficer.email || 'ritu.verma@jh.gov.in';

            return (
              <div className="space-y-3">
                {/* Nodal Officer Contact Card */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-amber-950 uppercase tracking-wider text-[10px] block">
                      State Nodal Desk & Direct Intercom
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
                      Govt. of Jharkhand
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-amber-900">
                    <div>
                      <span className="text-amber-700 block text-[10px]">Nodal Officer:</span>
                      <strong>{nodalName}</strong> <span className="text-[10px] text-amber-800">({nodalDesignation})</span>
                    </div>
                    <div>
                      <span className="text-amber-700 block text-[10px]">Helpline / Direct Call:</span>
                      <strong className="font-mono text-slate-900">{nodalPhone}</strong>
                    </div>
                  </div>
                  <div className="text-[10px] text-amber-800 font-mono">
                    <span className="text-amber-700">Official Email: </span>
                    <strong className="text-slate-900">{nodalEmail}</strong>
                  </div>
                  <p className="text-[10.5px] text-amber-800 font-medium border-t border-amber-200/80 pt-1.5 leading-snug">
                    You can call the State Nodal Officer directly or submit this technical clarification request. Once clarified, the university can <strong>Accept</strong> or <strong>Decline</strong> this challenge.
                  </p>
                </div>

                {/* Quick Template Queries */}
                <div className="space-y-1">
                  <span className="text-[10.5px] font-bold text-slate-500 block">Quick Query Templates:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Historical water test / borehole lab data missing',
                      'GPS survey boundary & forest clearance status needed',
                      'Request joint site inspection with BDO / Panchayat'
                    ].map((temp, tIdx) => (
                      <button
                        key={tIdx}
                        type="button"
                        onClick={() => setRemarks(temp)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-[#007A61] border border-slate-200 rounded-lg text-[10.5px] font-medium text-slate-700 cursor-pointer transition-colors text-left"
                      >
                        + {temp}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1.5">
                    Specific Technical Clarification / Missing Ground Data:
                  </label>
                  <textarea
                    rows={4}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Specify what technical parameter, lab report, or ground coordinate validation is needed from the State Nodal Officer / Department..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#007A61] focus:ring-1 focus:ring-[#007A61] outline-none transition-all resize-none shadow-2xs font-mono"
                  />
                </div>
              </div>
            );
          })()}

          {type === 'decline' && (
            <div className="space-y-2.5">
              <div>
                <label className="font-extrabold text-slate-900 block text-xs mb-1">
                  Reason for Decline:
                </label>
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
                <label className="font-extrabold text-slate-900 block text-xs mb-1">
                  Remarks for Nodal Officer <span className="text-rose-600 font-bold">*</span>:
                </label>
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

          {type === 'assign' && (
            <div className="space-y-2">
              <label className="font-extrabold text-slate-900 block text-xs">
                Select Registered Faculty Mentor:
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                {facultyList.map((f, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center justify-between p-2.5 border rounded-xl cursor-pointer transition-all ${
                      selectedFaculty === f.name
                        ? 'border-[#007A61] bg-emerald-50/50 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="radio"
                        name="faculty_modal"
                        checked={selectedFaculty === f.name}
                        onChange={() => setSelectedFaculty(f.name)}
                        className="text-[#007A61] focus:ring-[#007A61]"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{f.name}</div>
                        <div className="text-[10.5px] text-slate-500">{f.department || 'Faculty Mentor'}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-[#007A61] bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                      {f.designation || 'Active'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={(type === 'decline' && !remarks.trim()) || (type === 'clarify' && !remarks.trim())}
              className={`px-4 py-2 text-xs font-extrabold rounded-xl shadow-2xs transition-colors cursor-pointer ${
                (type === 'decline' && !remarks.trim()) || (type === 'clarify' && !remarks.trim())
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
