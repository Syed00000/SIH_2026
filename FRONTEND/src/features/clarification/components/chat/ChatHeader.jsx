import React from 'react';
import {
  X,
  Phone,
  Shield,
  GraduationCap,
  Volume2,
  VolumeX,
  Trash2
} from 'lucide-react';

export const ChatHeader = ({
  isUniversityView,
  challengeId,
  uniName,
  nodalDepartment,
  nodalPhone,
  isTypingRemote,
  soundEnabled,
  setSoundEnabled,
  onShowClearConfirm,
  onClose
}) => {
  return (
    <div className="p-3.5 border-b border-slate-200/90 bg-[#f8fafc] flex items-center justify-between flex-shrink-0">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-[#007A61] text-white flex items-center justify-center font-extrabold shadow-sm border border-emerald-600/30">
            {isUniversityView ? <Shield className="w-5 h-5 text-white" /> : <GraduationCap className="w-5 h-5 text-white" />}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-[11px] text-[#007A61] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {challengeId}
            </span>
            <div className="text-xs font-bold text-slate-900">
              {isUniversityView ? (
                <span className="text-slate-900 font-bold">State Nodal Officer</span>
              ) : (
                <span className="text-slate-900 font-bold">{uniName}</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[10.5px] text-slate-500 font-medium mt-0.5">
            {isTypingRemote ? (
              <span className="flex items-center space-x-1 text-emerald-600 font-bold animate-pulse">
                <span>typing...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-emerald-700 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Online &bull; Live WebSocket</span>
              </span>
            )}
            <span className="text-slate-300">&bull;</span>
            <span className="text-slate-500 truncate max-w-[260px]">
              {isUniversityView ? nodalDepartment : `${uniName} Innovation Desk`}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1.5">
        <button
          type="button"
          onClick={onShowClearConfirm}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full cursor-pointer transition-colors"
          title="Clear Room Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 text-slate-400 hover:text-[#007A61] hover:bg-emerald-50 rounded-full cursor-pointer transition-colors"
          title={soundEnabled ? 'Mute Chime' : 'Unmute Chime'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-[#007A61]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        {isUniversityView && (
          <a
            href={`tel:${nodalPhone}`}
            className="hidden sm:flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#007A61] border border-emerald-300 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs"
            title="Direct Hotline with State Nodal Admin"
          >
            <Phone className="w-3.5 h-3.5 text-[#007A61]" />
            <span>Call Desk: {nodalPhone}</span>
          </a>
        )}

        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
