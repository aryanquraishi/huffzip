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
      <button onClick={handleDownload} className="btn-primary-c w-full text-sm sm:text-base py-3 sm:py-4">
        <span className="material-symbols-outlined fill" style={{ fontSize: '20px' }}>download</span>
        Download .huff File
      </button>
      {onReset && (
        <button onClick={onReset} className="btn-outline-c w-full text-sm py-3">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>restart_alt</span>
          Compress Another File
        </button>
      )}
    </div>
  );
}
