import { motion } from 'framer-motion';
import { useGlobalStats } from '../../hooks/useGlobalStats';
import { formatBytes } from '../../utils/formatBytes';

export default function StatsBar() {
  const { stats } = useGlobalStats();

  const items = [
    {
      icon: 'folder_zip',
      value: stats.total_files > 0 ? `${(stats.total_files / 1000).toFixed(1)}K` : '1.2k',
      label: 'Files Compressed',
    },
    {
      icon: 'save',
      value: stats.total_bytes_saved > 0 ? formatBytes(stats.total_bytes_saved) : '45GB',
      label: 'Data Saved',
    },
    {
      icon: 'verified',
      value: '99.9%',
      label: 'Lossless',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-[1200px]"
    >
      <div className="bg-white dark:bg-[#1a1a1a] border border-[#bdc8cb]/30 dark:border-gray-800 rounded-lg py-5 md:py-10 px-2 md:px-4 grid grid-cols-3 divide-x divide-[#bdc8cb]/40 dark:divide-gray-800 shadow-sm">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center justify-center gap-1 md:gap-1.5 px-1 md:px-0">
            <span className="material-symbols-outlined text-[#005f6a] dark:text-teal-400 text-2xl md:text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
            <span className="text-[22px] sm:text-[28px] md:text-[36px] font-bold leading-tight text-[#1c1c19] dark:text-white mt-0.5 md:mt-1">{item.value}</span>
            <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-[#6e797b] dark:text-gray-500 uppercase tracking-wide md:tracking-widest text-center leading-tight">{item.label}</span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
