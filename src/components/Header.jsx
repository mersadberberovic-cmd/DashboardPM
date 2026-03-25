import { Bell, Search, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Header({ title, subtitle, action }) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-20">
      {/* Title area */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-slate-800 leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className={`hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 transition-all ${searchFocused ? 'ring-2 ring-indigo-400 bg-white' : ''}`}>
        <Search size={15} className="text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search projects, tasks…"
          className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-48"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>
        {action && (
          <button
            onClick={action.onClick}
            className="flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            {action.label}
          </button>
        )}
      </div>
    </header>
  );
}
