import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, GitMerge, Check, Loader2, Send, ShieldAlert, FileText } from 'lucide-react';
import { apiClient } from '../../../../infrastructure/api/client.js';

export const AiDuplicateModal = ({
  isOpen,
  onClose,
  challenge,
  duplicateInfo,
  onSuccess
}) => {
  const targetId = duplicateInfo?.matchedChallengeId || 'Parent Record';
  const similarityScore = Math.round((duplicateInfo?.similarityScore || 0) * 100);

  const [action, setAction] = useState('REJECT'); // 'REJECT' | 'RESOLVE'
  const [citizenNotice, setCitizenNotice] = useState(
    `Dear Citizen, your reported issue has been verified as a duplicate of challenge [${targetId}]. Our department is already actively working on resolving this identical civic problem in your ward/locality. Work is progressing under the primary dossier.`
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !challenge) return null;

  const chlId = challenge.challengeId || challenge.id;

  const handleTemplateClick = (text) => {
    setCitizenNotice(text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const data = await apiClient.post(`citizen/challenges/${chlId}/mark-duplicate`, {
        targetChallengeId: targetId,
        action,
        citizenNotice
      });

      onSuccess?.(data.data || { ...challenge, status: action === 'RESOLVE' ? 'Resolved' : 'Rejected' });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Error processing duplicate resolution');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col text-slate-900"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-amber-600 text-white rounded-lg shadow-xs">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">AI Duplicate Radar Resolution</h3>
                <p className="text-xs text-amber-900 font-medium mt-0.5">
                  Semantic Vector Match: <span className="font-bold">{similarityScore}% Overlap</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={submitting}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg font-medium flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Comparison Box */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <div className="space-y-1 border-r border-slate-200 pr-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Problem</span>
                <p className="font-bold text-slate-900 font-mono">{chlId}</p>
                <p className="text-[11px] text-slate-600 line-clamp-2">{challenge.title}</p>
              </div>
              <div className="space-y-1 pl-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Matched Parent Dossier</span>
                <p className="font-bold text-slate-900 font-mono">{targetId}</p>
                <p className="text-[11px] text-slate-600 line-clamp-2">
                  {duplicateInfo?.matchedTitle || 'Registered Civic Challenge'}
                </p>
              </div>
            </div>

            {/* Reason */}
            {duplicateInfo?.duplicateReason && (
              <div className="text-[11.5px] text-slate-700 bg-amber-50/80 p-2.5 rounded-md border border-amber-200 leading-relaxed">
                <span className="font-bold text-amber-900">AI Assessment: </span>
                {duplicateInfo.duplicateReason}
              </div>
            )}

            {/* Administrative Action */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 text-[11.5px]">Select Administrative Resolution Action</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAction('REJECT');
                    setCitizenNotice(`Dear Citizen, your reported problem is a verified duplicate of existing dossier [${targetId}]. Similar problem is already actively being addressed by the administration in your area. Your entry is closed as duplicate to prevent resource splitting.`);
                  }}
                  className={`p-2.5 rounded-lg border text-left font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
                    action === 'REJECT'
                      ? 'bg-rose-50 text-rose-900 border-rose-300 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <X className={`w-4 h-4 shrink-0 ${action === 'REJECT' ? 'text-rose-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="font-bold">Reject as Duplicate</div>
                    <div className="text-[10px] opacity-80">Close & notify citizen that work is in progress</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAction('RESOLVE');
                    setCitizenNotice(`Dear Citizen, your reported issue has been consolidated into parent dossier [${targetId}]. Both reports are being resolved together under the same operational team.`);
                  }}
                  className={`p-2.5 rounded-lg border text-left font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
                    action === 'RESOLVE'
                      ? 'bg-[#007A61]/10 text-[#007A61] border-emerald-300 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <GitMerge className={`w-4 h-4 shrink-0 ${action === 'RESOLVE' ? 'text-[#007A61]' : 'text-slate-400'}`} />
                  <div>
                    <div className="font-bold">Consolidate with Parent</div>
                    <div className="text-[10px] opacity-80">Merge into single working dossier</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Templates */}
            <div className="space-y-1">
              <div className="text-[10.5px] font-semibold text-slate-500 flex items-center space-x-1">
                <FileText className="w-3 h-3 text-[#007A61]" />
                <span>Quick Notice Templates:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleTemplateClick(`Dear Citizen, our administration is already actively working on resolving this identical problem under challenge [${targetId}] in your locality. Thank you for your active civic participation.`)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-medium transition-colors cursor-pointer"
                >
                  Active Work In Progress
                </button>
                <button
                  type="button"
                  onClick={() => handleTemplateClick(`Dear Citizen, your submission matches registered dossier [${targetId}]. The designated Line Department inspection team is already deployed on site.`)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-medium transition-colors cursor-pointer"
                >
                  Inspection Team Deployed
                </button>
              </div>
            </div>

            {/* Citizen Notice Input */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 text-[11px]">Notice Sent to Submitter / Citizen</label>
              <textarea
                value={citizenNotice}
                onChange={(e) => setCitizenNotice(e.target.value)}
                rows={3}
                required
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#007A61] resize-none font-normal"
                placeholder="Message to submitter explaining duplicate handling..."
              />
            </div>

            {/* Footer */}
            <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-2 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer ${
                  action === 'REJECT' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#007A61] hover:bg-[#00634f]'
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{action === 'REJECT' ? 'Confirm Reject as Duplicate' : 'Confirm Merge & Notify'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AiDuplicateModal;
