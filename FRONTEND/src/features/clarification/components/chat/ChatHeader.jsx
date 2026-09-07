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
  hasAssignedUni,
  nodalDepartment,
  nodalPhone,
  isTypingRemote,
  soundEnabled,
  setSoundEnabled,
  onShowClearConfirm,
  onClose
}) => {
  return (
    <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200/80 text-[#047857] shrink-0">
          {isUniversityView ? <Shield className="w-4 h-4 text-[#047857]" /> : <GraduationCap className="w-4 h-4 text-[#047857]" />}
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-[#047857]">
              {challengeId}
            </span>
            <div className="text-xs font-bold text-slate-900">
              {isUniversityView ? (
                <span className="text-slate-900 font-bold">State Nodal Officer</span>
              ) : (
                <span className="text-slate-900 font-bold">{hasAssignedUni ? uniName : 'University (Not Assigned)'}</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[10.5px] text-slate-500 font-medium mt-0.5">
            {isTypingRemote ? (
              <span className="flex items-center space-x-1 text-[#047857] font-bold animate-pulse">
                <span>typing...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-[#047857] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#047857] animate-pulse"></span>
                <span>Online &bull; Live WebSocket</span>
              </span>
            )}
            <span className="text-slate-300">&bull;</span>
            <span className="text-slate-500 truncate max-w-[260px]">
              {isUniversityView ? nodalDepartment : (hasAssignedUni ? `${uniName} Innovation Desk` : 'Institutional Desk (Not Assigned)')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1.5">
        <button
          type="button"
          onClick={onShowClearConfirm}
          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer transition-colors"
          title="Clear Room Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-1.5 text-slate-500 hover:text-[#047857] hover:bg-emerald-50 rounded-md cursor-pointer transition-colors"
          title={soundEnabled ? 'Mute Chime' : 'Unmute Chime'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-[#047857]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        {isUniversityView && (
          <a
            href={`tel:${nodalPhone}`}
            className="hidden sm:flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#047857] border border-emerald-300 px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-2xs"
            title="Direct Hotline with State Nodal Admin"
          >
            <Phone className="w-3.5 h-3.5 text-[#047857]" />
            <span>Call Desk: {nodalPhone}</span>
          </a>
        )}

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-md cursor-pointer transition-colors"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
