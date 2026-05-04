import { motion } from 'framer-motion';

const ITEMS = [
  { name: 'WhatsApp', icon: 'chat' },
  { name: 'ZIP', icon: 'folder_zip' },
  { name: 'JPEG', icon: 'image' },
  { name: 'MP3', icon: 'music_note' },
  { name: 'HTTP/2', icon: 'language' },
];

export default function RealWorldSection() {
  return (
    <section className="surface-container py-10 sm:py-12 border-y border-slate-200 dark:border-slate-800">
      <div className="container-app text-center">
        <p className="text-xs sm:text-sm font-semibold text-on-surface-v uppercase tracking-wider mb-6">
          Real-world tech powered by Huffman / Greedy algorithms
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 md:gap-12"
        >
          {ITEMS.map((item) => (
            <div key={item.name} className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-on-surface-v" style={{ fontSize: '20px' }}>{item.icon}</span>
              <span className="text-base sm:text-lg md:text-xl font-bold text-on-bg">{item.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
