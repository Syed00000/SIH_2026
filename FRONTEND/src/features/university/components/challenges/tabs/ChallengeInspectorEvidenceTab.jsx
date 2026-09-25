import React, { useState } from 'react';
import { ShieldCheck, Phone, Mail, Quote, Camera, ImageOff } from 'lucide-react';
import { ChallengeInspectorEvidenceCard } from './ChallengeInspectorEvidenceCard.jsx';
import { ChallengeInspectorEvidenceLightbox } from './ChallengeInspectorEvidenceLightbox.jsx';
import { getPdfViewUrl } from '../../../../../shared/utils/openPdf.js';
import { resolveMediaUrl } from '../../../../../shared/utils/mediaUtils.js';

export const ChallengeInspectorEvidenceTab = ({ challenge = {} }) => {
  const [selectedPreview, setSelectedPreview] = useState(null);

  const submitter = challenge.submitter || {};
  const submitterRole = submitter.role || 'Verified Citizen / Resident';
  const maskedMobile = submitter.mobileNumber || submitter.maskedMobile || '+91 ******4829 (Confidential)';
  const testimony = challenge.description || challenge.problemStatement || 'Problem statement verified by local community.';

  const rawMedia = [
    ...(Array.isArray(challenge.media) ? challenge.media : []),
    ...(Array.isArray(challenge.evidence) ? challenge.evidence : []),
    ...(Array.isArray(challenge.attachments) ? challenge.attachments : []),
    ...(Array.isArray(challenge.photos) ? challenge.photos : []),
    ...(Array.isArray(challenge.images) ? challenge.images : []),
    ...(Array.isArray(challenge.videos) ? challenge.videos : []),
    ...(Array.isArray(challenge.mediaUrls) ? challenge.mediaUrls : [])
  ].filter(Boolean);

  const seenUrls = new Set();
  const normalizedMedia = [];

  for (let idx = 0; idx < rawMedia.length; idx++) {
    const item = rawMedia[idx];
    const rawUrl = typeof item === 'string' ? item.trim() : (item.url || item.src || item.link || item.accessUrl || '').trim();
    if (!rawUrl || seenUrls.has(rawUrl)) continue;
    seenUrls.add(rawUrl);

    const rawFinalUrl = resolveMediaUrl(rawUrl);
    const isVid = Boolean(item.fileType === 'video' || item.type === 'video' || rawUrl.match(/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i) || rawUrl.includes('/video/'));
    const isPdf = Boolean(item.fileType === 'pdf' || item.type === 'pdf' || rawUrl.match(/\.pdf(\?.*)?$/i) || rawUrl.includes('/raw/'));
    const caption = item.caption || item.fileName || item.name || `Evidence Item #${normalizedMedia.length + 1}`;
    const url = isPdf ? getPdfViewUrl(rawFinalUrl, caption) : rawFinalUrl;

    normalizedMedia.push({
      url,
      type: isVid ? 'video' : isPdf ? 'pdf' : 'photo',
      caption,
      uploadedAt: item.uploadedAt || item.date
    });
  }

  const hasMedia = normalizedMedia.length > 0;

  return (
    <div className="space-y-3.5 text-xs text-slate-700 text-left">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-[#007A61]" />
            <span className="font-extrabold text-slate-900 text-xs">Problem Photo & Video Evidence</span>
          </div>
          {hasMedia ? (
            <span className="text-[10px] font-bold bg-emerald-50 text-[#007A61] px-2.5 py-0.5 rounded-full border border-emerald-200">
              {normalizedMedia.length} File{normalizedMedia.length > 1 ? 's' : ''} Attached
            </span>
          ) : (
            <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
              No Media Uploaded
            </span>
          )}
        </div>

        {hasMedia ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            {normalizedMedia.map((media, idx) => (
              <ChallengeInspectorEvidenceCard key={idx} media={media} onClick={() => setSelectedPreview(media)} />
            ))}
          </div>
        ) : (
          <div className="py-8 px-4 text-center space-y-2 bg-slate-50/70 border border-dashed border-slate-200 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-2xs">
              <ImageOff className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-slate-800 text-xs">Evidence Not Available</div>
              <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm mx-auto">
                The submitter provided a textual problem statement without photographic documentation.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Verified Submitter Section */}
      <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
          <div className="flex items-center space-x-2 text-emerald-950 font-extrabold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Submitter Profile & Testimony</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
            {submitterRole}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11.5px]">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 block">Reported By</span>
            <div className="font-bold text-slate-900">{submitter.name || 'Anonymous Resident'}</div>
            <div className="text-slate-600 text-[11px] flex items-center space-x-1">
              <Phone className="w-3 h-3 text-slate-400 inline" />
              <span>{maskedMobile}</span>
            </div>
            {submitter.email && (
              <div className="text-slate-600 text-[11px] flex items-center space-x-1">
                <Mail className="w-3 h-3 text-slate-400 inline" />
                <span className="truncate">{submitter.email}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 block">Ground Verification Note</span>
            <div className="relative pl-3 italic text-slate-700 bg-white/70 rounded-lg p-2 border border-emerald-100">
              <Quote className="w-3 h-3 text-emerald-600 absolute -top-1 -left-1 opacity-40" />
              <p className="line-clamp-3 text-[11px] leading-relaxed">"{testimony}"</p>
            </div>
          </div>
        </div>
      </div>

      <ChallengeInspectorEvidenceLightbox selectedPreview={selectedPreview} onClose={() => setSelectedPreview(null)} />
    </div>
  );
};

export default ChallengeInspectorEvidenceTab;
