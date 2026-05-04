import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TOOLS = [
  { icon: 'folder_zip', title: 'Compress All', desc: 'Intelligent compression for any file type maintaining structure.', path: '/compress', color: '#ff544a' },
  { icon: 'image', title: 'Compress Image', desc: 'Specifically tuned for visual media — BMP, PNG, JPEG.', path: '/compress/image', color: '#ffb930' },
  { icon: 'description', title: 'Compress Text', desc: 'Maximum savings via Huffman coding for text & documents.', path: '/compress/text', color: '#3aa68b' },
  { icon: 'audio_file', title: 'Compress Audio', desc: 'Specialized for WAV/MP3 — preserves audio fidelity.', path: '/compress/audio', color: '#00c3ff' },
  { icon: 'unarchive', title: 'Decompress', desc: 'Restore .huff archives to original with byte-perfect integrity.', path: '/decompress', color: '#9d72e8' },
  { icon: 'compare_arrows', title: 'Compare', desc: 'Benchmark Huffman vs RLE vs LZ77 side-by-side.', path: '/compare', color: '#1db954' },
];

export default function ToolsGrid() {
  return (
    <section className="w-full bg-[#f6f5f3] dark:bg-slate-900 pb-20 px-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.path + tool.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={tool.path} className="no-underline block h-full">
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-xl hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.05)] transition-shadow cursor-pointer group h-full flex flex-col items-start">
                  <div className="mb-4">
                    <span className="material-symbols-outlined text-[32px] md:text-[40px]" style={{ color: tool.color }}>{tool.icon}</span>
                  </div>
                  <h3 className="text-[18px] md:text-[20px] font-bold text-slate-800 dark:text-slate-100 mb-2 leading-tight group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-[13px] md:text-[14px] text-slate-500 dark:text-slate-400 leading-snug flex-1">{tool.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
