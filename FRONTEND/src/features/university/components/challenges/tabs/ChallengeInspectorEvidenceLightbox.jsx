import React from 'react';
import { X, ExternalLink, Download, FileText } from 'lucide-react';
import { getPdfViewUrl } from '../../../../../shared/utils/openPdf.js';

export const ChallengeInspectorEvidenceLightbox = ({ selectedPreview, onClose }) => {
  if (!selectedPreview) return null;

  const previewUrl = selectedPreview.type === 'pdf'
    ? getPdfViewUrl(selectedPreview.url, selectedPreview.caption)
    : selectedPreview.url;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-3 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-white text-xs font-bold px-1">
          <div className="flex items-center space-x-2 truncate pr-4">
            <span className="truncate">{selectedPreview.caption}</span>
            <span className="text-[10px] text-slate-400 font-mono capitalize">({selectedPreview.type})</span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <a
              href={previewUrl}
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

        <div className="flex-1 overflow-hidden flex items-center justify-center bg-slate-950 rounded-xl p-2 min-h-[350px]">
          {selectedPreview.type === 'video' ? (
            <video src={selectedPreview.url} controls autoPlay className="max-h-[65vh] max-w-full rounded-lg" />
          ) : selectedPreview.type === 'pdf' ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-1">
              <iframe
                src={previewUrl}
                className="w-full h-[62vh] rounded-lg border border-slate-800 bg-white"
                title={selectedPreview.caption}
              />
              <div className="pt-2 flex items-center space-x-2">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white font-bold rounded-lg text-xs shadow-lg transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open PDF in Full Tab</span>
                </a>
              </div>
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
