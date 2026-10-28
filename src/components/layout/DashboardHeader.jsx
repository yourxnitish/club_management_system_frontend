import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export function DashboardHeader({ onMobileMenuToggle, title, subtitle }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left Title / Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded text-ink-secondary hover:text-navy-900"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          {title && <h1 className="font-serif text-lg font-bold text-navy-900 leading-tight">{title}</h1>}
          {subtitle && <p className="text-xs text-ink-secondary hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      {/* Right User Bar */}
      <div className="flex items-center gap-4">
        {/* User quick pill */}
        <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-border">
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-semibold text-navy-900">{user?.fullName}</span>
            <span className="block text-[11px] text-ink-secondary">{user?.email}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-navy-900 text-gold flex items-center justify-center font-serif text-sm font-bold border border-gold/40">
            {user?.firstName?.[0] || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
