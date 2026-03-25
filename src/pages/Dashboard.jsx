import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TrendingUp, FolderOpen, CheckCircle2, Users, DollarSign } from 'lucide-react';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import { AvatarGroup } from '../components/Avatar';
import { StatusBadge } from '../components/Badge';
import {
  projects, tasks, activity, revenueData, projectStatusData,
  teamMembers, getMember, getClient,
} from '../data/mockData';

const PIE_COLORS = ['#22c55e', '#f59e0b', '#d1d5db'];

function StatCard({ label, value, sub, icon: Icon, trend }) {
  return (
    <div className="bg-white rounded-2xl border border-green-100 p-5 flex items-start gap-4 shadow-sm">
      <div className="w-11 h-11 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-green-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {sub && <p className="text-xs text-gray-400 font-medium mt-0.5">{sub}</p>}
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-lg border border-green-100">
          <TrendingUp size={12} />
          {trend}
        </div>
      )}
    </div>
  );
}

const activityColors = {
  task_complete:  'bg-green-500',
  comment:        'bg-blue-400',
  task_start:     'bg-amber-400',
  file_upload:    'bg-purple-400',
  project_update: 'bg-gray-400',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-green-100 rounded-xl p-3 shadow-md text-xs font-semibold">
        <p className="text-gray-500 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name === 'revenue' ? 'Revenue' : 'Expenses'}: ${p.value.toLocaleString()}</p>
        ))}
      </div>
    );
  }
  return null;
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
          <StatCard label="Active Projects"   value={projects.filter(p => p.status === 'active').length} sub="1 in review"             icon={FolderOpen}   trend="+2 this month" />
          <StatCard label="Tasks In Progress" value={activeTasks}                                         sub={`${doneTasks} completed`} icon={CheckCircle2} />
          <StatCard label="Team Members"      value={teamMembers.length}                                  sub="All hands on deck"        icon={Users} />
          <StatCard label="Budget Used"       value={`$${(totalSpent/1000).toFixed(0)}k`}                sub={`of $${(totalBudget/1000).toFixed(0)}k total`} icon={DollarSign} trend={`${Math.round(totalSpent/totalBudget*100)}%`} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Area chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-gray-900 font-bold text-sm">Revenue vs Expenses</h2>
                <p className="text-gray-400 text-xs font-medium mt-0.5">Last 6 months</p>
              </div>
              <span className="text-green-600 text-xs font-bold bg-green-50 px-2.5 py-1 rounded-lg border border-green-100 flex items-center gap-1">
                <TrendingUp size={12} /> +18% vs last period
              </span>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#f59e0b" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Montserrat', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `$${v/1000}k`} tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Montserrat', fontWeight: 600 }} axisLine={false} tickLine={false} width={46} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue"  stroke="#22c55e" strokeWidth={2.5} fill="url(#colorRevenue)"  dot={false} />
                <Area type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={2.5} fill="url(#colorExpenses)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /><span className="text-xs text-gray-400 font-semibold">Revenue</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /><span className="text-xs text-gray-400 font-semibold">Expenses</span></div>
            </div>
          </div>

          {/* Pie chart */}
          <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <h2 className="text-gray-900 font-bold text-sm mb-0.5">Project Status</h2>
            <p className="text-gray-400 text-xs font-medium mb-2">{projects.length} total projects</p>
            <ResponsiveContainer width="100%" height={195}>
              <PieChart>
                <Pie data={projectStatusData} cx="50%" cy="50%" innerRadius={52} outerRadius={76} paddingAngle={3} dataKey="value">
                  {projectStatusData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={v => <span style={{ fontSize: 11, color: '#6b7280', fontFamily: 'Montserrat', fontWeight: 600 }}>{v}</span>}
                />
                <Tooltip contentStyle={{ fontFamily: 'Montserrat', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Deadlines */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900 font-bold text-sm">Upcoming Deadlines</h2>
              <a href="/projects" className="text-green-600 text-xs font-bold hover:underline">View all →</a>
            </div>
            <div className="space-y-2">
              {upcomingDeadlines.map(project => {
                const client = getClient(project.client);
                const daysLeft = Math.ceil((new Date(project.dueDate) - new Date()) / (1000*60*60*24));
                return (
                  <div key={project.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-green-50 transition-colors border border-transparent hover:border-green-100">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: client?.color }}
                    >
                      {client?.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{project.name}</p>
                      <ProgressBar value={project.progress} showLabel className="mt-1.5 max-w-xs" />
                    </div>
                    <div className="text-right flex-shrink-0">
                      <StatusBadge status={project.status} />
                      <p className={`text-xs mt-1 font-semibold ${daysLeft <= 7 ? 'text-red-500' : 'text-gray-400'}`}>
                        {daysLeft <= 0 ? 'Overdue' : `${daysLeft}d left`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity */}
          <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <h2 className="text-gray-900 font-bold text-sm mb-4">Recent Activity</h2>
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
                      <p className="text-xs text-gray-700 leading-relaxed font-medium">
                        <span className="font-bold text-gray-900">{member?.name}</span>{' '}
                        {item.text}
                      </p>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{item.time}</p>
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
