import { useState } from 'react';
import { Mail, Search } from 'lucide-react';
import Header from '../components/Header';
import { teamMembers } from '../data/mockData';

const statusDot   = { active: 'bg-green-400', away: 'bg-amber-400', offline: 'bg-gray-300' };
const statusLabel = { active: 'Active', away: 'Away', offline: 'Offline' };
const statusPill  = {
  active:  'bg-green-100 text-green-700 border border-green-200',
  away:    'bg-amber-50 text-amber-700 border border-amber-200',
  offline: 'bg-gray-100 text-gray-500 border border-gray-200',
};

function MemberCard({ member }) {
  return (
    <div className="bg-white rounded-2xl border border-green-100 p-5 hover:shadow-md transition-shadow shadow-sm flex flex-col">
      {/* Avatar */}
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
        <h3 className="text-sm font-bold text-gray-900">{member.name}</h3>
        <p className="text-xs text-gray-400 font-medium mt-0.5">{member.role}</p>
        <span className={`mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusPill[member.status]}`}>
          {statusLabel[member.status]}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-green-50 border border-green-100 rounded-xl p-2.5 text-center">
          <p className="text-lg font-bold text-gray-900">{member.projects}</p>
          <p className="text-[10px] text-gray-400 font-semibold">Projects</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-2.5 text-center">
          <p className="text-lg font-bold text-gray-900">{member.tasks}</p>
          <p className="text-[10px] text-gray-400 font-semibold">Tasks</p>
        </div>
      </div>

      {/* Email */}
      <a
        href={`mailto:${member.email}`}
        className="flex items-center gap-2 text-xs text-gray-400 hover:text-green-600 transition-colors font-semibold mt-auto"
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
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Members',      value: teamMembers.length, accent: 'border-l-4 border-green-400' },
            { label: 'Active Now',         value: teamMembers.filter(m => m.status === 'active').length, accent: 'border-l-4 border-green-500' },
            { label: 'Avg Tasks / Member', value: Math.round(teamMembers.reduce((s, m) => s + m.tasks, 0) / teamMembers.length), accent: 'border-l-4 border-amber-400' },
          ].map(item => (
            <div key={item.label} className={`bg-white border border-green-100 rounded-2xl p-4 shadow-sm ${item.accent}`}>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white border border-green-100 rounded-xl px-3 py-2">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search team…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="text-xs font-semibold outline-none text-gray-700 placeholder:text-gray-400 w-36"
            />
          </div>
          {['all', 'active', 'away', 'offline'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize border transition-all ${
                statusFilter === s
                  ? 'bg-green-500 text-white border-green-500 shadow-sm shadow-green-200'
                  : 'bg-white text-gray-500 border-green-100 hover:bg-green-50'
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
          <div className="text-center py-16 text-gray-400 font-semibold">No team members found.</div>
        )}
      </main>
    </div>
  );
}
