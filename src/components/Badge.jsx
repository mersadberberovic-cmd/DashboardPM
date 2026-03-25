const statusConfig = {
  'active':      { label: 'Active',      className: 'bg-green-100 text-green-700 border border-green-200' },
  'review':      { label: 'In Review',   className: 'bg-amber-50 text-amber-700 border border-amber-200' },
  'on-hold':     { label: 'On Hold',     className: 'bg-gray-100 text-gray-500 border border-gray-200' },
  'completed':   { label: 'Completed',   className: 'bg-green-100 text-green-700 border border-green-200' },
  'todo':        { label: 'To Do',       className: 'bg-gray-100 text-gray-500 border border-gray-200' },
  'in-progress': { label: 'In Progress', className: 'bg-green-50 text-green-600 border border-green-200' },
  'done':        { label: 'Done',        className: 'bg-green-100 text-green-700 border border-green-200' },
};

const priorityConfig = {
  'high':   { label: 'High',   className: 'bg-red-50 text-red-600 border border-red-200' },
  'medium': { label: 'Medium', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
  'low':    { label: 'Low',    className: 'bg-gray-100 text-gray-500 border border-gray-200' },
};

export function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-500 border border-gray-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const cfg = priorityConfig[priority] || { label: priority, className: 'bg-gray-100 text-gray-500 border border-gray-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

export function TagBadge({ tag }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-green-50 text-green-700 border border-green-100">
      {tag}
    </span>
  );
}
