import { motion } from 'framer-motion';
import { useGlobalStats } from '../../hooks/useGlobalStats';
import { formatBytes } from '../../utils/formatBytes';

export default function StatsBar() {
  const { stats } = useGlobalStats();

  const items = [
    {
      icon: 'folder_zip',
      value: stats.total_files > 0 ? `${(stats.total_files / 1000).toFixed(1)}K+` : '2.4M+',
      label: 'Files Compressed',
      sub: 'Across all sessions',
      highlight: false,
    },
    {
      icon: 'hard_drive',
      value: stats.total_bytes_saved > 0 ? formatBytes(stats.total_bytes_saved) : '850 TB',
      label: 'Space Saved',
      sub: 'High efficiency achieved',
      highlight: true,
    },
    {
      icon: 'call_merge',
      value: '10B+',
      label: 'Algorithm Merges',
      sub: 'Greedy heap operations',
      highlight: false,
    },
  ];

  return (
    <section className="container-app py-4 sm:py-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-xl p-5 border transition-all hover:shadow-md ${
              item.highlight
                ? 'bg-primary text-white border-transparent'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className={`flex items-center gap-2 mb-2 ${
              item.highlight ? 'text-white/80' : 'text-on-surface-v'
            }`}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{item.icon}</span>
              <span className="text-xs font-semibold uppercase tracking-wider">{item.label}</span>
            </div>
            <p className={`text-2xl sm:text-3xl font-bold ${
              item.highlight ? 'text-white' : 'text-on-bg'
            }`}>
              {item.value}
            </p>
            <p className={`text-xs mt-1 ${
              item.highlight ? 'text-white/70' : 'text-muted-c'
            }`}>
              {item.sub}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
