import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import { getClient, projects, tasks } from '../data/mockData';

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m)    { return new Date(y, m, 1).getDay(); }

export default function Calendar() {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const { year, month } = current;

  const prev = () => setCurrent(c => c.month === 0  ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 });
  const next = () => setCurrent(c => c.month === 11 ? { year: c.year + 1, month: 0  } : { year: c.year, month: c.month + 1 });

  // Build events map
  const events = {};
  const add = (date, entry) => {
    const d = new Date(date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!events[day]) events[day] = [];
      events[day].push(entry);
    }
  };
  projects.forEach(p => add(p.dueDate, { type: 'project', label: p.name, color: getClient(p.client)?.color || '#22c55e' }));
  tasks.forEach(t => { if (t.dueDate) add(t.dueDate, { type: 'task', label: t.title, color: '#22c55e' }); });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDay(year, month);
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const isToday = d => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const upcoming = [
    ...projects.map(p => ({ label: p.name, date: new Date(p.dueDate), type: 'project', color: getClient(p.client)?.color || '#22c55e' })),
    ...tasks.filter(t => t.dueDate).map(t => ({ label: t.title, date: new Date(t.dueDate), type: 'task', color: '#22c55e' })),
  ].filter(e => e.date >= today).sort((a, b) => a.date - b.date).slice(0, 8);

  return (
    <div className="flex flex-col flex-1">
      <Header title="Calendar" subtitle="Project deadlines and task due dates" />

      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-green-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-gray-900 font-bold">{MONTHS[month]} {year}</h2>
              <div className="flex items-center gap-1">
                <button onClick={prev} className="p-1.5 hover:bg-green-50 rounded-xl transition-colors text-gray-400 hover:text-gray-700">
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setCurrent({ year: today.getFullYear(), month: today.getMonth() })}
                  className="px-3 py-1 text-xs font-bold text-gray-600 hover:bg-green-50 rounded-xl transition-colors border border-green-100"
                >
                  Today
                </button>
                <button onClick={next} className="p-1.5 hover:bg-green-50 rounded-xl transition-colors text-gray-400 hover:text-gray-700">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest py-1">{d}</div>
              ))}
            </div>

            {/* Cells */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => (
                <div
                  key={i}
                  className={`min-h-[72px] rounded-xl p-1.5 transition-colors ${
                    day
                      ? isToday(day)
                        ? 'bg-green-500'
                        : 'hover:bg-green-50 border border-transparent hover:border-green-100'
                      : ''
                  }`}
                >
                  {day && (
                    <>
                      <p className={`text-xs font-bold mb-1 text-right ${isToday(day) ? 'text-white' : 'text-gray-600'}`}>
                        {day}
                      </p>
                      <div className="space-y-0.5">
                        {(events[day] || []).slice(0, 2).map((ev, j) => (
                          <div
                            key={j}
                            className="text-[9px] font-bold text-white rounded-md px-1 py-0.5 truncate leading-tight"
                            style={{ backgroundColor: ev.type === 'project' ? ev.color : '#86efac', color: ev.type === 'task' ? '#166534' : 'white' }}
                            title={ev.label}
                          >
                            {ev.label}
                          </div>
                        ))}
                        {(events[day] || []).length > 2 && (
                          <p className={`text-[9px] font-bold ${isToday(day) ? 'text-green-100' : 'text-gray-400'}`}>
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

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
              <h3 className="text-gray-900 font-bold text-sm mb-4">Upcoming Events</h3>
              {upcoming.length === 0 && <p className="text-xs text-gray-400 font-semibold">No upcoming events.</p>}
              <div className="space-y-3">
                {upcoming.map((ev, i) => (
                  <div key={i} className="flex gap-3 items-start p-2.5 rounded-xl hover:bg-green-50 transition-colors">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: ev.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{ev.label}</p>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                        {ev.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {ev.type === 'project' ? ' · Deadline' : ' · Task due'}
                      </p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                      ev.type === 'project'
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}>
                      {ev.type === 'project' ? 'Project' : 'Task'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-2xl border border-green-100 p-4 shadow-sm">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Legend</h3>
              <div className="space-y-2">
                {[
                  { color: '#6366f1', label: 'NovaTech' },
                  { color: '#10b981', label: 'GreenLeaf' },
                  { color: '#f59e0b', label: 'Stellar' },
                  { color: '#ef4444', label: 'Apex' },
                  { color: '#3b82f6', label: 'CityScape' },
                  { color: '#86efac', label: 'Tasks', textDark: true },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-500 font-semibold">{item.label}</span>
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
