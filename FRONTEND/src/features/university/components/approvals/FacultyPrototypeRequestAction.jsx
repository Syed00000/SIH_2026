import React, { useState } from 'react';
import { Rocket, CheckCircle2, FlaskConical, Send, RefreshCw } from 'lucide-react';
import apiClient from '../../../../infrastructure/api/client.js';

export const FacultyPrototypeRequestAction = ({ project, approval, pId, rawDisbursed, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const isRequested = Boolean(project?.prototypeWorkRequested || approval?.prototypeWorkRequested);
  const facultyName = project?.leadMentor || project?.facultyMentor?.name || approval?.faculty?.name || approval?.requestedBy || 'Lead Faculty Mentor';
  const targetId = project?.id || project?.projectId || approval?.projectId || pId;

  const handleSendDirective = async () => {
    if (!targetId || loading) return;
    setLoading(true);
    try {
      await apiClient.put(`university/projects/${encodeURIComponent(targetId)}?universityCode=RU001`, {
        prototypeWorkRequested: true,
        prototypeWorkRequestedAt: new Date()
      });
      setFeedback(`✓ Directive sent to Faculty Mentor (${facultyName}) to start Prototype work!`);
      if (onSuccess) onSuccess();
      setTimeout(() => setFeedback(''), 4000);
    } catch (err) {
      setFeedback('Failed to send directive: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  if (rawDisbursed <= 0) return null;

  return (
    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center shrink-0">
            {isRequested ? <CheckCircle2 className="w-4 h-4 text-slate-800" /> : <Rocket className="w-4 h-4 text-slate-800" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                {isRequested ? 'Prototype Development Directive Active' : 'First Tranche Disbursed: Ready for Prototype Phase'}
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 border border-slate-300">
                {isRequested ? 'Directive Sent ✓' : 'Action Available'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              {isRequested
                ? `Official directive issued to Lead Faculty Mentor (${facultyName}). Work authorization active.`
                : `1st grant installment credited. Request Lead Faculty Mentor (${facultyName}) to commence prototype R&D.`}
            </p>
            {feedback && (
              <p className="text-[11px] font-bold text-slate-700 mt-1">{feedback}</p>
            )}
          </div>
        </div>

        <div className="shrink-0 flex items-center space-x-2">
          {!isRequested ? (
            <button
              type="button"
              onClick={handleSendDirective}
              disabled={loading}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Request Faculty to Start Work on Prototype</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSendDirective}
              disabled={loading}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Resend Directive</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyPrototypeRequestAction;
