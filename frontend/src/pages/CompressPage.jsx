import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DropZone from '../components/compress/DropZone';
import ProgressBar from '../components/compress/ProgressBar';
import ResultCard from '../components/compress/ResultCard';
import DownloadBtn from '../components/compress/DownloadBtn';
import LiveLog from '../components/visualization/LiveLog';
import HuffmanTree from '../components/visualization/HuffmanTree';
import { useCompression } from '../hooks/useCompression';
import { useWebSocket } from '../hooks/useWebSocket';

const TITLES = {
  any: { title: 'Huffman Compression', sub: 'Upload a file to generate its optimal Huffman tree and compress its data payload with technical precision.', accept: '*' },
  image: { title: 'Compress Image', sub: 'Reduce image file size — best for BMP/uncompressed formats.', accept: 'image/*' },
  text: { title: 'Compress Text', sub: 'Maximum savings for text — TXT, CSV, JSON, code files.', accept: '.txt,.csv,.json,.xml,.html,.css,.js,.py,.md,.log' },
  audio: { title: 'Compress Audio', sub: 'Compress audio — best results on uncompressed WAV.', accept: 'audio/*' },
};

export default function CompressPage({ fileType = 'any', accept }) {
  const meta = TITLES[fileType] || TITLES.any;
  const acceptType = accept || meta.accept;

  const { status, jobId, uploadProgress, result, error, warning, upload, checkStatus, reset, getDownloadUrl } = useCompression();
  const { events, lastEvent } = useWebSocket(jobId);
  const [activeTab, setActiveTab] = useState('tools');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (lastEvent?.type === 'COMPLETE') checkStatus(jobId);
  }, [lastEvent, jobId, checkStatus]);

  const getProgress = () => {
    if (status === 'uploading') return uploadProgress;
    if (status === 'complete') return 100;
    const ep = events.filter(e => e.type === 'ENCODE_PROGRESS');
    if (ep.length > 0) return ep[ep.length - 1].progress || 0;
    const me = events.filter(e => e.type === 'MERGE');
    if (me.length > 0) return Math.min(75, Math.round((me[me.length - 1].count / me[me.length - 1].total) * 75));
    if (events.length > 0) return 10;
    return 0;
  };

  const handleReset = () => { setSelectedFile(null); reset(); };

  const getLabel = () => {
    if (status === 'uploading') return 'Uploading file...';
    if (status === 'complete') return 'Complete!';
    if (lastEvent) return lastEvent.msg;
    return 'Processing...';
  };

  const handleFileSelect = async (file) => { setSelectedFile(file); await upload(file); };

  return (
    <main className="flex-grow container-app py-10">
      {/* Header */}
      <div className="w-full flex justify-center mb-16">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center text-center max-w-4xl space-y-4"
        >
          <h1 className="text-[32px] md:text-[40px] font-semibold leading-[1.2] text-[#1c1c19] dark:text-white text-center w-full">
            {meta.title}
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-[#3e494a] dark:text-gray-400 max-w-2xl text-center mx-auto">
            {meta.sub}
          </p>
        </motion.section>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex rounded-lg border border-[#bdc8cb] dark:border-gray-800 overflow-hidden mb-6">
        {[
          { id: 'tools', label: 'Tools', icon: 'tune' },
          { id: 'tree', label: 'Tree', icon: 'account_tree' },
          { id: 'log', label: 'Log', icon: 'terminal' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors border-none cursor-pointer ${activeTab === tab.id
                ? 'bg-[#005f6a] text-white'
                : 'bg-white dark:bg-[#1a1a1a] text-[#3e494a] dark:text-gray-400'
              }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Grid: 4-col left + 8-col right */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ═══ Left Column: Upload, Warning, Log ═══ */}
        <div className={`lg:col-span-4 flex flex-col gap-6 min-w-0 ${(activeTab !== 'tools' && activeTab !== 'log') ? 'hidden lg:flex' : ''}`}>

          {/* Small Drop Zone */}
          {status === 'idle' && (
            <DropZone onFileSelect={handleFileSelect} accept={acceptType} />
          )}

          {/* Progress (when uploading/processing) */}
          {(status === 'uploading' || status === 'processing') && (
            <ProgressBar progress={getProgress()} label={getLabel()} filename={selectedFile?.name} />
          )}

          {/* Cold start warning */}
          {status === 'uploading' && uploadProgress === 0 && (
            <div className="bg-white dark:bg-[#1a1a1a] border border-[#bdc8cb] dark:border-gray-800 rounded-lg px-4 py-3 flex items-start gap-3">
              <span className="material-symbols-outlined shrink-0 text-amber-600" style={{ fontSize: '18px' }}>schedule</span>
              <p className="text-xs text-[#3e494a] dark:text-gray-400">Server may take ~30s to wake up on first request...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-white dark:bg-[#1a1a1a] border border-[#bdc8cb] dark:border-gray-800 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <span className="material-symbols-outlined text-red-600" style={{ fontSize: '20px' }}>error</span>
                <p className="text-sm text-red-600 flex-1">{error}</p>
              </div>
              <button onClick={handleReset} className="w-full border border-[#005f6a] dark:border-teal-400 text-[#005f6a] dark:text-teal-400 px-4 py-2.5 rounded-lg text-sm font-semibold bg-transparent cursor-pointer hover:bg-[#ebe8e4] dark:hover:bg-[#2a2a2a] transition-colors">
                Try Again
              </button>
            </div>
          )}

          {/* Results */}
          {status === 'complete' && result && (
            <>
              <ResultCard result={result} />
              <DownloadBtn
                downloadUrl={getDownloadUrl()}
                filename={selectedFile ? `${selectedFile.name}.huff` : 'compressed.huff'}
                onReset={handleReset}
              />
            </>
          )}

          {/* Warning (suboptimal format) */}
          {warning && (
            <div className="bg-[#ffdad6] dark:bg-red-900/20 rounded p-4 flex items-start gap-3 border border-[#ffb4ab] dark:border-red-800">
              <span className="material-symbols-outlined text-[#93000a] dark:text-red-400 mt-0.5">warning</span>
              <div>
                <h4 className="text-xs font-semibold text-[#93000a] dark:text-red-400 uppercase mb-1">Suboptimal Format Detected</h4>
                <p className="text-sm text-[#93000a] dark:text-red-400">{warning}</p>
              </div>
            </div>
          )}

          {/* Live Log Terminal */}
          <div className={`${activeTab === 'log' ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-[#33333B] dark:bg-[#0d0d0d] rounded-lg p-4 flex flex-col min-h-[300px] border border-[#6e797b]">
              {/* Terminal Header */}
              <div className="flex items-center justify-between mb-4 border-b border-[#5e5d66] pb-2">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Compression Log</h4>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#97f0ff]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffdad6]"></div>
                </div>
              </div>
              {/* Log Content */}
              <div
                className="flex-grow space-y-2 overflow-y-auto opacity-90"
                style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '14px', letterSpacing: '0.05em', lineHeight: '1.4' }}
              >
                {events.length === 0 ? (
                  <>
                    <p className="text-[#bdc8cb]">&gt; Waiting for file upload...</p>
                    <p className="text-white animate-pulse">_</p>
                  </>
                ) : (
                  <>
                    {events.map((evt, i) => (
                      <p key={i} className={evt.type === 'FREQ_DONE' || evt.type === 'COMPLETE' ? 'text-[#97f0ff]' : 'text-[#bdc8cb]'}>
                        &gt; {evt.msg || JSON.stringify(evt)}
                      </p>
                    ))}
                    {status !== 'complete' && <p className="text-white animate-pulse">_</p>}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Right Column: Progress Stats + Tree Visualization ═══ */}
        <div className={`lg:col-span-8 flex flex-col gap-6 min-w-0 ${(activeTab === 'tools' || activeTab === 'log') ? 'hidden lg:flex' : ''}`}>

          {/* Progress & Stats Header Card */}
          <div className="bg-white dark:bg-[#1a1a1a] border border-[#bdc8cb] dark:border-gray-800 rounded-lg p-6 flex flex-col gap-4 overflow-hidden" style={{ padding: '24px' }}>
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0 flex-1 overflow-hidden">
                <h2 
                  className="font-semibold leading-[1.3] text-[#1c1c19] dark:text-white break-all line-clamp-2 text-sm md:text-2xl"
                  title={selectedFile?.name || ''}
                >
                  {selectedFile?.name || 'No file selected'}
                </h2>
                <p className="text-sm md:text-base text-[#3e494a] dark:text-gray-400 mt-1">
                  {status === 'idle' ? 'Upload a file to begin' : status === 'complete' ? 'Compression complete!' : 'Compressing payload...'}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[32px] md:text-[48px] font-bold leading-[1.2] tracking-[-0.02em] text-[#005f6a] dark:text-teal-400">
                  {getProgress()}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full bg-[#e5e2de] dark:bg-[#2a2a2a] rounded-full overflow-hidden">
              <div className="h-full bg-[#005f6a] dark:bg-teal-400 rounded-full transition-all duration-500" style={{ width: `${getProgress()}%` }}></div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-2 border-t border-[#bdc8cb] dark:border-gray-800">
              <div className="flex gap-8 sm:gap-12 flex-1">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#6e797b] dark:text-gray-500 uppercase mb-1">Target Ratio</p>
                  <p className="text-2xl font-semibold text-[#1c1c19] dark:text-white">
                    {result ? `${result.ratio}:1` : '—'}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#6e797b] dark:text-gray-500 uppercase mb-1">Est. Time</p>
                  <p className="text-2xl font-semibold text-[#1c1c19] dark:text-white">
                    {result ? `${result.time_ms}ms` : '—'}
                  </p>
                </div>
              </div>
              <div className="flex items-center w-full sm:w-auto mt-2 sm:mt-0">
                {status === 'complete' && result ? (
                  <a
                    href={getDownloadUrl()}
                    download={selectedFile ? `${selectedFile.name}.huff` : 'compressed.huff'}
                    className="bg-[#dcdad6] dark:bg-[#2a2a2a] text-[#1c1c19] dark:text-white text-xs font-semibold px-6 py-3 rounded flex items-center justify-center gap-2 no-underline hover:bg-[#e5e2de] dark:hover:bg-[#333333] transition-colors w-full sm:w-auto"
                  >
                    <span className="material-symbols-outlined text-sm shrink-0">download</span>
                    <span className="truncate">Download .huff File</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="bg-[#dcdad6] dark:bg-[#2a2a2a] text-[#1c1c19] dark:text-gray-500 text-xs font-semibold px-6 py-3 rounded flex items-center justify-center gap-2 opacity-50 cursor-not-allowed border-none w-full sm:w-auto"
                  >
                    <span className="material-symbols-outlined text-sm shrink-0">download</span>
                    <span className="truncate">Download .huff File</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Huffman Tree Visualization */}
          <div
            className={`${(activeTab === 'tree' || activeTab === 'tools') ? 'block' : 'hidden'} lg:block`}
          >
            <div className="bg-white dark:bg-[#1a1a1a] border border-[#bdc8cb] dark:border-gray-800 rounded-lg p-6 flex flex-col min-h-[400px] overflow-hidden" style={{ padding: '24px' }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-[#1c1c19] dark:text-white">
                  Huffman Tree Visualization (D3.js)
                </h3>
                <div className="flex gap-2">
                  <button className="p-2 border border-[#bdc8cb] dark:border-gray-700 rounded text-[#3e494a] dark:text-gray-400 hover:bg-[#f6f3ef] dark:hover:bg-[#2a2a2a] transition-colors bg-transparent cursor-pointer">
                    <span className="material-symbols-outlined text-sm">zoom_in</span>
                  </button>
                  <button className="p-2 border border-[#bdc8cb] dark:border-gray-700 rounded text-[#3e494a] dark:text-gray-400 hover:bg-[#f6f3ef] dark:hover:bg-[#2a2a2a] transition-colors bg-transparent cursor-pointer">
                    <span className="material-symbols-outlined text-sm">zoom_out</span>
                  </button>
                </div>
              </div>
              {/* Tree Canvas */}
              <div className="flex-grow border border-[#e5e2de] dark:border-gray-800 rounded bg-[#fcf9f5] dark:bg-[#111111] flex items-center justify-center relative overflow-hidden min-h-[300px]">
                <HuffmanTree events={events} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
