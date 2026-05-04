import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="w-full bg-[#f6f5f3] dark:bg-slate-900 pt-16 pb-12 sm:pt-24 sm:pb-16 px-4 flex flex-col items-center text-center">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl sm:text-5xl md:text-[52px] font-bold leading-tight text-slate-800 dark:text-slate-100 max-w-4xl"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        Every tool you need to compress files in one place
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-base md:text-[20px] text-slate-600 dark:text-slate-400 max-w-[800px] mt-5 md:mt-6 leading-[1.6]"
      >
        Every tool you need to compress, decompress, and compare file formats, at your fingertips. All are fully optimized and easy to use! Merge, split, compress, convert PDFs... wait, no, we do Huffman compression with just a few clicks.
      </motion.p>
    </section>
  );
}
