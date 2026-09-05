import React, { useState, useEffect } from 'react';
import { FolderGit2, FileText, UserCheck, Lock, Clock, ExternalLink, Users, Sparkles, FlaskConical } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';
import { getPdfViewUrl } from '../../../../shared/utils/openPdf.js';

export const PartnerProblemStatementSection = ({
  partner, partnerRequests = [], selectedProblem, onSelectProblem
}) => {
  const [problemStatements, setProblemStatements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    universityApiService.getProjects('RU001')
      .then((prjData) => {
        const prjs = (Array.isArray(prjData) ? prjData : (Array.isArray(prjData?.data) ? prjData.data : []));
        // ONLY show projects when submitted by student research team!
        const submitted = prjs
          .filter((p) => p.sentToUniversity === true || p.prototypeStatus === 'In Review' || p.prototypeStatus === 'Approved')
          .map((p) => ({
            id: p.projectId || p.id,
            title: p.title,
            problemStatement: p.problemStatement || p.title,
            domain: p.domain || 'University R&D',
            facultyName: p.leadMentor || p.facultyMentor?.name || 'Dr. Binod Kumar',
            studentTeam: p.studentTeam || 'Student Research Squad',
            studentLead: p.studentLead || 'Student Team Leader',
            prototypeData: p.prototypeData,
            pdfUrl: p.pdfUrl || p.prototypeData?.pdfUrl,
            pdfName: p.pdfName || p.prototypeData?.pdfName || 'Prototype_Report.pdf',
            sanctionedBudget: p.sanctionedBudget || p.disbursedAmount || '₹ 80,000'
          }));

        setProblemStatements(submitted);
        if (submitted.length > 0) {
          if (!selectedProblem || !submitted.some((s) => s.id === selectedProblem.id)) {
            onSelectProblem(submitted[0]);
          }
        } else {
          onSelectProblem(null);
        }
      })
      .catch((err) => console.error('Error loading submitted problem statements:', err))
      .finally(() => setLoading(false));
  }, [partnerRequests]);

  const activeProblem = selectedProblem || (problemStatements.length > 0 ? problemStatements[0] : null);
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
          <span>Select Submitted Student Prototype for {partner?.name || 'Lab'} *</span>
        </label>
        <span className="text-[10px] font-bold text-[#007A61] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          {problemStatements.length} Submitted Prototypes
        </span>
      </div>

      {loading ? (
        <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
      ) : problemStatements.length === 0 ? (
        <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center space-y-1.5">
          <FlaskConical className="w-6 h-6 text-slate-400 mx-auto" />
          <p className="text-xs font-bold text-slate-700">No Student Prototypes Submitted Yet</p>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Data will only appear here once the student team uploads their technical PDF and submits the prototype to Ranchi University.
          </p>
        </div>
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
              [{p.id}] {p.title} ({p.studentTeam})
            </option>
          ))}
        </select>
      )}

      {activeProblem && (
        <div className="p-3.5 bg-gradient-to-br from-emerald-50/60 via-slate-50 to-emerald-50/30 border border-emerald-200/80 rounded-xl space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-extrabold text-[#007A61] bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-2xs">
              {activeProblem.id}
            </span>
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
              {activeProblem.domain || 'State R&D'}
            </span>
          </div>

          {/* 1. Ground Problem Statement */}
          <div className="space-y-1 pt-1 border-t border-emerald-100/60">
            <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block flex items-center space-x-1">
              <FileText className="w-3 h-3 text-[#007A61]" />
              <span>Ground Problem Statement:</span>
            </span>
            <p className="text-xs text-slate-800 italic bg-white p-2.5 rounded-lg border border-slate-200/80 leading-relaxed font-medium">
              "{activeProblem.problemStatement || activeProblem.title}"
            </p>
          </div>

          {/* 2. Solution Prototype Details */}
          <div className="space-y-1.5 p-2.5 bg-white rounded-lg border border-slate-200/80">
            <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Solution Prototype Details</span>
              </span>
              <span className="text-emerald-700 font-bold lowercase">1st grant: {activeProblem.sanctionedBudget}</span>
            </div>
            <div className="text-[11px] text-slate-700 font-medium leading-relaxed">
              {activeProblem.prototypeData?.content || 'Hardware telemetry array and alert broadcast.'}
            </div>
            <div className="flex items-center space-x-1 text-[10.5px] text-slate-600 font-semibold pt-1 border-t border-slate-100">
              <Users className="w-3.5 h-3.5 text-[#007A61]" />
              <span>Squad: <strong className="text-slate-900">{activeProblem.studentTeam}</strong> (Lead: {activeProblem.studentLead})</span>
            </div>
          </div>

          {/* 3. Attached Cloudinary PDF */}
          {activeProblem.pdfUrl && (
            <div className="flex items-center justify-between p-2.5 bg-rose-50/80 border border-rose-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <div className="font-bold text-xs text-slate-900 line-clamp-1">{activeProblem.pdfName}</div>
                  <div className="text-[9.5px] text-emerald-700 font-semibold">✓ Verified Cloudinary Technical Blueprint</div>
                </div>
              </div>
              <a
                href={getPdfViewUrl(activeProblem.pdfUrl, activeProblem.pdfName)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-white hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 shadow-2xs cursor-pointer"
              >
                <span>View Attached PDF</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Footer & Status */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-600 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-[#007A61]" />
              <span>Mentor: <strong className="text-slate-800">{activeProblem.facultyName || 'Dr. Binod Kumar'}</strong></span>
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
              <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2.5 py-1 rounded-lg">
                ✓ Ready for Industry Lab Testing
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerProblemStatementSection;
