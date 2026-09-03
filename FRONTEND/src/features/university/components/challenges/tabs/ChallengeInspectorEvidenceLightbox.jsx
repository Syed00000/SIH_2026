import React from 'react';
import { X, ExternalLink, Download, FileText } from 'lucide-react';

export const ChallengeInspectorEvidenceLightbox = ({ selectedPreview, onClose }) => {
  if (!selectedPreview) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-3 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-white text-xs font-bold px-1">
          <div className="flex items-center space-x-2 truncate pr-4">
            <span className="truncate">{selectedPreview.caption}</span>
            <span className="text-[10px] text-slate-400 font-mono capitalize">({selectedPreview.type})</span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <a
              href={selectedPreview.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Open full-resolution"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex items-center justify-center bg-slate-950 rounded-xl p-2 min-h-[300px]">
          {selectedPreview.type === 'video' ? (
            <video src={selectedPreview.url} controls autoPlay className="max-h-[65vh] max-w-full rounded-lg" />
          ) : selectedPreview.type === 'pdf' ? (
            <div className="p-8 text-center text-white flex flex-col items-center justify-center space-y-3">
              <FileText className="w-16 h-16 text-rose-400" />
              <p className="text-sm font-bold">{selectedPreview.caption}</p>
              <a
                href={selectedPreview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download / View Document</span>
              </a>
            </div>
          ) : (
            <img src={selectedPreview.url} alt={selectedPreview.caption} className="max-h-[65vh] max-w-full object-contain rounded-lg" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeInspectorEvidenceLightbox;
