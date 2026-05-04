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
  any: { title: 'Compress File', sub: 'Upload any file to apply Huffman coding compression.', accept: '*' },
  image: { title: 'Compress Image', sub: 'Reduce image file size — best for BMP/uncompressed formats.', accept: 'image/*' },
  text: { title: 'Compress Text', sub: 'Maximum savings for text — TXT, CSV, JSON, code files.', accept: '.txt,.csv,.json,.xml,.html,.css,.js,.py,.md,.log' },
  audio: { title: 'Compress Audio', sub: 'Compress audio — best results on uncompressed WAV.', accept: 'audio/*' },
};

export default function CompressPage({ fileType = 'any', accept }) {
  const meta = TITLES[fileType] || TITLES.any;
  const acceptType = accept || meta.accept;

  const { status, jobId, uploadProgress, result, error, warning, upload, checkStatus, reset, getDownloadUrl } = useCompression();
  const { events, lastEvent } = useWebSocket(jobId);
  const [activeTab, setActiveTab] = useState('tools'); // tools | tree | log
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

  const getLabel = () => {
    if (status === 'uploading') return 'Uploading file...';
    if (status === 'complete') return 'Complete!';
    if (lastEvent) return lastEvent.msg;
    return 'Processing...';
  };

  const handleFileSelect = async (file) => { setSelectedFile(file); await upload(file); };
  const handleReset = () => { setSelectedFile(null); reset(); };

  return (
    <div className="container-app pt-4 sm:pt-6 pb-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 sm:mb-6"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-on-bg">{meta.title}</h1>
        <p className="text-sm sm:text-base text-on-surface-v mt-1">{meta.sub}</p>
      </motion.div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden tab-switcher mb-4">
        {[
          { id: 'tools', label: 'Tools', icon: 'tune' },
          { id: 'tree', label: 'Tree', icon: 'account_tree' },
          { id: 'log', label: 'Log', icon: 'terminal' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'active' : ''}
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{tab.icon}</span>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-8">
        {/* Left — Upload + Results */}
        <div className={`w-full lg:w-[40%] flex flex-col gap-4 ${activeTab !== 'tools' ? 'hidden lg:flex' : ''}`}>
          {/* Warning */}
          {warning && (
            <div className="warning-box">
              <span className="material-symbols-outlined fill shrink-0" style={{ fontSize: '20px' }}>warning</span>
              <div>
                <p className="font-semibold text-sm mb-0.5">Compression Warning</p>
                <p className="text-sm">{warning}</p>
              </div>
            </div>
          )}

          {/* Dropzone */}
          {status === 'idle' && <DropZone onFileSelect={handleFileSelect} accept={acceptType} />}

          {/* Progress */}
          {(status === 'uploading' || status === 'processing') && (
            <ProgressBar progress={getProgress()} label={getLabel()} filename={selectedFile?.name} />
          )}

          {/* Cold start */}
          {status === 'uploading' && uploadProgress === 0 && (
            <div className="surface rounded-lg px-4 py-3 flex items-start gap-3">
              <span className="material-symbols-outlined text-warning shrink-0" style={{ fontSize: '18px', color: '#d97706' }}>schedule</span>
              <p className="text-xs sm:text-sm text-on-surface-v">Server may take ~30s to wake up on first request...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="surface rounded-xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <span className="material-symbols-outlined text-danger" style={{ fontSize: '20px', color: '#dc2626' }}>error</span>
                <p className="text-sm text-danger flex-1">{error}</p>
              </div>
              <button onClick={handleReset} className="btn-outline-c w-full text-sm">Try Again</button>
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

          {/* Note */}
          <div className="flex items-start gap-2 text-xs text-muted-c mt-1 px-1">
            <span className="material-symbols-outlined shrink-0" style={{ fontSize: '14px' }}>info</span>
            <span>Already-compressed files (JPEG, MP3, ZIP) may see minimal savings.</span>
          </div>
        </div>

        {/* Right — Visualization Hub */}
        <div className={`w-full lg:w-[60%] flex flex-col gap-4 ${activeTab === 'tools' ? 'hidden lg:flex' : ''}`}>
          <h2 className="hidden lg:block text-xl font-semibold text-on-bg border-b border-slate-200 dark:border-slate-700 pb-2">
            Visualization Hub
          </h2>

          {/* Tree */}
          <div
            className={`${(activeTab === 'tree' || activeTab === 'tools') ? 'block' : 'hidden'} lg:block`}
            style={{ height: 'clamp(280px, 45vh, 460px)' }}
          >
            <HuffmanTree events={events} />
          </div>

          {/* Log */}
          <div
            className={`${activeTab === 'log' ? 'block' : 'hidden'} lg:block`}
            style={{ height: 'clamp(220px, 32vh, 360px)' }}
          >
            <LiveLog events={events} />
          </div>
        </div>
      </div>
    </div>
  );
}
