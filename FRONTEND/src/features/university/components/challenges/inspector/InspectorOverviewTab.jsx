import React from 'react';
import { GraduationCap, Camera, ImageOff, ExternalLink, Video } from 'lucide-react';
import { resolveMediaUrl } from '../../../../../shared/utils/mediaUtils.js';

export const InspectorOverviewTab = ({
  displayedStatement,
  rawStatement,
  showFullStatement,
  setShowFullStatement,
  assignedUni,
  assignedDept,
  challenge = {},
  onViewEvidence
}) => {
  // Collect media
  const rawMedia = [
    ...(Array.isArray(challenge.media) ? challenge.media : []),
    ...(Array.isArray(challenge.mediaUrls) ? challenge.mediaUrls : []),
    ...(Array.isArray(challenge.evidence) ? challenge.evidence : []),
    ...(Array.isArray(challenge.attachments) ? challenge.attachments : []),
    ...(Array.isArray(challenge.photos) ? challenge.photos : []),
    ...(Array.isArray(challenge.images) ? challenge.images : []),
    ...(Array.isArray(challenge.videos) ? challenge.videos : [])
  ].filter(Boolean);

  const normalizedMedia = rawMedia.map((item, idx) => {
    if (typeof item === 'string') {
      const isVid = Boolean(item.match(/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i) || item.includes('video'));
      return { url: resolveMediaUrl(item), rawUrl: item, type: isVid ? 'video' : 'photo', caption: `Item #${idx + 1}` };
    }
    const rawUrl = item.url || item.src || item.link || item.accessUrl || '';
    const url = resolveMediaUrl(rawUrl);
    const isVid = item.type === 'video' || Boolean(rawUrl.match(/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i));
    return { url, rawUrl, type: isVid ? 'video' : 'photo', caption: item.caption || item.name || `Item #${idx + 1}` };
  }).filter((m) => m.url && m.url.trim() !== '');

  const hasMedia = normalizedMedia.length > 0;

  return (
    <div className="space-y-3 text-left">
      {/* Problem Statement Card */}
      <div className="bg-white p-4 border border-slate-200/90 rounded-2xl shadow-xs space-y-1.5">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <span className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider">
            Ground Problem Statement
          </span>
          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Citizen Verified
          </span>
        </div>
        <p className="text-xs text-slate-800 leading-relaxed font-normal pt-1">
          {displayedStatement}
        </p>
        {rawStatement.length > 180 && (
          <button
            onClick={() => setShowFullStatement(!showFullStatement)}
            className="text-[11px] font-bold text-[#007A61] hover:underline pt-0.5 cursor-pointer block"
          >
            {showFullStatement ? 'Show Less' : 'Read Full Ground Statement'}
          </button>
        )}
      </div>

      {/* Evidence & Media Section */}
      <div className="bg-white p-4 border border-slate-200/90 rounded-2xl shadow-xs space-y-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <div className="flex items-center space-x-1.5 text-slate-900 font-bold">
            <Camera className="w-4 h-4 text-[#007A61]" />
            <span>Problem Evidence (Photos & Videos)</span>
          </div>
          {hasMedia ? (
            <button
              type="button"
              onClick={onViewEvidence}
              className="text-[10px] text-[#007A61] font-bold hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>View All ({normalizedMedia.length})</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          ) : (
            <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Evidence Not Available
            </span>
          )}
        </div>

        {hasMedia ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
            {normalizedMedia.slice(0, 4).map((media, idx) => (
              <div
                key={idx}
                onClick={onViewEvidence}
                className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-900 cursor-pointer group shadow-2xs hover:border-[#007A61]"
              >
                {media.type === 'video' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white">
                    <Video className="w-4 h-4 text-emerald-400" />
                  </div>
                ) : (
                  <img src={media.url} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-slate-50 rounded-xl flex items-center space-x-2.5 text-slate-500">
            <ImageOff className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-xs">Evidence not available (Citizen submitted this problem statement as text-only).</span>
          </div>
        )}
      </div>

      {/* Institutional Allocation Node Card */}
      <div className="bg-white p-4 border border-slate-200/90 rounded-2xl shadow-xs space-y-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <div className="flex items-center space-x-1.5 text-slate-900 font-bold">
            <GraduationCap className="w-4 h-4 text-[#007A61]" />
            <span>Institutional Allocation Node</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Assigned Institution</span>
            <span className="font-extrabold text-slate-900 text-xs block mt-0.5">{assignedUni}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Designated Department</span>
            <span className="font-extrabold text-slate-900 text-xs block mt-0.5 truncate">{assignedDept}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectorOverviewTab;
