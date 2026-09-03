import React from 'react';
import { Eye, FileText, Video } from 'lucide-react';

export const ChallengeInspectorEvidenceCard = ({ media, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group cursor-pointer shadow-2xs hover:border-[#007A61] transition-all"
    >
      {media.type === 'video' ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white">
          <Video className="w-6 h-6 text-emerald-400 mb-1" />
          <span className="text-[10px] font-bold">Video Evidence</span>
        </div>
      ) : media.type === 'pdf' ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-amber-50 text-slate-900 p-2">
          <FileText className="w-6 h-6 text-rose-500 mb-1" />
          <span className="text-[10px] font-bold text-slate-800">PDF Document</span>
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
  );
};

export default ChallengeInspectorEvidenceCard;
