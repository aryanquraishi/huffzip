export default function ProgressBar({ progress = 0, label = '', filename = '' }) {
  return (
    <div className="surface rounded-xl p-4 sm:p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="icon-box" style={{ width: '36px', height: '36px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>description</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-on-bg truncate">{filename || 'Processing...'}</p>
          <p className="text-xs text-muted-c truncate">{label || 'Compressing...'}</p>
        </div>
        <span className="text-sm font-bold text-primary shrink-0">{progress}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
