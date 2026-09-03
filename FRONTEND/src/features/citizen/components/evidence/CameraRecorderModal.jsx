import React from 'react';
import { Camera, Video, SwitchCamera, X, AlertCircle } from 'lucide-react';
import { formatDurationTimer } from './evidenceValidation.js';

export const CameraRecorderModal = ({ camera }) => {
  const {
    isActive, mode, facingMode, error, isRecording, recordingSeconds,
    videoRef, closeCamera, flipCamera, switchMode, capturePhoto,
    startRecording, stopRecording
  } = camera;

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center sm:p-4 select-none animate-in fade-in duration-150">
      <div className="relative w-full h-full sm:h-[88vh] sm:max-w-md sm:rounded-3xl overflow-hidden bg-black flex flex-col justify-between sm:border sm:border-slate-800 shadow-2xl">
        {/* Fullscreen Video Viewfinder */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-transform ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
        />

        {/* Top Controls Overlay */}
        <div className="relative z-20 p-4 pt-6 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <button
            type="button"
            onClick={closeCamera}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all cursor-pointer"
            title="Close Camera"
          >
            <X className="w-5 h-5" />
          </button>

          {isRecording ? (
            <div className="bg-rose-600/90 text-white px-3.5 py-1 rounded-full text-xs font-black tracking-wider flex items-center space-x-2 shadow-lg backdrop-blur-md animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>REC {formatDurationTimer(recordingSeconds)}</span>
            </div>
          ) : (
            <div className="bg-black/40 backdrop-blur-md text-slate-200 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide flex items-center space-x-1.5">
              {mode === 'video' ? <Video className="w-3.5 h-3.5 text-rose-400" /> : <Camera className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{mode === 'video' ? 'Video Walkthrough' : 'Ground Reality Photo'}</span>
            </div>
          )}

          <button
            type="button"
            onClick={flipCamera}
            disabled={isRecording}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all cursor-pointer disabled:opacity-40"
            title="Flip / Turn Camera"
          >
            <SwitchCamera className="w-5 h-5 text-emerald-300" />
          </button>
        </div>

        {/* Center Error Notice if any */}
        {error && (
          <div className="relative z-20 m-4 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <p>{error}</p>
          </div>
        )}

        {/* Bottom Camera Controls Overlay */}
        <div className="relative z-20 pb-8 pt-10 px-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col items-center space-y-5">
          {/* Mode Switcher */}
          <div className="flex items-center space-x-8 text-xs font-black tracking-widest uppercase">
            <button
              type="button"
              onClick={() => switchMode('photo')}
              disabled={isRecording}
              className={`flex items-center space-x-1.5 pb-1 transition-all cursor-pointer ${
                mode === 'photo'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 scale-105'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>PHOTO</span>
            </button>
            <button
              type="button"
              onClick={() => switchMode('video')}
              disabled={isRecording}
              className={`flex items-center space-x-1.5 pb-1 transition-all cursor-pointer ${
                mode === 'video'
                  ? 'text-rose-500 border-b-2 border-rose-500 scale-105'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>VIDEO</span>
            </button>
          </div>

          {/* Shutter Controls Row */}
          <div className="w-full flex items-center justify-around px-4">
            <button
              type="button"
              onClick={closeCamera}
              className="text-xs font-bold text-white/70 hover:text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {/* Main Shutter Button */}
            {mode === 'photo' ? (
              <button
                type="button"
                onClick={capturePhoto}
                className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform cursor-pointer group shadow-xl"
                title="Snap Photo"
              >
                <div className="w-13 h-13 rounded-full bg-white group-active:scale-90 transition-transform shadow-inner" />
              </button>
            ) : isRecording ? (
              <button
                type="button"
                onClick={stopRecording}
                className="w-18 h-18 rounded-full border-4 border-rose-500 animate-pulse flex items-center justify-center active:scale-95 transition-transform cursor-pointer shadow-xl shadow-rose-600/30"
                title="Stop & Save Video"
              >
                <div className="w-7 h-7 rounded-md bg-rose-600 transition-transform" />
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform cursor-pointer group shadow-xl"
                title="Start Video Recording"
              >
                <div className="w-13 h-13 rounded-full bg-rose-600 group-active:scale-90 transition-transform shadow-inner" />
              </button>
            )}

            <button
              type="button"
              onClick={flipCamera}
              disabled={isRecording}
              className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 active:scale-90 transition-all cursor-pointer disabled:opacity-40"
              title="Flip Camera"
            >
              <SwitchCamera className="w-5 h-5 text-emerald-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraRecorderModal;
