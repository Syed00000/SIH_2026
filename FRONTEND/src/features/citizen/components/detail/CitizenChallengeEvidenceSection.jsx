import React, { useState } from 'react';
import { Camera, Eye, FileText, X, ExternalLink, Download, ImageOff } from 'lucide-react';

export const CitizenChallengeEvidenceSection = ({ challenge = {} }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Gather raw media items prioritizing rich objects first
  const rawSources = [
    ...(Array.isArray(challenge.media) ? challenge.media : []),
    ...(Array.isArray(challenge.evidence) ? challenge.evidence : []),
    ...(Array.isArray(challenge.attachments) ? challenge.attachments : []),
    ...(Array.isArray(challenge.photos) ? challenge.photos : []),
    ...(Array.isArray(challenge.images) ? challenge.images : []),
    ...(Array.isArray(challenge.videos) ? challenge.videos : []),
    ...(Array.isArray(challenge.mediaUrls) ? challenge.mediaUrls : [])
  ].filter(Boolean);

  // Deduplicate strictly by URL / public ID
  const seenUrls = new Set();
  const normalized = [];

  for (let idx = 0; idx < rawSources.length; idx++) {
    const item = rawSources[idx];
    const url = typeof item === 'string' ? item.trim() : (item.url || item.src || item.link || '').trim();
    if (!url || seenUrls.has(url)) continue;
    seenUrls.add(url);

    const isVid = Boolean(item.fileType === 'video' || item.type === 'video' || url.match(/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i) || url.includes('/video/'));
    const isPdf = Boolean(item.fileType === 'pdf' || item.type === 'pdf' || url.match(/\.pdf(\?.*)?$/i) || url.includes('/raw/'));

    normalized.push({
      url,
      type: isVid ? 'video' : isPdf ? 'pdf' : 'photo',
      name: item.fileName || item.caption || item.name || `Ground Evidence #${normalized.length + 1}`,
      size: item.fileSize ? `${Math.round(item.fileSize / 1024)} KB` : ''
    });
  }

  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-black text-slate-900 tracking-wide uppercase">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center shadow-2xs">
            <Camera className="w-3.5 h-3.5 text-emerald-700" />
          </div>
          <span>Attached Ground Evidence</span>
        </div>
        <span className="text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
          {normalized.length} {normalized.length === 1 ? 'Evidence Asset' : 'Evidence Assets'}
        </span>
      </div>

      {normalized.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {normalized.map((item, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              {item.type === 'photo' && (
                <div onClick={() => setSelectedPhoto(item)} className="relative h-36 w-full bg-slate-100 overflow-hidden cursor-pointer">
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                    <span className="inline-flex items-center space-x-1.5 text-white text-xs font-bold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect High-Res</span>
                    </span>
                  </div>
                </div>
              )}

              {item.type === 'video' && (
                <div className="h-36 w-full bg-slate-950 flex items-center justify-center p-1 relative">
                  <video src={item.url} controls className="max-h-full max-w-full rounded-xl" />
                </div>
              )}

              {item.type === 'pdf' && (
                <div className="h-36 w-full bg-amber-50/50 p-4 flex flex-col items-center justify-center text-center border-b border-amber-100/70">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-amber-200 flex items-center justify-center mb-1.5">
                    <FileText className="w-5 h-5 text-rose-500" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</span>
                  {item.size && <span className="text-[10px] text-slate-500 font-medium mt-0.5">{item.size}</span>}
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-2 text-[10px] font-extrabold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 px-3 py-1 rounded-lg inline-flex items-center space-x-1 transition-colors">
                    <Download className="w-3 h-3" />
                    <span>View Document</span>
                  </a>
                </div>
              )}

              <div className="p-3 flex items-center justify-between text-xs bg-white border-t border-slate-100">
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-slate-900 truncate text-[11px]">{item.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize font-medium">{item.type} {item.size ? `• ${item.size}` : ''}</p>
                </div>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors" title="Open in new tab">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-slate-50/80 border border-dashed border-slate-200 text-center flex flex-col items-center justify-center space-y-1.5 text-slate-400 text-xs">
          <ImageOff className="w-6 h-6 text-slate-300" />
          <span className="font-medium text-slate-600">No media evidence attached</span>
          <span className="text-[11px] text-slate-400">Citizen submitted this problem statement without photos.</span>
        </div>
      )}

      {selectedPhoto && (
        <div className="fixed inset-0 z-60 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-2 border border-slate-800">
            <div className="flex items-center justify-between p-2 text-white text-xs font-bold border-b border-slate-800 mb-2">
              <span className="truncate pr-4">{selectedPhoto.name}</span>
              <button onClick={() => setSelectedPhoto(null)} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <img src={selectedPhoto.url} alt={selectedPhoto.name} className="w-full max-h-[75vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenChallengeEvidenceSection;
