import Hero from '../components/home/Hero';
import ToolsGrid from '../components/home/ToolsGrid';
import StatsBar from '../components/home/StatsBar';
import RealWorldSection from '../components/home/RealWorldSection';
import FileUploadDemo from '../components/ui/file-upload-demo';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const STEPS = [
  { step: 1, title: 'Upload Payload', desc: 'Drag & drop your file into the secure processing zone.', icon: 'upload_file' },
  { step: 2, title: 'Algorithm Analysis', desc: 'Our engine maps frequencies & builds the optimal binary tree.', icon: 'account_tree' },
  { step: 3, title: 'Download Output', desc: 'Retrieve your optimized .huff file — fully reversible.', icon: 'download' },
];

export default function HomePage() {
  return (
    <div className="bg-[#f6f5f3] dark:bg-slate-900 min-h-screen">
      <Hero />
      <ToolsGrid />
      <StatsBar />
      
      {/* File Upload Demo */}
      <section className="bg-white dark:bg-slate-950 py-10 border-y border-slate-200 dark:border-slate-800">
        <div className="container-app">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-on-bg">Advanced Upload Experience</h2>
            <p className="text-sm text-on-surface-v mt-2">Try out the new drag-and-drop interactive interface.</p>
          </div>
          <div className="flex justify-center max-h-[600px] overflow-hidden -my-10 relative z-10">
            <FileUploadDemo />
          </div>
        </div>
      </section>

      {/* Transparent Process */}
      <section className="bg-[#f6f5f3] dark:bg-slate-900 py-12 sm:py-16 md:py-20">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-on-bg">Transparent Process</h2>
            <p className="text-sm sm:text-base text-on-surface-v mt-2">Three simple steps. Full visibility.</p>
          </motion.div>

          <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-6">
            {STEPS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex-1 flex items-center gap-4 md:gap-2"
              >
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-xl relative flex-1 h-full shadow-sm hover:shadow-md transition-shadow">
                  <div className="absolute -top-3 -left-3 w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                    {item.step}
                  </div>
                  <div className="icon-box mb-3 mt-2">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '24px' }}>arrow_forward</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/how-it-works" className="no-underline">
              <button className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-6 py-3 rounded-lg hover:shadow-md transition-all flex items-center gap-2 mx-auto font-medium">
                Learn the Full Algorithm
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      <RealWorldSection />
    </div>
  );
}
