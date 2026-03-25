import { useState } from 'react';
import { Mail, Briefcase, CheckSquare, Search } from 'lucide-react';
import Header from '../components/Header';
import { teamMembers } from '../data/mockData';

const statusDot = {
  active:  'bg-emerald-400',
  away:    'bg-amber-400',
  offline: 'bg-slate-300',
};
const statusLabel = {
  active:  'Active',
  away:    'Away',
  offline: 'Offline',
};

function MemberCard({ member }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      {/* Avatar + status */}
      <div className="flex flex-col items-center text-center mb-4">
        <div className="relative mb-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
            style={{ backgroundColor: member.color }}
          >
            {member.avatar}
          </div>
          <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${statusDot[member.status]}`} />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">{member.name}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{member.role}</p>
        <span className={`mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full ${
          member.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
          member.status === 'away'   ? 'bg-amber-100 text-amber-700' :
          'bg-slate-100 text-slate-500'
        }`}>
          {statusLabel[member.status]}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-50 rounded-lg p-2.5 text-center">
          <p className="text-lg font-bold text-slate-800">{member.projects}</p>
          <p className="text-[10px] text-slate-400">Projects</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2.5 text-center">
          <p className="text-lg font-bold text-slate-800">{member.tasks}</p>
          <p className="text-[10px] text-slate-400">Tasks</p>
        </div>
      </div>

      {/* Email */}
      <a
        href={`mailto:${member.email}`}
        className="flex items-center gap-2 text-xs text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <Mail size={12} />
        <span className="truncate">{member.email}</span>
      </a>
    </div>
  );
}

export default function Team() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = teamMembers.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                        m.role.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Team"
        subtitle={`${teamMembers.length} members`}
        action={{ label: 'Invite Member', onClick: () => {} }}
      />

      <main className="flex-1 p-6">
        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Members', value: teamMembers.length, color: 'bg-indigo-500' },
            { label: 'Active Now', value: teamMembers.filter(m => m.status === 'active').length, color: 'bg-emerald-500' },
            { label: 'Avg Tasks / Member', value: Math.round(teamMembers.reduce((s, m) => s + m.tasks, 0) / teamMembers.length), color: 'bg-amber-500' },
          ].map(item => (
            <div key={item.label} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <div className={`w-2.5 h-10 rounded-full ${item.color}`} />
              <div>
                <p className="text-2xl font-bold text-slate-800">{item.value}</p>
                <p className="text-xs text-slate-400">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search team…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="text-sm outline-none text-slate-700 placeholder:text-slate-400 w-36"
            />
          </div>
          {['all', 'active', 'away', 'offline'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize border transition-colors ${
                statusFilter === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map(member => <MemberCard key={member.id} member={member} />)}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p>No team members found.</p>
          </div>
        )}
      </main>
    </div>
  );
}
