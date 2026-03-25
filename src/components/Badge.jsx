const statusConfig = {
  'active':      { label: 'Active',      className: 'bg-emerald-100 text-emerald-700' },
  'review':      { label: 'In Review',   className: 'bg-amber-100 text-amber-700' },
  'on-hold':     { label: 'On Hold',     className: 'bg-slate-100 text-slate-600' },
  'completed':   { label: 'Completed',   className: 'bg-blue-100 text-blue-700' },
  'todo':        { label: 'To Do',       className: 'bg-slate-100 text-slate-600' },
  'in-progress': { label: 'In Progress', className: 'bg-indigo-100 text-indigo-700' },
  'done':        { label: 'Done',        className: 'bg-emerald-100 text-emerald-700' },
};

const priorityConfig = {
  'high':   { label: 'High',   className: 'bg-red-100 text-red-600' },
  'medium': { label: 'Medium', className: 'bg-amber-100 text-amber-700' },
  'low':    { label: 'Low',    className: 'bg-slate-100 text-slate-500' },
};

export function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { label: status, className: 'bg-slate-100 text-slate-600' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const cfg = priorityConfig[priority] || { label: priority, className: 'bg-slate-100 text-slate-500' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

export function TagBadge({ tag }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
      {tag}
    </span>
  );
}
