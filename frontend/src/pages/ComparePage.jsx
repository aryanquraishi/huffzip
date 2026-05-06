import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../constants/fileTypes';
import { formatBytes } from '../utils/formatBytes';

const ALGO_META = {
  huffman: { name: 'Huffman', complexity: 'Greedy O(n log n)', barColor: '#005f6a', barDarkColor: '#5eead4' },
  rle: { name: 'RLE', complexity: 'O(n)', barColor: '#5e5d66', barDarkColor: '#9ca3af' },
  lz77: { name: 'LZ77', complexity: 'Dictionary-based', barColor: '#6e797b', barDarkColor: '#6b7280' },
};

export default function ComparePage() {
  const [status, setStatus] = useState('idle');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFileSelect = async (file) => {
    setStatus('processing');
    setError(null);
    setSelectedFile(file);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${API_URL}/compare`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResults(response.data);
      setStatus('complete');
    } catch (err) {
      setError(err.response?.data?.detail || 'Comparison failed');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setResults(null);
    setError(null);
    setSelectedFile(null);
  };

  const handleDrag = useCallback((e) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDragIn = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragOut = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) handleFileSelect(e.dataTransfer.files[0]);
  }, []);

  // Compute chart data from results
  const getAlgoData = () => {
    if (!results) return [];
    return Object.entries(results.algorithms).map(([key, val]) => ({
      key,
      ...ALGO_META[key],
      compressedSize: val.compressed_size,
      ratio: val.ratio,
      time_ms: val.time_ms,
    }));
  };

  const algoData = getAlgoData();
  const bestAlgo = algoData.length > 0 ? algoData.reduce((a, b) => a.ratio > b.ratio ? a : b) : null;
  const maxSize = results ? Math.max(...algoData.map(a => a.compressedSize), results.original_size) : 1;
  const maxTime = results ? Math.max(...algoData.map(a => a.time_ms), 1) : 1;

  return (
    <main className="flex-grow container-app py-10 flex flex-col gap-20">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-[48px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1c1c19] dark:text-white mb-2">
          Algorithm Benchmark
        </h1>
        <p className="text-lg leading-[1.6] text-[#3e494a] dark:text-gray-400">
          Upload a file to test and compare compression efficiency across three distinct algorithms: Huffman, Run-Length Encoding (RLE), and LZ77.
        </p>
      </motion.section>

      {/* Upload & File Info Section */}
      {(status === 'idle' || status === 'processing') && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-[#e5e2de] dark:border-gray-800 p-6 flex flex-col items-center gap-6"
        >
          {/* Drop Zone */}
          <div
            className={`w-full max-w-2xl border-2 border-dashed border-[#005f6a] dark:border-teal-400 rounded-lg p-12 flex flex-col items-center justify-center bg-[#f6f3ef] dark:bg-[#111111] hover:bg-[#f0ede9] dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer group ${isDragging ? 'bg-[#005f6a]/5' : ''}`}
            onDragOver={handleDrag}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
            <span className="material-symbols-outlined text-4xl text-[#005f6a] dark:text-teal-400 mb-4 group-hover:scale-110 transition-transform">cloud_upload</span>
            <p className="text-2xl font-semibold text-[#1c1c19] dark:text-white mb-2">Drag & Drop file here</p>
            <p className="text-base text-[#5e5d66] dark:text-gray-400 mb-6">or click to browse from your device</p>
            <button
              className="bg-[#005f6a] text-white text-xs font-semibold px-6 py-3 rounded-full hover:bg-[#004f57] transition-colors cursor-pointer border-none"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              type="button"
            >
              Select File
            </button>
          </div>

          {/* File info + Run button */}
          {selectedFile && (
            <div className="flex items-center gap-4 w-full max-w-2xl bg-[#ebe8e4] dark:bg-[#2a2a2a] p-4 rounded-lg">
              <span className="material-symbols-outlined text-[#5e5d66] dark:text-gray-400">insert_drive_file</span>
              <div className="flex-grow min-w-0">
                <p className="text-xs font-semibold text-[#1c1c19] dark:text-white truncate">{selectedFile.name}</p>
                <p className="text-xs text-[#5e5d66] dark:text-gray-400">{formatBytes(selectedFile.size)}</p>
              </div>
              {status === 'processing' ? (
                <div className="flex items-center gap-2 text-[#005f6a] dark:text-teal-400 text-xs font-semibold">
                  <span className="material-symbols-outlined text-sm animate-spin">sync</span> Running...
                </div>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); handleFileSelect(selectedFile); }}
                  className="bg-[#005f6a] text-white text-xs font-semibold px-6 py-2 rounded-full hover:bg-[#004f57] transition-colors flex items-center gap-2 cursor-pointer border-none"
                >
                  <span className="material-symbols-outlined text-sm">play_arrow</span> Run Benchmark
                </button>
              )}
            </div>
          )}
        </motion.section>
      )}

      {/* Error */}
      {status === 'error' && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-[#1a1a1a] border border-[#bdc8cb] dark:border-gray-800 rounded-lg p-8 text-center max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          </div>
          <h3 className="text-2xl font-semibold text-[#1c1c19] dark:text-white mb-2">Benchmark Failed</h3>
          <p className="text-base text-[#3e494a] dark:text-gray-400 mb-6">{error}</p>
          <button onClick={handleReset} className="bg-[#005f6a] text-white px-6 py-3 rounded-lg text-xs font-semibold cursor-pointer border-none">Try Again</button>
        </motion.section>
      )}

      {/* ═══ Results ═══ */}
      {status === 'complete' && results && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-20"
        >
          {/* Algorithm Cards — 3-column bento grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {algoData.map((algo) => {
              const isOptimal = bestAlgo?.key === algo.key;
              const sizePercent = maxSize > 0 ? Math.round((algo.compressedSize / maxSize) * 100) : 0;
              return (
                <div
                  key={algo.key}
                  className={`bg-white dark:bg-[#1a1a1a] rounded-lg p-6 flex flex-col relative overflow-hidden ${isOptimal
                      ? 'border border-[#005f6a] dark:border-teal-400'
                      : 'border border-[#e5e2de] dark:border-gray-800'
                    }`}
                >
                  {isOptimal && <div className="absolute top-0 left-0 w-full h-1 bg-[#005f6a] dark:bg-teal-400"></div>}

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-[#1c1c19] dark:text-white">{algo.name}</h3>
                      <p className="text-sm text-[#5e5d66] dark:text-gray-500" style={{ fontFamily: "'Space Grotesk', monospace" }}>{algo.complexity}</p>
                    </div>
                    {isOptimal && (
                      <span className="bg-[#007a87] text-white text-xs font-semibold px-3 py-1 rounded-full">Optimal</span>
                    )}
                  </div>

                  <div className="flex-grow flex flex-col gap-4 mt-4">
                    {/* Compressed Size */}
                    <div className="bg-[#f6f3ef] dark:bg-[#111111] p-4 rounded-lg">
                      <p className="text-xs font-semibold text-[#5e5d66] dark:text-gray-500 mb-1">Compressed Size</p>
                      <p className="text-2xl font-semibold" style={{ color: isOptimal ? '#005f6a' : '#1c1c19' }}>
                        <span className="dark:text-white">{formatBytes(algo.compressedSize)}</span>
                        <span className="text-base text-[#5e5d66] dark:text-gray-500 ml-2">-{algo.ratio}%</span>
                      </p>
                      <div className="w-full bg-[#e5e2de] dark:bg-[#2a2a2a] h-2 rounded-full mt-2 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${sizePercent}%`, backgroundColor: algo.barColor }}></div>
                      </div>
                    </div>

                    {/* Time Taken */}
                    <div className="bg-[#f6f3ef] dark:bg-[#111111] p-4 rounded-lg">
                      <p className="text-xs font-semibold text-[#5e5d66] dark:text-gray-500 mb-1">Time Taken</p>
                      <p className="text-2xl font-semibold text-[#1c1c19] dark:text-white">
                        {algo.time_ms < 1000 ? `${algo.time_ms} ms` : `${(algo.time_ms / 1000).toFixed(1)}s`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Charts Section — 2-column */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Size Chart */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-[#e5e2de] dark:border-gray-800 p-6 min-w-0">
              <h4 className="text-2xl font-semibold text-[#1c1c19] dark:text-white mb-6">Compression Efficiency (Size)</h4>
              <div className="relative h-64 flex items-end gap-8 px-8 border-l border-b border-[#e5e2de] dark:border-gray-800 pb-2 ml-10">
                {/* Y Axis */}
                <div className="absolute -left-10 top-0 h-full flex flex-col justify-between items-end text-xs text-[#5e5d66] dark:text-gray-500 py-2 w-10" style={{ fontFamily: "'Space Grotesk', monospace" }}>
                  {[...Array(5)].map((_, i) => {
                    const val = ((maxSize / 4) * (4 - i)) / (1024 * 1024);
                    return <span key={i}>{val.toFixed(1)}M</span>;
                  })}
                </div>
                {/* Bars */}
                {algoData.map((algo) => {
                  const heightPct = maxSize > 0 ? (algo.compressedSize / maxSize) * 100 : 0;
                  return (
                    <div key={algo.key} className="w-1/3 flex flex-col items-center gap-2 group">
                      <div
                        className="w-16 rounded-t-sm transition-all duration-500 group-hover:opacity-80 relative"
                        style={{ height: `${heightPct}%`, backgroundColor: algo.barColor }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#31302e] text-white text-xs py-1 px-2 rounded transition-opacity whitespace-nowrap">
                          {formatBytes(algo.compressedSize)}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#1c1c19] dark:text-white">{algo.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time Chart */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-[#e5e2de] dark:border-gray-800 p-6 min-w-0">
              <h4 className="text-2xl font-semibold text-[#1c1c19] dark:text-white mb-6">Processing Time</h4>
              <div className="relative h-64 flex flex-col justify-around px-8 border-l border-b border-[#e5e2de] dark:border-gray-800 pb-4 ml-16">
                {/* X Axis */}
                <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-[#5e5d66] dark:text-gray-500 pt-2 pl-16" style={{ fontFamily: "'Space Grotesk', monospace" }}>
                  {[0, 0.25, 0.5, 0.75, 1].map((f) => (
                    <span key={f}>{Math.round(maxTime * f)}ms</span>
                  ))}
                </div>
                {/* Bars */}
                {algoData.map((algo) => {
                  const widthPct = maxTime > 0 ? (algo.time_ms / maxTime) * 100 : 0;
                  return (
                    <div key={algo.key} className="w-full flex items-center gap-4 group">
                      <span className="text-xs font-semibold text-[#1c1c19] dark:text-white w-14 text-right">{algo.name}</span>
                      <div
                        className="h-6 rounded-r-sm transition-all duration-500 group-hover:opacity-80 relative"
                        style={{ width: `${widthPct}%`, backgroundColor: algo.barColor }}
                      >
                        <div className="absolute -right-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-xs py-1 px-2 transition-opacity text-[#5e5d66] dark:text-gray-400" style={{ fontFamily: "'Space Grotesk', monospace" }}>
                          {algo.time_ms}ms
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Analysis Conclusion */}
          <section className="bg-[#ebe8e4] dark:bg-[#1a1a1a] rounded-lg p-8 border-l-4 border-[#005f6a] dark:border-teal-400 flex items-start gap-4">
            <span className="material-symbols-outlined text-[#005f6a] dark:text-teal-400 text-3xl mt-1">lightbulb</span>
            <div>
              <h3 className="text-2xl font-semibold text-[#1c1c19] dark:text-white mb-2">Analysis Conclusion</h3>
              <p className="text-lg leading-[1.6] text-[#3e494a] dark:text-gray-400">
                {results.conclusion || 'Huffman was the most efficient for this text file because of its optimal prefix codes. While RLE was faster, its compression ratio was minimal for this type of data distribution. LZ77 provided a good middle ground but required significantly more processing time to build its dictionary.'}
              </p>
            </div>
          </section>

          {/* Re-run button */}
          <div className="text-center">
            <button
              onClick={handleReset}
              className="text-[#005f6a] dark:text-teal-400 text-xs font-semibold hover:underline bg-transparent border-none cursor-pointer"
            >
              Run benchmark with a different file
            </button>
          </div>
        </motion.div>
      )}
    </main>
  );
}
