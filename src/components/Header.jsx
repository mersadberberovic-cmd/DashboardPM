import { Bell, Search, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Header({ title, subtitle, action }) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-green-100 flex items-center px-6 gap-4 sticky top-0 z-20">
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-gray-900 leading-tight tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 font-medium mt-0.5">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className={`hidden md:flex items-center gap-2 bg-green-50 border rounded-xl px-3 py-2 transition-all ${
        searchFocused ? 'border-green-400 bg-white ring-2 ring-green-100' : 'border-green-100'
      }`}>
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search projects, tasks…"
          className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none w-44 font-medium"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Bell */}
      <button className="relative p-2 rounded-xl hover:bg-green-50 text-gray-400 hover:text-gray-700 transition-colors">
        <Bell size={17} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full" />
      </button>

      {/* CTA */}
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm shadow-green-200"
        >
          <Plus size={15} />
          {action.label}
        </button>
      )}
    </header>
  );
}
