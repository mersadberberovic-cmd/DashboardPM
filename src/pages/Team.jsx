import { useState } from 'react';
import { Mail, Search, X, UserMinus } from 'lucide-react';
import Header from '../components/Header';
import { teamMembers as mockMembers } from '../data/mockData';

const STORAGE_KEY = 'pm_team';

const AVATAR_COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4',
];

function loadMembers() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : mockMembers;
  } catch {
    return mockMembers;
  }
}

function saveMembers(members) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

const statusDot   = { active: 'bg-green-400', away: 'bg-amber-400', offline: 'bg-gray-300' };
const statusLabel = { active: 'Active', away: 'Away', offline: 'Offline' };
const statusPill  = {
  active:  'bg-green-100 text-green-700 border border-green-200',
  away:    'bg-amber-50 text-amber-700 border border-amber-200',
  offline: 'bg-gray-100 text-gray-500 border border-gray-200',
};

function MemberCard({ member, onRemove }) {
  return (
    <div className="bg-white rounded-2xl border border-green-100 p-5 hover:shadow-md transition-shadow shadow-sm flex flex-col group relative">
      <button
        onClick={() => onRemove(member.id)}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
        title="Remove member"
      >
        <UserMinus size={13} />
      </button>

      {/* Avatar */}
      <div className="flex flex-col items-center text-center mb-4">
        <div className="relative mb-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
            style={{ backgroundColor: member.color }}
          >
            {member.avatar}
          </div>
          <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${statusDot[member.status] || statusDot.offline}`} />
        </div>
        <h3 className="text-sm font-bold text-gray-900">{member.name}</h3>
        <p className="text-xs text-gray-400 font-medium mt-0.5">{member.role}</p>
        <span className={`mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusPill[member.status] || statusPill.offline}`}>
          {statusLabel[member.status] || 'Offline'}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-green-50 border border-green-100 rounded-xl p-2.5 text-center">
          <p className="text-lg font-bold text-gray-900">{member.projects || 0}</p>
          <p className="text-[10px] text-gray-400 font-semibold">Projects</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-2.5 text-center">
          <p className="text-lg font-bold text-gray-900">{member.tasks || 0}</p>
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

const EMPTY_FORM = { name: '', email: '', role: '' };

function InviteModal({ onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    const initials = form.name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    onAdd({
      id: 'u' + Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role.trim() || 'Team Member',
      avatar: initials,
      color,
      status: 'offline',
      projects: 0,
      tasks: 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-green-100 shadow-2xl w-full max-w-sm mx-4">
        <div className="flex items-center justify-between p-5 border-b border-green-50">
          <h2 className="text-sm font-bold text-gray-900">Invite Team Member</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Jane Smith"
              className="w-full text-sm border border-green-100 rounded-xl px-3 py-2 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-gray-700 placeholder:text-gray-400"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Email Address *</label>
            <input
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="jane@company.com"
              className="w-full text-sm border border-green-100 rounded-xl px-3 py-2 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-gray-700 placeholder:text-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Role</label>
            <input
              type="text"
              value={form.role}
              onChange={e => set('role', e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="w-full text-sm border border-green-100 rounded-xl px-3 py-2 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-gray-700 placeholder:text-gray-400"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-xs font-bold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-xs font-bold text-white bg-green-500 hover:bg-green-600 rounded-xl transition-colors shadow-sm shadow-green-200"
            >
              Invite Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Team() {
  const [members, setMembers] = useState(loadMembers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                        m.role.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const addMember = (member) => {
    const updated = [...members, member];
    setMembers(updated);
    saveMembers(updated);
  };

  const removeMember = (id) => {
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    saveMembers(updated);
  };

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Team"
        subtitle={`${members.length} members`}
        action={{ label: 'Invite Member', onClick: () => setShowModal(true) }}
      />

      {showModal && (
        <InviteModal
          onClose={() => setShowModal(false)}
          onAdd={addMember}
        />
      )}

      <main className="flex-1 p-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Members',      value: members.length,                                                                                    accent: 'border-l-4 border-green-400' },
            { label: 'Active Now',         value: members.filter(m => m.status === 'active').length,                                                 accent: 'border-l-4 border-green-500' },
            { label: 'Avg Tasks / Member', value: members.length ? Math.round(members.reduce((s, m) => s + (m.tasks || 0), 0) / members.length) : 0, accent: 'border-l-4 border-amber-400' },
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
          {filtered.map(member => (
            <MemberCard key={member.id} member={member} onRemove={removeMember} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 font-semibold">No team members found.</div>
        )}
      </main>
    </div>
  );
}
