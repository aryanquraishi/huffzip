import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SpotlightCard } from '../ui/spotlight-card';

const TOOLS = [
  { icon: 'compress', title: 'Compress File', desc: 'Reduce file size significantly using optimal prefix codes.', path: '/compress' },
  { icon: 'expand', title: 'Decompress File', desc: 'Restore your compressed files to their original state losslessly.', path: '/decompress' },
  { icon: 'compare_arrows', title: 'Compare Algorithms', desc: 'Analyze Huffman efficiency against standard ZIP compression.', path: '/compare' },
  { icon: 'account_tree', title: 'How it Works', desc: 'Visualize the tree generation and prefix code assignment.', path: '/how-it-works' },
];

export default function ToolsGrid() {
  return (
    <section className="w-full max-w-[1200px]">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-[32px] font-semibold leading-[1.3] text-[#1c1c19] dark:text-white text-center mb-12 w-full flex justify-center"
      >
        Core Utilities
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TOOLS.map((tool, i) => (
          <motion.div
            key={tool.path}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            <Link to={tool.path} className="no-underline block h-full">
              <SpotlightCard
                className="h-full border-[#bdc8cb]/60 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] hover:border-[#005f6a] dark:hover:border-teal-400 shadow-sm transition-all duration-300 hover:-translate-y-1"
                spotlightColor="rgba(0, 95, 106, 0.12)"
              >
                <div className="px-6 py-10 lg:py-12 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                  <div className="w-16 h-16 lg:w-[72px] lg:h-[72px] rounded-full bg-[#ebe8e4] dark:bg-[#2a2a2a] flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[32px] text-[#005f6a] dark:text-teal-400">
                      {tool.icon}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1c1c19] dark:text-white mb-3">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-[#3e494a] dark:text-gray-400 leading-relaxed w-[85%] mx-auto">
                    {tool.desc}
                  </p>
                </div>
              </SpotlightCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
