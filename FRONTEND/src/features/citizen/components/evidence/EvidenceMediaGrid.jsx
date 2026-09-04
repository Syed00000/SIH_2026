import React, { useState } from 'react';
import { Eye, FileText, Trash2, X } from 'lucide-react';

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

export const EvidenceMediaGrid = ({
  mediaList = [],
  onDelete,
  disabled = false
}) => {
  const [previewMedia, setPreviewMedia] = useState(null);

  if (!mediaList || mediaList.length === 0) return null;

  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
        <span>Attached Evidence ({mediaList.length})</span>
        <span className="text-[10px] font-medium text-slate-400">Stored privately & securely</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {mediaList.map((item, idx) => {
          const rawUrl = typeof item === 'string' ? item : (item.url || item.accessUrl || '');
          const url = resolveMediaUrl(rawUrl);
          const type =
            item.fileType ||
            (rawUrl.match(/\.(mp4|webm|mov)(\?.*)?$/i) ? 'video' : rawUrl.match(/\.pdf(\?.*)?$/i) ? 'pdf' : 'image');
          const name = item.fileName || item.caption || `Evidence #${idx + 1}`;
          const sizeKB = item.fileSize ? Math.round(item.fileSize / 1024) : null;

          return (
            <div
              key={item.mediaId || idx}
              className="relative group rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              {type === 'image' && (
                <div
                  onClick={() => setPreviewMedia({ url, name })}
                  className="relative h-28 w-full bg-slate-100 overflow-hidden cursor-pointer"
                >
                  <img src={url} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold space-x-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </div>
                </div>
              )}

              {type === 'video' && (
                <div className="relative h-28 w-full bg-slate-900 flex flex-col items-center justify-center text-white p-2">
                  <video src={url} className="max-h-full max-w-full rounded" controls />
                </div>
              )}

              {type === 'pdf' && (
                <div className="h-28 w-full bg-amber-50/50 flex flex-col items-center justify-center p-3 border-b border-amber-100">
                  <FileText className="w-8 h-8 text-rose-500 mb-1" />
                  <span className="text-[11px] font-bold text-slate-800 text-center line-clamp-1">{name}</span>
                  {sizeKB && <span className="text-[10px] text-slate-500 font-medium">{sizeKB} KB</span>}
                </div>
              )}

              <div className="p-2.5 flex items-center justify-between bg-white text-xs border-t border-slate-100">
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-slate-900 truncate text-[11px]">{name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">
                    {type} {sizeKB ? `• ${sizeKB} KB` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(idx, item)}
                  disabled={disabled}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Evidence"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {previewMedia && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-2">
            <button
              type="button"
              onClick={() => setPreviewMedia(null)}
              className="absolute top-4 right-4 p-1.5 bg-slate-900/80 text-white rounded-full hover:bg-slate-900 transition-colors z-10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={previewMedia.url} alt={previewMedia.name} className="w-full max-h-[75vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceMediaGrid;
