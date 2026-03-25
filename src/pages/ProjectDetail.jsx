import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import Avatar, { AvatarGroup } from '../components/Avatar';
import { StatusBadge, PriorityBadge, TagBadge } from '../components/Badge';
import { getProject, getClient, getMember, tasks } from '../data/mockData';

const taskStatusGroups = ['todo', 'in-progress', 'done'];
const statusLabels = { 'todo': 'To Do', 'in-progress': 'In Progress', 'done': 'Done' };
const statusIcons  = { 'todo': Clock, 'in-progress': AlertCircle, 'done': CheckCircle2 };
const statusColors = { 'todo': 'text-slate-400', 'in-progress': 'text-indigo-500', 'done': 'text-emerald-500' };

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = getProject(id);
  const client  = getClient(project?.client);

  if (!project) return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-slate-500">Project not found.</p>
    </div>
  );

  const projectTasks = tasks.filter(t => t.projectId === id);
  const daysLeft = Math.ceil((new Date(project.dueDate) - new Date()) / (1000*60*60*24));
  const budgetPct = Math.round(project.spent / project.budget * 100);

  return (
    <div className="flex flex-col flex-1">
      <Header
        title={project.name}
        subtitle={client?.name}
      />

      <main className="flex-1 p-6 space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm transition-colors"
        >
          <ArrowLeft size={15} /> Back to Projects
        </button>

        {/* Overview cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Progress', value: `${project.progress}%`, icon: CheckCircle2, sub: `${project.tasksCompleted}/${project.tasksTotal} tasks` },
            { label: 'Days Remaining', value: daysLeft <= 0 ? 'Overdue' : `${daysLeft}d`, icon: Calendar, sub: `Due ${new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` },
            { label: 'Budget Used', value: `${budgetPct}%`, icon: DollarSign, sub: `$${project.spent.toLocaleString()} of $${project.budget.toLocaleString()}` },
            { label: 'Team', value: project.team.length, icon: Users, sub: 'Members assigned' },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <card.icon size={15} className="text-slate-400" />
                <span className="text-xs text-slate-500">{card.label}</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task board */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-slate-800 font-semibold">Tasks</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {taskStatusGroups.map(status => {
                const Icon = statusIcons[status];
                const grouped = projectTasks.filter(t => t.status === status);
                return (
                  <div key={status} className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon size={14} className={statusColors[status]} />
                      <span className="text-sm font-semibold text-slate-700">{statusLabels[status]}</span>
                      <span className="ml-auto text-xs bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">{grouped.length}</span>
                    </div>
                    <div className="space-y-2">
                      {grouped.map(task => {
                        const assignee = getMember(task.assignee);
                        return (
                          <div key={task.id} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                            <p className="text-xs font-medium text-slate-700 leading-relaxed mb-2">{task.title}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-1">
                                {task.tags.slice(0,2).map(t => <TagBadge key={t} tag={t} />)}
                              </div>
                              {assignee && (
                                <div
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                                  style={{ backgroundColor: assignee.color }}
                                  title={assignee.name}
                                >
                                  {assignee.avatar}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {grouped.length === 0 && (
                        <p className="text-xs text-slate-400 text-center py-3">No tasks</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar info */}
          <div className="space-y-4">
            {/* Details */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Project Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Status</p>
                  <StatusBadge status={project.status} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Priority</p>
                  <PriorityBadge priority={project.priority} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Timeline</p>
                  <p className="text-xs text-slate-700">
                    {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} →{' '}
                    {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-xs text-slate-400">Budget</p>
                    <p className="text-xs text-slate-600">{budgetPct}% used</p>
                  </div>
                  <ProgressBar value={budgetPct} />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-slate-400">${project.spent.toLocaleString()} spent</p>
                    <p className="text-xs text-slate-400">${project.budget.toLocaleString()} total</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Team Members</h3>
              <div className="space-y-3">
                {project.team.map(uid => {
                  const m = getMember(uid);
                  if (!m) return null;
                  return (
                    <div key={uid} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: m.color }}>
                        {m.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{m.name}</p>
                        <p className="text-xs text-slate-400">{m.role}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">Description</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{project.description}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
