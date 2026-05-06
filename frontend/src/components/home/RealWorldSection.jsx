import { motion } from 'framer-motion';

const APPLICATIONS = [
  { icon: 'archive', title: 'ZIP & GZIP Formats', desc: 'Combined with LZ77 algorithm to create the ubiquitous DEFLATE compression method.' },
  { icon: 'image', title: 'JPEG & PNG Images', desc: 'Used in the final entropy coding stage to shrink image file sizes without losing detail.' },
  { icon: 'music_note', title: 'MP3 Audio', desc: 'Compresses quantized audio data, allowing for efficient streaming and storage.' },
];

export default function RealWorldSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-[1200px] mb-0"
    >
      <div 
        className="bg-[#f0ede9] dark:bg-[#1a1a1a] border border-[#bdc8cb]/30 dark:border-gray-800 rounded-xl flex flex-col lg:flex-row gap-10 lg:gap-12 items-center"
        style={{ padding: 'clamp(1.5rem, 3%, 3rem)' }}
      >
        {/* Left — Text */}
        <div className="flex-1 space-y-6 w-full">
          <h2 className="text-[32px] font-semibold leading-[1.3] text-[#1c1c19] dark:text-white">
            Real-World Applications
          </h2>
          <p className="text-base leading-relaxed text-[#3e494a] dark:text-gray-400 text-justify">
            Huffman coding isn't just an academic exercise. It forms the backbone of modern
            digital communication and storage protocols by assigning shorter codes to more
            frequent characters.
          </p>
          <ul className="space-y-6 mt-8 list-none p-0">
            {APPLICATIONS.map((item) => (
              <li key={item.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#ebe8e4] dark:bg-[#2a2a2a] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[#005f6a] dark:text-teal-400">{item.icon}</span>
                </div>
                <div className="flex flex-col pt-0.5">
                  <h4 className="text-lg font-bold text-[#1c1c19] dark:text-white mb-1.5 leading-tight">{item.title}</h4>
                  <p className="text-sm text-[#3e494a] dark:text-gray-400 leading-relaxed text-justify">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — Terminal */}
        <div className="flex-1 w-full max-w-xl">
          <div className="bg-[#282a36] dark:bg-[#0d0d0d] rounded-xl p-6 border border-[#6e797b]/20 overflow-hidden shadow-lg">
            {/* Terminal Header */}
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[#6e797b]/30">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
              <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
              <span className="ml-2 text-[#bdc8cb]/70 text-xs tracking-wider" style={{ fontFamily: "'Space Grotesk', monospace" }}>
                terminal ~ huffman-tree.log
              </span>
            </div>
            {/* Terminal Body */}
            <div className="space-y-2 opacity-90" style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '14px', letterSpacing: '0.05em', lineHeight: '1.5' }}>
              <p className="text-[#f8f8f2]">&gt; Analyzing character frequencies...</p>
              <p className="text-[#8be9fd]">&gt; Frequencies: {`{'e': 12, 'a': 9, 'i': 9, 'o': 7, 'n': 6, 's': 4, 't': 3}`}</p>
              <p className="text-[#f8f8f2]">&gt; Building priority queue...</p>
              <p className="text-[#f8f8f2]">&gt; Merging nodes (s:4) and (t:3) → N1:7</p>
              <p className="text-[#f8f8f2]">&gt; Merging nodes (n:6) and (o:7) → N2:13</p>
              <p className="text-[#f8f8f2]">&gt; Generating prefix codes...</p>
              <p className="text-[#50fa7b]">&gt; Codes generated successfully.</p>
              <div className="h-4"></div>
              <p className="text-[#f1fa8c]">&gt; e: 00</p>
              <p className="text-[#f1fa8c]">&gt; a: 010</p>
              <p className="text-[#f1fa8c]">&gt; i: 011</p>
              <div className="h-2"></div>
              <p className="text-[#f8f8f2]">&gt; Compression ratio calculated: <span className="text-[#ff79c6] font-bold">42.5%</span></p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
