export default function ProgressBar({ value, className = '', showLabel = false }) {
  const color =
    value >= 80 ? 'bg-emerald-500' :
    value >= 50 ? 'bg-indigo-500' :
    value >= 25 ? 'bg-amber-500' :
    'bg-red-400';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-slate-500 font-medium w-8 text-right">{value}%</span>
      )}
    </div>
  );
}
