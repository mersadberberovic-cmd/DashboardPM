import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import { getClient, projects, tasks, getMember } from '../data/mockData';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function Calendar() {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const { year, month } = current;
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDayOfMonth(year, month);

  const prev = () => setCurrent(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 });
  const next = () => setCurrent(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 });

  // Collect events (project deadlines + task due dates)
  const events = {};
  projects.forEach(p => {
    const d = new Date(p.dueDate);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!events[day]) events[day] = [];
      const client = getClient(p.client);
      events[day].push({ type: 'project', label: p.name, color: client?.color || '#6366f1' });
    }
  });
  tasks.forEach(t => {
    if (!t.dueDate) return;
    const d = new Date(t.dueDate);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!events[day]) events[day] = [];
      events[day].push({ type: 'task', label: t.title, color: '#94a3b8' });
    }
  });

  // Build calendar grid
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  // Upcoming events list (all months)
  const upcoming = [
    ...projects.map(p => ({ ...p, type: 'project', date: new Date(p.dueDate), color: getClient(p.client)?.color || '#6366f1', title: p.name })),
    ...tasks.filter(t => t.dueDate).map(t => ({ ...t, type: 'task', date: new Date(t.dueDate), color: '#94a3b8', title: t.title })),
  ]
    .filter(e => e.date >= today)
    .sort((a, b) => a.date - b.date)
    .slice(0, 8);

  return (
    <div className="flex flex-col flex-1">
      <Header title="Calendar" subtitle="Project deadlines and task due dates" />

      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-800 font-semibold text-lg">{MONTHS[month]} {year}</h2>
              <div className="flex items-center gap-1">
                <button onClick={prev} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setCurrent({ year: today.getFullYear(), month: today.getMonth() })}
                  className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Today
                </button>
                <button onClick={next} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(day => (
                <div key={day} className="text-center text-xs font-semibold text-slate-400 py-1">{day}</div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => (
                <div
                  key={i}
                  className={`min-h-[76px] rounded-lg p-1.5 ${
                    day
                      ? isToday(day)
                        ? 'bg-indigo-600'
                        : 'hover:bg-slate-50 border border-slate-100'
                      : ''
                  }`}
                >
                  {day && (
                    <>
                      <p className={`text-xs font-semibold mb-1 text-right ${isToday(day) ? 'text-white' : 'text-slate-600'}`}>
                        {day}
                      </p>
                      <div className="space-y-0.5">
                        {(events[day] || []).slice(0, 2).map((ev, j) => (
                          <div
                            key={j}
                            className="text-[9px] font-medium text-white rounded px-1 py-0.5 truncate leading-tight"
                            style={{ backgroundColor: ev.color + (ev.type === 'task' ? 'cc' : '') }}
                            title={ev.label}
                          >
                            {ev.label}
                          </div>
                        ))}
                        {(events[day] || []).length > 2 && (
                          <p className={`text-[9px] font-medium ${isToday(day) ? 'text-indigo-200' : 'text-slate-400'}`}>
                            +{(events[day] || []).length - 2} more
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-slate-800 font-semibold mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {upcoming.map((ev, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: ev.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">{ev.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {ev.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {ev.type === 'project' && ' · Deadline'}
                        {ev.type === 'task'    && ' · Task due'}
                      </p>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${
                      ev.type === 'project' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {ev.type === 'project' ? 'Project' : 'Task'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wide">Legend</h3>
              <div className="space-y-2">
                {[
                  { color: '#6366f1', label: 'NovaTech' },
                  { color: '#10b981', label: 'GreenLeaf' },
                  { color: '#f59e0b', label: 'Stellar' },
                  { color: '#ef4444', label: 'Apex' },
                  { color: '#3b82f6', label: 'CityScape' },
                  { color: '#94a3b8', label: 'Tasks' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-slate-500">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
