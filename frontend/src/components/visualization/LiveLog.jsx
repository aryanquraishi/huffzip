import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = {
  COMPLETE: '#22c55e',
  ERROR: '#ef4444',
  MERGE: '#60a5fa',
  STAGE: '#fbbf24',
  ENCODE_PROGRESS: '#94a3b8',
  default: '#cbd5e1',
};

export default function LiveLog({ events = [] }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [events]);

  return (
    <div className="terminal-c h-full">
      <div className="terminal-header-c">
        <div className="terminal-dots">
          <span className="r" />
          <span className="y" />
          <span className="g" />
        </div>
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>terminal</span>
          System Console
        </span>
      </div>
      <div ref={scrollRef} className="terminal-body-c">
        {events.length === 0 ? (
          <div className="text-slate-500 dark:text-slate-600 text-xs space-y-1">
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
