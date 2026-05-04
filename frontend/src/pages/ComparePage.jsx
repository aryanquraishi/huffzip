import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import DropZone from '../components/compress/DropZone';
import { API_URL } from '../constants/fileTypes';
import { formatBytes } from '../utils/formatBytes';

const ALGO_COLORS = { huffman: '#2563eb', rle: '#475569', lz77: '#dc2626' };

export default function ComparePage() {
  const [status, setStatus] = useState('idle');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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

  const getBarData = () => {
    if (!results) return [];
    return Object.entries(results.algorithms).map(([key, val]) => ({
      key,
      name: val.name.split(' ')[0],
      ratio: val.ratio,
      time_ms: val.time_ms,
      size: val.compressed_size,
      color: ALGO_COLORS[key] || '#64748b',
    }));
  };

  const maxSize = results
    ? Math.max(...Object.values(results.algorithms).map(a => a.compressed_size), results.original_size || 0)
    : 0;
  const maxTime = results ? Math.max(...Object.values(results.algorithms).map(a => a.time_ms)) : 0;
  const fastest = results ? Math.min(...Object.values(results.algorithms).map(a => a.time_ms)) : 0;

  return (
    <div className="container-app pt-4 sm:pt-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 sm:mb-6"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-on-bg">Algorithm Comparison</h1>
        <p className="text-sm sm:text-base text-on-surface-v mt-1">
          Side-by-side benchmark: Huffman vs RLE vs LZ77.
        </p>
      </motion.div>

      {/* Idle */}
      {status === 'idle' && (
        <div className="max-w-2xl mx-auto">
          <DropZone
            onFileSelect={handleFileSelect}
            label="Upload Test File"
            sublabel="We'll run all 3 algorithms"
          />
        </div>
      )}

      {/* Processing */}
      {status === 'processing' && (
        <div className="surface rounded-xl text-center py-12 sm:py-16 max-w-2xl mx-auto">
          <span className="material-symbols-outlined text-primary block mb-4 pulse-soft" style={{ fontSize: '48px', color: '#2563eb' }}>
            compare_arrows
          </span>
          <p className="text-base font-medium text-on-bg">Running all 3 algorithms...</p>
          <p className="text-xs text-muted-c mt-2">Huffman → RLE → LZ77</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="surface rounded-xl text-center p-6 sm:p-8 max-w-2xl mx-auto">
          <span className="material-symbols-outlined text-danger block mb-3" style={{ fontSize: '40px', color: '#dc2626' }}>error</span>
          <p className="text-base font-medium text-danger mb-4">{error}</p>
          <button onClick={handleReset} className="btn-outline-c">Try Again</button>
        </div>
      )}

      {/* Results */}
      {status === 'complete' && results && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-5"
        >
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
            {/* Left — File Info + Best Algorithm */}
            <div className="w-full lg:w-[35%] flex flex-col gap-4">
              {/* Active File */}
              <div className="surface rounded-xl p-4 sm:p-5">
                <p className="text-xs font-semibold text-muted-c uppercase tracking-wider mb-3">Active Test File</p>
                <div className="flex items-center gap-3">
                  <div className="icon-box">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-on-bg truncate">{selectedFile?.name || 'test_file'}</p>
                    <p className="text-xs text-muted-c truncate">
                      {selectedFile ? `${selectedFile.type || 'File'} • ${formatBytes(selectedFile.size)}` : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Best Algorithm Card */}
              <div className="rounded-xl p-5 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined fill" style={{ fontSize: '18px' }}>auto_awesome</span>
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Optimal Algorithm</p>
                </div>
                <p className="text-xl font-bold mb-2">Huffman Coding</p>
                <p className="text-sm opacity-90 leading-relaxed">{results.conclusion}</p>
              </div>

              <button onClick={handleReset} className="btn-primary-c w-full text-sm">
                <span className="material-symbols-outlined fill" style={{ fontSize: '18px' }}>play_arrow</span>
                Re-run with Different File
              </button>
            </div>

            {/* Right — Charts */}
            <div className="w-full lg:w-[65%] flex flex-col gap-4">
              {/* Compression Results */}
              <div className="surface rounded-xl p-4 sm:p-5">
                <div className="flex items-start justify-between mb-4 gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-on-bg">Compression Results</h3>
                    <p className="text-xs text-muted-c mt-0.5">Final size — lower is better</p>
                  </div>
                  <span className="material-symbols-outlined text-muted-c shrink-0" style={{ fontSize: '20px' }}>data_usage</span>
                </div>

                {/* Original */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                    <span className="text-on-bg font-medium">Original File</span>
                    <span className="text-muted-c font-mono">{formatBytes(results.original_size)}</span>
                  </div>
                  <div className="progress-track h-3 sm:h-4">
                    <div className="h-full" style={{ width: '100%', background: '#94a3b8' }} />
                  </div>
                </div>

                {getBarData().map((algo) => (
                  <div key={algo.key} className="mb-3">
                    <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: algo.color }} />
                        <span className="text-on-bg font-medium truncate">{algo.name}</span>
                      </span>
                      <span className="font-medium font-mono shrink-0" style={{ color: algo.color }}>
                        {formatBytes(algo.size)}
                        <span className="ml-1 text-xs opacity-70">
                          ({algo.ratio > 0 ? `-${algo.ratio}%` : '+0%'})
                        </span>
                      </span>
                    </div>
                    <div className="progress-track h-3 sm:h-4">
                      <div
                        className="h-full transition-all duration-700"
                        style={{
                          width: `${maxSize > 0 ? (algo.size / maxSize) * 100 : 0}%`,
                          background: algo.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Processing Time */}
              <div className="surface rounded-xl p-4 sm:p-5">
                <div className="flex items-start justify-between mb-4 gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-on-bg">Processing Time</h3>
                    <p className="text-xs text-muted-c mt-0.5">Time taken — lower is better</p>
                  </div>
                  <span className="material-symbols-outlined text-muted-c shrink-0" style={{ fontSize: '20px' }}>schedule</span>
                </div>

                {getBarData().map((algo) => (
                  <div key={algo.key} className="mb-3">
                    <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: algo.color }} />
                        <span className="text-on-bg font-medium truncate">{algo.name}</span>
                      </span>
                      <span className="font-medium text-muted-c font-mono shrink-0">
                        {algo.time_ms < 1000 ? `${algo.time_ms}ms` : `${(algo.time_ms / 1000).toFixed(1)}s`}
                        {algo.time_ms === fastest && (
                          <span className="ml-1.5 text-xs font-semibold" style={{ color: '#16a34a' }}>(Fastest)</span>
                        )}
                      </span>
                    </div>
                    <div className="progress-track h-3 sm:h-4">
                      <div
                        className="h-full transition-all duration-700"
                        style={{
                          width: `${maxTime > 0 ? (algo.time_ms / maxTime) * 100 : 0}%`,
                          background: algo.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
