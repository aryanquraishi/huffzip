import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { FlowButton } from '../components/ui/flow-button';

const STEPS = [
  {
    step: 1,
    icon: 'bar_chart',
    title: 'Frequency Analysis',
    desc: 'Algorithm scans input in O(n) and counts every byte. High-frequency bytes will get the shortest codes.',
  },
  {
    step: 2,
    icon: 'grid_view',
    title: 'Min-Heap Initialization',
    desc: 'Each unique byte becomes a leaf node and is inserted into a priority queue (min-heap) for fast retrieval.',
  },
  {
    step: 3,
    icon: 'merge',
    title: 'Greedy Merging',
    desc: 'Repeatedly extract the two lowest-frequency nodes and merge them — the greedy choice that builds the optimal tree.',
    highlight: true,
  },
  {
    step: 4,
    icon: 'account_tree',
    title: 'Code Assignment (DFS)',
    desc: 'DFS traversal of the tree: left edge = 0, right edge = 1. Result: prefix-free variable-length codes.',
  },
  {
    step: 5,
    icon: 'code',
    title: 'Bit-Level Encoding',
    desc: 'Original bytes are replaced with their codes, packed tightly into a bitstream. Lossless, compact, fully reversible.',
  },
];

const COMPARISON_TABLE = [
  { feature: 'Encoding Length', ascii: 'Fixed (8 bits/char)', huffman: 'Variable (1–n bits/char)' },
  { feature: 'Efficiency', ascii: 'Static, often wasteful', huffman: 'Data-dependent, optimized' },
  { feature: 'Prefix Property', ascii: 'N/A', huffman: 'Strictly prefix-free' },
  { feature: 'Best Use Case', ascii: 'Uniform data', huffman: 'Skewed distributions' },
];

export default function HowItWorksPage() {
  return (
    <main className="flex-grow container-app py-10 flex flex-col gap-20">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mt-6"
      >
        <div className="w-16 h-16 rounded-full bg-[#007a87] text-white flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-3xl">school</span>
        </div>
        <h1 className="text-[48px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1c1c19] dark:text-white">
          The Magic of the <span className="text-[#005f6a] dark:text-teal-400">Greedy Algorithm</span>
        </h1>
        <p className="text-lg leading-[1.6] text-[#3e494a] dark:text-gray-400 mt-4 max-w-2xl mx-auto">
          HuffZip uses Huffman Coding — a provably optimal prefix-code algorithm — to achieve lossless compression by assigning variable-length codes based on byte frequencies.
        </p>
      </motion.div>

      {/* 5-step Process */}
      <section>
        <h2 className="text-[32px] font-semibold leading-[1.3] text-[#1c1c19] dark:text-white text-center mb-12">
          The 5-Step Process
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`bg-white dark:bg-[#1a1a1a] border rounded-lg p-6 relative ${s.highlight ? 'border-[#005f6a] dark:border-teal-400 ring-1 ring-[#005f6a] dark:ring-teal-400' : 'border-[#bdc8cb] dark:border-gray-800'}`}
            >
              <div className="absolute -top-3 -left-3 w-9 h-9 bg-[#005f6a] text-white rounded-full flex items-center justify-center text-sm font-bold">
                {s.step}
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#ebe8e4] dark:bg-[#2a2a2a] flex items-center justify-center mb-3 mt-2">
                <span className="material-symbols-outlined text-[#005f6a] dark:text-teal-400">{s.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-[#1c1c19] dark:text-white mb-2">{s.title}</h3>
              <p className="text-sm text-[#3e494a] dark:text-gray-400 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-[32px] font-semibold leading-[1.3] text-[#1c1c19] dark:text-white text-center mb-12">
          Huffman vs Standard Storage
        </h2>
        <div className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-[#bdc8cb]/60 dark:border-gray-800 overflow-hidden shadow-sm">
          <Table className="min-w-[600px]">
            <TableHeader className="bg-[#fcf9f5] dark:bg-[#111]">
              <TableRow className="border-b border-[#bdc8cb]/40 dark:border-gray-800 hover:bg-transparent">
                <TableHead className="w-1/3 text-center py-4 px-6 text-[#1c1c19] dark:text-gray-300 font-bold text-sm uppercase tracking-wider whitespace-normal leading-normal">Feature</TableHead>
                <TableHead className="w-1/3 text-center py-4 px-6 text-[#1c1c19] dark:text-gray-300 font-bold text-sm uppercase tracking-wider whitespace-normal leading-normal">Standard (ASCII)</TableHead>
                <TableHead className="w-1/3 text-center py-4 px-6 text-[#005f6a] dark:text-teal-400 font-bold text-sm uppercase tracking-wider whitespace-normal leading-normal">Huffman (HuffZip)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPARISON_TABLE.map((row) => (
                <TableRow
                  key={row.feature}
                  className="hover:bg-[#f6f3ef] dark:hover:bg-[#222222] transition-colors border-b border-[#bdc8cb]/15 dark:border-gray-800/50"
                >
                  <TableCell className="text-center py-4 px-6 font-semibold text-[#1c1c19] dark:text-white whitespace-normal leading-relaxed">{row.feature}</TableCell>
                  <TableCell className="text-center py-4 px-6 text-[#3e494a] dark:text-gray-400 whitespace-normal leading-relaxed">{row.ascii}</TableCell>
                  <TableCell className="text-center py-4 px-6 text-[#005f6a] dark:text-teal-400 font-semibold whitespace-normal leading-relaxed">{row.huffman}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.section>

      {/* ADA Connection */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#f0ede9] dark:bg-[#1a1a1a] rounded-lg p-8 border border-[#bdc8cb]/30 dark:border-gray-800"
      >
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#ebe8e4] dark:bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[#005f6a] dark:text-teal-400">menu_book</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1c1c19] dark:text-white mb-2">
              ADA Syllabus Connection — Unit 4: Greedy Method
            </h3>
            <p className="text-sm text-[#3e494a] dark:text-gray-400 leading-relaxed text-left md:text-justify">
              Huffman Coding is the canonical example of the Greedy Method paradigm in Algorithm Design and Analysis (ADA). It demonstrates how locally optimal choices — merging the two smallest frequencies — lead to a globally optimal solution for data compression.
            </p>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <div className="text-center flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-[#1c1c19] dark:text-white mb-6">Ready to see it in action?</h2>
        <Link to="/compress" className="no-underline inline-block">
          <FlowButton text="Try It Yourself" />
        </Link>
      </div>
    </main>
  );
}
