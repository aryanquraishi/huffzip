import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import DropZone from '../components/compress/DropZone';
import { API_URL } from '../constants/fileTypes';
import { formatBytes } from '../utils/formatBytes';

export default function DecompressPage() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileSelect = async (file) => {
    if (!file.name.endsWith('.huff')) {
      setError('Only .huff files can be decompressed.');
      setStatus('error');
      return;
    }
    setStatus('processing');
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${API_URL}/decompress`, formData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const originalFilename = response.headers['content-disposition']?.match(/filename="(.+)"/)?.[1] || 'restored_file';
      const blob = new Blob([response.data]);
      setResult({
        url: window.URL.createObjectURL(blob),
        filename: originalFilename,
        originalSize: parseInt(response.headers['x-original-size'] || '0'),
        fileType: response.headers['x-file-type'] || 'Unknown',
      });
      setStatus('complete');
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
  };

  return (
    <div className="container-app pt-4 sm:pt-6 pb-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10"
        >
          <div className="icon-box icon-box-lg mx-auto mb-4">
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>unarchive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-on-bg">Decompress File</h1>
          <p className="text-sm sm:text-base text-on-surface-v mt-2 max-w-xl mx-auto">
            Restore your <code className="text-primary font-mono text-sm">.huff</code> archives to their original state — byte-perfect, lossless integrity.
          </p>
        </motion.div>

        {/* Dropzone (idle) */}
        {status === 'idle' && (
          <DropZone
            onFileSelect={handleFileSelect}
            accept=".huff"
            label="Upload .huff Archive"
            sublabel="Drag & drop or tap to browse"
          />
        )}

        {/* Processing */}
        {status === 'processing' && (
          <div className="surface rounded-xl text-center py-12 sm:py-16">
            <span className="material-symbols-outlined text-primary block mb-4 pulse-soft" style={{ fontSize: '48px', color: '#2563eb' }}>
              hourglass_top
            </span>
            <p className="text-base text-on-bg font-medium">Decompressing file...</p>
            <p className="text-xs text-muted-c mt-1">Reading header & rebuilding original</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="surface rounded-xl text-center p-6 sm:p-8"
          >
            <span className="material-symbols-outlined text-danger block mb-3" style={{ fontSize: '40px', color: '#dc2626' }}>error</span>
            <p className="text-base font-medium text-danger mb-4">{error}</p>
            <button onClick={handleReset} className="btn-outline-c">Try Again</button>
          </motion.div>
        )}

        {/* Success */}
        {status === 'complete' && result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="surface rounded-xl p-5 sm:p-6 border-t-4" style={{ borderTopColor: '#16a34a' }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="icon-box">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div>
                    <p className="font-semibold text-on-bg text-sm sm:text-base">Original File Info</p>
                    <p className="text-xs text-success font-medium" style={{ color: '#16a34a' }}>Extraction ready</p>
                  </div>
                </div>
                <span className="material-symbols-outlined fill" style={{ color: '#16a34a' }}>check_circle</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                <div className="surface-dim rounded-lg p-3 sm:p-4">
                  <p className="text-xs font-semibold text-muted-c uppercase tracking-wider mb-1">File Name</p>
                  <p className="text-sm font-medium text-on-bg truncate" title={result.filename}>{result.filename}</p>
                </div>
                <div className="surface-dim rounded-lg p-3 sm:p-4">
                  <p className="text-xs font-semibold text-muted-c uppercase tracking-wider mb-1">Original Size</p>
                  <p className="text-sm font-medium text-on-bg">{formatBytes(result.originalSize)}</p>
                </div>
                <div className="surface-dim rounded-lg p-3 sm:p-4">
                  <p className="text-xs font-semibold text-muted-c uppercase tracking-wider mb-1">File Type</p>
                  <p className="text-sm font-medium text-on-bg truncate">{result.fileType}</p>
                </div>
              </div>

              <button onClick={handleDownload} className="btn-primary-c w-full text-sm sm:text-base py-3 sm:py-4">
                <span className="material-symbols-outlined fill" style={{ fontSize: '20px' }}>download</span>
                Download Original
              </button>
            </div>

            <button onClick={handleReset} className="btn-outline-c w-full text-sm">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>restart_alt</span>
              Decompress Another File
            </button>
          </motion.div>
        )}

        {/* Privacy Note */}
        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8 text-xs text-muted-c">
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock</span>
          <span>Files are processed securely and auto-deleted after 15 minutes</span>
        </div>
      </div>
    </div>
  );
}
