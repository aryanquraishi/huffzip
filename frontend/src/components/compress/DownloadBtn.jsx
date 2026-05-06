export default function DownloadBtn({ downloadUrl, filename, onReset }) {
  const handleDownload = async () => {
    if (!downloadUrl) return;
    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'compressed.huff';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleDownload}
        className="w-full bg-[#005f6a] text-white text-base py-4 rounded-lg hover:bg-[#004f57] transition-colors flex items-center justify-center gap-2 cursor-pointer border-none font-semibold"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>download</span>
        Download .huff File
      </button>
      {onReset && (
        <button
          onClick={onReset}
          className="w-full border border-[#005f6a] dark:border-teal-400 text-[#005f6a] dark:text-teal-400 text-sm py-3 rounded-lg hover:bg-[#ebe8e4] dark:hover:bg-[#2a2a2a] transition-colors flex items-center justify-center gap-2 cursor-pointer bg-transparent font-semibold"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>restart_alt</span>
          Compress Another File
        </button>
      )}
    </div>
  );
}
