export default function ProgressBar({ progress = 0, label = '', filename = '' }) {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] border border-[#bdc8cb] dark:border-gray-800 rounded-lg p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-[#ebe8e4] dark:bg-[#2a2a2a] flex items-center justify-center">
          <span className="material-symbols-outlined text-[#005f6a] dark:text-teal-400" style={{ fontSize: '18px' }}>description</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1c1c19] dark:text-white truncate">{filename || 'Processing...'}</p>
          <p className="text-xs text-[#3e494a] dark:text-gray-400 truncate">{label || 'Compressing...'}</p>
        </div>
        <span className="text-sm font-bold text-[#005f6a] dark:text-teal-400 shrink-0">{progress}%</span>
      </div>
      <div className="w-full h-3 bg-[#e5e2de] dark:bg-[#2a2a2a] rounded-full overflow-hidden">
        <div className="h-full bg-[#005f6a] dark:bg-teal-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
