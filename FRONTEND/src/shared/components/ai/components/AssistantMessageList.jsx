import React from 'react';
import { User, CheckCircle2, Clock, ShieldCheck, RotateCcw, Trash2 } from 'lucide-react';
import { JoharSetuIcon } from './JoharSetuIcon.jsx';
import {
  DraftReportCard,
  CreatedChallengeCard,
  ActionConfirmCard,
  TrackingCard,
  ChallengeListCard
} from './MessageCards.jsx';
import { AssistantQuickActions } from './AssistantQuickActions.jsx';

/**
 * Render table rows as sleek step flow cards
 */
const renderTableCards = (rows, keyPrefix) => (
  <div key={keyPrefix} className="my-2 space-y-1.5 bg-white/80 p-2 rounded-xl border border-emerald-200/80 shadow-2xs">
    {rows.map((row, idx) => {
      const isDone = /completed|resolved|deployed/i.test(row.status);
      const isCurrent = /up next|in progress|active/i.test(row.status);
      return (
        <div key={`${keyPrefix}-${idx}`} className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-[11px]">
          <div className="flex items-center gap-1.5 font-medium text-slate-700 min-w-0">
            {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              : isCurrent ? <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
              : <div className="w-3 h-3 rounded-full border border-slate-300 shrink-0" />}
            <span className="truncate">{row.step}</span>
          </div>
          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full shrink-0 ${isDone ? 'bg-emerald-100 text-[#015a3a] border border-emerald-200' : isCurrent ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
            {row.status}
          </span>
        </div>
      );
    })}
  </div>
);

const formatInlineText = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={idx} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>
      : part
  );
};

const renderFormattedBubble = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  const tableRows = [];
  const elements = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      const parts = line.split('|').map(p => p.trim()).filter(Boolean);
      if (parts.some(p => /^:?-+:?$/.test(p))) continue;
      if (parts.length >= 2 && /^(step|s\.no|stage)/i.test(parts[0]) && /^(status|state)/i.test(parts[1])) continue;
      if (parts.length >= 2) { tableRows.push({ step: parts[0].replace(/[*_]/g, ''), status: parts[1].replace(/[*_]/g, '') }); continue; }
    }
    if (tableRows.length > 0) elements.push(renderTableCards(tableRows.splice(0, tableRows.length), `tbl-${i}`));
    if (line.startsWith('###')) {
      elements.push(<div key={`h3-${i}`} className="font-bold text-slate-800 text-[12.5px] mt-1 mb-0.5 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#015a3a]" /><span>{line.replace(/^###\s*/, '')}</span></div>);
      continue;
    }
    if (line.length > 0) elements.push(<div key={`ln-${i}`} className="leading-relaxed">{formatInlineText(line)}</div>);
    else elements.push(<div key={`sp-${i}`} className="h-1.5" />);
  }
  if (tableRows.length > 0) elements.push(renderTableCards(tableRows, 'tbl-end'));
  return <div className="space-y-1">{elements}</div>;
};

/**
 * TypewriterBubble — natural human-like typing at 20ms / 2 chars
 */
const TypewriterBubble = ({ text, isLatest }) => {
  const [displayText, setDisplayText] = React.useState(isLatest ? '' : text);
  const [isDone, setIsDone] = React.useState(!isLatest);

  React.useEffect(() => {
    if (!isLatest) { setDisplayText(text); setIsDone(true); return; }
    let i = 0;
    const timer = setInterval(() => {
      i += 2;
      if (i >= text.length) { setDisplayText(text); setIsDone(true); clearInterval(timer); }
      else setDisplayText(text.slice(0, i));
    }, 20);
    return () => clearInterval(timer);
  }, [text, isLatest]);

  return (
    <div className="relative">
      {renderFormattedBubble(displayText)}
      {!isDone && <span className="inline-block w-1.5 h-3 ml-0.5 bg-[#015a3a] animate-pulse align-middle" />}
    </div>
  );
};

export const AssistantMessageList = ({
  messages,
  loading,
  messagesEndRef,
  onTrackId,
  onAction,
  onSubmitChallenge,
  onTrackChallenge,
  onChangeLanguage
}) => {
  const latestMessageRef = React.useRef(null);
  const hasUserMessages = messages.some((m) => m.role === 'user');

  React.useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg) return;

    if (lastMsg.role === 'user') {
      // User sent message -> scroll to bottom so user message & loading indicator are in view
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Assistant replied -> scroll so the START of the assistant's message is visible at the top
      if (latestMessageRef.current) {
        latestMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 custom-scrollbar bg-slate-50/40">
      {messages.map((msg, msgIndex) => {
        const isUser = msg.role === 'user';
        const isLatest = msgIndex === messages.length - 1;
        const isLatestAssistant = !isUser && isLatest;
        const bubbles = isUser
          ? [msg.content || '']
          : (msg.content || '').split('---BUBBLE---').map(b => b.trim()).filter(Boolean);

        return (
          <React.Fragment key={msg.id}>
            <div
              ref={isLatest ? latestMessageRef : null}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
          <div className={`flex items-start gap-2.5 max-w-[88%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            {!isUser
              ? <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-emerald-600/30 shadow-2xs mt-0.5"><JoharSetuIcon className="w-6 h-6" /></div>
              : <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs shadow-2xs mt-0.5"><User className="w-3.5 h-3.5" /></div>
            }

            <div className="flex flex-col gap-2 flex-1 min-w-0">
              {/* Attachment preview */}
              {isUser && msg.attachment && (
                <div className="mb-1 space-y-1.5 p-2 bg-[#015a3a] rounded-2xl text-white">
                  {msg.attachment.type?.startsWith('image/') && (msg.attachment.previewUrl || msg.attachment.url) && (
                    <img src={msg.attachment.previewUrl || msg.attachment.url} alt={msg.attachment.name} className="w-full max-h-40 object-cover rounded-xl border border-white/20 shadow-xs" />
                  )}
                  {msg.attachment.type?.startsWith('video/') && (msg.attachment.previewUrl || msg.attachment.url) && (
                    <video src={msg.attachment.previewUrl || msg.attachment.url} controls className="w-full max-h-40 object-cover rounded-xl border border-white/20 shadow-xs" />
                  )}
                  <div className="p-1.5 bg-black/20 rounded-lg text-[11px] flex items-center space-x-1.5 overflow-hidden">
                    <span className="font-semibold">📎 Attached:</span>
                    <span className="truncate">{msg.attachment.name}</span>
                  </div>
                </div>
              )}

              {/* Speech bubbles */}
              {bubbles.map((bubbleText, bubbleIdx) => (
                <div key={`${msg.id}-bubble-${bubbleIdx}`}
                  className={`p-3 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${isUser ? 'bg-[#015a3a] text-white rounded-2xl rounded-tr-xs font-medium' : 'bg-[#eaf6ef] border border-emerald-100/70 text-slate-800 rounded-2xl rounded-tl-xs font-normal'}`}>
                  {isUser
                    ? <div className="whitespace-pre-line break-words">{bubbleText}</div>
                    : <TypewriterBubble text={bubbleText} isLatest={isLatestAssistant && bubbleIdx === bubbles.length - 1} />
                  }
                </div>
              ))}

              {/* Quick Edit Options Chips (Shown when AI asks what to edit) */}
              {msg.showEditChips && (
                <div className="mt-1 flex flex-wrap gap-1.5 animate-fade-in text-left">
                  <button
                    type="button"
                    onClick={() => onAction?.('EDIT_FIELD_LOCATION')}
                    className="px-2.5 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-[#015a3a] border border-emerald-300 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
                  >
                    <span>📍 Location Badlein</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onAction?.('EDIT_FIELD_DESCRIPTION')}
                    className="px-2.5 py-1.5 rounded-full bg-white hover:bg-blue-50 text-blue-900 border border-blue-300 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
                  >
                    <span>📝 Samasya Badlein</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onAction?.('TRIGGER_ATTACHMENT')}
                    className="px-2.5 py-1.5 rounded-full bg-white hover:bg-purple-50 text-purple-900 border border-purple-300 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
                  >
                    <span>📎 Photo/Video Jodein</span>
                  </button>
                </div>
              )}

              {/* Interactive Cards */}
              {msg.draftReport && <DraftReportCard draftReport={msg.draftReport} onAction={onAction} />}
              {msg.createdChallenge && <CreatedChallengeCard challenge={msg.createdChallenge} />}
              {msg.withdrawnChallenge && (
                <div className="mt-1 p-2.5 bg-amber-50 border border-amber-200/90 rounded-xl text-[11px] text-amber-900 font-bold flex items-center space-x-2 text-left">
                  <RotateCcw className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Problem {msg.withdrawnChallenge.challengeId} marked as Withdrawn</span>
                </div>
              )}
              {msg.deletedChallengeId && (
                <div className="mt-1 p-2.5 bg-rose-50 border border-rose-200/90 rounded-xl text-[11px] text-rose-800 font-bold flex items-center space-x-2 text-left">
                  <Trash2 className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Problem {msg.deletedChallengeId} permanently deleted</span>
                </div>
              )}
              {msg.actionTarget && !msg.withdrawnChallenge && !msg.deletedChallengeId && (
                <ActionConfirmCard actionTarget={msg.actionTarget} onAction={onAction} />
              )}
              {msg.trackingData && <TrackingCard trackingData={msg.trackingData} onAction={onAction} />}
              {msg.challengesList?.length > 0 && <ChallengeListCard challengesList={msg.challengesList} onTrackId={onTrackId} />}
            </div>
          </div>

          <span className={`text-[10px] text-slate-400 font-medium mt-1 ${isUser ? 'mr-1' : 'ml-10.5'}`}>
            {msg.time || 'Just now'}
          </span>
        </div>

        {/* Quick Actions (Submit, Track, Language) ONLY shown under welcome message in initial/cleared state */}
        {!hasUserMessages && (msg.id === 'welcome' || msg.id === 'welcome-reset') && (
          <div className="w-full pt-1 animate-fade-in">
            <AssistantQuickActions
              onSubmitChallenge={onSubmitChallenge}
              onTrackChallenge={onTrackChallenge}
              onChangeLanguage={onChangeLanguage}
            />
          </div>
        )}
      </React.Fragment>
    );
  })}

    {/* Bouncing dots typing indicator */}
    {loading && (
      <div className="flex items-start gap-2.5 animate-fade-in">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-emerald-600/40 shadow-xs ring-2 ring-emerald-500/20">
          <JoharSetuIcon className="w-6 h-6" />
        </div>
        <div className="p-3 bg-[#eaf6ef] border border-emerald-200/80 rounded-2xl rounded-tl-xs shadow-2xs text-slate-700 flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5 px-0.5">
            <span className="w-2 h-2 rounded-full bg-[#015a3a] animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-[#015a3a] animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-[#015a3a] animate-bounce" />
          </div>
          <span className="text-[11.5px] font-semibold text-emerald-900 tracking-wide">
            Johar Setu AI type kar raha hai...
          </span>
        </div>
      </div>
    )}

    <div ref={messagesEndRef} />
  </div>
  );
};

export default AssistantMessageList;
