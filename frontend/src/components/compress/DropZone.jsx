import { useCallback, useState, useRef } from 'react';

export default function DropZone({ onFileSelect, accept = '*', disabled = false, label = 'Drop File Here', sublabel = 'or click to browse' }) {
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
      className={`bg-white dark:bg-[#1a1a1a] border-2 border-dashed border-[#005f6a] dark:border-teal-400 rounded-lg p-8 flex flex-col items-center justify-center text-center h-48 cursor-pointer hover:bg-[#f6f3ef] dark:hover:bg-[#222222] transition-colors group ${isDragging ? 'bg-[#005f6a]/5 dark:bg-teal-400/5' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
      <span className="material-symbols-outlined text-4xl text-[#005f6a] dark:text-teal-400 mb-2 group-hover:scale-110 transition-transform">upload_file</span>
      <h3 className="text-2xl font-semibold text-[#1c1c19] dark:text-white">
        {isDragging ? 'Drop your file here!' : label}
      </h3>
      <p className="text-base text-[#3e494a] dark:text-gray-400 mt-1">{sublabel}</p>
      <div className="flex gap-2 mt-4 text-[#6e797b] dark:text-gray-500">
        <span className="material-symbols-outlined text-sm">description</span>
        <span className="material-symbols-outlined text-sm">code</span>
        <span className="material-symbols-outlined text-sm">table</span>
      </div>
    </div>
  );
}
