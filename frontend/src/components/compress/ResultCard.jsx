import { motion } from 'framer-motion';
import { formatBytes } from '../../utils/formatBytes';

export default function ResultCard({ result }) {
  if (!result) return null;
  const ratio = result.ratio || 0;
  const expanded = result.expanded || result.compressed_size >= result.original_size;
  const savedBytes = result.original_size - result.compressed_size;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface rounded-xl p-5 sm:p-6 relative overflow-hidden"
    >
      {/* Badge — top right */}
      {!expanded && ratio > 0 && (
        <div className="absolute top-0 right-0 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1.5 rounded-bl-lg">
          {ratio}% Saved
        </div>
      )}
      {expanded && (
        <div className="absolute top-0 right-0 text-xs font-bold px-3 py-1.5 rounded-bl-lg"
          style={{ background: 'rgba(234,179,8,0.15)', color: '#b45309' }}>
          No Savings
        </div>
      )}

      {/* Header */}
      <h3 className="text-base sm:text-lg font-bold text-on-bg mb-4 flex items-center gap-2">
        {expanded ? (
          <>
            <span className="material-symbols-outlined fill" style={{ fontSize: '22px', color: '#d97706' }}>info</span>
            Compression Complete
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-success fill" style={{ fontSize: '22px', color: '#16a34a' }}>check_circle</span>
            Compression Complete
          </>
        )}
      </h3>

      {/* Size stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="surface-dim rounded-lg p-3 sm:p-4">
          <p className="text-xs font-semibold text-muted-c uppercase tracking-wider mb-1">Original</p>
          <p className="text-lg sm:text-xl font-bold text-on-bg">{formatBytes(result.original_size)}</p>
        </div>
        <div className={`rounded-lg p-3 sm:p-4 border ${expanded
          ? 'bg-amber-50 dark:bg-amber-900/15 border-amber-200 dark:border-amber-800/30'
          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30'
        }`}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${expanded ? 'text-amber-700 dark:text-amber-400' : 'text-primary'}`}>
            Compressed
          </p>
          <p className={`text-lg sm:text-xl font-bold ${expanded ? 'text-amber-700 dark:text-amber-400' : 'text-primary'}`}>
            {formatBytes(result.compressed_size)}
          </p>
        </div>
      </div>

      {/* Expanded warning */}
      {expanded && (
        <div className="mt-4 rounded-lg p-3 sm:p-4 flex items-start gap-3"
          style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)' }}>
          <span className="material-symbols-outlined shrink-0" style={{ fontSize: '18px', color: '#d97706' }}>warning</span>
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#b45309' }}>
              File size increased by {formatBytes(Math.abs(savedBytes))}
            </p>
            <p className="text-xs text-on-surface-v leading-relaxed">
              This file is already compressed (JPG, PNG, MP3, ZIP etc). Huffman coding adds header overhead
              (code table + metadata) which exceeds savings. This is expected — Huffman works best on
              uncompressed data like TXT, CSV, BMP, and WAV files.
            </p>
          </div>
        </div>
      )}

      {/* Savings summary for successful compression */}
      {!expanded && ratio > 0 && (
        <div className="mt-4 rounded-lg p-3 flex items-center justify-center gap-2"
          style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
          <span className="material-symbols-outlined fill" style={{ fontSize: '16px', color: '#16a34a' }}>trending_down</span>
          <p className="text-sm font-semibold" style={{ color: '#16a34a' }}>
            Saved {formatBytes(savedBytes)} ({ratio}% reduction)
          </p>
        </div>
      )}
    </motion.div>
  );
}
