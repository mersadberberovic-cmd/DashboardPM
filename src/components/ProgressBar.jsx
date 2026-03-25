export default function ProgressBar({ value, className = '', showLabel = false }) {
  const color =
    value >= 80 ? 'bg-green-500' :
    value >= 50 ? 'bg-green-400' :
    value >= 25 ? 'bg-amber-400' :
    'bg-red-400';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 bg-green-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500 font-semibold w-8 text-right">{value}%</span>
      )}
    </div>
  );
}
