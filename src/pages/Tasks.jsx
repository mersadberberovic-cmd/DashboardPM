import { useState } from 'react';
import { Plus, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';
import { PriorityBadge, TagBadge } from '../components/Badge';
import { getMember, getProject, tasks, projects } from '../data/mockData';

const COLUMNS = [
  { id: 'todo',        label: 'To Do',       icon: Clock,        bg: 'bg-gray-50',   border: 'border-gray-200',  iconColor: 'text-gray-400',  dot: 'bg-gray-300' },
  { id: 'in-progress', label: 'In Progress', icon: AlertCircle,  bg: 'bg-amber-50',  border: 'border-amber-100', iconColor: 'text-amber-500', dot: 'bg-amber-400' },
  { id: 'done',        label: 'Done',        icon: CheckCircle2, bg: 'bg-green-50',  border: 'border-green-100', iconColor: 'text-green-500', dot: 'bg-green-400' },
];

function TaskCard({ task }) {
  const project  = getProject(task.projectId);
  const assignee = getMember(task.assignee);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className="bg-white rounded-xl border border-green-100 p-3.5 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
      <div className="flex items-center justify-between mb-2">
        <PriorityBadge priority={task.priority} />
        <span className="text-[10px] text-gray-400 font-semibold truncate ml-2 max-w-[90px]">
          {project?.name.split(' ').slice(0,2).join(' ')}
        </span>
      </div>

      <p className="text-xs font-semibold text-gray-800 leading-snug mb-2.5">{task.title}</p>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
        </div>
      )}

      <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
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
          <span className={`text-[10px] font-bold ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
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
        subtitle="Track and manage tasks across all projects"
        action={{ label: 'Add Task', onClick: () => {} }}
      />

      <main className="flex-1 p-6">
        {/* Project filter */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setProjectFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all ${
              projectFilter === 'all'
                ? 'bg-green-500 text-white border-green-500 shadow-sm shadow-green-200'
                : 'bg-white text-gray-500 border-green-100 hover:bg-green-50'
            }`}
          >
            All Projects
          </button>
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => setProjectFilter(p.id)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all truncate max-w-[180px] ${
                projectFilter === p.id
                  ? 'bg-green-500 text-white border-green-500 shadow-sm shadow-green-200'
                  : 'bg-white text-gray-500 border-green-100 hover:bg-green-50'
              }`}
            >
              {p.name.length > 22 ? p.name.slice(0, 22) + '…' : p.name}
            </button>
          ))}
        </div>

        {/* Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {COLUMNS.map(col => {
            const colTasks = filtered.filter(t => t.status === col.id);
            const Icon = col.icon;
            return (
              <div key={col.id} className={`rounded-2xl border p-4 ${col.bg} ${col.border}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${col.dot}`} />
                  <h3 className="text-xs font-bold text-gray-700">{col.label}</h3>
                  <span className="ml-auto text-[10px] font-bold bg-white border border-gray-200 text-gray-500 rounded-full px-2 py-0.5">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[80px]">
                  {colTasks.map(task => <TaskCard key={task.id} task={task} />)}
                  {colTasks.length === 0 && (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-xs text-gray-400 font-semibold">No tasks here</p>
                    </div>
                  )}
                </div>

                <button className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-gray-400 hover:text-green-600 hover:bg-white rounded-xl border border-dashed border-gray-200 hover:border-green-300 transition-all">
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
