import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, List, Plus, Search, FolderOpen } from 'lucide-react';
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
      className="bg-white rounded-2xl border border-green-100 p-5 hover:shadow-md hover:border-green-300 transition-all cursor-pointer group shadow-sm"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: client?.color }}
          >
            {client?.logo}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide truncate">{client?.name}</p>
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-green-700 transition-colors leading-tight truncate">
              {project.name}
            </h3>
          </div>
        </div>
        <PriorityBadge priority={project.priority} />
      </div>

      <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2 font-medium">{project.description}</p>

      <div className="flex flex-wrap gap-1 mb-4">
        {project.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-gray-400 font-semibold">{project.tasksCompleted}/{project.tasksTotal} tasks</span>
          <span className="text-xs font-bold text-gray-700">{project.progress}%</span>
        </div>
        <ProgressBar value={project.progress} />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-green-50">
        <AvatarGroup userIds={project.team} max={4} />
        <div className="flex items-center gap-2">
          <StatusBadge status={project.status} />
          <span className={`text-xs font-bold ${daysLeft <= 7 ? 'text-red-500' : 'text-gray-400'}`}>
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
      className="hover:bg-green-50 cursor-pointer transition-colors border-b border-green-50 last:border-0"
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: client?.color }}>
            {client?.logo}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{project.name}</p>
            <p className="text-xs text-gray-400 font-medium">{client?.name}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4"><StatusBadge status={project.status} /></td>
      <td className="py-3 px-4"><PriorityBadge priority={project.priority} /></td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2 min-w-24">
          <ProgressBar value={project.progress} className="flex-1" />
          <span className="text-xs text-gray-500 font-bold">{project.progress}%</span>
        </div>
      </td>
      <td className="py-3 px-4"><AvatarGroup userIds={project.team} max={3} /></td>
      <td className="py-3 px-4">
        <p className="text-xs font-semibold text-gray-700">{new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
        <p className={`text-xs font-semibold ${daysLeft <= 7 ? 'text-red-500' : 'text-gray-400'}`}>
          {daysLeft <= 0 ? 'Overdue' : `${daysLeft}d left`}
        </p>
      </td>
      <td className="py-3 px-4">
        <p className="text-xs font-semibold text-gray-700">${project.spent.toLocaleString()}<span className="text-gray-400 font-medium"> / ${project.budget.toLocaleString()}</span></p>
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
                className={`p-2 transition-colors ${view === 'grid' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-gray-700 hover:bg-green-50'}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 transition-colors ${view === 'list' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-gray-700 hover:bg-green-50'}`}
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
              <div className="col-span-3 text-center py-16 text-gray-400">
                <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No projects found.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-green-100 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-green-50 border-b border-green-100">
                <tr>
                  {['Project', 'Status', 'Priority', 'Progress', 'Team', 'Due Date', 'Budget'].map(col => (
                    <th key={col} className="text-left py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{col}</th>
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
