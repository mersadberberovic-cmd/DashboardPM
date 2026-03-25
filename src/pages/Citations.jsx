import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, ExternalLink } from 'lucide-react';
import Header from '../components/Header';
import { teamMembers, projects } from '../data/mockData';

// ── localStorage ──────────────────────────────────────────────────────────────
const STORAGE_KEY = 'pm_citations';

const MONTHS = [
  { key: 'jan', label: 'Jan 26' },
  { key: 'feb', label: 'Feb 26' },
  { key: 'mar', label: 'Mar 26' },
  { key: 'apr', label: 'Apr 26' },
  { key: 'may', label: 'May 26' },
  { key: 'jun', label: 'Jun 26' },
  { key: 'jul', label: 'Jul 26' },
  { key: 'aug', label: 'Aug 26' },
  { key: 'sep', label: 'Sep 26' },
  { key: 'oct', label: 'Oct 26' },
  { key: 'nov', label: 'Nov 26' },
  { key: 'dec', label: 'Dec 26' },
];

const emptyMonths = () =>
  Object.fromEntries(MONTHS.map(m => [m.key, false]));

const SEED = [
  {
    id: 'cit1',
    client: 'Brew Interactive',
    project: 'SEO Campaign',
    owner: 'Riley Adams',
    url: 'https://brewinteractive.com',
    months: { jan: true, feb: true, mar: false, apr: false, may: false, jun: false, jul: false, aug: false, sep: false, oct: false, nov: false, dec: false },
  },
  {
    id: 'cit2',
    client: 'TCA',
    project: 'Local Listings',
    owner: 'Jordan Lee',
    url: 'https://tca.com.au',
    months: { jan: true, feb: false, mar: false, apr: false, may: false, jun: false, jul: false, aug: false, sep: false, oct: false, nov: false, dec: false },
  },
  {
    id: 'cit3',
    client: 'Rankonmaps',
    project: 'Citation Building',
    owner: 'Morgan Chen',
    url: 'https://rankonmaps.com',
    months: emptyMonths(),
  },
];

function loadCitations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : SEED;
  } catch {
    return SEED;
  }
}

function saveCitations(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// ── Empty form ────────────────────────────────────────────────────────────────
const emptyForm = () => ({
  client: '',
  project: '',
  owner: '',
  url: '',
  months: emptyMonths(),
});

// ── Modal ─────────────────────────────────────────────────────────────────────
function CitationModal({ initial, onSave, onClose }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(
    isEdit ? { ...initial } : emptyForm()
  );

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.client.trim()) return;
    onSave(
      isEdit
        ? { ...form }
        : { ...form, id: 'cit' + Date.now() }
    );
  };

  const inputCls =
    'w-full border border-green-100 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-100 focus:border-green-400 bg-white placeholder:text-gray-400';
  const labelCls = 'block text-xs font-bold text-gray-500 mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-green-100">
          <h2 className="text-base font-bold text-gray-900">
            {isEdit ? 'Edit Client' : 'Add Client'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-green-50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelCls}>Client Name *</label>
            <input
              className={inputCls}
              value={form.client}
              onChange={e => set('client', e.target.value)}
              placeholder="e.g. Brew Interactive"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Project</label>
              <input
                className={inputCls}
                value={form.project}
                onChange={e => set('project', e.target.value)}
                placeholder="e.g. SEO Campaign"
              />
            </div>
            <div>
              <label className={labelCls}>Owner</label>
              <select
                className={inputCls}
                value={form.owner}
                onChange={e => set('owner', e.target.value)}
              >
                <option value="">Unassigned</option>
                {teamMembers.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>URL</label>
            <input
              className={inputCls}
              value={form.url}
              onChange={e => set('url', e.target.value)}
              placeholder="https://…"
            />
          </div>

          {/* Month toggles inside modal */}
          <div>
            <label className={labelCls}>Months Completed (2026)</label>
            <div className="grid grid-cols-6 gap-1.5 mt-1">
              {MONTHS.map(m => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() =>
                    setForm(f => ({
                      ...f,
                      months: { ...f.months, [m.key]: !f.months[m.key] },
                    }))
                  }
                  className={`flex flex-col items-center justify-center py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                    form.months[m.key]
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-green-100 text-gray-400 hover:border-green-300 hover:text-gray-600'
                  }`}
                >
                  {form.months[m.key] && <Check size={9} className="mb-0.5" />}
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-green-50 border border-green-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-green-500 hover:bg-green-600 transition-colors shadow-sm shadow-green-200"
            >
              {isEdit ? 'Save Changes' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete confirm ────────────────────────────────────────────────────────────
function DeleteConfirm({ row, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-2">Remove Client?</h2>
        <p className="text-sm text-gray-500 mb-6">
          <span className="font-semibold text-gray-700">"{row.client}"</span> will be permanently removed.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-green-50 border border-green-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Citations() {
  const [rows, setRows] = useState(loadCitations);
  const [modal, setModal] = useState(null);   // null | 'add' | row-object
  const [toDelete, setToDelete] = useState(null);
  const [filterOwner, setFilterOwner] = useState('');
  const [filterProject, setFilterProject] = useState('');

  const save = (updated) => {
    setRows(updated);
    saveCitations(updated);
  };

  const handleSave = (row) => {
    const exists = rows.find(r => r.id === row.id);
    save(exists ? rows.map(r => r.id === row.id ? row : r) : [...rows, row]);
    setModal(null);
  };

  const handleDelete = () => {
    save(rows.filter(r => r.id !== toDelete.id));
    setToDelete(null);
  };

  const toggleMonth = (rowId, monthKey) => {
    save(rows.map(r =>
      r.id === rowId
        ? { ...r, months: { ...r.months, [monthKey]: !r.months[monthKey] } }
        : r
    ));
  };

  // Unique owners and projects for filter dropdowns
  const owners = [...new Set(rows.map(r => r.owner).filter(Boolean))].sort();
  const projectNames = [...new Set(rows.map(r => r.project).filter(Boolean))].sort();

  const filtered = rows.filter(r => {
    const matchOwner = !filterOwner || r.owner === filterOwner;
    const matchProject = !filterProject || r.project === filterProject;
    return matchOwner && matchProject;
  });

  const completedCount = rows.reduce((acc, r) =>
    acc + Object.values(r.months).filter(Boolean).length, 0
  );
  const totalCells = rows.length * 12;

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Citations Tracker 2026"
        subtitle={`${rows.length} client${rows.length !== 1 ? 's' : ''} · ${completedCount}/${totalCells} months completed`}
        action={{ label: 'Add Client', onClick: () => setModal('add') }}
      />

      <main className="flex-1 p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <select
            value={filterOwner}
            onChange={e => setFilterOwner(e.target.value)}
            className="text-xs font-semibold border border-green-100 rounded-xl px-3 py-2 bg-white text-gray-600 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
          >
            <option value="">All Owners</option>
            {owners.map(o => <option key={o} value={o}>{o}</option>)}
          </select>

          <select
            value={filterProject}
            onChange={e => setFilterProject(e.target.value)}
            className="text-xs font-semibold border border-green-100 rounded-xl px-3 py-2 bg-white text-gray-600 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
          >
            <option value="">All Projects</option>
            {projectNames.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          {(filterOwner || filterProject) && (
            <button
              onClick={() => { setFilterOwner(''); setFilterProject(''); }}
              className="text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>

        {/* Scrollable table */}
        <div className="overflow-x-auto rounded-2xl border border-green-100 shadow-sm bg-white">
          <table className="w-full border-collapse" style={{ minWidth: '1100px' }}>
            <thead>
              <tr className="bg-green-50 border-b border-green-100">
                <th className="sticky left-0 z-10 bg-green-50 text-left py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap min-w-[140px]">
                  Client Name
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap min-w-[130px]">
                  Project
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap min-w-[120px]">
                  Owner
                </th>
                {MONTHS.map(m => (
                  <th
                    key={m.key}
                    className="text-center py-3 px-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap w-14"
                  >
                    {m.label}
                  </th>
                ))}
                <th className="text-left py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap min-w-[140px]">
                  URL
                </th>
                <th className="py-3 px-4 w-16" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`border-b border-green-50 last:border-0 group transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-green-50/30'} hover:bg-green-50`}
                >
                  {/* Client */}
                  <td className="sticky left-0 z-10 py-3 px-4 bg-inherit">
                    <span className="text-sm font-bold text-gray-900 whitespace-nowrap">{row.client}</span>
                  </td>

                  {/* Project */}
                  <td className="py-3 px-4">
                    <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">{row.project || '—'}</span>
                  </td>

                  {/* Owner */}
                  <td className="py-3 px-4">
                    <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">{row.owner || '—'}</span>
                  </td>

                  {/* Month cells */}
                  {MONTHS.map(m => {
                    const done = row.months?.[m.key] ?? false;
                    return (
                      <td key={m.key} className="py-2 px-1 text-center">
                        <button
                          onClick={() => toggleMonth(row.id, m.key)}
                          title={done ? `${m.label}: done — click to undo` : `${m.label}: click to mark done`}
                          className={`w-8 h-8 mx-auto flex items-center justify-center rounded-lg border transition-all ${
                            done
                              ? 'bg-green-500 border-green-500 text-white shadow-sm shadow-green-200'
                              : 'bg-white border-gray-200 text-transparent hover:border-green-300 hover:bg-green-50'
                          }`}
                        >
                          <Check size={13} />
                        </button>
                      </td>
                    );
                  })}

                  {/* URL */}
                  <td className="py-3 px-4 max-w-[180px]">
                    {row.url ? (
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-semibold truncate"
                        title={row.url}
                      >
                        <ExternalLink size={11} className="flex-shrink-0" />
                        <span className="truncate">{row.url.replace(/^https?:\/\//, '')}</span>
                      </a>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setModal(row)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-100 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setToDelete(row)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3 + 12 + 2} className="py-16 text-center text-gray-400 text-sm font-semibold">
                    No clients match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {modal !== null && (
        <CitationModal
          initial={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {toDelete && (
        <DeleteConfirm
          row={toDelete}
          onConfirm={handleDelete}
          onClose={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
