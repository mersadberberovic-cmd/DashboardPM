import { useState } from 'react';
import { Plus, Clock, AlertCircle, CheckCircle2, X, Trash2, Pencil, PauseCircle, Link } from 'lucide-react';
import Header from '../components/Header';
import { PriorityBadge, TagBadge } from '../components/Badge';
import { getMember, getProject, tasks as mockTasks, projects, teamMembers } from '../data/mockData';

const STORAGE_KEY = 'pm_tasks';

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : mockTasks;
  } catch {
    return mockTasks;
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

const COLUMNS = [
  { id: 'todo',        label: 'To Do',       icon: Clock,        bg: 'bg-gray-50',   border: 'border-gray-200',  dot: 'bg-gray-300' },
  { id: 'in-progress', label: 'In Progress', icon: AlertCircle,  bg: 'bg-amber-50',  border: 'border-amber-100', dot: 'bg-amber-400' },
  { id: 'done',        label: 'Done',        icon: CheckCircle2, bg: 'bg-green-50',  border: 'border-green-100', dot: 'bg-green-400' },
  { id: 'on-hold',     label: 'On Hold',     icon: PauseCircle,  bg: 'bg-slate-50',  border: 'border-slate-200', dot: 'bg-slate-400' },
];

const EMPTY_FORM = {
  title: '',
  description: '',
  link: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  assignee: '',
  projectId: '',
};

function TaskCard({ task, onDelete, onEdit }) {
  const project  = getProject(task.projectId);
  const assignee = getMember(task.assignee);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className="bg-white rounded-xl border border-green-100 p-3.5 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center justify-between mb-2">
        <PriorityBadge priority={task.priority} />
        <div className="flex items-center gap-1 ml-2 min-w-0">
          <span className="text-[10px] text-gray-400 font-semibold truncate max-w-[80px]">
            {project?.name.split(' ').slice(0, 2).join(' ')}
          </span>
          <button
            onClick={() => onEdit(task)}
            className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-gray-300 hover:text-green-500 transition-all ml-1"
            title="Edit task"
          >
            <Pencil size={11} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-gray-300 hover:text-red-400 transition-all"
            title="Delete task"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      <p className="text-xs font-semibold text-gray-800 leading-snug mb-2.5">{task.title}</p>

      {task.description && (
        <p className="text-[10px] text-gray-400 mb-2 leading-relaxed line-clamp-2">{task.description}</p>
      )}

      {task.link && (
        <a
          href={task.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1 text-[10px] text-green-500 hover:text-green-700 mb-2 truncate"
          title={task.link}
        >
          <Link size={9} className="flex-shrink-0" />
          <span className="truncate">{task.link}</span>
        </a>
      )}

      {task.tags && task.tags.length > 0 && (
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

function TaskModal({ onClose, onSave, initial, defaultStatus }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(
    isEdit
      ? { link: '', description: '', ...initial }
      : { ...EMPTY_FORM, status: defaultStatus || 'todo' }
  );

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(
      isEdit
        ? { ...form }
        : { ...form, id: 't' + Date.now(), tags: form.tags || [] }
    );
    onClose();
  };

  const inputCls = 'w-full text-xs border border-green-100 rounded-xl px-3 py-2 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-gray-700 bg-white placeholder:text-gray-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-green-100 shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-green-50">
          <h2 className="text-sm font-bold text-gray-900">{isEdit ? 'Edit Task' : 'Add New Task'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Task Name *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Enter task name…"
              className={inputCls + ' text-sm'}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Description / Notes</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Optional notes…"
              rows={2}
              className={inputCls + ' resize-none'}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Link (Google Doc, URL…)</label>
            <input
              type="text"
              value={form.link}
              onChange={e => set('link', e.target.value)}
              placeholder="https://…"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={e => set('status', e.target.value)}
                className={inputCls}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Priority</label>
              <select
                value={form.priority}
                onChange={e => set('priority', e.target.value)}
                className={inputCls}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => set('dueDate', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Assignee</label>
              <select
                value={form.assignee}
                onChange={e => set('assignee', e.target.value)}
                className={inputCls}
              >
                <option value="">Unassigned</option>
                {teamMembers.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Project</label>
            <select
              value={form.projectId}
              onChange={e => set('projectId', e.target.value)}
              className={inputCls}
            >
              <option value="">No Project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-xs font-bold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-xs font-bold text-white bg-green-500 hover:bg-green-600 rounded-xl transition-colors shadow-sm shadow-green-200"
            >
              {isEdit ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Tasks() {
  const [taskList, setTaskList] = useState(loadTasks);
  const [projectFilter, setProjectFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('todo');
  const [editingTask, setEditingTask] = useState(null);

  const filtered = taskList.filter(t =>
    projectFilter === 'all' || t.projectId === projectFilter
  );

  const saveTask = (task) => {
    const exists = taskList.find(t => t.id === task.id);
    const updated = exists
      ? taskList.map(t => t.id === task.id ? task : t)
      : [...taskList, task];
    setTaskList(updated);
    saveTasks(updated);
  };

  const deleteTask = (id) => {
    const updated = taskList.filter(t => t.id !== id);
    setTaskList(updated);
    saveTasks(updated);
  };

  const openAddModal = (status = 'todo') => {
    setDefaultStatus(status);
    setEditingTask(null);
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Task Board"
        subtitle="Track and manage tasks across all projects"
        action={{ label: 'Add Task', onClick: () => openAddModal('todo') }}
      />

      {showModal && (
        <TaskModal
          onClose={() => { setShowModal(false); setEditingTask(null); }}
          onSave={saveTask}
          initial={editingTask}
          defaultStatus={defaultStatus}
        />
      )}

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
                  {colTasks.map(task => (
                    <TaskCard key={task.id} task={task} onDelete={deleteTask} onEdit={openEditModal} />
                  ))}
                  {colTasks.length === 0 && (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-xs text-gray-400 font-semibold">No tasks here</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => openAddModal(col.id)}
                  className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-gray-400 hover:text-green-600 hover:bg-white rounded-xl border border-dashed border-gray-200 hover:border-green-300 transition-all"
                >
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
