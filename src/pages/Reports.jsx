import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { TrendingUp, Award, Target, Clock } from 'lucide-react';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import { projects, teamMembers, tasks, revenueData, getClient } from '../data/mockData';

const projectBudgetData = projects.map(p => ({
  name: p.name.split(' ').slice(0, 2).join(' '),
  budget: p.budget,
  spent:  p.spent,
}));

const taskCompletionData = teamMembers.map(m => {
  const memberTasks = tasks.filter(t => t.assignee === m.id);
  const done        = memberTasks.filter(t => t.status === 'done').length;
  return {
    member: m.name.split(' ')[0],
    tasks: memberTasks.length,
    done,
    rate: memberTasks.length ? Math.round(done / memberTasks.length * 100) : 0,
  };
});

const radarData = [
  { metric: 'On-Time', value: 72 },
  { metric: 'Budget',  value: 85 },
  { metric: 'Quality', value: 91 },
  { metric: 'Client',  value: 88 },
  { metric: 'Collab',  value: 76 },
];

export default function Reports() {
  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
  const totalExpenses = revenueData.reduce((s, d) => s + d.expenses, 0);
  const profit = totalRevenue - totalExpenses;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const completionRate = Math.round(completedTasks / tasks.length * 100);

  return (
    <div className="flex flex-col flex-1">
      <Header title="Reports" subtitle="Agency performance overview" />

      <main className="flex-1 p-6 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: '6-Month Revenue', value: `$${(totalRevenue/1000).toFixed(0)}k`, icon: TrendingUp, color: 'bg-indigo-500', sub: `$${(profit/1000).toFixed(0)}k profit` },
            { label: 'Task Completion', value: `${completionRate}%`, icon: Target, color: 'bg-emerald-500', sub: `${completedTasks} of ${tasks.length} tasks` },
            { label: 'Avg Project Health', value: `${Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length)}%`, icon: Award, color: 'bg-amber-500', sub: 'Across all projects' },
            { label: 'Avg Budget Used', value: `${Math.round(projects.reduce((s, p) => s + p.spent/p.budget*100, 0) / projects.length)}%`, icon: Clock, color: 'bg-blue-500', sub: 'Budget efficiency' },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${card.color}`}>
                <card.icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{card.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-0.5">{card.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Budget per project */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-slate-800 font-semibold mb-1">Budget vs Spent by Project</h2>
            <p className="text-xs text-slate-400 mb-4">All active projects</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={projectBudgetData} margin={{ top: 4, right: 4, bottom: 20, left: 0 }} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" />
                <YAxis tickFormatter={v => `$${v/1000}k`} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={44} />
                <Tooltip formatter={v => `$${v.toLocaleString()}`} />
                <Bar dataKey="budget" fill="#e0e7ff" radius={[3, 3, 0, 0]} name="Budget" />
                <Bar dataKey="spent"  fill="#6366f1" radius={[3, 3, 0, 0]} name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-slate-800 font-semibold mb-1">Agency Performance</h2>
            <p className="text-xs text-slate-400 mb-2">Key metrics score</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData} outerRadius={75}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team performance */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-slate-800 font-semibold mb-4">Team Task Completion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taskCompletionData.filter(m => m.tasks > 0).map(m => (
              <div key={m.member} className="flex items-center gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: teamMembers.find(t => t.name.startsWith(m.member))?.color }}
                >
                  {m.member.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{m.member}</span>
                    <span className="text-xs text-slate-500">{m.done}/{m.tasks} tasks · {m.rate}%</span>
                  </div>
                  <ProgressBar value={m.rate} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project health table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-slate-800 font-semibold">Project Health Summary</h2>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {['Project', 'Progress', 'Budget Used', 'Tasks Done', 'Status'].map(h => (
                  <th key={h} className="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map(p => {
                const client = getClient(p.client);
                const budgetPct = Math.round(p.spent / p.budget * 100);
                return (
                  <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: client?.color }}>
                          {client?.logo}
                        </div>
                        <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <ProgressBar value={p.progress} className="flex-1" />
                        <span className="text-xs text-slate-500">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium ${budgetPct > 90 ? 'text-red-600' : budgetPct > 70 ? 'text-amber-600' : 'text-slate-600'}`}>
                        {budgetPct}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-slate-600">{p.tasksCompleted}/{p.tasksTotal}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        p.status === 'active'  ? 'bg-emerald-100 text-emerald-700' :
                        p.status === 'review'  ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {p.status === 'on-hold' ? 'On Hold' : p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
