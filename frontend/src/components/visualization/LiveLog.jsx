import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = {
  COMPLETE: '#10b981',
  ERROR: '#ef4444',
  MERGE: '#7ad4e2',
  STAGE: '#fbbf24',
  ENCODE_PROGRESS: '#bdc8cb',
  default: '#bdc8cb',
};

export default function LiveLog({ events = [] }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [events]);

  return (
    <div className="bg-[#33333B] dark:bg-[#0d0d0d] border border-[#6e797b] dark:border-gray-800 rounded-lg h-full flex flex-col overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#5e5d66]">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-white uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', monospace" }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>terminal</span>
          System Console
        </span>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
        </div>
      </div>
      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="flex-1 px-4 py-3 overflow-y-auto"
        style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '14px', letterSpacing: '0.05em', lineHeight: '1.4' }}
      >
        {events.length === 0 ? (
          <div className="text-[#6e797b] text-sm space-y-1">
            <div>HuffZip Core Engine v4.2.1 ready.</div>
            <div className="opacity-70">&gt; Waiting for compression to start...</div>
          </div>
        ) : (
          <AnimatePresence>
            {events.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1 }}
                className="py-0.5"
                style={{ color: COLORS[event.type] || COLORS.default }}
              >
                &gt; {event.msg}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
