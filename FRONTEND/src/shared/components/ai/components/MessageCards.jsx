import React from 'react';
import {
  CheckCircle2, Clock, ShieldCheck, RotateCcw, Trash2,
  Calendar, MapPin, FileText, ArrowRight, AlertCircle, Building2, Pencil, X, Camera
} from 'lucide-react';

const I18N = {
  hi: {
    verificationPreview: 'सत्यापन पूर्वावलोकन',
    priority: 'प्राथमिकता',
    priorities: { Low: 'निम्न', Medium: 'मध्यम', High: 'उच्च', Critical: 'अति गंभीर' },
    evidenceAttached: 'ज़मीनी प्रमाण संलग्न',
    assets: 'फ़ाइलें',
    noEvidenceTitle: 'प्रमाण (फ़ोटो/वीडियो): कोई संलग्न नहीं',
    noEvidenceDesc: 'फ़ोटो या वीडियो होने से ज़िला नोडल अधिकारी समस्या को तुरंत सत्यापित कर त्वरित कार्रवाई शुरू करते हैं। क्या आप बिना प्रमाण के सबमिट करना चाहते हैं या फ़ोटो जोड़ेंगे?',
    location: 'स्थान',
    department: 'विभाग',
    confirmSubmit: 'पुष्टि करें और सबमिट करें',
    edit: 'संपादित करें',
    addPhoto: '📎 फ़ोटो / वीडियो जोड़ें',
    submitWithoutEvidence: 'बिना प्रमाण सबमिट करें',
    editDetails: 'स्थान / विवरण बदलें',
    registeredOfficially: 'आधिकारिक रूप से दर्ज',
    syncedLive: 'नागरिक डेटाबेस व नोडल सेल से लाइव सिंक',
    confirmPermanentDelete: 'स्थायी रूप से हटाने की पुष्टि करें',
    confirmWithdrawal: 'शिकायत वापस लेने की पुष्टि करें',
    permanentDeleteWarning: 'यह शिकायत हमेशा के लिए हटा दी जाएगी।',
    withdrawalWarning: 'विभागीय समीक्षा व कार्रवाई रोक दी जाएगी।',
    confirmDeleteBtn: 'हटाने की पुष्टि करें',
    confirmWithdrawBtn: 'वापस लेने की पुष्टि करें',
    cancel: 'रद्द करें',
    resolutionLifecycle: 'समाधान जीवनचक्र',
    lifecycleSteps: ['दर्ज', 'समीक्षा', 'समाधान'],
    withdrawBtn: 'शिकायत वापस लें',
    deleteBtn: 'हटाएं',
    selectProblemToTrack: 'ट्रैक करने के लिए समस्या चुनें'
  },
  en: {
    verificationPreview: 'Verification Preview',
    priority: 'Priority',
    priorities: { Low: 'Low', Medium: 'Medium', High: 'High', Critical: 'Critical' },
    evidenceAttached: 'Ground Evidence Attached',
    assets: 'Assets',
    noEvidenceTitle: 'Ground Evidence (Photo/Video): None Attached',
    noEvidenceDesc: 'Ground photo or video evidence helps District Nodal Officers immediately verify and act on the issue. Would you like to submit without photo, or attach evidence?',
    location: 'Location',
    department: 'Department',
    confirmSubmit: 'Confirm & Submit',
    edit: 'Edit',
    addPhoto: '📎 Attach Photo / Video',
    submitWithoutEvidence: 'Submit Without Photo',
    editDetails: 'Edit Location / Details',
    registeredOfficially: 'Registered Officially',
    syncedLive: 'Synced live with citizen database & Nodal Cell',
    confirmPermanentDelete: 'Confirm Permanent Deletion',
    confirmWithdrawal: 'Confirm Problem Withdrawal',
    permanentDeleteWarning: 'This complaint will be permanently removed.',
    withdrawalWarning: 'Nodal review workflow will be ceased.',
    confirmDeleteBtn: 'Confirm Delete',
    confirmWithdrawBtn: 'Confirm Withdraw',
    cancel: 'Cancel',
    resolutionLifecycle: 'Resolution Lifecycle',
    lifecycleSteps: ['Submitted', 'Review', 'Resolution'],
    withdrawBtn: 'Withdraw',
    deleteBtn: 'Delete',
    selectProblemToTrack: 'Select Problem to Track'
  }
};

const getT = (lang) => (lang === 'hi' ? I18N.hi : I18N.en);

/* ───────────────────── Draft Verification Preview ───────────────────── */
export const DraftReportCard = ({ draftReport, onAction, lang = 'en' }) => {
  const t = getT(lang);
  const hasEvidence = Array.isArray(draftReport.media) && draftReport.media.length > 0;
  const pKey = draftReport.priority || 'Medium';
  const pLabel = lang === 'hi' ? `${t.priorities[pKey] || 'मध्यम'} ${t.priority}` : `${pKey} Priority`;

  return (
    <div className="mt-2 p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-sm space-y-3 text-slate-800 animate-fade-in text-left">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#015a3a] text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{t.verificationPreview}</span>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/80 text-amber-800 text-[10px] font-semibold uppercase">
          {pLabel}
        </span>
      </div>
      <div>
        <h4 className="text-[13px] font-bold text-slate-900 leading-snug">{draftReport.title}</h4>
        {draftReport.description && draftReport.description !== draftReport.title && (
          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">{draftReport.description}</p>
        )}
      </div>

      {/* Attached Evidence Preview or Missing Evidence Notice */}
      {hasEvidence ? (
        <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-200/80 space-y-1.5">
          <div className="flex items-center justify-between text-[10.5px] font-bold text-emerald-900">
            <span className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-emerald-700" /> {t.evidenceAttached}
            </span>
            <span className="bg-emerald-200/70 px-2 py-0.5 rounded-md text-[10px] font-bold text-emerald-900">
              {draftReport.media.length} {t.assets}
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {draftReport.media.map((m, idx) => {
              const url = typeof m === 'string' ? m : (m.url || m.accessUrl || '');
              const isVid = typeof m === 'object' ? (m.resourceType === 'video' || m.fileType === 'video') : Boolean(url.match(/\.(mp4|webm|mov)(\?.*)?$/i));
              return (
                <div key={idx} className="relative w-11 h-11 rounded-lg overflow-hidden border border-emerald-300 shrink-0 bg-slate-900 flex items-center justify-center shadow-2xs">
                  {isVid ? (
                    <video src={url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={url} alt="evidence" className="w-full h-full object-cover" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{t.noEvidenceTitle}</span>
          </div>
          <p className="text-[10.5px] text-amber-800 leading-relaxed">
            {t.noEvidenceDesc}
          </p>
        </div>
      )}

      <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 space-y-2 text-[11px]">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-slate-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {t.location}
          </span>
          <span className="font-semibold text-slate-800 truncate text-right">{draftReport.areaOrBlock}, {draftReport.district}</span>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-slate-100/80 pt-1.5">
          <span className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {t.department}
          </span>
          <span className="font-semibold text-slate-800 truncate text-right">{draftReport.domain}</span>
        </div>
      </div>

      {/* Explicit Actions Based on Evidence Status */}
      {hasEvidence ? (
        <div className="flex items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => onAction?.('CONFIRM_SUBMIT', draftReport)}
            className="flex-1 h-9 px-3.5 bg-[#015a3a] hover:bg-[#01482e] active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span className="whitespace-nowrap">{t.confirmSubmit}</span>
          </button>
          <button
            type="button"
            onClick={() => onAction?.('EDIT_DRAFT', draftReport)}
            className="h-9 px-3 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 text-xs font-medium rounded-xl border border-slate-200/90 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Pencil className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.edit}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2 pt-0.5">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                const fileInput = document.getElementById('ai-chat-evidence-file-input');
                if (fileInput) fileInput.click();
                else onAction?.('TRIGGER_ATTACHMENT');
              }}
              className="h-9 px-2.5 bg-[#015a3a] hover:bg-[#01482e] active:scale-[0.98] text-white text-[11.5px] font-semibold rounded-xl shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
              <span className="truncate">{t.addPhoto}</span>
            </button>
            <button
              type="button"
              onClick={() => onAction?.('CONFIRM_SUBMIT', draftReport)}
              className="h-9 px-2.5 bg-amber-50 hover:bg-amber-100/90 active:scale-[0.98] text-amber-900 border border-amber-300 text-[11px] font-semibold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="truncate">{t.submitWithoutEvidence}</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => onAction?.('EDIT_DRAFT', draftReport)}
            className="w-full h-8 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-600 text-[11px] font-medium rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Pencil className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.editDetails}</span>
          </button>
        </div>
      )}
    </div>
  );
};

/* ───────────────────── Registered Challenge Card ───────────────────── */
export const CreatedChallengeCard = ({ challenge, lang = 'en' }) => {
  const t = getT(lang);
  return (
    <div className="mt-2 p-3.5 bg-white border border-emerald-200 rounded-2xl shadow-sm space-y-2.5 text-slate-800 animate-fade-in text-left">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.registeredOfficially}</span>
        </span>
        <span className="text-[11.5px] font-bold font-mono text-[#015a3a] bg-emerald-50/80 px-2.5 py-0.5 rounded-md border border-emerald-100">
          {challenge.challengeId}
        </span>
      </div>
      <div className="text-[12.5px] font-bold text-slate-900 line-clamp-1">{challenge.title}</div>
      {challenge.description && challenge.description !== challenge.title && (
        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed -mt-1">{challenge.description}</p>
      )}

      {/* Attached Evidence Preview */}
      {((Array.isArray(challenge.media) && challenge.media.length > 0) || (Array.isArray(challenge.mediaUrls) && challenge.mediaUrls.length > 0)) && (
        <div className="flex items-center gap-1.5 p-1.5 bg-emerald-50/80 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 font-semibold">
          <Camera className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>{(challenge.media || challenge.mediaUrls).length} {t.evidenceAttached}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50/80 rounded-xl border border-slate-100 text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" /><span className="truncate">{challenge.district}</span></div>
        <div className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /><span className="truncate">{challenge.domain}</span></div>
      </div>
      <div className="text-[10.5px] text-[#015a3a] font-medium flex items-center gap-1.5 pt-0.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>{t.syncedLive}</span>
      </div>
    </div>
  );
};

/* ───────────────────── Action Confirm (Withdraw / Delete) ───────────────────── */
export const ActionConfirmCard = ({ actionTarget, onAction, lang = 'en' }) => {
  const t = getT(lang);
  const isDel = actionTarget.actionType === 'DELETE';
  return (
    <div className={`mt-2 p-3.5 rounded-2xl border shadow-sm text-slate-800 animate-fade-in text-left space-y-3 ${isDel ? 'bg-rose-50/70 border-rose-200' : 'bg-amber-50/70 border-amber-200'}`}>
      <div className="flex items-center gap-2">
        {isDel ? <Trash2 className="w-4 h-4 text-rose-600 shrink-0" /> : <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />}
        <span className={`text-xs font-bold uppercase tracking-wider ${isDel ? 'text-rose-800' : 'text-amber-800'}`}>
          {isDel ? t.confirmPermanentDelete : t.confirmWithdrawal}
        </span>
      </div>
      <div className="bg-white/90 rounded-xl p-2.5 border border-slate-200/60 text-[11px] space-y-1.5">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-bold text-slate-900 font-mono">{actionTarget.challengeId}</span>
        </div>
        <div className="text-slate-700 font-medium line-clamp-1">{actionTarget.title}</div>
        {actionTarget.description && actionTarget.description !== actionTarget.title && (
          <p className="text-slate-500 line-clamp-2 leading-relaxed">{actionTarget.description}</p>
        )}
        <div className={`text-[10.5px] font-semibold flex items-center gap-1.5 pt-1 ${isDel ? 'text-rose-600' : 'text-amber-700'}`}>
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{isDel ? t.permanentDeleteWarning : t.withdrawalWarning}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-0.5">
        <button type="button" onClick={() => onAction?.(isDel ? 'CONFIRM_DELETE' : 'CONFIRM_WITHDRAW', actionTarget.challengeId)}
          className={`flex-1 h-9 px-3 text-white text-xs font-semibold rounded-xl shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98] ${isDel ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'}`}>
          {isDel ? <><Trash2 className="w-3.5 h-3.5" /><span>{t.confirmDeleteBtn}</span></> : <><RotateCcw className="w-3.5 h-3.5" /><span>{t.confirmWithdrawBtn}</span></>}
        </button>
        <button type="button" onClick={() => onAction?.('CANCEL_ACTION')}
          className="h-9 px-3.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl border border-slate-200/90 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs">
          <X className="w-3.5 h-3.5 text-slate-500" /><span>{t.cancel}</span>
        </button>
      </div>
    </div>
  );
};

/* ───────────────────── Tracking Card with Lifecycle ───────────────────── */
export const TrackingCard = ({ trackingData, onAction, lang = 'en' }) => {
  const t = getT(lang);
  const STEPS = ['Submitted', 'Under Review', 'Department Assigned', 'In Progress', 'Resolved'];
  const sl = (trackingData.status || '').toLowerCase();
  return (
    <div className="mt-2 p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-sm space-y-3 text-slate-800 animate-fade-in text-left">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold font-mono text-slate-900">{trackingData.challengeId}</span>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#015a3a] border border-emerald-200">{trackingData.status || 'Under Review'}</span>
      </div>
      {trackingData.title && (
        <div className="text-[12px] font-semibold text-slate-800 line-clamp-1">{trackingData.title}</div>
      )}
      {trackingData.description && trackingData.description !== trackingData.title && (
        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed -mt-1">{trackingData.description}</p>
      )}
      <div className="space-y-2 pt-1">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-[#015a3a]" /><span>{t.resolutionLifecycle}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          {STEPS.map((step, idx) => {
            const isDone = sl === 'resolved' || sl === 'deployed' ? true : sl === 'in progress' ? idx < 3 : idx < 1;
            const isCurrent = sl === 'in progress' ? idx === 3 : idx === 1;
            return (
              <div key={step} className="flex-1 flex flex-col items-center">
                <div className={`h-1.5 w-full rounded-full transition-all ${isDone ? 'bg-[#015a3a]' : isCurrent ? 'bg-amber-500 animate-pulse' : 'bg-slate-200'}`} title={step} />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[9.5px] text-slate-400 font-medium">
          <span>{t.lifecycleSteps[0]}</span><span>{t.lifecycleSteps[1]}</span><span>{t.lifecycleSteps[2]}</span>
        </div>
      </div>
      {(trackingData.canWithdraw || trackingData.canDelete) && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          {trackingData.canWithdraw && (
            <button type="button" onClick={() => onAction?.('WITHDRAW', trackingData.challengeId)}
              className="h-7 px-2.5 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg flex items-center gap-1 cursor-pointer transition-colors">
              <RotateCcw className="w-3 h-3" /><span>{t.withdrawBtn}</span>
            </button>
          )}
          {trackingData.canDelete && (
            <button
              type="button"
              onClick={() => onAction?.('DELETE', trackingData.challengeId)}
              className="h-7 px-2.5 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3 h-3" /><span>{t.deleteBtn}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/* ───────────────────── Challenge List (Multiple Results) ───────────────────── */
export const ChallengeListCard = ({ challengesList, onTrackId, lang = 'en' }) => {
  const t = getT(lang);
  return (
    <div className="mt-2 space-y-2 text-slate-800 animate-fade-in text-left">
      <div className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        <FileText className="w-3.5 h-3.5 text-[#015a3a]" /><span>{t.selectProblemToTrack}</span>
      </div>
      <div className="space-y-1.5">
        {challengesList.map((item) => (
          <button
            key={item.challengeId}
            type="button"
            onClick={() => onTrackId?.(item.challengeId)}
            className="w-full p-3 bg-white hover:bg-emerald-50/60 active:scale-[0.99] border border-slate-200/90 hover:border-emerald-300 rounded-xl shadow-2xs flex items-center justify-between transition-all group text-left cursor-pointer"
          >
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold font-mono text-[#015a3a] group-hover:underline">{item.challengeId}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5 text-slate-400" /><span>{item.dateFormatted}</span>
                </span>
              </div>
              <div className="text-xs text-slate-700 font-medium truncate mt-1">{item.title}</div>
              {item.description && item.description !== item.title && (
                <div className="text-[10.5px] text-slate-400 truncate mt-0.5">{item.description}</div>
              )}
            </div>
            <div className="shrink-0 flex items-center gap-1.5">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100/80 text-[#015a3a] border border-emerald-200">{item.status}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#015a3a] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
