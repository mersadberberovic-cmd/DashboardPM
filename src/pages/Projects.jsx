import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, List, Plus, Search, FolderOpen, Pencil, Trash2, X } from 'lucide-react';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import { AvatarGroup } from '../components/Avatar';
import { StatusBadge, PriorityBadge, TagBadge } from '../components/Badge';
import { projects as mockProjects, clients, getClient } from '../data/mockData';

// ── localStorage helpers ──────────────────────────────────────────────────────
const STORAGE_KEY = 'pm_projects';

function loadProjects() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : mockProjects;
  } catch {
    return mockProjects;
  }
}

function saveProjects(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// ── Empty form template ───────────────────────────────────────────────────────
const emptyForm = {
  name: '',
  client: 'c1',
  status: 'active',
  priority: 'medium',
  description: '',
  startDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  budget: '',
  spent: 0,
  progress: 0,
  tasksTotal: 0,
  tasksCompleted: 0,
  team: [],
  tags: '',
};

// ── Add / Edit Modal ──────────────────────────────────────────────────────────
function ProjectModal({ initial, onSave, onClose }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(
    isEdit
      ? { ...initial, tags: (initial.tags || []).join(', ') }
      : emptyForm
  );

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.dueDate) return;

    const project = {
      ...form,
      id: isEdit ? form.id : 'p' + Date.now(),
      budget: Number(form.budget) || 0,
      spent: Number(form.spent) || 0,
      progress: Number(form.progress) || 0,
      tasksTotal: Number(form.tasksTotal) || 0,
      tasksCompleted: Number(form.tasksCompleted) || 0,
      tags: form.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    };
    onSave(project);
  }

  const inputCls =
    'w-full border border-green-100 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 bg-white';
  const labelCls = 'block text-xs font-bold text-gray-500 mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-green-100">
          <h2 className="text-base font-bold text-gray-900">
            {isEdit ? 'Edit Project' : 'New Project'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-green-50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className={labelCls}>Project Name *</label>
            <input
              className={inputCls}
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Brand Redesign"
              required
            />
          </div>

          {/* Client + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Client</label>
              <select
                className={inputCls}
                value={form.client}
                onChange={e => set('client', e.target.value)}
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select
                className={inputCls}
                value={form.status}
                onChange={e => set('status', e.target.value)}
              >
                <option value="active">Active</option>
                <option value="review">Review</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Priority + Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Priority</label>
              <select
                className={inputCls}
                value={form.priority}
                onChange={e => set('priority', e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Due Date *</label>
              <input
                type="date"
                className={inputCls}
                value={form.dueDate}
                onChange={e => set('dueDate', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Budget + Progress */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Budget ($)</label>
              <input
                type="number"
                min="0"
                className={inputCls}
                value={form.budget}
                onChange={e => set('budget', e.target.value)}
                placeholder="10000"
              />
            </div>
            <div>
              <label className={labelCls}>Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className={inputCls}
                value={form.progress}
                onChange={e => set('progress', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              className={inputCls + ' resize-none'}
              rows={3}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Short project description…"
            />
          </div>

          {/* Tags */}
          <div>
            <label className={labelCls}>Tags (comma separated)</label>
            <input
              className={inputCls}
              value={form.tags}
              onChange={e => set('tags', e.target.value)}
              placeholder="Design, Development, SEO"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-green-50 border border-green-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-green-500 hover:bg-green-600 transition-colors shadow-sm shadow-green-200"
            >
              {isEdit ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete confirmation ───────────────────────────────────────────────────────
function DeleteConfirm({ project, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-2">Delete Project?</h2>
        <p className="text-sm text-gray-500 mb-6">
          <span className="font-semibold text-gray-700">"{project.name}"</span> will be permanently
          deleted. This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-green-50 border border-green-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Project Card (grid view) ──────────────────────────────────────────────────
function ProjectCard({ project, onClick, onEdit, onDelete }) {
  const client = getClient(project.client);
  const daysLeft = Math.ceil((new Date(project.dueDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-2xl border border-green-100 p-5 hover:shadow-md hover:border-green-300 transition-all cursor-pointer group shadow-sm relative">
      {/* Edit / Delete buttons — appear on hover */}
      <div className="absolute top-3 right-3 hidden group-hover:flex items-center gap-1 z-10">
        <button
          onClick={e => { e.stopPropagation(); onEdit(project); }}
          className="p-1.5 rounded-lg bg-white border border-green-100 text-gray-400 hover:text-green-600 hover:border-green-300 transition-colors shadow-sm"
          title="Edit"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onDelete(project); }}
          className="p-1.5 rounded-lg bg-white border border-green-100 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div onClick={() => onClick(project.id)} className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: client?.color || '#6366f1' }}
            >
              {client?.logo || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide truncate">
                {client?.name || 'Unknown'}
              </p>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-green-700 transition-colors leading-tight truncate pr-14">
                {project.name}
              </h3>
            </div>
          </div>
          <PriorityBadge priority={project.priority} />
        </div>

        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2 font-medium">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {(project.tags || []).map(tag => <TagBadge key={tag} tag={tag} />)}
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-gray-400 font-semibold">
              {project.tasksCompleted}/{project.tasksTotal} tasks
            </span>
            <span className="text-xs font-bold text-gray-700">{project.progress}%</span>
          </div>
          <ProgressBar value={project.progress} />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-green-50">
          <AvatarGroup userIds={project.team || []} max={4} />
          <div className="flex items-center gap-2">
            <StatusBadge status={project.status} />
            <span className={`text-xs font-bold ${daysLeft <= 7 ? 'text-red-500' : 'text-gray-400'}`}>
              {daysLeft <= 0 ? 'Overdue' : `${daysLeft}d`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Project Row (list view) ───────────────────────────────────────────────────
function ProjectRow({ project, onClick, onEdit, onDelete }) {
  const client = getClient(project.client);
  const daysLeft = Math.ceil((new Date(project.dueDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <tr className="hover:bg-green-50 transition-colors border-b border-green-50 last:border-0 group">
      <td className="py-3 px-4 cursor-pointer" onClick={() => onClick(project.id)}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: client?.color || '#6366f1' }}
          >
            {client?.logo || '?'}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{project.name}</p>
            <p className="text-xs text-gray-400 font-medium">{client?.name || 'Unknown'}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 cursor-pointer" onClick={() => onClick(project.id)}>
        <StatusBadge status={project.status} />
      </td>
      <td className="py-3 px-4 cursor-pointer" onClick={() => onClick(project.id)}>
        <PriorityBadge priority={project.priority} />
      </td>
      <td className="py-3 px-4 cursor-pointer" onClick={() => onClick(project.id)}>
        <div className="flex items-center gap-2 min-w-24">
          <ProgressBar value={project.progress} className="flex-1" />
          <span className="text-xs text-gray-500 font-bold">{project.progress}%</span>
        </div>
      </td>
      <td className="py-3 px-4 cursor-pointer" onClick={() => onClick(project.id)}>
        <AvatarGroup userIds={project.team || []} max={3} />
      </td>
      <td className="py-3 px-4 cursor-pointer" onClick={() => onClick(project.id)}>
        <p className="text-xs font-semibold text-gray-700">
          {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
        <p className={`text-xs font-semibold ${daysLeft <= 7 ? 'text-red-500' : 'text-gray-400'}`}>
          {daysLeft <= 0 ? 'Overdue' : `${daysLeft}d left`}
        </p>
      </td>
      <td className="py-3 px-4 cursor-pointer" onClick={() => onClick(project.id)}>
        <p className="text-xs font-semibold text-gray-700">
          ${(project.spent || 0).toLocaleString()}
          <span className="text-gray-400 font-medium"> / ${(project.budget || 0).toLocaleString()}</span>
        </p>
      </td>
      {/* Actions */}
      <td className="py-3 px-4">
        <div className="hidden group-hover:flex items-center gap-1">
          <button
            onClick={() => onEdit(project)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-100 transition-colors"
            title="Edit"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(project)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Projects() {
  const [projects, setProjects] = useState(loadProjects);
  const [view, setView] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | project-object (edit)
  const [toDelete, setToDelete] = useState(null); // null | project-object
  const navigate = useNavigate();

  // Persist to localStorage whenever projects list changes
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  function handleSave(project) {
    setProjects(prev => {
      const exists = prev.find(p => p.id === project.id);
      return exists
        ? prev.map(p => (p.id === project.id ? project : p))
        : [...prev, project];
    });
    setModal(null);
  }

  function handleDelete() {
    setProjects(prev => prev.filter(p => p.id !== toDelete.id));
    setToDelete(null);
  }

  const statuses = ['all', 'active', 'review', 'on-hold'];

  const filtered = projects.filter(p => {
    const matchStatus = filter === 'all' || p.status === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Projects"
        subtitle={`${projects.length} total project${projects.length !== 1 ? 's' : ''}`}
        action={{ label: 'New Project', onClick: () => setModal('add') }}
      />

      <main className="flex-1 p-6">
        {/* Filters + Search + View toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border ${
                  filter === s
                    ? 'bg-green-500 text-white border-green-500 shadow-sm shadow-green-200'
                    : 'bg-white text-gray-500 border-green-100 hover:bg-green-50 hover:text-gray-800'
                }`}
              >
                {s === 'all' ? 'All' : s.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-green-100 rounded-xl px-3 py-2">
              <Search size={14} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search projects…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="text-xs font-semibold outline-none text-gray-700 placeholder:text-gray-400 w-36"
              />
            </div>
            <div className="flex bg-white border border-green-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`p-2 transition-colors ${
                  view === 'grid' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-gray-700 hover:bg-green-50'
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 transition-colors ${
                  view === 'list' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-gray-700 hover:bg-green-50'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Grid view */}
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(p => (
              <ProjectCard
                key={p.id}
                project={p}
                onClick={id => navigate(`/projects/${id}`)}
                onEdit={project => setModal(project)}
                onDelete={project => setToDelete(project)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-16 text-gray-400">
                <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No projects found.</p>
              </div>
            )}
          </div>
        ) : (
          /* List view */
          <div className="bg-white rounded-2xl border border-green-100 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-green-50 border-b border-green-100">
                <tr>
                  {['Project', 'Status', 'Priority', 'Progress', 'Team', 'Due Date', 'Budget', ''].map(
                    col => (
                      <th
                        key={col}
                        className="text-left py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <ProjectRow
                    key={p.id}
                    project={p}
                    onClick={id => navigate(`/projects/${id}`)}
                    onEdit={project => setModal(project)}
                    onDelete={project => setToDelete(project)}
                  />
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No projects found.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add / Edit modal */}
      {modal !== null && (
        <ProjectModal
          initial={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Delete confirmation */}
      {toDelete && (
        <DeleteConfirm
          project={toDelete}
          onConfirm={handleDelete}
          onClose={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
