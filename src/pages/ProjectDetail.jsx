import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import { StatusBadge, PriorityBadge, TagBadge } from '../components/Badge';
import { getProject, getClient, getMember, tasks } from '../data/mockData';

const taskStatusGroups = ['todo', 'in-progress', 'done'];
const statusLabels  = { 'todo': 'To Do', 'in-progress': 'In Progress', 'done': 'Done' };
const statusIcons   = { 'todo': Clock, 'in-progress': AlertCircle, 'done': CheckCircle2 };
const statusColors  = { 'todo': 'text-gray-400', 'in-progress': 'text-amber-500', 'done': 'text-green-500' };
const colBg         = { 'todo': 'bg-gray-50 border-gray-200', 'in-progress': 'bg-amber-50 border-amber-100', 'done': 'bg-green-50 border-green-200' };

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = getProject(id);
  const client  = getClient(project?.client);

  if (!project) return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-gray-400 font-semibold">Project not found.</p>
    </div>
  );

  const projectTasks = tasks.filter(t => t.projectId === id);
  const daysLeft = Math.ceil((new Date(project.dueDate) - new Date()) / (1000*60*60*24));
  const budgetPct = Math.round(project.spent / project.budget * 100);

  return (
    <div className="flex flex-col flex-1">
      <Header title={project.name} subtitle={client?.name} />

      <main className="flex-1 p-6 space-y-6">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-800 text-sm font-semibold transition-colors"
        >
          <ArrowLeft size={15} /> Back to Projects
        </button>

        {/* Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Progress',       value: `${project.progress}%`, icon: CheckCircle2, sub: `${project.tasksCompleted}/${project.tasksTotal} tasks` },
            { label: 'Days Remaining', value: daysLeft <= 0 ? 'Overdue' : `${daysLeft}d`, icon: Calendar, sub: `Due ${new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` },
            { label: 'Budget Used',    value: `${budgetPct}%`, icon: DollarSign, sub: `$${project.spent.toLocaleString()} of $${project.budget.toLocaleString()}` },
            { label: 'Team',           value: project.team.length, icon: Users, sub: 'Members assigned' },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-2xl border border-green-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <card.icon size={14} className="text-green-500" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{card.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task board */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-gray-900 font-bold text-sm">Task Board</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {taskStatusGroups.map(status => {
                const Icon = statusIcons[status];
                const grouped = projectTasks.filter(t => t.status === status);
                return (
                  <div key={status} className={`rounded-2xl border p-4 ${colBg[status]}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon size={14} className={statusColors[status]} />
                      <span className="text-xs font-bold text-gray-700">{statusLabels[status]}</span>
                      <span className="ml-auto text-[10px] font-bold bg-white border border-gray-200 text-gray-500 rounded-full px-2 py-0.5">{grouped.length}</span>
                    </div>
                    <div className="space-y-2">
                      {grouped.map(task => {
                        const assignee = getMember(task.assignee);
                        return (
                          <div key={task.id} className="bg-white rounded-xl p-3 border border-white shadow-sm">
                            <p className="text-xs font-semibold text-gray-800 leading-relaxed mb-2">{task.title}</p>
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
                        <p className="text-xs text-gray-400 font-semibold text-center py-4">No tasks</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Project Details</h3>
              <div className="space-y-3">
                <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Status</p><StatusBadge status={project.status} /></div>
                <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Priority</p><PriorityBadge priority={project.priority} /></div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">{project.tags.map(tag => <TagBadge key={tag} tag={tag} />)}</div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Timeline</p>
                  <p className="text-xs font-semibold text-gray-700">
                    {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} →{' '}
                    {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Budget</p>
                    <p className="text-[10px] font-bold text-gray-600">{budgetPct}% used</p>
                  </div>
                  <ProgressBar value={budgetPct} />
                  <div className="flex justify-between mt-1">
                    <p className="text-[10px] text-gray-400 font-semibold">${project.spent.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 font-semibold">${project.budget.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Team Members</h3>
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
                        <p className="text-sm font-bold text-gray-800">{m.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{m.role}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">{project.description}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
