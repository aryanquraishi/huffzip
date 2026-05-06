import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../constants/fileTypes';
import { formatBytes } from '../utils/formatBytes';

const TERMINAL_LOGS = [
  { text: '> Initiating decompression sequence...', color: 'text-gray-400' },
  { text: '> Reading file header... OK', color: 'text-gray-400' },
  { text: '> Magic Bytes [HUFF] verified.', color: 'text-green-400' },
  { text: '> Extracting frequency table...', color: 'text-gray-400' },
  { text: '> Rebuilding Huffman Tree (256 nodes)... OK', color: 'text-gray-400' },
];

export default function DecompressPage() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const simulateLogs = () => {
    TERMINAL_LOGS.forEach((log, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
        setProgress(Math.min(15 + i * 15, 75));
      }, i * 600);
    });
  };

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile.name.endsWith('.huff')) {
      setError('Only .huff files can be decompressed.');
      setStatus('error');
      return;
    }

    setFile(selectedFile);
    setStatus('processing');
    setError(null);
    setLogs([]);
    setProgress(0);
    simulateLogs();

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const response = await axios.post(`${API_URL}/decompress`, formData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const originalFilename = response.headers['content-disposition']?.match(/filename="(.+)"/)?.[1] || 'restored_file';
      const blob = new Blob([response.data]);
      setProgress(100);
      setLogs(prev => [...prev, { text: '> Decompression complete!', color: 'text-green-400' }]);
      setTimeout(() => {
        setResult({
          url: window.URL.createObjectURL(blob),
          filename: originalFilename,
          originalSize: parseInt(response.headers['x-original-size'] || '0'),
          fileType: response.headers['x-file-type'] || 'Unknown',
        });
        setStatus('complete');
      }, 500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Decompression failed');
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setStatus('idle');
    setError(null);
    setResult(null);
    setFile(null);
    setProgress(0);
    setLogs([]);
  };

  const handleDrag = useCallback((e) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDragIn = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragOut = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) handleFileSelect(e.dataTransfer.files[0]);
  }, []);

  return (
    <main className="flex-grow container-app py-20 flex flex-col items-center gap-20">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-[48px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1c1c19] dark:text-white mb-2">
          Decompress Archive
        </h1>
        <p className="text-lg leading-[1.6] text-[#3e494a] dark:text-gray-400">
          Restore your .huff archives to their original state with lossless precision.
        </p>
      </motion.header>

      {/* Drop Zone — visible in idle state */}
      {status === 'idle' && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`w-full max-w-3xl bg-[#fcf9f5] dark:bg-[#1a1a1a] border-2 border-dashed border-[#005f6a] dark:border-teal-400 rounded-lg p-12 flex flex-col items-center justify-center gap-6 relative group transition-all hover:bg-white dark:hover:bg-[#222222] cursor-pointer ${isDragging ? 'bg-[#005f6a]/5 dark:bg-teal-400/5' : ''}`}
          onDragOver={handleDrag}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".huff"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />
          <div className="w-20 h-20 rounded-full bg-[#007a87] text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl">unarchive</span>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#1c1c19] dark:text-white mb-2">
              {isDragging ? 'Drop your file here!' : 'Drop your .huff file here'}
            </h2>
            <p className="text-base text-[#3e494a] dark:text-gray-400">or click to browse from your device</p>
          </div>
          <button
            className="bg-[#005f6a] text-white px-6 py-3 rounded-lg text-xs font-semibold hover:bg-teal-700 transition-colors mt-4 cursor-pointer border-none"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            type="button"
          >
            Select .huff File
          </button>
          <div className="absolute inset-0 bg-[#005f6a]/5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
        </motion.section>
      )}

      {/* Processing View */}
      {status === 'processing' && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl bg-white dark:bg-[#1a1a1a] border border-[#bdc8cb] dark:border-gray-800 rounded-lg p-8 flex flex-col gap-8"
        >
          {/* File info + status badge */}
          <div className="flex justify-between items-start min-w-0">
            <div className="min-w-0 pr-4">
              <h3 className="text-2xl font-semibold text-[#1c1c19] dark:text-white flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[#005f6a] dark:text-teal-400 shrink-0">description</span>
                <span className="truncate">{file?.name || 'file.huff'}</span>
              </h3>
              <p className="text-base text-[#3e494a] dark:text-gray-400 mt-1 truncate">
                {file ? formatBytes(file.size) : '—'}
              </p>
            </div>
            <div className="bg-[#ebe8e4] dark:bg-[#2a2a2a] text-[#3e494a] dark:text-gray-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-[#bdc8cb] dark:border-gray-700">
              <span className="material-symbols-outlined text-[16px] animate-spin">sync</span> Processing
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-xs font-semibold text-[#3e494a] dark:text-gray-400">
              <span>Validating Magic Bytes [HUFF]...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-3 bg-[#e5e2de] dark:bg-[#2a2a2a] rounded-full overflow-hidden">
              <div className="h-full bg-[#005f6a] dark:bg-teal-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Terminal Log */}
          <div className="bg-[#33333B] dark:bg-[#0d0d0d] rounded-lg p-4 flex flex-col gap-2 h-48 overflow-y-auto" style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '14px', letterSpacing: '0.05em', lineHeight: '1.4' }}>
            {logs.map((log, i) => (
              <div key={i} className={log.color}>{log.text}</div>
            ))}
            {progress < 100 && (
              <>
                <div className="text-white">&gt; Decoding bitstream... [{'|'.repeat(Math.floor(progress / 5))}{'  '.substring(0, 20 - Math.floor(progress / 5))}] {progress}%</div>
                <div className="text-white animate-pulse">_</div>
              </>
            )}
          </div>
        </motion.section>
      )}

      {/* Error */}
      {status === 'error' && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl bg-white dark:bg-[#1a1a1a] border border-[#bdc8cb] dark:border-gray-800 rounded-lg p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          </div>
          <h3 className="text-2xl font-semibold text-[#1c1c19] dark:text-white mb-2">Decompression Failed</h3>
          <p className="text-base text-[#3e494a] dark:text-gray-400 mb-6">{error}</p>
          <button onClick={handleReset} className="bg-[#005f6a] text-white px-6 py-3 rounded-lg text-xs font-semibold hover:bg-teal-700 transition-colors cursor-pointer border-none">
            Try Again
          </button>
        </motion.section>
      )}

      {/* Completed View */}
      {status === 'complete' && result && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl bg-white dark:bg-[#1a1a1a] border border-[#bdc8cb] dark:border-gray-800 rounded-lg p-8 flex flex-col gap-6 relative overflow-hidden"
        >
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#005f6a] to-[#7ad4e2]"></div>

          {/* Success icon + text */}
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] dark:bg-green-900/20 text-[#2E7D32] dark:text-green-400 flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h3 className="text-[32px] font-semibold leading-[1.3] text-[#1c1c19] dark:text-white">Original file ready</h3>
            <p className="text-base text-[#3e494a] dark:text-gray-400 max-w-md">
              Decompression completed successfully without data loss. Reconstructed file structure is intact.
            </p>
          </div>

          {/* File info + download */}
          <div className="bg-[#f6f3ef] dark:bg-[#222222] border border-[#bdc8cb] dark:border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#6e797b] dark:text-gray-500 text-2xl">csv</span>
              <div className="text-left">
                <div className="text-xs font-semibold text-[#1c1c19] dark:text-white">{result.filename}</div>
                <div className="text-sm text-[#3e494a] dark:text-gray-400">Original Size: {formatBytes(result.originalSize)}</div>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="bg-[#005f6a] text-white px-6 py-3 rounded text-xs font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer border-none"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Download Original File
            </button>
          </div>

          {/* Reset link */}
          <div className="text-center mt-2">
            <button onClick={handleReset} className="text-[#005f6a] dark:text-teal-400 text-xs font-semibold hover:underline bg-transparent border-none cursor-pointer">
              Decompress another file
            </button>
          </div>
        </motion.section>
      )}
    </main>
  );
}
