import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, List, Plus, Search } from 'lucide-react';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import { AvatarGroup } from '../components/Avatar';
import { StatusBadge, PriorityBadge, TagBadge } from '../components/Badge';
import { projects, getClient } from '../data/mockData';

function ProjectCard({ project, onClick }) {
  const client = getClient(project.client);
  const daysLeft = Math.ceil((new Date(project.dueDate) - new Date()) / (1000*60*60*24));

  return (
    <div
      onClick={() => onClick(project.id)}
      className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: client?.color }}
          >
            {client?.logo}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400 truncate">{client?.name}</p>
            <h3 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors leading-tight truncate">
              {project.name}
            </h3>
          </div>
        </div>
        <PriorityBadge priority={project.priority} />
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{project.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {project.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-slate-500">{project.tasksCompleted}/{project.tasksTotal} tasks</span>
          <span className="text-xs font-semibold text-slate-700">{project.progress}%</span>
        </div>
        <ProgressBar value={project.progress} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <AvatarGroup userIds={project.team} max={4} />
        <div className="flex items-center gap-2">
          <StatusBadge status={project.status} />
          <span className={`text-xs ${daysLeft <= 7 ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
            {daysLeft <= 0 ? 'Overdue' : `${daysLeft}d`}
          </span>
        </div>
      </div>
    </div>
  );
}

function ProjectRow({ project, onClick }) {
  const client = getClient(project.client);
  const daysLeft = Math.ceil((new Date(project.dueDate) - new Date()) / (1000*60*60*24));

  return (
    <tr
      onClick={() => onClick(project.id)}
      className="hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0"
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: client?.color }}>
            {client?.logo}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">{project.name}</p>
            <p className="text-xs text-slate-400">{client?.name}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4"><StatusBadge status={project.status} /></td>
      <td className="py-3 px-4"><PriorityBadge priority={project.priority} /></td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2 min-w-24">
          <ProgressBar value={project.progress} className="flex-1" />
          <span className="text-xs text-slate-500 font-medium">{project.progress}%</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <AvatarGroup userIds={project.team} max={3} />
      </td>
      <td className="py-3 px-4">
        <p className="text-xs text-slate-600">{new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
        <p className={`text-xs ${daysLeft <= 7 ? 'text-red-500' : 'text-slate-400'}`}>
          {daysLeft <= 0 ? 'Overdue' : `${daysLeft}d left`}
        </p>
      </td>
      <td className="py-3 px-4">
        <p className="text-xs text-slate-700">${project.spent.toLocaleString()}<span className="text-slate-400"> / ${project.budget.toLocaleString()}</span></p>
      </td>
    </tr>
  );
}

export default function Projects() {
  const [view, setView] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

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
        subtitle={`${projects.length} total projects`}
        action={{ label: 'New Project', onClick: () => {} }}
      />

      <main className="flex-1 p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === s ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {s === 'all' ? 'All' : s.replace('-', ' ')}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search projects…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="text-sm outline-none text-slate-700 placeholder:text-slate-400 w-36"
              />
            </div>
            <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`p-2 transition-colors ${view === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 transition-colors ${view === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(p => (
              <ProjectCard key={p.id} project={p} onClick={(id) => navigate(`/projects/${id}`)} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-16 text-slate-400">
                <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
                <p>No projects found.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Project', 'Status', 'Priority', 'Progress', 'Team', 'Due Date', 'Budget'].map(col => (
                    <th key={col} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <ProjectRow key={p.id} project={p} onClick={(id) => navigate(`/projects/${id}`)} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
