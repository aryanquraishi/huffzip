import { useCallback, useState, useRef } from 'react';

export default function DropZone({ onFileSelect, accept = '*', disabled = false, label = 'Upload File for Compression', sublabel = 'Tap to browse or drag & drop here' }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = useCallback((e) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDragIn = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragOut = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files?.length > 0) onFileSelect(e.dataTransfer.files[0]);
  }, [onFileSelect, disabled]);

  return (
    <div
      className={`dropzone-c ${isDragging ? 'dragover' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onDragOver={handleDrag}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        className="hidden"
        disabled={disabled}
      />
      <div className="flex flex-col items-center gap-3 sm:gap-4 w-full">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.1)' }}>
          <span className="material-symbols-outlined text-primary fill" style={{ fontSize: '28px', color: '#2563eb' }}>upload_file</span>
        </div>
        <div className="text-center px-2">
          <p className="text-base sm:text-lg font-semibold text-on-bg mb-1">
            {isDragging ? 'Drop your file here!' : label}
          </p>
          <p className="text-xs sm:text-sm text-on-surface-v">{sublabel}</p>
        </div>
        <button
          className="btn-primary-c text-sm px-6 py-2.5 mt-1 sm:mt-2 w-full max-w-[240px]"
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          type="button"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>attach_file</span>
          Select File
        </button>
        <p className="text-xs text-muted-c mt-1">Max 20MB • All file types supported</p>
      </div>
    </div>
  );
}
