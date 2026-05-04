import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
    <div className="container-app pt-4 sm:pt-6 pb-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="icon-box icon-box-lg mx-auto mb-4">
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>school</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-on-bg leading-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            The Magic of the <span className="text-primary">Greedy Algorithm</span>
          </h1>
          <p className="text-sm sm:text-base text-on-surface-v mt-4 max-w-2xl mx-auto leading-relaxed">
            HuffZip uses Huffman Coding — a provably optimal prefix-code algorithm — to achieve lossless compression by assigning variable-length codes based on byte frequencies.
          </p>
        </motion.div>

        {/* 5-step Process */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-on-bg text-center mb-6 sm:mb-8">
          The 5-Step Process
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-12 sm:mb-16">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`surface rounded-xl p-5 sm:p-6 relative ${s.highlight ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="absolute -top-3 -left-3 w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                {s.step}
              </div>
              <div className="icon-box mb-3 mt-2">
                <span className="material-symbols-outlined">{s.icon}</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-on-bg mb-2">{s.title}</h3>
              <p className="text-sm text-on-surface-v leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-on-bg text-center mb-6 sm:mb-8">
            Huffman vs Standard Storage
          </h2>
          <div className="surface rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(195,198,215,0.3)' }}>
                    <th className="text-left py-3 sm:py-4 px-4 sm:px-5 text-muted-c font-semibold text-xs uppercase tracking-wider">Feature</th>
                    <th className="text-left py-3 sm:py-4 px-4 sm:px-5 text-muted-c font-semibold text-xs uppercase tracking-wider">Standard (ASCII)</th>
                    <th className="text-left py-3 sm:py-4 px-4 sm:px-5 text-primary font-semibold text-xs uppercase tracking-wider">Huffman (HuffZip)</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_TABLE.map((row) => (
                    <tr
                      key={row.feature}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      style={{ borderBottom: '1px solid rgba(195,198,215,0.15)' }}
                    >
                      <td className="py-3 sm:py-4 px-4 sm:px-5 font-medium text-on-bg">{row.feature}</td>
                      <td className="py-3 sm:py-4 px-4 sm:px-5 text-on-surface-v">{row.ascii}</td>
                      <td className="py-3 sm:py-4 px-4 sm:px-5 text-primary font-medium">{row.huffman}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* ADA Connection */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="surface-container rounded-xl p-5 sm:p-6 md:p-8 mb-12 sm:mb-16"
        >
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="icon-box shrink-0">
              <span className="material-symbols-outlined">menu_book</span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-on-bg mb-2">
                ADA Syllabus Connection — Unit 4: Greedy Method
              </h3>
              <p className="text-sm text-on-surface-v leading-relaxed">
                Huffman Coding is the canonical example of the Greedy Method paradigm in Algorithm Design and Analysis (ADA). It demonstrates how locally optimal choices — merging the two smallest frequencies — lead to a globally optimal solution for data compression.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-on-bg mb-4">Ready to see it in action?</h2>
          <Link to="/compress" className="no-underline">
            <button className="btn-primary-c text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>play_arrow</span>
              Try It Yourself
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
