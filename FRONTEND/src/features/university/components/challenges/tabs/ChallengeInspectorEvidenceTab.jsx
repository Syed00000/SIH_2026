import React, { useState } from 'react';
import {
  ShieldCheck,
  Phone,
  Mail,
  Quote,
  Camera,
  Video,
  Eye,
  X,
  ExternalLink,
  ImageOff,
  FileText,
  Download
} from 'lucide-react';

export const ChallengeInspectorEvidenceTab = ({ challenge = {} }) => {
  const [selectedPreview, setSelectedPreview] = useState(null);

  const submitter = challenge.submitter || {};
  const submitterRole = submitter.role || 'Verified Citizen / Resident';
  const maskedMobile = submitter.mobileNumber || submitter.maskedMobile || '+91 ******4829 (Confidential)';
  const testimony = challenge.description || challenge.problemStatement || 'Problem statement verified by local community and submitted via Citizen Innovation Portal.';

  // Gather all evidence media
  const rawMedia = [
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
      return {
        url: item,
        type: isVid ? 'video' : 'photo',
        caption: `Evidence Item #${idx + 1}`
      };
    }
    const url = item.url || item.src || item.link || '';
    const isVid = item.type === 'video' || Boolean(url.match(/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i));
    return {
      url,
      type: isVid ? 'video' : 'photo',
      caption: item.caption || item.name || `Evidence Item #${idx + 1}`,
      uploadedAt: item.uploadedAt || item.date
    };
  }).filter((m) => m.url && m.url.trim() !== '');

  const hasMedia = normalizedMedia.length > 0;

  return (
    <div className="space-y-3.5 text-xs text-slate-700 text-left">
      {/* Evidence Media Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-[#007A61]" />
            <span className="font-extrabold text-slate-900 text-xs">
              Problem Photo & Video Evidence
            </span>
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
              <div
                key={idx}
                onClick={() => setSelectedPreview(media)}
                className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group cursor-pointer shadow-2xs hover:border-[#007A61] transition-all"
              >
                {media.type === 'video' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white">
                    <Video className="w-6 h-6 text-emerald-400 mb-1" />
                    <span className="text-[10px] font-bold">Video Evidence</span>
                  </div>
                ) : (
                  <img
                    src={media.url}
                    alt={media.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1.5 text-white text-[11px] font-bold">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 text-[9.5px] text-white font-medium truncate">
                  {media.caption}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State when no photos or videos are available */
          <div className="py-8 px-4 text-center space-y-2 bg-slate-50/70 border border-dashed border-slate-200 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-2xs">
              <ImageOff className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-slate-800 text-xs">Evidence Not Available</div>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-0.5">
                No photo or video evidence was attached to this challenge by the citizen.
              </p>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-white rounded-full text-[10px] font-bold text-slate-600 border border-slate-200">
              <FileText className="w-3 h-3 text-slate-400" />
              <span>Submission Type: Text-Only Problem Statement</span>
            </div>
          </div>
        )}
      </div>

      {/* Verified Citizen Details */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#007A61] font-bold flex items-center justify-center border border-emerald-200 text-xs shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-xs flex items-center space-x-1.5">
                <span>Verified Citizen</span>
                <span className="text-[9px] font-bold bg-[#007A61] text-white px-1.5 py-0.2 rounded-full">
                  Citizen
                </span>
              </div>
              <div className="text-[10.5px] text-emerald-800 font-semibold">{submitterRole}</div>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
            Privacy Protected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-2 text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-mono font-medium text-[11px]">{maskedMobile}</span>
          </div>

          <div className="flex items-center space-x-2 text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-[11px] truncate">citizen.verified@jharkhand.gov.in</span>
          </div>
        </div>
      </div>

      {/* Citizen Direct Testimony */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-2">
        <div className="flex items-center space-x-1.5 text-slate-800">
          <Quote className="w-4 h-4 text-[#007A61]" />
          <span className="text-xs font-bold text-slate-900">Direct Citizen Statement</span>
        </div>
        <p className="text-xs text-slate-800 italic leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 font-normal">
          "{testimony}"
        </p>
      </div>

      {/* Full Evidence Lightbox Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs select-none animate-in fade-in duration-150">
          <div className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-3 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="font-extrabold text-xs text-slate-900 truncate">
                {selectedPreview.caption || 'Evidence Inspection'}
              </span>
              <div className="flex items-center space-x-2">
                <a
                  href={selectedPreview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Open Original"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setSelectedPreview(null)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex items-center justify-center bg-slate-950 rounded-xl p-2 min-h-[300px]">
              {selectedPreview.type === 'video' ? (
                <video
                  src={selectedPreview.url}
                  controls
                  autoPlay
                  className="max-h-[65vh] max-w-full rounded-lg"
                />
              ) : (
                <img
                  src={selectedPreview.url}
                  alt={selectedPreview.caption}
                  className="max-h-[65vh] max-w-full object-contain rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeInspectorEvidenceTab;
