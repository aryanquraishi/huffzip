import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="w-full max-w-[1200px] flex flex-col items-center text-center gap-6 mb-20">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-[48px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1c1c19] dark:text-white max-w-3xl"
      >
        Efficient File Compression with Huffman Coding
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-lg leading-[1.6] text-[#3e494a] dark:text-gray-400 max-w-2xl mt-2 mb-4"
      >
        A project for Analysis and Design of Algorithms (ADA). Experience seamless,
        lossless data compression powered by intuitive greedy algorithms.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex gap-4"
      >
        <Link to="/compress" className="no-underline">
          <button className="bg-[#005f6a] text-white px-8 py-4 rounded-lg hover:bg-[#004f57] transition-colors flex items-center gap-2 cursor-pointer border-none text-base">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>compress</span>
            Start Compressing
          </button>
        </Link>
        <Link to="/how-it-works" className="no-underline">
          <button className="border border-[#005f6a] dark:border-teal-400 text-[#005f6a] dark:text-teal-400 px-8 py-4 rounded-lg hover:bg-[#ebe8e4] dark:hover:bg-[#2a2a2a] transition-colors flex items-center gap-2 cursor-pointer bg-transparent text-base">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>code</span>
            View Source
          </button>
        </Link>
      </motion.div>
    </section>
  );
}
