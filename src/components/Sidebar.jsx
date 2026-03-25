import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users,
  Calendar, BarChart2, ChevronRight,
} from 'lucide-react';
import { currentUser } from '../data/mockData';

const navItems = [
  { to: '/',         icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban,    label: 'Projects'  },
  { to: '/tasks',    icon: CheckSquare,     label: 'Tasks'     },
  { to: '/team',     icon: Users,           label: 'Team'      },
  { to: '/calendar', icon: Calendar,        label: 'Calendar'  },
  { to: '/reports',  icon: BarChart2,       label: 'Reports'   },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-white border-r border-green-100 flex flex-col z-30">

      {/* Logo area */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-green-100">
        {/* Logo placeholder — swap this <div> for an <img> when you have your logo */}
        <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
          {/* Replace contents with: <img src="/logo.svg" alt="Logo" className="w-8 h-8" /> */}
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <p className="text-gray-900 font-bold text-sm leading-tight tracking-wide">AgencyHQ</p>
          <p className="text-green-600 text-[10px] font-medium tracking-wider uppercase">Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-5 px-3">
        <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">Menu</p>
        <ul className="space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-green-500 text-white shadow-sm shadow-green-200'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-green-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={17} className={isActive ? 'text-white' : 'text-gray-400'} />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User */}
      <div className="border-t border-green-100 p-3">
        <button className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-green-50 transition-colors group">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {currentUser.avatar}
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-gray-900 text-sm font-semibold truncate">{currentUser.name}</p>
            <p className="text-gray-400 text-xs truncate">{currentUser.role}</p>
          </div>
          <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0" />
        </button>
      </div>
    </aside>
  );
}
