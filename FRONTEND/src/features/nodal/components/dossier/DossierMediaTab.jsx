import React, { useState } from 'react';
import { Camera, Video, FileText, Eye, ExternalLink, X, Download } from 'lucide-react';
import { getPdfViewUrl } from '../../../../shared/utils/openPdf.js';

const resolveMediaUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const backendBase = (typeof window !== 'undefined' && window.location.port === '5173')
    ? 'http://127.0.0.1:3000'
    : '';
  return `${backendBase}${cleanPath}`;
};

export const DossierMediaTab = ({ evidenceMedia = [] }) => {
  const [selectedPreview, setSelectedPreview] = useState(null);

  if (!evidenceMedia || evidenceMedia.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs bg-slate-50 border border-slate-200/90 rounded-lg">
        <Camera className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="font-semibold text-slate-700">No media evidence uploaded</p>
        <p className="text-[11px] text-slate-400">Citizen submitted this problem statement as text-only.</p>
      </div>
    );
  }

  const normalizedItems = evidenceMedia.map((item, idx) => {
    if (typeof item === 'string') {
      const isVid = Boolean(item.match(/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i) || item.includes('/video/'));
      const isPdf = Boolean(item.match(/\.pdf(\?.*)?$/i) || item.includes('/raw/'));
      return {
        url: resolveMediaUrl(item),
        rawUrl: item,
        type: isVid ? 'video' : isPdf ? 'pdf' : 'image',
        name: `Evidence Item #${idx + 1}`
      };
    }
    const rawUrl = item.url || item.src || item.link || item.accessUrl || '';
    const url = resolveMediaUrl(rawUrl);
    const isVid = item.fileType === 'video' || item.type === 'video' || Boolean(rawUrl.match(/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i));
    const isPdf = item.fileType === 'pdf' || item.type === 'pdf' || Boolean(rawUrl.match(/\.pdf(\?.*)?$/i));
    return {
      url,
      rawUrl,
      type: isVid ? 'video' : isPdf ? 'pdf' : 'image',
      name: item.fileName || item.caption || item.name || `Evidence Item #${idx + 1}`,
      size: item.fileSize ? `${Math.round(item.fileSize / 1024)} KB` : ''
    };
  }).filter((m) => m.url && m.url.trim() !== '');

  return (
    <div className="space-y-4 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {normalizedItems.map((media, idx) => {
          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              {/* Media Display */}
              {media.type === 'image' && (
                <div
                  onClick={() => setSelectedPreview(media)}
                  className="relative h-32 w-full bg-slate-100 overflow-hidden cursor-pointer group"
                >
                  <img
                    src={media.url}
                    alt={media.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1.5 text-white text-xs font-bold">
                    <Eye className="w-4 h-4" />
                    <span>View Full</span>
                  </div>
                </div>
              )}

              {media.type === 'video' && (
                <div className="relative h-32 w-full bg-slate-900 flex items-center justify-center p-1">
                  <video
                    src={media.url}
                    controls
                    className="max-h-full max-w-full rounded"
                  />
                </div>
              )}

              {media.type === 'pdf' && (
                <div className="h-32 w-full bg-amber-50/50 flex flex-col items-center justify-center p-3 border-b border-amber-100">
                  <FileText className="w-8 h-8 text-rose-500 mb-1" />
                  <span className="text-[11px] font-bold text-slate-800 text-center line-clamp-1">
                    {media.name}
                  </span>
                  {media.size && (
                    <span className="text-[10px] text-slate-500 font-medium">{media.size}</span>
                  )}
                  <a
                    href={getPdfViewUrl(media.url, media.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center space-x-1 text-[10px] font-bold text-[#007A61] bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open Document</span>
                  </a>
                </div>
              )}

              {/* Card Meta */}
              <div className="p-2 flex items-center justify-between bg-white text-xs border-t border-slate-100">
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-slate-900 truncate text-[11px]">{media.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">
                    {media.type} {media.size ? `• ${media.size}` : ''}
                  </p>
                </div>
                <a
                  href={media.type === 'pdf' ? getPdfViewUrl(media.url, media.name) : media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-slate-400 hover:text-slate-900 rounded transition-colors cursor-pointer"
                  title="Open Asset in New Tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Photo Lightbox Modal */}
      {selectedPreview && selectedPreview.type === 'image' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative max-w-3xl w-full bg-white rounded-xl overflow-hidden shadow-2xl p-3 flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-bold text-slate-900">
              <span className="truncate">{selectedPreview.name}</span>
              <div className="flex items-center space-x-2">
                <a
                  href={selectedPreview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setSelectedPreview(null)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <img
              src={selectedPreview.url}
              alt={selectedPreview.name}
              className="w-full max-h-[75vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DossierMediaTab;
