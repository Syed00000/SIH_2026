import React from 'react';
import { motion } from 'framer-motion';
import { JoharSetuIcon } from './JoharSetuIcon.jsx';

/**
 * Floating Circular Trigger button rendered on the bottom-right corner.
 */
export const AssistantTrigger = ({ onClick, unreadCount = 0 }) => {
  return (
    <motion.button
      type="button"
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      title="Open Johar Setu Assistant"
      aria-label="Open Johar Setu Assistant"
      className="relative flex items-center justify-center w-14 h-14 bg-[#015a3a] hover:bg-[#014d34] text-white rounded-full shadow-2xl hover:shadow-emerald-900/40 transition-all cursor-pointer border-2 border-emerald-400/50 group focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
    >
      {/* Central Emblem Badge */}
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform duration-300">
        <JoharSetuIcon className="w-8 h-8" />
      </div>

      {/* Pulsing Status Dot */}
      <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-[#015a3a]" />
      </span>

      {/* Unread badge if any */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -left-1 px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full border border-white shadow-sm">
          {unreadCount}
        </span>
      )}
    </motion.button>
  );
};

export default AssistantTrigger;
