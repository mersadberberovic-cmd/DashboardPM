import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users,
  Calendar, BarChart2, Settings, ChevronRight, Zap,
} from 'lucide-react';
import { currentUser } from '../data/mockData';

const navItems = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects',  icon: FolderKanban,    label: 'Projects' },
  { to: '/tasks',     icon: CheckSquare,     label: 'Tasks' },
  { to: '/team',      icon: Users,           label: 'Team' },
  { to: '/calendar',  icon: Calendar,        label: 'Calendar' },
  { to: '/reports',   icon: BarChart2,       label: 'Reports' },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-slate-900 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-700/60">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">AgencyHQ</p>
          <p className="text-slate-400 text-xs">Project Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">Menu</p>
        <ul className="space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User */}
      <div className="border-t border-slate-700/60 p-3">
        <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-800 transition-colors group">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {currentUser.avatar}
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{currentUser.name}</p>
            <p className="text-slate-400 text-xs truncate">{currentUser.role}</p>
          </div>
          <ChevronRight size={14} className="text-slate-500 group-hover:text-slate-300 flex-shrink-0" />
        </button>
      </div>
    </aside>
  );
}
