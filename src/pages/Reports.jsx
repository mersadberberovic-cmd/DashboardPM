import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { TrendingUp, Award, Target, Clock } from 'lucide-react';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import { projects, teamMembers, tasks, revenueData, getClient } from '../data/mockData';

const projectBudgetData = projects.map(p => ({
  name:   p.name.split(' ').slice(0, 2).join(' '),
  Budget: p.budget,
  Spent:  p.spent,
}));

const taskCompletionData = teamMembers.map(m => {
  const mt   = tasks.filter(t => t.assignee === m.id);
  const done = mt.filter(t => t.status === 'done').length;
  return { name: m.name.split(' ')[0], color: m.color, tasks: mt.length, done, rate: mt.length ? Math.round(done / mt.length * 100) : 0 };
});

const radarData = [
  { metric: 'On-Time', value: 72 },
  { metric: 'Budget',  value: 85 },
  { metric: 'Quality', value: 91 },
  { metric: 'Client',  value: 88 },
  { metric: 'Collab',  value: 76 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-green-100 rounded-xl p-3 shadow-md text-xs font-semibold">
        <p className="text-gray-500 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.fill === '#bbf7d0' ? '#16a34a' : '#15803d' }}>{p.name}: ${p.value.toLocaleString()}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const totalRevenue  = revenueData.reduce((s, d) => s + d.revenue, 0);
  const totalExpenses = revenueData.reduce((s, d) => s + d.expenses, 0);
  const profit        = totalRevenue - totalExpenses;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const completionRate = Math.round(completedTasks / tasks.length * 100);

  return (
    <div className="flex flex-col flex-1">
      <Header title="Reports" subtitle="Agency performance overview" />

      <main className="flex-1 p-6 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: '6-Month Revenue',    value: `$${(totalRevenue/1000).toFixed(0)}k`,  icon: TrendingUp, sub: `$${(profit/1000).toFixed(0)}k profit` },
            { label: 'Task Completion',    value: `${completionRate}%`,                    icon: Target,     sub: `${completedTasks} of ${tasks.length} tasks` },
            { label: 'Avg Project Health', value: `${Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length)}%`, icon: Award, sub: 'Across all projects' },
            { label: 'Avg Budget Used',    value: `${Math.round(projects.reduce((s, p) => s + p.spent/p.budget*100, 0) / projects.length)}%`, icon: Clock, sub: 'Budget efficiency' },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-2xl border border-green-100 p-5 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                <card.icon size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <h2 className="text-gray-900 font-bold text-sm mb-0.5">Budget vs Spent by Project</h2>
            <p className="text-xs text-gray-400 font-medium mb-4">All active projects</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={projectBudgetData} margin={{ top: 4, right: 4, bottom: 24, left: 0 }} barSize={14} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af', fontFamily: 'Montserrat', fontWeight: 600 }} axisLine={false} tickLine={false} angle={-12} textAnchor="end" />
                <YAxis tickFormatter={v => `$${v/1000}k`} tick={{ fontSize: 10, fill: '#9ca3af', fontFamily: 'Montserrat', fontWeight: 600 }} axisLine={false} tickLine={false} width={44} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Budget" fill="#bbf7d0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Spent"  fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-200 inline-block" /><span className="text-xs text-gray-400 font-semibold">Budget</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500 inline-block" /><span className="text-xs text-gray-400 font-semibold">Spent</span></div>
            </div>
          </div>

          {/* Radar */}
          <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <h2 className="text-gray-900 font-bold text-sm mb-0.5">Agency Performance</h2>
            <p className="text-xs text-gray-400 font-medium mb-2">Key metrics score</p>
            <ResponsiveContainer width="100%" height={230}>
              <RadarChart data={radarData} outerRadius={75}>
                <PolarGrid stroke="#dcfce7" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#6b7280', fontFamily: 'Montserrat', fontWeight: 600 }} />
                <Radar dataKey="value" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={{ fontFamily: 'Montserrat', fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team completion */}
        <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
          <h2 className="text-gray-900 font-bold text-sm mb-4">Team Task Completion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taskCompletionData.filter(m => m.tasks > 0).map(m => (
              <div key={m.name} className="flex items-center gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: m.color }}
                >
                  {m.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-bold text-gray-700">{m.name}</span>
                    <span className="text-xs text-gray-400 font-semibold">{m.done}/{m.tasks} · {m.rate}%</span>
                  </div>
                  <ProgressBar value={m.rate} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project health table */}
        <div className="bg-white rounded-2xl border border-green-100 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-green-50">
            <h2 className="text-gray-900 font-bold text-sm">Project Health Summary</h2>
          </div>
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                {['Project', 'Progress', 'Budget Used', 'Tasks Done', 'Status'].map(h => (
                  <th key={h} className="text-left py-2.5 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map(p => {
                const client    = getClient(p.client);
                const budgetPct = Math.round(p.spent / p.budget * 100);
                return (
                  <tr key={p.id} className="border-t border-green-50 hover:bg-green-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: client?.color }}>
                          {client?.logo}
                        </div>
                        <span className="text-sm font-bold text-gray-800 truncate max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <ProgressBar value={p.progress} className="flex-1" />
                        <span className="text-xs text-gray-500 font-bold">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-bold ${budgetPct > 90 ? 'text-red-500' : budgetPct > 70 ? 'text-amber-600' : 'text-green-600'}`}>
                        {budgetPct}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold text-gray-600">{p.tasksCompleted}/{p.tasksTotal}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                        p.status === 'active'  ? 'bg-green-100 text-green-700 border-green-200' :
                        p.status === 'review'  ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-gray-100 text-gray-500 border-gray-200'
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
