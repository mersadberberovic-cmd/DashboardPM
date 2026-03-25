import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TrendingUp, FolderOpen, CheckCircle2, Users, DollarSign, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import { AvatarGroup } from '../components/Avatar';
import { StatusBadge } from '../components/Badge';
import {
  projects, tasks, activity, revenueData, projectStatusData,
  teamMembers, getMember, getClient,
} from '../data/mockData';

function StatCard({ label, value, sub, icon: Icon, iconColor, trend }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-500 text-sm">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      {trend && (
        <div className="flex items-center gap-0.5 text-emerald-600 text-sm font-medium">
          <TrendingUp size={14} />
          {trend}
        </div>
      )}
    </div>
  );
}

const activityIcons = {
  task_complete:  '✅',
  comment:        '💬',
  task_start:     '▶️',
  file_upload:    '📎',
  project_update: '📋',
};

export default function Dashboard() {
  const activeTasks = tasks.filter(t => t.status === 'in-progress').length;
  const doneTasks   = tasks.filter(t => t.status === 'done').length;
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent  = projects.reduce((s, p) => s + p.spent, 0);

  const upcomingDeadlines = projects
    .filter(p => p.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Dashboard"
        subtitle={`Welcome back, Alex — ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
      />

      <main className="flex-1 p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active Projects"   value={projects.filter(p => p.status === 'active').length}  sub="1 in review"             icon={FolderOpen}   iconColor="bg-indigo-500" trend="+2 this month" />
          <StatCard label="Tasks In Progress" value={activeTasks}                                          sub={`${doneTasks} completed`} icon={CheckCircle2} iconColor="bg-emerald-500" />
          <StatCard label="Team Members"      value={teamMembers.length}                                   sub="All hands on deck"        icon={Users}        iconColor="bg-amber-500" />
          <StatCard label="Budget Used"       value={`$${(totalSpent/1000).toFixed(0)}k`}                  sub={`of $${(totalBudget/1000).toFixed(0)}k total`} icon={DollarSign} iconColor="bg-blue-500" trend={`${Math.round(totalSpent/totalBudget*100)}%`} />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-slate-800 font-semibold">Revenue vs Expenses</h2>
                <p className="text-slate-400 text-xs mt-0.5">Last 6 months</p>
              </div>
              <span className="text-emerald-600 text-sm font-medium flex items-center gap-1">
                <TrendingUp size={14} /> +18% vs last period
              </span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `$${v/1000}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={48} />
                <Tooltip formatter={(v, name) => [`$${v.toLocaleString()}`, name === 'revenue' ? 'Revenue' : 'Expenses']} />
                <Area type="monotone" dataKey="revenue"  stroke="#6366f1" strokeWidth={2} fill="url(#revenue)" />
                <Area type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={2} fill="url(#expenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-slate-800 font-semibold mb-1">Project Status</h2>
            <p className="text-slate-400 text-xs mb-4">Distribution across {projects.length} projects</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={projectStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {projectStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-slate-600">{v}</span>} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming deadlines */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-800 font-semibold">Upcoming Deadlines</h2>
              <a href="/projects" className="text-indigo-600 text-sm hover:underline">View all →</a>
            </div>
            <div className="space-y-3">
              {upcomingDeadlines.map(project => {
                const client = getClient(project.client);
                const daysLeft = Math.ceil((new Date(project.dueDate) - new Date()) / (1000*60*60*24));
                return (
                  <div key={project.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: client?.color || '#6366f1' }}
                    >
                      {client?.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{project.name}</p>
                      <ProgressBar value={project.progress} showLabel className="mt-1.5 max-w-xs" />
                    </div>
                    <div className="text-right flex-shrink-0">
                      <StatusBadge status={project.status} />
                      <p className={`text-xs mt-1 ${daysLeft <= 7 ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                        {daysLeft <= 0 ? 'Overdue' : `${daysLeft}d left`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-slate-800 font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {activity.slice(0, 6).map(item => {
                const member = getMember(item.user);
                return (
                  <div key={item.id} className="flex gap-3 items-start">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: member?.color }}
                    >
                      {member?.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 leading-relaxed">
                        <span className="font-medium">{member?.name}</span>{' '}
                        {item.text}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
