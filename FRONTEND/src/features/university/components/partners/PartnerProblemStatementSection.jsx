import React, { useState, useEffect } from 'react';
import { FolderGit2, FileText, UserCheck, Lock, Clock, Send } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';
import apiClient from '../../../../infrastructure/api/client.js';

export const PartnerProblemStatementSection = ({
  partner,
  partnerRequests = [],
  onOpenSendRequest,
  selectedProblem,
  onSelectProblem
}) => {
  const [problemStatements, setProblemStatements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      universityApiService.getAssignedChallenges('RU001'),
      apiClient.get('citizen/challenges?limit=100').catch(() => ({ data: { challenges: [] } })),
      universityApiService.getProjects('RU001')
    ]).then(([chlData, citizenRes, prjData]) => {
      const assigned = (chlData?.challenges || (Array.isArray(chlData) ? chlData : []));
      const citizenList = citizenRes?.data?.challenges || (Array.isArray(citizenRes?.data) ? citizenRes.data : []);
      const allChallenges = [...assigned];
      citizenList.forEach((c) => {
        const cId = c.challengeId || c.id || c._id;
        if (!allChallenges.some((a) => (a.challengeId || a.id || a._id) === cId)) {
          allChallenges.push(c);
        }
      });

      const chls = allChallenges.map((c) => ({
        id: c.challengeId || c.id || c._id || `CHL-${Date.now()}`,
        title: c.title,
        problemStatement: c.problemStatement || c.description || c.title,
        domain: c.domain || c.aiCategory || 'Urban Development',
        facultyName: c.assignedFaculty?.name || c.assignedUniversity?.mentorName || c.nodalOfficer?.name || 'Dr. Binod Kumar',
        type: 'CHALLENGE'
      }));

      const prjs = (Array.isArray(prjData) ? prjData : (Array.isArray(prjData?.data) ? prjData.data : []))
        .map((p) => ({
          id: p.projectId || p.id,
          title: p.title,
          problemStatement: p.problemStatement || p.title,
          domain: p.domain || 'University R&D',
          facultyName: p.leadMentor || p.facultyMentor?.name || 'Faculty Mentor',
          type: 'PROJECT'
        }));

      const combined = [...chls];
      prjs.forEach((p) => {
        if (!combined.some((c) => c.title?.toLowerCase() === p.title?.toLowerCase() || c.id === p.id)) {
          combined.push(p);
        }
      });

      partnerRequests.forEach((req) => {
        if (req.projectTitle && !combined.some((c) => c.title?.toLowerCase() === req.projectTitle.toLowerCase())) {
          combined.push({
            id: req.projectId || req.requestId || 'PRJ-IND',
            title: req.projectTitle,
            problemStatement: req.executionOutcome || req.projectTitle,
            domain: 'Industry Collaboration',
            facultyName: req.facultyName || 'Dr. Binod Kumar',
            type: 'REQUEST'
          });
        }
      });

      setProblemStatements(combined);
      if (combined.length > 0 && !selectedProblem) {
        onSelectProblem(combined[0]);
      }
    }).catch((err) => console.error('Error loading problem statements:', err))
      .finally(() => setLoading(false));
  }, [partnerRequests]);

  const activeProblem = selectedProblem || (problemStatements.length > 0 ? problemStatements[0] : null);

  // Check if activeProblem has a matching request with this partner
  const matchedReq = partnerRequests.find((r) => 
    r.projectTitle?.toLowerCase() === activeProblem?.title?.toLowerCase() ||
    (r.projectId && activeProblem?.id && r.projectId === activeProblem.id)
  );
  const isApproved = matchedReq?.status === 'Approved';
  const isPending = matchedReq?.status === 'Pending';

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block flex items-center space-x-1.5">
          <FolderGit2 className="w-3.5 h-3.5 text-[#007A61]" />
          <span>Select Actual Problem Statement for {partner?.name || 'Lab'} *</span>
        </label>
        <span className="text-[10px] font-bold text-[#007A61] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          {problemStatements.length} Actual Problems Available
        </span>
      </div>

      {loading ? (
        <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
      ) : (
        <select
          value={activeProblem?.id || ''}
          onChange={(e) => {
            const found = problemStatements.find((p) => p.id === e.target.value);
            if (found) onSelectProblem(found);
          }}
          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs cursor-pointer"
        >
          {problemStatements.map((p) => (
            <option key={p.id} value={p.id}>
              [{p.id}] {p.title} ({p.domain || 'R&D'})
            </option>
          ))}
        </select>
      )}

      {activeProblem && (
        <div className="p-3.5 bg-gradient-to-br from-emerald-50/60 via-slate-50 to-emerald-50/30 border border-emerald-200/80 rounded-xl space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-extrabold text-[#007A61] bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-2xs">
              {activeProblem.id}
            </span>
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
              {activeProblem.domain || 'State R&D'}
            </span>
          </div>

          <div className="space-y-1 pt-1 border-t border-emerald-100/60">
            <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block flex items-center space-x-1">
              <FileText className="w-3 h-3 text-[#007A61]" />
              <span>Actual Problem Statement:</span>
            </span>
            <p className="text-xs text-slate-800 italic bg-white p-2.5 rounded-lg border border-slate-200/80 leading-relaxed font-medium">
              "{activeProblem.problemStatement || activeProblem.title}"
            </p>
          </div>

          {matchedReq?.labChargesQuoted && (
            <div className="flex items-center justify-between p-2 bg-emerald-100/80 border border-emerald-300 rounded-lg text-xs">
              <span className="font-bold text-emerald-950">Industry Lab Access Fee: <strong className="text-[#007A61]">{matchedReq.labChargesQuoted}</strong></span>
              <span className="text-[10px] font-black text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                {matchedReq.quoteStatus === 'Accepted' ? '✓ Accepted' : matchedReq.quoteStatus === 'Declined' ? 'Declined' : 'Pending Acceptance'}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-600 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-[#007A61]" />
              <span>Faculty Mentor: <strong className="text-slate-800">{activeProblem.facultyName || 'Dr. Binod Kumar'}</strong></span>
            </div>

            {isApproved ? (
              <span className="px-2.5 py-1 text-[10.5px] font-extrabold border rounded-lg bg-emerald-50 text-emerald-800 border-emerald-300 flex items-center space-x-1">
                <Lock className="w-3 h-3 text-[#007A61]" />
                <span>Approved from University</span>
              </span>
            ) : isPending ? (
              <span className="px-2.5 py-1 text-[10.5px] font-extrabold border rounded-lg bg-amber-50 text-amber-800 border-amber-300 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>Request Pending</span>
              </span>
            ) : (
              <span className="text-[10.5px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                Available for Lab Testing
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerProblemStatementSection;
