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
    <div className={`p-4 rounded-xl border transition-all ${
      isRequested
        ? 'bg-emerald-50/70 border-emerald-300'
        : 'bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border-emerald-300 shadow-2xs'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
        <div className="flex items-start space-x-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isRequested ? 'bg-emerald-100 text-[#007A61]' : 'bg-[#007A61] text-white shadow-xs'
          }`}>
            {isRequested ? <CheckCircle2 className="w-5 h-5" /> : <Rocket className="w-5 h-5 animate-pulse" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                {isRequested ? 'Prototype Development Directive Active' : 'First Tranche Disbursed: Ready for Prototype Phase'}
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isRequested ? 'bg-emerald-200/70 text-emerald-900' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isRequested ? 'Directive Sent ✓' : 'Action Available'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
              {isRequested
                ? `Official directive issued to Lead Faculty Mentor (${facultyName}). Work authorization active.`
                : `1st grant installment credited. Request Lead Faculty Mentor (${facultyName}) to commence prototype R&D.`}
            </p>
            {feedback && (
              <p className="text-[11px] font-bold text-emerald-700 mt-1">{feedback}</p>
            )}
          </div>
        </div>

        <div className="shrink-0 flex items-center space-x-2">
          {!isRequested ? (
            <button
              type="button"
              onClick={handleSendDirective}
              disabled={loading}
              className="px-4 py-2 bg-[#007A61] hover:bg-[#00604c] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
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
              className="px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
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
