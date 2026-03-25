import { useState } from 'react';
import { Plus, Clock, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
import Header from '../components/Header';
import { PriorityBadge, TagBadge } from '../components/Badge';
import { getMember, getProject, tasks, projects } from '../data/mockData';

const COLUMNS = [
  { id: 'todo',        label: 'To Do',       icon: Clock,         color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200' },
  { id: 'in-progress', label: 'In Progress', icon: AlertCircle,   color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { id: 'done',        label: 'Done',        icon: CheckCircle2,  color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
];

function TaskCard({ task }) {
  const project  = getProject(task.projectId);
  const assignee = getMember(task.assignee);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
      {/* Priority + project */}
      <div className="flex items-center justify-between mb-2">
        <PriorityBadge priority={task.priority} />
        <span className="text-[10px] text-slate-400 truncate ml-2 max-w-[100px]">{project?.name}</span>
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-slate-800 leading-snug mb-2">{task.title}</p>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {assignee ? (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
            style={{ backgroundColor: assignee.color }}
            title={assignee.name}
          >
            {assignee.avatar}
          </div>
        ) : <div />}
        {task.dueDate && (
          <span className={`text-[10px] font-medium ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
            {isOverdue ? '⚠ ' : ''}
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Tasks() {
  const [projectFilter, setProjectFilter] = useState('all');

  const filtered = tasks.filter(t =>
    projectFilter === 'all' || t.projectId === projectFilter
  );

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Task Board"
        subtitle="Drag tasks between columns to update status"
        action={{ label: 'Add Task', onClick: () => {} }}
      />

      <main className="flex-1 p-6">
        {/* Project filter */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setProjectFilter('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
              projectFilter === 'all'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Projects
          </button>
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => setProjectFilter(p.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors truncate max-w-[180px] ${
                projectFilter === p.id
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p.name.length > 22 ? p.name.slice(0, 22) + '…' : p.name}
            </button>
          ))}
        </div>

        {/* Kanban board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {COLUMNS.map(col => {
            const colTasks = filtered.filter(t => t.status === col.id);
            const Icon = col.icon;
            return (
              <div key={col.id} className={`rounded-xl border ${col.border} ${col.bg} p-4`}>
                {/* Column header */}
                <div className="flex items-center gap-2 mb-4">
                  <Icon size={16} className={col.color} />
                  <h3 className="text-sm font-semibold text-slate-700">{col.label}</h3>
                  <span className="ml-auto text-xs bg-white border border-slate-200 text-slate-500 rounded-full px-2 py-0.5 font-medium">
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 min-h-[80px]">
                  {colTasks.map(task => <TaskCard key={task.id} task={task} />)}
                  {colTasks.length === 0 && (
                    <div className="flex items-center justify-center py-8 text-slate-400">
                      <p className="text-xs">No tasks here</p>
                    </div>
                  )}
                </div>

                {/* Add task button */}
                <button className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 text-xs text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg border border-dashed border-slate-300 transition-colors">
                  <Plus size={13} /> Add task
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
