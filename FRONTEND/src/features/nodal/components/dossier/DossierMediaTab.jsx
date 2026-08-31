import React, { useState } from 'react';
import { Camera, Eye, ExternalLink, X } from 'lucide-react';

export const DossierMediaTab = ({ evidenceMedia = [] }) => {
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState(null);

  if (evidenceMedia.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs bg-slate-50 border border-slate-200/90 rounded-lg">
        <Camera className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="font-semibold text-slate-700">No media evidence uploaded</p>
        <p className="text-[11px] text-slate-400">Citizen submitted this problem statement as text-only.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {evidenceMedia.map((media, idx) => {
          const url = typeof media === 'string' ? media : media.url;
          return (
            <div
              key={idx}
              onClick={() => setSelectedPhotoPreview(url)}
              className="relative aspect-video rounded-lg overflow-hidden border border-slate-200/90 bg-slate-100 hover:opacity-90 transition-opacity cursor-pointer group shadow-2xs"
            >
              <img
                src={url}
                alt={`Evidence #${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1.5 text-white text-xs font-bold">
                <Eye className="w-4 h-4" />
                <span>View Full</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Photo Lightbox Modal */}
      {selectedPhotoPreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative max-w-2xl w-full bg-white rounded-xl overflow-hidden shadow-2xl p-2">
            <button
              onClick={() => setSelectedPhotoPreview(null)}
              className="absolute top-4 right-4 p-1.5 bg-slate-900/80 text-white rounded-full hover:bg-slate-900 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={selectedPhotoPreview}
              alt="High-Res Evidence Preview"
              className="w-full max-h-[75vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DossierMediaTab;
